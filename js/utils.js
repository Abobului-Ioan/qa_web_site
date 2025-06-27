// Utility Functions

// DOM Helpers
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Event Helpers
const on = (element, event, handler) => {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.addEventListener(event, handler);
    }
};

const off = (element, event, handler) => {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.removeEventListener(event, handler);
    }
};

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Format number
const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
};

// Generate stars for rating
const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Local Storage helpers
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }
};

// Animation helpers
const animate = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const fade = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = progress;
                requestAnimationFrame(fade);
            } else {
                element.style.opacity = '1';
            }
        };
        
        requestAnimationFrame(fade);
    },
    
    fadeOut: (element, duration = 300) => {
        const start = performance.now();
        const initialOpacity = parseFloat(element.style.opacity) || 1;
        
        const fade = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = initialOpacity * (1 - progress);
                requestAnimationFrame(fade);
            } else {
                element.style.opacity = '0';
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(fade);
    },
    
    slideUp: (element, duration = 300) => {
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        
        const start = performance.now();
        const initialHeight = element.scrollHeight;
        
        const slide = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.height = initialHeight * (1 - progress) + 'px';
                requestAnimationFrame(slide);
            } else {
                element.style.height = '0';
                element.style.display = 'none';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(slide);
    },
    
    slideDown: (element, duration = 300) => {
        element.style.display = 'block';
        element.style.height = '0';
        element.style.overflow = 'hidden';
        
        const targetHeight = element.scrollHeight;
        const start = performance.now();
        
        const slide = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.height = targetHeight * progress + 'px';
                requestAnimationFrame(slide);
            } else {
                element.style.height = '';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(slide);
    }
};

// Form validation helpers
const validate = {
    required: (value) => {
        return value && value.trim().length > 0;
    },
    
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    
    phone: (value) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/\s/g, ''));
    },
    
    minLength: (value, length) => {
        return value && value.length >= length;
    },
    
    maxLength: (value, length) => {
        return !value || value.length <= length;
    },
    
    pattern: (value, pattern) => {
        return pattern.test(value);
    },
    
    zipCode: (value) => {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        return zipRegex.test(value);
    }
};

// URL helpers
const url = {
    getParams: () => {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },
    
    setParam: (key, value) => {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    },
    
    removeParam: (key) => {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.pushState({}, '', url);
    }
};

// Date helpers
const dateUtils = {
    format: (date, format = 'MM/DD/YYYY') => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('MM', month)
            .replace('DD', day)
            .replace('YYYY', year);
    },
    
    isValid: (date) => {
        return date instanceof Date && !isNaN(date);
    },
    
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    
    diffDays: (date1, date2) => {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1 - date2) / oneDay));
    }
};

// Array helpers
const arrayUtils = {
    unique: (arr) => [...new Set(arr)],
    
    shuffle: (arr) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    chunk: (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },
    
    groupBy: (arr, key) => {
        return arr.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }
};

// Random helpers
const random = {
    number: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    choice: (arr) => arr[Math.floor(Math.random() * arr.length)],
    
    boolean: () => Math.random() < 0.5,
    
    string: (length = 10) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// Device detection
const device = {
    isMobile: () => window.innerWidth <= 768,
    isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: () => window.innerWidth > 1024,
    
    hasTouch: () => 'ontouchstart' in window,
    
    isIOS: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: () => /Android/.test(navigator.userAgent),
    
    getViewport: () => ({
        width: window.innerWidth,
        height: window.innerHeight
    })
};

// Performance helpers
const perf = {
    measure: (name, fn) => {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name}: ${end - start}ms`);
        return result;
    },
    
    debounceFrame: (fn) => {
        let ticking = false;
        return (...args) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    fn.apply(this, args);
                    ticking = false;
                });
                ticking = true;
            }
        };
    }
};

// Error handling
const errorHandler = {
    log: (error, context = '') => {
        console.error(`Error ${context}:`, error);
        
        // In a real app, you might want to send this to an error tracking service
        // trackError(error, context);
    },
    
    wrap: (fn, context = '') => {
        return (...args) => {
            try {
                return fn.apply(this, args);
            } catch (error) {
                errorHandler.log(error, context);
                throw error;
            }
        };
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.utils = {
        $, $$, on, off,
        formatCurrency, formatNumber, generateStars,
        debounce, throttle,
        storage, animate, validate, url, dateUtils, arrayUtils, random,
        device, perf, errorHandler
    };
}