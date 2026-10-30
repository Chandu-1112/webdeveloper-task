import { ArrowRight, Compass, Layers3, Search, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  { icon: Search, number: '01', title: 'Find your focus', text: 'Search by role or organization, then narrow things down by opportunity type.' },
  { icon: Layers3, number: '02', title: 'Explore the details', text: 'Get the useful context in one place: eligibility, location, skills, and next steps.' },
  { icon: Compass, number: '03', title: 'Keep moving', text: 'Save interesting finds and build a shortlist that reflects where you want to go.' },
]

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero"><div className="about-hero-inner"><div className="eyebrow"><Sparkles size={13} /> A BETTER STARTING POINT</div><h1>Opportunity has<br />a way of <span>finding you.</span></h1><p>We built OpportunityHub to make the search feel a little less like searching for a needle in a hundred haystacks.</p><Link to="/#opportunities" className="button button-lime">Explore the board <ArrowRight size={16} /></Link><div className="about-orbit" aria-hidden="true"><div /><span>O</span></div></div></section>
      <section className="about-purpose"><div className="about-side-label">WHY WE’RE HERE</div><div><h2>More room for the<br /><span>good kind of surprise.</span></h2><p>Students hear about opportunities through a patchwork of emails, group chats, and late-night tabs. OpportunityHub imagines a clearer place to discover the next thing: an internship that fits, a room full of builders, or a skill you didn’t know you wanted to learn.</p><p>Whether you’re just starting out or finding your next direction, the goal is simple: make it easier to notice what’s possible.</p></div></section>
      <section className="opportunity-types"><div className="types-header"><div className="eyebrow">A FEW WAYS FORWARD</div><h2>Different paths.<br /><span>Same open door.</span></h2></div><div className="type-list"><div><span className="type-number">01</span><strong>Internships</strong><span>Try your learning in the real world.</span></div><div><span className="type-number">02</span><strong>Hackathons</strong><span>Make something with new people.</span></div><div><span className="type-number">03</span><strong>Scholarships</strong><span>Find support for what’s ahead.</span></div><div><span className="type-number">04</span><strong>Workshops</strong><span>Pick up a skill, one session at a time.</span></div><div><span className="type-number">05</span><strong>Competitions</strong><span>Give your idea a place to land.</span></div></div></section>
      <section className="how-it-works"><div className="how-heading"><div className="eyebrow">THOUGHTFULLY, NOT COMPLICATED</div><h2>Three steps.<br />Your own <span>direction.</span></h2></div><div className="steps-grid">{steps.map(({ icon: Icon, number, title, text }) => <article className="step-item" key={number}><div className="step-top"><span>{number}</span><Icon size={19} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="about-data-note"><span className="notice-mark">i</span><p><strong>About this demonstration</strong> The listings on OpportunityHub are fictional sample data created to show how the product could work. They are not real opportunities and are not currently open for applications.</p></section>
    </main>
  )
}