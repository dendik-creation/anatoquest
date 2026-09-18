import { expect, test } from '@playwright/test'

async function placeByClick(page: import('@playwright/test').Page, ids: readonly string[]) {
  for (const id of ids) await page.getByTestId(`challenge-card-${id}`).click()
}

test('microscene 6.5 unlocks the three ordered-system challenges in sequence', async ({ page }, testInfo) => {
  await page.goto('/')

  const scene = page.getByTestId('three-systems-challenge-scene')
  await expect(scene).toBeVisible()
  await expect(scene).toHaveAttribute('data-microscene', '6.5')
  await expect(scene).toHaveAttribute('data-active-system', 'pencernaan')
  await expect(page.getByTestId('challenge-tab-persarafan')).toBeDisabled()
  await expect(page.getByTestId('challenge-tab-perkemihan')).toBeDisabled()
  await page.waitForTimeout(1_200)
  await expect(page.locator('.three-systems-challenge__choices')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-three-systems-challenge-6-5-digestion.png` })

  await page.getByTestId('challenge-card-mulut').dragTo(page.getByTestId('challenge-slot-1'))
  await placeByClick(page, ['kerongkongan', 'lambung', 'usus-halus', 'usus-besar'])
  await expect(page.getByTestId('challenge-slot-1')).toContainText('Mulut')
  await expect(page.getByTestId('challenge-slot-5')).toContainText('Usus Besar')
  await page.getByTestId('challenge-check').click()
  await expect(scene).toHaveAttribute('data-active-system', 'persarafan')
  await expect(page.getByTestId('challenge-tab-pencernaan')).toHaveAttribute('data-complete', 'true')
  await expect(page.getByTestId('challenge-tab-perkemihan')).toBeDisabled()
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-three-systems-challenge-6-5-nervous.png` })

  await placeByClick(page, ['rangsangan', 'saraf', 'sumsum', 'otak', 'respons'])
  await page.getByTestId('challenge-check').click()
  await expect(scene).toHaveAttribute('data-active-system', 'perkemihan')
  await expect(page.getByTestId('challenge-tab-persarafan')).toHaveAttribute('data-complete', 'true')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-three-systems-challenge-6-5-urinary.png` })

  await placeByClick(page, ['ginjal', 'ureter', 'kandung-kemih', 'uretra'])
  await page.getByTestId('challenge-check').click()
  await expect(scene).toHaveAttribute('data-complete', 'true')
  await expect(page.getByTestId('challenge-check')).toContainText('Lanjut: Materi 4')
  await page.getByTestId('challenge-check').click()
  await expect(scene).toHaveAttribute('data-exiting', 'true')
})

test('microscene 6.5 completes a full native drag sequence without a browser error', async ({ page }) => {
  const browserErrors: string[] = []
  page.on('pageerror', (error) => browserErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text())
  })

  await page.goto('/')

  for (const [slot, id] of ['mulut', 'kerongkongan', 'lambung', 'usus-halus', 'usus-besar'].entries()) {
    await page.getByTestId(`challenge-card-${id}`).dragTo(page.getByTestId(`challenge-slot-${slot + 1}`))
    await expect(page.getByTestId(`challenge-slot-${slot + 1}`)).toContainText(
      id === 'usus-halus' ? 'Usus Halus' : id === 'usus-besar' ? 'Usus Besar' : id[0].toUpperCase() + id.slice(1),
    )
  }

  await expect.poll(() => browserErrors, { message: 'drag-and-drop must not crash the game' }).toEqual([])
})

test('microscene 6.5 prevents a placed card from entering a second drag operation', async ({ page }) => {
  const browserErrors: string[] = []
  page.on('pageerror', (error) => browserErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text())
  })

  await page.goto('/')

  const mouthCard = page.getByTestId('challenge-card-mulut')
  await mouthCard.dragTo(page.getByTestId('challenge-slot-1'))
  await expect(page.getByTestId('challenge-slot-1')).toContainText('Mulut')
  await expect(mouthCard).toBeDisabled()
  await expect(mouthCard).toHaveAttribute('draggable', 'false')
  await expect(browserErrors).toEqual([])
})
