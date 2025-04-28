import { TAMX, PROB_ENEMY_SHIP } from "./config.js"
import { space } from "./space.js"

class EnemyShip {
  constructor() {
    this.element = document.createElement("img")
    this.element.className = "enemy-ship"
    this.element.src = "assets/png/enemyShip.png"
    this.element.style.position = "absolute"
    this.element.style.top = "-20px"
    this.element.style.left = `${Math.floor(Math.random() * (TAMX - 60))}px`
    space.element.appendChild(this.element)
    this.speed = Math.random() * (2 - 1) + 1 * window.obstacleSpeedMultiplier
  }

  move() {
    const currentTop = parseFloat(this.element.style.top)
    this.element.style.top = `${currentTop + this.speed}px`
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.remove()
    }
  }
}

class Obstacle {
  constructor(type) {
    this.type = type
    this.element = document.createElement("img")
    this.element.className = "obstacle"
    this.element.style.position = "absolute"
    this.element.style.top = "-20px"
    this.element.style.left = `${Math.floor(Math.random() * (TAMX - 60))}px`

    if (type === "enemyUFO") {
      this.element.src = "assets/png/enemyUFO.png"
      this.speed = Math.random() * (2 - 1) + 1 * window.obstacleSpeedMultiplier
    } else if (type === "meteorBig") {
      this.element.src = "assets/png/meteorBig.png"
      this.speed = Math.random() * (1.2 - 0.4) + 0.4 * window.obstacleSpeedMultiplier
    } else {
      this.element.src = "assets/png/meteorSmall.png"
      this.speed = Math.random() * (2.5 - 1.2) + 1.2 * window.obstacleSpeedMultiplier
    }

    space.element.appendChild(this.element)
  }

  move() {
    const currentTop = parseFloat(this.element.style.top)
    this.element.style.top = `${currentTop + this.speed}px`
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.remove()
    }
  }
}


// ===== Exportações =====
export const obstacles = []

export function createRandomObstacle() {
  const rand = Math.random()

  if (rand < 0.002) {
    obstacles.push(new Obstacle("enemyUFO"))
  } else if (rand < 0.005) {
    obstacles.push(new Obstacle("meteorBig"))
  } else if (rand < 0.015) {
    obstacles.push(new Obstacle("meteorSmall"))
  }
}

export function moveObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].move()

    const currentTop = parseFloat(obstacles[i].element.style.top)
    if (currentTop > 900) {
      obstacles[i].remove()
      obstacles.splice(i, 1)
    }
  }
}

export const enemyShips = []

export const createRandomEnemyShip = () => {
  if (Math.random() < PROB_ENEMY_SHIP) {
    enemyShips.push(new EnemyShip())
  }
}

export const moveEnemyShips = () => {
  for (let i = enemyShips.length - 1; i >= 0; i--) {
    enemyShips[i].move()

    const currentTop = parseFloat(enemyShips[i].element.style.top)
    if (currentTop > 900) {
      enemyShips[i].remove()
      enemyShips.splice(i, 1)
    }
  }
}

