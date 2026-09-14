import { expect, test, type Page } from '@playwright/test'

async function gotoFundamental(page: Page) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('anatoquest:case-study-tour-seen', '1')
  })
  await page.goto('/')
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-mulai-pembelajaran').click()

  const placements: Array<[string, 'lung' | 'heart']> = [
    ['sesak_napas', 'lung'],
    ['jantung_berdebar', 'heart'],
    ['lelah', 'heart'],
    ['pucat', 'heart'],
  ]
  for (const [symptom, organ] of placements) {
    await page.getByTestId(`case-study-card-${symptom}`).click()
    await page.getByTestId(`case-study-hotspot-${organ}`).click()
  }
  await page.getByTestId('case-study-next-button').click()
  await expect(page.getByTestId('fundamental-scene')).toBeVisible()
  await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
}

test.describe('SC-05 microscene 4.1', () => {
  test('renders the anatomy and physiology introduction from supplied assets', async ({ page }) => {
    await gotoFundamental(page)

    await expect(page.getByRole('heading', { name: 'Pengertian Anatomi dan Fisiologi Tubuh Manusia' })).toBeVisible()
    await expect(page.getByTestId('fundamental-anatomy-panel')).toContainText('Struktur membentuk tubuh.')
    await expect(page.getByTestId('fundamental-physiology-panel')).toContainText('Fungsi menjaga kehidupan.')
    await expect(page.getByTestId('fundamental-anatomy')).toBeVisible()
    await expect(page.getByTestId('fundamental-relation')).toContainText('Struktur + Fungsi')

    const anatomy = await page.getByTestId('fundamental-anatomy-panel').boundingBox()
    const physiology = await page.getByTestId('fundamental-physiology-panel').boundingBox()
    const relation = await page.getByTestId('fundamental-relation').boundingBox()
    expect(anatomy).not.toBeNull()
    expect(physiology).not.toBeNull()
    expect(relation).not.toBeNull()
    expect(anatomy!.x + anatomy!.width).toBeLessThan(relation!.x)
    expect(relation!.x + relation!.width).toBeLessThan(physiology!.x)
  })

  test('uses the reusable audio control and keeps the primary action available', async ({ page }) => {
    await gotoFundamental(page)
    const audio = page.getByTestId('fundamental-audio-button')
    await expect(audio).toHaveAttribute('aria-pressed', 'true')
    await audio.click()
    await expect(audio).toHaveAttribute('aria-pressed', 'false')
    await expect(audio).toHaveAccessibleName('Aktifkan musik latar')
    await expect(page.getByTestId('fundamental-next-button')).toBeEnabled()
  })

  test('animates heading separately and staggers bubble transitions for the remaining elements', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('anatoquest:case-study-tour-seen', '1')
    })
    await page.goto('/')
    await page.getByTestId('splash-continue').click()
    await page.getByTestId('home-card-mulai-pembelajaran').click()

    for (const [symptom, organ] of [
      ['sesak_napas', 'lung'], ['jantung_berdebar', 'heart'], ['lelah', 'heart'], ['pucat', 'heart'],
    ] as const) {
      await page.getByTestId(`case-study-card-${symptom}`).click()
      await page.getByTestId(`case-study-hotspot-${organ}`).click()
    }
    await page.getByTestId('case-study-next-button').click()

    const scene = page.getByTestId('fundamental-scene')
    await expect(scene).toHaveAttribute('data-phase', 'entering')
    await expect(page.getByTestId('fundamental-header')).toHaveCSS('animation-name', /fundamental-heading-in/)
    await expect(page.getByTestId('fundamental-anatomy-panel')).toHaveCSS('animation-name', /fundamental-bubble-in/)
    const staggeredDelays = await page.locator('.fundamental__anim').evaluateAll((elements) =>
      elements.map((element) => element.getAnimations()[0]?.effect?.getComputedTiming().delay ?? 0),
    )
    expect(new Set(staggeredDelays).size).toBeGreaterThan(5)
  })

  test('reverses the heading and bubble transitions before leaving the microscene', async ({ page }) => {
    await gotoFundamental(page)
    await page.getByTestId('fundamental-top-back-button').click()

    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'exiting')
    await expect(page.getByTestId('fundamental-header')).toHaveCSS('animation-name', /fundamental-heading-out/)
    await expect(page.getByTestId('fundamental-anatomy-panel')).toHaveCSS('animation-name', /fundamental-bubble-out/)
    await expect(page.getByTestId('case-study-scene')).toBeVisible()
  })

  test('captures microscene 4.1 for visual audit', async ({ page }, testInfo) => {
    await gotoFundamental(page)
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-fundamental-4-1.png` })
  })
})
