// Function to display inventory items
function displayInventory() {
    const inventoryContainer = document.getElementById('inventory-container');

    if (!inventoryContainer) {
        console.error('Inventory container not found');
        return;
    }

    // Clear previous items
    inventoryContainer.innerHTML = '';

    // Check if there are valid items in the inventory
    const validItems = playerData.inventory.filter(item => item && item.img);

    if (validItems.length === 0) {
        console.log('No valid items in the inventory');
        return;
    }

    // Render valid items
    validItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.setAttribute('data-type', item.type); // Add data-type attribute for filtering

        const itemImg = document.createElement('img');
        itemImg.src = item.img;
        itemImg.alt = item.name;

        itemDiv.appendChild(itemImg);

        inventoryContainer.appendChild(itemDiv);
    });
}

// Function to filter inventory items
function filterInventoryItems(type, button) {
    const buttons = document.querySelectorAll('.inventory-filter-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const items = document.querySelectorAll('.inventory-item');
    items.forEach(item => {
        if (type === 'All' || item.getAttribute('data-type') === type) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Call the function to display items when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', displayInventory);
