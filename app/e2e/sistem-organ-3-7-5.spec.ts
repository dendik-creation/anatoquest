import { expect, test } from '@playwright/test'

test('microscene 7.5 accepts only correct organ groups and unlocks completion', async ({ page }, testInfo) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Mulai: Sistem Reproduksi/ }).click()
  await page.getByRole('button', { name: /Lanjut: Otot & Tulang/ }).click()
  await page.getByRole('button', { name: /Lanjut: Indra & Endokrin/ }).click()
  await page.getByRole('button', { name: /Lanjut: Tantangan Empat Sistem/ }).click()

  const scene = page.getByTestId('four-systems-challenge-scene')
  await expect(scene).toHaveAttribute('data-count', '0')
  await expect(page.getByTestId('four-systems-finish')).toBeDisabled()
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-3-7-5.png` })

  await page.getByTestId('four-systems-organ-mata').click()
  await page.getByTestId('four-systems-drop-reproduksi').click()
  await expect(page.getByTestId('four-systems-feedback')).toContainText('Belum tepat')
  await expect(scene).toHaveAttribute('data-count', '0')

  await page.getByTestId('four-systems-organ-mata').dragTo(page.getByTestId('four-systems-drop-indra'))
  await expect(scene).toHaveAttribute('data-count', '1')

  const answers = [
    ['telinga', 'indra'], ['hidung', 'indra'], ['lidah', 'indra'], ['kulit', 'indra'],
    ['tiroid', 'endokrin'], ['pankreas', 'endokrin'], ['kelenjar-adrenal', 'endokrin'],
    ['uterus', 'reproduksi'], ['ovarium', 'reproduksi'], ['otot-rangka', 'otot-tulang'], ['tulang', 'otot-tulang'],
  ] as const
  for (const [organ, system] of answers) {
    await page.getByTestId(`four-systems-organ-${organ}`).click()
    await page.getByTestId(`four-systems-drop-${system}`).click()
  }

  await expect(scene).toHaveAttribute('data-complete', 'true')
  await expect(page.getByTestId('four-systems-finish')).toBeEnabled()
  await page.getByTestId('four-systems-reset').click()
  await expect(scene).toHaveAttribute('data-count', '0')
  await expect(page.getByTestId('four-systems-finish')).toBeDisabled()
})
