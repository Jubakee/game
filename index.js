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
    const savedData = localStorage.getItem('myData');
    savedData ? Object.assign(playerData, JSON.parse(savedData)) : initializePlayerData();
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

// Initialization
//resetGame();
setUserInfo();
loadPlayerData();
setInterval(updateBalance, 1000);
updateGameUI();
