import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="footer-brand"><Compass size={17} /> opportunity<span>hub</span></Link>
      <p>Made for the curious, the builders, and the almost-ready.</p>
      <span className="footer-note">Demo opportunities and community listings · Verify community details</span>
    </footer>
  )
}