document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("likedListContainer");
    if (!container) return;

    let liked = JSON.parse(localStorage.getItem("diplom_liked")) || [];

    function renderLikedPage() {
        if (liked.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px 0; font-family: 'Inter';">
                    <p style="font-size: 18px; color: #7e818c; margin-bottom: 15px;">Saralangan mahsulotlar yo'q (Список пуст)</p>
                    <a href="./index.html" style="display: inline-block; padding: 10px 20px; background-color: #7000ff; color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">Bosh sahifaga qaytish</a>
                </div>`;
            return;
        }

        let html = `<div style="display: flex; flex-direction: column; gap: 15px; font-family: 'Inter';">`;

        liked.forEach(item => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 20px; border-radius: 8px; border: 1px solid #e8eaee;">
                    <div>
                        <h3 style="font-size: 16px; font-weight: 500; margin-bottom: 5px; color: #1f2026;">${item.title}</h3>
                        <span style="font-size: 16px; font-weight: 700; color: #7000ff;">${item.price.toLocaleString()} sum</span>
                    </div>
                    <button class="remove-liked-btn" data-id="${item.id}" style="background: none; border: none; cursor: pointer; color: #ff2d55; font-size: 16px; font-weight: 500;">
                        O'chirish (Удалить)
                    </button>
                </div>`;
        });

        html += `</div>`;
        container.innerHTML = html;
        document.querySelectorAll(".remove-liked-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                liked = liked.filter(item => item.id !== id);
                localStorage.setItem("diplom_liked", JSON.stringify(liked));
                renderLikedPage(); // перерисовываем страницу
            });
        });
    }
    renderLikedPage();
});