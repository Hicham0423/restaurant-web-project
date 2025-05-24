// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    });

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuCategories = document.querySelectorAll('.menu-category');

    if (searchBtn && searchOverlay) {
        // Function to perform search
        function performSearch(searchTerm) {
            searchTerm = searchTerm.toLowerCase().trim();
            // If search is empty, show all items and all categories
            if (!searchTerm) {
                menuItems.forEach(item => item.style.display = 'block');
                menuCategories.forEach(cat => cat.style.display = 'block');
                const noResultsMsg = document.getElementById('noResultsMsg');
                if (noResultsMsg) noResultsMsg.remove();
                return;
            }

            let foundItems = false;
            // Hide all categories initially
            menuCategories.forEach(cat => cat.style.display = 'none');

            menuItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                const category = item.closest('.menu-category').querySelector('h2').textContent.toLowerCase();
                // Check if the search term matches title, description, or category
                if (title.includes(searchTerm) || 
                    description.includes(searchTerm) || 
                    category.includes(searchTerm)) {
                    item.style.display = 'block';
                    // Show the parent category if at least one item matches
                    item.closest('.menu-category').style.display = 'block';
                    foundItems = true;
                } else {
                    item.style.display = 'none';
                }
            });

            // Show message if no items found
            const noResultsMsg = document.getElementById('noResultsMsg');
            if (!foundItems) {
                if (!noResultsMsg) {
                    const msg = document.createElement('div');
                    msg.id = 'noResultsMsg';
                    msg.className = 'no-results-message';
                    msg.textContent = 'No dishes found matching your search.';
                    document.querySelector('.menu-section .container').appendChild(msg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }

        // Search button click
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
        });

        // Close search
        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            menuItems.forEach(item => item.style.display = 'block');
            menuCategories.forEach(cat => cat.style.display = 'block');
            const noResultsMsg = document.getElementById('noResultsMsg');
            if (noResultsMsg) noResultsMsg.remove();
        });

        // Search on input change
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
                searchOverlay.classList.remove('active');
            }
        });

        // Close search when clicking outside
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
                menuItems.forEach(item => item.style.display = 'block');
                menuCategories.forEach(cat => cat.style.display = 'block');
                const noResultsMsg = document.getElementById('noResultsMsg');
                if (noResultsMsg) noResultsMsg.remove();
            }
        });
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Menu Filters
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');

    function filterMenu() {
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;
        const selectedSort = sortFilter.value;

        // First, hide all menu items
        menuItems.forEach(item => {
            item.style.display = 'none';
        });

        // Hide all categories initially
        const menuCategories = document.querySelectorAll('.menu-category');
        menuCategories.forEach(category => {
            category.style.display = 'none';
        });

        // Filter and show items
        menuItems.forEach(item => {
            const category = item.closest('.menu-category').querySelector('h2').textContent.toLowerCase();
            const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
            const name = item.querySelector('h3').textContent;

            let showItem = true;

            // Category filter
            if (selectedCategory !== 'all' && !category.includes(selectedCategory)) {
                showItem = false;
            }

            // Price filter
            if (selectedPrice !== 'all') {
                if (selectedPrice === '30+') {
                    if (price <= 30) showItem = false;
                } else {
                    const [min, max] = selectedPrice.split('-').map(Number);
                    if (price < min || price > max) showItem = false;
                }
            }

            // Show/hide item
            item.style.display = showItem ? 'block' : 'none';

            // Show the parent category if the item is visible
            if (showItem) {
                item.closest('.menu-category').style.display = 'block';
            }
        });

        // Sort items within visible categories
        menuCategories.forEach(category => {
            if (category.style.display !== 'none') {
                const items = Array.from(category.querySelectorAll('.menu-item'));
                const itemsContainer = category.querySelector('.menu-items');

                items.sort((a, b) => {
                    const nameA = a.querySelector('h3').textContent;
                    const nameB = b.querySelector('h3').textContent;
                    const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));

                    switch (selectedSort) {
                        case 'name-asc':
                            return nameA.localeCompare(nameB);
                        case 'name-desc':
                            return nameB.localeCompare(nameA);
                        case 'price-asc':
                            return priceA - priceB;
                        case 'price-desc':
                            return priceB - priceA;
                        default:
                            return 0;
                    }
                });

                items.forEach(item => itemsContainer.appendChild(item));
            }
        });
    }

    if (categoryFilter && priceFilter && sortFilter) {
        categoryFilter.addEventListener('change', filterMenu);
        priceFilter.addEventListener('change', filterMenu);
        sortFilter.addEventListener('change', filterMenu);
    }

    // Book a Table Button
    const bookTableBtn = document.querySelector('.book-table-btn');
    if (bookTableBtn) {
        bookTableBtn.addEventListener('click', () => {
            // Add your booking system logic here
            alert('Booking system coming soon!');
        });
    }

    // --- CART LOGIC ---
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCount = document.getElementById('cartCount');
    const reserveTableBtn = document.getElementById('reserveTableBtn');
    let cart = [];

    // Add to Cart
    document.querySelectorAll('.add-to-cart-btn').forEach((btn, idx) => {
        btn.addEventListener('click', function() {
            const menuItem = btn.closest('.menu-item');
            const name = menuItem.querySelector('h3').textContent;
            const price = menuItem.querySelector('.price').textContent;
            // Check if already in cart
            const found = cart.find(item => item.name === name);
            if (found) {
                found.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }
            updateCartDisplay();
        });
    });

    // Show Cart Modal
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
            updateCartDisplay();
        });
    }

    // Close Cart Modal
    if (closeCart && cartModal) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    // Remove from Cart
    function removeFromCart(idx) {
        cart.splice(idx, 1);
        updateCartDisplay();
    }

    // Update Cart Display
    function updateCartDisplay() {
        // Update count
        cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
        // Update list
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li style="text-align:center;color:#888;">No items selected.</li>';
        } else {
            cart.forEach((item, idx) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${item.name} <span style='color:#aaa;font-size:0.95em;'>x${item.qty}</span> <span style='color:#e74c3c;font-weight:600;'>${item.price}</span></span> <button class='remove-cart-item' title='Remove'>&times;</button>`;
                li.querySelector('.remove-cart-item').addEventListener('click', () => removeFromCart(idx));
                cartItemsList.appendChild(li);
            });
        }
    }

    // Reserve Table Button
    if (reserveTableBtn) {
        reserveTableBtn.addEventListener('click', () => {
            window.location.href = 'contact.html';
        });
    }
});
