import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import DownloadBanner from './components/DownloadBanner'
import Footer from './components/Footer'
import { opportunities as demoOpportunities } from './data/opportunities'
import { useAuth } from './hooks/useAuth'
import About from './pages/About'
import CreateOpportunity from './pages/CreateOpportunity'
import Home from './pages/Home'
import Login from './pages/Login'
import OpportunityDetails from './pages/OpportunityDetails'
import SavedOpportunities from './pages/SavedOpportunities'
import { api, type EventPayload } from './services/api'
import type { Opportunity } from './types/opportunity'

const LEGACY_BOOKMARK_KEY = 'opportunityhub-bookmarks'

function readLegacyBookmarkIds(): string[] {
  try {
    const stored = localStorage.getItem(LEGACY_BOOKMARK_KEY)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export default function App() {
  const { token, user, loading: authLoading, login, register, logout } = useAuth()
  const [apiEvents, setApiEvents] = useState<Opportunity[]>([])
  const [serverBookmarks, setServerBookmarks] = useState<Opportunity[]>([])
  const [bookmarksLoading, setBookmarksLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [bannerVisible, setBannerVisible] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    void api.listEvents()
      .then((events) => {
        if (active) {
          setApiEvents(events.map((event) => ({ ...event, isDemo: false })))
          setApiError('')
        }
      })
      .catch((error: unknown) => {
        if (active) setApiError(error instanceof Error ? error.message : 'The API is unavailable.')
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!token) {
      setServerBookmarks([])
      setBookmarksLoading(false)
      return
    }
    let active = true
    setBookmarksLoading(true)
    const legacyIds = readLegacyBookmarkIds()
    void (async () => {
      const current = await api.listBookmarks(token)
      const existingIds = new Set(current.map((event) => event.id))
      for (const event of demoOpportunities) {
        if (legacyIds.includes(event.id) && !existingIds.has(event.id)) {
          await api.addBookmark(event, token)
        }
      }
      if (legacyIds.length) localStorage.removeItem(LEGACY_BOOKMARK_KEY)
      return api.listBookmarks(token)
    })()
      .then((events) => { if (active) setServerBookmarks(events) })
      .catch((error: unknown) => {
        if (active) setApiError(error instanceof Error ? error.message : 'Unable to load saved opportunities.')
      })
      .finally(() => { if (active) setBookmarksLoading(false) })
    return () => { active = false }
  }, [token])

  const opportunities = [
    ...demoOpportunities.map((event) => ({ ...event, isDemo: true })),
    ...apiEvents,
  ]
  const bookmarks = serverBookmarks.map((event) => event.id)

  async function toggleOpportunityBookmark(id: string) {
    const event = opportunities.find((item) => item.id === id)
    if (!event) {
      return
    }
    if (!token) {
      navigate('/login', { state: { from: location.pathname, intent: 'save' } })
      return
    }
    try {
      if (serverBookmarks.some((saved) => saved.id === id)) await api.removeBookmark(id, token)
      else await api.addBookmark(event, token)
      setServerBookmarks(await api.listBookmarks(token))
      setApiError('')
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to update this bookmark.')
    }
  }

  async function createOpportunity(payload: EventPayload) {
    if (!token) throw new Error('Please log in to publish an opportunity.')
    const created = { ...await api.createEvent(payload, token), isDemo: false }
    setApiEvents((current) => [created, ...current])
    return created
  }

  return (
    <div className={`app${bannerVisible ? ' has-download-banner' : ''}`} id="top">
      <Routes>
        <Route path="/" element={<Home opportunities={opportunities} bookmarks={bookmarks} onToggleBookmark={toggleOpportunityBookmark} apiError={apiError} userName={user?.fullName || undefined} onLogout={logout} />} />
        <Route path="/saved" element={<SavedOpportunities opportunities={opportunities} bookmarks={bookmarks} isAuthenticated={Boolean(user)} loading={bookmarksLoading} onToggleBookmark={toggleOpportunityBookmark} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onLogin={login} onRegister={register} />} />
        <Route path="/events/new" element={authLoading ? <main className="page-shell"><p role="status">Checking your account…</p></main> : user ? <CreateOpportunity onCreate={createOpportunity} /> : <Navigate to="/login" replace state={{ from: location.pathname, intent: 'add-event' }} />} />
        <Route path="/opportunities/:id" element={<OpportunityDetails key={location.pathname} opportunities={opportunities} bookmarks={bookmarks} onToggleBookmark={toggleOpportunityBookmark} isAuthenticated={Boolean(user)} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      {bannerVisible && <DownloadBanner onDismiss={() => setBannerVisible(false)} />}
    </div>
  )
}