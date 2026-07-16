// client/client.js

const SERVER_ADDRESS = 'ws://localhost:3000'; 
let socket;
let keys = {};
let playerSpeed = 0.15;
let otherPlayers = {};

function connectToServer() {
    socket = new WebSocket(SERVER_ADDRESS);

    socket.onopen = () => {
        console.log('Підключено до YourWorld Engine!');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 1. Ініціалізація світу (завантажуємо всі об'єкти карти при вході)
        if (data.type === 'init_world') {
            for (const id in data.entities) {
                spawnEntityInWorld(id, data.entities[id]);
            }
        }

        // 2. Створення нового об'єкта в реальному часі
        if (data.type === 'entity_created') {
            spawnEntityInWorld(data.id, data.data);
        }

        // 3. Рух інших гравців
        if (data.type === 'player_moved') {
            updateOtherPlayer(data.id, data.x, data.y, data.z);
        }

        // 4. Відкат при підозрі на читерство
        if (data.type === 'rollback') {
            playerMesh.position.set(data.x, data.y, data.z);
        }

        // 5. Вихід гравця
        if (data.type === 'player_disconnected') {
            if (otherPlayers[data.id]) {
                scene.remove(otherPlayers[data.id]);
                delete otherPlayers[data.id];
            }
        }
    };
}

function updateOtherPlayer(id, x, y, z) {
    if (!otherPlayers[id]) {
        const geo = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
        const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
        otherPlayers[id] = mesh;
    }
    otherPlayers[id].position.set(x, y, z);
}

// Рух
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function updateGameLoop() {
    let moved = false;

    if (keys['KeyW']) { playerMesh.position.z -= playerSpeed; moved = true; }
    if (keys['KeyS']) { playerMesh.position.z += playerSpeed; moved = true; }
    if (keys['KeyA']) { playerMesh.position.x -= playerSpeed; moved = true; }
    if (keys['KeyD']) { playerMesh.position.x += playerSpeed; moved = true; }

    camera.position.set(playerMesh.position.x, playerMesh.position.y + 5, playerMesh.position.z + 10);

    if (moved && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'move',
            x: playerMesh.position.x,
            y: playerMesh.position.y,
            z: playerMesh.position.z
        }));
    }

    requestAnimationFrame(updateGameLoop);
}

// Тестова кнопка спавну об'єкта (для перевірки творцями)
// Якщо затиснути Shift + Клік, ми спавнимо універсальний об'єкт (за замовчуванням куб, але можна передати будь-яку модель)
window.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'spawn_entity',
                x: playerMesh.position.x,
                y: playerMesh.position.y,
                z: playerMesh.position.z - 5,
                scale: { x: 1, y: 1, z: 1 },
                // Тут творець може вставити лінк на БУДЬ-ЯКУ модель з інтернету!
                modelURL: '' // Залиш порожнім для куба, або встав лінк на .gltf модель
            }));
        }
    }
});

connectToServer();
updateGameLoop();
