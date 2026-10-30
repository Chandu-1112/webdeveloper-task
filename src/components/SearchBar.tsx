import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  variant?: 'default' | 'hero'
}

export default function SearchBar({ value, onChange, variant = 'default' }: SearchBarProps) {
  return (
    <label className={`search-field${variant === 'hero' ? ' search-field-hero' : ''}`}>
      <Search size={19} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search roles, skills, organizations..."
        aria-label="Search opportunities by title or organization"
      />
      {value && <button type="button" className="search-clear" aria-label="Clear search" onClick={() => onChange('')}><X size={16} /></button>}
      <kbd>⌘ K</kbd>
    </label>
  )
}