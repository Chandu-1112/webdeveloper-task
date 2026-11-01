import { useMemo, useState } from 'react'
import { ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react'
import CategoryFilter, { type CategoryChoice } from '../components/CategoryFilter'
import Hero from '../components/Hero'
import OpportunityCard from '../components/OpportunityCard'
import type { Opportunity } from '../types/opportunity'

interface HomeProps {
  opportunities: Opportunity[]
  bookmarks: string[]
  onToggleBookmark: (id: string) => void
  apiError: string
  eventsLoading: boolean
  userName?: string
}

export default function Home({ opportunities, bookmarks, onToggleBookmark, apiError, eventsLoading, userName }: HomeProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryChoice>('All')
  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return opportunities.filter((opportunity) => {
      const matchesQuery = !query || `${opportunity.title} ${opportunity.organization}`.toLocaleLowerCase().includes(query)
      const matchesCategory = category === 'All' || opportunity.category === category
      return matchesQuery && matchesCategory
    })
  }, [search, category])
  const hasFilters = search.trim().length > 0 || category !== 'All'
  const hasCommunityListings = opportunities.some((opportunity) => opportunity.isDemo === false)

  return (
    <>
      <Hero search={search} onSearchChange={setSearch} userName={userName} />
      <main id="opportunities" className="discovery-section">
        <div className="section-heading">
          <div><div className="eyebrow"><Sparkles size={13} /> THE OPPORTUNITY BOARD</div><h2>Find your kind of <span>next.</span></h2><p>Good things start with a first click. See what catches your eye.</p></div>
          <div className="opportunity-count"><span className="count-number">{filteredOpportunities.length.toString().padStart(2, '0')}</span><span>opportunities<br />to explore</span></div>
        </div>
        <div className="filter-bar">
          <div className="filter-label"><SlidersHorizontal size={15} /><span>FILTER BY</span></div>
          <CategoryFilter selected={category} onChange={setCategory} />
          {hasFilters && <button className="clear-filters" onClick={() => { setSearch(''); setCategory('All') }}>Clear filters <span>×</span></button>}
        </div>
        {eventsLoading && <p className="api-status" role="status">Loading public community listings…</p>}
        {apiError && <p className="api-status" role="status">Community listings are temporarily unavailable. Demo opportunities are still shown. <span>{apiError}</span></p>}
        {filteredOpportunities.length > 0 ? (
          <div className="opportunity-grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} isBookmarked={bookmarks.includes(opportunity.id)} onToggleBookmark={onToggleBookmark} />)}
          </div>
        ) : (
          <div className="empty-state"><span className="empty-icon"><SlidersHorizontal size={22} /></span><h3>No opportunities found</h3><p>Try a different search or clear your filters to see all the possibilities.</p><button className="button button-dark" onClick={() => { setSearch(''); setCategory('All') }}>Clear all filters <ArrowRight size={16} /></button></div>
        )}
        <div className="sample-notice"><span className="notice-mark">i</span><p><strong>{hasCommunityListings ? 'About these listings' : 'A note about this board'}</strong> {hasCommunityListings ? 'Demo listings are fictional. Community listings are shared by OpportunityHub members and have not been independently verified.' : 'Every listing is invented sample data for demonstration. None of these opportunities are real or currently accepting applications.'}</p></div>
        <div className="more-nudge"><span>There’s no one right path. Just your next one.</span><a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ArrowRight size={15} /></a></div>
      </main>
    </>
  )
}