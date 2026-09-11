import { expect, test, type Page } from '@playwright/test'

/**
 * SC-01 Splash validation.
 *
 * Layout assertions are derived from the Figma design coordinates
 * (frames "In Load" 1:3 and "After Load" 1:4 at 1920x1080), reprojected through
 * the same stage-scale formula the app uses, so a layout regression fails here
 * rather than in review.
 */

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 640
const SAFE_HEIGHT = 764

const DESIGN_BOXES = {
  'splash-logo': { x: 255, y: 159, width: 437, height: 401 },
  'splash-progressbar': { x: 194, y: 661, width: 559, height: 33 },
  'splash-touch-icon': { x: 417, y: 605, width: 115, height: 160 },
  'splash-touch-label': { x: 271, y: 809, width: 442, height: 34 },
} as const

type DesignKey = keyof typeof DESIGN_BOXES

function stageScale(viewportWidth: number, viewportHeight: number): number {
  const cover = Math.max(viewportWidth / DESIGN_WIDTH, viewportHeight / DESIGN_HEIGHT)
  const safeContain = Math.min(viewportWidth / SAFE_WIDTH, viewportHeight / SAFE_HEIGHT)
  return Math.min(cover, safeContain)
}

function expectedBox(key: DesignKey, viewportWidth: number, viewportHeight: number) {
  const scale = stageScale(viewportWidth, viewportHeight)
  const stageLeft = viewportWidth / 2 - (DESIGN_WIDTH / 2) * scale
  const stageTop = viewportHeight / 2 - (DESIGN_HEIGHT / 2) * scale
  const box = DESIGN_BOXES[key]

  return {
    x: stageLeft + box.x * scale,
    y: stageTop + box.y * scale,
    width: box.width * scale,
    height: box.height * scale,
  }
}

/**
 * Waits for every running enter/exit animation so geometry is measured at rest.
 * Two passes: the first can miss an animation that only registers once React has
 * committed the next phase.
 */
async function settleAnimations(page: Page) {
  const waitOnce = () =>
    page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          // Looping decoration (the touch prompt's pulse) never finishes.
          .filter(
            (animation) =>
              animation.effect?.getComputedTiming().iterations !== Infinity,
          )
          .map((animation) => animation.finished.catch(() => null)),
      ).then(
        () =>
          new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
      ),
    )

  await waitOnce()
  await waitOnce()
}

async function expectMatchesDesign(page: Page, key: DesignKey) {
  const viewport = page.viewportSize()
  if (!viewport) throw new Error('viewport size unavailable')

  await settleAnimations(page)

  const actual = await page.getByTestId(key).boundingBox()
  expect(actual, `${key} must be laid out`).not.toBeNull()

  const expected = expectedBox(key, viewport.width, viewport.height)
  const tolerance = 2

  expect(Math.abs(actual!.x - expected.x), `${key} x`).toBeLessThanOrEqual(tolerance)
  expect(Math.abs(actual!.y - expected.y), `${key} y`).toBeLessThanOrEqual(tolerance)
  expect(Math.abs(actual!.width - expected.width), `${key} width`).toBeLessThanOrEqual(
    tolerance,
  )
  expect(
    Math.abs(actual!.height - expected.height),
    `${key} height`,
  ).toBeLessThanOrEqual(tolerance)
}

test.describe('SC-01 Splash', () => {
  test('loads with logo and progress laid out as designed', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('splash-scene')).toBeVisible()
    await expect(page.getByTestId('splash-logo')).toBeVisible()
    await expect(page.getByTestId('splash-loading')).toBeVisible()

    // Prompt state must not leak into the loading state.
    await expect(page.getByTestId('splash-touch-icon')).toHaveCount(0)
    await expect(page.getByTestId('splash-continue')).toHaveCount(0)

    await expectMatchesDesign(page, 'splash-logo')
    await expectMatchesDesign(page, 'splash-progressbar')

    await expect(page.getByTestId('splash-loading-label')).toHaveText(
      /^\d{1,3}% Memuat Konten$/,
    )
  })

  test('progress bar reports real preload progress and reaches 100%', async ({
    page,
  }) => {
    await page.goto('/')

    const bar = page.getByTestId('splash-progressbar')
    await expect(bar).toHaveAttribute('role', 'progressbar')
    await expect(bar).toHaveAttribute('aria-valuemin', '0')
    await expect(bar).toHaveAttribute('aria-valuemax', '100')

    const startValue = Number(await bar.getAttribute('aria-valuenow'))
    expect(startValue).toBeLessThan(100)

    // Progress must actually advance rather than sit at a decorative value.
    await expect
      .poll(async () => Number(await bar.getAttribute('aria-valuenow')), {
        timeout: 15_000,
      })
      .toBeGreaterThan(startValue)

    // The scene records the last reported progress, so completion is assertable
    // even after the bar has left the DOM.
    await expect(page.getByTestId('splash-scene')).toHaveAttribute(
      'data-progress',
      '100',
      { timeout: 15_000 },
    )

    await expect(page.getByTestId('splash-touch-label')).toBeVisible({
      timeout: 15_000,
    })
    expect(await page.getByTestId('splash-loading').count()).toBe(0)
  })

  test('completing the preload swaps to the tap prompt', async ({ page }) => {
    await page.goto('/')

    const touchLabel = page.getByTestId('splash-touch-label')
    await expect(touchLabel).toBeVisible({ timeout: 15_000 })
    await expect(touchLabel).toHaveText('Ketuk Dimana Saja untuk Melanjutkan')

    // Loading group must be gone once the prompt is up.
    await expect(page.getByTestId('splash-loading')).toHaveCount(0)

    // Logo survives the transition, in the same place, per the Figma frames.
    await expect(page.getByTestId('splash-logo')).toBeVisible()
    await expectMatchesDesign(page, 'splash-logo')
    await expectMatchesDesign(page, 'splash-touch-icon')
    await expectMatchesDesign(page, 'splash-touch-label')

    await expect(page.getByRole('status')).toHaveText(
      'Konten siap. Ketuk di mana saja untuk melanjutkan.',
    )
  })

  test('tapping anywhere leaves splash for the blank home stage', async ({ page }) => {
    const viewport = page.viewportSize()!
    await page.goto('/')

    await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })

    // A corner click proves the affordance really covers the whole surface.
    await page.mouse.click(viewport.width - 8, viewport.height - 8)

    await expect(page.getByTestId('home-scene')).toBeVisible()
    await expect(page.getByTestId('splash-scene')).toHaveCount(0)
  })

  test('keyboard can continue without a pointer', async ({ page }) => {
    await page.goto('/')

    const continueButton = page.getByTestId('splash-continue')
    await expect(continueButton).toBeVisible({ timeout: 15_000 })
    await expect(continueButton).toHaveAccessibleName(
      'Ketuk Dimana Saja untuk Melanjutkan',
    )

    // Enter works straight away, with no prior focus move.
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('home-scene')).toBeVisible()
  })

  test('the continue surface is reachable by Tab', async ({ page }) => {
    await page.goto('/')

    const continueButton = page.getByTestId('splash-continue')
    await expect(continueButton).toBeVisible({ timeout: 15_000 })

    await page.keyboard.press('Tab')
    await expect(continueButton).toBeFocused()

    await page.keyboard.press('Space')
    await expect(page.getByTestId('home-scene')).toBeVisible()
  })

  test('stage stays inside the viewport on this device', async ({ page }) => {
    const viewport = page.viewportSize()!
    await page.goto('/')

    await expect(page.getByTestId('splash-touch-label')).toBeVisible({
      timeout: 15_000,
    })

    for (const key of ['splash-logo', 'splash-touch-icon', 'splash-touch-label'] as const) {
      const box = await page.getByTestId(key).boundingBox()
      expect(box, `${key} must be laid out`).not.toBeNull()
      expect(box!.x, `${key} left edge`).toBeGreaterThanOrEqual(-1)
      expect(box!.y, `${key} top edge`).toBeGreaterThanOrEqual(-1)
      expect(box!.x + box!.width, `${key} right edge`).toBeLessThanOrEqual(
        viewport.width + 1,
      )
      expect(box!.y + box!.height, `${key} bottom edge`).toBeLessThanOrEqual(
        viewport.height + 1,
      )
    }

    // No horizontal page scroll on any target size.
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(viewport.width)
  })

  test('logo glows and the tap prompt breathes on a loop', async ({ page }) => {
    await page.goto('/')

    const logoFilter = await page
      .getByTestId('splash-logo')
      .evaluate((node) => getComputedStyle(node).filter)
    expect(logoFilter).toContain('drop-shadow')

    await expect(page.getByTestId('splash-touch-icon')).toBeVisible({
      timeout: 15_000,
    })

    const pulse = await page.getByTestId('splash-touch-icon').evaluate((node) => {
      const art = node.querySelector('img')!
      const looping = art
        .getAnimations()
        .find(
          (animation) =>
            animation.effect?.getComputedTiming().iterations === Infinity,
        )
      return {
        found: Boolean(looping),
        duration: looping?.effect?.getComputedTiming().duration ?? 0,
      }
    })

    expect(pulse.found).toBe(true)
    // "Lambat": a slow breath, not a nervous blink.
    expect(Number(pulse.duration)).toBeGreaterThanOrEqual(1500)

    // The loop must not shift the prompt's layout box.
    await expectMatchesDesign(page, 'splash-touch-icon')
  })

  test('reduced motion drops the looping pulse', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    await expect(page.getByTestId('splash-touch-icon')).toBeVisible({
      timeout: 15_000,
    })

    const loopingCount = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.effect?.getComputedTiming().iterations === Infinity,
          ).length,
    )

    expect(loopingCount).toBe(0)
  })

  test('reduced motion still completes the whole flow', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    await expect(page.getByTestId('splash-touch-label')).toBeVisible({
      timeout: 15_000,
    })
    await page.getByTestId('splash-continue').click()
    await expect(page.getByTestId('home-scene')).toBeVisible()
  })

  test('captures splash states for visual review', async ({ page }, testInfo) => {
    const shot = (state: string) =>
      `e2e/screenshots/${testInfo.project.name}-${state}.png`

    await page.goto('/')

    await expect(page.getByTestId('splash-loading')).toBeVisible()
    await page.waitForTimeout(900)
    await page.screenshot({ path: shot('in-load') })

    await expect(page.getByTestId('splash-touch-label')).toBeVisible({
      timeout: 15_000,
    })
    await page.waitForTimeout(900)
    await page.screenshot({ path: shot('after-load') })
  })
})
