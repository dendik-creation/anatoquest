import { expect, test } from '@playwright/test'

test('Petunjuk opens before Studi Kasus and keeps the global BGM state', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })
  await page.getByTestId('splash-continue').click()
  await expect(page.getByTestId('home-scene')).toBeVisible()

  await page.getByTestId('home-audio-button').click()
  await page.getByTestId('home-card-mulai-pembelajaran').click()
  await expect(page.getByTestId('petunjuk-scene')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Petunjuk Penggunaan' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Aktifkan musik latar' })).toBeVisible()

  await page.getByTestId('petunjuk-next-button').click()
  await expect(page.getByTestId('case-study-scene')).toBeVisible()
})
