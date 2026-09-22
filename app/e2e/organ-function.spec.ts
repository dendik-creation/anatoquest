import { expect, test, type Page } from '@playwright/test'

async function gotoOrganFunction(page: Page) {
  await page.goto('/')
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-mini-game').click()
  await page.getByTestId('mini-games-hubungkan-fungsi').click()
  await expect(page.getByTestId('organ-function-scene')).toBeVisible()
}

async function connect(page: Page, organ: string, fn: string) {
  const start = await page.getByTestId(`organ-point-${organ}`).boundingBox()
  const end = await page.getByTestId(`function-point-${fn}`).boundingBox()
  if (!start || !end) throw new Error('Connection point is unavailable')
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2)
  await page.mouse.down()
  await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2)
  await page.mouse.up()
}

test('SC-08.4 connects, checks, and corrects organ-function pairs', async ({ page }) => {
  await gotoOrganFunction(page)
  await page.getByTestId('organ-function-check').click()
  await expect(page.getByRole('status')).toContainText('Hubungkan semua organ')

  await connect(page, 'lungs', 'filter-blood')
  await connect(page, 'heart', 'pump-blood')
  await connect(page, 'brain', 'control-body')
  await connect(page, 'stomach', 'gas-exchange')
  await connect(page, 'kidneys', 'digestion')
  await expect(page.locator('.organ-function__line--connected')).toHaveCount(5)

  await page.getByTestId('organ-function-check').click()
  await expect(page.getByRole('status')).toContainText('Beberapa pasangan belum tepat')
  await expect(page.getByTestId('organ-point-heart')).toBeDisabled()
  await expect(page.getByTestId('organ-point-lungs')).not.toBeDisabled()

  await connect(page, 'lungs', 'gas-exchange')
  await connect(page, 'stomach', 'digestion')
  await connect(page, 'kidneys', 'filter-blood')
  await page.getByTestId('organ-function-check').click()
  await expect(page.getByRole('status')).toContainText('Hebat! Semua organ')
  await expect(page.getByTestId('organ-function-check')).toHaveText('Selesai')
})
