// Constants
const INITIAL_PLAYER_DATA = {
    playerId: null,
    playerBalance: 0,
    playerPerClick: 1,
    playerIncome: 1,
    playerEnergy: 1000,
    playerLastSaved: null,
    playerLevel: 1,
    playerLvlEXP: 0,
    lastEnergyUpdate: Date.now(),
    playerLastLvlUpdate: Date.now(),
    inventory: Array(20).fill(null),
    playerEquipped: { head: null, top: null, bottom: null, hand: null, feet: null },
    playerMaterials: Array(6).fill(null)
};

const LEVEL_SCALING_FACTORS = {
    a: 20, // Increased scaling factor
    b: 2,  // Increased growth rate
    c: 10   // Minimum requirement
};

// Initialize the Telegram WebApp
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();
window.Telegram.WebApp.disableVerticalSwipes();

// Player data object with default values
const playerData = { ...INITIAL_PLAYER_DATA };

// Initialize player data to default values
function initializePlayerData() {
    Object.assign(playerData, { ...INITIAL_PLAYER_DATA, playerLastSaved: Date.now() });
}

// Reset the game by clearing saved data and reloading
function resetGame() {
    localStorage.removeItem('playerData');
    location.reload();
}

// Retrieve user information from Telegram
function getUserInfo() {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    return {
        firstName: user?.firstName || 'Unknown',
        lastName: user?.lastName || 'Unknown'
    };
}

// Set user information in the UI
function setUserInfo() {
    const { firstName, lastName } = getUserInfo();
    const fullNameContainer = document.getElementById('full-name-container');
    if (fullNameContainer) {
        fullNameContainer.innerText = `${firstName} ${lastName}`;
    }
}

// Save player data to local storage
function savePlayerData() {
    playerData.playerLastSaved = Date.now();
    localStorage.setItem('playerData', JSON.stringify(playerData));
}

// Load player data from local storage or initialize it if not found
function loadPlayerData() {
    const savedData = localStorage.getItem('playerData');
    savedData ? Object.assign(playerData, JSON.parse(savedData)) : initializePlayerData();

    const lastUpdateTime = playerData.playerLastSaved; // Use the last saved time directly
    const now = Date.now();
    const elapsedTime = now - lastUpdateTime;
    const elapsedTimeInSeconds = Math.floor(elapsedTime / 1000); // Convert to seconds
    const earnedCoins = playerData.playerIncome * elapsedTimeInSeconds;

    showAccumulatedCoinsPopup(earnedCoins)

}

// Update the game UI with current player data
function updateGameUI() {
    document.getElementById('coins').textContent = playerData.playerBalance.toLocaleString();
    document.getElementById('level-value').textContent = `LVL ${playerData.playerLevel}`;
    updateLevelBar();
}

// Update the player's balance and experience
function updateBalance() {
    playerData.playerBalance += playerData.playerIncome;
    playerData.playerLvlEXP += playerData.playerIncome;
    levelUp();
    savePlayerData();
    updateGameUI();
}

// Function to update the level bar
function updateLevelBar() {
    const levelExperienceFill = document.getElementById('level-exp-fill');
    const maxCoinsForNextLevel = calculateMaxCoinsForNextLevel(playerData.playerLevel);
    const widthPercentage = Math.min((playerData.playerLvlEXP / maxCoinsForNextLevel) * 100, 100);
    levelExperienceFill.style.width = `${widthPercentage}%`;
}

// Level up the player based on experience
function levelUp() {
    let maxCoinsForNextLevel = calculateMaxCoinsForNextLevel(playerData.playerLevel);
    while (playerData.playerLvlEXP >= maxCoinsForNextLevel) {
        playerData.playerLevel++;
        playerData.playerLvlEXP -= maxCoinsForNextLevel;
        playerData.playerIncome++;
        maxCoinsForNextLevel = calculateMaxCoinsForNextLevel(playerData.playerLevel);
        updateGameUI();
        savePlayerData();
    }
}

// Calculate the required experience for the next level
function calculateMaxCoinsForNextLevel(level) {
    const { a, b, c } = LEVEL_SCALING_FACTORS;
    return Math.floor(a * Math.pow(level, b)) + c;
}

// Function to display a modal with accumulated coins
function showAccumulatedCoinsPopup(earnedCoins) {
    const modal = document.getElementById('accumulated-coins-modal');
    const messageContainer = document.getElementById('accumulated-coins-message');
    
    // Clear previous content
    messageContainer.innerHTML = '';

    // Create the image element
    const coinImage = document.createElement('img');
    coinImage.src = 'assets/currency.png'; // Replace with the actual path to your coin image
    coinImage.alt = 'Coin Icon';
    coinImage.style.width = '32px'; // Set width
    coinImage.style.height = '32px'; // Set height
    coinImage.style.verticalAlign = 'middle'; // Align vertically with text
    coinImage.style.display = 'inline-flex';
    coinImage.style.alignItems = 'center';
    
    // Create a text node for the message
    const messageText = document.createTextNode(`YOU EARNED `);
    
    // Create a span for the message text to apply styles
    const messageSpan = document.createElement('span');
    messageSpan.style.fontWeight = 'normal'; // Set font weight to normal
    messageSpan.style.fontSize = '14px';
    messageSpan.appendChild(messageText);
    
    // Append the image and text to the message container
    messageContainer.appendChild(messageSpan);
    messageContainer.appendChild(coinImage);
    messageContainer.appendChild(document.createTextNode(`${earnedCoins.toLocaleString()} WHILE YOU WERE AWAY!`));
    messageContainer.style.fontWeight = 'normal';
    messageContainer.style.fontSize = '14px'
    messageContainer.style.padding = '10px'
    // Show the modal
    modal.style.display = 'block';

    // Remove the modal after 20 seconds
    setTimeout(() => {
        modal.style.display = 'none';
    }, 2000);
}


// Initialization
// resetGame(); // Uncomment to reset the game
setUserInfo();
loadPlayerData();
setInterval(updateBalance, 1000);
updateGameUI();
