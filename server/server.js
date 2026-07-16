// yourworld/server/server.js
const http = require('http');
const WebSocket = require('ws'); // Легка бібліотека для швидких мережевих ігор
const CONFIG = require('./config');
const PhysicsEngine = require('./physics');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Сервер ігрового двигуна YourWorld працює!');
});

const wss = new WebSocket.Server({ server });
const physics = new PhysicsEngine();

wss.on('connection', (ws) => {
    const playerId = Math.random().toString(36).substring(2, 9);
    console.log(`Гравець підключився: ${playerId}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // Обробка руху
            if (data.type === 'move') {
                const check = physics.validateMovement(playerId, data.x, data.y, data.z);
                if (check.valid === false) {
                    // Якщо читернув — відкочуємо назад
                    ws.send(JSON.stringify({
                        type: 'rollback',
                        x: check.rollbackX,
                        y: check.rollbackY,
                        z: check.rollbackZ
                    }));
                } else {
                    // Якщо все ок — транслюємо його координати всім іншим
                    broadcast({ type: 'player_moved', id: playerId, x: data.x, y: data.y, z: data.z }, ws);
                }
            }

            // Обробка будівництва блоків
            if (data.type === 'build') {
                const success = physics.addBlock(playerId, data.x, data.y, data.z, data.blockType);
                if (success) {
                    broadcast({ type: 'block_placed', x: data.x, y: data.y, z: data.z, blockType: data.blockType });
                }
            }

        } catch (e) {
            console.error('Помилка обробки пакету:', e);
        }
    });

    ws.on('close', () => {
        console.log(`Гравець відключився: ${playerId}`);
        delete physics.players[playerId];
        broadcast({ type: 'player_disconnected', id: playerId });
    });
});

// Функція відправки повідомлення всім гравцям (окрім відправника, якщо вказано clientToSkip)
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
    console.log(`[YourWorld] Готовий приймати гравців за адресою: ${CONFIG.SERVER_URL}`);
});
