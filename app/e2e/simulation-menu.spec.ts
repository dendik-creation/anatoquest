import { expect, test } from '@playwright/test'

const simulations = [
  'respiratory', 'blood-flow', 'digestion', 'nerve-impulse',
  'urine-formation', 'musculoskeletal', 'sensory', 'endocrine',
]

async function openMenu(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-simulasi-organ').click()
  await expect(page.getByTestId('simulation-menu-scene')).toBeVisible()
}

test('Simulation Organ opens all existing microscene targets and returns to its menu', async ({ page }) => {
  await openMenu(page)
  await page.waitForTimeout(400)
  await page.screenshot({ path: 'e2e/screenshots/simulation-menu.png' })
  for (const id of simulations) {
    await page.getByTestId(`simulation-card-${id}`).click()
    await expect(page.getByRole('button', { name: 'Selesaikan Simulasi' })).toBeVisible()
    await expect(page.getByText('Sebelumnya', { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Selesaikan Simulasi' }).click()
    await expect(page.getByTestId('simulation-menu-scene')).toBeVisible({ timeout: 2_000 })
  }
})
