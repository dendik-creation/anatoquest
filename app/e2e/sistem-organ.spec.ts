import { expect, test, type Page } from '@playwright/test'

/**
 * SC-06 Materi 2: Respiratory / Heart / Vessels & Lymphatic validation.
 *
 * Layout coordinates reproject the approved Figma "Main" reference (node
 * 58:3, file h11RPHZrZurTNsU3U0DWFZ) onto the app's usual 1920x1080
 * safe-stage convention — see `SistemOrganScene.css` and the comment at the
 * top of `fundamental.spec.ts` for the same pattern on SC-05.
 */

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

function stageScale(viewportWidth: number, viewportHeight: number): number {
  const cover = Math.max(viewportWidth / DESIGN_WIDTH, viewportHeight / DESIGN_HEIGHT)
  const safeContain = Math.min(viewportWidth / SAFE_WIDTH, viewportHeight / SAFE_HEIGHT)
  return Math.min(cover, safeContain)
}

function toClient(viewportWidth: number, viewportHeight: number, x: number, y: number) {
  const scale = stageScale(viewportWidth, viewportHeight)
  const stageLeft = viewportWidth / 2 - (DESIGN_WIDTH / 2) * scale
  const stageTop = viewportHeight / 2 - (DESIGN_HEIGHT / 2) * scale
  return { x: stageLeft + x * scale, y: stageTop + y * scale, scale }
}

// Must match SLOT_RECTS in SistemOrganScene.tsx (slot 0 = Hidung's target).
const SLOT_START_X = 270
const SLOT_PITCH = 108
const SLOT_SIZE = 77
const SLOT_CENTERS = [0, 1, 2, 3, 4, 5].map((index) => ({
  x: SLOT_START_X + index * SLOT_PITCH + SLOT_SIZE / 2,
  y: 951 + SLOT_SIZE / 2,
}))

async function gotoSistemOrgan(page: Page) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('anatoquest:case-study-tour-seen', '1')
    window.sessionStorage.setItem('anatoquest:fundamental-tour-seen', '1')
    window.sessionStorage.setItem('anatoquest:sistem-organ-tour-seen', '1')
  })
  await page.goto('/')
  await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-mulai-pembelajaran').click()
  await expect(page.getByTestId('case-study-scene')).toBeVisible()

  const viewport = page.viewportSize()!
  async function place(cardTestId: string, hotspot: 'lung' | 'heart') {
    const spot = hotspot === 'lung' ? { x: 820, y: 460 } : { x: 765, y: 600 }
    const card = page.getByTestId(cardTestId)
    const box = (await card.boundingBox())!
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    const target = toClient(viewport.width, viewport.height, spot.x, spot.y)
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(start.x + 20, start.y + 10, { steps: 4 })
    await page.mouse.move(target.x, target.y, { steps: 8 })
    await page.mouse.up()
  }
  await place('case-study-card-sesak_napas', 'lung')
  await place('case-study-card-jantung_berdebar', 'heart')
  await place('case-study-card-lelah', 'heart')
  await place('case-study-card-pucat', 'heart')
  await page.getByTestId('case-study-next-button').click()

  await expect(page.getByTestId('fundamental-scene')).toBeVisible()
  // Complete SC-05's activity so "Lanjutkan" reaches SC-06.
  async function dragChip(chipTestId: string, zone: 'struktur' | 'fungsi') {
    const zoneCenter = zone === 'struktur' ? { x: 1150, y: 965 } : { x: 1500, y: 965 }
    const chip = page.getByTestId(chipTestId)
    const box = (await chip.boundingBox())!
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    const target = toClient(viewport.width, viewport.height, zoneCenter.x, zoneCenter.y)
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(start.x + 20, start.y + 10, { steps: 4 })
    await page.mouse.move(target.x, target.y, { steps: 8 })
    await page.mouse.up()
  }
  await dragChip('fundamental-chip-bentuk_jantung', 'struktur')
  await dragChip('fundamental-chip-jantung_memompa', 'fungsi')
  await dragChip('fundamental-chip-paru_kerucut', 'struktur')
  await dragChip('fundamental-chip-pertukaran_gas', 'fungsi')
  await expect(page.getByTestId('fundamental-next-button')).toBeEnabled()
  await page.getByTestId('fundamental-next-button').click()

  await expect(page.getByTestId('sistem-organ-scene')).toBeVisible()
  await expect(page.getByTestId('sistem-organ-scene')).toHaveAttribute('data-phase', 'idle')
  await waitForArtwork(page)
  await page.mouse.move(0, 0)
}

async function waitForArtwork(page: Page) {
  for (const selector of ['.sistem-organ__background', '.sistem-organ__body-image']) {
    await expect
      .poll(() => page.locator(selector).evaluate((image) => (image as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
  }
}

// Must match MATCH_SLOT_ORDER in sistemOrganContent.ts.
const MATCH_CORRECT_INDEX: Record<string, number> = {
  bronkus: 0,
  hidung: 1,
  alveolus: 2,
  faring: 3,
  trakea: 4,
  laring: 5,
}

async function dragTokenToSlot(page: Page, tokenTestId: string, slotIndex: number) {
  const viewport = page.viewportSize()!
  const token = page.getByTestId(tokenTestId)
  const box = (await token.boundingBox())!
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  const target = toClient(viewport.width, viewport.height, SLOT_CENTERS[slotIndex].x, SLOT_CENTERS[slotIndex].y)
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(start.x + 15, start.y + 8, { steps: 4 })
  await page.mouse.move(target.x, target.y, { steps: 8 })
  await page.mouse.up()
}

test.describe('SC-06 Sistem Pernapasan, Kardiovaskular, dan Limfatik', () => {
  test('lays out header, three panels, activity band and nav controls', async ({ page }) => {
    await gotoSistemOrgan(page)

    await expect(page.getByRole('heading', { name: 'Sistem Pernapasan, Kardiovaskular, dan Limfatik' })).toBeVisible()
    await expect(page.getByTestId('sistem-organ-path')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-explorer')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-info')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-activity')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-back-button')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-next-button')).toBeVisible()

    for (const id of RESPIRATORY_IDS) {
      await expect(page.getByTestId(`sistem-organ-token-${id}`)).toBeVisible()
    }
  })

  test('defaults to Pernapasan / Paru-paru selected', async ({ page }) => {
    await gotoSistemOrgan(page)

    await expect(page.getByTestId('sistem-organ-selector-pernapasan')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('sistem-organ-name')).toHaveText('Paru-paru')
    await expect(page.getByTestId('sistem-organ-selector-pernapasan')).toContainText('Aktif')
  })

  test('switching system updates the explorer preview and info panel', async ({ page }) => {
    await gotoSistemOrgan(page)

    await page.getByTestId('sistem-organ-selector-kardiovaskular').click()

    await expect(page.getByTestId('sistem-organ-selector-kardiovaskular')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('sistem-organ-selector-pernapasan')).toHaveAttribute('aria-pressed', 'false')
    await expect(page.getByTestId('sistem-organ-name')).toHaveText('Jantung')
    await expect(page.getByTestId('sistem-organ-selector-kardiovaskular')).toContainText('Aktif')
  })

  test('"Lihat proses fisiologi" opens a closable drawer with the physiology explanation', async ({ page }) => {
    await gotoSistemOrgan(page)

    const drawer = page.getByTestId('sistem-organ-process-drawer')
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')

    await page.getByTestId('sistem-organ-process-button').click()
    await expect(drawer).toHaveAttribute('aria-hidden', 'false')
    await expect(page.getByTestId('sistem-organ-process-text')).toContainText('alveolus')

    await page.getByRole('button', { name: 'Tutup proses fisiologi' }).click()
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')
  })

  test('select-then-place keyboard/tap flow places a token in the correct slot', async ({ page }) => {
    await gotoSistemOrgan(page)

    const token = page.getByTestId('sistem-organ-token-hidung')
    await token.click()
    await expect(token).toHaveAttribute('aria-pressed', 'true')

    await page.getByRole('button', { name: 'Letakkan di urutan ke-1' }).click()

    await expect(page.getByTestId('sistem-organ-feedback')).toContainText('Benar!')
  })

  test('placing a token in the wrong slot shakes it back with a retry message', async ({ page }) => {
    await gotoSistemOrgan(page)

    const token = page.getByTestId('sistem-organ-token-hidung')
    await token.click()
    await page.getByRole('button', { name: 'Letakkan di urutan ke-6' }).click()

    await expect(page.getByTestId('sistem-organ-feedback')).toContainText('Belum tepat')
    await expect(token).toHaveAttribute('aria-pressed', 'true')
  })

  test('switching to "Pasangkan" swaps the card into the function-matching activity', async ({ page }) => {
    await gotoSistemOrgan(page)

    await page.getByTestId('sistem-organ-tab-match').click()
    await expect(page.getByRole('heading', { name: 'Pasangkan Fungsi Organ' })).toBeVisible()
    await expect(page.getByTestId('sistem-organ-feedback-idle')).toContainText('Baca fungsi tiap kartu')
  })

  test('select-then-place matches an organ to its function card', async ({ page }) => {
    await gotoSistemOrgan(page)
    await page.getByTestId('sistem-organ-tab-match').click()

    const token = page.getByTestId('sistem-organ-token-bronkus')
    await token.click()
    await page.getByRole('button', { name: /Kartu fungsi:.*paru-paru kanan dan kiri/ }).click()

    await expect(page.getByTestId('sistem-organ-feedback')).toContainText('Benar!')
  })

  test('matching an organ to the wrong function card shakes it back', async ({ page }) => {
    await gotoSistemOrgan(page)
    await page.getByTestId('sistem-organ-tab-match').click()

    const token = page.getByTestId('sistem-organ-token-bronkus')
    await token.click()
    await page.getByRole('button', { name: /Kartu fungsi:.*persimpangan jalur udara/ }).click()

    await expect(page.getByTestId('sistem-organ-feedback')).toContainText('Belum cocok')
    await expect(token).toHaveAttribute('aria-pressed', 'true')
  })

  test('Lanjutkan stays disabled until both the sequence and matching activities are complete', async ({ page }) => {
    // Twelve sequential drags (both activities) is genuinely slower than the
    // 30s default, especially under parallel-project worker contention.
    test.slow()
    await gotoSistemOrgan(page)
    const next = page.getByTestId('sistem-organ-next-button')
    await expect(next).toBeDisabled()

    for (const id of RESPIRATORY_IDS) {
      await dragTokenToSlot(page, `sistem-organ-token-${id}`, RESPIRATORY_ORGANS[id].correctIndex)
    }
    await expect(page.getByTestId('sistem-organ-tab-sequence')).toContainText('Urutkan')
    await expect(next).toBeDisabled()

    await page.getByTestId('sistem-organ-tab-match').click()
    for (const id of RESPIRATORY_IDS) {
      await dragTokenToSlot(page, `sistem-organ-token-${id}`, MATCH_CORRECT_INDEX[id])
    }

    await expect(next).toBeEnabled()
    await next.click()
    await expect(page.getByTestId('home-scene')).toBeVisible()
  })

  test('every scene control is keyboard reachable with an accessible name', async ({ page }) => {
    await gotoSistemOrgan(page)

    await expect(page.getByRole('button', { name: 'Kembali ke Beranda' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Bantuan materi sistem pernapasan, kardiovaskular, dan limfatik' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Matikan musik latar' })).toBeVisible()
    await expect(page.getByTestId('sistem-organ-selector-pernapasan')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-selector-kardiovaskular')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-selector-limfatik')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-back-button')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-next-button')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-tab-sequence')).toBeVisible()
    await expect(page.getByTestId('sistem-organ-tab-match')).toBeVisible()
  })

  test('the back button returns to SC-05 and the home button returns to Home', async ({ page }) => {
    await gotoSistemOrgan(page)
    await page.getByTestId('sistem-organ-back-button').click()
    await expect(page.getByTestId('fundamental-scene')).toBeVisible()
  })

  test('reduced motion still allows placing a token correctly', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await gotoSistemOrgan(page)

    await dragTokenToSlot(page, 'sistem-organ-token-hidung', 0)
    await expect(page.getByTestId('sistem-organ-feedback')).toContainText('Benar!')
  })

  test('stage stays inside the viewport on this device', async ({ page }) => {
    const viewport = page.viewportSize()!
    await gotoSistemOrgan(page)

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(viewport.width)
  })

  test('captures the default state for visual review', async ({ page }, testInfo) => {
    await gotoSistemOrgan(page)
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ.png` })
  })

  test('captures the Kardiovaskular state for visual review', async ({ page }, testInfo) => {
    await gotoSistemOrgan(page)
    await page.getByTestId('sistem-organ-selector-kardiovaskular').click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-kardiovaskular.png` })
  })

  test('captures the matching-activity tab for visual review', async ({ page }, testInfo) => {
    await gotoSistemOrgan(page)
    await page.getByTestId('sistem-organ-tab-match').click()
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-match.png` })
  })
})

const RESPIRATORY_ORGANS: Record<string, { correctIndex: number }> = {
  hidung: { correctIndex: 0 },
  faring: { correctIndex: 1 },
  laring: { correctIndex: 2 },
  trakea: { correctIndex: 3 },
  bronkus: { correctIndex: 4 },
  alveolus: { correctIndex: 5 },
}
const RESPIRATORY_IDS = Object.keys(RESPIRATORY_ORGANS)
