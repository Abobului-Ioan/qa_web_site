// Main Application Logic

// Global variables
let currentPage = 'home';
let currentProductPage = 1;
let productsPerPage = 6;
let filteredProducts = [...products];
let isPromoBannerVisible = true;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeAOS();
    loadStoredCart();
    loadStoredProfile();
});

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
}

// Initialize application
function initializeApp() {
    setupNavigation();
    setupPromoBanner();
    loadProducts();
    loadDashboardCharts();
    setupFormValidation();
    setupAuthForms();
    setupEventListeners();
    updateCartUI();
    checkAuthState();
    
    // Set initial page
    const hash = window.location.hash.substring(1);
    if (hash && menuItems.find(item => item.id === hash)) {
        showPage(hash);
    }
}

// Navigation handling
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
            
            // Update URL
            window.history.pushState({}, '', `#${pageId}`);
        });
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1) || 'home';
        showPage(hash);
    });
}

// Show specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('page-transition-exit');
    });
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Update URL hash
    if (pageId !== 'home') {
        window.location.hash = pageId;
    } else {
        window.location.hash = '';
    }
    
    // Show target page
    setTimeout(() => {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('page-transition-exit');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active', 'page-transition-enter');
            currentPage = pageId;
            
            // Page-specific initialization
            switch (pageId) {
                case 'products':
                    loadProducts();
                    break;
                case 'cart':
                    updateCartUI();
                    break;
                case 'orders':
                    loadOrders();
                    break;
                case 'dashboard':
                    loadDashboardCharts();
                    break;
                case 'profile':
                    loadProfileData();
                    break;
                case 'auth':
                    // Auth page doesn't need special initialization
                    break;
                case 'product-detail':
                    // Product detail is handled separately
                    break;
            }
        }
    }, 150);
}

// Promotional banner
function setupPromoBanner() {
    const promoBanner = document.getElementById('promoBanner');
    const promoClose = document.querySelector('.promo-close');
    
    if (promoClose) {
        promoClose.addEventListener('click', () => {
            promoBanner.classList.add('hidden');
            isPromoBannerVisible = false;
            document.querySelector('.main-content').style.marginTop = '64px';
            utils.storage.set('promoBannerHidden', true);
        });
    }
    
    // Check if banner was previously closed
    if (utils.storage.get('promoBannerHidden')) {
        promoBanner.classList.add('hidden');
        isPromoBannerVisible = false;
        document.querySelector('.main-content').style.marginTop = '64px';
    }
    
    // Simulate changing promo banners (for testing)
    setTimeout(() => {
        if (isPromoBannerVisible) {
            document.querySelector('.promo-text').textContent = '🚚 Free Shipping on orders over $50!';
        }
    }, 10000);
}

// Product loading and filtering
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    showLoading(productsGrid, 'Loading products...');
    
    // Simulate loading delay
    setTimeout(() => {
        renderProducts();
        renderPagination();
        hideLoading(productsGrid);
    }, 500);
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const startIndex = (currentProductPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    if (pageProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" data-testid="no-products">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <p>No products found matching your criteria.</p>
                <button class="btn secondary" onclick="clearFilters()" data-testid="clear-filters">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = pageProducts.map(product => createProductCard(product)).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    if (paginationContainer) {
        if (totalPages > 1) {
            paginationContainer.innerHTML = `
                <button class="page-btn ${currentProductPage === 1 ? 'disabled' : ''}" 
                        onclick="goToPage(${currentProductPage - 1})" 
                        data-testid="prev-page" ${currentProductPage === 1 ? 'disabled' : ''}>
                    Previous
                </button>
                <span class="page-info" data-testid="page-info">Page ${currentProductPage} of ${totalPages}</span>
                <button class="page-btn ${currentProductPage === totalPages ? 'disabled' : ''}" 
                        onclick="goToPage(${currentProductPage + 1})" 
                        data-testid="next-page" ${currentProductPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
            `;
        } else {
            paginationContainer.innerHTML = '';
        }
    }
}

function goToPage(page) {
    currentProductPage = page;
    renderProducts();
    renderPagination();
    
    // Scroll to top of products
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Filtering
function applyFilters() {
    const categoryFilter = document.querySelector('[data-testid="category-filter"]').value;
    const priceFilter = document.querySelector('[data-testid="price-filter"]').value;
    
    filteredProducts = products.filter(product => {
        let matchesCategory = !categoryFilter || product.category === categoryFilter;
        let matchesPrice = true;
        
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(p => p.replace('+', ''));
            if (max) {
                matchesPrice = product.price >= parseFloat(min) && product.price <= parseFloat(max);
            } else {
                matchesPrice = product.price >= parseFloat(min);
            }
        }
        
        return matchesCategory && matchesPrice;
    });
    
    currentProductPage = 1;
    renderProducts();
    renderPagination();
    
    showNotification(`Found ${filteredProducts.length} products`, 'info', 2000);
}

function clearFilters() {
    document.querySelector('[data-testid="category-filter"]').value = '';
    document.querySelector('[data-testid="price-filter"]').value = '';
    filteredProducts = [...products];
    currentProductPage = 1;
    renderProducts();
    renderPagination();
    
    showNotification('Filters cleared', 'info', 2000);
}

// Shopping cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = shoppingCart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`Updated ${product.title} quantity in cart`, 'success');
    } else {
        shoppingCart.push({
            productId: productId,
            quantity: 1,
            addedAt: new Date()
        });
        showNotification(`Added ${product.title} to cart`, 'success');
    }
    
    updateCartUI();
    saveCart();
    
    // Add animation to cart button
    const cartBtn = document.querySelector('[data-testid="cart-button"]');
    cartBtn.classList.add('bounce');
    setTimeout(() => cartBtn.classList.remove('bounce'), 600);
}

function updateQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = shoppingCart.find(item => item.productId === productId);
    if (item) {
        item.quantity = quantity;
        updateCartUI();
        saveCart();
        
        const product = products.find(p => p.id === productId);
        showNotification(`Updated ${product.title} quantity`, 'info', 2000);
    }
}

function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    const itemElement = document.querySelector(`[data-item-id="${productId}"]`);
    
    if (itemElement) {
        itemElement.classList.add('cart-item-remove');
        setTimeout(() => {
            shoppingCart = shoppingCart.filter(item => item.productId !== productId);
            updateCartUI();
            saveCart();
            showNotification(`Removed ${product.title} from cart`, 'info');
        }, 300);
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.querySelector('.cart-summary');
    
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = shoppingCart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    // Update cart count
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update cart items
    if (cartItems) {
        if (shoppingCart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart" data-testid="empty-cart">
                    <i class="fas fa-shopping-cart empty-cart-icon"></i>
                    <p>Your cart is empty</p>
                    <button class="cta-button secondary" onclick="showPage('products')" data-testid="continue-shopping">Continue Shopping</button>
                </div>
            `;
        } else {
            cartItems.innerHTML = shoppingCart.map(item => createCartItem(item)).join('');
        }
    }
    
    // Update cart summary
    if (cartSummary) {
        // Updated shipping logic: fee if cart has items
        const shipping = shoppingCart.length > 0 ? (totalPrice > 50 ? 0 : 9.99) : 0;
        const tax = totalPrice * 0.08;
        const finalTotal = totalPrice + shipping + tax;
        
        document.querySelector('.cart-subtotal').textContent = utils.formatCurrency(totalPrice);
        document.querySelector('.cart-shipping').textContent = utils.formatCurrency(shipping);
        document.querySelector('.cart-tax').textContent = utils.formatCurrency(tax);
        document.querySelector('.cart-total').textContent = utils.formatCurrency(finalTotal);
        
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = shoppingCart.length === 0;
        }
    }
}

function saveCart() {
    utils.storage.set('shoppingCart', shoppingCart);
}

function loadStoredCart() {
    const stored = utils.storage.get('shoppingCart', []);
    if (stored) {
        shoppingCart = stored;
        updateCartUI();
    }
}

// Checkout process
function proceedToCheckout() {
    if (shoppingCart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }
    
    if (!currentUser) {
        showModal('Login Required', `
            <p>Please log in or create an account to complete your purchase.</p>
            <p>Your cart will be saved while you sign in.</p>
        `, [
            {
                label: 'Cancel',
                type: 'secondary',
                handler: hideModal
            },
            {
                label: 'Login / Sign Up',
                type: 'primary',
                handler: () => { hideModal(); showPage('auth'); }
            }
        ]);
        return;
    }
    
    const subtotal = shoppingCart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    showModal('Checkout Confirmation', `
        <div style="text-align: left;">
            <h4>Order Summary</h4>
            <div style="margin: 1rem 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Subtotal:</span>
                    <span>${utils.formatCurrency(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Shipping:</span>
                    <span>${utils.formatCurrency(shipping)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Tax:</span>
                    <span>${utils.formatCurrency(tax)}</span>
                </div>
                <hr style="margin: 1rem 0;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.125rem;">
                    <span>Total:</span>
                    <span>${utils.formatCurrency(total)}</span>
                </div>
            </div>
            <p style="color: var(--text-light); font-size: 0.875rem;">This is a demo site. No actual payment will be processed.</p>
        </div>
    `, [
        {
            label: 'Cancel',
            type: 'secondary',
            handler: hideModal
        },
        {
            label: 'Complete Order',
            type: 'primary',
            handler: completeOrder
        }
    ]);
}

function completeOrder() {
    hideModal();
    showNotification('Order completed successfully! (Demo)', 'success', 5000);
    
    // Clear cart
    shoppingCart = [];
    updateCartUI();
    saveCart();
    
    // Switch to home page
    setTimeout(() => {
        showPage('home');
    }, 2000);
}

// Profile form handling
function setupFormValidation() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;
    
    profileForm.addEventListener('submit', handleProfileSubmit);
    
    // Real-time validation
    const inputs = profileForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const rules = validationRules[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    if (!rules) return true;
    
    // Required validation
    if (rules.required && !value) {
        showFieldError(field, errorElement, `${fieldName} is required`);
        return false;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
        clearFieldError(field, errorElement);
        return true;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
        showFieldError(field, errorElement, rules.message);
        return false;
    }
    
    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
        showFieldError(field, errorElement, rules.message);
        return false;
    }
    
    clearFieldError(field, errorElement);
    return true;
}

function showFieldError(field, errorElement, message) {
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field, errorElement = null) {
    field.classList.remove('error');
    if (!errorElement) {
        errorElement = document.getElementById(`${field.name}Error`);
    }
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    const inputs = e.target.querySelectorAll('input, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Save profile data
    Object.assign(userProfile, data);
    utils.storage.set('userProfile', userProfile);
    
    showNotification('Profile updated successfully!', 'success');
    
    // Add form submission animation
    const submitBtn = e.target.querySelector('[data-testid="save-button"]');
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span class="btn-spinner"></span> Saving...';
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = 'Save Changes';
    }, 1500);
}

function loadProfileData() {
    const storedProfile = utils.storage.get('userProfile', userProfile);
    
    Object.keys(storedProfile).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = storedProfile[key];
            } else {
                field.value = storedProfile[key] || '';
            }
        }
    });
}

function loadStoredProfile() {
    const stored = utils.storage.get('userProfile');
    if (stored) {
        Object.assign(userProfile, stored);
    }
}

// Dashboard charts
function loadDashboardCharts() {
    if (typeof Chart === 'undefined') return;
    
    setTimeout(() => {
        createSalesChart();
        createCategoryChart();
        updateStatsCards();
    }, 500);
}

function createSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: analyticsData.salesChart.labels,
            datasets: [{
                label: 'Sales ($)',
                data: analyticsData.salesChart.data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

function createCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: analyticsData.categoryChart.labels,
            datasets: [{
                data: analyticsData.categoryChart.data,
                backgroundColor: analyticsData.categoryChart.colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateStatsCards() {
    // Simulate real-time data updates
    setInterval(() => {
        const revenueElement = document.getElementById('revenueValue');
        const ordersElement = document.getElementById('ordersValue');
        
        if (revenueElement && Math.random() > 0.8) {
            const newRevenue = analyticsData.revenue.current + utils.random.number(-100, 200);
            revenueElement.textContent = utils.formatCurrency(newRevenue);
            revenueElement.classList.add('pulse');
            setTimeout(() => revenueElement.classList.remove('pulse'), 1000);
        }
        
        if (ordersElement && Math.random() > 0.9) {
            const newOrders = analyticsData.orders.current + utils.random.number(0, 5);
            ordersElement.textContent = utils.formatNumber(newOrders);
            ordersElement.classList.add('bounce');
            setTimeout(() => ordersElement.classList.remove('bounce'), 600);
        }
    }, 5000);
}

// Event listeners
function setupEventListeners() {
    // Filter buttons
    const applyFiltersBtn = document.querySelector('[data-testid="apply-filters"]');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('[data-testid="checkout-button"]');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Modal close
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }
    
    // Search functionality
    const searchBtn = document.querySelector('[data-testid="search-button"]');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showNotification('Search functionality coming soon!', 'info');
        });
    }
    
    // User button
    const userBtn = document.querySelector('[data-testid="user-button"]');
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            if (currentUser) {
                showPage('profile');
            } else {
                showPage('auth');
            }
        });
    }
    
    // Login button
    const loginBtn = document.querySelector('[data-testid="login-button"]');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showPage('auth');
        });
    }
    
    // Cart button
    const cartBtn = document.querySelector('[data-testid="cart-button"]');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            showPage('cart');
        });
    }
    
    // Continue shopping button
    utils.on(document, 'click', (e) => {
        if (e.target.matches('[data-testid="continue-shopping"]')) {
            showPage('products');
        }
    });
}

// Component testing functions
function toggleDropdown(element) {
    const dropdown = element.closest('.dropdown');
    dropdown.classList.toggle('active');
    
    // Close other dropdowns
    document.querySelectorAll('.dropdown').forEach(dd => {
        if (dd !== dropdown) {
            dd.classList.remove('active');
        }
    });
}

function switchTab(index) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    tabPanels.forEach((panel, i) => {
        panel.classList.toggle('active', i === index);
    });
}

// Dynamic content changes (for testing visual regression)
function changeButtonColors() {
    const buttons = document.querySelectorAll('.btn.primary');
    buttons.forEach(btn => {
        btn.style.backgroundColor = '#10b981'; // Change to green
    });
    showNotification('Button colors changed to green', 'info');
}

function addPromotionalBanner() {
    const existingBanner = document.querySelector('.temp-promo');
    if (existingBanner) {
        existingBanner.remove();
        showNotification('Promotional banner removed', 'info');
        return;
    }
    
    const banner = document.createElement('div');
    banner.className = 'temp-promo';
    banner.style.cssText = `
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        color: white;
        padding: 1rem;
        text-align: center;
        font-weight: bold;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;
    banner.innerHTML = '🎯 FLASH SALE: 70% OFF Everything!';
    banner.setAttribute('data-testid', 'flash-sale-banner');
    
    document.body.appendChild(banner);
    showNotification('Promotional banner added', 'info');
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (banner.parentElement) {
            banner.remove();
        }
    }, 5000);
}

function rearrangeLayout() {
    const heroSection = document.querySelector('.hero-section');
    const featuresSection = document.querySelector('.features-section');
    
    if (heroSection && featuresSection) {
        const parent = heroSection.parentElement;
        const heroClone = heroSection.cloneNode(true);
        const featuresClone = featuresSection.cloneNode(true);
        
        // Swap positions
        parent.insertBefore(featuresClone, heroSection);
        parent.insertBefore(heroClone, featuresSection.nextSibling);
        
        heroSection.remove();
        featuresSection.remove();
        
        showNotification('Layout rearranged - Features moved to top', 'info');
    }
}

// Authentication Functions
function checkAuthState() {
    const storedUser = utils.storage.get('currentUser');
    if (storedUser) {
        currentUser = storedUser;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const userBtn = document.querySelector('[data-testid="user-button"]');
    const loginBtn = document.querySelector('[data-testid="login-button"]');
    
    if (currentUser) {
        userBtn.style.display = 'block';
        loginBtn.style.display = 'none';
        userBtn.title = `Logged in as ${currentUser.firstName} ${currentUser.lastName}`;
    } else {
        userBtn.style.display = 'none';
        loginBtn.style.display = 'flex';
    }
}

function setupAuthForms() {
    const loginForm = document.getElementById('loginFormElement');
    const signupForm = document.getElementById('signupFormElement');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.querySelector('[data-testid="login-tab"]');
    const signupTab = document.querySelector('[data-testid="signup-tab"]');
    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        utils.storage.set('currentUser', currentUser);
        updateAuthUI();
        showNotification(`Welcome back, ${user.firstName}!`, 'success');
        showPage('home');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === data.email)) {
        showNotification('Email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        createdAt: new Date()
    };
    
    users.push(newUser);
    currentUser = newUser;
    utils.storage.set('currentUser', currentUser);
    utils.storage.set('users', users);
    updateAuthUI();
    
    showNotification(`Account created successfully! Welcome, ${newUser.firstName}!`, 'success');
    showPage('home');
}

function logout() {
    currentUser = null;
    utils.storage.remove('currentUser');
    updateAuthUI();
    showNotification('Logged out successfully', 'info');
    showPage('home');
}

// Product Detail Functions
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const container = document.querySelector('.product-detail-container');
    container.innerHTML = createProductDetail(product);
    
    showPage('product-detail');
    window.location.hash = `product-${productId}`;
}

function addToCartFromDetail(productId) {
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value) || 1;
    
    for (let i = 0; i < quantity; i++) {
        addToCart(productId);
    }
    
    showNotification(`${quantity} item(s) added to cart`, 'success');
}

function addToWishlist(productId) {
    // Placeholder for wishlist functionality
    const product = products.find(p => p.id === productId);
    showNotification(`${product.title} added to wishlist`, 'info');
}

// Orders Functions
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (!currentUser) {
        ordersList.innerHTML = `
            <div class="empty-orders" data-testid="empty-orders">
                <i class="fas fa-sign-in-alt"></i>
                <h3>Please log in to view your orders</h3>
                <button class="btn primary" onclick="showPage('auth')" data-testid="login-to-view-orders">Login</button>
            </div>
        `;
        return;
    }
    
    const userOrdersList = userOrders.filter(order => order.userId === currentUser.id);
    
    if (userOrdersList.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders" data-testid="empty-orders">
                <i class="fas fa-shopping-bag"></i>
                <h3>No orders yet</h3>
                <p>When you make your first purchase, it will appear here.</p>
                <button class="btn primary" onclick="showPage('products')" data-testid="start-shopping">Start Shopping</button>
            </div>
        `;
    } else {
        ordersList.innerHTML = userOrdersList
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(order => createOrderCard(order))
            .join('');
    }
}

function createNewOrder() {
    if (!currentUser || shoppingCart.length === 0) return;
    
    const subtotal = shoppingCart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    const newOrder = {
        id: `ORD-${new Date().getFullYear()}-${String(userOrders.length + 1).padStart(3, '0')}`,
        userId: currentUser.id,
        date: new Date(),
        status: 'processing',
        items: shoppingCart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: products.find(p => p.id === item.productId)?.price || 0
        })),
        subtotal,
        shipping,
        tax,
        total
    };
    
    userOrders.push(newOrder);
    utils.storage.set('userOrders', userOrders);
    
    return newOrder;
}

// Enhanced checkout process
function completeOrder() {
    if (!currentUser) {
        hideModal();
        showNotification('Please log in to complete your order', 'warning');
        showPage('auth');
        return;
    }
    
    const order = createNewOrder();
    hideModal();
    showNotification(`Order ${order.id} placed successfully!`, 'success', 5000);
    
    // Clear cart
    shoppingCart = [];
    updateCartUI();
    saveCart();
    
    // Show order confirmation
    setTimeout(() => {
        showModal('Order Confirmation', `
            <div style="text-align: center;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success-color); margin-bottom: 1rem;"></i>
                <h3>Thank you for your order!</h3>
                <p>Order number: <strong>${order.id}</strong></p>
                <p>You will receive an email confirmation shortly.</p>
            </div>
        `, [
            {
                label: 'View Orders',
                type: 'primary',
                handler: () => { hideModal(); showPage('orders'); }
            },
            {
                label: 'Continue Shopping',
                type: 'secondary',
                handler: () => { hideModal(); showPage('products'); }
            }
        ]);
    }, 1000);
}

// Expose functions for testing
window.testFunctions = {
    changeButtonColors,
    addPromotionalBanner,
    rearrangeLayout,
    addToCart,
    showNotification,
    showModal,
    applyFilters,
    clearFilters
};

// Expose main functions globally
window.showPage = showPage;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.proceedToCheckout = proceedToCheckout;
window.goToPage = goToPage;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.toggleDropdown = toggleDropdown;
window.switchTab = switchTab;
window.switchAuthTab = switchAuthTab;
window.showProductDetail = showProductDetail;
window.addToCartFromDetail = addToCartFromDetail;
window.addToWishlist = addToWishlist;
window.logout = logout;