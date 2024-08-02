window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();
window.Telegram.WebApp.disableVerticalSwipes();

const playerData = {
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
    inventory: Array(20).fill(null), // 20 slots initialized to null
    playerEquipped: {
        head: null,
        top: null,
        bottom: null,
        hand: null,
        feet: null
    },
    playerMaterials: Array(6).fill(null) // 6 slots initialized to null
};


function initializePlayerData() {
        playerData.playerId = null;
        playerData.playerBalance = 0;
        playerData.playerPerClick = 1;
        playerData.playerIncome = 1;
        playerData.playerEnergy = 1000;
        playerData.playerLastSaved = Date.now();
        playerData.playerLevel = 1;
        playerData.playerLvlEXP = 0;
        playerData.lastEnergyUpdate = Date.now();
        playerData.playerLastLvlUpdate = Date.now(),
        playerData.inventory = Array(20).fill(null); // Initialize inventory
        playerData.playerEquipped = {
            head: null,
            top: null,
            bottom: null,
            hand: null,
            feet: null
        };
        playerData.playerMaterials = Array(6).fill(null); 
}

function getUserInfo() {
    const initData = window.Telegram.WebApp.initDataUnsafe;
    if (initData && initData.user) {
        const { firstName, lastName } = initData.user;
        return { firstName, lastName };
    } else {
        console.warn('Information is not available.');
        return { firstName: 'Unknown', lastName: 'Unknown' };
    }
}

function setUserInfo() {
    const userInfo = getUserInfo();
    const fullNameContainer = document.getElementById('full-name-container');
    if (fullNameContainer) {
        fullNameContainer.innerText = `${userInfo.firstName} ${userInfo.lastName}`;
    }
}

function savePlayerData() {
    playerData.playerLastSaved = Date.now();
    localStorage.setItem('playerData', JSON.stringify(playerData));
}

function loadPlayerData() {
    const savedData = localStorage.getItem('playerData'); // Get saved data
    console.log('Loaded Player Data:', savedData); // Debugging output
    


}

// Initial setup
setUserInfo();
loadPlayerData();
