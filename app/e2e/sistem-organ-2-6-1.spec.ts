import { expect, test } from '@playwright/test'

test('microscene 6.1 switches system-organ information', async ({ page }, testInfo) => {
  await page.goto('/')

  const scene = page.getByTestId('sistem-organ-2-scene')
  await expect(scene).toBeVisible()
  await expect(scene).toHaveAttribute('data-microscene', '6.1')
  await expect(scene).toHaveAttribute('data-selected', 'pencernaan')
  await expect(page.getByRole('heading', { name: 'Kenali Tiga Sistem Organ Tubuh' })).toBeVisible()
  await expect(page.getByTestId('sistem-organ-2-information')).toContainText('Sistem Pencernaan')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-2-6-1-initial.png` })

  await page.getByTestId('sistem-organ-2-selector-persarafan').click()
  await expect(scene).toHaveAttribute('data-selected', 'persarafan')
  await expect(page.getByTestId('sistem-organ-2-information')).toContainText('Sistem Persarafan')
  await expect(page.getByTestId('sistem-organ-2-information')).toContainText('Menerima rangsangan')

  await page.getByTestId('sistem-organ-2-selector-perkemihan').click()
  await expect(scene).toHaveAttribute('data-selected', 'perkemihan')
  await expect(page.getByTestId('sistem-organ-2-information')).toContainText('Sistem Perkemihan')
  await expect(page.getByTestId('sistem-organ-2-information')).toContainText('Menyaring darah')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-2-6-1.png` })
})
