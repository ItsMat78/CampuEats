const API_URL = 'http://localhost:3000/api';

// --- STATE ---
let menuItems = [];
let cart = [];
let walletBalance = 500.00;
let activeFilters = new Set(['all']); 
let currentView = 'customer';

// Carousel State
let trendingItems = [];
let currentSlide = 0;
let slideInterval;

document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
    fetchOrders(); 
    updateWalletUI();
    setupEventListeners();
    setInterval(fetchOrders, 5000); 
});

// --- CAROUSEL LOGIC ---
function startCarousel() {
    trendingItems = menuItems.slice(0, 5); 
    if(trendingItems.length > 0) {
        renderSlide(0); // Render first slide
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
        
        const container = document.getElementById('carousel-container');
        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
    }
}

// --- CAROUSEL LOGIC ---

// 1. Pass 'next' direction
function nextSlide() {
    currentSlide = (currentSlide + 1) % trendingItems.length;
    renderSlide(currentSlide, 'next');
}

// 2. Pass 'prev' direction
function prevSlide() {
    currentSlide = (currentSlide - 1 + trendingItems.length) % trendingItems.length;
    renderSlide(currentSlide, 'prev');
}

// 3. Render with Direction
function renderSlide(index, direction = 'next') {
    if (!trendingItems || trendingItems.length === 0) return;

    const item = trendingItems[index];
    const bgContainer = document.getElementById('carousel-bg');
    const textContainer = document.getElementById('carousel-text');
    const mainContainer = document.getElementById('carousel-container');

    if (!bgContainer || !textContainer) return;
    
    // Determine CSS classes based on direction
    const imgClass = direction === 'next' ? 'slide-in-from-right' : 'slide-in-from-left';
    const textClass = direction === 'next' ? 'text-fade-in-right' : 'text-fade-in-left';

    // We do NOT wait for fade-out anymore. We swap immediately for a snappy slide feel.
    
    // A. Update Background Image
    bgContainer.innerHTML = `
        <img src="${item.image}" class="absolute inset-0 w-full h-full object-cover ${imgClass}">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
    `;
    
    // B. Update Text Content
    textContainer.innerHTML = `
        <div class="flex flex-col items-start ${textClass}">
            <span class="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                Trending Now 🔥
            </span>
            <h2 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white drop-shadow-lg">
                ${item.name}
            </h2>
            <p class="text-gray-200 text-lg mb-8 max-w-md drop-shadow-md font-medium">
                Try the most loved dish on campus today. Freshly prepared in ${item.time}.
            </p>
            <button onclick="openItemDetails(${item.id}); event.stopPropagation();" class="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold hover:scale-105 transition shadow-lg shadow-orange-500/40">
                Order Now
            </button>
        </div>
    `;
    
    mainContainer.onclick = () => openItemDetails(item.id);
}
// --- FILTER & SEARCH ---
function toggleFilter(filter) {
    if (filter === 'all') {
        activeFilters.clear();
        activeFilters.add('all');
    } else {
        activeFilters.delete('all');
        if (activeFilters.has(filter)) activeFilters.delete(filter);
        else activeFilters.add(filter);
        if (activeFilters.size === 0) activeFilters.add('all');
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnType = btn.id.replace('btn-', '');
        if (activeFilters.has(btnType)) btn.classList.add('active');
    });

    renderMenu();
}

// --- API & RENDER ---
async function fetchMenu(searchTerm = '') {
    try {
        const response = await fetch(`${API_URL}/menu?search=${searchTerm}`);
        const data = await response.json();
        
        menuItems = data.map(item => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            category: item.category_name ? item.category_name.toLowerCase() : 'general', 
            image: item.image_url, 
            veg: Boolean(item.is_veg),
            spicy: item.spicy_level || 0,
            time: (item.prep_time_mins || 15) + ' min',
            cal: item.calories || 0
        }));

        renderMenu();
        if(!searchTerm) startCarousel();
    } catch (err) { console.error(err); }
}

function renderMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    const filtered = menuItems.filter(item => {
        if (activeFilters.has('all')) return true;
        let matches = true;
        if (activeFilters.has('veg') && !item.veg) matches = false;
        if (activeFilters.has('nonveg') && item.veg) matches = false;
        if (activeFilters.has('spicy') && item.spicy < 2) matches = false;
        if (activeFilters.has('drinks') && item.category !== 'drinks' && item.category !== 'extras') matches = false;
        return matches;
    });

    filtered.forEach(item => {
        let spiceIcons = '🌶️'.repeat(item.spicy);
        const typeColor = item.veg ? 'border-green-500' : 'border-red-500';
        const typeText = item.veg ? 'VEG' : 'NON-VEG';

        const card = document.createElement('div');
        card.className = "glass-card rounded-2xl p-0 overflow-hidden relative group cursor-pointer";
        
        // Correctly call openItemDetails when card is clicked
        card.onclick = (e) => {
            if(e.target.closest('button')) return; 
            openItemDetails(item.id);
        };

        // Added loading="lazy" for performance
        card.innerHTML = `
            <div class="h-40 overflow-hidden relative">
                <img src="${item.image}" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
                <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border ${typeColor} border-l-4 text-[10px] font-bold uppercase text-white shadow-lg">
                    ${typeText}
                </div>
                <div class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white flex gap-2 border border-white/10">
                     <span>⏱ ${item.time}</span>
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
    <div>
        <h3 class="font-bold text-lg leading-tight group-hover:text-orange-400 transition break-words pr-2">${item.name}</h3>
        
        <div class="text-xs mt-1 text-orange-500 h-4">${spiceIcons}</div>
    </div>
    <span class="font-bold text-xl text-white whitespace-nowrap">₹${item.price}</span>
</div>
                <button onclick="openItemDetails(${item.id})" class="w-full mt-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-orange-500 hover:border-orange-500 text-sm font-bold transition flex items-center justify-center gap-2">
                    View Details
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- MODAL LOGIC ---
function openItemDetails(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    document.getElementById('modal-img').src = item.image;
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-price').innerText = `₹${item.price}`;
    document.getElementById('modal-cat').innerText = item.category.toUpperCase();
    document.getElementById('modal-cal').innerHTML = `<i class="fa-solid fa-fire text-orange-500"></i> ${item.cal} cal`;
    document.getElementById('modal-time').innerHTML = `<i class="fa-regular fa-clock text-blue-400"></i> ${item.time}`;
    
    const tag = document.getElementById('modal-tag');
    tag.innerText = item.veg ? "VEG" : "NON-VEG";
    tag.className = `absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold text-white backdrop-blur-md border ${item.veg ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`;

    const btn = document.getElementById('modal-add-btn');
    btn.onclick = () => {
        addToCart(item.id);
        closeModal();
        // REMOVED toggleCart() here so cart stays closed
    };

    const modal = document.getElementById('item-modal');
    const modalContent = modal.querySelector('.animate-fade-in');
    
    modal.classList.remove('hidden');
    // Add pop animation
    modalContent.classList.add('modal-enter');
}

function closeModal() {
    const modal = document.getElementById('item-modal');
    modal.classList.add('hidden');
    // Clean up animation class
    const modalContent = modal.querySelector('.animate-fade-in');
    modalContent.classList.remove('modal-enter');
}

// --- CART ---
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    if(!item) return;
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({...item, qty: 1});
    
    updateCartUI();
    showToast(`Added ${item.name} to Tray`);
}

function removeFromCart(id) {
    const index = cart.findIndex(i => i.id === id);
    if (index > -1) {
        if (cart[index].qty > 1) cart[index].qty--;
        else cart.splice(index, 1);
    }
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const countBadge = document.getElementById('cart-count');
    
    container.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        container.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-slate-500"><i class="fa-solid fa-basket-shopping text-4xl mb-3 opacity-20"></i><p>Tray is empty</p></div>';
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        const div = document.createElement('div');
        div.className = "flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5";
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="${item.image}" class="w-10 h-10 rounded-lg object-cover">
                <div>
                    <h4 class="font-bold text-sm text-gray-200 w-32 truncate">${item.name}</h4>
                    <div class="text-xs text-gray-400">₹${item.price} x ${item.qty}</div>
                </div>
            </div>
            <div class="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-white/5">
                <button onclick="removeFromCart(${item.id})" class="w-6 h-6 flex items-center justify-center text-xs hover:text-red-400"><i class="fa-solid fa-minus"></i></button>
                <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                <button onclick="addToCart(${item.id})" class="w-6 h-6 flex items-center justify-center text-xs hover:text-green-400"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;
        container.appendChild(div);
    });

    countBadge.innerText = count;
    countBadge.style.display = count > 0 ? 'flex' : 'none';
    document.getElementById('cart-total').innerText = `₹${total}`;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    }
}

async function checkout() {
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    if(total === 0) return;

    if (total > walletBalance) {
        showToast("Insufficient Balance!", true);
        return;
    }

    const payload = { userName: "student", total: total, items: cart };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            walletBalance -= total;
            updateWalletUI();
            cart = [];
            updateCartUI();
            toggleCart();
            showToast(`Order Placed! ID: #${result.orderId}`);
            fetchOrders(); 
        } else {
            showToast(`Order Failed: ${result.error}`, true);
        }
    } catch (err) {
        showToast("Connection Failed", true);
    }
}

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    toast.className = `fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-[100] border ${isError ? 'bg-slate-800 border-red-500/50' : 'bg-slate-800 border-green-500/50'}`;
    toast.querySelector('i').className = isError ? "fa-solid fa-circle-exclamation text-red-400" : "fa-solid fa-circle-check text-green-400";
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

function setupEventListeners() {
    document.getElementById('view-toggle-btn').addEventListener('click', () => {
        document.getElementById('customer-view').classList.toggle('hidden');
        document.getElementById('admin-view').classList.toggle('hidden');
    });
    document.getElementById('cart-btn').addEventListener('click', () => toggleCart());
    document.getElementById('close-cart-btn').addEventListener('click', () => toggleCart());
    document.getElementById('overlay').addEventListener('click', () => toggleCart());
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    document.getElementById('search-input').addEventListener('input', (e) => fetchMenu(e.target.value));
}

function updateWalletUI() { document.getElementById('wallet-balance').innerText = `₹${walletBalance.toFixed(2)}`; }
async function fetchOrders() { 
    try {
        const response = await fetch(`${API_URL}/orders`);
        const orders = await response.json();
        
        // --- ADMIN RENDER LOGIC ---
        const cols = {
            new: document.getElementById('col-new'),
            cooking: document.getElementById('col-cooking'),
            ready: document.getElementById('col-ready')
        };
        Object.values(cols).forEach(el => el.innerHTML = '');

        orders.forEach(order => {
             // ... (Keep existing Admin Card Logic or Paste it here if missing)
             if (!cols[order.status]) return;
             const ticket = document.createElement('div');
             ticket.className = "bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-3";
             
             let btn = '';
             if(order.status === 'new') btn = `<button onclick="updateStatus(${order.id}, 'cooking')" class="w-full mt-2 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs rounded transition">Start Cooking</button>`;
             else if(order.status === 'cooking') btn = `<button onclick="updateStatus(${order.id}, 'ready')" class="w-full mt-2 py-1 bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white text-xs rounded transition">Mark Ready</button>`;
             else btn = `<button onclick="updateStatus(${order.id}, 'completed')" class="w-full mt-2 py-1 bg-green-600/20 hover:bg-green-600 text-green-300 hover:text-white text-xs rounded transition">Complete</button>`;

             ticket.innerHTML = `
                <div class="flex justify-between mb-2"><span class="font-mono text-gray-400">#${order.id}</span><span class="text-xs text-gray-500">${new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></div>
                <div class="text-sm font-bold text-white">₹${order.total_amount}</div>
                <div class="mt-2 text-xs text-gray-400">${order.user_name}</div>
                ${btn}
             `;
             cols[order.status].appendChild(ticket);
        });
    } catch(e) {}
}

window.updateStatus = async (id, status) => {
    await fetch(`${API_URL}/orders/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status})});
    fetchOrders();
}