const openShoppingCart = document.querySelector('.shopping');
const closeShoppingCart = document.querySelector('.closeShopping');
const list = document.querySelector('.list');
const body = document.querySelector('body');
const listCard = document.querySelector('.listcard');
const shoppingCount = document.querySelector('.shoppingCount');
let cart = []; 
let products = []; // Ensure products array is initialized

// Open and close cart functionality
openShoppingCart.addEventListener('click', () => {
    body.classList.add('active');
});
closeShoppingCart.addEventListener('click', () => {
    body.classList.remove('active');
});

// Fetch the JSON data
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;  // Store the fetched products
        renderProducts(products);
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to render products
function renderProducts(products) {
    products.forEach(product => {
        
        const productItem = `
            <div class="item bg-white rounded-lg text-center mb-10 p-6 space-y-5">
                <div>
                    <img src="${product.image}" class="h-64 w-full object-cover rounded-lg" alt="${product.name}">
                </div>
                <div class="p-4 space-y-3">
                    <h3 class="text-2xl font-semibold">${product.name}</h3>
                    <p class="price text-xl font-medium text-gray-700">$${product.price}</p> 
                    <button type="button" class="addCart bg-black text-white py-2 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300" data-id="${product.id}">Add To Cart</button>
                </div>
            </div>
        `;
        list.innerHTML += productItem;
    });

    // Add event listeners to all "Add To Cart" buttons after rendering products
    document.querySelectorAll('.addCart').forEach(button => {
        button.addEventListener('click', event => {
            const productId = event.target.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// Function to add product to cart
function addToCart(productId) {
    let addCart = cart.findIndex(item => item.productId == productId);
    if (addCart < 0) {
        cart.push({
            productId: productId,
            quantity: 1
        });
    } else {
        cart[addCart].quantity += 1;
    }
    updateCartUI(); 
    console.log(cart);  // Check the cart content
}

// Function to update the cart UI
function updateCartUI() {
    console.log('Updating cart UI'); // Check if this function is being called
    console.log(cart); // Check the content of the cart

    listCard.innerHTML = '';  // Clear current cart items

    cart.forEach(item => {
        const product = products.find(p => p.id == item.productId);
        if (product) {
            const cartItem = `
                <div>
                    <img src="${product.image}" class="h-12 w-12 object-cover rounded" alt="${product.name}">
                </div>
                <h3 class="text-yellow-500 font-semibold truncate">${product.name}</h3>
                <div class="text-yellow-500 font-medium totalPrice">$${product.price * item.quantity}</div> 
                <div class="quantity flex space-x-2 font-semibold items-center">
                    <span class="minus cursor-pointer inline-flex justify-center items-center w-[25px] h-[25px] text-black bg-white rounded-full" data-id="${product.id}">-</span>
                    <span class="inline-flex justify-center items-center w-[25px] h-[25px] bg-transparent text-white rounded-full">${item.quantity}</span>
                    <span class="plus cursor-pointer inline-flex justify-center items-center w-[25px] h-[25px] text-black bg-white rounded-full" data-id="${product.id}">+</span>
                </div>
            `;
            listCard.innerHTML += cartItem;
        } else {
            console.error('Product not found:', item.productId);
        }
    });

    updateCartTotal(); 
    updateShoppingCount();

    // Add event listeners for the plus and minus buttons
    listCard.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const cartItem = cart.find(item => item.productId == productId);
            if (cartItem) {
                cartItem.quantity += 1;  // Increase the quantity
                updateCartUI();  // Re-render the cart UI
            }
        });
    });

    listCard.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const cartItemIndex = cart.findIndex(item => item.productId == productId);
            if (cartItemIndex >= 0) {
                cart[cartItemIndex].quantity -= 1;  // Decrease the quantity
                if (cart[cartItemIndex].quantity <= 0) {
                    cart.splice(cartItemIndex, 1);  // Remove item from cart if quantity is 0
                }
                updateCartUI();  // Re-render the cart UI
            }
        });
    });

    function updateShoppingCount() {
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        shoppingCount.innerText = itemCount;
    }


}

// Function to update the total price in the cart
function updateCartTotal() {
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id == item.productId);
        return sum + (product ? Number(product.price) * item.quantity : 0);
    }, 0);
    document.querySelector('.total').innerText = `$${total}`;
}

// Event listener for removing items from the cart
listCard.addEventListener('click', event => {
    if (event.target.classList.contains('remove')) {
        const index = event.target.getAttribute('data-index');
        cart.splice(index, 1);  // Remove the item from the cart
        updateCartUI();  // Update the cart display
    }
});

