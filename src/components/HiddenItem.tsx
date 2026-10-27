import { useState, type CSSProperties } from 'react'
import { cat1Art, cat2Art, rockArt } from '../data/artwork'
import { LedPixelGrid } from './LedPixelGrid'

type HiddenItem = {
  id: string
  art: typeof cat1Art
  label: string
  message: string
  found: boolean
}

const ITEMS: Omit<HiddenItem, 'found'>[] = [
  { id: 'cat1', art: cat1Art,  label: 'zwarte kat',  message: 'je hebt de kat Liv gevonden. ze houd heel veel van balonnen zelfs als ze knappen.' },
  { id: 'cat2', art: cat2Art,  label: 'bruine kat',  message: 'je hebt de kat bliksem! maar dat is geen steen... heb je de andere ook al gevonden?' },
  { id: 'rock', art: rockArt,  label: 'kwarts steen', message: ' kwarts gevonden! de steen was hier de hele tijd!' },
]

// Positions: [section, left%, top%] — placed so they land in different page sections
const POSITIONS: Record<string, { section: string; x: string; y: string }> = {
  cat1: { section: 'hero',        x: '8%',  y: '72%' },
  cat2: { section: 'shared-year', x: '88%', y: '15%' },
  rock: { section: 'thanks',      x: '78%', y: '60%' },
}

type Props = {
  section: 'hero' | 'shared-year' | 'gallery' | 'thanks'
}

// Global state so finds persist across renders without context
const foundSet = new Set<string>()

export function HiddenItem({ section }: Props) {
  const [, forceUpdate] = useState(0)

  const matching = ITEMS.filter(item => POSITIONS[item.id].section === section)

  if (matching.length === 0) return null

  return (
    <>
      {matching.map(item => {
        const pos = POSITIONS[item.id]
        const isFound = foundSet.has(item.id)
        const isRock = item.id === 'rock'

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              zIndex: 10,
              cursor: isFound ? 'default' : 'pointer',
              opacity: isFound ? 0.5 : 1,
              transition: 'opacity 0.4s, transform 0.3s',
              transform: isFound ? 'scale(0.85)' : 'scale(1)',
            } as CSSProperties}
            onClick={() => {
              if (!isFound) {
                foundSet.add(item.id)
                forceUpdate(n => n + 1)
                // Brief toast notification
                const toast = document.createElement('div')
                toast.textContent = item.message
                toast.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
                  background:#2b2442;color:#fff8e8;border:1px solid ${isRock ? '#ff9f43' : '#a675ff'};
                  border-radius:0.75rem;padding:0.75rem 1.5rem;z-index:9999;font-family:Outfit,sans-serif;
                  font-size:1rem;box-shadow:0 0 1.5rem ${isRock ? '#ff9f4344' : '#a675ff44'};
                  transition:opacity 0.5s;`
                document.body.appendChild(toast)
                setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 600) }, 2800)
              }
            }}
            aria-label={isFound ? `${item.label} (al gevonden)` : `klik om te ontdekken`}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') (e.currentTarget as HTMLElement).click() }}
          >
            <div style={{ width: '3.5rem', filter: isRock && !isFound ? 'drop-shadow(0 0 0.5rem #ff9f43cc)' : undefined }}>
              <LedPixelGrid
                artwork={item.art}
                label={item.label}
                shape="sprite"
              />
            </div>
            {!isFound && (
              <div style={{
                position: 'absolute',
                bottom: '-1.2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.6rem',
                color: '#fbc877',
                fontFamily: 'DM Mono, monospace',
                whiteSpace: 'nowrap',
                opacity: 0.6,
              }}>
                {isRock ? '✦' : '~'}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
