// client/engine.js

let scene, camera, renderer;
let playerMesh;
const loader = new THREE.GLTFLoader(); // Завантажувач для будь-яких 3D моделей (.gltf / .glb)

function init3D() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0); // Нейтральний колір студії

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Світло для будь-яких типів моделей
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // Проста сітка підлоги (Grid) — як у професійних 3D редакторах
    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    // Візуальний маркер гравця (проста капсула, яку теж можна буде замінити на скін)
    const playerGeo = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    playerMesh = new THREE.Mesh(playerGeo, playerMat);
    playerMesh.position.y = 1;
    scene.add(playerMesh);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// Головна гнучка функція: спавнить БУДЬ-ЯКИЙ об'єкт
function spawnEntityInWorld(id, data) {
    if (data.modelURL) {
        // Якщо творець карти вказав посилання на 3D модель, завантажуємо її
        loader.load(data.modelURL, (gltf) => {
            const model = gltf.scene;
            model.position.set(data.x, data.y, data.z);
            model.scale.set(data.scale.x, data.scale.y, data.scale.z);
            model.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
            model.name = id;
            scene.add(model);
        }, undefined, (error) => {
            console.error('Не вдалося завантажити модель об\'єкта:', error);
            // Фолбек: якщо модель не завантажилась, малюємо простий плейсхолдер куб
            createFallbackCube(id, data);
        });
    } else {
        // Якщо моделі немає — робимо базовий куб (корисно для швидких тестів)
        createFallbackCube(id, data);
    }
}

function createFallbackCube(id, data) {
    const geo = new THREE.BoxGeometry(data.scale.x, data.scale.y, data.scale.z);
    const mat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const cube = new THREE.Mesh(geo, mat);
    cube.position.set(data.x, data.y, data.z);
    cube.name = id;
    scene.add(cube);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.onload = init3D;
