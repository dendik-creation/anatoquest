import { expect, test } from '@playwright/test'

const correctOptions: Record<string, number> = { q01: 1, q02: 2, q03: 1, q04: 0, q05: 1, q06: 0, q07: 0, q08: 2, q09: 1, q10: 1 }

test('Quiz shuffles a session, scores answers, and starts a fresh retry session', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-kuis').click()
  await expect(page.getByRole('heading', { name: 'Petunjuk Kuis' })).toBeVisible()
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'e2e/screenshots/quiz-instructions.png' })
  await page.getByTestId('quiz-start').click()
  await expect(page.getByTestId('quiz-scene')).toHaveAttribute('data-status', 'countdown')
  await expect(page.getByTestId('quiz-scene')).toHaveAttribute('data-status', 'question', { timeout: 4_000 })

  for (let index = 0; index < 10; index += 1) {
    const card = page.locator('.quiz__question')
    const id = await card.getAttribute('data-question-id')
    if (!id) throw new Error('Missing question id')
    const radios = card.getByRole('radio')
    await radios.nth(correctOptions[id]).click()
    await card.getByRole('button', { name: index === 9 ? 'Selesaikan Kuis' : 'Selanjutnya' }).click()
  }

  await expect(page.getByRole('heading', { name: 'Selamat!' })).toBeVisible()
  await expect(page.getByText('100/100')).toBeVisible()
  await page.getByRole('button', { name: 'Coba Lagi' }).click()
  await expect(page.getByTestId('quiz-scene')).toHaveAttribute('data-status', 'countdown')
  await expect(page.getByTestId('quiz-scene')).toHaveAttribute('data-status', 'question', { timeout: 4_000 })
  for (let index = 0; index < 10; index += 1) {
    const card = page.locator('.quiz__question')
    const id = await card.getAttribute('data-question-id')
    if (!id) throw new Error('Missing question id')
    await card.getByRole('radio').nth((correctOptions[id] + 1) % 4).click()
    await card.getByRole('button', { name: index === 9 ? 'Selesaikan Kuis' : 'Selanjutnya' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Terus Berlatih!' })).toBeVisible()
})
