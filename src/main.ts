import { MatrixRain } from './matrix-rain'
import './style.css'

function init(): void {
  const canvas = document.createElement('canvas')
  canvas.id = 'matrix-canvas'
  document.body.appendChild(canvas)

  const matrixRain = new MatrixRain(canvas)
  matrixRain.start()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
