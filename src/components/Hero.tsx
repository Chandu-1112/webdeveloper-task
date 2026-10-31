import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

interface HeroProps {
  search: string
  onSearchChange: (value: string) => void
  userName?: string
}

export default function Hero({ search, onSearchChange, userName }: HeroProps) {
  return (
    <section className="hero-shell">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><Sparkles size={14} />{userName ? `WELCOME BACK, ${userName}` : 'YOUR NEXT CHAPTER STARTS HERE'}</div>
          <h1>Discover Opportunities.<br /><span>Build Your Future.</span></h1>
          <p>Find internships, scholarships, hackathons, and the people who can help you get there.</p>
          <div className="hero-actions">
            <Link to="/#opportunities" className="button button-lime">Explore opportunities <ArrowRight size={17} /></Link>
            <a href="#opportunities" className="hero-text-link">See what’s out there <ArrowDown size={15} /></a>
          </div>
          <div className="hero-search-wrap">
            <SearchBar value={search} onChange={onSearchChange} variant="hero" />
            <span className="hero-search-hint">Try “design”, “remote”, or an organization</span>
          </div>
        </div>
        <div className="hero-art" aria-label="A snapshot of student opportunities" role="img">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-art-label"><span className="live-dot" /> A little closer to what’s next</div>
          <div className="hero-note note-top"><span className="note-icon note-sun">✳</span><span><b>Room to explore</b><small>Ideas welcome here</small></span><ArrowUpRight size={16} /></div>
          <div className="hero-center-mark"><CompassIllustration /></div>
          <div className="hero-note note-bottom"><span className="note-number">08</span><span><b>Fresh possibilities</b><small>Ready when you are</small></span><ArrowRight size={16} /></div>
          <span className="sparkle sparkle-a">✳</span><span className="sparkle sparkle-b">✦</span>
        </div>
        <a className="hero-scroll" href="#opportunities"><span>START EXPLORING</span><ArrowDown size={14} /></a>
      </div>
    </section>
  )
}

function CompassIllustration() {
  return (
    <div className="compass-illustration">
      <div className="compass-ring"><div className="compass-inner"><span className="compass-needle" /><span className="compass-dot" /></div></div>
      <span className="compass-north">N</span>
    </div>
  )
}