// Component Functions

// Product Card Component
function createProductCard(product) {
    return `
        <div class="product-card hover-lift" data-testid="product-card-${product.id}" data-product-id="${product.id}" onclick="showProductDetail(${product.id})">
            <img src="${product.image}" alt="${product.title}" class="product-image" data-testid="product-image-${product.id}">
            <div class="product-info">
                <h3 class="product-title" data-testid="product-title-${product.id}">${product.title}</h3>
                <p class="product-category" data-testid="product-category-${product.id}">${product.category}</p>
                <div class="product-rating" data-testid="product-rating-${product.id}">
                    <div class="stars">${utils.generateStars(product.rating)}</div>
                    <span class="rating-text">(${product.reviews})</span>
                </div>
                <p class="product-price" data-testid="product-price-${product.id}">${utils.formatCurrency(product.price)}</p>
                <button class="add-to-cart-btn" data-testid="add-to-cart-${product.id}" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Cart Item Component
function createCartItem(item) {
    const product = products.find(p => p.id === item.productId);
    if (!product) return '';
    
    return `
        <div class="cart-item cart-item-enter" data-testid="cart-item-${item.productId}" data-item-id="${item.productId}">
            <img src="${product.image}" alt="${product.title}" class="item-image" data-testid="cart-item-image-${item.productId}">
            <div class="item-details">
                <h4 class="item-title" data-testid="cart-item-title-${item.productId}">${product.title}</h4>
                <p class="item-category" data-testid="cart-item-category-${item.productId}">${product.category}</p>
                <p class="item-price" data-testid="cart-item-price-${item.productId}">${utils.formatCurrency(product.price)}</p>
            </div>
            <div class="quantity-controls" data-testid="quantity-controls-${item.productId}">
                <button class="quantity-btn" onclick="updateQuantity(${item.productId}, ${item.quantity - 1})" data-testid="decrease-qty-${item.productId}">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                       onchange="updateQuantity(${item.productId}, this.value)" data-testid="quantity-input-${item.productId}">
                <button class="quantity-btn" onclick="updateQuantity(${item.productId}, ${item.quantity + 1})" data-testid="increase-qty-${item.productId}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.productId})" data-testid="remove-item-${item.productId}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// Notification Component
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification alert ${type}`;
    notification.setAttribute('data-testid', 'notification');
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()" data-testid="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Position notification
    notification.style.position = 'fixed';
    notification.style.top = '150px';
    notification.style.right = '30px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            utils.animate.fadeOut(notification, 300);
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
    
    return notification;
}

// Modal Component
function showModal(title, content, actions = []) {
    const modal = utils.$('#modal');
    const modalTitle = utils.$('.modal-title');
    const modalBody = utils.$('.modal-body');
    const modalFooter = utils.$('.modal-footer');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    
    // Clear existing actions and add new ones
    modalFooter.innerHTML = '';
    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = `btn ${action.type || 'secondary'}`;
        button.textContent = action.label;
        button.setAttribute('data-testid', `modal-${action.label.toLowerCase().replace(/\s+/g, '-')}`);
        button.onclick = action.handler || (() => hideModal());
        modalFooter.appendChild(button);
    });
    
    modal.classList.add('active');
    modal.setAttribute('data-testid', 'modal-active');
    
    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            hideModal();
        }
    };
}

function hideModal() {
    const modal = utils.$('#modal');
    modal.classList.remove('active');
    modal.removeAttribute('data-testid');
}

// Loading Component
function showLoading(element, text = 'Loading...') {
    const loadingHtml = `
        <div class="loading-container" data-testid="loading-indicator">
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
            <p>${text}</p>
        </div>
    `;
    
    element.innerHTML = loadingHtml;
    element.classList.add('loading-state');
}

function hideLoading(element) {
    element.classList.remove('loading-state');
    const loadingContainer = element.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.remove();
    }
}

// Search Component
function createSearchBox(placeholder = 'Search...', onSearch = () => {}) {
    return `
        <div class="search-box" data-testid="search-box">
            <input type="text" class="search-input" placeholder="${placeholder}" 
                   oninput="debounce(${onSearch.name}, 300)(this.value)" data-testid="search-input">
            <i class="fas fa-search search-icon" data-testid="search-icon"></i>
        </div>
    `;
}

// Pagination Component
function createPagination(currentPage, totalPages, onPageChange) {
    let paginationHtml = `
        <div class="pagination-container" data-testid="pagination-container">
            <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                    onclick="${currentPage > 1 ? `${onPageChange.name}(${currentPage - 1})` : ''}" 
                    data-testid="pagination-prev" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Previous
            </button>
    `;
    
    // Add page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="${onPageChange.name}(${i})" data-testid="pagination-page-${i}">
                ${i}
            </button>
        `;
    }
    
    paginationHtml += `
            <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="${currentPage < totalPages ? `${onPageChange.name}(${currentPage + 1})` : ''}" 
                    data-testid="pagination-next" ${currentPage === totalPages ? 'disabled' : ''}>
                Next <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    return paginationHtml;
}

// Breadcrumb Component
function createBreadcrumb(items) {
    let breadcrumbHtml = '<nav class="breadcrumb" data-testid="breadcrumb">';
    
    items.forEach((item, index) => {
        if (index > 0) {
            breadcrumbHtml += '<span class="breadcrumb-separator">/</span>';
        }
        
        const isLast = index === items.length - 1;
        breadcrumbHtml += `
            <a href="${item.url || '#'}" class="breadcrumb-item ${isLast ? 'active' : ''}" 
               data-testid="breadcrumb-${item.label.toLowerCase().replace(/\s+/g, '-')}">
                ${item.label}
            </a>
        `;
    });
    
    breadcrumbHtml += '</nav>';
    return breadcrumbHtml;
}

// Stats Card Component
function createStatsCard(title, value, change, icon, testId) {
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeIcon = change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    
    return `
        <div class="stat-card hover-lift" data-testid="${testId}">
            <div class="stat-icon">
                <i class="${icon}"></i>
            </div>
            <div class="stat-content">
                <h3>${title}</h3>
                <p class="stat-value" data-testid="${testId}-value">${value}</p>
                <span class="stat-change ${changeClass}" data-testid="${testId}-change">
                    <i class="${changeIcon}"></i>
                    ${Math.abs(change)}%
                </span>
            </div>
        </div>
    `;
}

// Alert Component
function createAlert(type, message, dismissible = true) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.setAttribute('data-testid', `alert-${type}`);
    
    alert.innerHTML = `
        <i class="${icons[type]}"></i>
        <span data-testid="alert-message">${message}</span>
        ${dismissible ? '<button class="alert-close" onclick="this.parentElement.remove()" data-testid="alert-close"><i class="fas fa-times"></i></button>' : ''}
    `;
    
    return alert;
}

// Progress Bar Component
function createProgressBar(percentage, label = '', animated = false) {
    return `
        <div class="progress-container" data-testid="progress-container">
            ${label ? `<label class="progress-label" data-testid="progress-label">${label}</label>` : ''}
            <div class="progress-bar ${animated ? 'progress-bar-animated' : ''}" data-testid="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%" data-testid="progress-fill"></div>
            </div>
            <span class="progress-text" data-testid="progress-text">${percentage}%</span>
        </div>
    `;
}

// Badge Component
function createBadge(text, type = 'primary') {
    return `<span class="badge ${type}" data-testid="badge-${type}">${text}</span>`;
}

// Avatar Component
function createAvatar(name, imageUrl = null, size = 'medium') {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return `
        <div class="avatar ${size}" data-testid="avatar">
            ${imageUrl ? 
                `<img src="${imageUrl}" alt="${name}" data-testid="avatar-image">` : 
                `<span data-testid="avatar-initials">${initials}</span>`
            }
        </div>
    `;
}

// Rating Component
function createRating(rating, interactive = false, onRate = null) {
    let ratingHtml = '<div class="rating" data-testid="rating">';
    
    for (let i = 1; i <= 5; i++) {
        const filled = i <= rating ? 'filled' : '';
        const clickHandler = interactive && onRate ? `onclick="${onRate.name}(${i})"` : '';
        
        ratingHtml += `
            <i class="fas fa-star star ${filled}" 
               data-testid="star-${i}" 
               ${clickHandler}></i>
        `;
    }
    
    ratingHtml += '</div>';
    return ratingHtml;
}

// Toggle Switch Component
function createToggleSwitch(id, checked = false, onChange = null) {
    const changeHandler = onChange ? `onchange="${onChange.name}(this.checked)"` : '';
    
    return `
        <label class="toggle-switch" data-testid="toggle-switch-${id}">
            <input type="checkbox" ${checked ? 'checked' : ''} ${changeHandler} data-testid="toggle-input-${id}">
            <span class="slider" data-testid="toggle-slider-${id}"></span>
        </label>
    `;
}

// Tooltip Component
function addTooltip(element, text) {
    element.setAttribute('data-tooltip', text);
    element.classList.add('tooltip');
}

// Dropdown Component
function createDropdown(options, placeholder = 'Select option', onSelect = null) {
    let dropdownHtml = `
        <div class="dropdown" data-testid="dropdown">
            <button class="dropdown-toggle" onclick="toggleDropdown(this)" data-testid="dropdown-toggle">
                <span data-testid="dropdown-selected">${placeholder}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="dropdown-menu" data-testid="dropdown-menu">
    `;
    
    options.forEach((option, index) => {
        const clickHandler = onSelect ? `onclick="${onSelect.name}('${option.value}', this)"` : '';
        dropdownHtml += `
            <a href="#" class="dropdown-item" data-testid="dropdown-option-${index}" 
               data-value="${option.value}" ${clickHandler}>
                ${option.label}
            </a>
        `;
    });
    
    dropdownHtml += `
            </div>
        </div>
    `;
    
    return dropdownHtml;
}

// Tab Component
function createTabs(tabs, activeTab = 0) {
    let tabsHtml = `
        <div class="tabs" data-testid="tabs">
            <div class="tab-list" data-testid="tab-list">
    `;
    
    tabs.forEach((tab, index) => {
        const active = index === activeTab ? 'active' : '';
        tabsHtml += `
            <button class="tab-button ${active}" onclick="switchTab(${index})" 
                    data-testid="tab-button-${index}">
                ${tab.label}
            </button>
        `;
    });
    
    tabsHtml += `
            </div>
            <div class="tab-content" data-testid="tab-content">
    `;
    
    tabs.forEach((tab, index) => {
        const active = index === activeTab ? 'active' : '';
        tabsHtml += `
            <div class="tab-panel ${active}" data-testid="tab-panel-${index}">
                ${tab.content}
            </div>
        `;
    });
    
    tabsHtml += `
            </div>
        </div>
    `;
    
    return tabsHtml;
}

// Form Field Component
function createFormField(field) {
    const { type, id, label, placeholder, required, options, value, testId } = field;
    
    let fieldHtml = `
        <div class="form-group" data-testid="form-group-${testId || id}">
            <label for="${id}">${label}${required ? ' *' : ''}</label>
    `;
    
    switch (type) {
        case 'select':
            fieldHtml += `<select id="${id}" name="${id}" ${required ? 'required' : ''} data-testid="${testId || id}">`;
            if (placeholder) {
                fieldHtml += `<option value="">${placeholder}</option>`;
            }
            options.forEach(option => {
                const selected = option.value === value ? 'selected' : '';
                fieldHtml += `<option value="${option.value}" ${selected}>${option.label}</option>`;
            });
            fieldHtml += '</select>';
            break;
            
        case 'textarea':
            fieldHtml += `<textarea id="${id}" name="${id}" placeholder="${placeholder || ''}" 
                         ${required ? 'required' : ''} data-testid="${testId || id}">${value || ''}</textarea>`;
            break;
            
        case 'checkbox':
            fieldHtml += `
                <label class="checkbox-label">
                    <input type="checkbox" id="${id}" name="${id}" ${value ? 'checked' : ''} data-testid="${testId || id}">
                    <span class="checkmark"></span>
                    ${label}
                </label>
            `;
            break;
            
        default:
            fieldHtml += `<input type="${type}" id="${id}" name="${id}" placeholder="${placeholder || ''}" 
                         value="${value || ''}" ${required ? 'required' : ''} data-testid="${testId || id}">`;
    }
    
    fieldHtml += `
            <span class="error-message" id="${id}Error" data-testid="error-${testId || id}"></span>
        </div>
    `;
    
    return fieldHtml;
}

// Product Detail Component
function createProductDetail(product) {
    return `
        <button class="back-btn" onclick="showPage('products')" data-testid="back-to-products">
            <i class="fas fa-arrow-left"></i>
            Back to Products
        </button>
        <div class="product-detail-content" data-testid="product-detail-content">
            <div class="product-detail-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-detail-image" data-testid="product-detail-image">
            </div>
            <div class="product-detail-info">
                <p class="product-detail-category" data-testid="product-detail-category">${product.category}</p>
                <h1 class="product-detail-title" data-testid="product-detail-title">${product.title}</h1>
                <div class="product-detail-rating" data-testid="product-detail-rating">
                    <div class="stars">${utils.generateStars(product.rating)}</div>
                    <span class="rating-text">(${product.reviews} reviews)</span>
                </div>
                <p class="product-detail-price" data-testid="product-detail-price">${utils.formatCurrency(product.price)}</p>
                <p class="product-detail-description" data-testid="product-detail-description">${product.description}</p>
                
                <div class="quantity-selector" data-testid="quantity-selector">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" value="1" min="1" max="10" data-testid="quantity-input">
                </div>
                
                <div class="product-detail-actions" data-testid="product-detail-actions">
                    <button class="btn primary" onclick="addToCartFromDetail(${product.id})" data-testid="add-to-cart-detail">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="btn secondary" onclick="addToWishlist(${product.id})" data-testid="add-to-wishlist">
                        <i class="fas fa-heart"></i>
                        Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Order Card Component
function createOrderCard(order) {
    const statusClass = order.status.toLowerCase();
    const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    
    return `
        <div class="order-card" data-testid="order-card-${order.id}">
            <div class="order-header">
                <div>
                    <div class="order-number" data-testid="order-number-${order.id}">Order ${order.id}</div>
                    <div class="order-date" data-testid="order-date-${order.id}">${utils.dateUtils.format(order.date)}</div>
                </div>
                <div class="order-status ${statusClass}" data-testid="order-status-${order.id}">${statusText}</div>
            </div>
            <div class="order-items" data-testid="order-items-${order.id}">
                ${order.items.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return product ? `
                        <div class="order-item" data-testid="order-item-${item.productId}">
                            <img src="${product.image}" alt="${product.title}" class="order-item-image">
                            <div class="order-item-details">
                                <div class="order-item-title">${product.title}</div>
                                <div class="order-item-quantity">Qty: ${item.quantity}</div>
                            </div>
                            <div class="order-item-price">${utils.formatCurrency(item.price)}</div>
                        </div>
                    ` : '';
                }).join('')}
            </div>
            <div class="order-total" data-testid="order-total-${order.id}">
                <span>Total: ${utils.formatCurrency(order.total)}</span>
            </div>
        </div>
    `;
}

// Export functions for global use
window.components = {
    createProductCard,
    createCartItem,
    createProductDetail,
    createOrderCard,
    showNotification,
    showModal,
    hideModal,
    showLoading,
    hideLoading,
    createSearchBox,
    createPagination,
    createBreadcrumb,
    createStatsCard,
    createAlert,
    createProgressBar,
    createBadge,
    createAvatar,
    createRating,
    createToggleSwitch,
    addTooltip,
    createDropdown,
    createTabs,
    createFormField
};