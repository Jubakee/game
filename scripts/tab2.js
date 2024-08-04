document.addEventListener('DOMContentLoaded', () => {
    const shopContainer = document.getElementById('shop-container');

    // Predefined items for the shop
    const items = [
        { id: '1', name: 'WOODEN CHEST', type: 'Chest', price: 100, img: 'assets/chest_wooden.png', description: 'A WOODEN CHEST', rarity: 'Common', level: '1', isOpen: false },
        { id: '2', name: 'SILVER CHEST', type: 'Chest', price: 200, img: 'assets/chest_silver.png', description: 'A SILVER CHEST', rarity: 'Uncommon', level: '2', isOpen: false },
        { id: '3', name: 'GOLDEN CHEST', type: 'Chest',price: 300, img: 'assets/chest_gold.png', description: 'A GOLDEN CHEST', rarity: 'Rare', level: '3', isOpen: false },
        { id: '4', name: 'DIAMOND CHEST', type: 'Chest',price: 400, img: 'assets/chest_diamond.png', description: 'A DIAMOND CHEST', rarity: 'Unique', level: '4', isOpen: false },
    ];

    // Function to render shop items
    function renderItems(filter, button) {
        shopContainer.innerHTML = '';
        items
            .filter(item => filter === 'All' || item.type === filter)
            .forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('shop-item');

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

    // Initial render
    renderItems('All', document.querySelector('.filter-button.active'));

    // Expose the filterItems function to the global scope
    window.filterItems = renderItems;
});

// Function to handle item purchase
function purchaseItem(itemId) {
    // Add logic to handle item purchase
    alert(`Purchased item with ID: ${itemId}`);
}