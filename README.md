# E-commerce Demo Site for Cypress AI Testing

This is a feature-rich e-commerce demonstration site specifically designed for testing AI-enhanced Cypress visual testing and self-healing capabilities.

## Features

### 🛍️ Core E-commerce Functionality
- **Product Listing**: Dynamic product grid with filtering and pagination
- **Shopping Cart**: Animated cart with quantity controls and real-time updates
- **User Profile**: Form validation and data persistence
- **Analytics Dashboard**: Interactive charts and real-time stats
- **Component Library**: Comprehensive UI components for testing

### 🎯 Testing-Specific Features
- **Semantic HTML**: Proper structure for element detection
- **Data Attributes**: Comprehensive `data-testid` attributes
- **Dynamic Content**: Promotional banners and changing elements
- **State Management**: Local storage for cart and profile data
- **Animations**: CSS animations and transitions for visual testing
- **Responsive Design**: Mobile-friendly layout changes

## Pages

### 1. Home Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Animated elements (AOS library)

### 2. Products Page (`/products`)
- Product grid with images and details
- Category and price filtering
- Pagination controls
- Add to cart functionality

### 3. Shopping Cart (`/cart`)
- Cart items with quantity controls
- Price calculations
- Checkout process
- Empty cart state

### 4. User Profile (`/profile`)
- Form validation (real-time)
- Personal information fields
- Address information
- Preferences with checkboxes

### 5. Dashboard (`/dashboard`)
- Analytics cards with stats
- Interactive charts (Chart.js)
- Real-time data updates
- Responsive grid layout

### 6. Component Library (`/components`)
- Button variations
- Form elements
- Cards and alerts
- Loading states
- Various UI components

## Testing Scenarios

### Scenario 1: Visual Regression with Intelligence
- **Button Color Changes**: `testFunctions.changeButtonColors()`
- **Layout Rearrangement**: `testFunctions.rearrangeLayout()`
- **Dynamic Banners**: `testFunctions.addPromotionalBanner()`

### Scenario 2: Self-Healing Elements
- Multiple selector strategies (ID, class, data-testid, content)
- Semantic HTML structure
- Consistent naming patterns
- Fallback element detection

### Scenario 3: Combined Testing
- Complete UI redesigns
- Framework changes
- Component state variations
- Dynamic content updates

## Technical Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, Animations
- **Vanilla JavaScript**: ES6+ features, modular architecture
- **Chart.js**: Dashboard analytics
- **AOS**: Scroll animations
- **Font Awesome**: Icons

### Data Management
- **Local Storage**: Cart and profile persistence
- **JSON**: Sample data structure
- **State Management**: Reactive UI updates

## File Structure

```
qa_web_site/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Core styles and layout
│   ├── components.css     # Component-specific styles
│   └── animations.css     # Animation definitions
├── js/
│   ├── data.js           # Sample data and configuration
│   ├── utils.js          # Utility functions
│   ├── components.js     # Component creation functions
│   └── app.js            # Main application logic
└── README.md             # This file
```

## Key Testing Attributes

### Data Test IDs
Every interactive element includes `data-testid` attributes:
- `data-testid="product-card-{id}"`
- `data-testid="add-to-cart-{id}"`
- `data-testid="cart-item-{id}"`
- `data-testid="primary-button"`
- `data-testid="form-field-{name}"`

### Component States
- **Loading States**: Spinners, skeletons, disabled buttons
- **Error States**: Form validation, empty states
- **Success States**: Confirmations, completed actions
- **Interactive States**: Hover, focus, active states

## Usage

### Basic Setup
1. Open `index.html` in a web browser
2. Navigate through different pages
3. Interact with components
4. Test various scenarios

### For Cypress Testing
1. Use the comprehensive `data-testid` attributes
2. Test dynamic content changes
3. Verify visual regression scenarios
4. Implement self-healing selector strategies

### Testing Functions
Access testing functions via the browser console:
```javascript
// Change button colors
testFunctions.changeButtonColors();

// Add promotional banner
testFunctions.addPromotionalBanner();

// Rearrange layout
testFunctions.rearrangeLayout();

// Add items to cart
addToCart(1);

// Show notifications
showNotification('Test message', 'success');
```

## Responsive Design

The site is fully responsive with breakpoints:
- **Mobile**: `<= 768px`
- **Tablet**: `769px - 1024px`
- **Desktop**: `> 1024px`

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Features for AI Testing

### Visual Recognition
- **Consistent Styling**: Predictable color schemes and layouts
- **Clear Element Boundaries**: Proper spacing and contrast
- **Semantic Structure**: Logical HTML hierarchy

### Self-Healing Support
- **Multiple Selector Strategies**: ID, class, data attributes, content
- **Descriptive Naming**: Clear, consistent naming conventions
- **Fallback Elements**: Alternative ways to identify components

### Dynamic Content
- **Promotional Banners**: Appear/disappear dynamically
- **Loading States**: Simulated async operations
- **Real-time Updates**: Cart counts, stats, notifications

## Customization

### Adding New Products
Edit `js/data.js` and add to the `products` array:
```javascript
{
    id: 13,
    title: "New Product",
    category: "electronics",
    price: 199.99,
    image: "https://via.placeholder.com/300x200",
    rating: 4.5,
    reviews: 100,
    description: "Product description"
}
```

### Modifying Styles
- **Colors**: Update CSS custom properties in `styles/main.css`
- **Layout**: Modify grid and flexbox properties
- **Animations**: Adjust timing and effects in `styles/animations.css`

### Adding Components
Create new components in `js/components.js`:
```javascript
function createNewComponent(data) {
    return `<div class="new-component" data-testid="new-component">${data}</div>`;
}
```

## License

This project is created for educational and testing purposes. Feel free to use and modify as needed for your Cypress AI testing framework.