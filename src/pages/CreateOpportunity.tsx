import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowUpRight, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { OpportunityCategory } from '../types/opportunity'
import type { EventPayload } from '../services/api'

interface CreateOpportunityProps {
  onCreate: (payload: EventPayload) => Promise<{ id: string }>
}

const categories: OpportunityCategory[] = ['Internship', 'Hackathon', 'Scholarship', 'Workshop', 'Competition']

function lines(value: FormDataEntryValue | null) {
  return String(value ?? '').split('\n').map((item) => item.trim()).filter(Boolean)
}

export default function CreateOpportunity({ onCreate }: CreateOpportunityProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload: EventPayload = {
      title: String(form.get('title')).trim(),
      organization: String(form.get('organization')).trim(),
      category: String(form.get('category')) as OpportunityCategory,
      description: String(form.get('description')).trim(),
      fullDescription: String(form.get('fullDescription')).trim(),
      eligibility: lines(form.get('eligibility')),
      location: String(form.get('location')).trim(),
      deadline: String(form.get('deadline')),
      skills: lines(form.get('skills')),
      instructions: String(form.get('instructions')).trim(),
    }

    setBusy(true)
    setError('')
    try {
      const opportunity = await onCreate(payload)
      navigate(`/opportunities/${opportunity.id}`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to add this opportunity.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="form-page create-page">
      <section className="create-shell">
        <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to opportunities</Link>
        <div className="form-intro create-intro">
          <div className="eyebrow"><Plus size={13} /> COMMUNITY LISTING</div>
          <h1>Put a good opportunity on the map.</h1>
          <p>Share the details students need to decide whether it’s right for them.</p>
        </div>
        <form className="event-form" onSubmit={submit}>
          <div className="form-grid">
            <label className="form-field"><span>Opportunity title</span><input name="title" required minLength={3} maxLength={200} placeholder="e.g. Summer Research Internship" /></label>
            <label className="form-field"><span>Organization</span><input name="organization" required minLength={2} maxLength={200} placeholder="Who is hosting it?" /></label>
            <label className="form-field"><span>Category</span><select name="category" required defaultValue="Internship">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="form-field"><span>Location</span><input name="location" required minLength={2} maxLength={200} placeholder="Remote, city, or hybrid" /></label>
            <label className="form-field"><span>Application deadline</span><input name="deadline" type="date" required /></label>
            <label className="form-field form-field-wide"><span>Short description</span><textarea name="description" required minLength={10} maxLength={500} rows={2} placeholder="A concise summary for the opportunity card" /></label>
            <label className="form-field form-field-wide"><span>Full description</span><textarea name="fullDescription" required minLength={20} rows={4} placeholder="What will participants do, learn, or receive?" /></label>
            <label className="form-field form-field-wide"><span>Eligibility</span><textarea name="eligibility" required rows={3} placeholder={'One requirement per line\nFor example: Current college students'} /></label>
            <label className="form-field form-field-wide"><span>Application instructions</span><textarea name="instructions" required minLength={10} rows={3} placeholder="How should interested students apply?" /></label>
            <label className="form-field form-field-wide"><span>Skills (optional)</span><textarea name="skills" rows={2} placeholder={'One skill per line\nFor example: User research'} /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="event-form-footer"><p>Listings are associated with your account. Please share accurate, current information.</p><button className="button button-dark" type="submit" disabled={busy}>{busy ? 'Publishing…' : 'Publish opportunity'} {!busy && <ArrowUpRight size={16} />}</button></div>
        </form>
      </section>
    </main>
  )
}