export const templates = [
  {
    id: "grocery",
    name: "Grocery & Retail Shop",
    icon: "🛒",
    description: "Sleek, modern layout for a local grocery store or retail boutique with WhatsApp ordering.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}}</title>
</head>
<body>
    <header class="header">
        <div class="header-container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}} Logo" class="logo">
            <div class="brand">
                <h1>{{BUSINESS_NAME}}</h1>
                <p>Fresh Essentials Delivered to Your Door</p>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h2>Order Fresh & Quality Products Directly on WhatsApp!</h2>
            <p>Select your items below and send your list instantly to us.</p>
            <a href="https://wa.me/{{WHATSAPP_NUMBER}}?text=Hi%20{{BUSINESS_NAME}},%20I%20want%20to%20place%20an%20order." class="cta-btn">💬 Chat with Us</a>
        </div>
    </section>

    <main class="container">
        <h2>Our Popular Categories</h2>
        <div class="categories">
            <div class="category-card">
                <span class="category-icon">🥛</span>
                <h3>Dairy & Bread</h3>
            </div>
            <div class="category-card">
                <span class="category-icon">🍎</span>
                <h3>Fresh Fruits</h3>
            </div>
            <div class="category-card">
                <span class="category-icon">🥦</span>
                <h3>Vegetables</h3>
            </div>
            <div class="category-card">
                <span class="category-icon">🥫</span>
                <h3>Pantry Goods</h3>
            </div>
        </div>

        <h2 style="margin-top: 40px;">Featured Products</h2>
        <div class="products-grid">
            <div class="product-card">
                <div class="product-badge">Fresh</div>
                <h3>Organic Tomatoes (1kg)</h3>
                <div class="price">₹120</div>
                <button class="order-item-btn" onclick="orderItem('Organic Tomatoes (1kg)')">🛒 Order on WhatsApp</button>
            </div>
            <div class="product-card">
                <div class="product-badge">New</div>
                <h3>Fresh Farm Milk (1L)</h3>
                <div class="price">₹70</div>
                <button class="order-item-btn" onclick="orderItem('Fresh Farm Milk (1L)')">🛒 Order on WhatsApp</button>
            </div>
            <div class="product-card">
                <div class="product-badge">Fresh</div>
                <h3>Royal Gala Apples (1kg)</h3>
                <div class="price">₹180</div>
                <button class="order-item-btn" onclick="orderItem('Royal Gala Apples (1kg)')">🛒 Order on WhatsApp</button>
            </div>
            <div class="product-card">
                <div class="product-badge">Organic</div>
                <h3>Whole Wheat Bread</h3>
                <div class="price">₹50</div>
                <button class="order-item-btn" onclick="orderItem('Whole Wheat Bread')">🛒 Order on WhatsApp</button>
            </div>
        </div>
    </main>

    <footer class="footer">
        <p><strong>Visit Us:</strong> {{ADDRESS}}</p>
        <p><strong>Contact:</strong> {{PHONE}}</p>
        <p>© 2026 {{BUSINESS_NAME}}. Powered by ShopBuilder.</p>
    </footer>
</body>
</html>`,
    css: `body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #f8fafc;
    color: #0f172a;
}

.header {
    background-color: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 16px 24px;
    position: sticky;
    top: 0;
    z-index: 10;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
}

.logo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #10b981;
}

.brand h1 {
    font-size: 20px;
    margin: 0 0 2px 0;
    font-weight: 800;
}

.brand p {
    margin: 0;
    font-size: 13px;
    color: #64748b;
}

.hero {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    text-align: center;
    padding: 60px 20px;
}

.hero-content {
    max-width: 600px;
    margin: 0 auto;
}

.hero-content h2 {
    font-size: 32px;
    margin-bottom: 12px;
    line-height: 1.2;
}

.hero-content p {
    font-size: 16px;
    margin-bottom: 24px;
    opacity: 0.9;
}

.cta-btn {
    display: inline-block;
    background: #0f172a;
    color: white;
    text-decoration: none;
    padding: 12px 28px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 16px;
    transition: transform 0.2s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.15);
}

.cta-btn:hover {
    transform: scale(1.03);
}

.container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 24px;
}

h2 {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 20px;
}

.categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
}

.category-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    transition: transform 0.2s;
}

.category-card:hover {
    transform: translateY(-2px);
    border-color: #10b981;
}

.category-icon {
    font-size: 36px;
    display: block;
    margin-bottom: 8px;
}

.category-card h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.product-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
}

.product-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 700;
    border-radius: 4px;
}

.product-card h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 16px 0 8px 0;
}

.price {
    font-size: 20px;
    font-weight: 800;
    color: #10b981;
    margin-bottom: 16px;
}

.order-item-btn {
    background: #0f172a;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    margin-top: auto;
    transition: background 0.2s;
}

.order-item-btn:hover {
    background: #1e293b;
}

.footer {
    background: #0f172a;
    color: #94a3b8;
    text-align: center;
    padding: 40px 20px;
    margin-top: 80px;
    font-size: 14px;
}

.footer strong {
    color: white;
}

.footer p {
    margin: 6px 0;
}`,
    js: `function orderItem(itemName) {
    const businessName = "{{BUSINESS_NAME}}";
    const phone = "{{WHATSAPP_NUMBER}}";
    const text = encodeURIComponent("Hi " + businessName + ", I would like to order: " + itemName + ". Please let me know the availability and payment details!");
    const url = "https://wa.me/" + phone + "?text=" + text;
    window.open(url, "_blank");
}`
  },
  {
    id: "salon",
    name: "Hair Salon & Spa",
    icon: "💇‍♀️",
    description: "Premium, luxurious layout for hair salons, barber shops, or wellness spas.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}}</title>
</head>
<body>
    <header class="header">
        <div class="header-container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}} Logo" class="logo">
            <div class="brand">
                <h1>{{BUSINESS_NAME}}</h1>
                <p>Styling & Elegance Defined</p>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <h2>Experience Premium Grooming Services</h2>
            <p>Book your transformation appointment via WhatsApp instantly.</p>
            <a href="https://wa.me/{{WHATSAPP_NUMBER}}?text=Hi%20{{BUSINESS_NAME}},%20I%20want%20to%20book%20a%20salon%20appointment." class="cta-btn">📅 Book Appointment</a>
        </div>
    </section>

    <main class="container">
        <h2 class="section-title">Our Signature Services</h2>
        <div class="services-list">
            <div class="service-item">
                <div class="service-details">
                    <h3>Premium Haircut & Styling</h3>
                    <p>Includes wash, scalp massage, tailored cut, and final blow-dry style.</p>
                </div>
                <div class="service-price">₹499</div>
                <button class="book-service-btn" onclick="bookService('Premium Haircut & Styling', '499')">Book</button>
            </div>
            <div class="service-item">
                <div class="service-details">
                    <h3>Hair Coloring & Balayage</h3>
                    <p>Custom shade selection with global nourishing color shield.</p>
                </div>
                <div class="service-price">₹1,899</div>
                <button class="book-service-btn" onclick="bookService('Hair Coloring & Balayage', '1,899')">Book</button>
            </div>
            <div class="service-item">
                <div class="service-details">
                    <h3>Royal Beard Grooming</h3>
                    <p>Hot towel treatment, custom trimmer shave, and beard oil massage.</p>
                </div>
                <div class="service-price">₹299</div>
                <button class="book-service-btn" onclick="bookService('Royal Beard Grooming', '299')">Book</button>
            </div>
            <div class="service-item">
                <div class="service-details">
                    <h3>Nourishing Spa & Facial</h3>
                    <p>Organic fruit-extract scrub, deep hydration pack, and cooling steam.</p>
                </div>
                <div class="service-price">₹999</div>
                <button class="book-service-btn" onclick="bookService('Nourishing Spa & Facial', '999')">Book</button>
            </div>
        </div>
    </main>

    <footer class="footer">
        <p><strong>Address:</strong> {{ADDRESS}}</p>
        <p><strong>Phone:</strong> {{PHONE}}</p>
        <p>© 2026 {{BUSINESS_NAME}}. Built with style.</p>
    </footer>
</body>
</html>`,
    css: `body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #0f172a;
    color: #f8fafc;
}

.header {
    background-color: #1e293b;
    border-bottom: 1px solid #334155;
    padding: 16px 24px;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
}

.logo {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ec4899;
}

.brand h1 {
    font-size: 20px;
    margin: 0 0 2px 0;
    font-weight: 800;
    letter-spacing: -0.5px;
}

.brand p {
    margin: 0;
    font-size: 13px;
    color: #94a3b8;
}

.hero {
    position: relative;
    background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
    text-align: center;
    padding: 90px 20px;
    overflow: hidden;
}

.hero-content {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
    z-index: 2;
}

.hero-content h2 {
    font-size: 36px;
    margin-bottom: 12px;
    font-weight: 800;
    background: linear-gradient(to right, #f472b6, #db2777);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-content p {
    font-size: 16px;
    margin-bottom: 28px;
    color: #cbd5e1;
}

.cta-btn {
    display: inline-block;
    background: linear-gradient(to right, #ec4899, #db2777);
    color: white;
    text-decoration: none;
    padding: 14px 32px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
    border: none;
}

.cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
}

.container {
    max-width: 800px;
    margin: 60px auto;
    padding: 0 24px;
}

.section-title {
    text-align: center;
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 40px;
    position: relative;
}

.section-title::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: #ec4899;
    margin: 12px auto 0 auto;
    border-radius: 2px;
}

.services-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.service-item {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    transition: border-color 0.2s;
}

.service-item:hover {
    border-color: #ec4899;
}

.service-details {
    flex-grow: 1;
}

.service-details h3 {
    margin: 0 0 6px 0;
    font-size: 18px;
    font-weight: 700;
}

.service-details p {
    margin: 0;
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.4;
}

.service-price {
    font-size: 22px;
    font-weight: 800;
    color: #ec4899;
}

.book-service-btn {
    background: transparent;
    color: #f8fafc;
    border: 2px solid #ec4899;
    border-radius: 20px;
    padding: 8px 20px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.book-service-btn:hover {
    background: #ec4899;
    color: white;
}

.footer {
    background: #0f172a;
    border-top: 1px solid #1e293b;
    color: #64748b;
    text-align: center;
    padding: 40px 20px;
    margin-top: 100px;
    font-size: 14px;
}

.footer strong {
    color: #cbd5e1;
}

.footer p {
    margin: 6px 0;
}`,
    js: `function bookService(serviceName, price) {
    const businessName = "{{BUSINESS_NAME}}";
    const phone = "{{WHATSAPP_NUMBER}}";
    const text = encodeURIComponent("Hi " + businessName + ", I would like to book the service: " + serviceName + " (Cost: ₹" + price + "). Please let me know when slots are available!");
    const url = "https://wa.me/" + phone + "?text=" + text;
    window.open(url, "_blank");
}`
  },
  {
    id: "restaurant",
    name: "Restaurant Menu & Cafe",
    icon: "🍔",
    description: "Vibrant and warm layout featuring a filterable food menu with instant order placements.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}}</title>
</head>
<body>
    <header class="header">
        <div class="header-container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}} Logo" class="logo">
            <div class="brand">
                <h1>{{BUSINESS_NAME}}</h1>
                <p>Taste the Joy of Exquisite Cuisine</p>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h2>Hungry? Order Online Instantly!</h2>
            <p>Browse our menu below, select your favorites, and checkout directly on WhatsApp.</p>
        </div>
    </section>

    <main class="container">
        <div class="filters">
            <button class="filter-btn active" onclick="filterMenu('all', this)">All Items</button>
            <button class="filter-btn" onclick="filterMenu('burger', this)">Burgers</button>
            <button class="filter-btn" onclick="filterMenu('sides', this)">Sides & Snacks</button>
            <button class="filter-btn" onclick="filterMenu('drinks', this)">Beverages</button>
        </div>

        <div class="menu-grid">
            <div class="menu-card" data-category="burger">
                <span class="food-emoji">🍔</span>
                <h3>Classic Cheese Burger</h3>
                <p>Juicy flame-grilled patty, cheddar cheese, fresh lettuce, and house sauce.</p>
                <div class="price-row">
                    <span class="price">₹189</span>
                    <button class="add-order-btn" onclick="orderFood('Classic Cheese Burger')">Order</button>
                </div>
            </div>
            <div class="menu-card" data-category="burger">
                <span class="food-emoji">🍗</span>
                <h3>Crispy Chicken Burger</h3>
                <p>Deep-fried breaded breast file, spicy mayonnaise, and pickled onions.</p>
                <div class="price-row">
                    <span class="price">₹219</span>
                    <button class="add-order-btn" onclick="orderFood('Crispy Chicken Burger')">Order</button>
                </div>
            </div>
            <div class="menu-card" data-category="sides">
                <span class="food-emoji">🍟</span>
                <h3>Peri-Peri French Fries</h3>
                <p>Golden salt-dusted potato fries tossed with hot african peri-peri spice.</p>
                <div class="price-row">
                    <span class="price">₹99</span>
                    <button class="add-order-btn" onclick="orderFood('Peri-Peri French Fries')">Order</button>
                </div>
            </div>
            <div class="menu-card" data-category="drinks">
                <span class="food-emoji">🥤</span>
                <h3>Cold Coffee Frappé</h3>
                <p>Rich espresso blended with milk, crushed ice, and sweet chocolate syrup.</p>
                <div class="price-row">
                    <span class="price">₹129</span>
                    <button class="add-order-btn" onclick="orderFood('Cold Coffee Frappé')">Order</button>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
        <p><strong>Address:</strong> {{ADDRESS}}</p>
        <p><strong>Contact Us:</strong> {{PHONE}}</p>
        <p>© 2026 {{BUSINESS_NAME}}. Freshly cooked daily.</p>
    </footer>
</body>
</html>`,
    css: `body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #fffbeb;
    color: #451a03;
}

.header {
    background-color: #ffffff;
    border-bottom: 2px solid #fcd34d;
    padding: 16px 24px;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
}

.logo {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid #d97706;
}

.brand h1 {
    font-size: 22px;
    margin: 0 0 2px 0;
    font-weight: 900;
}

.brand p {
    margin: 0;
    font-size: 13px;
    color: #b45309;
}

.hero {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    color: white;
    text-align: center;
    padding: 60px 20px;
}

.hero h2 {
    font-size: 32px;
    margin: 0 0 8px 0;
    font-weight: 800;
}

.hero p {
    margin: 0;
    font-size: 16px;
    opacity: 0.95;
}

.container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 24px;
}

.filters {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 35px;
    flex-wrap: wrap;
}

.filter-btn {
    background: #ffffff;
    border: 1px solid #fcd34d;
    color: #78350f;
    padding: 10px 20px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-btn:hover, .filter-btn.active {
    background: #d97706;
    color: white;
    border-color: #d97706;
}

.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

.menu-card {
    background: white;
    border: 1px solid #fef3c7;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(69, 26, 3, 0.02);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
}

.menu-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px rgba(69, 26, 3, 0.05);
}

.food-emoji {
    font-size: 40px;
    display: block;
    margin-bottom: 12px;
}

.menu-card h3 {
    font-size: 18px;
    margin: 0 0 6px 0;
    font-weight: 800;
}

.menu-card p {
    font-size: 13px;
    color: #78350f;
    line-height: 1.4;
    margin: 0 0 16px 0;
    flex-grow: 1;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.price {
    font-size: 20px;
    font-weight: 900;
    color: #d97706;
}

.add-order-btn {
    background: #d97706;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 8px 18px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
}

.add-order-btn:hover {
    background: #b45309;
}

.footer {
    background: #451a03;
    color: #fef3c7;
    text-align: center;
    padding: 40px 20px;
    margin-top: 100px;
    font-size: 14px;
}

.footer strong {
    color: #fcd34d;
}

.footer p {
    margin: 6px 0;
    opacity: 0.9;
}`,
    js: `function filterMenu(category, btn) {
    // Update filter active button styling
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter cards
    document.querySelectorAll('.menu-card').forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function orderFood(itemName) {
    const businessName = "{{BUSINESS_NAME}}";
    const phone = "{{WHATSAPP_NUMBER}}";
    const text = encodeURIComponent("Hi " + businessName + ", I'd like to order " + itemName + " from the menu. Please confirm and let me know the preparation time.");
    const url = "https://wa.me/" + phone + "?text=" + text;
    window.open(url, "_blank");
}`
  }
];
