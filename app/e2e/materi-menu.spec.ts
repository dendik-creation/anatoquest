import { expect, test, type Page } from '@playwright/test'

async function gotoMateriMenu(page: Page) {
  await page.goto('/')
  await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-materi').click()
  await expect(page.getByTestId('materi-menu-scene')).toBeVisible()
  await page.waitForTimeout(900)
}

test('SC-09.1 menu routes every material card', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  const destinations = [
    ['case-study', 'case-study-scene'],
    ['fundamental', 'fundamental-scene'],
    ['sistem-organ-1', 'sistem-organ-scene'],
    ['sistem-organ-2', 'sistem-organ-2-scene'],
    ['sistem-organ-3', 'sistem-organ-3-scene'],
  ] as const

  for (const [card, scene] of destinations) {
    await gotoMateriMenu(page)
    await page.getByTestId(`materi-menu-${card}`).click()
    await expect(page.getByTestId(scene)).toBeVisible({ timeout: 3_000 })
  }

  await gotoMateriMenu(page)
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-materi-menu.png` })
  await page.getByTestId('materi-menu-back').click()
  await expect(page.getByTestId('home-scene')).toBeVisible({ timeout: 3_000 })
})
