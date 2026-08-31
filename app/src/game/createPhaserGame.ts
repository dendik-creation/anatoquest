import Phaser from 'phaser'

type CreateGameOptions = {
  onReady: () => void
}

class BootstrapScene extends Phaser.Scene {
  private readonly onReady: () => void

  constructor(onReady: () => void) {
    super({ key: 'bootstrap' })
    this.onReady = onReady
  }

  create() {
    this.cameras.main.setBackgroundColor('#12355B')
    this.onReady()
  }
}

export function createPhaserGame(
  parent: HTMLElement,
  options: CreateGameOptions,
) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 540,
    backgroundColor: '#12355B',
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: true,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 540,
    },
    scene: [new BootstrapScene(options.onReady)],
  })

  return () => game.destroy(true)
}
