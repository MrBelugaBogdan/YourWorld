// yourworld/server/physics.js
const CONFIG = require('./config');

class PhysicsEngine {
    constructor() {
        this.players = {}; // { playerId: { x, y, z, lastUpdate } }
        this.worldEntities = {}; // { entityId: { type, x, y, z, modelURL, scale: {x,y,z} } }
    }

    // Створення будь-якого об'єкта у світі творцем карти
    spawnEntity(creatorId, entityId, data) {
        // Перевірка прав (у майбутньому тут буде перевірка, чи це адмін/творець карти)
        this.worldEntities[entityId] = {
            type: data.type || 'prop',       // 'prop', 'interactive', 'spawner' тощо
            x: data.x || 0,
            y: data.y || 0,
            z: data.z || 0,
            rotation: data.rotation || { x: 0, y: 0, z: 0 },
            scale: data.scale || { x: 1, y: 1, z: 1 },
            modelURL: data.modelURL || '',   // Посилання на будь-яку 3D модель (.gltf / .obj)
            properties: data.properties || {} // Кастомні дані (наприклад, { hp: 100, solid: true })
        };
        return true;
    }

    // Перевірка руху гравців
    validateMovement(playerId, newX, newY, newZ) {
        const player = this.players[playerId];
        if (!player) {
            this.players[playerId] = { x: newX, y: newY, z: newZ, lastUpdate: Date.now() };
            return { valid: true };
        }

        const now = Date.now();
        const timeDiff = (now - player.lastUpdate) / 1000;
        if (timeDiff <= 0) return { valid: true };

        const distance = Math.sqrt(
            Math.pow(newX - player.x, 2) + 
            Math.pow(newY - player.y, 2) + 
            Math.pow(newZ - player.z, 2)
        );

        const speed = distance / timeDiff;

        // Перевірка на чит швидкості
        if (speed > CONFIG.LIMITS.MAX_SPEED) {
            return { valid: false, rollbackX: player.x, rollbackY: player.y, rollbackZ: player.z };
        }

        player.x = newX;
        player.y = newY;
        player.z = newZ;
        player.lastUpdate = now;
        return { valid: true };
    }
}

module.exports = PhysicsEngine;
