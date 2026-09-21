import { expect, test } from '@playwright/test'

test('microscene 7.2 switches organs and reproductive-system tabs', async ({ page }, testInfo) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Mulai: Sistem Reproduksi/ }).click()
  const scene = page.getByTestId('reproduction-system-scene')
  await expect(scene).toBeVisible({ timeout: 1_500 })
  await expect(scene).toHaveAttribute('data-microscene', '7.2')
  await page.waitForTimeout(700)
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-3-7-2-female.png` })
  await page.getByTestId('reproduction-selector-ovarium').click()
  await expect(page.getByTestId('reproduction-information')).toContainText('Ovarium')
  await page.getByRole('tab', { name: /Sistem Reproduksi Laki-laki/ }).click()
  await expect(scene).toHaveAttribute('data-mode', 'male')
  await expect(page.getByTestId('reproduction-information')).toContainText('Kelenjar Prostat')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-3-7-2-male.png` })
})
