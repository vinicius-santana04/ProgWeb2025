import { TAMX } from "./config.js"
import { space } from "./space.js"

const directions = [
  "assets/png/playerLeft.png",
  "assets/png/player.png",
  "assets/png/playerRight.png",
  "assets/png/playerDamaged.png",
]

const directionsDamaged = [
  "assets/png/playerLeft.png",
  "assets/png/playerDamaged.png",
  "assets/png/playerRight.png",
]

class Ship {
  constructor() {
    this.element = document.createElement("img")
    this.element.id = "ship"
    this.movingLeft = false
    this.movingRight = false
    this.damaged = false
    this.direction = 1
    this.element.src = directions[this.direction]
    this.element.style.bottom = "20px"
    this.element.style.left = `${TAMX / 2 - 50}px`
    space.element.appendChild(this.element)
  }

  changeDirection(giro) { // -1 +1
    if (this.direction + giro >= 0 && this.direction + giro <= 2)
      this.direction = this.direction + giro
    this.element.src = directions[this.direction]
  }

  move() {
    const currentLeft = parseInt(this.element.style.left)
    const shipWidth = this.element.offsetWidth || 100

    const dirArray = this.damaged ? directionsDamaged : directions

    if (this.movingLeft && currentLeft > 0) {
      this.element.style.left = `${currentLeft - 5}px`
      this.element.src = dirArray[0] // esquerda
    } else if (this.movingRight && currentLeft + shipWidth < TAMX) {
      this.element.style.left = `${currentLeft + 5}px`
      this.element.src = dirArray[2] // direita
    } else {
      this.element.src = dirArray[1] // parada
    }
  }
  updateConditionByLives(lives) {
    if (lives < 3) {
      this.damaged = true
    } else {
      this.damaged = false
    }
  }
  flash() {
    // Trocar imagem para danificada
    this.damaged = true
    this.element.src = "assets/png/playerDamaged.png"

    let flashes = 0
    const interval = setInterval(() => {
      this.element.style.visibility =
          this.element.style.visibility === "hidden" ? "visible" : "hidden"
      flashes++
      if (flashes >= 25) { // 25 * 200ms = 5 segundos
        clearInterval(interval)
        this.element.style.visibility = "visible"
        this.damaged = false

        // Restaurar sprite normal após dano
        this.element.src = this.direction === 0
            ? "assets/png/playerLeft.png"
            : this.direction === 2
                ? "assets/png/playerRight.png"
                : "assets/png/player.png"
      }
    }, 200)
  }


  reset() {
    this.direction = 1
    this.element.src = "assets/png/player.png"
    this.element.style.left = `${TAMX / 2 - 50}px`
  }
}

export const ship = new Ship()
