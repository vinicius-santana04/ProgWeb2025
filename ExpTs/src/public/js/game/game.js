import { FPS } from "./config.js"
import { space } from "./space.js"
import { ship } from "./ship.js"
import { enemyShips, createRandomEnemyShip, moveEnemyShips, createRandomObstacle, moveObstacles, obstacles } from "./enemyShip.js"
import { bullets, createBullet, moveBullets } from "./bullet.js"


let gameStarted = false
let gamePaused = false
let gameLoop = null
let score = 0
let lives = 3
let lastShotTime = 0
let gameStartTime;
window.obstacleSpeedMultiplier = 1
const livesDisplay = document.getElementById("lives")
const scoreDisplay = document.getElementById("score")
const shotCooldown = 50
const startMsg = document.getElementById("start-message")
const pauseMsg = document.getElementById("pause-message")
const lobbyBtn = document.getElementById("back-to-lobby-btn");
setInterval(() => { space.move() }, 1000 / FPS)


function init() {
    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();

        if (e.code === "Space") {
            if (!gameStarted) {
                startGame();
            } else if (!gamePaused) {
                fireBullet();
            }
        }

        if (gameStarted && key === "p") {
            gamePaused = !gamePaused;
            if (gamePaused) {
                pauseMsg.style.display = "block";
                if (lobbyBtn) lobbyBtn.style.display = "block";
            } else {
                pauseMsg.style.display = "none";
                if (lobbyBtn) lobbyBtn.style.display = "none";
            }
        }

        if (key === "r" && gameStarted && gamePaused) {
            restartGame();
        }

        if (gameStarted && !gamePaused) {
            if (key === "arrowleft" || key === "a") ship.movingLeft = true;
            if (key === "arrowright" || key === "d") ship.movingRight = true;
        }
    });

    document.addEventListener("keyup", (e) => {
        const key = e.key.toLowerCase();
        if (key === "arrowleft" || key === "a") ship.movingLeft = false;
        if (key === "arrowright" || key === "d") ship.movingRight = false;
    });
}

function startGame() {
    gameStarted = true
    gamePaused = false
    gameStartTime = Date.now();

    if (gameLoop) clearInterval(gameLoop)
    if (lobbyBtn) lobbyBtn.style.display = "none";

    gameLoop = setInterval(run, 1000 / FPS)

    setInterval(() => {
        window.obstacleSpeedMultiplier += 0.3
    }, 60000)

    if (startMsg) startMsg.style.display = "none"
}

function restartGame() {
    if (gameLoop) {
        clearInterval(gameLoop)
        gameLoop = null
    }
    if (lobbyBtn) lobbyBtn.style.display = "none";

    gameStarted = false
    gamePaused = false
    score = 0
    lives = 3
    lastShotTime = 0

    scoreDisplay.textContent = "000000"
    updateLives()

    ship.damaged = false
    ship.updateConditionByLives(lives)
    ship.reset()
    ship.movingLeft = false
    ship.movingRight = false

    bullets.forEach(b => b.remove())
    bullets.length = 0

    enemyShips.forEach(e => e.remove())
    enemyShips.length = 0

    obstacles.forEach(o => o.remove())
    obstacles.length = 0

    if (startMsg) startMsg.style.display = "block"
    if (pauseMsg) pauseMsg.style.display = "none"
}

function updateLives() {
    livesDisplay.innerHTML = ""
    for (let i = 0; i < lives; i++) {
        const img = document.createElement("img")
        img.src = "assets/png/life.png"
        livesDisplay.appendChild(img)
    }
}

function fireBullet() {
    const now = Date.now()
    if (now - lastShotTime < shotCooldown) return

    lastShotTime = now

    const shipX = parseInt(ship.element.style.left)
    const shipY = parseInt(ship.element.style.bottom)
    const shipWidth = ship.element.offsetWidth || 100

    const bulletX = shipX + shipWidth / 2 - 5
    const bulletY = shipY + ship.element.offsetHeight

    createBullet(bulletX, bulletY)
}

function checkCollisions() {
    const shipRect = ship.element.getBoundingClientRect()

    for (let i = bullets.length - 1; i >= 0; i--) {
        const bulletRect = bullets[i].element.getBoundingClientRect()

        for (let j = enemyShips.length - 1; j >= 0; j--) {
            const enemyRect = enemyShips[j].element.getBoundingClientRect()
            const hit =
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top

            if (hit) {
                const bullet = bullets[i].element
                bullet.src = "assets/png/laserRedShot.png"
                bullet.style.width = "35px"
                bullet.style.height = "50px"

                setTimeout(() => {
                    bullets[i]?.remove()
                    bullets.splice(i, 1)
                }, 50)

                enemyShips[j].remove()
                enemyShips.splice(j, 1)
                score += 50
                scoreDisplay.textContent = score.toString().padStart(6, "0")
                break
            }
        }

        for (let j = obstacles.length - 1; j >= 0; j--) {
            const obsRect = obstacles[j].element.getBoundingClientRect()
            const hit =
                bulletRect.left < obsRect.right &&
                bulletRect.right > obsRect.left &&
                bulletRect.top < obsRect.bottom &&
                bulletRect.bottom > obsRect.top

            if (hit) {
                const bullet = bullets[i].element
                bullet.src = "assets/png/laserRedShot.png"
                bullet.style.width = "35px"
                bullet.style.height = "50px"

                setTimeout(() => {
                    bullets[i]?.remove()
                    bullets.splice(i, 1)
                }, 50)

                const type = obstacles[j].type
                let points = 0
                if (type === "meteorBig") points = 10
                else if (type === "enemyUFO") points = 20
                else if (type === "meteorSmall") points = 100

                obstacles[j].remove()
                obstacles.splice(j, 1)
                score += points
                scoreDisplay.textContent = score.toString().padStart(6, "0")
                break
            }
        }
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obsRect = obstacles[i].element.getBoundingClientRect()
        const hit =
            shipRect.left < obsRect.right &&
            shipRect.right > obsRect.left &&
            shipRect.top < obsRect.bottom &&
            shipRect.bottom > obsRect.top

        if (hit) {
            obstacles[i].remove()
            obstacles.splice(i, 1)
            applyDamageToShip()
            break
        }
    }

    for (let i = enemyShips.length - 1; i >= 0; i--) {
        const enemyRect = enemyShips[i].element.getBoundingClientRect()
        const hit =
            shipRect.left < enemyRect.right &&
            shipRect.right > enemyRect.left &&
            shipRect.top < enemyRect.bottom &&
            shipRect.bottom > enemyRect.top

        if (hit) {
            enemyShips[i].remove()
            enemyShips.splice(i, 1)
            applyDamageToShip()
            break
        }
    }
}

function applyDamageToShip() {
    lives--
    updateLives()
    ship.updateConditionByLives(lives)
    ship.flash()

    if (lives < 0) {
        handleGameOver();
    }
}

function handleGameOver() {
    if (gamePaused) return;

    gamePaused = true;
    clearInterval(gameLoop);

    const gameEndTime = Date.now();
    const durationInSeconds = Math.round((gameEndTime - gameStartTime) / 1000);

    saveGameSession(score, durationInSeconds);

    if (pauseMsg) {
        pauseMsg.innerHTML = `
            <h2>FIM DE JOGO</h2>
            <p>Seu score foi: <strong>${score}</strong></p>
            <p>Pressione <strong>R</strong> para reiniciar</p>
            <div class="mt-3">
                <a href="/lobby" class="btn btn-secondary">Voltar ao Lobby</a>
            </div>
        `;
        pauseMsg.style.display = "block";
    }
    if (lobbyBtn) lobbyBtn.style.display = "none";
}

async function saveGameSession(finalScore, gameDuration) {
    try {
        const response = await fetch('/game/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: finalScore, duration: gameDuration }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Resposta do servidor:', result.message);
        } else {
            const errorData = await response.json();
            console.error('Falha ao salvar o score. Status:', response.status, 'Mensagem:', errorData.error);
            alert(`Não foi possível salvar seu score: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Erro de conexão ao tentar salvar o score:', error);
    }
}

function run() {
    if (!gameStarted || gamePaused) return

    ship.move()
    createRandomEnemyShip()
    moveEnemyShips()
    moveBullets()
    createRandomObstacle()
    moveObstacles()
    checkCollisions()

    scoreDisplay.textContent = score.toString().padStart(6, "0")
}

init()
updateLives()
