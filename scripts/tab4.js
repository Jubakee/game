function displayInventory() {
    const inventoryContainer = document.getElementById('inventory-container');
    const modal = document.getElementById('inventory-item-modal');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalItemRarity = document.getElementById('modal-item-rarity');
    const modalItemLevel = document.getElementById('modal-item-level');
    const modalItemPrice = document.getElementById('modal-item-price');
    const chestOpenButton = document.getElementById('chest-open-button');

    if (!inventoryContainer) {
        console.error('Inventory container not found');
        return;
    }

    // Clear previous items
    inventoryContainer.innerHTML = '';

    // Render all slots in the inventory
    playerData.inventory.forEach((item, index) => {
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
                modalItemLevel.textContent = item.level;
                // modalItemPrice.textContent = item.price;

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

    // Add click event to the chest open button
    chestOpenButton.addEventListener('click', () => {
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
                case 'UNIQUE':
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
            modal.style.display = 'none';

            // Refresh the inventory display
            displayInventory();

            // Log the new inventory state
            console.log('Updated inventory:', playerData.inventory.filter(item => item !== null));
        }
    });
}

// Call the function to display items when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', displayInventory);
