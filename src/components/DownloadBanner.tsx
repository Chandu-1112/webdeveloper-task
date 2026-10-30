import { Check, Download, Smartphone, X } from 'lucide-react'
import { useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

interface DownloadBannerProps {
  onDismiss: () => void
}

export default function DownloadBanner({ onDismiss }: DownloadBannerProps) {
  const { installed, promptToInstall } = useInstallPrompt()
  const [showInstructions, setShowInstructions] = useState(false)

  async function handleInstall() {
    const outcome = await promptToInstall()
    if (outcome === 'unavailable') setShowInstructions(true)
  }

  return (
    <>
      <aside className="download-banner" aria-label="OpportunityHub mobile app">
        <div className="download-icon"><Smartphone size={22} /></div>
        <div className="download-copy"><strong>Get the OpportunityHub App</strong><span>Discover opportunities and stay updated wherever you go.</span></div>
        <button className="download-button" type="button" onClick={handleInstall} disabled={installed}>
          {installed ? 'App installed' : 'Install App'} {installed ? <Check size={15} /> : <Download size={15} />}
        </button>
        <button className="banner-close" type="button" aria-label="Dismiss app banner" onClick={onDismiss}><X size={18} /></button>
      </aside>
      {showInstructions && (
        <div className="install-dialog-backdrop" onClick={() => setShowInstructions(false)}>
          <section className="install-dialog" role="dialog" aria-modal="true" aria-labelledby="install-dialog-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="install-dialog-close" aria-label="Close install instructions" onClick={() => setShowInstructions(false)}><X size={18} /></button>
            <span className="install-dialog-icon"><Smartphone size={23} /></span>
            <p className="eyebrow">ANDROID INSTALL</p>
            <h2 id="install-dialog-title">Add OpportunityHub to your phone.</h2>
            <p>Open this page in Chrome, tap the three-dot menu, then choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
            <p className="install-dialog-note">Installation is available when this site is hosted over HTTPS. This installs the web app; no APK download is provided.</p>
            <button type="button" className="button button-dark" onClick={() => setShowInstructions(false)}>Got it</button>
          </section>
        </div>
      )}
    </>
  )
}