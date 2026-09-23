import { expect, test, type Page } from '@playwright/test'

/**
 * SC-04 Apersepsi & Studi Kasus validation.
 *
 * Layout assertions are derived from the Figma "Studi Kasus" frame (node
 * 27:22, 1920x1080), reprojected through the same stage-scale formula the
 * app uses, so a layout regression fails here rather than in review.
 *
 * PROPOSED restructure (case-brief HTML/CSS card, "Analisis Tubuh" /
 * "Gejala Pasien" column headings, a plain "Progres Analisis — n/4"
 * readout, and an explicit Periksa Analisis -> Lanjut ke Pembahasan ->
 * Mulai Materi 1 review flow) — see caseStudyContent.ts.
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

// Must match CASE_STUDY_ORGANS in src/scenes/case-study/caseStudyContent.ts.
const HOTSPOTS = {
  lung: { x: 814, y: 582 },
  heart: { x: 797, y: 632 },
} as const

/** Goes straight to the SC-04 scene and waits for its enter animation. */
async function gotoCaseStudy(page: Page) {
  await page.goto('/')
  await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })
  await page.getByTestId('splash-continue').click()
  await expect(page.getByTestId('home-scene')).toBeVisible()
  await page.getByTestId('home-card-mulai-pembelajaran').click()
  await expect(page.getByTestId('petunjuk-scene')).toBeVisible()
  await page.getByTestId('petunjuk-next-button').click()
  await expect(page.getByTestId('case-study-scene')).toBeVisible()
  await expect(page.getByTestId('case-study-scene')).toHaveAttribute('data-phase', 'idle')
  await page.mouse.move(0, 0)
}

/** Drags a symptom card (by design-space centre) onto a hotspot. */
async function dragCardToHotspot(
  page: Page,
  cardTestId: string,
  hotspot: keyof typeof HOTSPOTS,
) {
  const viewport = page.viewportSize()!
  const card = page.getByTestId(cardTestId)
  const cardBox = await card.boundingBox()
  if (!cardBox) throw new Error(`${cardTestId} must be laid out`)

  const startX = cardBox.x + cardBox.width / 2
  const startY = cardBox.y + cardBox.height / 2
  const target = toClient(viewport.width, viewport.height, HOTSPOTS[hotspot].x, HOTSPOTS[hotspot].y)

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + 20, startY + 10, { steps: 4 })
  await page.mouse.move(target.x, target.y, { steps: 8 })
  await page.mouse.up()
}

async function placeAllFour(page: Page) {
  await dragCardToHotspot(page, 'case-study-card-sesak_napas', 'lung')
  await dragCardToHotspot(page, 'case-study-card-jantung_berdebar', 'heart')
  await dragCardToHotspot(page, 'case-study-card-lelah', 'heart')
  await dragCardToHotspot(page, 'case-study-card-pucat', 'heart')
}

test.describe('SC-04 Apersepsi & Studi Kasus', () => {
  test('lays out title, case brief, column headings, hotspots, cards and the progress panel', async ({
    page,
  }) => {
    await gotoCaseStudy(page)

    await expect(page.getByRole('heading', { name: 'Analisis Kasus Pasien' })).toBeVisible()
    await expect(page.getByText('Analisis gejala yang dialami pasien.')).toBeVisible()

    await expect(page.getByTestId('case-study-brief')).toContainText('Kasus 01 — Analisis Gejala')
    await expect(page.getByTestId('case-study-brief')).toContainText('sesak napas')
    await expect(page.getByTestId('case-study-brief')).toContainText('Tugasmu:')

    await expect(page.getByText('Analisis Tubuh')).toBeVisible()
    await expect(page.getByText('Gejala Pasien')).toBeVisible()

    await expect(page.getByTestId('case-study-anatomy')).toBeVisible()
    await expect(page.getByTestId('case-study-hotspot-lung')).toBeVisible()
    await expect(page.getByTestId('case-study-hotspot-heart')).toBeVisible()

    for (const id of ['sesak_napas', 'jantung_berdebar', 'lelah', 'pucat']) {
      await expect(page.getByTestId(`case-study-card-${id}`)).toBeVisible()
    }

    await expect(page.getByTestId('case-study-prompt')).toHaveText('Progres Analisis — 0 / 4')
    await expect(page.getByTestId('case-study-bottom-next-button')).toHaveText(/Periksa Analisis/)
    await expect(page.getByTestId('case-study-bottom-next-button')).toBeDisabled()
  })

  test('every scene control is keyboard reachable with an accessible name', async ({ page }) => {
    await gotoCaseStudy(page)

    await expect(page.getByRole('button', { name: 'Kembali ke Beranda' })).toBeVisible()
    await expect(page.getByRole('button', { name: /musik latar/ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Paru-paru', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Jantung', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sesak napas', exact: true })).toBeVisible()
  })

  test('select-then-place keyboard/tap flow places a symptom on the correct organ', async ({
    page,
  }) => {
    await gotoCaseStudy(page)

    const card = page.getByTestId('case-study-card-sesak_napas')
    await card.click()
    await expect(card).toHaveAttribute('aria-pressed', 'true')

    await page.getByTestId('case-study-hotspot-lung').click()

    // Correctness + explanation go to a screen-reader-only status region;
    // the visible panel stays a plain progress readout (see PROPOSED note).
    await expect(page.locator('.case-study__sr-only')).toContainText('Benar!')
    await expect(page.getByTestId('case-study-card-sesak_napas')).not.toHaveAttribute(
      'aria-pressed',
      'true',
    )
    // Placed cards re-render without button semantics (no longer interactive).
    await expect(page.getByTestId('case-study-card-sesak_napas')).not.toHaveRole('button')
    await expect(page.getByTestId('case-study-prompt')).toHaveText('Progres Analisis — 1 / 4')
  })

  test('selecting the wrong organ shakes the card back and keeps it selected for a retry', async ({
    page,
  }) => {
    await gotoCaseStudy(page)

    const card = page.getByTestId('case-study-card-sesak_napas')
    await card.click()
    await page.getByTestId('case-study-hotspot-heart').click()

    await expect(page.locator('.case-study__sr-only')).toHaveText(
      'Belum tepat. Coba pikirkan organ lain yang berkaitan dengan gejala ini.',
    )
    // Still pending and still selected, so the learner can immediately retry
    // another organ without reselecting the card.
    await expect(card).toBeVisible()
    await expect(card).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('case-study-prompt')).toHaveText('Progres Analisis — 0 / 4')
  })

  test('dragging a card onto its matching hotspot places it and advances progress', async ({
    page,
  }) => {
    await gotoCaseStudy(page)

    await expect(page.getByTestId('case-study-progress-dots')).toHaveAttribute(
      'aria-label',
      'Kemajuan: 0 dari 4 gejala ditempatkan',
    )

    await dragCardToHotspot(page, 'case-study-card-sesak_napas', 'lung')

    await expect(page.getByTestId('case-study-progress-dots')).toHaveAttribute(
      'aria-label',
      'Kemajuan: 1 dari 4 gejala ditempatkan',
    )
  })

  test('dragging a card onto the wrong hotspot returns it to its resting position', async ({
    page,
  }) => {
    await gotoCaseStudy(page)

    const card = page.getByTestId('case-study-card-jantung_berdebar')
    const before = await card.boundingBox()

    await dragCardToHotspot(page, 'case-study-card-jantung_berdebar', 'lung')

    await expect(page.getByTestId('case-study-progress-dots')).toHaveAttribute(
      'aria-label',
      'Kemajuan: 0 dari 4 gejala ditempatkan',
    )
    await expect
      .poll(async () => (await card.boundingBox())?.x)
      .toBeCloseTo(before!.x, 0)
  })

  test('placing all four symptoms requires an explicit check before the pembahasan and Mulai Materi', async ({
    page,
  }) => {
    await gotoCaseStudy(page)
    await placeAllFour(page)

    await expect(page.getByTestId('case-study-progress-dots')).toHaveAttribute(
      'aria-label',
      'Kemajuan: 4 dari 4 gejala ditempatkan',
    )
    await expect(page.getByTestId('case-study-prompt')).toHaveText('Progres Analisis — 4 / 4')

    const nextButton = page.getByTestId('case-study-bottom-next-button')
    await expect(nextButton).toBeEnabled()
    await expect(nextButton).toHaveText(/Periksa Analisis/)

    await nextButton.click()
    await expect(nextButton).toHaveText(/Lanjut ke Pembahasan/)

    await nextButton.click()
    await expect(page.getByText('Hasil Analisis')).toBeVisible()
    await expect(nextButton).toHaveText(/Mulai Materi 1/)

    await nextButton.click()
    await expect(page.getByTestId('fundamental-scene')).toBeVisible()
  })

  test('the home button returns to Home', async ({ page }) => {
    await gotoCaseStudy(page)
    await page.getByTestId('case-study-home-button').click()
    await expect(page.getByTestId('home-scene')).toBeVisible()
  })

  test('every element but the background pops in staggered on entry', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })
    await page.getByTestId('splash-continue').click()
    await page.getByTestId('home-card-mulai-pembelajaran').click()
    await page.getByTestId('petunjuk-next-button').click()
    await expect(page.getByTestId('case-study-scene')).toBeVisible()
    await expect(page.getByTestId('case-study-scene')).toHaveAttribute('data-phase', 'entering')

    const delays = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('.case-study__anim')).map((element) => {
        const animation = element.getAnimations()[0]
        return animation?.effect?.getComputedTiming().delay ?? 0
      }),
    )

    expect(delays.length).toBeGreaterThan(8)
    expect(new Set(delays).size).toBeGreaterThan(5)

    await expect(page.getByTestId('case-study-scene')).toHaveAttribute('data-phase', 'idle')
    // The background never carries the animation class.
    await expect(page.getByTestId('case-study-stage').locator('.case-study__background')).not.toHaveClass(
      /case-study__anim/,
    )
  })

  test('the home button plays a reverse-stagger exit before actually leaving the scene', async ({
    page,
  }) => {
    await gotoCaseStudy(page)

    await page.getByTestId('case-study-home-button').click()
    await expect(page.getByTestId('case-study-scene')).toHaveAttribute('data-phase', 'exiting')
    // Still on this scene right after the click — navigation is deferred
    // until the exit animation finishes.
    await expect(page.getByTestId('case-study-scene')).toBeVisible()
    await expect(page.getByTestId('home-scene')).toHaveCount(0)

    await expect(page.getByTestId('home-scene')).toBeVisible()
  })

  test('reduced motion skips the stagger delay but still exits before navigating', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await gotoCaseStudy(page)

    await page.getByTestId('case-study-home-button').click()
    await expect(page.getByTestId('home-scene')).toBeVisible({ timeout: 1_000 })
  })

  test('reduced motion still allows placing a symptom correctly', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await gotoCaseStudy(page)

    await dragCardToHotspot(page, 'case-study-card-sesak_napas', 'lung')
    await expect(page.getByTestId('case-study-progress-dots')).toHaveAttribute(
      'aria-label',
      'Kemajuan: 1 dari 4 gejala ditempatkan',
    )
  })

  test('stage stays inside the viewport on this device', async ({ page }) => {
    const viewport = page.viewportSize()!
    await gotoCaseStudy(page)

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(viewport.width)
  })

  test('captures the Studi Kasus state for visual review', async ({ page }, testInfo) => {
    await gotoCaseStudy(page)
    await page.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}-case-study.png`,
    })
  })

  test('captures the pembahasan card for visual review', async ({ page }, testInfo) => {
    await gotoCaseStudy(page)
    await placeAllFour(page)
    await page.getByTestId('case-study-bottom-next-button').click()
    await page.getByTestId('case-study-bottom-next-button').click()
    await expect(page.getByText('Hasil Analisis')).toBeVisible()
    await page.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}-case-study-complete.png`,
    })
  })
})
