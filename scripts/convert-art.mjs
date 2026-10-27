/**
 * PNG → PixelArtwork converter (pure Node.js, 64x64 grid)
 *
 * Rules:
 *   1. Center-sampling: captures 16x16 pixel blocks cleanly from 1024x1024 source.
 *   2. For images with true transparency (alpha < 30), ONLY alpha < 30 is transparent.
 *      White pixels (like dice faces, cat whites, eyes) are PRESERVED!
 *   3. For opaque images (Sven, Jorn, Raphael, Fransisca), outer background is auto-detected
 *      from corners (#111827) and stripped.
 */

import { readFileSync, writeFileSync } from 'fs'
import { inflateSync } from 'zlib'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ARTWORKS = join(ROOT, 'artworks')

const TARGET_SIZE = 64

function parsePNG(buffer) {
  let pos = 8
  let width, height, colorType, bitDepth
  const idatChunks = []
  let palette = null

  while (pos < buffer.length) {
    const len = buffer.readUInt32BE(pos); pos += 4
    const type = buffer.slice(pos, pos + 4).toString('ascii'); pos += 4
    const data = buffer.slice(pos, pos + len); pos += len
    pos += 4

    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
    } else if (type === 'PLTE') {
      palette = []
      for (let i = 0; i < data.length; i += 3) palette.push([data[i], data[i+1], data[i+2]])
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    }
  }

  const raw = inflateSync(Buffer.concat(idatChunks))
  const pixels = new Uint8Array(width * height * 4)

  function paeth(a, b, c) {
    const p = a + b - c
    const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
  }

  let rawPos = 0
  const rowBytes = width * 4
  const prevRow = new Uint8Array(rowBytes + 1)
  const currRow = new Uint8Array(rowBytes + 1)

  for (let y = 0; y < height; y++) {
    const filter = raw[rawPos++]
    for (let x = 0; x < rowBytes; x++) {
      const a = x >= 4 ? currRow[x - 3] : 0
      const b = prevRow[x + 1]
      const c = x >= 4 ? prevRow[x - 3] : 0
      let val = raw[rawPos++]
      if (filter === 1) val = (val + a) & 0xff
      else if (filter === 2) val = (val + b) & 0xff
      else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff
      else if (filter === 4) val = (val + paeth(a, b, c)) & 0xff
      currRow[x + 1] = val
    }
    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4
      pixels[pi]   = currRow[x * 4 + 1]
      pixels[pi+1] = currRow[x * 4 + 2]
      pixels[pi+2] = currRow[x * 4 + 3]
      pixels[pi+3] = currRow[x * 4 + 4]
    }
    prevRow.set(currRow)
  }

  return { width, height, pixels }
}

function toHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function processFile(filename, size = TARGET_SIZE) {
  const buf = readFileSync(join(ARTWORKS, filename))
  const parsed = parsePNG(buf)
  const { width, height, pixels } = parsed

  // Check corners to see if canvas has an opaque background color (e.g. #111827)
  const corners = [
    [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]
  ]
  const cornerColors = corners.map(([x, y]) => {
    const i = (y * width + x) * 4
    return { r: pixels[i], g: pixels[i+1], b: pixels[i+2], a: pixels[i+3] }
  })

  let detectedBg = null
  const opaqueCorners = cornerColors.filter(c => c.a > 200)
  if (opaqueCorners.length >= 3) {
    // If corners are opaque, treat that corner color as background to strip
    detectedBg = opaqueCorners[0]
  }

  // Sample grid
  const cells = []
  for (let ty = 0; ty < size; ty++) {
    for (let tx = 0; tx < size; tx++) {
      const sx = Math.min(width - 1, Math.floor((tx + 0.5) * width / size))
      const sy = Math.min(height - 1, Math.floor((ty + 0.5) * height / size))
      const idx = (sy * width + sx) * 4

      const r = pixels[idx]
      const g = pixels[idx+1]
      const b = pixels[idx+2]
      const a = pixels[idx+3]

      if (a < 30) {
        cells.push(null)
      } else if (detectedBg) {
        const dr = Math.abs(r - detectedBg.r)
        const dg = Math.abs(g - detectedBg.g)
        const db = Math.abs(b - detectedBg.b)
        if (dr <= 25 && dg <= 25 && db <= 25) {
          cells.push(null)
        } else {
          cells.push(toHex(r, g, b))
        }
      } else {
        cells.push(toHex(r, g, b))
      }
    }
  }

  // If module 5 and speech bubble interior is transparent, flood fill outer canvas as null, and fill inner transparent with white
  if (filename.includes('module5') && !cells.some(c => c === '#ffffff' || c === '#fff8e8')) {
    // Flood fill from (0,0) to find outer background
    const isOuter = new Uint8Array(size * size)
    const queue = [[0, 0], [size - 1, 0], [0, size - 1], [size - 1, size - 1]]
    for (const [qx, qy] of queue) {
      if (cells[qy * size + qx] === null) isOuter[qy * size + qx] = 1
    }
    let qi = 0
    while (qi < queue.length) {
      const [cx, cy] = queue[qi++]
      const neighbors = [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]]
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
          const nidx = ny * size + nx
          if (cells[nidx] === null && isOuter[nidx] === 0) {
            isOuter[nidx] = 1
            queue.push([nx, ny])
          }
        }
      }
    }
    // Any cell that is null but NOT outer background is inside the speech bubble!
    for (let i = 0; i < size * size; i++) {
      if (cells[i] === null && isOuter[i] === 0) {
        cells[i] = '#ffffff' // crisp white interior
      }
    }
  }

  const litCount = cells.filter(Boolean).length
  const bgType = detectedBg ? `detected-bg(${toHex(detectedBg.r, detectedBg.g, detectedBg.b)})` : 'alpha-transparent'
  console.log(`  ${filename.padEnd(35)}: ${size}×${size}, ${litCount}/${size*size} lit [${bgType}]`)
  return cells
}

function cellsToTS(varName, cells, size) {
  const rows = []
  for (let y = 0; y < size; y++) {
    const row = cells.slice(y * size, (y + 1) * size)
    rows.push('    ' + row.map(c => c ? `'${c}'` : 'null').join(', '))
  }
  return `export const ${varName}: PixelArtwork = {\n  size: ${size},\n  cells: [\n${rows.join(',\n')},\n  ],\n}`
}

console.log(`Converting artwork PNGs to ${TARGET_SIZE}×${TARGET_SIZE}...\n`)

console.log('Personal artworks:')
const hannaLed    = processFile('hanna controller and pencil.png')
const svenLed     = processFile('sven boek.png')
const jornLed     = processFile('jorn berg.png')
const fransLed    = processFile('fransisca zorg.png')
const raphLed     = processFile('raphael auto.png')
const markLed     = processFile('mark mask also me.png')

console.log('\nModule artworks:')
const mod1 = processFile('module1 introductie.png')
const mod2 = processFile('module2 emoties.png')
const mod3 = processFile('module3-zorg.png')
const mod4 = processFile('module 4 grenzen.png')
const mod5 = processFile('module5 sociale relaties.png')
const mod6 = processFile('module6 toekomst.png')

console.log('\nEaster egg images:')
const cat1 = processFile('cat1.png')
const cat2 = processFile('cat2.png')
const rock = processFile('rock.png')
const balloonRed = processFile('balloon red.png')
const balloonGreen = processFile('balloon green.png')
const meteor = processFile('meteor.png')

const lines = [
  `// AUTO-GENERATED by scripts/convert-art.mjs — do not edit by hand`,
  `// Source images are in artworks/ (sampled at ${TARGET_SIZE}×${TARGET_SIZE})`,
  ``,
  `export type Pixel = string | null`,
  ``,
  `export type PixelArtwork = {`,
  `  cells: Pixel[]`,
  `  size: number`,
  `}`,
  ``,
  cellsToTS('hannaArt',    hannaLed, TARGET_SIZE),
  ``,
  cellsToTS('svenArt',     svenLed,  TARGET_SIZE),
  ``,
  cellsToTS('jornArt',     jornLed,  TARGET_SIZE),
  ``,
  cellsToTS('fransiscaArt',fransLed, TARGET_SIZE),
  ``,
  cellsToTS('raphaelArt',  raphLed,  TARGET_SIZE),
  ``,
  cellsToTS('markArt',     markLed,  TARGET_SIZE),
  ``,
  cellsToTS('moduleIntroductie', mod1, TARGET_SIZE),
  ``,
  cellsToTS('moduleEmoties',     mod2, TARGET_SIZE),
  ``,
  cellsToTS('moduleZorg',        mod3, TARGET_SIZE),
  ``,
  cellsToTS('moduleGrenzen',     mod4, TARGET_SIZE),
  ``,
  cellsToTS('moduleSociaal',     mod5, TARGET_SIZE),
  ``,
  cellsToTS('moduleToekomst',    mod6, TARGET_SIZE),
  ``,
  cellsToTS('cat1Art', cat1, TARGET_SIZE),
  ``,
  cellsToTS('cat2Art', cat2, TARGET_SIZE),
  ``,
  cellsToTS('rockArt', rock, TARGET_SIZE),
  ``,
  cellsToTS('balloonRedArt', balloonRed, TARGET_SIZE),
  ``,
  cellsToTS('balloonGreenArt', balloonGreen, TARGET_SIZE),
  ``,
  cellsToTS('meteorArt', meteor, TARGET_SIZE),
  ``,
  `// Gallery artworks (6 people)`,
  `export const galleryArt: PixelArtwork[] = [`,
  `  hannaArt, svenArt, jornArt, fransiscaArt, raphaelArt, markArt,`,
  `]`,
  ``,
  `// Module icon artworks (6 modules in order)`,
  `export const moduleArt: PixelArtwork[] = [`,
  `  moduleIntroductie, moduleEmoties, moduleZorg, moduleGrenzen, moduleSociaal, moduleToekomst,`,
  `]`,
]

const outPath = join(ROOT, 'src', 'data', 'artwork-data.ts')
writeFileSync(outPath, lines.join('\n'), 'utf8')
console.log(`\nSuccessfully written 64×64 data to src/data/artwork-data.ts`)
