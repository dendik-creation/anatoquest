import { expect, test, type Page } from '@playwright/test'

/**
 * SC-05 Materi 1: Fundamentals validation.
 *
 * Layout coordinates are an implementation draft reprojecting the reference
 * mock onto the app's usual 1920x1080 safe-stage convention (see
 * `FundamentalScene.css`), the same way SC-04's tests derive theirs from the
 * approved Figma frame — there is no approved Figma frame here yet.
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

/**
 * The approved Fundamentals reference uses a compact three-column learning
 * area above a single bottom activity strip. Keep these checks in design
 * coordinates so the same audit works at every configured viewport.
 */
async function boxInDesignSpace(page: Page, testId: string) {
  return page.evaluate(({ id, designWidth }) => {
    const stage = document.querySelector<HTMLElement>('[data-testid="fundamental-stage"]')
    const element = document.querySelector<HTMLElement>(`[data-testid="${id}"]`)
    if (!stage || !element) throw new Error(`Missing ${id} or Fundamentals stage`)

    const stageBox = stage.getBoundingClientRect()
    const box = element.getBoundingClientRect()
    const scale = stageBox.width / designWidth
    return {
      x: (box.x - stageBox.x) / scale,
      y: (box.y - stageBox.y) / scale,
      width: box.width / scale,
      height: box.height / scale,
    }
  }, { id: testId, designWidth: DESIGN_WIDTH })
}

function expectNear(actual: number, expected: number, tolerance = 10) {
  expect(actual).toBeGreaterThanOrEqual(expected - tolerance)
  expect(actual).toBeLessThanOrEqual(expected + tolerance)
}

// Must match ACTIVITY_ZONES in src/scenes/fundamental/fundamentalContent.ts.
const ZONES = {
  struktur: { x: 1150, y: 965 },
  fungsi: { x: 1500, y: 965 },
} as const

/**
 * Goes straight to the SC-05 scene: skips Splash, clicks through Home and
 * SC-04, then completes the SC-04 activity so "Selanjutnya" lands here. Both
 * scenes' first-visit guided tours are pre-seeded as seen so they don't
 * intercept clicks in tests that are not specifically about the tour.
 */
async function gotoFundamental(page: Page, { skipTour = true }: { skipTour?: boolean } = {}) {
  if (skipTour) {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('anatoquest:case-study-tour-seen', '1')
      window.sessionStorage.setItem('anatoquest:fundamental-tour-seen', '1')
    })
  }
  await page.goto('/')
  await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })
  await page.getByTestId('splash-continue').click()
  await expect(page.getByTestId('home-scene')).toBeVisible()
  await page.getByTestId('home-card-mulai-pembelajaran').click()
  await expect(page.getByTestId('case-study-scene')).toBeVisible()
  await expect(page.getByTestId('case-study-scene')).toHaveAttribute('data-phase', 'idle')

  const viewport = page.viewportSize()!
  const caseStudyHotspots = {
    lung: { x: 820, y: 460 },
    heart: { x: 765, y: 600 },
  }
  async function place(cardTestId: string, hotspot: keyof typeof caseStudyHotspots) {
    const card = page.getByTestId(cardTestId)
    const box = await card.boundingBox()
    if (!box) throw new Error(`${cardTestId} must be laid out`)
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    const target = toClient(viewport.width, viewport.height, caseStudyHotspots[hotspot].x, caseStudyHotspots[hotspot].y)
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

  await expect(page.getByTestId('case-study-next-button')).toBeVisible()
  await page.getByTestId('case-study-next-button').click()

  await expect(page.getByTestId('fundamental-scene')).toBeVisible()
  await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
  await waitForFundamentalArtwork(page)
  await page.mouse.move(0, 0)
}

async function waitForFundamentalArtwork(page: Page) {
  for (const selector of [
    '.fundamental__background',
    '.fundamental__flip-face--front img',
    '.fundamental__organ-preview img',
    '.fundamental__mascot',
  ]) {
    await expect
      .poll(() => page.locator(selector).evaluate((image) => (image as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
  }
}

/** Drags an activity chip (by design-space centre) onto a zone. */
async function dragChipToZone(page: Page, chipTestId: string, zone: keyof typeof ZONES) {
  const viewport = page.viewportSize()!
  const chip = page.getByTestId(chipTestId)
  const box = await chip.boundingBox()
  if (!box) throw new Error(`${chipTestId} must be laid out`)

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2
  const target = toClient(viewport.width, viewport.height, ZONES[zone].x, ZONES[zone].y)

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + 20, startY + 10, { steps: 4 })
  await page.mouse.move(target.x, target.y, { steps: 8 })
  await page.mouse.up()
}

test.describe('SC-05 Materi 1: Fundamentals', () => {
  test('disables the auto tour for these tests via a pre-seeded session flag', async ({ page }) => {
    await gotoFundamental(page)
    await expect(page.locator('.driver-popover')).toHaveCount(0)
  })

  test('lays out header, peta konsep, anatomy, info organ, activity and nav controls', async ({ page }) => {
    await gotoFundamental(page)

    await expect(page.getByRole('heading', { name: 'SC-05 · Materi 1: Fundamentals' })).toBeVisible()
    await expect(page.getByText('Pengertian Anatomi dan Fisiologi Tubuh Manusia')).toBeVisible()
    await expect(page.getByTestId('fundamental-concept-panel')).toBeVisible()
    await expect(page.getByTestId('fundamental-anatomy')).toBeVisible()
    await expect(page.getByTestId('fundamental-info-panel')).toBeVisible()
    await expect(page.getByTestId('fundamental-activity')).toBeVisible()
    await expect(page.getByTestId('fundamental-back-button')).toBeVisible()
    await expect(page.getByTestId('fundamental-next-button')).toBeVisible()

    for (const id of ['bentuk_jantung', 'jantung_memompa', 'paru_kerucut', 'pertukaran_gas']) {
      await expect(page.getByTestId(`fundamental-chip-${id}`)).toBeVisible()
    }
  })

  test('matches the approved compact three-column Fundamentals composition', async ({ page }) => {
    await gotoFundamental(page)

    const [header, concept, anatomy, info, activity, mascot] = await Promise.all([
      boxInDesignSpace(page, 'fundamental-header'),
      boxInDesignSpace(page, 'fundamental-concept-panel'),
      boxInDesignSpace(page, 'fundamental-anatomy'),
      boxInDesignSpace(page, 'fundamental-info-panel'),
      boxInDesignSpace(page, 'fundamental-activity'),
      page.locator('.fundamental__mascot').evaluate((element, designWidth) => {
        const stage = document.querySelector<HTMLElement>('[data-testid="fundamental-stage"]')!
        const stageBox = stage.getBoundingClientRect()
        const box = element.getBoundingClientRect()
        const scale = stageBox.width / designWidth
        return {
          x: (box.x - stageBox.x) / scale,
          y: (box.y - stageBox.y) / scale,
          width: box.width / scale,
        }
      }, DESIGN_WIDTH),
    ])

    expectNear(header.x, 480)
    expectNear(header.y, 16)
    expectNear(header.width, 960)

    expectNear(concept.x, 245)
    expectNear(concept.y, 145)
    expectNear(concept.width, 410)
    expectNear(concept.height, 650)

    expectNear(anatomy.x, 675)
    expectNear(anatomy.y, 145)
    expectNear(anatomy.width, 540)
    expectNear(anatomy.height, 650)

    expectNear(info.x, 1235)
    expectNear(info.y, 145)
    expectNear(info.width, 440)
    expectNear(info.height, 565)

    expectNear(activity.x, 245)
    expectNear(activity.y, 800)
    expectNear(activity.width, 1430)
    expectNear(activity.height, 245)

    expectNear(mascot.x, 1660, 16)
    expectNear(mascot.y, 565, 16)
    expectNear(mascot.width, 280, 16)
  })

  test('loads the background, anatomy, organ preview and mascot artwork before visual review', async ({ page }) => {
    await gotoFundamental(page)
    await waitForFundamentalArtwork(page)
  })

  test('uses readable activity hierarchy and explicit drag-and-drop affordances', async ({ page }) => {
    await gotoFundamental(page)

    const styles = await page.evaluate(() => {
      const activityTitle = document.querySelector<HTMLElement>('.fundamental__activity-header .fundamental__panel-title')!
      const chip = document.querySelector<HTMLElement>('[data-testid="fundamental-chip-bentuk_jantung"]')!
      const zone = document.querySelector<HTMLElement>('.fundamental__zone-hit')!
      const zoneLabel = document.querySelector<HTMLElement>('.fundamental__zone-label')!
      const zoneArrow = document.querySelector<HTMLElement>('.fundamental__zone-arrow')!

      return {
        activityTitleSize: Number.parseFloat(getComputedStyle(activityTitle).fontSize),
        chipSize: Number.parseFloat(getComputedStyle(chip).fontSize),
        chipCursor: getComputedStyle(chip).cursor,
        chipAffordance: getComputedStyle(chip, '::after').content,
        zoneBorderWidth: Number.parseFloat(getComputedStyle(zone).borderTopWidth),
        zoneLabelSize: Number.parseFloat(getComputedStyle(zoneLabel).fontSize),
        zoneAffordance: zoneArrow.textContent,
      }
    })

    expect(styles.activityTitleSize).toBeGreaterThanOrEqual(24)
    expect(styles.chipSize).toBeGreaterThanOrEqual(17)
    expect(styles.chipCursor).toBe('grab')
    expect(styles.chipAffordance).toContain('SERET')
    expect(styles.zoneBorderWidth).toBeGreaterThanOrEqual(3)
    expect(styles.zoneLabelSize).toBeGreaterThanOrEqual(18)
    expect(styles.zoneAffordance).toContain('↓')
  })

  test('defaults to Jantung selected on the front view', async ({ page }) => {
    await gotoFundamental(page)

    await expect(page.getByTestId('fundamental-organ-name')).toHaveText('Jantung')
    await expect(page.getByText('Memompa darah ke seluruh tubuh.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Jantung', exact: true })).toHaveAttribute('aria-pressed', 'true')
  })

  test('every scene control is keyboard reachable with an accessible name', async ({ page }) => {
    await gotoFundamental(page)

    await expect(page.getByRole('button', { name: 'Kembali ke Beranda' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Bantuan materi fundamentals' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Putar ke tampilan belakang' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Pilih organ lain' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Paru-paru', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Letakkan di kotak Struktur' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Letakkan di kotak Fungsi' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Bentuk jantung memiliki empat ruang' })).toBeVisible()
    await expect(page.getByTestId('fundamental-back-button')).toBeVisible()
    await expect(page.getByTestId('fundamental-next-button')).toBeVisible()
  })

  test('clicking an organ hotspot updates the info organ panel', async ({ page }) => {
    await gotoFundamental(page)

    await page.getByTestId('fundamental-hotspot-hati').click()
    await expect(page.getByTestId('fundamental-organ-name')).toHaveText('Hati')
    await expect(page.getByText('Menyaring darah dan menghasilkan empedu.')).toBeVisible()
  })

  test('"Pilih organ lain" cycles to the next organ in the current view', async ({ page }) => {
    await gotoFundamental(page)

    const before = await page.getByTestId('fundamental-organ-name').textContent()
    await page.getByTestId('fundamental-pick-another').click()
    const after = await page.getByTestId('fundamental-organ-name').textContent()
    expect(after).not.toBe(before)
  })

  test('rotating to the back view swaps the available organs', async ({ page }) => {
    await gotoFundamental(page)

    await expect(page.getByTestId('fundamental-flip')).toHaveAttribute('data-mode', 'front')
    await expect(page.getByRole('button', { name: 'Jantung', exact: true })).toBeVisible()

    await page.getByTestId('fundamental-rotate-button').click()

    await expect(page.getByTestId('fundamental-flip')).toHaveAttribute('data-mode', 'back')
    await expect(page.getByRole('button', { name: 'Sumsum Tulang Belakang', exact: true })).toBeVisible()
    // The selection follows the view: Jantung has no back-view hotspot.
    await expect(page.getByTestId('fundamental-organ-name')).not.toHaveText('Jantung')
  })

  test('select-then-place keyboard/tap flow places a statement in the correct zone', async ({ page }) => {
    await gotoFundamental(page)

    const chip = page.getByTestId('fundamental-chip-jantung_memompa')
    await chip.click()
    await expect(chip).toHaveAttribute('aria-pressed', 'true')

    await page.getByRole('button', { name: 'Letakkan di kotak Fungsi' }).click()

    await expect(page.getByTestId('fundamental-feedback')).toContainText('Benar!')
    await expect(page.getByTestId('fundamental-progress-dots')).toHaveAttribute(
      'aria-label',
      'Kemajuan: 1 dari 4 pernyataan ditempatkan',
    )
  })

  test('placing a statement in the wrong zone shakes it back with a retry message', async ({ page }) => {
    await gotoFundamental(page)

    const chip = page.getByTestId('fundamental-chip-jantung_memompa')
    await chip.click()
    await page.getByRole('button', { name: 'Letakkan di kotak Struktur' }).click()

    await expect(page.getByTestId('fundamental-feedback')).toContainText('Belum tepat')
    await expect(chip).toBeVisible()
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('fundamental-progress-dots')).toHaveAttribute(
      'aria-label',
      'Kemajuan: 0 dari 4 pernyataan ditempatkan',
    )
  })

  test('dragging a chip onto its matching zone places it and advances progress', async ({ page }) => {
    await gotoFundamental(page)

    await dragChipToZone(page, 'fundamental-chip-bentuk_jantung', 'struktur')

    await expect(page.getByTestId('fundamental-progress-dots')).toHaveAttribute(
      'aria-label',
      'Kemajuan: 1 dari 4 pernyataan ditempatkan',
    )
  })

  test('the Lanjutkan button stays disabled until all four statements are placed correctly', async ({ page }) => {
    await gotoFundamental(page)

    const next = page.getByTestId('fundamental-next-button')
    await expect(next).toBeDisabled()

    await dragChipToZone(page, 'fundamental-chip-bentuk_jantung', 'struktur')
    await dragChipToZone(page, 'fundamental-chip-jantung_memompa', 'fungsi')
    await dragChipToZone(page, 'fundamental-chip-paru_kerucut', 'struktur')
    await expect(next).toBeDisabled()

    await dragChipToZone(page, 'fundamental-chip-pertukaran_gas', 'fungsi')
    await expect(next).toBeEnabled()

    await next.click()
    await expect(page.getByTestId('home-scene')).toBeVisible()
  })

  test('the back button returns to the SC-04 case study scene', async ({ page }) => {
    await gotoFundamental(page)
    await page.getByTestId('fundamental-back-button').click()
    await expect(page.getByTestId('case-study-scene')).toBeVisible()
  })

  test('the home button returns to Home', async ({ page }) => {
    await gotoFundamental(page)
    await page.getByTestId('fundamental-home-button').click()
    await expect(page.getByTestId('home-scene')).toBeVisible()
  })

  test('every element but the background pops in staggered on entry', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('anatoquest:case-study-tour-seen', '1')
    })
    await page.goto('/')
    await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })
    await page.getByTestId('splash-continue').click()
    await page.getByTestId('home-card-mulai-pembelajaran').click()
    await expect(page.getByTestId('case-study-scene')).toBeVisible()
    await expect(page.getByTestId('case-study-scene')).toHaveAttribute('data-phase', 'idle')

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
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'entering')

    const delays = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('.fundamental__anim')).map((element) => {
        const animation = element.getAnimations()[0]
        return animation?.effect?.getComputedTiming().delay ?? 0
      }),
    )

    expect(delays.length).toBeGreaterThan(8)
    expect(new Set(delays).size).toBeGreaterThan(5)

    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await expect(page.getByTestId('fundamental-stage').locator('.fundamental__background')).not.toHaveClass(
      /fundamental__anim/,
    )
  })

  test('reduced motion still allows placing a statement correctly', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await gotoFundamental(page)

    await dragChipToZone(page, 'fundamental-chip-bentuk_jantung', 'struktur')
    await expect(page.getByTestId('fundamental-progress-dots')).toHaveAttribute(
      'aria-label',
      'Kemajuan: 1 dari 4 pernyataan ditempatkan',
    )
  })

  test('stage stays inside the viewport on this device', async ({ page }) => {
    const viewport = page.viewportSize()!
    await gotoFundamental(page)

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(viewport.width)
  })

  test('the help button opens the guided tour on demand', async ({ page }) => {
    await gotoFundamental(page)

    await expect(page.locator('.driver-popover')).toHaveCount(0)
    await page.getByTestId('fundamental-help-button').click()
    await expect(page.locator('.driver-popover')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('.driver-popover')).toHaveCount(0)
  })

  test('captures the Fundamentals state for visual review', async ({ page }, testInfo) => {
    await gotoFundamental(page)
    await page.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}-fundamental.png`,
    })
  })

  test('captures the back view for visual review', async ({ page }, testInfo) => {
    await gotoFundamental(page)
    await page.getByTestId('fundamental-rotate-button').click()
    await page.waitForTimeout(750)
    await page.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}-fundamental-back.png`,
    })
  })

  test('placing both statements in a zone stacks them under the header without overlap', async ({ page }, testInfo) => {
    // Regression coverage for two fixed bugs: the placed-pill/header collision
    // (zone header is now a sibling row, not vertically centred with the
    // pills) and the reflow race (grabbing a pool chip while a sibling is
    // still snapping into its compacted slot used to compute a stale drag
    // offset). Deliberately placing out of statement order — struktur's two
    // statements back-to-back — exercises the reflow path the other test's
    // order does not.
    await gotoFundamental(page)
    await dragChipToZone(page, 'fundamental-chip-bentuk_jantung', 'struktur')
    await dragChipToZone(page, 'fundamental-chip-paru_kerucut', 'struktur')
    await dragChipToZone(page, 'fundamental-chip-jantung_memompa', 'fungsi')
    await dragChipToZone(page, 'fundamental-chip-pertukaran_gas', 'fungsi')

    await expect(page.getByTestId('fundamental-next-button')).toBeEnabled()

    const overlap = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>('[data-testid="fundamental-zone-struktur"] .fundamental__zone-header')!
      const firstPill = document.querySelector<HTMLElement>('[data-testid="fundamental-chip-bentuk_jantung"]')!
      const secondPill = document.querySelector<HTMLElement>('[data-testid="fundamental-chip-paru_kerucut"]')!
      const rects = [header, firstPill, secondPill].map((el) => el.getBoundingClientRect())
      const intersects = (a: DOMRect, b: DOMRect) =>
        a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
      return intersects(rects[0], rects[1]) || intersects(rects[0], rects[2]) || intersects(rects[1], rects[2])
    })
    expect(overlap).toBe(false)

    await page.mouse.move(0, 0)
    await page.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}-fundamental-filled.png`,
    })
  })
})
