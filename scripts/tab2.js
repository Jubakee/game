document.addEventListener('DOMContentLoaded', () => {
    const shopContainer = document.getElementById('shop-container');
    const itemOverlay = document.getElementById('item-overlay');
    const closeOverlayButton = document.getElementById('close-overlay');
    const itemQuantityInput = document.getElementById('item-quantity');

    // Ensure the overlay is hidden on load
    itemOverlay.style.display = 'none';

    // Predefined items for the shop
    const items = [
        { id: '1', name: 'WOODEN CHEST', type: 'Chest', price: '1,000', img: 'assets/chest_wooden.png', description: 'A WOODEN CHEST', rarity: 'COMMON', level: '10', isOpen: false },
        { id: '2', name: 'SILVER CHEST', type: 'Chest', price: '5,000', img: 'assets/chest_silver.png', description: 'A SILVER CHEST', rarity: 'UNCOMMON', level: '25', isOpen: false },
        { id: '3', name: 'GOLDEN CHEST', type: 'Chest', price: '10,000', img: 'assets/chest_gold.png', description: 'A GOLDEN CHEST', rarity: 'RARE', level: '50', isOpen: false },
        { id: '4', name: 'DIAMOND CHEST', type: 'Chest', price: '50,000', img: 'assets/chest_diamond.png', description: 'A DIAMOND CHEST', rarity: 'UNIQUE', level: '100', isOpen: false },
    ];

    // Function to render shop items
    function renderItems(filter, button) {
        shopContainer.innerHTML = '';
        items
            .filter(item => filter === 'All' || item.type === filter)
            .forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('shop-item');
                
                // Add click event listener to each item
                itemElement.addEventListener('click', () => showItemOverlay(item));

                itemElement.innerHTML = `
                    <div class="item-header">
                        <div class="item-name">${item.name}</div>
                    </div>
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-info">
                        <div class="item-description">${item.description}</div>
                        <div class="item-price">
                            <img id="coin-icon" src="assets/currency.png" alt="Coins Icon" />
                            <span class="price-value">${item.price}</span>
                        </div>
                    </div>
                `;

                shopContainer.appendChild(itemElement);
            });
        
        // Remove active class from all filter buttons
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));

        // Add active class to the clicked button
        if (button) {
            button.classList.add('active');
        }
    }

    // Function to show the item overlay
    function showItemOverlay(item) {
        document.getElementById('overlay-item-name').textContent = item.name;
        document.getElementById('overlay-item-image').src = item.img;
        document.getElementById('overlay-item-description').textContent = item.description;
        document.getElementById('overlay-item-rarity').textContent = item.rarity;
        document.getElementById('overlay-item-level').textContent = item.level;
        document.getElementById('overlay-item-price').textContent = item.price;

        // Show the item overlay
        itemOverlay.style.display = 'flex';

        // Add event listener for the Buy button
        const purchaseButton = document.getElementById('purchase-button');
        purchaseButton.onclick = () => {
            const quantity = parseInt(itemQuantityInput.value);
            console.log(`Item purchased: ${item.name}`);
            console.log(`Quantity: ${quantity}`);
            console.log(`Price: ${item.price}`);
        };
    }

    // Close the overlay when the close button is clicked
    closeOverlayButton.addEventListener('click', () => {
        itemOverlay.style.display = 'none';
    });

    // Quantity control functions
    document.getElementById('decrease-quantity').addEventListener('click', () => {
        let currentQuantity = parseInt(itemQuantityInput.value);
        if (currentQuantity > 1) {
            itemQuantityInput.value = currentQuantity - 1;
        }
    });

    document.getElementById('increase-quantity').addEventListener('click', () => {
        let currentQuantity = parseInt(itemQuantityInput.value);
        itemQuantityInput.value = currentQuantity + 1;
    });

    // Initial render
    renderItems('All', document.querySelector('.filter-button.active'));

    // Expose the filterItems function to the global scope
    window.filterItems = renderItems;
});
