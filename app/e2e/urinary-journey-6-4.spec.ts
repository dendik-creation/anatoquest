import { expect, test } from '@playwright/test'

test('microscene 6.4 synchronizes organ exploration and urine formation', async ({ page }, testInfo) => {
  await page.goto('/')

  const scene = page.getByTestId('urinary-journey-scene')
  await expect(scene).toBeVisible()
  await expect(scene).toHaveAttribute('data-microscene', '6.4')
  await expect(scene).toHaveAttribute('data-selected-step', 'darah-menuju-ginjal')
  await expect(scene).toHaveAttribute('data-selected-organ', 'ginjal')
  await expect(page.getByTestId('urinary-information')).toContainText('Ginjal')
  await page.waitForTimeout(1_200)
  await expect(page.locator('.urinary-journey__list')).toHaveCSS('opacity', '1')
  await expect(page.locator('.urinary-journey__anatomy')).toHaveCSS('opacity', '1')
  await expect(page.locator('.urinary-journey__info')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-urinary-journey-6-4-initial.png` })

  await page.getByTestId('urinary-organ-ureter').click()
  await expect(scene).toHaveAttribute('data-selected-organ', 'ureter')
  await expect(page.getByTestId('urinary-information')).toContainText('Ureter')

  await page.getByTestId('urinary-step-urin-terbentuk').click()
  await expect(scene).toHaveAttribute('data-selected-step', 'urin-terbentuk')
  await expect(page.getByTestId('urinary-information')).toContainText('Tahap 3 dari 4')

  await page.getByTestId('urinary-play-button').click()
  await expect(scene).toHaveAttribute('data-playing', 'true')
  await expect(page.getByTestId('urinary-play-button')).toBeDisabled()
  await expect(page.locator('.urinary-journey__loading')).toBeVisible()
  await expect(scene).toHaveAttribute('data-selected-step', 'darah-menuju-ginjal')
  await expect(scene).toHaveAttribute('data-selected-step', 'darah-disaring', { timeout: 3_500 })
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-urinary-journey-6-4-filtration.png` })
  await expect(scene).toHaveAttribute('data-selected-step', 'urin-terbentuk', { timeout: 3_500 })
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-urinary-journey-6-4-urine.png` })
  await expect(scene).toHaveAttribute('data-selected-step', 'urin-dialirkan', { timeout: 3_500 })
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-urinary-journey-6-4-flow.png` })
  await expect(scene).toHaveAttribute('data-complete', 'true', { timeout: 3_500 })
  await expect(page.getByTestId('urinary-complete-message')).toBeVisible()
  await expect(page.getByTestId('urinary-play-button')).toContainText('Putar Ulang')
  for (const step of ['darah-menuju-ginjal', 'darah-disaring', 'urin-terbentuk', 'urin-dialirkan'] as const) {
    await expect(page.getByTestId(`urinary-step-${step}`)).toHaveAttribute('data-complete', 'true')
  }
})
