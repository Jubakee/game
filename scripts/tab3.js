function displayEquippedItems() {
    const equipmentContainer = document.getElementById('equipment-container');
    const totalProfitElement = document.getElementById('total-profit');
    equipmentContainer.innerHTML = ''; // Clear previous items

    const equippedItems = playerData.playerEquipped;

    // Define all possible slots
    const allSlots = ['Head', 'Top', 'Hands', 'Bottom', 'Feet'];
    let totalProfit = 0; // Initialize total profit

    allSlots.forEach(slot => {
        const item = equippedItems[slot];
        const itemElement = document.createElement('div');
        itemElement.className = 'equipped-item';
        itemElement.setAttribute('data-slot', slot); // Set slot as a data attribute

        if (item) {
            // If an item is equipped in this slot, display it
            const rarityClass = item.rarity; // Use uppercase rarity
            itemElement.classList.add(rarityClass); // Add rarity class

            itemElement.innerHTML = `
                <div class="item-name">
                    <h3>${item.name}</h3>
                </div>
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <p>${item.description}</p>
                    <div class="income-container">
                        <img id="confirm-icon" src="assets/currency.png" alt="Confirm Icon" />
                        <p class="income-text">+${item.income}</p>
                    </div>
                </div>
            `;

            // Add income to total profit
            totalProfit += item.income;
        } else {
            // If no item is equipped, display a placeholder
            itemElement.innerHTML = `
                <div class="empty-slot-placeholder">
                    <p>Empty ${slot}</p>
                </div>
            `;
        }

        equipmentContainer.appendChild(itemElement);
    });

    // Update total profit in the stats container
    totalProfitElement.textContent = '+' + totalProfit;
}

displayEquippedItems();
