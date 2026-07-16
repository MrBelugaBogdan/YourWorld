// yourworld/server/config.js

const CONFIG = {
    // Порт для сервера. Хмари (Render/Railway) автоматично дають його через process.env.PORT
    PORT: process.env.PORT || 3000, 
    
    // IP або домен сервера. Локально це localhost, а для безкоштовного сервера буде адреса від Render/Railway
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000',

    // Безпека: ліміти для гравців
    LIMITS: {
        MAX_SPEED: 15,          // Максимальна швидкість гравця (все, що швидше — читерство)
        MAX_BUILD_DISTANCE: 10, // Як далеко від себе гравець може поставити блок
        TICK_RATE: 20           // Скільки разів на секунду сервер оновлює фізику (в мілісекундах: ~50ms)
    }
};

module.exports = CONFIG;
