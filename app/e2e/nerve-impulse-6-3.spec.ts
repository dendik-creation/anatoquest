import { expect, test } from '@playwright/test'

test('microscene 6.3 synchronizes anatomy exploration and the impulse journey', async ({ page }, testInfo) => {
  await page.goto('/')

  const scene = page.getByTestId('nerve-impulse-scene')
  await expect(scene).toBeVisible()
  await expect(scene).toHaveAttribute('data-microscene', '6.3')
  await expect(scene).toHaveAttribute('data-selected-step', 'rangsangan')
  await expect(scene).toHaveAttribute('data-selected-anatomy', 'otak')
  await expect(page.getByTestId('nerve-information')).toContainText('Otak')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-nerve-impulse-6-3-initial.png` })

  await page.getByTestId('nerve-organ-sumsum').click()
  await expect(scene).toHaveAttribute('data-selected-anatomy', 'sumsum')
  await expect(page.getByTestId('nerve-information')).toContainText('Sumsum Tulang Belakang')

  await page.getByTestId('nerve-step-diproses').click()
  await expect(scene).toHaveAttribute('data-selected-step', 'diproses')
  await expect(page.getByTestId('nerve-information')).toContainText('Tahap 3 dari 4')

  await page.getByTestId('nerve-play-button').click()
  await expect(scene).toHaveAttribute('data-playing', 'true')
  await expect(page.getByTestId('nerve-play-button')).toBeDisabled()
  await expect(page.locator('.nerve-impulse__loading')).toBeVisible()
  await expect(scene).toHaveAttribute('data-selected-step', 'rangsangan')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-nerve-impulse-6-3-stimulus.png` })
  await expect(scene).toHaveAttribute('data-selected-step', 'impuls', { timeout: 3_500 })
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-nerve-impulse-6-3-ascending.png` })
  await expect(scene).toHaveAttribute('data-selected-step', 'diproses', { timeout: 3_500 })
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-nerve-impulse-6-3-processing.png` })
  await expect(scene).toHaveAttribute('data-selected-step', 'respons', { timeout: 3_500 })
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-nerve-impulse-6-3-response.png` })
  await expect(scene).toHaveAttribute('data-complete', 'true', { timeout: 3_500 })
  await expect(page.getByTestId('nerve-complete-message')).toBeVisible()
  await expect(page.getByTestId('nerve-play-button')).toContainText('Putar Ulang')
  for (const step of ['rangsangan', 'impuls', 'diproses', 'respons'] as const) {
    await expect(page.getByTestId(`nerve-step-${step}`)).toHaveAttribute('data-complete', 'true')
  }
})
