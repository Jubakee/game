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
    if (!inventoryContainer) {
        console.error('Inventory container not found');
        return;
    }

    // Clear previous items
    inventoryContainer.innerHTML = '';

    // Render items based on the current filter
    playerData.inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.setAttribute('data-slot', index); // Add data-slot attribute for slot index

        if (item) {
            // If the item exists, render it
            if (item.image) {
                const itemImg = document.createElement('img');
                itemImg.src = item.image;
                itemImg.alt = item.name;

                // Check if the item is currently equipped
                const isEquipped = Object.values(playerData.playerEquipped).some(equippedItem => equippedItem && equippedItem.id === item.id);
                if (isEquipped) {
                    itemDiv.classList.add('equipped'); // Add class to indicate it's equipped
                }

                itemDiv.appendChild(itemImg);

                // Add click event listener to handle item interactions
                itemDiv.addEventListener('click', () => {
                    if (item.type === 'Chest') {
                        openChest(index); // Call function to open chest
                    } else {
                        showItemModal(item, index); // Show modal for Equipment items and pass index
                    }
                });
            }
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


function shouldDisplayItem(item) {
    if (!item) return false; // Skip if there's no item

    if (currentFilter === 'All') return true; // Show all items

    // Check if the item's rarity matches the current filter
    return item.rarity === currentFilter;
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
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalItemRarity = document.getElementById('modal-item-rarity');
    const modalItemStars = document.getElementById('modal-item-stars');
    const modalItemIncome = document.getElementById('modal-item-income');
    const equipButton = document.getElementById('equip-button');

    // Clear previous content
    modalItemName.innerHTML = ''; // Clear previous content

    // Create a span for the item name and set its class based on rarity
    const itemNameSpan = document.createElement('span');
    itemNameSpan.textContent = item.name;
    itemNameSpan.classList.add('item-name', item.rarity); // Add rarity class

    modalItemName.appendChild(itemNameSpan); // Append the item name span to the modal

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
        modalItemIncome.appendChild(document.createTextNode(`+${item.income}`)); // Display income as positive value
    }

    // Set data-slot and data-index attributes to the item for equipping or unequipping
    modalItemImage.setAttribute('data-slot', item.slot);
    modalItemImage.setAttribute('data-index', index);

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

    // Determine if the item is equipped
    const isEquipped = Object.values(playerData.playerEquipped).some(equippedItem => equippedItem && equippedItem.id === item.id);

    // Update the button text and functionality
    equipButton.textContent = isEquipped ? 'Unequip' : 'Equip';

    modal.style.display = 'flex'; // Show the modal
}


// Function to setup the modal buttons
function setupModalButtons() {
    const equipButton = document.getElementById('equip-button');

    equipButton.addEventListener('click', () => {
        const modalItemImage = document.getElementById('modal-item-image');
        const slotKey = modalItemImage.getAttribute('data-slot');
        const inventoryIndex = parseInt(modalItemImage.getAttribute('data-index'));

        const slotMap = {
            'Head': 'Head',
            'Top': 'Top',
            'Bottom': 'Bottom',
            'Hands': 'Hands',
            'Feet': 'Feet'
        };

        const equippedItem = playerData.playerEquipped[slotMap[slotKey]];
        const itemToEquip = playerData.inventory[inventoryIndex];

        if (equipButton.textContent === 'Unequip') {
            // Unequip the item
            if (equippedItem && equippedItem.id === itemToEquip.id) {
                // Remove the item from the equipped slot
                playerData.playerEquipped[slotMap[slotKey]] = null;
                playerData.playerIncome -= itemToEquip.income; // Subtract income from player data

                // Add the unequipped item back to the inventory
                addUnequippedItemToInventory(itemToEquip);

                // Update the UI
                displayInventory();
                modal.style.display = 'none'; // Hide the modal
                console.log(`Unequipped item from the ${slotKey} slot:`, equippedItem);
            }
        } else {
            // Equip the item
            if (equippedItem) {
                const confirmReplace = confirm(`You already have an item equipped in the ${slotKey} slot. Do you want to replace it?`);
                if (!confirmReplace) return; // Exit if the user does not want to replace

                // Just unequip the currently equipped item
                playerData.playerEquipped[slotMap[slotKey]] = null;
                playerData.playerIncome -= equippedItem.income; // Subtract income from player data

                // Add the unequipped item back to the inventory
                addUnequippedItemToInventory(equippedItem);
            }

            // Equip the new item
            playerData.playerEquipped[slotMap[slotKey]] = itemToEquip;
            playerData.playerIncome += itemToEquip.income; // Add income to player data

            // Update the UI to reflect the changes
            displayInventory();
            modal.style.display = 'none';
            console.log(`Equipped item in the ${slotKey} slot:`, itemToEquip);
        }

        savePlayerData();
        displayEquippedItems();
    });
}

// Function to add the unequipped item to the next available slot in the inventory
function addUnequippedItemToInventory(item) {
    // Check if the item already exists in the inventory
    const existingIndex = playerData.inventory.findIndex(existingItem => existingItem && existingItem.id === item.id);
    
    if (existingIndex !== -1) {
        console.warn(`Item already exists in inventory at index ${existingIndex}:`, item);
        return; // Don't add the item if it already exists
    }

    // Find the next available slot
    for (let i = 0; i < playerData.inventory.length; i++) {
        if (!playerData.inventory[i]) {
            playerData.inventory[i] = item; // Add item to the first empty slot
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

    // Set the last item to null
    playerData.inventory[playerData.inventory.length - 1] = null; // Clear the last slot
}

// Call the function to display items when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupModalButtons();
    displayInventory();
});
