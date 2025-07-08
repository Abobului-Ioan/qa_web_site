// Sample Data for E-commerce Site

// Product Data
const products = [
    {
        id: 1,
        title: "Wireless Headphones style",
        category: "electronics",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
        rating: 4.5,
        reviews: 128,
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        title: "Smart Watch",
        category: "electronics",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
        rating: 4.3,
        reviews: 95,
        description: "Feature-rich smartwatch with health monitoring"
    },
    {
        id: 3,
        title: "Laptop Backpack",
        category: "accessories",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
        rating: 4.7,
        reviews: 203,
        description: "Durable laptop backpack with multiple compartments"
    },
    {
        id: 4,
        title: "Bluetooth Speaker",
        category: "electronics",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop",
        rating: 4.4,
        reviews: 87,
        description: "Portable Bluetooth speaker with excellent sound quality"
    },
    {
        id: 5,
        title: "Casual T-Shirt",
        category: "clothing",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop",
        rating: 4.2,
        reviews: 156,
        description: "Comfortable cotton t-shirt in various colors"
    },
    {
        id: 6,
        title: "Running Shoes",
        category: "clothing",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
        rating: 4.6,
        reviews: 234,
        description: "Lightweight running shoes with superior comfort"
    },
    {
        id: 7,
        title: "Coffee Maker",
        category: "appliances",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
        rating: 4.3,
        reviews: 72,
        description: "Programmable coffee maker with thermal carafe"
    },
    {
        id: 8,
        title: "Wireless Mouse",
        category: "electronics",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=200&fit=crop",
        rating: 4.1,
        reviews: 91,
        description: "Ergonomic wireless mouse with long battery life"
    },
    {
        id: 9,
        title: "Desk Lamp",
        category: "home",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
        rating: 4.4,
        reviews: 65,
        description: "LED desk lamp with adjustable brightness"
    },
    {
        id: 10,
        title: "Fitness Tracker",
        category: "electronics",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=200&fit=crop",
        rating: 4.2,
        reviews: 143,
        description: "Advanced fitness tracker with heart rate monitoring"
    },
    {
        id: 11,
        title: "Cookbook",
        category: "books",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
        rating: 4.8,
        reviews: 89,
        description: "Collection of easy and delicious recipes"
    },
    {
        id: 12,
        title: "Yoga Mat",
        category: "fitness",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop",
        rating: 4.5,
        reviews: 178,
        description: "Non-slip yoga mat with extra cushioning"
    }
];

// User Profile Data
const userProfile = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    newsletter: true,
    notifications: false
};

// Dashboard Analytics Data
const analyticsData = {
    revenue: {
        current: 12450,
        previous: 10820,
        change: 15.3
    },
    orders: {
        current: 1234,
        previous: 1141,
        change: 8.2
    },
    customers: {
        current: 892,
        previous: 911,
        change: -2.1
    },
    conversion: {
        current: 3.24,
        previous: 3.19,
        change: 0.5
    },
    salesChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [2100, 2300, 2800, 3200, 2900, 3400, 3800, 4100, 3900, 4300, 4600, 4200]
    },
    categoryChart: {
        labels: ['Electronics', 'Clothing', 'Books', 'Home', 'Fitness'],
        data: [35, 25, 15, 15, 10],
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    }
};

// Shopping Cart Data (starts empty)
let shoppingCart = [];

// User Authentication Data
let currentUser = null;
let users = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123", // In real app, this would be hashed
        createdAt: new Date('2024-01-15')
    }
];

// Orders Data
let userOrders = [
    {
        id: 'ORD-2024-001',
        userId: 1,
        date: new Date('2024-02-15'),
        status: 'delivered',
        items: [
            { productId: 1, quantity: 1, price: 89.99 },
            { productId: 3, quantity: 2, price: 45.99 }
        ],
        subtotal: 181.97,
        shipping: 9.99,
        tax: 15.36,
        total: 207.32
    },
    {
        id: 'ORD-2024-002', 
        userId: 1,
        date: new Date('2024-03-01'),
        status: 'shipped',
        items: [
            { productId: 2, quantity: 1, price: 299.99 }
        ],
        subtotal: 299.99,
        shipping: 0,
        tax: 24.00,
        total: 323.99
    },
    {
        id: 'ORD-2024-003',
        userId: 1, 
        date: new Date('2024-03-10'),
        status: 'processing',
        items: [
            { productId: 4, quantity: 1, price: 79.99 },
            { productId: 5, quantity: 3, price: 19.99 }
        ],
        subtotal: 139.96,
        shipping: 0,
        tax: 11.20,
        total: 151.16
    }
];

// Promotional Banners Data
const promoBanners = [
    {
        id: 1,
        text: "🎉 Limited Time: 50% OFF on all Electronics!",
        type: "sale",
        active: true
    },
    {
        id: 2,
        text: "🚚 Free Shipping on orders over $50!",
        type: "shipping",
        active: false
    },
    {
        id: 3,
        text: "🆕 New arrivals in Fashion category!",
        type: "new",
        active: false
    }
];

// Form Validation Rules
const validationRules = {
    firstName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: "First name must be at least 2 characters and contain only letters"
    },
    lastName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: "Last name must be at least 2 characters and contain only letters"
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address"
    },
    phone: {
        required: false,
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: "Please enter a valid phone number"
    },
    zipCode: {
        required: false,
        pattern: /^\d{5}(-\d{4})?$/,
        message: "Please enter a valid ZIP code"
    }
};

// Navigation Menu Items
const menuItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'products', label: 'Products', icon: 'fas fa-shopping-bag' },
    { id: 'cart', label: 'Cart', icon: 'fas fa-shopping-cart' },
    { id: 'orders', label: 'Orders', icon: 'fas fa-list-alt' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-bar' },
    { id: 'components', label: 'Components', icon: 'fas fa-puzzle-piece' }
];

// Filter Options
const filterOptions = {
    categories: [
        { value: '', label: 'All Categories' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
        { value: 'home', label: 'Home' },
        { value: 'fitness', label: 'Fitness' },
        { value: 'appliances', label: 'Appliances' },
        { value: 'accessories', label: 'Accessories' }
    ],
    priceRanges: [
        { value: '', label: 'Any Price' },
        { value: '0-25', label: '$0 - $25' },
        { value: '25-50', label: '$25 - $50' },
        { value: '50-100', label: '$50 - $100' },
        { value: '100+', label: '$100+' }
    ]
};

// Component States for Testing
const componentStates = {
    buttons: [
        { type: 'primary', label: 'Primary Button', disabled: false },
        { type: 'secondary', label: 'Secondary Button', disabled: false },
        { type: 'success', label: 'Success Button', disabled: false },
        { type: 'danger', label: 'Danger Button', disabled: false },
        { type: 'warning', label: 'Warning Button', disabled: false },
        { type: 'info', label: 'Info Button', disabled: false },
        { type: 'primary', label: 'Disabled Button', disabled: true }
    ],
    alerts: [
        { type: 'success', message: 'Success! Your changes have been saved.', icon: 'fas fa-check-circle' },
        { type: 'warning', message: 'Warning! Please check your input.', icon: 'fas fa-exclamation-triangle' },
        { type: 'error', message: 'Error! Something went wrong.', icon: 'fas fa-times-circle' },
        { type: 'info', message: 'Info! Here\'s some additional information.', icon: 'fas fa-info-circle' }
    ]
};

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        userProfile,
        analyticsData,
        shoppingCart,
        currentUser,
        users,
        userOrders,
        promoBanners,
        validationRules,
        menuItems,
        filterOptions,
        componentStates
    };
}