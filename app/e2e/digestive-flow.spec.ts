import { expect, test, type Page } from '@playwright/test'

async function gotoDigestiveFlow(page: Page) {
  await page.goto('/')
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-mini-game').click()
  await page.getByTestId('mini-games-susun-alur-fisiologi').click()
  await expect(page.getByTestId('digestive-flow-scene')).toBeVisible()
}

async function place(page: Page, stage: string, slot: number) {
  await page.getByTestId(`flow-source-${stage}`).click()
  await page.getByTestId(`flow-slot-${slot}`).click()
}

test('SC-08.5 places, swaps, checks, and completes the digestive flow', async ({ page }) => {
  await gotoDigestiveFlow(page)
  await page.getByTestId('digestive-flow-check').click()
  await expect(page.getByRole('status')).toContainText('Lengkapi semua tahapan')

  await place(page, 'stomach', 1)
  await place(page, 'esophagus', 2)
  await place(page, 'mouth', 3)
  await place(page, 'small-intestine', 4)
  await place(page, 'large-intestine', 5)
  await place(page, 'rectum-anus', 6)
  await page.getByTestId('digestive-flow-check').click()
  await expect(page.getByRole('status')).toContainText('Beberapa tahapan belum tepat')
  await expect(page.locator(".digestive-flow__slot[data-status='wrong']")).toHaveCount(2)

  await page.getByTestId('flow-board-mouth').click()
  await page.getByTestId('flow-slot-1').click()
  await page.getByTestId('digestive-flow-check').click()
  await expect(page.getByRole('status')).toContainText('Hebat! Kamu berhasil')
  await expect(page.getByTestId('digestive-flow-check')).toContainText('Selesaikan Mini Game')
})
