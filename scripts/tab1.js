let timerInterval; // Global variable to hold the timer interval
let timerState = 'ready'; // Global variable to track the timer state

const items = [
    {
        imageUrl: 'assets/dungeon_1.jpg',
        title: 'Item 1',
        description: 'Description for item 1.',
        cost: 100,
        timerDuration: 6 // Duration in seconds (e.g., 10 minutes)
    },
    {
        imageUrl: 'assets/dungeon_2.jpg',
        title: 'Item 2',
        description: 'Description for item 2.',
        cost: 200,
        timerDuration: 900 // Duration in seconds (e.g., 15 minutes)
    },
    // Add more items as needed
];


function startTimer(duration, display, icon, button) {
    if (timerState === 'inProgress') return; // Prevent multiple timers

    let timer = duration;
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);

    const radius = 45; // Radius of the circle
    const circumference = 2 * Math.PI * radius;

    // Set the initial stroke dash array to the full circumference
    const circleProgress = icon.querySelector('.circle-progress');
    circleProgress.style.strokeDasharray = circumference;
    circleProgress.style.strokeDashoffset = circumference;

    // Update button and display for timer start
    updateCircularProgress(circleProgress, 1, circumference);

    button.disabled = true;
    button.textContent = "In Progress";
    display.textContent = formatTime(duration);

    timerState = 'inProgress'; // Set state to inProgress

    timerInterval = setInterval(() => {
        const now = Date.now();
        timer = Math.max(0, Math.floor((endTime - now) / 1000));

        // Update the display text
        display.textContent = formatTime(timer);

        // Calculate the percentage of time remaining
        const percentage = (timer / duration);

        // Update the circular progress
        updateCircularProgress(circleProgress, percentage, circumference);

        if (timer <= 0) {
            clearInterval(timerInterval);
            display.textContent = 'Completed';
            console.log('Finish');
            updateCircularProgress(circleProgress, 0, circumference); // Ensure it completes the progress

            // Change the button text to "Check" and enable it
            button.textContent = "Check Rewards";
            button.disabled = false;
            timerState = 'completed'; // Set state to completed
        }
    }, 1000);
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

function resetTimer(display, button) {
    // Reset the display and button states to "Ready"
    display.textContent = 'Ready';
    button.textContent = 'Enter Dungeon';
    button.disabled = false;
    timerState = 'ready'; // Reset timer state
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
                    <span class="timer-text">Ready</span>
                </div>
                <button class="start-timer-btn">Enter Dungeon</button>
            </div>
        </div>
    `;

    const startButton = itemElement.querySelector('.start-timer-btn');
    const timerText = itemElement.querySelector('.timer-text');
    const circularIcon = itemElement.querySelector('.circular-icon');

    // Start button click event
    startButton.addEventListener('click', () => {
        if (timerState === 'ready') {
            startTimer(item.timerDuration, timerText, circularIcon, startButton);
        } else if (timerState === 'completed') {
            console.log('Rewards');
            // Reset the timer and button states but do not start the timer again
            resetTimer(timerText, startButton);
            const circleProgress = circularIcon.querySelector('.circle-progress');
            const circumference = 2 * Math.PI * 45; // Radius of the circle
            updateCircularProgress(circleProgress, 1, circumference); // Set to full circle initially
        }
    });

    return itemElement;
}

// Append all items to the list
window.onload = function () {
    const itemList = document.getElementById('item-list');
    items.forEach(item => {
        const itemElement = createItemElement(item);
        itemList.appendChild(itemElement);
    });
};
