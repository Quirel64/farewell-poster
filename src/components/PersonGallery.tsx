import { useState, useEffect, useRef, type CSSProperties, type TouchEvent } from 'react'
import { people } from '../data/people'
import { LedPixelGrid } from './LedPixelGrid'

export function PersonGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const fadingRef = useRef(false)
  const person = people[activeIndex]

  const move = (direction: -1 | 1) => {
    if (fadingRef.current) return
    fadingRef.current = true
    setFading(true)
    setTimeout(() => {
      setActiveIndex((index) => (index + direction + people.length) % people.length)
      fadingRef.current = false
      setFading(false)
    }, 220)
  }

  // Keyboard navigation (stable, no re-subscription)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  move(-1)
      if (e.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Touch swipe (touch end).
  // No preventDefault / touch-action changes, so pinch-zoom and vertical scrolling keep working:
  // we only react to a mostly-horizontal flick once the finger is lifted.
  const swipeStart = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    // More than one finger = pinch-zoom in progress; abort swipe tracking.
    swipeStart.current = e.touches.length === 1
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : null
  }

  const onTouchEnd = (e: TouchEvent) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    // Horizontal flick: far enough, and clearly more horizontal than vertical
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      move(dx < 0 ? 1 : -1)
    }
  }

  return (
    <section aria-labelledby="in-lights-title" className="gallery section-shell">
      <div className="section-heading">
        <p className="eyebrow">zes kleine vieringen</p>
        <h2 id="in-lights-title">in het licht</h2>
        <p>voor elke persoon iets wat ik in jou bewonder.</p>
      </div>

      <div
        className="gallery-card"
        style={{ '--accent': person.color } as CSSProperties}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          aria-label="Vorige persoon"
          className="gallery-arrow gallery-arrow--previous"
          onClick={() => move(-1)}
          type="button"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className="gallery-slide" style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.2s ease' }}>
          <LedPixelGrid artwork={person.artwork} label={`LED kunstwerk voor ${person.label}`} shape="led" />
        </div>

        <div className="gallery-copy" aria-live="polite" style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.2s ease' }}>
          <p className="slide-count">{String(activeIndex + 1).padStart(2, '0')} / {String(people.length).padStart(2, '0')}</p>
          <h3>{person.label}</h3>
          <p>{person.caption}</p>
        </div>

        <button
          aria-label="Volgende persoon"
          className="gallery-arrow gallery-arrow--next"
          onClick={() => move(1)}
          type="button"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <p className="gallery-hint" aria-hidden="true">← → veeg, tik op de pijlen of gebruik de pijltjestoetsen</p>
    </section>
  )
}
