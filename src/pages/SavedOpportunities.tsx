import { Bookmark, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import OpportunityCard from '../components/OpportunityCard'
import { opportunities } from '../data/opportunities'

interface SavedOpportunitiesProps {
  bookmarks: string[]
  onToggleBookmark: (id: string) => void
}

export default function SavedOpportunities({ bookmarks, onToggleBookmark }: SavedOpportunitiesProps) {
  const savedOpportunities = opportunities.filter((opportunity) => bookmarks.includes(opportunity.id))

  return (
    <main className="page-shell saved-page">
      <div className="page-heading"><div className="eyebrow"><Bookmark size={13} /> YOUR SHORTLIST</div><h1>Saved for <span>later.</span></h1><p>A little collection of possibilities worth coming back to.</p></div>
      {savedOpportunities.length ? (
        <><div className="saved-count">{savedOpportunities.length} {savedOpportunities.length === 1 ? 'opportunity' : 'opportunities'} saved</div><div className="opportunity-grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">{savedOpportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} isBookmarked onToggleBookmark={onToggleBookmark} />)}</div></>
      ) : (
        <div className="empty-state saved-empty"><span className="empty-icon"><Bookmark size={22} /></span><h3>Your shortlist is a blank page.</h3><p>When something sparks your interest, save it here and pick up where you left off.</p><Link to="/#opportunities" className="button button-dark">Explore opportunities <Compass size={16} /></Link></div>
      )}
      <div className="sample-notice"><span className="notice-mark">i</span><p><strong>Sample listings, always.</strong> Everything saved here is fictional demonstration data, not a real or active opportunity.</p></div>
    </main>
  )
}