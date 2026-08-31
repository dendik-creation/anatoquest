# AnatoQuest Application

React + Vite + Phaser 3 application foundation for AnatoQuest.

```bash
bun install
bun dev
```

Quality checks:

```bash
bun run typecheck
bun run lint
bun run build
```

The current Phaser bootstrap intentionally contains no learning gameplay. It verifies lazy engine loading and teardown only. Follow the phase order in `../TASKS.md` before adding scenes or assets.
