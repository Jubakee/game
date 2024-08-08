let currentFilter = 'All'; // Default filter

function filterInventoryItems(filter, button) {
    currentFilter = filter;

    // Remove active class from all filter buttons
    document.querySelectorAll('.inventory-filter-button').forEach(btn => btn.classList.remove('active'));

    // Add active class to the clicked button
    button.classList.add('active');

    // Refresh the inventory display with the new filter
    displayInventory();
}

function displayInventory() {
    const inventoryContainer = document.getElementById('inventory-container');
    const modal = document.getElementById('inventory-item-modal');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalItemRarity = document.getElementById('modal-item-rarity');
    const modalItemLevelContainer = document.getElementById('modal-item-level-container');
    const modalItemStars = document.getElementById('modal-item-stars');
    const chestOpenButton = document.getElementById('chest-open-button');
    const equipButton = document.getElementById('equip-button');

    if (!inventoryContainer) {
        console.error('Inventory container not found');
        return;
    }

    // Clear previous items
    inventoryContainer.innerHTML = '';

    // Filter inventory items based on the current filter
    const filteredItems = playerData.inventory.filter(item => {
        if (currentFilter === 'All') return true;
        if (currentFilter === 'Chest' && item && item.type === 'Chest') return true;
        if (currentFilter === 'Equipment' && item && item.type === 'Equipment') return true;
        return false;
    });

    // Render all slots in the inventory
    filteredItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.setAttribute('data-slot', index); // Add data-slot attribute for slot index

        if (item && item.image) {
            const itemImg = document.createElement('img');
            itemImg.src = item.image;
            itemImg.alt = item.name;

            itemDiv.appendChild(itemImg);

            // Add click event listener to show modal with item details
            itemDiv.addEventListener('click', () => {
                modalItemName.textContent = item.name;
                modalItemImage.src = item.image;
                modalItemDescription.textContent = item.description;
                modalItemRarity.textContent = item.rarity;
                modalItemRarity.style.color = getRarityColor(item.rarity);
                
                // Set the item income
                const modalItemIncome = document.getElementById('modal-item-income');
                const incomeIcon = document.createElement('img');
                incomeIcon.src = 'assets/currency.png'; // Path to your income icon
                incomeIcon.className = 'price-icon'; // Optional: add a class for styling
                
                // Clear previous income content
                modalItemIncome.innerHTML = ''; // Clear previous content
                
                // Append the icon and the income text
                modalItemIncome.appendChild(incomeIcon); // Add the icon
                modalItemIncome.appendChild(document.createTextNode(item.income)); // Add the income text
                
            
                // Show/Hide rows based on item type
         
            
                // Generate stars based on item level
                const modalItemStars = document.getElementById('modal-item-stars');
modalItemStars.innerHTML = ''; // Clear previous stars
const maxStars = 5;
const itemLevel = Math.min(item.level, maxStars);

for (let i = 0; i < maxStars; i++) {
    const star = document.createElement('img');
    star.classList.add('star');
    star.src = 'assets/currency.png'; // Set the path to your star icon

    // Optionally, you can set a different image for empty stars if needed
    if (i >= itemLevel) {
        star.src = 'assets/currency.png'; // Set a different image for empty stars
    }

    modalItemStars.appendChild(star);
}
            
                modal.style.display = 'flex'; // Show the modal
                modalItemImage.setAttribute('data-slot', index); // Store the index of the item to be removed
                modalItemImage.setAttribute('data-rarity', item.rarity); // Store the rarity of the chest
            });
            
             
            

        } else {
            // Show a placeholder for empty slots
            itemDiv.classList.add('empty-slot');
            // itemDiv.textContent = 'Empty Slot'; // Optional: display a text for empty slots
        }

        inventoryContainer.appendChild(itemDiv);
    });

    // Add event listener to close the modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    });
}


function setupModalButtons() {
    const chestOpenButton = document.getElementById('chest-open-button');
    const equipButton = document.getElementById('equip-button');

    // Add click event to the chest open button
    chestOpenButton.addEventListener('click', () => {
        const modalItemImage = document.getElementById('modal-item-image');
        const slotIndex = parseInt(modalItemImage.getAttribute('data-slot'));
        const chestRarity = modalItemImage.getAttribute('data-rarity');
        if (slotIndex >= 0 && slotIndex < playerData.inventory.length) {
            const deletedItem = playerData.inventory[slotIndex];
            console.log('Deleting item at index:', slotIndex, 'Item details:', deletedItem);

            // Remove the item from the inventory
            playerData.inventory[slotIndex] = null; // Set the slot to null

            // Generate a new item based on the chest's rarity
            let selectedPool;
            switch (chestRarity) {
                case 'COMMON':
                    selectedPool = commonItemPool;
                    break;
                case 'UNCOMMON':
                    selectedPool = uncommonItemPool;
                    break;
                case 'RARE':
                    selectedPool = rareItemPool;
                    break;
                case 'EPIC':
                    selectedPool = epicItemPool;
                    break;
                default:
                    selectedPool = commonItemPool; // Default pool in case of an error
            }

            const newItem = selectedPool[Math.floor(Math.random() * selectedPool.length)]();

            // Find the first empty slot
            const emptySlotIndex = playerData.inventory.findIndex(item => item === null);
            if (emptySlotIndex !== -1) {
                // Add the new item to the first empty slot
                playerData.inventory[emptySlotIndex] = newItem;
                console.log('Added new item to slot:', emptySlotIndex, 'Item details:', newItem);
            } else {
                // If no empty slot is found, add the new item to the end of the inventory
                playerData.inventory.push(newItem);
                console.log('Added new item to the end of the inventory:', newItem);
            }

            // Hide the modal
            document.getElementById('inventory-item-modal').style.display = 'none';

            // Refresh the inventory display
            displayInventory();

            // Log the new inventory state
            console.log('Updated inventory:', playerData.inventory.filter(item => item !== null));
        }
    });

    // Add click event to the equip button
    equipButton.addEventListener('click', () => {
        const modalItemImage = document.getElementById('modal-item-image');
        const slotIndex = parseInt(modalItemImage.getAttribute('data-slot'));
        if (slotIndex >= 0 && slotIndex < playerData.inventory.length) {
            const itemToEquip = playerData.inventory[slotIndex];
            console.log('Equipping item at index:', slotIndex, 'Item details:', itemToEquip);

            // Implement your logic for equipping the item here
            // Example: playerData.equipment.head = itemToEquip;

            // Hide the modal
            document.getElementById('inventory-item-modal').style.display = 'none';

            // Log the action
            console.log('Item equipped:', itemToEquip);
        }
    });
}

function openAllChests() {
    playerData.inventory.forEach((item, index) => {
        if (item && item.type === 'Chest') {
            console.log('Opening chest at index:', index, 'Item details:', item);

            // Determine the correct item pool based on the chest's rarity
            let selectedPool;
            switch (item.rarity) {
                case 'COMMON':
                    selectedPool = commonItemPool;
                    break;
                case 'UNCOMMON':
                    selectedPool = uncommonItemPool;
                    break;
                case 'RARE':
                    selectedPool = rareItemPool;
                    break;
                case 'EPIC':
                    selectedPool = epicItemPool;
                    break;
                default:
                    console.warn('Unknown rarity:', item.rarity);
                    selectedPool = commonItemPool; // Default pool in case of an error
            }

            // Generate a new item based on the chest's rarity
            const newItem = selectedPool[Math.floor(Math.random() * selectedPool.length)]();

            // Replace the chest with the new item in the same index
            playerData.inventory[index] = newItem;
            console.log('Replaced chest with new item:', newItem);
        }
    });

    // Refresh the inventory display
    displayInventory();
}



// Call the function to display items when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupModalButtons();
    displayInventory();
});
