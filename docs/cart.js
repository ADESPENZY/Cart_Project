const list = document.querySelector('.list');
const listcard = document.querySelector('.listcard');
let cart = []; // Initialize an empty cart array
let dishes = []; // Array to hold dishes fetched from the JSON

// fetch the JSON
fetch('dishes.json')
    .then(response => response.json()) 
    .then(data => {
        dishes = data;
        myDishes(data)
    })
    .catch(error => console.error('Error fetching data:', error));

function myDishes(dishes){
    dishes.forEach( dish => {
        const formattedPrice = dish.price.toFixed(2);
        const itemDishes = `
            <div class=" relative">
                <img src="${dish.image}" alt="recipe" class="w-full h-70 rounded-md object-cover relative mb-6">
                <div class="badge addCart"  data-id="${dish.id}">
                    <i class="fa-solid fa-cart-shopping text-red-500"></i>
                    <span>Add to cart</span>
                </div>
                <div class="space-y-2">
                    <h4 class="text-gray-700">${dish.label}</h4>
                    <h4 class="font-bold text-xl">${dish.name}</h4>
                    <h4 class="text-red-600 text-xl font-bold">$${formattedPrice}</h4>
                </div>
            </div>
        `
        list.innerHTML += itemDishes;
    });

    // Add event listeners to all "Add To Cart" buttons after rendering products
    document.querySelectorAll('.addCart').forEach(button => {
        button.addEventListener('click', event => {
            const dishId = event.currentTarget.getAttribute('data-id');
            addToCart(dishId);
        });
    });
}

// Function to add product to cart
function addToCart(dishId) {
    let addCart = cart.findIndex(item => item.dishId == dishId);
    if (addCart < 0) {
        cart.push({
            dishId: dishId,
            quantity: 1
        });
    } else {
        cart[addCart].quantity += 1;
    }
    updateCartUI(); 
    console.log(cart);  // Check the cart content
}

function updateCartUI() {
    console.log('Updating cart UI'); // Check if this function is being called
    console.log(cart); // Check the content of the cart

    listcard.innerHTML = '';  // Clear current cart items

    cart.forEach(item => {
        const dish = dishes.find(dish => dish.id == item.dishId); // Use dishes and dishId
        if (dish) {
            const cartItem = `
                <div class="grid grid-cols-[70px,150px,1fr,50px] gap-5 border-b border-slate-200 py-3">
                    <img src="${dish.image}" class="h-12 w-12 object-cover rounded" alt="">
                    <div>
                        <span class="text-sm font-bold">${dish.name}</span>
                        <div class="flex gap-5">
                            <p>${item.quantity}x</p>
                            <span>@ $${dish.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div>$${(dish.price * item.quantity).toFixed(2)}</div>
                    <div class="cancelOrder cursor-pointer text-red-500"><i class="fa-solid fa-trash"></i></div>
                </div>
                    
                    
            `;
            listcard.innerHTML += cartItem;
        } else {
            console.error('Dish not found:', item.dishId); // Log error if dish is not found
        }
    });

    // Update the cart count
    document.querySelector('.count').innerText = `Your Cart (${cart.length})`;

    document.querySelectorAll('.cancelOrder').forEach(button => {
        button.addEventListener('click', event => {
            const itemIndex = event.currentTarget.getAttribute('data-index');
            removeFromCart(itemIndex);
        });
    })

    updateCartTotal()
}

function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item from the cart array by index
    updateCartUI();

}

// Function to update the total price in the cart
function updateCartTotal() {
    const total = cart.reduce((sum, item) => {
        const dish = dishes.find(dish => dish.id == item.dishId); // Use dishes and dishId
        return sum + (dish ? Number(dish.price) * item.quantity : 0); // Calculate total
    }, 0);

    document.querySelector('.total').innerText = `$${total.toFixed(2)}`; // Display total price with 2 decimal places
}

function togglePopup() {
    const popup = document.querySelector('.popup');
    popup.classList.toggle('hidden');  
    popup.classList.toggle('flex');    
    renderPopupCart();
}
togglePopup();

function renderPopupCart() {
    const popupCart = document.querySelector('.confirm');
    popupCart.innerHTML = ''; // Clear previous items

    cart.forEach(item => {
        const dish = dishes.find(dish => dish.id == item.dishId);
        if (dish) {
            const cartItem = `
                <div class="grid grid-cols-[70px,200px,1fr] gap-5 border-b border-slate-200 py-3">
                    <img src="${dish.image}" class="h-12 w-12 object-cover rounded" alt="">
                    <div>
                        <span class="text-sm font-bold">${dish.name}</span>
                        <div class="flex gap-5">
                            <p>${item.quantity}x</p>
                            <span>@ $${dish.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div>$${(dish.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
            popupCart.innerHTML += cartItem;
        }
    });

    // Update the order total in the popup
    const total = cart.reduce((sum, item) => {
        const dish = dishes.find(dish => dish.id == item.dishId);
        return sum + (dish ? dish.price * item.quantity : 0);
    }, 0);
    document.querySelector('.popup .total').innerText = `$${total.toFixed(2)}`;
}
