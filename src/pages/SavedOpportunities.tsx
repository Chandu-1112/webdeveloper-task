import { Bookmark, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import OpportunityCard from '../components/OpportunityCard'
import type { Opportunity } from '../types/opportunity'

interface SavedOpportunitiesProps {
  opportunities: Opportunity[]
  bookmarks: string[]
  isAuthenticated: boolean
  loading: boolean
  onToggleBookmark: (id: string) => void
}

export default function SavedOpportunities({ opportunities, bookmarks, isAuthenticated, loading, onToggleBookmark }: SavedOpportunitiesProps) {
  const savedOpportunities = opportunities.filter((opportunity) => bookmarks.includes(opportunity.id))

  return (
    <main className="page-shell saved-page">
      <div className="page-heading"><div className="eyebrow"><Bookmark size={13} /> YOUR SHORTLIST</div><h1>Saved for <span>later.</span></h1><p>A little collection of possibilities worth coming back to.</p></div>
      {loading ? (
        <div className="empty-state saved-empty" role="status"><p>Loading your saved opportunities…</p></div>
      ) : !isAuthenticated ? (
        <div className="empty-state saved-empty"><span className="empty-icon"><Bookmark size={22} /></span><h3>Sign in to keep your shortlist.</h3><p>Your bookmarks are saved to your account database and follow you between devices.</p><Link to="/login" state={{ from: '/saved', intent: 'view-saved' }} className="button button-dark">Log in to continue <Compass size={16} /></Link></div>
      ) : savedOpportunities.length ? (
        <><div className="saved-count">{savedOpportunities.length} {savedOpportunities.length === 1 ? 'opportunity' : 'opportunities'} saved</div><div className="opportunity-grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">{savedOpportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} isBookmarked onToggleBookmark={onToggleBookmark} />)}</div></>
      ) : (
        <div className="empty-state saved-empty"><span className="empty-icon"><Bookmark size={22} /></span><h3>Your shortlist is a blank page.</h3><p>When something sparks your interest, save it here and pick up where you left off.</p><Link to="/#opportunities" className="button button-dark">Explore opportunities <Compass size={16} /></Link></div>
      )}
      {savedOpportunities.some((opportunity) => opportunity.isDemo !== false) && <div className="sample-notice"><span className="notice-mark">i</span><p><strong>Demo listings are fictional.</strong> All bookmarks on this page are stored in your account database.</p></div>}
    </main>
  )
}