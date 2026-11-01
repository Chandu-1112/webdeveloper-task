import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bookmark, Compass, House, ListTodo, LogIn, LogOut, Menu, Plus, UserRound, X } from 'lucide-react'

interface NavbarProps {
  user: { email: string; fullName: string } | null
  onLogout: () => void
}

const navItems = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/#opportunities', label: 'Explore', icon: Compass, end: false },
  { to: '/saved', label: 'Saved', icon: Bookmark, end: false },
  { to: '/about', label: 'About', icon: null, end: false },
]

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="OpportunityHub home" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><Compass size={21} strokeWidth={2.2} /></span>
          <span>opportunity<span className="brand-accent">hub</span></span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {Icon && <Icon size={16} strokeWidth={1.9} />}
              {label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/events/manage"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <ListTodo size={16} strokeWidth={1.9} />
              Manage events
            </NavLink>
          )}
          {user ? (
            <div className="nav-account">
              <span className="nav-user" title={user.email}><UserRound size={14} />{user.fullName || user.email}</span>
              <button className="nav-logout" type="button" onClick={() => { onLogout(); setMenuOpen(false) }} aria-label="Log out"><LogOut size={15} /><span>Log out</span></button>
            </div>
          ) : (
            <Link className="nav-login" to="/login" onClick={() => setMenuOpen(false)}><LogIn size={15} /> Log in</Link>
          )}
          <Link className="nav-cta" to="/events/new" onClick={() => setMenuOpen(false)}>
            <Plus size={15} /> Add an event
          </Link>
        </nav>
      </div>
    </header>
  )
}