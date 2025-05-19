// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartIcon = document.querySelector('.cart-icon');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const newsletterForm = document.getElementById('newsletter-form');

// Check if we have the necessary elements for the page to function
const hasRequiredElements = () => {
    const missing = [];
    if (!productGrid) missing.push('product-grid');
    if (!cartOverlay) missing.push('cart-overlay');
    if (!cartItemsContainer) missing.push('cart-items');
    
    if (missing.length > 0) {
        console.warn(`Some required elements are missing: ${missing.join(', ')}`);
        return false;
    }
    return true;
};

// Cart
let cart = [];

// Utility function to debounce function calls
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if we have all required elements before initializing
        if (!hasRequiredElements()) {
            console.warn("The page is missing required elements. Some features may not work properly.");
        }
        
        // Display products if the product grid exists
        if (productGrid) {
            displayProducts();
        }
        
        // Set up countdown timer with a slight delay to ensure DOM is fully loaded
        const countdownElements = document.querySelectorAll('.countdown-item span');
        if (countdownElements.length > 0) {
            setTimeout(() => {
                setupCountdown();
            }, 100);
        }
        
        // Load cart from local storage
        loadCart();
        
        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error("Error initializing the application:", error);
    }
});

// Display Products in the grid
function displayProducts() {
    try {
        if (!products || !Array.isArray(products)) {
            console.error("Products data is not available or not an array");
            return;
        }
        
        let result = '';
        products.forEach(product => {
            try {
                const starsHTML = generateStars(product.rating);
                
                result += `
                    <div class="product-card" data-id="${product.id}">
                        <div class="product-img">
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <div class="product-info">
                            <div class="product-category">${product.category}</div>
                            <h3 class="product-title">${product.title}</h3>
                            <div class="product-price">
                                <span class="current-price">$${product.price.toFixed(2)}</span>
                                <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                                <span class="discount">${product.discount} OFF</span>
                            </div>
                            <div class="product-rating">
                                <div class="stars">${starsHTML}</div>
                                <div class="reviews-count">(${product.reviews} reviews)</div>
                            </div>
                            <div class="product-buttons">
                                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                                <button class="view-details" data-id="${product.id}">Details</button>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error("Error rendering product:", error, product);
            }
        });
        
        if (productGrid) {
            productGrid.innerHTML = result;
        } else {
            console.warn("Product grid element not found");
        }
    } catch (error) {
        console.error("Error displaying products:", error);
    }
}

// Generate star rating HTML
function generateStars(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Set up countdown timer
function setupCountdown() {
    // Set the countdown date (7 days from now)
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 7);
    
    // Update countdown every second
    const countdownTimer = setInterval(() => {
        try {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            
            // Calculate days, hours, minutes, and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Check if elements exist before updating them
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
            
            // If the countdown is over, clear the interval
            if (distance < 0) {
                clearInterval(countdownTimer);
                if (daysElement) daysElement.textContent = '00';
                if (hoursElement) hoursElement.textContent = '00';
                if (minutesElement) minutesElement.textContent = '00';
                if (secondsElement) secondsElement.textContent = '00';
            }
        } catch (error) {
            console.error("Error in countdown timer:", error);
            clearInterval(countdownTimer);
        }
    }, 1000);
}

// Set up event listeners
function setupEventListeners() {
    try {
        // Add to cart buttons
        if (productGrid) {
            productGrid.addEventListener('click', event => {
                try {
                    if (event.target.classList.contains('add-to-cart')) {
                        const id = parseInt(event.target.dataset.id);
                        addToCart(id);
                    } else if (event.target.classList.contains('view-details')) {
                        const id = parseInt(event.target.dataset.id);
                        showProductDetails(id);
                    }
                } catch (error) {
                    console.error("Error in product grid click handler:", error);
                }
            });
        }
        
        // Cart toggle
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                try {
                    cartOverlay.classList.add('show');
                } catch (error) {
                    console.error("Error showing cart:", error);
                }
            });
        }
        
        // Close cart
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => {
                try {
                    cartOverlay.classList.remove('show');
                } catch (error) {
                    console.error("Error closing cart:", error);
                }
            });
        }
        
        // Cart functionality (remove, increase, decrease)
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', event => {
                if (event.target.classList.contains('remove-item')) {
                    const id = parseInt(event.target.dataset.id);
                    removeFromCart(id);
                } else if (event.target.classList.contains('quantity-btn-increase')) {
                    const id = parseInt(event.target.dataset.id);
                    increaseQuantity(id);
                } else if (event.target.classList.contains('quantity-btn-decrease')) {
                    const id = parseInt(event.target.dataset.id);
                    decreaseQuantity(id);
                }
            });
        }
        
        // Checkout button
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length > 0) {
                    alert('Thank you for your purchase! Your order is being processed.');
                    cart = [];
                    saveCart();
                    displayCart();
                    cartOverlay.classList.remove('show');
                } else {
                    alert('Your cart is empty. Add some products before checking out.');
                }
            });
        }
        
        // Mobile menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                try {
                    hamburger.classList.toggle('active');
                    navLinks.classList.toggle('active');
                } catch (error) {
                    console.error("Error toggling mobile menu:", error);
                }
            });
        }
        
        // Newsletter form
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', event => {
                event.preventDefault();
                const email = event.target.querySelector('input[type="email"]').value;
                if (email) {
                    alert(`Thank you for subscribing with ${email}! You will now receive our latest updates.`);
                    event.target.reset();
                }
            });
        }
    } catch (error) {
        console.error("Error setting up event listeners:", error);
    }
}

// Add to cart
function addToCart(id) {
    try {
        const product = products.find(item => item.id === id);
        if (!product) return;
        
        const inCart = cart.find(item => item.id === id);
        
        if (inCart) {
            // If already in cart, increase quantity
            increaseQuantity(id);
        } else {
            // If not in cart, add it
            const cartItem = {
                ...product,
                quantity: 1
            };
            cart.push(cartItem);
            saveCart();
            displayCart();
        }
        
        // Show feedback
        showAddToCartFeedback(product.title);
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}

// Show feedback when adding to cart
function showAddToCartFeedback(title) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.classList.add('add-to-cart-feedback');
    feedbackDiv.textContent = `${title} added to cart!`;
    document.body.appendChild(feedbackDiv);
    
    // Animate the feedback
    setTimeout(() => {
        feedbackDiv.classList.add('show');
        
        setTimeout(() => {
            feedbackDiv.classList.remove('show');
            
            setTimeout(() => {
                document.body.removeChild(feedbackDiv);
            }, 300);
        }, 2000);
    }, 10);
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    displayCart();
}

// Increase quantity
function increaseQuantity(id) {
    cart = cart.map(item => {
        if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
        }
        return item;
    });
    saveCart();
    displayCart();
}

// Decrease quantity
function decreaseQuantity(id) {
    let shouldRemove = false;
    
    cart = cart.map(item => {
        if (item.id === id) {
            if (item.quantity === 1) {
                shouldRemove = true;
            }
            return { ...item, quantity: item.quantity - 1 };
        }
        return item;
    });
    
    if (shouldRemove) {
        cart = cart.filter(item => item.id !== id);
    }
    
    saveCart();
    displayCart();
}

// Show product details (modal)
function showProductDetails(id) {
    const product = products.find(item => item.id === id);
    
    if (product) {
        alert(`Product: ${product.title}\nPrice: $${product.price}\nDescription: ${product.description}`);
    }
}

// Display cart
function displayCart() {
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            updateCartTotal();
            updateCartCount();
            return;
        }
        
        let cartHTML = '';
        cart.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-actions">
                            <button class="quantity-btn quantity-btn-decrease" data-id="${item.id}">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn quantity-btn-increase" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        updateCartTotal();
        updateCartCount();
    }
}

// Update cart total
function updateCartTotal() {
    if (cartTotal) {
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

// Update cart count
function updateCartCount() {
    if (cartCount) {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = count;
    }
}

// Save cart to local storage
function saveCart() {
    localStorage.setItem('shopCart', JSON.stringify(cart));
}

// Load cart from local storage
function loadCart() {
    try {
        const storedCart = localStorage.getItem('shopCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            displayCart();
        }
    } catch (error) {
        console.error("Error loading cart from storage:", error);
        cart = [];
    }
}

// Add sample placeholder images if real images don't exist
function handleImageError(img) {
    img.onerror = null;
   } 