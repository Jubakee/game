document.addEventListener('DOMContentLoaded', () => {
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', resetGame);
});

function resetGame() {
    // Clear saved data from local storage
    localStorage.removeItem('playerData');
    location.reload();
}