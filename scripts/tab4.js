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
                    showItemModal(item); // Show modal for Equipment items
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
function showItemModal(item) {
    const modal = document.getElementById('inventory-item-modal');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalItemRarity = document.getElementById('modal-item-rarity');
    const modalItemLevelContainer = document.getElementById('modal-item-level-container');
    const modalItemStars = document.getElementById('modal-item-stars');
    const chestOpenButton = document.getElementById('chest-open-button');
    const equipButton = document.getElementById('equip-button');
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
        incomeIcon.src = 'assets/currency.png'; // Path to your income icon
        incomeIcon.className = 'price-icon'; // Optional: add a class for styling
        
        // Clear previous income content
        modalItemIncome.innerHTML = ''; // Clear previous content
        
        // Append the icon and the income text
        modalItemIncome.appendChild(incomeIcon); // Add the icon
        modalItemIncome.appendChild(document.createTextNode(item.income)); // Add the income text
    }

    // // Show/Hide rows based on item type
    // if (item.type === 'Chest') {
    //     chestOpenButton.style.display = 'block';
    //     equipButton.style.display = 'none';
    //     modalItemLevelContainer.style.display = 'none';
    // } else if (item.type === 'Equipment') {
    //     chestOpenButton.style.display = 'none';
    //     equipButton.style.display = 'block';
    //     modalItemLevelContainer.style.display = 'flex'; // Show level for Equipment
    // }

    // Generate stars based on item level
    modalItemStars.innerHTML = ''; // Clear previous stars
    const maxStars = 5;
    const itemLevel = Math.min(item.level, maxStars);
    
    for (let i = 0; i < itemLevel; i++) {
        const star = document.createElement('img');
        star.classList.add('star');
        star.src = 'assets/item_star.png'; // Set the path for filled stars
        modalItemStars.appendChild(star);
    }

    modal.style.display = 'flex'; // Show the modal
}

// Function to set up modal button actions
function setupModalButtons() {
    const equipButton = document.getElementById('equip-button');
    
    // Add click event to the chest open button


    // Add click event to the equip button
    equipButton.addEventListener('click', () => {

        console.log('ss')

    });
}

// Call the function to display items when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupModalButtons();
    displayInventory();
});
