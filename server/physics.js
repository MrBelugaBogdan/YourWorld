// yourworld/server/physics.js
const CONFIG = require('./config');

class PhysicsEngine {
    constructor() {
        this.players = {}; // Зберігаємо координати всіх гравців: { playerId: {x, y, z, lastUpdate} }
        this.worldBlocks = new Set(); // Зберігаємо координати існуючих блоків "x,y,z"
    }

    // Додати блок у світ (сервер перевіряє безпеку перед цим)
    addBlock(playerId, x, y, z, blockType) {
        const player = this.players[playerId];
        if (!player) return false;

        // Перевірка 1: Чи не занадто далеко гравець намагається поставити блок?
        const distance = Math.sqrt(
            Math.pow(player.x - x, 2) + 
            Math.pow(player.y - y, 2) + 
            Math.pow(player.z - z, 2)
        );

        if (distance > CONFIG.LIMITS.MAX_BUILD_DISTANCE) {
            console.log(`[БЕЗПЕКА] Гравець ${playerId} намагався поставити блок занадто далеко!`);
            return false; // Читер намагався будувати здалеку
        }

        // Перевірка 2: Чи немає там уже блоку?
        const blockKey = `${x},${y},${z}`;
        if (this.worldBlocks.has(blockKey)) {
            return false; 
        }

        this.worldBlocks.add(blockKey);
        return true; // Блок успішно поставлено
    }

    // Перевірка руху гравця на швидкість та телепортацію
    validateMovement(playerId, newX, newY, newZ) {
        const player = this.players[playerId];
        if (!player) {
            this.players[playerId] = { x: newX, y: newY, z: newZ, lastUpdate: Date.now() };
            return true;
        }

        const now = Date.now();
        const timeDiff = (now - player.lastUpdate) / 1000; // Час у секундах з минулого кроку

        if (timeDiff <= 0) return true;

        // Вираховуємо відстань, яку гравець пройшов
        const distance = Math.sqrt(
            Math.pow(newX - player.x, 2) + 
            Math.pow(newY - player.y, 2) + 
            Math.pow(newZ - player.z, 2)
        );

        // Реальна швидкість = відстань / час
        const speed = distance / timeDiff;

        if (speed > CONFIG.LIMITS.MAX_SPEED) {
            console.log(`[БЕЗПЕКА] Гравець ${playerId} рухається занадто швидко! Швидкість: ${speed.toFixed(1)} м/с`);
            // Повертаємо гравця на старі безпечні координати (анти-телепорт)
            return { valid: false, rollbackX: player.x, rollbackY: player.y, rollbackZ: player.z };
        }

        // Якщо все чесно — оновлюємо дані на сервері
        player.x = newX;
        player.y = newY;
        player.z = newZ;
        player.lastUpdate = now;
        return { valid: true };
    }
}

module.exports = PhysicsEngine;
