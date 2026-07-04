/**
 * Fetches Stitch screen HTML + screenshots for pixel-perfect UI conversion.
 *
 * Usage:
 *   1. Get API key from Google Stitch / AI Studio
 *   2. Set STITCH_API_KEY in .env at project root
 *   3. Run: npm run fetch:stitch
 *
 * @see https://github.com/google-labs-code/stitch-sdk
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUTPUT_DIR = path.join(ROOT, 'design', 'stitch')

const PROJECT_ID = '8510852350685465056'

/** Map Stitch node-id → screen name (from your project URLs) */
const SCREENS = [
  { id: '97e5c0729ebb43f0842f970b3a4c0902', name: 'landing' },
  { id: '36864ab64f58474ba57088f4a252c13a', name: 'login' },
  { id: '05326edcbd724c549ed96facff4ad757', name: 'register' },
  { id: 'f36a199ac3f444538ea8f9f47da2bab1', name: 'dashboard' },
  { id: '84dca088a2414cdd8ca102c721b2dc85', name: 'screen-5' },
]

async function downloadUrl(url, destPath) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  await writeFile(destPath, buffer)
}

async function main() {
  if (!process.env.STITCH_API_KEY) {
    console.error('Missing STITCH_API_KEY. Set it in .env or environment.')
    console.error('Alternatively, export HTML/CSS from Stitch UI:')
    console.error('  Right-click screen → More → Export → Code to clipboard / Download ZIP')
    process.exit(1)
  }

  const { stitch } = await import('@google/stitch-sdk')
  const project = stitch.project(PROJECT_ID)

  await mkdir(OUTPUT_DIR, { recursive: true })
  await mkdir(path.join(OUTPUT_DIR, 'raw'), { recursive: true })

  const manifest = []

  for (const screen of SCREENS) {
    console.log(`Fetching ${screen.name} (${screen.id})...`)

    try {
      const stitchScreen = await project.getScreen(screen.id)
      const htmlUrl = await stitchScreen.getHtml()
      const imageUrl = await stitchScreen.getImage()

      const htmlPath = path.join(OUTPUT_DIR, 'raw', `${screen.name}.html`)
      const imagePath = path.join(OUTPUT_DIR, 'raw', `${screen.name}.png`)

      await downloadUrl(htmlUrl, htmlPath)
      await downloadUrl(imageUrl, imagePath)

      manifest.push({
        ...screen,
        htmlPath: `design/stitch/raw/${screen.name}.html`,
        imagePath: `design/stitch/raw/${screen.name}.png`,
      })

      console.log(`  ✓ Saved ${screen.name}`)
    } catch (error) {
      console.error(`  ✗ Failed ${screen.name}:`, error.message)
      manifest.push({ ...screen, error: error.message })
    }
  }

  await writeFile(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify({ projectId: PROJECT_ID, screens: manifest }, null, 2),
  )

  console.log(`\nDone. Assets saved to ${OUTPUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
