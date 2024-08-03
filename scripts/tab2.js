document.addEventListener('DOMContentLoaded', () => {
    const shopContainer = document.getElementById('shop-container');

    // Predefined items for the shop
    const items = [
        { id: '1', name: 'WOODEN CHEST', price: 100, img: 'assets/chest_wooden.png', description: 'WOODEN CHEST', rarity: 'Common', level: '1', isOpen: false },
        { id: '2', name: 'SILVER CHEST', price: 200, img: 'assets/chest_silver.png', description: 'SILVER CHEST', rarity: 'Uncommon', level: '2', isOpen: false },
        { id: '3', name: 'GOLDEN CHEST', price: 300, img: 'assets/chest_gold.png', description: 'GOLDEN CHEST', rarity: 'Rare', level: '3', isOpen: false },
        { id: '4', name: 'DIAMOND CHEST', price: 400, img: 'assets/chest_diamond.png', description: 'DIAMOND CHEST', rarity: 'Unique', level: '4', isOpen: false },
    ];

    // Render shop items
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('shop-item');

        itemElement.innerHTML = `
        <div class="item-header">
            <div class="item-name">${item.name}</div>
            </div>
            <img src="${item.img}" alt="${item.name}">
            <div class="item-info">
                    <div class="item-description">${item.description}</div>
                <div class="item-price">${item.price}</div>
            </div>
        `;

        shopContainer.appendChild(itemElement);
    });
});

// Function to handle item purchase
function purchaseItem(itemId) {
    // Add logic to handle item purchase
    alert(`Purchased item with ID: ${itemId}`);
}