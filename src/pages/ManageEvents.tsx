import { useEffect, useState } from 'react'
import { Clipboard, ExternalLink, ListTodo, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api, type EventPayload } from '../services/api'
import type { Opportunity } from '../types/opportunity'
import CreateOpportunity from './CreateOpportunity'

interface ManageEventsProps {
  token: string
  onUpdate: (id: string, payload: EventPayload) => Promise<Opportunity>
  onDelete: (id: string) => Promise<void>
}

export default function ManageEvents({ token, onUpdate, onDelete }: ManageEventsProps) {
  const [events, setEvents] = useState<Opportunity[]>([])
  const [editing, setEditing] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    void api.listMyEvents(token)
      .then((listings) => {
        if (active) setEvents(listings.map((event) => ({ ...event, isDemo: false })))
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load your events.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [token, refreshKey])

  async function saveEvent(payload: EventPayload) {
    if (!editing) return
    const updated = await onUpdate(editing.id, payload)
    const managedEvent = { ...updated, isDemo: false }
    setEvents((current) => current.map((event) => event.id === managedEvent.id ? managedEvent : event))
    setEditing(null)
    setError('')
  }

  async function removeEvent(event: Opportunity) {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return
    setBusyId(event.id)
    setError('')
    try {
      await onDelete(event.id)
      setEvents((current) => current.filter((item) => item.id !== event.id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to delete this event.')
    } finally {
      setBusyId('')
    }
  }

  async function copyEventLink(event: Opportunity) {
    setError('')
    try {
      if (!navigator.clipboard) throw new Error('Clipboard access is unavailable in this browser.')
      await navigator.clipboard.writeText(`${window.location.origin}/opportunities/${encodeURIComponent(event.id)}`)
      setCopiedId(event.id)
      window.setTimeout(() => setCopiedId((current) => current === event.id ? '' : current), 2000)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to copy the public event link.')
    }
  }

  if (editing) {
    return <CreateOpportunity
      opportunity={editing}
      onCreate={async () => ({ id: editing.id })}
      onUpdate={saveEvent}
    />
  }

  return (
    <main className="page-shell manage-page">
      <div className="page-heading">
        <div className="eyebrow"><ListTodo size={13} /> YOUR LISTINGS</div>
        <h1>Manage <span>events.</span></h1>
        <p>Edit, share, or remove the events you’ve published.</p>
      </div>
      {error && <p className="form-error manage-error" role="alert">{error}</p>}
      {loading ? (
        <div className="empty-state saved-empty" role="status"><p>Loading your events…</p></div>
      ) : events.length ? (
        <div className="managed-events">
          {events.map((event) => (
            <article className="managed-event" key={event.id}>
              <div className="managed-event-info">
                <span className={`category-tag category-${event.category.toLowerCase()}`}>{event.category}</span>
                <p className="card-organization">{event.organization}</p>
                <h2>{event.title}</h2>
                <p>{event.description}</p>
              </div>
              <div className="managed-event-actions">
                <Link className="manage-action" to={`/opportunities/${event.id}`}><ExternalLink size={15} /> View listing</Link>
                <button className="manage-action" type="button" onClick={() => void copyEventLink(event)}>
                  <Clipboard size={15} /> {copiedId === event.id ? 'Link copied' : 'Copy public link'}
                </button>
                <button className="manage-action" type="button" onClick={() => setEditing(event)}><Pencil size={15} /> Edit</button>
                <button className="manage-action manage-delete" type="button" disabled={busyId === event.id} onClick={() => void removeEvent(event)}>
                  <Trash2 size={15} /> {busyId === event.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : error ? (
        <div className="empty-state saved-empty">
          <h3>Your events couldn’t be loaded.</h3>
          <p>Check your connection and try loading your listings again.</p>
          <button type="button" className="button button-dark" onClick={() => setRefreshKey((current) => current + 1)}>Try again</button>
        </div>
      ) : (
        <div className="empty-state saved-empty">
          <span className="empty-icon"><ListTodo size={22} /></span>
          <h3>You haven’t published an event yet.</h3>
          <p>Events you publish will appear here, where you can edit, share, or delete them.</p>
          <Link to="/events/new" className="button button-dark">Add an event <Plus size={16} /></Link>
        </div>
      )}
    </main>
  )
}
