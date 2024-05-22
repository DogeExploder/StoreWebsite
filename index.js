document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const cartItemsElement = document.getElementById('cart-items');
    const resetButton = document.getElementById('reset-button');
    const categoryDropdown = document.getElementById('category-dropdown');
    const otherStoreButton = document.getElementById('other-store-button');

    let balance = 99999999999999.00;
    let cart = [];
    
    function updateBalance() {
        balanceElement.textContent = balance.toFixed(2);
    }

    otherStoreButton.addEventListener('click', () => {
        // Navigate back to the first store without changing balance
        window.location.href = 'store2.html';
    });

    function updateCart() {
        cartItemsElement.innerHTML = '';
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<p>No items in the cart.</p>';
            return;
        }
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `<h3>${item.name}</h3><p>Quantity: ${item.quantity}</p><p>Total: $${(item.quantity * item.price).toFixed(2)}</p>`;
            cartItemsElement.appendChild(cartItem);
        });
    }

    function handleBuy(event) {
        const itemElement = event.target.closest('.item');
        const name = itemElement.querySelector('h3').textContent;
        const price = parseFloat(itemElement.querySelector('.price').textContent.substring(1));
        const quantity = parseInt(itemElement.querySelector('.amount').value);
        const totalCost = price * quantity;

        if (totalCost > balance) {
            alert('Not enough balance to buy this item.');
            return;
        }

        balance -= totalCost;

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }

        updateBalance();
        updateCart();
    }

    function handleSell(event) {
        const itemElement = event.target.closest('.item');
        const name = itemElement.querySelector('h3').textContent;
        const price = parseFloat(itemElement.querySelector('.price').textContent.substring(1));
        const quantity = parseInt(itemElement.querySelector('.amount').value);

        const existingItem = cart.find(item => item.name === name);
        if (!existingItem || existingItem.quantity < quantity) {
            alert('Not enough items in the cart to sell.');
            return;
        }

        existingItem.quantity -= quantity;
        if (existingItem.quantity === 0) {
            cart = cart.filter(item => item.name !== name);
        }

        balance += price * quantity;

        updateBalance();
        updateCart();
    }

    function handleReset() {
        balance = 99999999999999.00;
        cart = [];
        updateBalance();
        updateCart();
    }

    function handleCategoryChange() {
        const selectedCategory = categoryDropdown.value;
        document.querySelectorAll('.category').forEach(category => {
            category.style.display = selectedCategory === 'all' || category.id === selectedCategory ? 'block' : 'none';
        });
    }

    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', handleBuy);
    });

    document.querySelectorAll('.sell-button').forEach(button => {
        button.addEventListener('click', handleSell);
    });

    resetButton.addEventListener('click', handleReset);
    categoryDropdown.addEventListener('change', handleCategoryChange);
    otherStoreButton.addEventListener('click', handleStoreChange);

    updateBalance();
    updateCart();
    handleCategoryChange();  // Initialize category view
});
