import { useState, type CSSProperties } from 'react'
import {
  cat1Art,
  cat2Art,
  rockArt,
  balloonRedArt,
  balloonGreenArt,
  meteorArt,
} from '../data/artwork'
import { LedPixelGrid } from './LedPixelGrid'

// ---------------------------------------------------------------------------
// TOAST MESSAGES — Edit these texts anytime you want!
// ---------------------------------------------------------------------------
export const EASTER_EGG_MESSAGES = {
  cat1: 'je hebt de kat Liv gevonden. ze houd veel van balonnen zelfs als ze knappen.',
  cat2: 'je hebt de kat bliksem onze purball! maar het is niet de steen... heb je de andere ook al gevonden?',
  mockingQuote: '(meow) verwachte je iets?',
  rock: 'Gevonden! Die kwarts steen zat goed verstopt toch?',
}

// Global registry of collected items so progress persists while browsing
const collectedItems = new Set<string>()

function showToast(message: string, isRock = false) {
  const existing = document.getElementById('poster-toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.id = 'poster-toast'
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: #251e37;
    color: #fff8e8;
    border: 1.5px solid ${isRock ? '#ff9f43' : '#a675ff'};
    border-radius: 1rem;
    padding: 0.85rem 1.6rem;
    z-index: 99999;
    font-family: 'Outfit', sans-serif;
    font-size: 1.05rem;
    font-weight: 500;
    box-shadow: 0 0 2rem ${isRock ? '#ff9f4366' : '#a675ff55'}, 0 8px 24px rgba(0,0,0,0.5);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
    text-align: center;
  `
  document.body.appendChild(toast)

  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateX(-50%) translateY(-6px)'
  })

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(-50%) translateY(4px)'
    setTimeout(() => toast.remove(), 400)
  }, 3200)
}

// ---------------------------------------------------------------------------
// 1. BALLOON & CAT 1 EASTER EGG (Hero / Top section)
// ---------------------------------------------------------------------------
export function BalloonsEasterEgg() {
  const [redFlown, setRedFlown] = useState(false)
  const [greenFlown, setGreenFlown] = useState(false)
  const [catFound, setCatFound] = useState(() => collectedItems.has('cat1'))

  return (
    <>
      {/* Green Balloon (Left side) */}
      <div
        className={`balloon balloon--green ${greenFlown ? 'balloon--flying' : ''}`}
        onClick={() => setGreenFlown(true)}
        title={greenFlown ? undefined : 'hé, een groene ballon?'}
        role="button"
        tabIndex={0}
      >
        <div className="balloon-inner">
          <LedPixelGrid artwork={balloonGreenArt} label="Groene ballon" shape="sprite" />
        </div>
      </div>

      {/* Red Balloon + Cat 1 behind it (Right side) */}
      <div className="balloon-spot--red">
        {/* Cat 1 sitting behind */}
        <div
          className={`easter-cat easter-cat--1 ${catFound ? 'easter-cat--collected' : ''}`}
          onClick={() => {
            if (redFlown && !catFound) {
              collectedItems.add('cat1')
              setCatFound(true)
              showToast(EASTER_EGG_MESSAGES.cat1)
            }
          }}
          title={redFlown ? 'een zwarte kat!' : undefined}
          role="button"
          tabIndex={0}
        >
          <div className="cat-inner">
            <LedPixelGrid artwork={cat1Art} label="Zwarte kat" shape="sprite" />
          </div>
        </div>

        {/* Red Balloon on top */}
        <div
          className={`balloon balloon--red ${redFlown ? 'balloon--flying' : ''}`}
          onClick={() => setRedFlown(true)}
          title={redFlown ? undefined : 'hé, een rode ballon?'}
          role="button"
          tabIndex={0}
        >
          <div className="balloon-inner">
            <LedPixelGrid artwork={balloonRedArt} label="Rode ballon" shape="sprite" />
          </div>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// 2. SPOILER BAR & CAT 2 EASTER EGG (Module 2: Emoties)
// ---------------------------------------------------------------------------
export function SpoilerCatEasterEgg() {
  const [revealed, setRevealed] = useState(false)
  const [catFound, setCatFound] = useState(() => collectedItems.has('cat2'))

  return (
    <div className="spoiler-egg-wrap">
      {!revealed ? (
        <button
          type="button"
          className="spoiler-tape-bar"
          onClick={() => setRevealed(true)}
          title="klik om te onthullen"
        >
          <span className="spoiler-tape-text">████████████████████████</span>
        </button>
      ) : (
        <div className="spoiler-revealed-content">
          <p className="mocking-cat-text">
            <em>{EASTER_EGG_MESSAGES.mockingQuote}</em>
          </p>
          <div
            className={`easter-cat easter-cat--2 ${catFound ? 'easter-cat--collected' : ''}`}
            onClick={() => {
              if (!catFound) {
                collectedItems.add('cat2')
                setCatFound(true)
                showToast(EASTER_EGG_MESSAGES.cat2)
              }
            }}
            title="een bruine kat!"
            role="button"
            tabIndex={0}
          >
            <div style={{ width: 'clamp(2.8rem, 11vw, 4.5rem)' }}>
              <LedPixelGrid artwork={cat2Art} label="Bruine kat" shape="sprite" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 3. METEOR & QUARTZ ROCK EASTER EGG (Module 6: Toekomst)
// ---------------------------------------------------------------------------
export function MeteorRockEasterEgg() {
  const [split, setSplit] = useState(false)
  const [rockFound, setRockFound] = useState(() => collectedItems.has('rock'))

  return (
    <div className="meteor-egg-container">
      {/* The Rock sitting underneath */}
      <div
        className={`easter-rock ${split ? 'easter-rock--visible' : ''} ${rockFound ? 'easter-rock--collected' : ''}`}
        onClick={() => {
          if (split && !rockFound) {
            collectedItems.add('rock')
            setRockFound(true)
            showToast(EASTER_EGG_MESSAGES.rock, true)
          }
        }}
        title={split ? 'de kwarts steen!' : undefined}
        role="button"
        tabIndex={0}
      >
        <div style={{ width: 'clamp(2.8rem, 11vw, 4.2rem)' }}>
          <LedPixelGrid artwork={rockArt} label="Kwarts steen" shape="sprite" />
        </div>
      </div>

      {/* The Meteor on top */}
      {!split ? (
        <div
          className="meteor-interactive"
          onClick={() => setSplit(true)}
          title="een meteor met een verdachte paarse X..."
          role="button"
          tabIndex={0}
        >
          <div style={{ width: '100%' }}>
            <LedPixelGrid artwork={meteorArt} label="Meteor" shape="sprite" />
          </div>
        </div>
      ) : (
        // Exploding into 4 diagonal quadrants
        <div className="meteor-shards" aria-hidden="true">
          <div className="shard shard--tl" />
          <div className="shard shard--tr" />
          <div className="shard shard--bl" />
          <div className="shard shard--br" />
        </div>
      )}
    </div>
  )
}
