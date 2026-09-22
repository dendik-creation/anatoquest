import { expect, test } from '@playwright/test'

async function gotoMiniGames(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-mini-game').click()
  await expect(page.getByTestId('mini-games-scene')).toBeVisible()
}

test('SC-08.1 menu opens, toggles audio, and returns home', async ({ page }, testInfo) => {
  await gotoMiniGames(page)

  for (const name of ['Puzzle Organ', 'Pasang Organ', 'Hubungkan Fungsi', 'Susun Alur Fisiologi']) {
    await expect(page.getByRole('button', { name })).toBeVisible()
  }

  await page.waitForTimeout(900)
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-mini-games.png` })

  const audio = page.getByTestId('mini-games-audio')
  await expect(audio).toHaveAttribute('aria-pressed', 'true')
  await audio.click()
  await expect(audio).toHaveAttribute('aria-pressed', 'false')

  await page.getByTestId('mini-games-back').click()
  await expect(page.getByTestId('home-scene')).toBeVisible()
})
