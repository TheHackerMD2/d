const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;

const player = {
    x: 100,
    y: 100,
    size: 20,
    speed: 3,
    color: 'blue',
};

const blockSize = 20;
const worldWidth = canvas.width / blockSize;
const worldHeight = canvas.height / blockSize;

const world = Array.from({ length: worldHeight }, () => Array(worldWidth).fill(null));

let inventory = {
    wood: 0,
    stone: 0,
    dirt: 0,
};

let isDay = true;

function updateInventoryDisplay() {
    document.getElementById('wood-count').textContent = inventory.wood;
    document.getElementById('stone-count').textContent = inventory.stone;
    document.getElementById('dirt-count').textContent = inventory.dirt;
}

function drawWorld() {
    for (let y = 0; y < worldHeight; y++) {
        for (let x = 0; x < worldWidth; x++) {
            const block = world[y][x];
            if (block) {
                ctx.fillStyle = block;
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawDayNightCycle() {
    ctx.fillStyle = isDay ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function movePlayer(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (player.y > 0) player.y -= player.speed;
            break;
        case 'ArrowDown':
            if (player.y < canvas.height - player.size) player.y += player.speed;
            break;
        case 'ArrowLeft':
            if (player.x > 0) player.x -= player.speed;
            break;
        case 'ArrowRight':
            if (player.x < canvas.width - player.size) player.x += player.speed;
            break;
    }
}

function placeBlock(event) {
    const x = Math.floor(player.x / blockSize);
    const y = Math.floor(player.y / blockSize);

    if (event.key === 'p') {
        if (inventory.dirt > 0) {
            world[y][x] = 'brown'; // Dirt block color
            inventory.dirt--;
            updateInventoryDisplay();
        } else if (inventory.stone > 0) {
            world[y][x] = 'gray'; // Stone block color
            inventory.stone--;
            updateInventoryDisplay();
        } else if (inventory.wood > 0) {
            world[y][x] = 'saddlebrown'; // Wood block color
            inventory.wood--;
            updateInventoryDisplay();
        }
    }

    if (event.key === 'r') {
        world[y][x] = null; // Remove block
    }
}

function toggleDayNight() {
    isDay = !isDay;
}

function collectBlock() {
    const x = Math.floor(player.x / blockSize);
    const y = Math.floor(player.y / blockSize);
    const block = world[y][x];

    if (block) {
        switch (block) {
            case 'brown':
                inventory.dirt++;
                break;
            case 'gray':
                inventory.stone++;
                break;
            case 'saddlebrown':
                inventory.wood++;
                break;
        }
        world[y][x] = null; // Remove the block after collecting
        updateInventoryDisplay();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDayNightCycle();
    drawWorld();
    drawPlayer();
}

function gameKeyEvents(event) {
    movePlayer(event);
    placeBlock(event);
    collectBlock();
}

function init() {
    window.addEventListener('keydown', gameKeyEvents);
    setInterval(toggleDayNight, 5000); // Toggle day/night every 5 seconds
    setInterval(gameLoop, 1000 / 60); // 60 FPS
}

init();
