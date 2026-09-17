import { expect, test } from '@playwright/test'

test('microscene 5.8 switches every lymph-flow stage and plays the flow sequence', async ({ page }, testInfo) => {
  test.slow()
  await page.goto('/')

  const scene = page.getByTestId('lymph-flow-scene')
  await expect(scene).toBeVisible()
  await expect(scene).toHaveAttribute('data-microscene', '5.8')
  await expect.poll(() => scene.getAttribute('data-transition')).toBe('entered')
  await expect(page.getByRole('heading', { name: 'Bagaimana Sistem Limfatik Bekerja?' })).toBeVisible()
  await expect(page.getByTestId('lymph-flow-step-tissue')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('lymph-flow-information')).toContainText('Cairan berasal dari jaringan')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-lymph-flow-5-8-initial.png` })

  for (const [stage, heading] of [
    ['vessel', 'Cairan masuk ke pembuluh limfa'],
    ['node', 'Cairan disaring di kelenjar limfa'],
    ['return', 'Cairan kembali ke peredaran darah'],
  ] as const) {
    await page.getByTestId(`lymph-flow-step-${stage}`).click()
    await expect(scene).toHaveAttribute('data-stage', stage)
    await expect(page.getByTestId(`lymph-flow-step-${stage}`)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('lymph-flow-information')).toContainText(heading)
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-lymph-flow-5-8-${stage}.png` })
  }

  await page.getByTestId('lymph-flow-play-button').click()
  await expect(scene).toHaveAttribute('data-playing', 'true')
  await expect.poll(() => scene.getAttribute('data-stage'), { timeout: 3_000 }).toBe('tissue')
  await page.getByTestId('lymph-flow-play-button').click()
  await expect(scene).toHaveAttribute('data-playing', 'false')
})
