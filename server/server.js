// yourworld/server/server.js
const http = require('http');
const WebSocket = require('ws');
const CONFIG = require('./config');
const PhysicsEngine = require('./physics');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('YourWorld Game Platform Server is Running!');
});

const wss = new WebSocket.Server({ server });
const physics = new PhysicsEngine();

wss.on('connection', (ws) => {
    const playerId = Math.random().toString(36).substring(2, 9);
    console.log(`Клієнт підключився: ${playerId}`);

    // При підключенні відправляємо гравцеві всі об'єкти, які вже є на карті
    ws.send(JSON.stringify({
        type: 'init_world',
        entities: physics.worldEntities
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // Рух гравця
            if (data.type === 'move') {
                const check = physics.validateMovement(playerId, data.x, data.y, data.z);
                if (!check.valid) {
                    ws.send(JSON.stringify({
                        type: 'rollback',
                        x: check.rollbackX, y: check.rollbackY, z: check.rollbackZ
                    }));
                } else {
                    broadcast({ type: 'player_moved', id: playerId, x: data.x, y: data.y, z: data.z }, ws);
                }
            }

            // Творець спавнить новий об'єкт (це може бути будь-що: дерево, куб, машина)
            if (data.type === 'spawn_entity') {
                const entityId = Math.random().toString(36).substring(2, 9);
                const success = physics.spawnEntity(playerId, entityId, data);
                if (success) {
                    broadcast({
                        type: 'entity_created',
                        id: entityId,
                        data: physics.worldEntities[entityId]
                    });
                }
            }

        } catch (e) {
            console.error('Помилка обробки пакету:', e);
        }
    });

    ws.on('close', () => {
        console.log(`Клієнт відключився: ${playerId}`);
        delete physics.players[playerId];
        broadcast({ type: 'player_disconnected', id: playerId });
    });
});

function broadcast(data, clientToSkip = null) {
    const msg = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== clientToSkip) {
            client.send(msg);
        }
    });
}

server.listen(CONFIG.PORT, () => {
    console.log(`[YourWorld] Двигун запущено на порту ${CONFIG.PORT}`);
});
