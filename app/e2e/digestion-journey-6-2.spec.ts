import { expect, test } from '@playwright/test'

test('microscene 6.2 synchronizes manual stage selection and the food journey', async ({ page }, testInfo) => {
  await page.goto('/')

  const scene = page.getByTestId('digestion-journey-scene')
  await expect(scene).toBeVisible()
  await expect(scene).toHaveAttribute('data-microscene', '6.2')
  await expect(scene).toHaveAttribute('data-selected', 'mulut')
  await expect(page.getByTestId('digestion-information')).toContainText('Mulut')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-digestion-journey-6-2-initial.png` })

  await page.getByTestId('digestion-organ-lambung').click()
  await expect(scene).toHaveAttribute('data-selected', 'lambung')
  await expect(page.getByTestId('digestion-stage-lambung')).toHaveAttribute('data-active', 'true')
  await expect(page.getByTestId('digestion-information')).toContainText('Lambung')

  await page.getByTestId('digestion-play-button').click()
  await expect(scene).toHaveAttribute('data-playing', 'true')
  await expect(page.getByTestId('digestion-play-button')).toBeDisabled()
  await expect(page.locator('.digestion-journey__loading')).toBeVisible()
  await expect(scene).toHaveAttribute('data-selected', 'mulut')
  await expect(scene).toHaveAttribute('data-selected', 'kerongkongan', { timeout: 3_500 })
  await expect(scene).toHaveAttribute('data-selected', 'lambung', { timeout: 3_500 })
  await expect(scene).toHaveAttribute('data-selected', 'usus-halus', { timeout: 3_500 })
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-digestion-journey-6-2-absorption.png` })
  await expect(scene).toHaveAttribute('data-selected', 'usus-besar', { timeout: 3_500 })
  await expect(scene).toHaveAttribute('data-complete', 'true', { timeout: 3_500 })
  await expect(page.getByTestId('digestion-complete-message')).toBeVisible()
  await expect(page.getByTestId('digestion-play-button')).toContainText('Putar Ulang')
  for (const stage of ['mulut', 'kerongkongan', 'lambung', 'usus-halus', 'usus-besar'] as const) {
    await expect(page.getByTestId(`digestion-stage-${stage}`)).toHaveAttribute('data-complete', 'true')
  }
})
