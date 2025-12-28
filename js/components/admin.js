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
            .map((hairstyle, idx) => this.renderItem(hairstyle, idx))
            .join('');
        
        // Dodaj event listenery
        this.attachEventListeners();

        // Drag and drop obsługa
        let dragSrcIdx = null;
        const adminItems = document.querySelectorAll('.admin-item');
        adminItems.forEach((item, idx) => {
            item.setAttribute('draggable', 'true');
            item.addEventListener('dragstart', (e) => {
                dragSrcIdx = idx;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                item.classList.add('drag-over');
            });
            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                if (dragSrcIdx === null || dragSrcIdx === idx) return;

                // Sprawdź czy przeciągany element to rodzic
                const dragged = state.hairstyles[dragSrcIdx];
                let toMove = [dragged];
                if (dragged.type === 'parent' && Array.isArray(dragged.childrenIds) && dragged.childrenIds.length > 0) {
                    // Pobierz dzieci tego rodzica (w kolejności występowania w liście)
                    const children = state.hairstyles.filter(h => h.type === 'child' && Array.isArray(h.parentIds) && h.parentIds.includes(dragged.id));
                    toMove = [dragged, ...children];
                }
                // Usuń rodzica i dzieci z listy
                state.hairstyles = state.hairstyles.filter(h => !toMove.includes(h));
                // Wstaw pod nowy indeks (jeśli przenosimy w dół, indeks trzeba skorygować)
                let insertIdx = idx;
                if (dragSrcIdx < idx) insertIdx = idx - toMove.length + 1;
                state.hairstyles.splice(insertIdx, 0, ...toMove);

                // Aktualizuj ID i zależności
                const oldToNewId = {};
                state.hairstyles.forEach((h, i) => {
                    oldToNewId[h.id] = i + 1;
                });
                state.hairstyles.forEach((h, i) => {
                    h.id = i + 1;
                });
                state.hairstyles.forEach(h => {
                    if (Array.isArray(h.parentIds)) {
                        h.parentIds = h.parentIds.map(pid => oldToNewId[pid] || pid);
                    }
                    if (Array.isArray(h.childrenIds)) {
                        h.childrenIds = h.childrenIds.map(cid => oldToNewId[cid] || cid);
                    }
                });

                setTimeout(() => {
                    Admin.render(state);
                }, 0);
            });
        });
        // Obsługa kliknięcia na całą kartę fryzury (admin-item) i podświetlanie parenta oraz jego dzieci
        document.querySelectorAll('.admin-item').forEach(item => {
            item.addEventListener('click', e => {
                if (e.target.closest('.edit-btn') || e.target.closest('.delete-btn')) return;
                const id = parseInt(item.querySelector('.edit-btn').dataset.id);
                const hairstyle = state.hairstyles.find(h => h.id === id);
                const isHighlighted = item.classList.contains('highlighted') || item.classList.contains('parent-highlighted');
                // Jeśli już podświetlone, usuń podświetlenie
                if (isHighlighted) {
                    document.querySelectorAll('.admin-item.highlighted, .admin-item.parent-highlighted').forEach(el => el.classList.remove('highlighted', 'parent-highlighted'));
                    return;
                }
                // Usuń stare podświetlenia
                document.querySelectorAll('.admin-item.highlighted, .admin-item.parent-highlighted').forEach(el => el.classList.remove('highlighted', 'parent-highlighted'));
                if (hairstyle.type === 'parent' && Array.isArray(hairstyle.childrenIds) && hairstyle.childrenIds.length > 0) {
                    // Podświetl parenta
                    item.classList.add('parent-highlighted');
                    // Podświetl dzieci
                    hairstyle.childrenIds.forEach(cid => {
                        const childItem = document.querySelector(`.admin-item .edit-btn[data-id="${cid}"]`);
                        if (childItem) childItem.closest('.admin-item').classList.add('highlighted');
                    });
                } else if (hairstyle.type === 'child' && Array.isArray(hairstyle.parentIds) && hairstyle.parentIds.length > 0) {
                    // Podświetl rodziców ciemniej
                    hairstyle.parentIds.forEach(pid => {
                        const parentItem = document.querySelector(`.admin-item .edit-btn[data-id="${pid}"]`);
                        if (parentItem) parentItem.closest('.admin-item').classList.add('parent-highlighted');
                        // Podświetl rodzeństwo
                        const parent = state.hairstyles.find(h => h.id === pid);
                        if (parent && Array.isArray(parent.childrenIds)) {
                            parent.childrenIds.forEach(cid => {
                                if (cid !== hairstyle.id) {
                                    const siblingItem = document.querySelector(`.admin-item .edit-btn[data-id="${cid}"]`);
                                    if (siblingItem) siblingItem.closest('.admin-item').classList.add('highlighted');
                                }
                            });
                        }
                    });
                    // Podświetl kliknięte dziecko
                    item.classList.add('highlighted');
                } else {
                    // Podświetl tylko kliknięty element
                    item.classList.add('highlighted');
                }
            });
        });
        // Usuwanie podświetlenia po kliknięciu poza admin-list
        document.addEventListener('click', function clearHighlight(e) {
            const adminList = document.getElementById('admin-list');
            if (!adminList.contains(e.target)) {
                document.querySelectorAll('.admin-item.highlighted, .admin-item.parent-highlighted').forEach(el => el.classList.remove('highlighted', 'parent-highlighted'));
            }
        });
    },

    /**
     * Renderuje pojedynczy element listy
     */
    renderItem(hairstyle, idx) {
        const imageHtml = hairstyle.image 
            ? `<img src="${hairstyle.image}" alt="${hairstyle.name}">`
            : hairstyle.emoji;

        return `
            <div class="admin-item" data-idx="${idx}">
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
