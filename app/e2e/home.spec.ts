import { expect, test, type Page } from '@playwright/test'

/**
 * SC-02 Home validation.
 *
 * Layout assertions are derived from the Figma "Home" frame (node 16:2, at
 * 1920x1080), reprojected through the same stage-scale formula the app uses,
 * so a layout regression fails here rather than in review.
 */

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

const DESIGN_BOXES = {
  'home-logo': { x: 90, y: 19, width: 230, height: 211 },
  'home-info-button': { x: 1603, y: 78, width: 93, height: 93 },
  'home-audio-button': { x: 1747, y: 78, width: 93, height: 93 },
  'home-card-mulai-pembelajaran': { x: 90, y: 278, width: 396, height: 611 },
  'home-card-materi': { x: 561, y: 278, width: 278, height: 298 },
  'home-card-simulasi-organ': { x: 881, y: 278, width: 277, height: 298 },
  'home-card-mini-game': { x: 1199, y: 278, width: 266, height: 298 },
  'home-card-kuis': { x: 561, y: 594, width: 395, height: 295 },
  'home-card-glosarium': { x: 979, y: 594, width: 415, height: 295 },
  'home-mascot': { x: 1417, y: 196, width: 483, height: 724 },
  'home-exit-button': { x: 90, y: 920, width: 237, height: 86 },
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

/** Waits for every running enter/exit animation so geometry is measured at rest. */
async function settleAnimations(page: Page) {
  const waitOnce = () =>
    page.evaluate(() =>
      Promise.all(
        document.getAnimations().map((animation) => animation.finished.catch(() => null)),
      ).then(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))),
    )

  await waitOnce()
  await waitOnce()
}

async function expectMatchesDesign(page: Page, key: DesignKey) {
  const viewport = page.viewportSize()
  if (!viewport) throw new Error('viewport size unavailable')

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

/** Skips straight past the SC-01 tap prompt into Home. */
async function gotoHome(page: Page) {
  await page.goto('/')
  await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })
  await page.getByTestId('splash-continue').click()
  await expect(page.getByTestId('home-scene')).toBeVisible()

  // The click above leaves the virtual cursor parked mid-viewport, which can
  // land on a Home element and trigger its hover-scale affordance. Move the
  // mouse off-stage so layout assertions measure the resting geometry.
  await page.mouse.move(0, 0)
}

test.describe('SC-02 Home', () => {
  test('lays out every element as designed', async ({ page }) => {
    await gotoHome(page)
    await settleAnimations(page)

    for (const key of Object.keys(DESIGN_BOXES) as DesignKey[]) {
      await expect(page.getByTestId(key)).toBeVisible()
      await expectMatchesDesign(page, key)
    }

    await expect(page.getByTestId('home-title')).toHaveText('Pilih Aktivitas Belajar')
    await expect(page.getByTestId('home-subtitle')).toHaveText(
      'Jelajahi anatomi dan fisiologi tubuh manusia melalui aktivitas interaktif.',
    )
  })

  test('every activity card has an accessible name and is reachable by keyboard', async ({
    page,
  }) => {
    await gotoHome(page)

    const expectedNames = [
      'Mulai Pembelajaran',
      'Materi',
      'Simulasi Organ',
      'Mini Game',
      'Kuis',
      'Glosarium',
    ]

    for (const name of expectedNames) {
      await expect(page.getByRole('button', { name, exact: true })).toBeVisible()
    }
  })

  test('elements pop in staggered rather than simultaneously', async ({ page }) => {
    await gotoHome(page)

    const delays = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('.home__anim')).map((element) => {
        const animation = element.getAnimations()[0]
        return animation?.effect?.getComputedTiming().delay ?? 0
      }),
    )

    expect(delays.length).toBeGreaterThan(5)
    // Distinct delays prove the elements are staggered, not synced.
    expect(new Set(delays).size).toBeGreaterThan(5)
  })

  test('a card scales up on hover and down while pressed', async ({ page }) => {
    await gotoHome(page)
    await settleAnimations(page)

    const card = page.getByTestId('home-card-materi')
    const restBox = await card.boundingBox()
    expect(restBox).not.toBeNull()

    await card.hover()
    await expect
      .poll(async () => (await card.boundingBox())!.width)
      .toBeGreaterThan(restBox!.width)

    await page.mouse.down()
    await expect
      .poll(async () => (await card.boundingBox())!.width)
      .toBeLessThan(restBox!.width)
    await page.mouse.up()
  })

  test('reduced motion drops the hover/press scale effect', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await gotoHome(page)
    await settleAnimations(page)

    const card = page.getByTestId('home-card-materi')
    const restBox = await card.boundingBox()
    expect(restBox).not.toBeNull()

    await card.hover()
    await page.waitForTimeout(250)
    const hoverBox = await card.boundingBox()
    expect(Math.abs(hoverBox!.width - restBox!.width)).toBeLessThanOrEqual(1)
  })

  test('reduced motion still renders every element without stagger delay', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await gotoHome(page)
    await settleAnimations(page)

    for (const key of Object.keys(DESIGN_BOXES) as DesignKey[]) {
      await expect(page.getByTestId(key)).toBeVisible()
    }
  })

  test('audio toggle switches icon and pressed state', async ({ page }) => {
    await gotoHome(page)

    const audioButton = page.getByTestId('home-audio-button')
    await expect(audioButton).toHaveAttribute('aria-pressed', 'true')
    await expect(audioButton).toHaveAccessibleName('Matikan musik latar')

    await audioButton.click()
    await expect(audioButton).toHaveAttribute('aria-pressed', 'false')
    await expect(audioButton).toHaveAccessibleName('Aktifkan musik latar')
  })

  test('info button opens and closes an accessible dialog', async ({ page }) => {
    await gotoHome(page)

    await page.getByTestId('home-info-button').click()
    const dialog = page.getByRole('dialog', { name: 'Tentang AnatoQuest' })
    await expect(dialog).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(page.getByTestId('home-info-button')).toBeFocused()
  })

  test('exit button opens a Ya/Tidak confirm dialog; Tidak cancels', async ({ page }) => {
    await gotoHome(page)

    await page.getByTestId('home-exit-button').click()
    await expect(page.getByTestId('home-exit-dialog')).toBeVisible()
    await expect(
      page.getByRole('alertdialog', { name: 'Yakin ingin keluar?' }),
    ).toBeVisible()

    await page.getByTestId('home-exit-cancel').click()
    await expect(page.getByTestId('home-exit-dialog')).toHaveCount(0)
    await expect(page.getByTestId('home-exit-button')).toBeFocused()
  })

  test('confirming exit plays the reverse stagger before the window closes', async ({
    page,
  }) => {
    await gotoHome(page)

    await page.getByTestId('home-exit-button').click()
    await page.getByTestId('home-exit-confirm').click()

    await expect(page.getByTestId('home-scene')).toHaveAttribute('data-phase', 'exiting')
    // window.close() is a no-op on a non-script-opened tab; the scene must not
    // throw and should hold its exiting state rather than getting stuck mid-way.
    await page.waitForTimeout(300)
    await expect(page.getByTestId('home-scene')).toHaveAttribute('data-phase', 'exiting')
  })

  test('escape cancels the exit-confirm dialog', async ({ page }) => {
    await gotoHome(page)

    await page.getByTestId('home-exit-button').click()
    await expect(page.getByTestId('home-exit-dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByTestId('home-exit-dialog')).toHaveCount(0)
  })

  test('stage stays inside the viewport on this device', async ({ page }) => {
    const viewport = page.viewportSize()!
    await gotoHome(page)
    await settleAnimations(page)

    for (const key of Object.keys(DESIGN_BOXES) as DesignKey[]) {
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

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(viewport.width)
  })

  test('captures the Home state for visual review', async ({ page }, testInfo) => {
    await gotoHome(page)
    await settleAnimations(page)
    await page.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}-home.png`,
    })
  })
})
