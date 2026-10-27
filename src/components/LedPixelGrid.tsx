import { useEffect, useRef, type CSSProperties } from 'react'
import type { PixelArtwork } from '../data/artwork'

type LedPixelGridProps = {
  artwork: PixelArtwork
  shape: 'led' | 'square' | 'sprite'
  label: string
}

export function LedPixelGrid({ artwork, shape, label }: LedPixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { size, cells } = artwork
    const renderSize = 512 // Crisp high-DPI canvas
    canvas.width = renderSize
    canvas.height = renderSize

    ctx.clearRect(0, 0, renderSize, renderSize)

    const cellSize = renderSize / size

    if (shape === 'led') {
      // LED Matrix mode
      const radius = (cellSize / 2) * 0.82
      const gap = cellSize * 0.08

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const color = cells[y * size + x]
          const cx = x * cellSize + cellSize / 2
          const cy = y * cellSize + cellSize / 2

          // Unlit socket base
          ctx.beginPath()
          ctx.arc(cx, cy, radius, 0, Math.PI * 2)
          ctx.fillStyle = '#171222'
          ctx.fill()
          ctx.strokeStyle = '#2d233c'
          ctx.lineWidth = 1
          ctx.stroke()

          if (color) {
            // Lit LED bead with glow
            ctx.save()
            ctx.shadowColor = color
            ctx.shadowBlur = cellSize * 0.8
            ctx.beginPath()
            ctx.arc(cx, cy, radius * 0.92, 0, Math.PI * 2)

            // Radial highlight for 3D bulb look
            const grad = ctx.createRadialGradient(
              cx - radius * 0.25,
              cy - radius * 0.28,
              radius * 0.05,
              cx,
              cy,
              radius
            )
            grad.addColorStop(0, '#ffffff')
            grad.addColorStop(0.25, color)
            grad.addColorStop(1, color)
            ctx.fillStyle = grad
            ctx.fill()
            ctx.restore()
          }
        }
      }
    } else {
      // Square or Sprite pixel art mode
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const color = cells[y * size + x]
          if (color) {
            ctx.fillStyle = color
            ctx.fillRect(
              Math.floor(x * cellSize),
              Math.floor(y * cellSize),
              Math.ceil(cellSize),
              Math.ceil(cellSize)
            )
          }
        }
      }
    }
  }, [artwork, shape])

  return (
    <div
      aria-label={label}
      className={`pixel-grid pixel-grid--${shape}`}
      role="img"
      style={{ '--grid-size': artwork.size } as CSSProperties}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: shape === 'square' || shape === 'sprite' ? 'pixelated' : 'auto',
        }}
      />
    </div>
  )
}
