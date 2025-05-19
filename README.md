# ShopEase E-commerce Website

A responsive e-commerce website built with HTML, CSS, and JavaScript that offers a modern shopping experience with product listings, cart functionality, and a responsive design.

## Features

- **Responsive Design:** Works on all devices (desktop, tablet, mobile)
- **Product Catalog:** Display of products with details like price, discount, and ratings
- **Shopping Cart:** Add products to cart, change quantities, and remove items
- **Category Browsing:** Browse products by categories
- **Special Offers:** Countdown timer for special deals
- **Customer Testimonials:** Display customer feedback
- **Newsletter Subscription:** Form to capture email addresses

## Project Structure

```
ecommerce-shop/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Styles for the website
├── js/
│   ├── products.js     # Product data
│   └── main.js         # Main JavaScript functionality
└── images/             # Directory for product and website images
```

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your browser to view the website

## Customization

### Adding Products

To add more products, edit the `products.js` file and add new product objects to the array:

```javascript
{
    id: [unique_id],
    title: "Product Name",
    price: [price],
    originalPrice: [original_price],
    discount: "[discount_percentage]%",
    category: "[category_name]",
    image: "images/product[number].jpg",
    rating: [rating_value],
    reviews: [number_of_reviews],
    description: "Product description."
}
```

### Changing Colors and Theme

To change the color scheme, edit the CSS variables in the `:root` selector in `styles.css`:

```css
:root {
    --primary-color: #4a6de5;
    --secondary-color: #ff7f50;
    --dark-color: #333;
    --light-color: #f4f4f4;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --max-width: 1200px;
}
```

### Adding Images

Replace the placeholder images in the `images` folder with your own:

1. Category images should be named: `electronics.jpg`, `fashion.jpg`, etc.
2. Product images should be named: `product1.jpg`, `product2.jpg`, etc.
3. Background images: `hero-bg.jpg` and `offer-bg.jpg`

## Browser Compatibility

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

- FontAwesome for icons
- Placeholder images from placeholder.com 