import { useState, type FormEvent } from 'react'
import { ArrowRight, Compass, LogIn } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<unknown>
  onRegister: (fullName: string, email: string, password: string) => Promise<unknown>
}

export default function Login({ onLogin, onRegister }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const destination = typeof location.state?.from === 'string' ? location.state.from : '/'
  const intent = typeof location.state?.intent === 'string' ? location.state.intent : ''
  const contextMessage = intent === 'apply'
    ? 'Log in to continue to the application details for this opportunity.'
    : intent === 'add-event'
      ? 'Log in to publish an opportunity for the community.'
      : intent === 'view-saved'
        ? 'Log in to see the opportunities saved to your account.'
        : intent === 'save'
          ? 'Log in to save this opportunity to your account.'
          : 'Sign in to save community opportunities, or create an account to share one with other students.'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await (mode === 'login' ? onLogin(email, password) : onRegister(fullName, email, password))
      navigate(destination, { replace: true, state: intent === 'apply' ? { applicationReady: true } : undefined })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to authenticate. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="form-page auth-page">
      <section className="form-shell">
        <div className="form-intro">
          <span className="form-mark"><Compass size={22} /></span>
          <div className="eyebrow">YOUR OPPORTUNITYHUB ACCOUNT</div>
          <h1>{mode === 'login' ? 'Welcome back.' : 'Make room for what’s next.'}</h1>
          <p>{contextMessage}</p>
          <Link className="form-back-link" to="/"><ArrowRight size={14} /> Back to the opportunity board</Link>
        </div>

        <div className="form-panel">
          <div className="mode-switch" role="group" aria-label="Account action">
            <button type="button" className={mode === 'login' ? 'selected' : ''} aria-pressed={mode === 'login'} onClick={() => { setMode('login'); setError('') }}>Log in</button>
            <button type="button" className={mode === 'register' ? 'selected' : ''} aria-pressed={mode === 'register'} onClick={() => { setMode('register'); setError('') }}>Create account</button>
          </div>
          <form onSubmit={submit}>
            {mode === 'register' && <label className="form-field"><span>Your name</span><input type="text" name="fullName" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={2} maxLength={120} /></label>}
            <label className="form-field">
              <span>Email address</span>
              <input type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={320} />
            </label>
            <label className="form-field">
              <span>Password</span>
              <input type="password" name="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === 'register' ? 8 : 1} maxLength={128} />
              {mode === 'register' && <small>Use at least 8 characters.</small>}
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-dark form-submit" type="submit" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
              {!busy && <LogIn size={16} />}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}