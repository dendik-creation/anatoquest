import { expect, test, type Page } from '@playwright/test'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

// Centres of the coloured markers on the organ illustration. The callout pills
// sit further outward and must never become the clickable target area.
const ORGAN_MARKERS = {
  hidung: { x: 1159, y: 295 },
  faring: { x: 1157, y: 351 },
  laring: { x: 1114, y: 397 },
  trakea: { x: 1109, y: 464 },
  bronkus: { x: 1051, y: 565 },
  paru: { x: 1196, y: 650 },
} as const

function stageScale(viewportWidth: number, viewportHeight: number): number {
  return Math.min(
    Math.max(viewportWidth / DESIGN_WIDTH, viewportHeight / DESIGN_HEIGHT),
    Math.min(viewportWidth / SAFE_WIDTH, viewportHeight / SAFE_HEIGHT),
  )
}

async function expectHotspotsToTargetOrganMarkers(page: Page) {
  const viewport = page.viewportSize()
  if (!viewport) throw new Error('viewport size unavailable')

  const scale = stageScale(viewport.width, viewport.height)
  const stageLeft = viewport.width / 2 - (DESIGN_WIDTH / 2) * scale
  const stageTop = viewport.height / 2 - (DESIGN_HEIGHT / 2) * scale

  for (const [id, marker] of Object.entries(ORGAN_MARKERS)) {
    const box = await page.getByTestId(`respiratory-hotspot-${id}`).boundingBox()
    expect(box, `${id} hotspot must be laid out`).not.toBeNull()

    const centreX = box!.x + box!.width / 2
    const centreY = box!.y + box!.height / 2
    expect(box!.width / scale, `${id} hotspot must stay a compact circle`).toBeLessThanOrEqual(52.5)
    expect(box!.height / scale, `${id} hotspot must stay a compact circle`).toBeLessThanOrEqual(52.5)
    expect(Math.abs(centreX - (stageLeft + marker.x * scale)), `${id} hotspot x`).toBeLessThanOrEqual(2)
    expect(Math.abs(centreY - (stageTop + marker.y * scale)), `${id} hotspot y`).toBeLessThanOrEqual(2)
  }
}

async function gotoSistemOrgan(page: Page) {
  await page.goto('/')
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-mulai-pembelajaran').click()
  await expect(page.getByTestId('case-study-scene')).toHaveAttribute('data-phase', 'idle')
  for (const [card, target] of [['sesak_napas', 'lung'], ['jantung_berdebar', 'heart'], ['lelah', 'heart'], ['pucat', 'heart']] as const) {
    await page.getByTestId(`case-study-card-${card}`).click()
    await page.getByTestId(`case-study-hotspot-${target}`).click()
  }
  await page.getByTestId('case-study-next-button').click()
  await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
  for (let step = 0; step < 4; step += 1) {
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
  }
  for (const [card, target] of [['sweat', 'temperature'], ['thirst', 'fluid'], ['insulin', 'glucose']] as const) {
    await page.getByTestId(`homeostasis-response-${card}`).click()
    await page.getByTestId(`homeostasis-drop-${target}`).click()
  }
  await page.getByTestId('homeostasis-check-button').click()
  await page.getByTestId('fundamental-next-button').click()
  await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.6')
  await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
  for (const [card, target] of [['heart-shape', 'anatomy'], ['lungs-location', 'anatomy'], ['bone-structure', 'anatomy'], ['kidney-position', 'anatomy'], ['heart-pumps', 'physiology'], ['lungs-expand', 'physiology'], ['muscle-contracts', 'physiology'], ['kidney-filters', 'physiology']] as const) {
    await page.getByTestId(`classification-card-${card}`).click()
    await page.getByTestId(`classification-drop-${target}`).click()
  }
  await page.getByTestId('classification-check-button').click()
  await page.getByTestId('fundamental-next-button').click()
  await expect(page.getByTestId('sistem-organ-scene')).toBeVisible()
}

test('microscene 5.1 opens a concise system-information drawer after a card is clicked', async ({ page }, testInfo) => {
  test.slow()
  await gotoSistemOrgan(page)
  await expect(page.getByRole('heading', { name: 'Kenali Tiga Sistem Organ Tubuh' })).toBeVisible()
  await expect(page.getByTestId('sistem-organ-selector-pernapasan')).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByTestId('sistem-organ-drawer')).toHaveAttribute('aria-hidden', 'true')
  await page.getByTestId('sistem-organ-selector-sirkulasi').click()
  await expect(page.getByTestId('sistem-organ-active-system')).toContainText('Sirkulasi')
  await expect(page.getByTestId('sistem-organ-drawer')).toHaveAttribute('aria-hidden', 'false')
  await expect(page.getByTestId('sistem-organ-drawer')).toContainText('Peran utama')
  await expect(page.getByTestId('sistem-organ-drawer')).toContainText('Jantung & pembuluh darah')
  await page.getByTestId('sistem-organ-drawer-close').click()
  await expect(page.getByTestId('sistem-organ-drawer')).toHaveAttribute('aria-hidden', 'true')
  await page.getByTestId('sistem-organ-selector-pernapasan').click()
  await expect(page.getByTestId('sistem-organ-drawer')).toContainText('Oksigen masuk, karbon dioksida keluar.')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-1.png` })
})

test('microscene 5.2 connects each respiratory-system list item and hotspot to its information card', async ({ page }, testInfo) => {
  test.slow()
  await gotoSistemOrgan(page)
  await page.getByTestId('sistem-organ-next-button').click()
  await expect(page.getByTestId('respiratory-system-scene')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kenali Jalur Udara dalam Tubuh' })).toBeVisible()
  await expect(page.getByTestId('respiratory-part-trakea')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('respiratory-system-next-button')).toBeDisabled()
  await expectHotspotsToTargetOrganMarkers(page)
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-2-initial.png` })

  await page.getByTestId('respiratory-hotspot-faring').click()
  await expect(page.getByTestId('respiratory-part-information')).toContainText('Faring')
  for (const part of ['hidung', 'laring', 'trakea', 'bronkus', 'paru'] as const) await page.getByTestId(`respiratory-part-${part}`).click()

  await expect(page.getByTestId('respiratory-instruction')).toContainText('6/6 bagian telah dipelajari')
  await expect(page.getByTestId('respiratory-system-next-button')).toBeEnabled()
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-2.png` })
})

test('microscene 5.3 switches breathing phases and plays one complete breathing cycle', async ({ page }, testInfo) => {
  test.slow()
  await gotoSistemOrgan(page)
  await page.getByTestId('sistem-organ-next-button').click()
  await expect(page.getByTestId('respiratory-system-scene')).toBeVisible()
  for (const part of ['hidung', 'faring', 'laring', 'trakea', 'bronkus', 'paru'] as const) await page.getByTestId(`respiratory-part-${part}`).click()
  await expect(page.getByTestId('respiratory-system-next-button')).toBeEnabled()
  await page.getByTestId('respiratory-system-next-button').click()

  const scene = page.getByTestId('breathing-mechanics-scene')
  await expect(scene).toBeVisible()
  await expect(scene).toHaveAttribute('data-phase', 'inspirasi')
  await expect(page.getByTestId('breathing-tab-inspirasi')).toHaveAttribute('aria-selected', 'true')
  await page.getByTestId('breathing-tab-ekspirasi').click()
  await expect(scene).toHaveAttribute('data-phase', 'ekspirasi')
  await expect(page.getByText('Udara keluar dari paru-paru.')).toBeVisible()

  await page.getByTestId('breathing-play-button').click()
  await expect(scene).toHaveAttribute('data-playing', 'true')
  await expect(scene).toHaveAttribute('data-phase', 'inspirasi')
  await expect.poll(() => scene.getAttribute('data-phase'), { timeout: 4_000 }).toBe('ekspirasi')
  await expect.poll(() => scene.getAttribute('data-playing'), { timeout: 4_000 }).toBe('false')
  await expect(scene).toHaveAttribute('data-phase', 'ekspirasi')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-3.png` })

  await page.getByTestId('breathing-mechanics-next-button').click()
  const ordering = page.getByTestId('airway-ordering-scene')
  await expect(ordering).toBeVisible()
  await expect(ordering).toHaveAttribute('data-microscene', '5.4')
  await expect(page.getByTestId('airway-check-button')).toBeDisabled()

  await page.getByTestId('airway-card-hidung').click()
  await page.getByTestId('airway-slot-faring').click()
  await expect(page.getByRole('status')).toContainText('belum sesuai')

  await page.getByTestId('airway-card-hidung').dragTo(page.getByTestId('airway-slot-hidung'))
  for (const part of ['faring', 'laring', 'trakea', 'bronkus', 'paru'] as const) {
    await page.getByTestId(`airway-card-${part}`).click()
    await page.getByTestId(`airway-slot-${part}`).click()
  }
  await expect(ordering).toContainText('6 dari 6 ditempatkan')
  await expect(page.getByTestId('airway-check-button')).toBeEnabled()
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-4.png` })

  await page.getByTestId('airway-check-button').click()
  const circulatory = page.getByTestId('circulatory-system-scene')
  await expect(circulatory).toBeVisible()
  await expect(circulatory).toHaveAttribute('data-microscene', '5.5')
  await expect(page.getByTestId('circulatory-part-jantung')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('circulatory-part-information')).toContainText('Jantung')
  for (const [part, heading] of [['arteri', 'Arteri'], ['vena', 'Vena'], ['kapiler', 'Kapiler']] as const) {
    await page.getByTestId(`circulatory-part-${part}`).click()
    await expect(page.getByTestId('circulatory-part-information')).toContainText(heading)
  }
  const body = await page.getByTestId('circulatory-anatomy-body').boundingBox()
  expect(body).not.toBeNull()
  for (const part of ['arteri', 'vena', 'kapiler'] as const) {
    await page.getByTestId(`circulatory-part-${part}`).click()
    const overlay = await page.getByTestId(`circulatory-anatomy-${part}`).boundingBox()
    expect(overlay, `${part} anatomy overlay must be laid out`).not.toBeNull()
    expect(Math.abs((overlay!.x + overlay!.width / 2) - (body!.x + body!.width / 2)), `${part} overlay must be centred on the body`).toBeLessThanOrEqual(2)
    expect(Math.abs(overlay!.y - body!.y), `${part} overlay must align with the body top`).toBeLessThanOrEqual(2)
    expect(Math.abs(overlay!.height - body!.height), `${part} overlay must align with the body height`).toBeLessThanOrEqual(2)
  }
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-5.png` })

  await page.getByTestId('circulatory-system-next-button').click()
  const blood = page.getByTestId('blood-circulation-scene')
  await expect(blood).toBeVisible()
  await expect(blood).toHaveAttribute('data-microscene', '5.6')
  await expect(page.getByTestId('blood-circulation-tab-lungs')).toHaveAttribute('aria-selected', 'true')

  await page.getByTestId('blood-circulation-tab-body').click()
  await expect(blood).toHaveAttribute('data-mode', 'body')
  await expect(page.getByText('Ke Seluruh Tubuh', { exact: true }).last()).toBeVisible()
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-6-body.png` })

  await page.getByTestId('blood-circulation-play-button').click()
  await expect(blood).toHaveAttribute('data-running', 'true')
  await expect(blood).toHaveAttribute('data-step', '0')
  await page.getByTestId('blood-circulation-tab-lungs').click()
  await expect(blood).toHaveAttribute('data-mode', 'lungs')
  await expect(blood).toHaveAttribute('data-running', 'false')
  await expect(blood).toHaveAttribute('data-step', 'none')

  await page.getByTestId('blood-circulation-play-button').click()
  await expect(blood).toHaveAttribute('data-running', 'true')
  await expect.poll(() => blood.getAttribute('data-step'), { timeout: 2_500 }).toBe('1')
  await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-sistem-organ-5-6-lungs.png` })
})
