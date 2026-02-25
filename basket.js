document.addEventListener('DOMContentLoaded', () => {
    const basketItems = document.getElementById('basket-items');
    const addToBasketButtons = document.querySelectorAll('.add-to-basket');
    let basket = JSON.parse(localStorage.getItem('basket')) || {};

    addToBasketButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.getAttribute('data-name');
            const itemPrice = parseFloat(button.getAttribute('data-price'));

            addItemToBasket(itemName, itemPrice);
            showNotification('You have successfully added to the basket');
        });
    });

    function addItemToBasket(name, price) {
        if (basket[name]) {
            basket[name].quantity += 1;
        } else {
            basket[name] = { price: price, quantity: 1 };
        }
        localStorage.setItem('basket', JSON.stringify(basket));
        updateBasketHTML();
    }

    function removeItemFromBasket(name) {
        delete basket[name];
        localStorage.setItem('basket', JSON.stringify(basket));
        updateBasketHTML();
    }

    function changeItemQuantity(name, quantity) {
        if (basket[name]) {
            basket[name].quantity += quantity;
            if (basket[name].quantity <= 0) {
                removeItemFromBasket(name);
            } else {
                localStorage.setItem('basket', JSON.stringify(basket));
                updateBasketHTML();
            }
        }
    }

    function updateBasketHTML() {
        basketItems.innerHTML = '';
        let total = 0;

        for (const [name, item] of Object.entries(basket)) {
            const basketItem = document.createElement('li');
            basketItem.innerHTML = `
                ${name} - £${item.price} x ${item.quantity}
                <button class="increase-quantity" data-name="${name}">+</button>
                <button class="decrease-quantity" data-name="${name}">-</button>
                <button class="delete-item" data-name="${name}">Delete</button>
            `;
            basketItems.appendChild(basketItem);
            total += item.price * item.quantity;
        }

        if (total === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Your basket is currently empty.';
            basketItems.appendChild(emptyMessage);
        } else {
            const totalItem = document.createElement('li');
            totalItem.textContent = `Total: £${total.toFixed(2)}`;
            basketItems.appendChild(totalItem);
        }

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.getAttribute('data-name');
                changeItemQuantity(itemName, 1);
            });
        });

        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.getAttribute('data-name');
                changeItemQuantity(itemName, -1);
            });
        });

        document.querySelectorAll('.delete-item').forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.getAttribute('data-name');
                removeItemFromBasket(itemName);
            });
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateBasketHTML();
});