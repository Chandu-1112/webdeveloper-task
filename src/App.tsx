import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import DownloadBanner from './components/DownloadBanner'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import Home from './pages/Home'
import OpportunityDetails from './pages/OpportunityDetails'
import SavedOpportunities from './pages/SavedOpportunities'
import { useBookmarks } from './hooks/useBookmarks'

export default function App() {
  const { bookmarks, toggleBookmark } = useBookmarks()
  const [bannerVisible, setBannerVisible] = useState(true)
  const location = useLocation()

  return (
    <div className={`app${bannerVisible ? ' has-download-banner' : ''}`} id="top">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />} />
        <Route path="/saved" element={<SavedOpportunities bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />} />
        <Route path="/about" element={<About />} />
        <Route path="/opportunities/:id" element={<OpportunityDetails key={location.pathname} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      {bannerVisible && <DownloadBanner onDismiss={() => setBannerVisible(false)} />}
    </div>
  )
}