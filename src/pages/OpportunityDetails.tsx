import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Bookmark, BookmarkCheck, Check, MapPin } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { Opportunity } from '../types/opportunity'

interface OpportunityDetailsProps {
  opportunities: Opportunity[]
  bookmarks: string[]
  onToggleBookmark: (id: string) => void
  isAuthenticated: boolean
}

export default function OpportunityDetails({ opportunities, bookmarks, onToggleBookmark, isAuthenticated }: OpportunityDetailsProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const opportunity = opportunities.find((item) => item.id === id)
  const [demoNotice, setDemoNotice] = useState(Boolean(location.state?.applicationReady))
  const isDemo = opportunity?.isDemo !== false

  if (!opportunity) {
    return <main className="detail-page"><div className="not-found"><span className="eyebrow">NOT ON THIS BOARD</span><h1>We couldn’t find that opportunity.</h1><p>It may have moved, or the link may be incomplete.</p><Link className="button button-dark" to="/#opportunities"><ArrowLeft size={16} /> Back to opportunities</Link></div></main>
  }

  const saved = bookmarks.includes(opportunity.id)
  const deadline = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(opportunity.deadline))

  function apply() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname, intent: 'apply' } })
      return
    }
    setDemoNotice(true)
  }

  return (
    <main className="detail-page">
      <div className="detail-content">
        <button className="back-link" type="button" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to opportunities</button>
        <div className="detail-layout">
          <article className="detail-main">
            <div className="detail-overline"><span className={`category-tag category-${opportunity.category.toLowerCase()}`}>{opportunity.category}</span><span className="sample-stamp"><span />{isDemo ? 'SAMPLE DATA' : 'COMMUNITY LISTING'}</span></div>
            <p className="detail-org">{opportunity.organization}</p>
            <h1>{opportunity.title}</h1>
            <p className="detail-creator">Added by {opportunity.creatorName ?? (isDemo ? 'OpportunityHub' : 'a community member')}</p>
            <div className="detail-location"><MapPin size={16} /> {opportunity.location}</div>
            <div className="detail-rule" />
            <section className="detail-section"><span className="section-index">01</span><div><h2>About this opportunity</h2><p>{opportunity.fullDescription}</p></div></section>
            <section className="detail-section"><span className="section-index">02</span><div><h2>Who can apply</h2><ul className="detail-list">{opportunity.eligibility.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div></section>
            {opportunity.skills && <section className="detail-section"><span className="section-index">03</span><div><h2>Skills you might use</h2><div className="skill-list">{opportunity.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></section>}
            <section className="detail-section"><span className="section-index">04</span><div><h2>Application instructions</h2><p>{opportunity.instructions}</p></div></section>
            {demoNotice && <div className="demo-confirmation" role="status"><Check size={17} /><span>{isDemo ? 'This is a demo listing. No application link is available, and no information has been submitted.' : 'No application is submitted on OpportunityHub. Follow the instructions above to contact the organization.'}</span></div>}
          </article>
          <aside className="detail-sidebar">
            <div className="sidebar-label">AT A GLANCE</div>
            <div className="sidebar-item"><span>Application deadline</span><strong>{deadline}</strong>{isDemo && <small>Sample date only</small>}</div>
            <div className="sidebar-item"><span>Location</span><strong>{opportunity.location}</strong></div>
            <button type="button" className="button button-dark apply-button" onClick={apply}>{isAuthenticated ? 'Continue to application' : 'Log in to apply'} <ArrowUpRight size={17} /></button>
            <button type="button" className={`save-detail-button${saved ? ' is-bookmarked' : ''}`} aria-pressed={saved} onClick={() => onToggleBookmark(opportunity.id)}>{saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}{saved ? 'Saved for later' : 'Save opportunity'}</button>
            <div className="sidebar-disclaimer"><span>i</span><p>{isDemo ? 'This is fictional sample data, not a real opening. No application is being accepted.' : 'Community-submitted listing. Verify the details with the organization before sharing personal information.'}</p></div>
          </aside>
        </div>
      </div>
    </main>
  )
}