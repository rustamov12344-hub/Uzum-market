document.addEventListener("DOMContentLoaded", () => {
    // === ЛОГИКА АВТОРИЗАЦИИ И СЛАЙДЕРА (Твой старый код) ===
    const modal = document.getElementById("modal");
    const openBtn = document.querySelector(".account");
    const closeBtn = document.getElementById("closeModal");

    if (openBtn && modal) openBtn.addEventListener("click", () => { modal.style.display = "flex"; });
    if (closeBtn && modal) closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

    const slides = document.querySelectorAll(".slider");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    let currentSlide = 0;

    function showSlide(index) {
        if (slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove("active"));
        slides[index].classList.add("active");
    }
    if (nextBtn && prevBtn && slides.length > 0) {
        nextBtn.addEventListener("click", () => { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); });
        prevBtn.addEventListener("click", () => { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); });
        setInterval(() => { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }, 3000);
    }

    const region = document.querySelector(".loc-choose");
    if (region) {
        region.addEventListener("change", () => { localStorage.setItem("region", region.value); });
        const savedRegion = localStorage.getItem("region");
        if (savedRegion) { region.value = savedRegion; }
    }

    const accountBtn = document.querySelector(".account");
    const loginBtn = document.querySelector(".get-code");
    const usernameInput = document.querySelector(".username") || document.querySelector(".modal-box input");
    const savedUser = localStorage.getItem("username");
    if (savedUser && accountBtn) setAccountName(savedUser);
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            if (!usernameInput) return;
            const username = usernameInput.value.trim();
            if (!username) return;
            localStorage.setItem("username", username);
            setAccountName(username);
            if (modal) modal.style.display = "none";
        });
    }
    function setAccountName(name) {
        if (!accountBtn) return;
        accountBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C9.79086 3 8 4.79086 8 7V8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8V7C16 4.79086 14.2091 3 12 3ZM9.5 7C9.5 5.61929 10.6193 4.5 12 4.5C13.3807 4.5 14.5 5.61929 14.5 7V8C14.5 9.38071 13.3807 10.5 12 10.5C10.6193 10.5 9.5 9.38071 9.5 8V7ZM5.50232 19.3686C5.97321 16.2577 9.01803 14.5 12.0022 14.5C14.9858 14.5 18.031 16.2577 18.5019 19.3686C18.5046 19.3866 18.5025 19.3972 18.5 19.4048C18.497 19.4137 18.4903 19.4269 18.4759 19.442C18.4453 19.4741 18.3894 19.5039 18.3171 19.5039H5.68718C5.61487 19.5039 5.55898 19.4741 5.52838 19.442C5.51394 19.4269 5.50726 19.4137 5.50427 19.4048C5.50174 19.3972 5.49961 19.3865 5.50232 19.3686ZM12.0022 13C8.57321 13 4.64037 15.0404 4.01922 19.1441C3.85624 20.2208 4.75727 21.0039 5.68718 21.0039H18.3171C19.247 21.0039 20.148 20.2208 19.985 19.1441C19.3638 15.0404 15.4306 13 12.0022 13Z" fill="black"></path></svg> ${name}`;
    }

    // === НОВАЯ ЛОГИКА КОРЗИНЫ С ПЕРЕХОДОМ НА PRODUCT.HTML ===
    let cart = JSON.parse(localStorage.getItem("diplom_cart")) || [];

    const basketBtn = document.querySelector(".basket");
    const cartModal = document.getElementById("cartModal");
    const closeCartModal = document.getElementById("closeCartModal");

    if (basketBtn && cartModal) basketBtn.addEventListener("click", () => { cartModal.style.display = "flex"; renderCart(); });
    if (closeCartModal && cartModal) closeCartModal.addEventListener("click", () => { cartModal.style.display = "none"; });
    if (cartModal) cartModal.addEventListener("click", (e) => { if (e.target === cartModal) cartModal.style.display = "none"; });

    // Добавление товара в корзину с главной
    document.querySelectorAll(".order-btn button").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".all-goods");
            if (!card) return;

            const id = "prod-" + index;
            const title = card.querySelector(".name-product") ? card.querySelector(".name-product").textContent : "Uzum Mahsulot";
            const priceText = card.querySelector(".own-price") ? card.querySelector(".own-price").textContent : "100 000 soum";
            const price = parseInt(priceText.replace(/[^0-9]/g, ""));

            const existing = cart.find(item => item.id === id);
            if (existing) { existing.quantity++; } else { cart.push({ id, title, price, quantity: 1 }); }

            saveCart();
            alert(`"${title}" savatga qo'shildi!`);
        });
    });


    if (cartModal) {
        cartModal.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            if (!id) return;
            if (e.target.classList.contains("plus-qty")) { cart.find(item => item.id === id).quantity++; saveCart(); }
            if (e.target.classList.contains("minus-qty")) {
                const item = cart.find(item => item.id === id);
                item.quantity--;
                if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
                saveCart();
            }
            if (e.target.classList.contains("cart-item-remove")) { cart = cart.filter(item => item.id !== id); saveCart(); }
        });
    }

    function saveCart() {
        localStorage.setItem("diplom_cart", JSON.stringify(cart));
        updateBasketButtonBadge();
        renderCart();
    }

    function updateBasketButtonBadge() {
        if (!basketBtn) return;
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        basketBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 6.5C9 4.88779 10.2402 3.5 12 3.5C13.7598 3.5 15 4.88779 15 6.5V7.5H9V6.5ZM7.5 9V11.5H9V9H15V11.5H16.5V9H18.5V19.75C18.5 20.1642 18.1642 20.5 17.75 20.5H6.25C5.83579 20.5 5.5 20.1642 5.5 19.75V9H7.5ZM7.5 7.5V6.5C7.5 4.11221 9.35984 2 12 2C14.6402 2 16.5 4.11221 16.5 6.5V7.5H19.25H20V8.25V19.75C20 20.9926 18.9926 22 17.75 22H6.25C5.00736 22 4 20.9926 4 19.75V8.25V7.5H4.75H7.5Z"></path></svg> Savat (${totalCount})`;
    }

    function renderCart() {
        const container = document.getElementById("cartItemsContainer");
        const totalSumEl = document.getElementById("cartTotalSum");
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#7e818c; padding:20px 0;">Savat bo'sh</p>`;
            if (totalSumEl) totalSumEl.textContent = "0 sum";
            return;
        }

        let html = "";
        let totalSum = 0;

        cart.forEach(item => {
            const cost = item.price * item.quantity;
            totalSum += cost;

            // ЗДЕСЬ МЫ САМИ ДОБАВЛЯЕМ СЛОВО "soum" РЯДОМ С ЦЕНОЙ И ИТОГОМ
            html += `
            <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e8eaee; padding:10px 0; font-family:'Inter';">
                <div>
                    <div style="font-weight:500;">${item.title}</div>
                    <div style="color:#7000ff; font-size:14px;">${item.price.toLocaleString()} sum</div>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <button class="qty-btn minus-qty" data-id="${item.id}">-</button>
                    <span style="font-weight:600;">${item.quantity}</span>
                    <button class="qty-btn plus-qty" data-id="${item.id}">+</button>
                </div>
                <div style="font-weight:700; width:110px; text-align:right;">${cost.toLocaleString()} sum</div>
                <button class="cart-item-remove" data-id="${item.id}" style="background:none; border:none; cursor:pointer; font-size:16px;">🗑️</button>
            </div>`;
        });

        container.innerHTML = html;

        // И здесь в самом низу корзины тоже автоматически добавляется "soum" к общей сумме
        if (totalSumEl) totalSumEl.textContent = `${totalSum.toLocaleString()} sum`;
    }
    let liked = JSON.parse(localStorage.getItem("diplom_liked")) || [];

    function updateLikedBadge() {
        const likedTextEl = document.querySelector(".liked-text");
        if (likedTextEl) {
            likedTextEl.textContent = `Saralangan (${liked.length})`;
        }
    }

    // Клик по сердечку кнопке .card-heart внутри .all-goods
    document.querySelectorAll(".all-goods").forEach((card, index) => {
        const heartBtn = card.querySelector(".card-heart");
        if (!heartBtn) return;
        // Вместо "prod-" + index пишем:
        const id = card.getAttribute("data-id") || "prod-" + index;

        // Если товар уже был в избранном, подсвечиваем его при загрузке страницы
        if (liked.find(item => item.id === id)) {
            heartBtn.style.color = "red";
        }

        heartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const title = card.querySelector(".name-product") ? card.querySelector(".name-product").textContent.trim() : "Uzum Mahsulot";
            const orderBtn = card.querySelector(".order-btn button"); 
            const price = orderBtn ? (orderBtn.getAttribute("own-price") || 100000) : 100000;

            const isExist = liked.find(item => item.id === id);
            if (isExist) {
                liked = liked.filter(item => item.id !== id);
                heartBtn.style.color = "black"; // Снимаем выделение
                alert(`"${title}" saralanganlardan o'chirildi!`);
            } else {
                liked.push({ id, title, price });
                heartBtn.style.color = "red"; // Красим сердечко в красный
                alert(`"${title}" saralanganlarga qo'shildi!`);
            }

            localStorage.setItem("diplom_liked", JSON.stringify(liked));
            updateLikedBadge();
        });
    });
    // КНОПКА «ОФОРМИТЬ ЗАКАЗ» -> Сохраняет данные и делает перенаправление
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) return;

            let currentOrders = JSON.parse(localStorage.getItem("diplom_orders")) || [];

            const newOrder = {
                id: "UZUM-" + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, 5),
                items: [...cart],
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };

            currentOrders.push(newOrder);
            localStorage.setItem("diplom_orders", JSON.stringify(currentOrders));

            // Очищаем корзину
            cart = [];
            localStorage.setItem("diplom_cart", JSON.stringify(cart));

            alert(`Buyurtma muvaffaqiyatli rasmiylashtirildi!`);
            // Перемещаем пользователя на страницу заказов
            window.location.href = "./product.html";
        });
    }

    updateBasketButtonBadge();
    updateLikedBadge();
});