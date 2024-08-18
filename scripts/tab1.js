const items = [
    {
        id: 1,
        imageUrl: 'assets/dungeon_1.jpg',
        title: 'Item 1',
        description: 'Description for item 1.',
        cost: 100,
        timerDuration: 6, // Duration in seconds
        timerState: 'ready',
        timerInterval: null,
        startTime: null,
        endTime: null
    },
    {
        id: 2,
        imageUrl: 'assets/dungeon_2.jpg',
        title: 'Item 2',
        description: 'Description for item 2.',
        cost: 200,
        timerDuration: 900, // Duration in seconds
        timerState: 'ready',
        timerInterval: null,
        startTime: null,
        endTime: null
    },
    // Add more items as needed
];

function saveTimerData() {
    localStorage.setItem('itemTimers2', JSON.stringify(items));
}

function loadTimerData() {
    const savedData = localStorage.getItem('itemTimers2');
    if (savedData) {
        const savedItems = JSON.parse(savedData);
        savedItems.forEach((savedItem, index) => {
            const item = items.find(i => i.id === savedItem.id);
            if (item) {
                item.timerState = savedItem.timerState;
                item.startTime = savedItem.startTime;
                item.endTime = savedItem.endTime;
            }
        });
    }
}

function updateCircularProgress(circle, percentage, circumference) {
    const offset = circumference * (1 - percentage); // Calculate the stroke offset
    circle.style.strokeDashoffset = offset;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function startTimer(item, display, icon, button) {
    if (item.timerState === 'inProgress') return; // Prevent multiple timers for the same item

    const startTime = Date.now();
    const endTime = startTime + (item.timerDuration * 1000);

    // Save the timer data in local storage
    item.startTime = startTime;
    item.endTime = endTime;
    item.timerState = 'inProgress';
    saveTimerData();

    const radius = 45; // Radius of the circle
    const circumference = 2 * Math.PI * radius;

    const circleProgress = icon.querySelector('.circle-progress');
    circleProgress.style.strokeDasharray = circumference;
    circleProgress.style.strokeDashoffset = circumference;

    updateCircularProgress(circleProgress, 1, circumference);

    button.disabled = true;
    button.textContent = "In Progress";

    const updateTimer = () => {
        const now = Date.now();
        const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));

        display.textContent = formatTime(remainingTime);

        const percentage = (remainingTime / item.timerDuration);
        updateCircularProgress(circleProgress, percentage, circumference);

        if (remainingTime <= 0) {
            clearInterval(item.timerInterval);
            display.textContent = 'Completed';
            updateCircularProgress(circleProgress, 0, circumference);

            button.textContent = "Check Rewards";
            button.disabled = false;
            item.timerState = 'completed';
            item.startTime = null;
            item.endTime = null;
            saveTimerData();
        }
    };

    updateTimer(); // Run immediately
    item.timerInterval = setInterval(updateTimer, 1000);
}

function resetTimer(item, display, button) {
    display.textContent = 'Ready';
    button.textContent = 'Enter Dungeon';
    button.disabled = false;
    clearInterval(item.timerInterval); // Ensure any existing interval is cleared

    item.timerState = 'ready'; 
    item.startTime = null; // Reset start time
    item.endTime = null; // Reset end time
    saveTimerData(); // Save the reset state
}

function createItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';
    itemElement.style.backgroundImage = `url('${item.imageUrl}')`;

    itemElement.innerHTML = `
        <div class="item-details">
            <h3 class="item-title">${item.title}</h3>
            <p class="item-description">${item.description}</p>
            <div class="item-timer">
                <div class="circular-timer">
                    <svg class="circular-icon" viewBox="0 0 100 100">
                        <circle class="circle-bg" cx="50" cy="50" r="45" stroke="#ccc" stroke-width="10" fill="none"></circle>
                        <circle class="circle-progress" cx="50" cy="50" r="45" stroke="#ff4500" stroke-width="10" fill="none"></circle>
                    </svg>
                    <span class="timer-text">${item.timerState === 'completed' ? 'Completed' : 'Ready'}</span>
                </div>
                <button class="start-timer-btn">${item.timerState === 'completed' ? 'Check Rewards' : 'Enter Dungeon'}</button>
            </div>
        </div>
    `;

    const startButton = itemElement.querySelector('.start-timer-btn');
    const timerText = itemElement.querySelector('.timer-text');
    const circularIcon = itemElement.querySelector('.circular-icon');

    if (item.timerState === 'inProgress' && item.endTime) {
        const remainingTime = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
        if (remainingTime > 0) {
            startTimer(item, timerText, circularIcon, startButton);
        } else {
            timerText.textContent = 'Completed';
            startButton.textContent = 'Check Rewards';
            startButton.disabled = false;
            item.timerState = 'completed';
            item.startTime = null;
            item.endTime = null;
        }
    }

    startButton.addEventListener('click', () => {
        if (item.timerState === 'ready') {
            startTimer(item, timerText, circularIcon, startButton);
        } else if (item.timerState === 'completed') {
            console.log('Rewards');
            resetTimer(item, timerText, startButton);
            const circleProgress = circularIcon.querySelector('.circle-progress');
            const circumference = 2 * Math.PI * 45;
            updateCircularProgress(circleProgress, 1, circumference);
        }
    });

    return itemElement;
}

window.onload = function () {
    loadTimerData(); // Load the timer data on page load
    const itemList = document.getElementById('item-list');
    items.forEach((item) => {
        const itemElement = createItemElement(item);
        itemList.appendChild(itemElement);
    });
};
