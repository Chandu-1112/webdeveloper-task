import { ArrowUpRight, Bookmark, BookmarkCheck, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Opportunity } from '../types/opportunity'

interface OpportunityCardProps {
  opportunity: Opportunity
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
}

export default function OpportunityCard({ opportunity, isBookmarked, onToggleBookmark }: OpportunityCardProps) {
  const deadline = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${opportunity.deadline}T12:00:00`))

  return (
    <article className="opportunity-card">
      <div className="card-topline">
        <span className={`category-tag category-${opportunity.category.toLowerCase()}`}>{opportunity.category}</span>
        <button
          type="button"
          className={`bookmark-button${isBookmarked ? ' is-bookmarked' : ''}`}
          aria-label={isBookmarked ? `Remove ${opportunity.title} from saved opportunities` : `Save ${opportunity.title}`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(opportunity.id)}
        >
          {isBookmarked ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
        </button>
      </div>
      <p className="card-organization">{opportunity.organization}</p>
      <h3><Link to={`/opportunities/${opportunity.id}`}>{opportunity.title}</Link></h3>
      <p className="card-creator">Added by {opportunity.creatorName ?? (opportunity.isDemo === false ? 'a community member' : 'OpportunityHub')}</p>
      <p className="card-description">{opportunity.description}</p>
      <div className="card-meta"><span><MapPin size={14} />{opportunity.location}</span><span className="deadline-meta">Apply by {deadline}</span></div>
      <div className="card-bottom">
        <span className="sample-stamp"><span />{opportunity.isDemo === false ? 'COMMUNITY LISTING' : 'SAMPLE DATA'}</span>
        <Link to={`/opportunities/${opportunity.id}`} className="card-link">View details <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  )
}