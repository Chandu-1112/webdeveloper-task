import type { Opportunity, OpportunityCategory } from '../types/opportunity'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export interface AuthUser {
  id: string
  fullName: string
  email: string
  createdAt: string
}

export interface EventPayload {
  title: string
  organization: string
  category: OpportunityCategory
  description: string
  fullDescription: string
  eligibility: string[]
  location: string
  deadline: string
  skills: string[]
  instructions: string
}

interface LoginResponse {
  access_token: string
  token_type: string
  user: AuthUser
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const detail = typeof body === 'object' && body !== null && 'detail' in body && typeof body.detail === 'string'
      ? body.detail
      : `Request failed (${response.status})`
    throw new Error(detail)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  register(fullName: string, email: string, password: string) {
    return request<AuthUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    })
  },
  login(email: string, password: string) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  currentUser(token: string) {
    return request<AuthUser>('/auth/me', {}, token)
  },
  listEvents() {
    return request<Opportunity[]>('/events')
  },
  listBookmarks(token: string) {
    return request<Opportunity[]>('/bookmarks', {}, token)
  },
  addBookmark(event: Opportunity, token: string) {
    const { id, isDemo: _isDemo, creatorName: _creatorName, ...snapshot } = event
    return request<void>(`/events/${encodeURIComponent(id)}/bookmark`, {
      method: 'PUT',
      body: JSON.stringify(snapshot),
    }, token)
  },
  removeBookmark(id: string, token: string) {
    return request<void>(`/events/${encodeURIComponent(id)}/bookmark`, { method: 'DELETE' }, token)
  },
  createEvent(payload: EventPayload, token: string) {
    return request<Opportunity>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token)
  },
}