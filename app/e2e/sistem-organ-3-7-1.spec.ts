import { expect, test } from '@playwright/test'

test('microscene 7.1 switches the right-hand system information', async ({ page }, testInfo) => {
  await page.goto('/')
  const scene = page.getByTestId('sistem-organ-3-scene')
  await expect(scene).toHaveAttribute('data-microscene', '7.1')
  await page.waitForTimeout(700)
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-3-7-1.png` })
  await page.getByTestId('sistem-organ-3-selector-indra').click()
  await expect(scene).toHaveAttribute('data-selected', 'indra')
  await expect(page.getByTestId('sistem-organ-3-information')).toContainText('Sistem Indra')
})
