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

        if (item && item.img) {
            const itemImg = document.createElement('img');
            itemImg.src = item.img;
            itemImg.alt = item.name;

            itemDiv.appendChild(itemImg);

            // Add click event listener to show modal with item details
            itemDiv.addEventListener('click', () => {
                modalItemName.textContent = item.name;
                modalItemImage.src = item.img;
                modalItemDescription.textContent = item.description;
                modalItemRarity.textContent = item.rarity;
                modalItemLevel.textContent = item.level;
                modalItemPrice.textContent = item.price;

                modal.style.display = 'flex'; // Show the modal
                modalItemImage.setAttribute('data-slot', index); // Store the index of the item to be removed
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
        if (slotIndex >= 0 && slotIndex < playerData.inventory.length) {
            const deletedItem = playerData.inventory[slotIndex];
            console.log('Deleting item at index:', slotIndex, 'Item details:', deletedItem);
            
            // Remove the item from the inventory
            playerData.inventory[slotIndex] = null; // Set the slot to null

            // Hide the modal
            modal.style.display = 'none';

            // Refresh the inventory display
            displayInventory();

            // Log remaining items in the inventory
            console.log('Remaining items in inventory:', playerData.inventory.filter(item => item !== null));
        }
    });
}


// Call the function to display items when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', displayInventory);
