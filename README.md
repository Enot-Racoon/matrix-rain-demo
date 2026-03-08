# Matrix Rain

Cinematic Matrix-style digital rain animation rendered on HTML5 Canvas.

![Matrix Rain](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## Demo

👉 [Live Demo](https://matrix-rain-demo.netlify.app)

## Features

- 🎬 Smooth 60fps animation using `requestAnimationFrame`
- 📱 Responsive fullscreen canvas with proper DPI handling
- 🌊 Independent falling streams with random speeds and lengths
- ✨ Bright leading characters with fading trails
- 🎨 Character set includes Katakana, Latin letters, and digits
- 🚀 Optimized for performance on large screens

## Tech Stack

- **TypeScript** - Type-safe code
- **Vite** - Fast build tool and dev server
- **HTML5 Canvas 2D API** - Rendering

## Installation

```bash
git clone https://github.com/Enot-Racoon/matrix-rain-demo.git
cd matrix-rain-demo
npm install
```

## Usage

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
matrix-rain-demo/
├── src/
│   ├── main.ts           # Entry point
│   ├── matrix-rain.ts    # MatrixRain class & Stream class
│   └── style.css         # Fullscreen styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Architecture

### `MatrixRain` Class

Main controller that manages:
- Canvas setup and resize handling
- Stream collection management
- Animation loop
- Character set initialization

### `Stream` Class

Represents a single vertical column of falling characters:
- Random speed and length
- Independent position tracking
- Character randomization
- Brightness variation for visual depth

## Visual Details

- **Background**: Near-black (#000)
- **Head character**: Bright white with glow effect
- **Body characters**: Green gradient fading towards tail
- **Characters**: Mix of Katakana (アイウエ...), Latin (A-Z), and digits (0-9)
- **Trail**: Semi-transparent fade effect for smooth motion

## Performance

Optimized for 60fps:
- Minimal allocations in animation loop
- Efficient canvas clearing with fade effect
- Device pixel ratio handling for crisp rendering
- Viewport-based column calculation

## License

MIT
