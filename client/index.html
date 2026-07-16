<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YourWorld - Платформа Твого Світу</title>
    <style>
        /* Обнуляємо відступи, щоб гра була на весь екран */
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #111111;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            user-select: none; /* Забороняємо виділення тексту під час гри */
        }

        /* Ігрове UI поверх 3D сцени */
        #ui-container {
            position: absolute;
            top: 20px;
            left: 20px;
            color: #ffffff;
            background: rgba(0, 0, 0, 0.6);
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px); /* Гарне розмиття заднього фону */
            pointer-events: none; /* Кліки миші проходять крізь UI в гру */
            max-width: 300px;
        }

        #ui-container h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
            letter-spacing: 1px;
            color: #4caf50; /* Зелений фірмовий колір */
        }

        #ui-container p {
            margin: 5px 0;
            font-size: 13px;
            color: #cccccc;
            line-height: 1.4;
        }

        .highlight {
            color: #ffffff;
            font-weight: bold;
        }

        /* Приціл по центру екрана */
        #crosshair {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            transform: translate(-50%, -50%);
            color: rgba(255, 255, 255, 0.8);
            font-size: 24px;
            font-weight: 300;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Панель швидких дій знизу (для розробників карт) */
        #creator-panel {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(20, 20, 20, 0.85);
            padding: 12px 24px;
            border-radius: 30px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            gap: 15px;
            align-items: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        #creator-panel span {
            color: #888888;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Кнопки завантаження моделей */
        .btn {
            background: #2e7d32;
            color: white;
            border: none;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 20px;
            transition: all 0.2s ease;
        }

        .btn:hover {
            background: #4caf50;
            transform: scale(1.05);
        }

        .btn:active {
            transform: scale(0.95);
        }
    </style>

    <!-- 1. Підключаємо основне ядро Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    
    <!-- 2. Підключаємо завантажувач GLTF моделей (необхідний для кастомних 3D моделей творців) -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
</head>
<body>

    <!-- Інформаційне табло -->
    <div id="ui-container">
        <h1>YourWorld V2.0</h1>
        <p><span class="highlight">Рух:</span> Клавіші W, A, S, D</p>
        <p><span class="highlight">Камера:</span> Автоматично слідує за тобою</p>
        <p><span class="highlight">Спавн об'єктів:</span> Затисни <span class="highlight">Shift</span> та зроби <span class="highlight">Клік мишкою</span></p>
        <p style="margin-top: 10px; font-size: 11px; color: #888;">Універсальний двіжок: сервер синхронізує будь-які завантажені сутності (Entities).</p>
    </div>

    <!-- Точка прицілу по центру екрана -->
    <div id="crosshair">+</div>

    <!-- Нижня панель інструментів розробника карти -->
    <div id="creator-panel">
        <span>Режим Творця:</span>
        <button class="btn" onclick="alert('Для спавну утримуй Shift і клікай мишкою на сцені!')">Як будувати?</button>
    </div>

    <!-- 3. Підключаємо наші логічні файли двигуна -->
    <script src="engine.js"></script>
    <script src="client.js"></script>
</body>
</html>
