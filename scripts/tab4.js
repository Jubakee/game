let currentFilter = 'All'; // Default filter
const modal = document.getElementById('inventory-item-modal');

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

            // Add click event listener to handle item interactions
            itemDiv.addEventListener('click', () => {
                if (item.type === 'Chest') {
                    openChest(index); // Call function to open chest
                } else {
                    showItemModal(item, index); // Show modal for Equipment items and pass index
                }
            });
        } else {
            // Show a placeholder for empty slots
            itemDiv.classList.add('empty-slot');
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

// Function to open a chest
function openChest(index) {
    const chestItem = playerData.inventory[index];
    console.log('Opening chest at index:', index, 'Item details:', chestItem);

    // Determine the correct item pool based on the chest's rarity
    let selectedPool;
    switch (chestItem.rarity) {
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
            console.warn('Unknown rarity:', chestItem.rarity);
            selectedPool = commonItemPool; // Default pool in case of an error
    }

    // Generate a new item based on the chest's rarity
    const newItem = selectedPool[Math.floor(Math.random() * selectedPool.length)]();

    // Replace the chest with the new item in the same index
    playerData.inventory[index] = newItem;
    console.log('Replaced chest with new item:', newItem);

    // Refresh the inventory display
    displayInventory();
}

// Function to show the item modal for Equipment items
function showItemModal(item, index) {
    const modal = document.getElementById('inventory-item-modal');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalItemRarity = document.getElementById('modal-item-rarity');
    const modalItemStars = document.getElementById('modal-item-stars');
    const modalItemIncome = document.getElementById('modal-item-income');

    modalItemName.textContent = item.name;
    modalItemImage.src = item.image;
    modalItemDescription.textContent = item.description;
    modalItemRarity.textContent = item.rarity;
    modalItemRarity.style.color = getRarityColor(item.rarity);
    
    // Set income display if the item has income
    modalItemIncome.style.display = item.income ? 'block' : 'none';
    if (item.income) {
        const incomeIcon = document.createElement('img');
        incomeIcon.src = 'assets/currency.png';
        incomeIcon.className = 'price-icon';
        modalItemIncome.innerHTML = ''; // Clear previous content
        modalItemIncome.appendChild(incomeIcon);
        modalItemIncome.appendChild(document.createTextNode(item.income));
    }

    // Set data-slot and data-index attributes to the item for equipping
    modalItemImage.setAttribute('data-slot', item.slot); // Update with actual item slot
    modalItemImage.setAttribute('data-index', index); // Store the inventory index

    // Generate stars based on item level
    modalItemStars.innerHTML = ''; // Clear previous stars
    const maxStars = 5;
    const itemLevel = Math.min(item.level, maxStars);
    
    for (let i = 0; i < itemLevel; i++) {
        const star = document.createElement('img');
        star.classList.add('star');
        star.src = 'assets/item_star.png';
        modalItemStars.appendChild(star);
    }

    modal.style.display = 'flex'; // Show the modal
}

function setupModalButtons() {
    const equipButton = document.getElementById('equip-button');

    equipButton.addEventListener('click', () => {
        const modalItemImage = document.getElementById('modal-item-image');
        const slotKey = modalItemImage.getAttribute('data-slot'); // Get the item slot from the data attribute
        const inventoryIndex = parseInt(modalItemImage.getAttribute('data-index')); // Get the inventory index

        console.log(slotKey, inventoryIndex); // Log to verify

        // Map the slotKey to the actual playerEquipped keys
        const slotMap = {
            'Head': 'Head',
            'Top': 'Top',
            'Bottom': 'Bottom',
            'Hand': 'Hand',
            'Feet': 'Feet'
        };

        // Check if there is already an item equipped in that slot
        const currentEquippedItem = playerData.playerEquipped[slotMap[slotKey]];

        if (currentEquippedItem) {
            console.log(`You already have an item equipped in the ${slotKey} slot:`, currentEquippedItem);
            const confirmReplace = confirm(`You already have an item equipped in the ${slotKey} slot. Do you want to replace it?`);
            if (!confirmReplace) {
                return; // Exit if user does not want to replace
            }

            // Remove the current equipped item from its slot and add it to the next available slot in the inventory
            addUnequippedItemToInventory(currentEquippedItem); // Use this function to add the unequipped item to inventory
            playerData.playerEquipped[slotMap[slotKey]] = null; // Clear the slot in the equipped items
        }

        // Equip the new item
        const itemToEquip = playerData.inventory[inventoryIndex]; // Get the item to equip using the index
        playerData.playerEquipped[slotMap[slotKey]] = itemToEquip; // Equip the item

        // Remove the item from inventory after equipping
        playerData.inventory[inventoryIndex] = null; // Clear the inventory slot of the equipped item

        // Shift items in inventory to fill the gap left by the equipped item
        shiftInventoryItems(inventoryIndex);
        displayInventory();
        // Update the UI to reflect the equipped item
        // updateEquipmentUI(); // Uncomment and implement this if needed

        // Log the action
        console.log(`Equipped item in the ${slotKey} slot:`, itemToEquip);
        console.log(playerData.playerEquipped);
        modal.style.display = 'none'; // Hide the modal

    });
}

// Function to add the unequipped item to the next available slot in the inventory
function addUnequippedItemToInventory(item) {
    for (let i = 0; i < playerData.inventory.length; i++) {
        if (playerData.inventory[i] === null) {
            playerData.inventory[i] = item;
            return;
        }
    }
    // If no null slots, push item to the end of the inventory
    playerData.inventory.push(item);
}

// Function to shift items in the inventory
function shiftInventoryItems(index) {
    if (index < playerData.inventory.length - 1) {
        // Remove the item at the index and fill the gap
        for (let i = index; i < playerData.inventory.length - 1; i++) {
            playerData.inventory[i] = playerData.inventory[i + 1];
        }
    }

    // Set the last item to null (or you could use a placeholder)
    playerData.inventory[playerData.inventory.length - 1] = null; // Clear the last slot
}

// Call the function to display items when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupModalButtons();
    displayInventory();
});
