import { space } from "./space.js"

const directions = [
    "assets/png/laserRed.png",
    "assets/png/laserRedShot.png",
]

class Bullet {
    constructor(x, y) {
        this.element = document.createElement("img")
        this.element.className = "bullet"
        this.directions = 0
        this.element.src = directions[this.directions]
        this.element.style.position = "absolute"
        this.element.style.left = `${x}px`
        this.element.style.bottom = `${y}px`
        space.element.appendChild(this.element)
    }

    move() {
        const currentBottom = parseInt(this.element.style.bottom)
        this.element.style.bottom = `${currentBottom + 3}px`
    }

    ifOffScreen() {
        return parseInt(this.element.style.bottom) > 900
    }

    remove() {
        this.element.remove()
    }
}

export const bullets = []

export function createBullet(x, y) {
    bullets.push(new Bullet(x, y))
}

export function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].move()
        if (bullets[i].ifOffScreen()) {
            bullets[i].remove()
            bullets.splice(i, 1)
        }
    }
}