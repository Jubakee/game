document.addEventListener('DOMContentLoaded', () => {
    const shopContainer = document.getElementById('shop-container');
    const itemOverlay = document.getElementById('item-overlay');
    const closeOverlayButton = document.getElementById('close-overlay');
    const itemQuantityInput = document.getElementById('item-quantity');
    const playerData = { playerLevel: 20, playerBalance: 30000 }; // Sample player data

    // Ensure the overlay is hidden on load
    itemOverlay.style.display = 'none';

    // Confirmation modal variables
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModalButton = document.getElementById('close-modal');
    const confirmPurchaseButton = document.getElementById('confirm-purchase');
    const cancelPurchaseButton = document.getElementById('cancel-purchase');
    const confirmationMessage = document.getElementById('confirmation-message');
    let currentItem; // To store the item currently being purchased
    let totalCost; // To store the total cost of the purchase

    // Predefined items for the shop
    const items = [
        { id: '1', name: 'WOODEN CHEST', type: 'Chest', price: '1,000', img: 'assets/chest_wooden.png', description: 'A WOODEN CHEST', rarity: 'COMMON', level: '10', isOpen: false },
        { id: '2', name: 'SILVER CHEST', type: 'Chest', price: '5,000', img: 'assets/chest_silver.png', description: 'A SILVER CHEST', rarity: 'UNCOMMON', level: '25', isOpen: false },
        { id: '3', name: 'GOLDEN CHEST', type: 'Chest', price: '10,000', img: 'assets/chest_gold.png', description: 'A GOLDEN CHEST', rarity: 'RARE', level: '50', isOpen: false },
        { id: '4', name: 'DIAMOND CHEST', type: 'Chest', price: '50,000', img: 'assets/chest_diamond.png', description: 'A DIAMOND CHEST', rarity: 'UNIQUE', level: '100', isOpen: false },
    ];

    // Function to render shop items
    function renderItems(filter = 'All', button) {
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
        currentItem = item; // Store the current item being viewed
        document.getElementById('overlay-item-name').textContent = item.name;
        document.getElementById('overlay-item-image').src = item.img;
        document.getElementById('overlay-item-description').textContent = item.description;
        document.getElementById('overlay-item-level').textContent = item.level;
        document.getElementById('overlay-item-price').textContent = item.price;

        const rarityElement = document.getElementById('overlay-item-rarity');
        rarityElement.textContent = item.rarity;

        // Set color based on rarity
        switch (item.rarity) {
            case 'COMMON':
                rarityElement.style.color = '#b0b0b0'; // Gray for Common
                break;
            case 'UNCOMMON':
                rarityElement.style.color = '#4caf50'; // Green for Uncommon
                break;
            case 'RARE':
                rarityElement.style.color = '#FFD700'; // Bright Gold for Rare
                break;
            case 'UNIQUE':
                rarityElement.style.color = '#9c27b0'; // Purple for Unique
                break;
            default:
                rarityElement.style.color = '#fff'; // Default white if rarity is unknown
                break;
        }

        // Check player level against required level
        const requiredLevel = parseInt(item.level);
        const playerLevelElement = document.getElementById('overlay-item-level');
        console.log(playerData.playerLevel)
        
        if (playerData.playerLevel < requiredLevel) {
            playerLevelElement.style.color = 'red'; // Set to red if player level is not high enough
        } else {
            playerLevelElement.style.color = ''; // Reset to default if level is sufficient
        }

        const requiredBalance = parseInt(item.price.replace(/,/g, '')); // Remove commas before parsing
        const playerBalanceElement = document.getElementById('overlay-item-price');
        
        if (playerData.playerBalance < requiredBalance) {
            playerBalanceElement.style.color = 'red'; // Set to red if player balance is not sufficient
        } else {
            playerBalanceElement.style.color = ''; // Reset to default if balance is sufficient
        }

        // Show the item overlay
        itemOverlay.style.display = 'flex';

        // Add event listener for the Buy button
        const purchaseButton = document.getElementById('purchase-button');

        // Function to update the buy button state
        const updatePurchaseButtonState = () => {
            if (playerLevelElement.style.color === 'red' || playerBalanceElement.style.color === 'red') {
                purchaseButton.disabled = true; // Disable the button if any text is red
                purchaseButton.style.color = 'red'; // Change button text color to red
            } else {
                purchaseButton.disabled = false; // Enable the button if conditions are met
                purchaseButton.style.color = ''; // Reset button text color to default
            }
        };

        // Initial check for button state
        updatePurchaseButtonState();

        purchaseButton.onclick = () => {
            const quantity = parseInt(itemQuantityInput.value);
            totalCost = requiredBalance * quantity; // Use requiredBalance directly

            // Show the confirmation modal
            confirmationMessage.innerHTML = `Buy ${quantity} ${item.name}(s) for: <div class="confirm-price">
            <img id="confirm-icon" src="assets/currency.png" alt="Confirm Icon" />
            <span>${totalCost.toLocaleString()} ?</span>
        </div>`;
        
            confirmationModal.style.display = 'block';
        };

    //     <div class="item-price">
    //     <img id="coin-icon" src="assets/currency.png" alt="Coins Icon" />
    //     <span class="price-value">${item.price}</span>
    // </div>

        // Recheck button state on color change
        playerLevelElement.style.color = playerLevelElement.style.color; // Trigger re-evaluation
        playerBalanceElement.style.color = playerBalanceElement.style.color; // Trigger re-evaluation
        updatePurchaseButtonState();
    }

    // Close the overlay when the close button is clicked
    closeOverlayButton.addEventListener('click', () => {
        itemOverlay.style.display = 'none';
        itemQuantityInput.value = 1; // Reset quantity input to 1 when overlay is closed
    });

    // Close the confirmation modal
    closeModalButton.onclick = () => {
        confirmationModal.style.display = 'none';
    };

    // Cancel purchase
    cancelPurchaseButton.onclick = () => {
        confirmationModal.style.display = 'none';
    };

    // Confirm purchase
    confirmPurchaseButton.onclick = () => {
        const quantity = parseInt(itemQuantityInput.value);
        
        // Proceed with the purchase logic here
        playerData.playerBalance -= totalCost; // Deduct total from player's balance
        console.log(`Purchased ${quantity} of ${currentItem.name} for ${totalCost} coins.`);
        itemQuantityInput.value = 1; // Reset quantity input after purchase

        // Close the overlay and confirmation modal
        itemOverlay.style.display = 'none';
        confirmationModal.style.display = 'none';
        alert(`Successfully purchased ${quantity} ${currentItem.name}(s) for ${totalCost} coins!`);
    };

    // Quantity control functions
    document.addEventListener('click', (event) => {
        if (event.target.id === 'decrease-quantity') {
            let currentQuantity = parseInt(itemQuantityInput.value);
            if (currentQuantity > 1) {
                itemQuantityInput.value = currentQuantity - 1;
            }
        } else if (event.target.id === 'increase-quantity') {
            let currentQuantity = parseInt(itemQuantityInput.value);
            itemQuantityInput.value = currentQuantity + 1;
        }
    });

    // Initial render
    renderItems('All');

    // Expose the filterItems function to the global scope
    window.filterItems = renderItems;
});
