import { useState, useEffect, type CSSProperties } from 'react'
import { people } from '../data/people'
import { LedPixelGrid } from './LedPixelGrid'

export function PersonGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const person = people[activeIndex]

  const move = (direction: -1 | 1) => {
    if (fading) return
    setFading(true)
    setTimeout(() => {
      setActiveIndex((index) => (index + direction + people.length) % people.length)
      setFading(false)
    }, 220)
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  move(-1)
      if (e.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fading])

  return (
    <section aria-labelledby="in-lights-title" className="gallery section-shell">
      <div className="section-heading">
        <p className="eyebrow">zes kleine vieringen</p>
        <h2 id="in-lights-title">in het licht</h2>
        <p>voor elke persoon iets wat ik in jou bewonder.</p>
      </div>

      <div className="gallery-card" style={{ '--accent': person.color } as CSSProperties}>
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

      <p className="gallery-hint" aria-hidden="true">← → of pijltjestoetsen om te navigeren</p>
    </section>
  )
}
