/**
 * Komponent Admin - zarządzanie fryzurami
 */

const Admin = {
    /**
     * Renderuje panel administracyjny
     */
    render(state) {
        const list = document.getElementById('admin-list');
        
        if (state.hairstyles.length === 0) {
            list.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; background: rgba(31, 41, 55, 0.8); border-radius: 15px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">📋</div>
                    <h3 style="color: #9ca3af; font-size: 1.2rem;">Brak fryzur</h3>
                    <p style="color: #6b7280; margin-top: 10px;">
                        Kliknij "Dodaj nową fryzurę" aby rozpocząć
                    </p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = state.hairstyles
            .map(hairstyle => this.renderItem(hairstyle))
            .join('');
        
        // Dodaj event listenery
        this.attachEventListeners();
    },

    /**
     * Renderuje pojedynczy element listy
     */
    renderItem(hairstyle) {
        const imageHtml = hairstyle.image 
            ? `<img src="${hairstyle.image}" alt="${hairstyle.name}">`
            : hairstyle.emoji;

        return `
            <div class="admin-item">
                <div class="admin-item-left">
                    <div class="admin-thumb">
                        ${imageHtml}
                    </div>
                    <div class="admin-info">
                        <h3>${hairstyle.name} <span style="color: #9ca3af; font-size: 0.8em; font-weight: normal;">(ID: ${hairstyle.id})</span></h3>
                        <p>${hairstyle.tags.join(' • ')}</p>
                    </div>
                </div>
                <div class="admin-actions">
                    <button class="btn btn-primary edit-btn" data-id="${hairstyle.id}">
                        ✏️ Edytuj
                    </button>
                    <button class="btn btn-danger delete-btn" data-id="${hairstyle.id}">
                        🗑️ Usuń
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Dodaje event listenery
     */
    attachEventListeners() {
        // Edycja
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                App.editHairstyle(id);
            });
        });
        
        // Usuwanie
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                App.deleteHairstyle(id);
            });
        });
    }
};
