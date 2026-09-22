import { expect, test, type Page } from '@playwright/test'

const ORGANS = ['nasal', 'larynx', 'trachea', 'bronchi', 'lungs', 'diaphragm'] as const

async function gotoPlaceOrgan(page: Page) {
  await page.goto('/')
  await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 35_000 })
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-mini-game').click()
  await page.waitForTimeout(900)
  await page.getByTestId('mini-games-pasang-organ').click()
  await expect(page.getByTestId('place-organ-scene')).toBeVisible()
  await page.waitForTimeout(900)
}

test('SC-08.3 places all respiratory organs', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  await gotoPlaceOrgan(page)
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-place-organ.png` })

  await page.getByTestId('place-organ-card-nasal').click()
  await page.getByTestId('place-organ-target-larynx').click()
  await expect(page.getByRole('status')).toContainText('Belum tepat')

  for (const id of ORGANS) {
    await page.getByTestId(`place-organ-card-${id}`).click()
    await page.getByTestId(`place-organ-target-${id}`).click()
  }
  await expect(page.getByTestId('place-organ-finish')).toBeEnabled()
  await expect(page.getByRole('status')).toContainText('Pasang Organ Selesai')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-place-organ-complete.png` })
  await page.getByTestId('place-organ-finish').click()
  await expect(page.getByTestId('mini-games-scene')).toBeVisible({ timeout: 3_000 })
})
