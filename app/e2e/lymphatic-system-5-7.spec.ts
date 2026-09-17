import { expect, test } from '@playwright/test'

test('microscene 5.7 switches lymphatic-part information and records exploration', async ({ page }, testInfo) => {
  await page.goto('/')

  const scene = page.getByTestId('lymphatic-system-scene')
  await expect(scene).toBeVisible()
  await expect(scene).toHaveAttribute('data-microscene', '5.7')
  await expect.poll(() => scene.getAttribute('data-transition')).toBe('entered')
  await expect(page.getByRole('heading', { name: 'Kenali Sistem Limfatik' })).toBeVisible()
  await expect(page.getByTestId('lymphatic-part-kelenjar')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('lymphatic-part-information')).toContainText('Kelenjar Limfa')
  await expect(page.getByTestId('lymphatic-exploration-count')).toHaveText('0 / 4')
  await expect(page.locator('.lymphatic-system__progress > span')).toHaveCSS('width', '0px')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-7-initial.png` })

  await page.getByTestId('lymphatic-part-limpa').click()
  await expect(scene).toHaveAttribute('data-selected', 'limpa')
  await expect(page.getByTestId('lymphatic-part-information')).toContainText('Limpa')
  await expect(page.getByTestId('lymphatic-exploration-count')).toHaveText('1 / 4')
  await expect(page.locator('.lymphatic-system__progress > span')).not.toHaveCSS('width', '0px')

  for (const part of ['kelenjar', 'pembuluh', 'timus'] as const) await page.getByTestId(`lymphatic-part-${part}`).click()
  await expect(page.getByTestId('lymphatic-exploration-count')).toHaveText('4 / 4')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-7.png` })
})
