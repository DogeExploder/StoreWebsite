document.addEventListener('DOMContentLoaded', () => {
    let balance = 99999999999999;
    let cart = [];

    const balanceElement = document.getElementById('balance');
    const resetButton = document.getElementById('reset-button');
    const backToFirstStoreButton = document.getElementById('back-to-first-store');
    const categoryDropdown = document.getElementById('category-dropdown');

    updateBalance();

    resetButton.addEventListener('click', () => {
        balance = 99999999999999;
        cart = [];
        updateBalance();
        updateCart();
    });

    backToFirstStoreButton.addEventListener('click', () => {
        // Navigate back to the first store without changing balance
        window.location.href = 'Index.html';
    });

    categoryDropdown.addEventListener('change', () => {
        const selectedCategory = categoryDropdown.value;
        const categories = document.querySelectorAll('.category');

        categories.forEach(category => {
            category.style.display = 'none';
        });

        if (selectedCategory === 'all') {
            categories.forEach(category => {
                category.style.display = 'block';
            });
        } else {
            const selectedCategoryElement = document.getElementById(selectedCategory);
            if (selectedCategoryElement) {
                selectedCategoryElement.style.display = 'block';
            }
        }
    });

    const buyButtons = document.querySelectorAll('.buy-button');
    const sellButtons = document.querySelectorAll('.sell-button');
    const cartElement = document.getElementById('cart-items');

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement.parentElement;
            const title = item.querySelector('h3').innerText;
            const priceText = item.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('$', ''));
            const amount = parseInt(item.querySelector('.amount').value, 10);

            const totalCost = price * amount;
            if (totalCost <= balance) {
                addToCart(title, price, amount);
                balance -= totalCost;
                updateBalance();
            } else {
                alert('You do not have enough balance to complete this purchase.');
            }
        });
    });

    sellButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement.parentElement;
            const title = item.querySelector('h3').innerText;
            const priceText = item.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('$', ''));
            const amount = parseInt(item.querySelector('.amount').value, 10);

            const index = cart.findIndex(item => item.title === title);
            if (index !== -1) {
                if (amount <= cart[index].amount) {
                    balance += price * amount;
                    cart[index].amount -= amount;
                    if (cart[index].amount === 0) {
                        cart.splice(index, 1);
                    }
                    updateBalance();
                    updateCart();
                } else {
                    alert('You cannot sell more than you have in the cart.');
                }
            }
        });
    });

    function addToCart(title, price, amount) {
        const existingItemIndex = cart.findIndex(item => item.title === title);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].
            amount += amount;
        } else {
            cart.push({ title, price, amount });
        }
        updateCart();
    }

    function updateBalance() {
        balanceElement.textContent = balance.toFixed(2);
    }

    function updateCart() {
        cartElement.innerHTML = '';
        if (cart.length === 0) {
            cartElement.innerHTML = '<p>No items in the cart.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Amount: ${item.amount}</p>
                `;
                cartElement.appendChild(cartItemElement);
            });
        }
    }
});
