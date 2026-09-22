import { expect, test, type Page } from '@playwright/test'

const PIECES = ['piece-01', 'piece-02', 'piece-03', 'piece-04', 'piece-05', 'piece-06'] as const

async function gotoPuzzle(page: Page) {
  await page.goto('/')
  await expect(page.getByTestId('splash-continue')).toBeVisible({ timeout: 15_000 })
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-mini-game').click()
  await expect(page.getByTestId('mini-games-scene')).toBeVisible()
  await page.waitForTimeout(900)
  await page.getByTestId('mini-games-puzzle-organ').click()
  await expect(page.getByTestId('puzzle-organ-scene')).toBeVisible()
  await page.waitForTimeout(900)
}

async function completePuzzle(page: Page) {
  for (const id of PIECES) {
    await page.getByTestId(`puzzle-piece-${id}`).click()
    await page.getByTestId(`puzzle-slot-${id}`).click()
  }
  await expect(page.getByLabel(/Papan puzzle/).locator('img')).toHaveCount(6)
  await expect(page.getByLabel(/Papan puzzle/)).toHaveAttribute('data-complete', 'true')
  await expect(page.getByTestId('puzzle-organ-next')).toBeEnabled()
}

test('SC-08.2 solves the three organ puzzles in order', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  await gotoPuzzle(page)
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-puzzle-organ.png` })

  await page.getByTestId('puzzle-piece-piece-01').click()
  await page.getByTestId('puzzle-slot-piece-02').click()
  await expect(page.getByTestId('puzzle-piece-piece-01')).toHaveAttribute('data-wrong', 'true')

  await completePuzzle(page)
  await page.getByTestId('puzzle-organ-next').click()
  await completePuzzle(page)
  await page.getByTestId('puzzle-organ-next').click()
  await completePuzzle(page)
  await expect(page.getByTestId('puzzle-organ-next')).toHaveText(/Selesaikan Mini Game/)
  await page.getByTestId('puzzle-organ-next').click()
  await expect(page.getByTestId('puzzle-organ-completion')).toBeVisible()
  await page.getByTestId('puzzle-organ-completion').getByRole('button', { name: 'Kembali ke Menu Mini Games' }).click()
  await expect(page.getByTestId('mini-games-scene')).toBeVisible({ timeout: 3_000 })
})
