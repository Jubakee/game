function displayEquippedItems() {
    const equipmentContainer = document.getElementById('equipment-container');
    const totalProfitElement = document.getElementById('total-profit');
    equipmentContainer.innerHTML = ''; // Clear previous items

    const equippedItems = playerData.playerEquipped;

    // Define all possible slots
    const allSlots = ['Head', 'Top', 'Hands', 'Bottom', 'Feet'];
    let totalProfit = 0; // Initialize total profit

    allSlots.forEach((slot, index) => { // Use index for the equipped item
        const item = equippedItems[slot];
        const itemElement = document.createElement('div');
        itemElement.className = 'equipped-item';
        itemElement.setAttribute('data-slot', slot); // Set slot as a data attribute
        
        if (item) {
            // If an item is equipped in this slot, display it
            const rarityClass = item.rarity; // Use uppercase rarity
            itemElement.classList.add(rarityClass); // Add rarity class
        
            // Clear any previous stars and create a new stars container
            const starsContainer = document.createElement('div');
            starsContainer.className = 'item-stars'; // Use the class you created for stars
        
            // Generate stars based on item level
            const maxStars = 5;
            const itemLevel = Math.min(item.level, maxStars);
            
            for (let i = 0; i < itemLevel; i++) {
                const star = document.createElement('img');
                star.classList.add('star'); // Update to the new class name
                star.src = 'assets/item_star.png';
                starsContainer.appendChild(star);
            }
        
            itemElement.innerHTML = `
                <div class="item-name">
                    ${starsContainer.outerHTML} <!-- Insert stars container here -->
                    <h3>${item.name}</h3>
                </div>
                <img class="equipped-item-img" src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <p>${item.description}</p>
                    <div class="income-container">
                        <img id="confirm-icon" src="assets/currency.png" alt="Confirm Icon" />
                        <p class="income-text">+${item.income}</p>
                    </div>
                </div>
            `;
        
            // Update rarity color for the item name
            const itemNameElement = itemElement.querySelector('.item-name h3');
            itemNameElement.style.color = getRarityColor(item.rarity); // Function to get the color based on rarity
        
            // Add income to total profit
            totalProfit += item.income;
            let _index = -1; // Initialize _index to -1 (or any default value indicating not found)
            const inventoryLength = playerData.inventory.length; // Get the length of the inventory
            
            for (let index = 0; index < inventoryLength; index++) {
                const _item = playerData.inventory[index]; // Get the item at the current index
                
                if (_item) {
                    if (_item['id'] === item['id']) {
                        console.log(_item['id']);
                        console.log(_item);
                        _index = index; // Set _index to the current index when a match is found
                        break; // Exit the loop since we found the item
                    }
                } else {
                    console.error('Item is undefined or null');
                }
            }
            
            // After the loop, check if an index was found
            if (_index !== -1) {
                console.log(`Item found at index: ${_index}`);
            } else {
                console.log('Item not found in inventory');
            }
            

            // Add click event to show the item modal
            itemElement.addEventListener('click', () => {
                showItemModal(item, _index); // Pass the item and its index
      
            });
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
