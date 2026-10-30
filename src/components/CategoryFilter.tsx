import type { OpportunityCategory } from '../types/opportunity'

export type CategoryChoice = 'All' | OpportunityCategory

export const categories: CategoryChoice[] = ['All', 'Internship', 'Hackathon', 'Scholarship', 'Workshop', 'Competition']

interface CategoryFilterProps {
  selected: CategoryChoice
  onChange: (category: CategoryChoice) => void
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`filter-chip${selected === category ? ' selected' : ''}`}
          aria-pressed={selected === category}
          onClick={() => onChange(category)}
        >
          {category === 'All' && <span className="filter-all-dot" />}{category}
        </button>
      ))}
    </div>
  )
}