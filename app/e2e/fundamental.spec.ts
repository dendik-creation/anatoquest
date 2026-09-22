import { expect, test, type Page } from '@playwright/test'

async function gotoFundamental(page: Page) {
  await page.goto('/')
  await page.getByTestId('splash-continue').click()
  await page.getByTestId('home-card-mulai-pembelajaran').click()
  await expect(page.getByTestId('case-study-scene')).toHaveAttribute('data-phase', 'idle')

  const placements: Array<[string, 'lung' | 'heart']> = [
    ['sesak_napas', 'lung'],
    ['jantung_berdebar', 'heart'],
    ['lelah', 'heart'],
    ['pucat', 'heart'],
  ]
  for (const [symptom, organ] of placements) {
    await page.getByTestId(`case-study-card-${symptom}`).click()
    await page.getByTestId(`case-study-hotspot-${organ}`).click()
  }
  await page.getByTestId('case-study-next-button').click()
  await expect(page.getByTestId('fundamental-scene')).toBeVisible()
  await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
}

async function gotoClassification(page: Page) {
  await gotoFundamental(page)
  for (let step = 0; step < 4; step += 1) {
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
  }

  for (const [response, target] of [
    ['sweat', 'temperature'],
    ['thirst', 'fluid'],
    ['insulin', 'glucose'],
  ] as const) {
    await page.getByTestId(`homeostasis-response-${response}`).click()
    await page.getByTestId(`homeostasis-drop-${target}`).click()
  }
  await page.getByTestId('homeostasis-check-button').click()
  await expect(page.getByTestId('fundamental-next-button')).toBeEnabled()
  await page.getByTestId('fundamental-next-button').click()
  await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.6')
  await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
}

test.describe('SC-05 microscene 4.1', () => {
  test('renders the anatomy and physiology introduction from supplied assets', async ({ page }) => {
    await gotoFundamental(page)

    await expect(page.getByRole('heading', { name: 'Pengertian Anatomi dan Fisiologi Tubuh Manusia' })).toBeVisible()
    await expect(page.getByTestId('fundamental-anatomy-panel')).toContainText('Struktur membentuk tubuh.')
    await expect(page.getByTestId('fundamental-physiology-panel')).toContainText('Fungsi menjaga kehidupan.')
    await expect(page.getByTestId('fundamental-anatomy')).toBeVisible()
    await expect(page.getByTestId('fundamental-relation')).toContainText('Struktur + Fungsi')

    const anatomy = await page.getByTestId('fundamental-anatomy-panel').boundingBox()
    const physiology = await page.getByTestId('fundamental-physiology-panel').boundingBox()
    const relation = await page.getByTestId('fundamental-relation').boundingBox()
    expect(anatomy).not.toBeNull()
    expect(physiology).not.toBeNull()
    expect(relation).not.toBeNull()
    expect(anatomy!.x + anatomy!.width).toBeLessThan(relation!.x)
    expect(relation!.x + relation!.width).toBeLessThan(physiology!.x)
  })

  test('uses the reusable audio control and keeps the primary action available', async ({ page }) => {
    await gotoFundamental(page)
    const audio = page.getByTestId('fundamental-audio-button')
    await expect(audio).toHaveAttribute('aria-pressed', 'true')
    await audio.click()
    await expect(audio).toHaveAttribute('aria-pressed', 'false')
    await expect(audio).toHaveAccessibleName('Aktifkan musik latar')
    await expect(page.getByTestId('fundamental-next-button')).toBeEnabled()
    await expect(page.getByTestId('fundamental-back-button')).toBeDisabled()
  })

  test('opens microscene 4.2 and changes its organ information through body hotspots', async ({ page }) => {
    await gotoFundamental(page)
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.2')
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await expect(page.getByTestId('fundamental-back-button')).toBeEnabled()

    await expect(page.getByTestId('fundamental-header').getByRole('heading', { name: 'Apa itu Anatomi?' })).toBeVisible()
    await expect(page.getByTestId('fundamental-anatomy-intro')).toContainText('Bentuk')
    await expect(page.getByTestId('fundamental-organ-card')).toContainText('Jantung')
    await page.getByRole('button', { name: 'Otak', exact: true }).click()
    await expect(page.getByTestId('fundamental-organ-card')).toContainText('Rongga tengkorak')
    await page.getByRole('button', { name: 'Ginjal', exact: true }).click()
    await expect(page.getByTestId('fundamental-organ-card')).toContainText('membentuk urine')
  })

  test('animates heading separately and staggers bubble transitions for the remaining elements', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('splash-continue').click()
    await page.getByTestId('home-card-mulai-pembelajaran').click()

    for (const [symptom, organ] of [
      ['sesak_napas', 'lung'], ['jantung_berdebar', 'heart'], ['lelah', 'heart'], ['pucat', 'heart'],
    ] as const) {
      await page.getByTestId(`case-study-card-${symptom}`).click()
      await page.getByTestId(`case-study-hotspot-${organ}`).click()
    }
    await page.getByTestId('case-study-next-button').click()

    const scene = page.getByTestId('fundamental-scene')
    await expect(scene).toHaveAttribute('data-phase', 'entering')
    await expect(page.getByTestId('fundamental-header')).toHaveCSS('animation-name', /fundamental-heading-in/)
    await expect(page.getByTestId('fundamental-anatomy-panel')).toHaveCSS('animation-name', /fundamental-bubble-in/)
    const staggeredDelays = await page.locator('.fundamental__anim').evaluateAll((elements) =>
      elements.map((element) => element.getAnimations()[0]?.effect?.getComputedTiming().delay ?? 0),
    )
    expect(new Set(staggeredDelays).size).toBeGreaterThan(5)
  })

  test('captures microscene 4.1 for visual audit', async ({ page }, testInfo) => {
    await gotoFundamental(page)
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-fundamental-4-1.png` })
  })

  test('captures microscene 4.2 for visual audit', async ({ page }, testInfo) => {
    await gotoFundamental(page)
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-fundamental-4-2.png` })
  })

  test('opens microscene 4.3 and switches its physiology process panels', async ({ page }) => {
    await gotoFundamental(page)
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.3')
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')

    await expect(page.getByTestId('fundamental-physiology-menu')).toContainText('Detak Jantung')
    await expect(page.getByTestId('fundamental-physiology-panel')).toContainText('± 60–100 kali/menit')
    await page.getByRole('button', { name: /Pernapasan/ }).click()
    await expect(page.getByTestId('fundamental-physiology-panel')).toContainText('Inspirasi dan Ekspirasi')
    await page.getByRole('button', { name: /Aliran Darah/ }).click()
    await expect(page.getByTestId('fundamental-physiology-panel')).toContainText('arteri, vena, dan kapiler')
  })

  test('captures microscene 4.3 for visual audit', async ({ page }, testInfo) => {
    await gotoFundamental(page)
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-fundamental-4-3.png` })
  })

  test('opens microscene 4.4 and changes organization-level information', async ({ page }) => {
    await gotoFundamental(page)
    for (let step = 0; step < 3; step += 1) {
      await page.getByTestId('fundamental-next-button').click()
      await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    }

    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.4')
    await expect(page.getByTestId('fundamental-organization-detail')).toContainText('Unit Dasar Kehidupan')
    await page.getByRole('button', { name: 'Jaringan', exact: true }).click()
    await expect(page.getByTestId('fundamental-organization-detail')).toContainText('Kumpulan Sel Sejenis')
    await page.getByRole('button', { name: 'Sistem Organ', exact: true }).click()
    await expect(page.getByTestId('fundamental-organization-detail')).toContainText('Sistem kardiovaskular')
    await page.getByRole('button', { name: 'Organisme', exact: true }).click()
    await expect(page.getByTestId('fundamental-organization-detail')).toContainText('Kesatuan Tubuh Manusia')
  })

  test('captures microscene 4.4 for visual audit', async ({ page }, testInfo) => {
    await gotoFundamental(page)
    for (let step = 0; step < 3; step += 1) {
      await page.getByTestId('fundamental-next-button').click()
      await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    }
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-fundamental-4-4.png` })
  })

  test('keeps organization interaction stable without overflowing its detail card', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    await gotoFundamental(page)
    for (let step = 0; step < 3; step += 1) {
      await page.getByTestId('fundamental-next-button').click()
      await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    }

    const detail = page.getByTestId('fundamental-organization-detail')
    const levels = ['Sel', 'Jaringan', 'Organ', 'Sistem Organ', 'Organisme']
    for (let cycle = 0; cycle < 3; cycle += 1) {
      for (const level of levels) {
        const choice = page.getByRole('button', { name: level, exact: true })
        await choice.click()
        await expect(choice).toHaveAttribute('aria-pressed', 'true')
        const dimensions = await detail.evaluate((element) => ({
          clientWidth: element.clientWidth,
          clientHeight: element.clientHeight,
          scrollWidth: element.scrollWidth,
          scrollHeight: element.scrollHeight,
        }))
        expect(dimensions, `detail card overflows while ${level} is selected`).toEqual({
          clientWidth: dimensions.clientWidth,
          clientHeight: dimensions.clientHeight,
          scrollWidth: dimensions.clientWidth,
          scrollHeight: dimensions.clientHeight,
        })
      }
    }

    await page.getByTestId('fundamental-back-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.3')
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.4')
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.5')
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await expect(pageErrors).toEqual([])
  })

  test('matches homeostasis responses with click/tap alternative and checks the answer', async ({ page }) => {
    await gotoFundamental(page)
    for (let step = 0; step < 4; step += 1) {
      await page.getByTestId('fundamental-next-button').click()
      await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    }

    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.5')
    await expect(page.getByTestId('fundamental-homeostasis-info')).toContainText('Homeostasis adalah')
    await expect(page.getByTestId('fundamental-homeostasis-task')).toContainText('Perubahan pada tubuh')

    await page.getByTestId('homeostasis-response-sweat').dragTo(page.getByTestId('homeostasis-drop-temperature'))
    await expect(page.getByTestId('homeostasis-drop-temperature')).toHaveAccessibleName('Suhu tubuh meningkat: Berkeringat')

    for (const [response, target] of [
      ['Muncul rasa haus', /Pilih respons untuk Tubuh kekurangan cairan/],
      ['Mengeluarkan insulin', /Pilih respons untuk Kadar gula darah meningkat/],
    ] as const) {
      await page.getByRole('button', { name: new RegExp(`^${response}`) }).click()
      await page.getByRole('button', { name: target }).click()
    }

    await page.getByTestId('homeostasis-check-button').click()
    await expect(page.getByTestId('homeostasis-feedback')).toContainText('Hebat!')
    await expect(page.getByTestId('fundamental-next-button')).toBeEnabled()
  })

  test('keeps the previous action unavailable in microscene 4.5 and 4.6', async ({ page }) => {
    await gotoFundamental(page)
    for (let step = 0; step < 4; step += 1) {
      await page.getByTestId('fundamental-next-button').click()
      await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    }
    await expect(page.getByTestId('fundamental-back-button')).toBeDisabled()
    await expect(page.getByTestId('fundamental-back-button')).toHaveAccessibleName('Sebelumnya, tidak tersedia pada aktivitas ini')

    for (const [response, target] of [
      ['sweat', 'temperature'], ['thirst', 'fluid'], ['insulin', 'glucose'],
    ] as const) {
      await page.getByTestId(`homeostasis-response-${response}`).click()
      await page.getByTestId(`homeostasis-drop-${target}`).click()
    }
    await page.getByTestId('homeostasis-check-button').click()
    await page.getByTestId('fundamental-next-button').click()
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-microscene', '4.6')
    await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    await expect(page.getByTestId('fundamental-back-button')).toBeDisabled()
    await expect(page.getByTestId('fundamental-back-button')).toHaveAccessibleName('Sebelumnya, tidak tersedia pada aktivitas ini')
  })

  test('captures microscene 4.5 for visual audit', async ({ page }, testInfo) => {
    await gotoFundamental(page)
    for (let step = 0; step < 4; step += 1) {
      await page.getByTestId('fundamental-next-button').click()
      await expect(page.getByTestId('fundamental-scene')).toHaveAttribute('data-phase', 'idle')
    }
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-fundamental-4-5.png` })
  })

  test('groups anatomy and physiology cards with drag-and-drop plus the click alternative', async ({ page }) => {
    await gotoClassification(page)
    await expect(page.getByTestId('classification-progress')).toContainText('0 / 8')
    await expect(page.getByTestId('classification-check-button')).toBeDisabled()

    await page.getByTestId('classification-card-heart-shape').dragTo(page.getByTestId('classification-drop-anatomy'))
    await expect(page.getByTestId('classification-drop-anatomy')).toHaveAccessibleName(/1 kartu ditempatkan/)

    for (const [card, target] of [
      ['lungs-location', 'anatomy'], ['bone-structure', 'anatomy'], ['kidney-position', 'anatomy'],
      ['heart-pumps', 'physiology'], ['lungs-expand', 'physiology'], ['muscle-contracts', 'physiology'], ['kidney-filters', 'physiology'],
    ] as const) {
      await page.getByTestId(`classification-card-${card}`).click()
      await page.getByTestId(`classification-drop-${target}`).click()
    }

    await expect(page.getByTestId('classification-progress')).toContainText('8 / 8')
    await expect(page.getByTestId('classification-check-button')).toBeEnabled()
    await page.getByTestId('classification-check-button').click()
    await expect(page.getByTestId('classification-feedback')).toContainText('Hebat!')
  })

  test('captures microscene 4.6 for visual audit', async ({ page }, testInfo) => {
    await gotoClassification(page)
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-fundamental-4-6.png` })
  })
})
