document.addEventListener('DOMContentLoaded', () => {
    const shopContainer = document.getElementById('shop-container');
    const itemOverlay = document.getElementById('item-overlay');
    const closeOverlayButton = document.getElementById('close-overlay');
    const itemQuantityInput = document.getElementById('item-quantity');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmPurchaseButton = document.getElementById('confirm-purchase');
    const cancelPurchaseButton = document.getElementById('cancel-purchase');
    const confirmationMessage = document.getElementById('confirmation-message');
    
    let currentItem;
    let totalCost;

    const items = [
        { id: '1', name: 'WOODEN CHEST', type: 'Chest', price: '100', img: 'assets/chest_wooden.png', description: 'A WOODEN CHEST', rarity: 'COMMON', level: '1', isOpen: false },
        { id: '2', name: 'SILVER CHEST', type: 'Chest', price: '5,000', img: 'assets/chest_silver.png', description: 'A SILVER CHEST', rarity: 'UNCOMMON', level: '25', isOpen: false },
        { id: '3', name: 'GOLDEN CHEST', type: 'Chest', price: '10,000', img: 'assets/chest_gold.png', description: 'A GOLDEN CHEST', rarity: 'RARE', level: '50', isOpen: false },
        { id: '4', name: 'DIAMOND CHEST', type: 'Chest', price: '50,000', img: 'assets/chest_diamond.png', description: 'A DIAMOND CHEST', rarity: 'UNIQUE', level: '100', isOpen: false },
    ];

    // Render shop items based on filter
    function renderItems(filter = 'All', button) {
        shopContainer.innerHTML = '';
        items
            .filter(item => filter === 'All' || item.type === filter)
            .forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('shop-item');
                
                // Add click event to show item overlay
                itemElement.addEventListener('click', (event) => {
                    event.stopPropagation();
                    showItemOverlay(item);
                });

                itemElement.innerHTML = `
                    <div class="item-header">
                        <div class="item-name">${item.name}</div>
                    </div>
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-info">

                        <div class="item-price">
                            <img id="coin-icon" src="assets/currency.png" alt="Coins Icon" />
                            <span class="price-value">${item.price}</span>
                        </div>
                    </div>
                `;

                shopContainer.appendChild(itemElement);
            });

        // Update active filter button
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        if (button) button.classList.add('active');
    }

    // Show item overlay with item details
    function showItemOverlay(item) {
        currentItem = item;
        document.getElementById('overlay-item-name').textContent = item.name;
        document.getElementById('overlay-item-image').src = item.img;
        document.getElementById('overlay-item-description').textContent = item.description;
        document.getElementById('overlay-item-level').textContent = item.level;
        document.getElementById('overlay-item-price').textContent = item.price;

        const rarityElement = document.getElementById('overlay-item-rarity');
        rarityElement.textContent = item.rarity;

        // Set rarity color based on item rarity
        switch (item.rarity) {
            case 'COMMON':
                rarityElement.style.color = '#b0b0b0';
                break;
            case 'UNCOMMON':
                rarityElement.style.color = '#4caf50';
                break;
            case 'RARE':
                rarityElement.style.color = '#FFD700';
                break;
            case 'UNIQUE':
                rarityElement.style.color = '#9c27b0';
                break;
            default:
                rarityElement.style.color = '#fff';
                break;
        }

        const requiredLevel = parseInt(item.level);
        const playerLevelElement = document.getElementById('overlay-item-level');
        playerLevelElement.style.color = playerData.playerLevel < requiredLevel ? 'red' : '';

        const requiredBalance = parseInt(item.price.replace(/,/g, ''));
        const playerBalanceElement = document.getElementById('overlay-item-price');
        playerBalanceElement.style.color = playerData.playerBalance < requiredBalance ? 'red' : '';

        itemOverlay.style.display = 'flex';

        const purchaseButton = document.getElementById('purchase-button');

        // Update purchase button state based on player level and balance
        const updatePurchaseButtonState = () => {
            purchaseButton.disabled = playerLevelElement.style.color === 'red' || playerBalanceElement.style.color === 'red';
            purchaseButton.style.color = purchaseButton.disabled ? 'red' : '';
        };

        updatePurchaseButtonState();

        purchaseButton.onclick = () => {
            const quantity = parseInt(itemQuantityInput.value);
            totalCost = requiredBalance * quantity;

            confirmationMessage.innerHTML = `Buy ${quantity} ${item.name}(s) for: <div class="confirm-price">
                <img id="confirm-icon" src="assets/currency.png" alt="Confirm Icon" />
                <span>${totalCost.toLocaleString()} ?</span>
            </div>`;

            confirmationModal.style.display = 'block';
        };
    }

    // Cancel purchase action
    cancelPurchaseButton.onclick = () => {
        confirmationModal.style.display = 'none';
    };

    // Confirm purchase action
    confirmPurchaseButton.onclick = () => {
        const quantity = parseInt(itemQuantityInput.value);
        playerData.playerBalance -= totalCost;

        for (let i = 0; i < quantity; i++) {
            const emptyIndex = playerData.inventory.findIndex(slot => slot === null);
            if (emptyIndex !== -1) {
                playerData.inventory[emptyIndex] = currentItem;
            } else {
                console.log('Inventory is full. Cannot add more items.');
                break;
            }
        }

        savePlayerData();
        console.log(`Purchased ${quantity} of ${currentItem.name} for ${totalCost} coins.`);
        
        itemQuantityInput.value = 1;
        itemOverlay.style.display = 'none';
        confirmationModal.style.display = 'none';
        alert(`Successfully purchased ${quantity} ${currentItem.name}(s) for ${totalCost} coins!`);
    };

    // Handle quantity changes and modal closing
    document.addEventListener('click', (event) => {
        // Handle quantity changes
        if (event.target.id === 'decrease-quantity') {
            let currentQuantity = parseInt(itemQuantityInput.value);
            if (currentQuantity > 1) {
                itemQuantityInput.value = currentQuantity - 1;
            }
        } else if (event.target.id === 'increase-quantity') {
            let currentQuantity = parseInt(itemQuantityInput.value);
            itemQuantityInput.value = currentQuantity + 1;
        }

        // Close the item overlay or confirmation modal if clicked outside
        if (event.target === itemOverlay) {
            itemOverlay.style.display = 'none';
            itemQuantityInput.value = 1;
        }

        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });

    renderItems('All');
    window.filterItems = renderItems;
});
