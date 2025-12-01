// Основной файл JavaScript для игры

// DOM элементы
const roleJudgeBtn = document.getElementById('role-judge');
const roleAccusedBtn = document.getElementById('role-accused');
const roleVictimBtn = document.getElementById('role-victim');
const gameMain = document.getElementById('game-main');
const modal = document.getElementById('cards-modal');
const closeModal = document.querySelector('.close-modal');
const modalBody = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');
const caseNumber = document.getElementById('case-number');

// Текущая выбранная роль
let currentRole = null;
let caseNum = 35;

// Текущие карты игроков
let accusedCards = {
    evidence: [],
    traits: []
};

let victimCards = {
    evidence: [],
    traits: []
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Генерируем случайный номер дела
    caseNum = Math.floor(Math.random() * 900) + 100;
    caseNumber.textContent = caseNum;
    
    // Генерируем начальные карты для игроков
    generateAccusedCards();
    generateVictimCards();
    
    // Показываем стартовый экран
    showStartScreen();
    
    // Инициализируем события
    initEvents();
});

// Функция генерации карт для Подсудимого
function generateAccusedCards() {
    accusedCards.evidence = getRandomItems(gameData.evidence, 3);
    accusedCards.traits = getRandomItems(gameData.traits, 3);
}

// Функция генерации карт для Потерпевшего
function generateVictimCards() {
    victimCards.evidence = getRandomItems(gameData.evidence, 3);
    victimCards.traits = getRandomItems(gameData.traits, 3);
}

// Функция показа стартового экрана
function showStartScreen() {
    gameMain.innerHTML = `
        <div class="start-screen">
            <div class="role-instruction">
                <h3><i class="fas fa-info-circle"></i> ИНСТРУКЦИЯ ДЛЯ ВСЕХ УЧАСТНИКОВ</h3>
                <p><strong>Дело №${caseNum} - "ГОВОРИ!"</strong></p>
                <p>Подсудимый обвиняется в абсурдном преступлении. Ваша задача — выиграть судебный процесс!</p>
                
                <h4>Правила игры:</h4>
                <ul>
                    <li><strong>Судья</strong> ведёт процесс, зачитывает обвинение и события</li>
                    <li><strong>Подсудимый</strong> защищается с помощью карт улик и характеристик</li>
                    <li><strong>Потерпевший</strong> обвиняет с помощью карт улик и характеристик</li>
                    <li>3 раунда, после которых Судья выносит вердикт</li>
                    <li>За ход можно использовать только одну карту</li>
                </ul>
                
                <p style="margin-top: 20px; color: #d4af37; font-weight: 500;">
                    Выберите свою роль выше, чтобы начать игру
                </p>
            </div>
        </div>
    `;
}

// Функция показа экрана судьи
function showJudgeScreen() {
    gameMain.innerHTML = `
        <div class="judge-screen">
            <div class="role-instruction">
                <h3><i class="fas fa-gavel"></i> ВЫ - СУДЬЯ</h3>
                <p>Вы ведёте судебный процесс. Ваши полномочия:</p>
                <ul>
                    <li>Зачитать обвинение в начале игры</li>
                    <li>Контролировать ход игры и соблюдение правил</li>
                    <li>Зачитывать события между раундами</li>
                    <li>Вынести окончательный вердикт после 3 раундов</li>
                </ul>
            </div>
            
            <div class="cards-section">
                <h3><i class="fas fa-folder-open"></i> СУДЕБНЫЕ МАТЕРИАЛЫ</h3>
                <div class="card-buttons">
                    <button id="btn-accusation" class="card-btn accusation">
                        <i class="fas fa-file-contract"></i>
                        <span>ОБВИНЕНИЕ</span>
                    </button>
                    <button id="btn-event" class="card-btn event">
                        <i class="fas fa-bolt"></i>
                        <span>СОБЫТИЕ</span>
                    </button>
                </div>
            </div>
            
            <div id="card-display" class="card-display">
                <h3><i class="fas fa-scroll"></i> ДЕЛО №${caseNum}</h3>
                <div class="card-display-content">
                    Нажмите на кнопку "ОБВИНЕНИЕ", чтобы получить случайное обвинение для этого дела.
                </div>
                <div class="card-meta">Ожидание обвинения...</div>
            </div>
        </div>
    `;
    
    // Добавляем обработчики для кнопок судьи
    document.getElementById('btn-accusation')?.addEventListener('click', showAccusationCard);
    document.getElementById('btn-event')?.addEventListener('click', showEventCard);
}

// Функция показа экрана подсудимого
function showAccusedScreen() {
    gameMain.innerHTML = `
        <div class="accused-screen">
            <div class="role-instruction">
                <h3><i class="fas fa-user-shield"></i> ВЫ - ПОДСУДИМЫЙ</h3>
                <p>Вы обвиняетесь в деле №${caseNum}. Защищайтесь!</p>
                <ul>
                    <li>У вас есть 3 улики и 3 характеристики</li>
                    <li>За ход можно использовать одну карту</li>
                    <li>Применяйте карты на себя (защита) или на потерпевшего (дискредитация)</li>
                    <li>Сочиняйте невероятные истории про свои улики</li>
                </ul>
            </div>
            
            <div class="player-cards-display">
                <h3><i class="fas fa-briefcase"></i> ВАШИ КАРТЫ ДЛЯ ЗАЩИТЫ</h3>
                <div id="accused-cards-list" class="cards-list">
                    <!-- Карты будут загружены здесь -->
                </div>
                
                <button id="refresh-accused-cards" class="refresh-btn">
                    <i class="fas fa-redo"></i> ПОЛУЧИТЬ НОВЫЕ 6 КАРТ
                </button>
            </div>
            
            <div id="card-display" class="card-display">
                <h3><i class="fas fa-comment-dots"></i> ВАША ПОЗИЦИЯ</h3>
                <div class="card-display-content">
                    Используйте свои карты для защиты. Помните: вы невиновны до тех пор, пока не доказано обратное!
                </div>
                <div class="card-meta">Готов к защите</div>
            </div>
        </div>
    `;
    
    // Загружаем карты подсудимого
    loadAccusedCards();
    
    // Добавляем обработчик для обновления карт
    document.getElementById('refresh-accused-cards')?.addEventListener('click', refreshAccusedCards);
}

// Функция показа экрана потерпевшего
function showVictimScreen() {
    gameMain.innerHTML = `
        <div class="victim-screen">
            <div class="role-instruction">
                <h3><i class="fas fa-user-injured"></i> ВЫ - ПОТЕРПЕВШИЙ</h3>
                <p>Вы пострадали в деле №${caseNum}. Выдвигайте обвинения!</p>
                <ul>
                    <li>У вас есть 3 улики и 3 характеристики</li>
                    <li>За ход можно использовать одну карту</li>
                    <li>Применяйте карты на себя (усиление позиции) или на подсудимого (обвинение)</li>
                    <li>Давайте абсурдные характеристики участникам дела</li>
                </ul>
            </div>
            
            <div class="player-cards-display">
                <h3><i class="fas fa-folder"></i> ВАШИ КАРТЫ ДЛЯ ОБВИНЕНИЯ</h3>
                <div id="victim-cards-list" class="cards-list">
                    <!-- Карты будут загружены здесь -->
                </div>
                
                <button id="refresh-victim-cards" class="refresh-btn">
                    <i class="fas fa-redo"></i> ПОЛУЧИТЬ НОВЫЕ 6 КАРТ
                </button>
            </div>
            
            <div id="card-display" class="card-display">
                <h3><i class="fas fa-gavel"></i> ВАША ПОЗИЦИЯ</h3>
                <div class="card-display-content">
                    Используйте свои карты для обвинения. Докажите суду, что подсудимый виновен!
                </div>
                <div class="card-meta">Готов к обвинению</div>
            </div>
        </div>
    `;
    
    // Загружаем карты потерпевшего
    loadVictimCards();
    
    // Добавляем обработчик для обновления карт
    document.getElementById('refresh-victim-cards')?.addEventListener('click', refreshVictimCards);
}

// Функция загрузки карт подсудимого
function loadAccusedCards() {
    const cardsList = document.getElementById('accused-cards-list');
    if (!cardsList) return;
    
    cardsList.innerHTML = '';
    
    // Улики
    accusedCards.evidence.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-item evidence';
        cardElement.innerHTML = `
            <span class="card-number">У${index + 1}</span>
            <h4>УЛИКА</h4>
            <p>${card}</p>
        `;
        cardsList.appendChild(cardElement);
    });
    
    // Характеристики
    accusedCards.traits.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-item trait';
        cardElement.innerHTML = `
            <span class="card-number">Х${index + 1}</span>
            <h4>ХАРАКТЕРИСТИКА</h4>
            <p>${card}</p>
        `;
        cardsList.appendChild(cardElement);
    });
}

// Функция загрузки карт потерпевшего
function loadVictimCards() {
    const cardsList = document.getElementById('victim-cards-list');
    if (!cardsList) return;
    
    cardsList.innerHTML = '';
    
    // Улики
    victimCards.evidence.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-item evidence';
        cardElement.innerHTML = `
            <span class="card-number">У${index + 1}</span>
            <h4>УЛИКА</h4>
            <p>${card}</p>
        `;
        cardsList.appendChild(cardElement);
    });
    
    // Характеристики
    victimCards.traits.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-item trait';
        cardElement.innerHTML = `
            <span class="card-number">Х${index + 1}</span>
            <h4>ХАРАКТЕРИСТИКА</h4>
            <p>${card}</p>
        `;
        cardsList.appendChild(cardElement);
    });
}

// Функция обновления карт подсудимого
function refreshAccusedCards() {
    generateAccusedCards();
    loadAccusedCards();
    
    // Показываем сообщение об обновлении
    const cardDisplay = document.getElementById('card-display');
    if (cardDisplay) {
        cardDisplay.innerHTML = `
            <h3><i class="fas fa-sync-alt"></i> КАРТЫ ОБНОВЛЕНЫ</h3>
            <div class="card-display-content">
                Подсудимый получил 6 новых карт (3 улики и 3 характеристики). Карты готовы для использования в защите.
            </div>
            <div class="card-meta">${getCurrentTime()}</div>
        `;
    }
}

// Функция обновления карт потерпевшего
function refreshVictimCards() {
    generateVictimCards();
    loadVictimCards();
    
    // Показываем сообщение об обновлении
    const cardDisplay = document.getElementById('card-display');
    if (cardDisplay) {
        cardDisplay.innerHTML = `
            <h3><i class="fas fa-sync-alt"></i> КАРТЫ ОБНОВЛЕНЫ</h3>
            <div class="card-display-content">
                Потерпевший получил 6 новых карт (3 улики и 3 характеристики). Карты готовы для использования в обвинении.
            </div>
            <div class="card-meta">${getCurrentTime()}</div>
        `;
    }
}

// Функция показа карты обвинения
function showAccusationCard() {
    const randomAccusation = getRandomItem(gameData.accusations);
    const cardDisplay = document.getElementById('card-display');
    
    if (cardDisplay) {
        cardDisplay.innerHTML = `
            <h3><i class="fas fa-gavel"></i> ОФИЦИАЛЬНОЕ ОБВИНЕНИЕ</h3>
            <div class="card-display-content">
                ${randomAccusation}
            </div>
            <div class="card-meta">${getCurrentTime()} • Дело №${caseNum}</div>
        `;
    }
}

// Функция показа карты события
function showEventCard() {
    const randomEvent = getRandomItem(gameData.events);
    const cardDisplay = document.getElementById('card-display');
    
    if (cardDisplay) {
        cardDisplay.innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> СУДЕБНОЕ СОБЫТИЕ</h3>
            <div class="card-display-content">
                ${randomEvent}
            </div>
            <div class="card-meta">${getCurrentTime()} • Между раундами</div>
        `;
    }
}

// Функция получения текущего времени
function getCurrentTime() {
    const now = new Date();
    return `Суд зарегистрировал в ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// Функция получения случайного элемента из массива
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Функция получения нескольких случайных уникальных элементов
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Функция инициализации событий
function initEvents() {
    // Обработчики для кнопок ролей
    roleJudgeBtn.addEventListener('click', function() {
        setActiveRole('judge');
        showJudgeScreen();
    });
    
    roleAccusedBtn.addEventListener('click', function() {
        setActiveRole('accused');
        showAccusedScreen();
    });
    
    roleVictimBtn.addEventListener('click', function() {
        setActiveRole('victim');
        showVictimScreen();
    });
    
    // Закрытие модального окна
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // Закрытие модального окна по клавише ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
}

// Функция установки активной роли
function setActiveRole(role) {
    // Убираем активный класс со всех кнопок
    roleJudgeBtn.classList.remove('active');
    roleAccusedBtn.classList.remove('active');
    roleVictimBtn.classList.remove('active');
    
    // Устанавливаем активный класс выбранной кнопке
    if (role === 'judge') {
        roleJudgeBtn.classList.add('active');
    } else if (role === 'accused') {
        roleAccusedBtn.classList.add('active');
    } else if (role === 'victim') {
        roleVictimBtn.classList.add('active');
    }
    
    currentRole = role;
}

// Добавляем вибрацию для мобильных устройств (если поддерживается)
function vibrate(ms) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
}

// Добавляем обработчики для тактильной обратной связи
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('touchstart', function() {
        vibrate(10);
    });
});