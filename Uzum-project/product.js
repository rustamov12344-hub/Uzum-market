document.addEventListener("DOMContentLoaded", () => {
    // Получаем список заказов из общего локального хранилища браузера
    const ordersContainer = document.getElementById("ordersListContainer");
    const orders = JSON.parse(localStorage.getItem("diplom_orders")) || [];

    // Синхронизируем имя пользователя в шапке на странице заказов, если он авторизован
    const accountBtn = document.querySelector(".account");
    const savedUser = localStorage.getItem("username");
    if (savedUser && accountBtn) {
        accountBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C9.79086 3 8 4.79086 8 7V8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8V7C16 4.79086 14.2091 3 12 3ZM9.5 7C9.5 5.61929 10.6193 4.5 12 4.5C13.3807 4.5 14.5 5.61929 14.5 7V8C14.5 9.38071 13.3807 10.5 12 10.5C10.6193 10.5 9.5 9.38071 9.5 8V7ZM5.50232 19.3686C5.97321 16.2577 9.01803 14.5 12.0022 14.5C14.9858 14.5 18.031 16.2577 18.5019 19.3686C18.5046 19.3866 18.5025 19.3972 18.5 19.4048C18.497 19.4137 18.4903 19.4269 18.4759 19.442C18.4453 19.4741 18.3894 19.5039 18.3171 19.5039H5.68718C5.61487 19.5039 5.55898 19.4741 5.52838 19.442C5.51394 19.4269 5.50726 19.4137 5.50427 19.4048C5.50174 19.3972 5.49961 19.3865 5.50232 19.3686ZM12.0022 13C8.57321 13 4.64037 15.0404 4.01922 19.1441C3.85624 20.2208 4.75727 21.0039 5.68718 21.0039H18.3171C19.247 21.0039 20.148 20.2208 19.985 19.1441C19.3638 15.0404 15.4306 13 12.0022 13Z" fill="black"></path>
            </svg> ${savedUser}
        `;
    }

    // Если массив заказов пустой
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div style="text-align: center; padding: 50px 0; font-family: 'Inter';">
                <p style="color: #7e818c; font-size: 18px; margin-bottom: 20px;">Sizda hozircha buyurtmalar mavjud emas.</p>
                <a href="./index.html" style="display: inline-block; background: #7000ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                    Xarid qilishni boshlash
                </a>
            </div>`;
        return;
    }

    // Выводим чеки заказов (сначала новые)
    let html = "";
    [...orders].reverse().forEach(order => {
        let itemsHtml = "";
        order.items.forEach(item => {
            itemsHtml += `
                <li style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px; color: #1f2026;">
                    <span>${item.title} <strong style="color: #7e818c;">x${item.quantity}</strong></span>
                    <span style="font-weight: 500;">${(item.price * item.quantity).toLocaleString()} soum</span>
                </li>`;
        });

        html += `
            <div class="order-card" style="background: white; border: 1px solid #e8eaee; border-radius: 12px; padding: 20px; margin-bottom: 20px; font-family: 'Inter';">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #d2d2de; padding-bottom: 12px; margin-bottom: 12px; font-weight: 600;">
                    <span style="color: #7000ff; font-size: 16px;">Buyurtma ${order.id}</span>
                    <span style="color: #7e818c; font-size: 14px; font-weight: 400;">${order.date}</span>
                </div>
                <ul style="padding-left: 0; list-style: none; margin: 15px 0;">
                    ${itemsHtml}
                </ul>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid #e8eaee;">
                    <div>
                        <span style="font-size: 14px; color: #7e818c;">Holati: </span>
                        <span style="color: #20b04b; font-weight: 600; background: #eaf7ed; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
                            Topshirish punktiga yetkazilmoqda
                        </span>
                    </div>
                    <div style="font-size: 18px; font-weight: 700; color: #1f2026;">
                        ${order.total.toLocaleString()} soum
                    </div>
                </div>
            </div>`;
    });

    ordersContainer.innerHTML = html;
});

