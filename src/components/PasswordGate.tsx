import { useState, type FormEvent } from 'react'

// ---------------------------------------------------------------------------
// PASSWORD CONFIGURATION — Change the password below to whatever you want!
// ---------------------------------------------------------------------------
export const ACCEPTED_PASSWORDS = [
  'mk11okDtgK'
]

type PasswordGateProps = {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('poster_unlocked') === 'true'
    } catch {
      return false
    }
  })
  const [inputVal, setInputVal] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const clean = inputVal.trim().toLowerCase()

    if (ACCEPTED_PASSWORDS.includes(clean)) {
      setError(false)
      try {
        sessionStorage.setItem('poster_unlocked', 'true')
      } catch {
        // sessionStorage unavailable
      }
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (unlocked) {
    return <>{children}</>
  }

  return (
    <div className="password-gate-screen">
      <div className="password-gate-card">
        <p className="eyebrow">beveiligde pagina</p>
        <h1>een vaarwel<br /><span>in lichtjes.</span></h1>
        <p className="password-gate-subtitle">
          deze pagina bevat persoonlijke herinneringen voor de therapiegroep.<br />
          voer het groepswachtwoord in om verder te gaan.
        </p>

        <form onSubmit={handleSubmit} className="password-gate-form">
          <input
            type="password"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value)
              if (error) setError(false)
            }}
            placeholder="groepswachtwoord..."
            className="password-gate-input"
            autoFocus
          />
          <button type="submit" className="password-gate-btn">
            bekijk poster →
          </button>
        </form>

        {error && (
          <p className="password-gate-error">
            wachtwoord niet herkend. vraag Mark naar het wachtwoord.
          </p>
        )}
      </div>
    </div>
  )
}
