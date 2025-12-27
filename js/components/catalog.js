/**
 * Komponent Katalog - wyświetla listę fryzur z filtrowaniem i wariantami
 */

const Catalog = {
    currentView: 'main', // 'main', 'variants', 'tree', 'favorites'
    currentParentId: null,

    /**
     * Renderuje katalog fryzur
     */
    render(state) {
        if (this.currentView === 'favorites') {
            this.renderFavoritesView(state);
        } else if (this.currentView === 'variants') {
            this.renderVariants(state);
        } else if (this.currentView === 'tree') {
            this.renderTreeView(state);
        } else {
            this.renderMain(state);
        }
    },

    /**
     * Renderuje główny widok katalogu
     */
    renderMain(state) {
        // Pokaż tylko fryzury rodzicielskie
        const parents = state.hairstyles.filter(h => h.type === 'parent');
        const filtered = this.filterHairstyles(parents, state.filters);
        const grid = document.getElementById('catalog-grid');
        
        // Usuń przycisk powrotu z polubionych
        document.getElementById('favorites-back-btn')?.remove();
        
        // Dodaj przycisk widoku drzewa
        this.renderViewSwitcher();
        
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔍</div>
                    <h3 style="color: #9ca3af; font-size: 1.2rem;">Nie znaleziono fryzur</h3>
                    <p style="color: #6b7280; margin-top: 10px;">Spróbuj zmienić filtry wyszukiwania</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = filtered.map(hairstyle => 
            this.renderParentCard(hairstyle, state)
        ).join('');
        
        this.attachEventListeners(state);
    },

    /**
     * Renderuje przełącznik widoku
     */
    renderViewSwitcher() {
        const filtersHeader = document.querySelector('.filters-header');
        let switcher = document.getElementById('view-switcher');
        
        if (!switcher) {
            switcher = document.createElement('button');
            switcher.id = 'view-switcher';
            switcher.className = 'btn btn-secondary';
            switcher.style.marginLeft = '10px';
            filtersHeader.appendChild(switcher);
        }
        
        switcher.innerHTML = '🌳 Widok drzewa';
        switcher.onclick = () => {
            this.currentView = 'tree';
            App.renderCurrentTab();
        };
    },

    /**
     * Renderuje kartę rodzica z liczbą wariantów
     */
    renderParentCard(hairstyle, state) {
        const isFavorite = state.favorites.includes(hairstyle.id);
        const imageHtml = hairstyle.image 
            ? `<img src="${hairstyle.image}" alt="${hairstyle.name}">`
            : hairstyle.emoji;
        
        const childrenCount = hairstyle.childrenIds ? hairstyle.childrenIds.length : 0;

        return `
            <div class="card" data-id="${hairstyle.id}">
                <div class="card-image">
                    ${imageHtml}
                    ${childrenCount > 0 ? `
                        <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                            📊 ${childrenCount} ${childrenCount === 1 ? 'wariant' : 'warianty'}
                        </div>
                    ` : ''}
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${hairstyle.name}</h3>
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                                data-id="${hairstyle.id}"
                                aria-label="Dodaj do ulubionych">
                            ${isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                    <p class="card-info">
                        <strong>Długość:</strong> ${hairstyle.length}
                    </p>
                    <p class="card-info">
                        <strong>Styl:</strong> ${hairstyle.style}
                    </p>
                    <p class="card-description">${hairstyle.description}</p>
                    ${childrenCount > 0 ? `
                        <button class="btn btn-primary view-variants-btn" data-parent-id="${hairstyle.id}" style="width: 100%; margin-top: 15px; justify-content: center;">
                            Zobacz warianty →
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Renderuje widok wariantów
     */
    renderVariants(state) {
        const parent = state.hairstyles.find(h => h.id === this.currentParentId);
        if (!parent) {
            this.currentView = 'main';
            this.renderMain(state);
            return;
        }
        
        const children = state.hairstyles.filter(h => 
            h.type === 'child' && h.parentIds && h.parentIds.includes(this.currentParentId)
        );
        
        const grid = document.getElementById('catalog-grid');
        
        grid.innerHTML = `
            <div style="grid-column: 1/-1;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px; flex-wrap: wrap;">
                    <button class="btn btn-secondary back-btn" style="display: flex; align-items: center; gap: 8px;">
                        ← Powrót
                    </button>
                    <div style="flex: 1;">
                        <h2 style="margin: 0; color: #fff;">Warianty: ${parent.name}</h2>
                        <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 0.9rem;">
                            ${children.length} ${children.length === 1 ? 'wariant' : 'wariantów'}
                        </p>
                    </div>
                </div>
            </div>
            ${children.map(child => this.renderChildCard(child, state, parent)).join('')}
        `;
        
        this.attachVariantEventListeners(state);
    },

    /**
     * Renderuje kartę wariantu (dziecka)
     */
    renderChildCard(hairstyle, state, parent) {
        const isFavorite = state.favorites.includes(hairstyle.id);
        const imageHtml = hairstyle.image 
            ? `<img src="${hairstyle.image}" alt="${hairstyle.name}">`
            : hairstyle.emoji;
        
        // Pokaż wszystkich rodziców
        const allParents = hairstyle.parentIds
            .map(pid => state.hairstyles.find(h => h.id === pid))
            .filter(Boolean);

        return `
            <div class="card" data-id="${hairstyle.id}">
                <div class="card-image">
                    ${imageHtml}
                    <div style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); color: #000; padding: 5px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                        Wariant
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${hairstyle.name}</h3>
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                                data-id="${hairstyle.id}"
                                aria-label="Dodaj do ulubionych">
                            ${isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                    ${allParents.length > 1 ? `
                        <p style="font-size: 0.85rem; color: #9ca3af; margin-bottom: 8px;">
                            <strong>Bazuje na:</strong> ${allParents.map(p => p.name).join(', ')}
                        </p>
                    ` : ''}
                    <p class="card-info">
                        <strong>Długość:</strong> ${hairstyle.length}
                    </p>
                    <p class="card-info">
                        <strong>Styl:</strong> ${hairstyle.style}
                    </p>
                    <p class="card-description">${hairstyle.description}</p>
                </div>
            </div>
        `;
    },

    /**
     * Renderuje widok drzewa relacji
     */
    renderTreeView(state) {
        const grid = document.getElementById('catalog-grid');
        
        // Jeśli jesteśmy w kontekście wariantów, pokaż tylko to drzewo
        const isLocalContext = this.currentParentId !== null;
        const parents = isLocalContext 
            ? state.hairstyles.filter(h => h.id === this.currentParentId)
            : state.hairstyles.filter(h => h.type === 'parent');
        
        const title = isLocalContext 
            ? `Warianty: ${parents[0]?.name || 'Drzewo'}`
            : 'Drzewko Relacji Fryzur';
        
        const backButtonText = isLocalContext
            ? '← Powrót do wariantów'
            : '← Powrót do katalogu';
        
        grid.innerHTML = `
            <div style="grid-column: 1/-1;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
                    <button class="btn btn-secondary tree-back-btn" style="display: flex; align-items: center; gap: 8px;">
                        ${backButtonText}
                    </button>
                    <h2 style="margin: 0; color: #fff;">${title}</h2>
                </div>
            </div>
            <div style="grid-column: 1/-1;">
                <div class="tree-container">
                    ${parents.map(parent => this.renderTreeNode(parent, state)).join('')}
                </div>
            </div>
        `;
        
        document.querySelector('.tree-back-btn').addEventListener('click', () => {
            if (isLocalContext) {
                this.currentView = 'variants';
            } else {
                this.currentView = 'main';
            }
            App.renderCurrentTab();
        });
        
        this.attachTreeEventListeners(state);
    },

    /**
     * Renderuje węzeł drzewa
     */
    renderTreeNode(parent, state) {
        const children = state.hairstyles.filter(h => 
            h.type === 'child' && h.parentIds && h.parentIds.includes(parent.id)
        );
        
        const imageHtml = parent.image 
            ? `<img src="${parent.image}" alt="${parent.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">`
            : `<div style="font-size: 2rem;">${parent.emoji}</div>`;

        return `
            <div class="tree-node" style="background: rgba(31, 41, 55, 0.8); border: 1px solid #374151; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: ${children.length > 0 ? '20px' : '0'};">
                    ${imageHtml}
                    <div>
                        <h3 style="margin: 0; color: #fff; font-size: 1.3rem;">${parent.name}</h3>
                        <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 0.9rem;">
                            ${children.length} ${children.length === 1 ? 'wariant' : 'wariantów'}
                        </p>
                    </div>
                    ${children.length > 0 ? `
                        <button class="btn btn-primary view-variants-btn" data-parent-id="${parent.id}" style="margin-left: auto;">
                            Zobacz warianty →
                        </button>
                    ` : ''}
                </div>
                
                ${children.length > 0 ? `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; padding-left: 30px; border-left: 2px solid #4a4a4a;">
                        ${children.map(child => {
                            const childImageHtml = child.image 
                                ? `<img src="${child.image}" alt="${child.name}" style="width: 100%; height: 100px; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px;">`
                                : `<div style="font-size: 2.5rem; height: 100px; aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #374151, #1f2937); border-radius: 8px;">${child.emoji}</div>`;
                            
                            return `
                                <div style="background: rgba(55, 65, 81, 0.5); border: 1px solid #4b5563; border-radius: 10px; padding: 12px; transition: all 0.3s;" class="tree-child-card">
                                    ${childImageHtml}
                                    <h4 style="margin: 10px 0 5px 0; color: #fff; font-size: 0.95rem;">${child.name}</h4>
                                    <p style="margin: 0; color: #9ca3af; font-size: 0.8rem;">${child.style}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Filtruje fryzury według wybranych kryteriów
     */
    filterHairstyles(hairstyles, filters) {
        return hairstyles.filter(hairstyle => {
            if (filters.length !== 'all' && !hairstyle.tags.includes(filters.length)) {
                return false;
            }
            if (filters.style !== 'all' && !hairstyle.tags.includes(filters.style)) {
                return false;
            }
            return true;
        });
    },

    /**
     * Dodaje event listenery do kart głównych
     */
    attachEventListeners(state) {
        // Ulubione
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                App.toggleFavorite(id);
            });
        });
        
        // Zobacz warianty
        document.querySelectorAll('.view-variants-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const parentId = parseInt(btn.dataset.parentId);
                this.currentParentId = parentId;
                this.currentView = 'variants';
                App.renderCurrentTab();
            });
        });
    },

    /**
     * Event listenery dla widoku wariantów
     */
    attachVariantEventListeners(state) {
        // Powrót
        document.querySelector('.back-btn')?.addEventListener('click', () => {
            this.currentView = 'main';
            this.currentParentId = null;
            App.renderCurrentTab();
        });
        
        // Ulubione
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                App.toggleFavorite(id);
            });
        });
    },

    /**
     * Event listenery dla widoku drzewa
     */
    attachTreeEventListeners(state) {
        // Zobacz warianty z drzewa
        document.querySelectorAll('.view-variants-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const parentId = parseInt(btn.dataset.parentId);
                this.currentParentId = parentId;
                this.currentView = 'variants';
                App.renderCurrentTab();
            });
        });
        
        // Hover efekt na kartach dzieci
        document.querySelectorAll('.tree-child-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.borderColor = '#ffffff';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.borderColor = '#4b5563';
            });
        });
    },

    /**
     * Wyświetla tylko polubione fryzury
     */
    showFavorites(state) {
        this.currentView = 'favorites';
        App.renderCurrentTab();
    },

    /**
     * Renderuje widok polubionych fryzur
     */
    renderFavoritesView(state) {
        const favorites = state.hairstyles.filter(h => state.favorites.includes(h.id));
        const filtered = this.filterHairstyles(favorites, state.filters);
        const grid = document.getElementById('catalog-grid');
        
        // Dodaj przycisk powrotu
        const filtersHeader = document.querySelector('.filters-header');
        let backBtn = document.getElementById('favorites-back-btn');
        
        if (!backBtn) {
            backBtn = document.createElement('button');
            backBtn.id = 'favorites-back-btn';
            backBtn.className = 'btn btn-secondary';
            filtersHeader.insertBefore(backBtn, filtersHeader.firstChild);
        }
        
        backBtn.innerHTML = '← Powrót do katalogu';
        backBtn.onclick = () => {
            this.currentView = 'main';
            App.renderCurrentTab();
        };
        
        console.log('renderFavoritesView - state.favorites:', state.favorites);
        console.log('renderFavoritesView - polubione:', favorites);
        
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🤍</div>
                    <h3 style="color: #9ca3af; font-size: 1.2rem;">Brak polubionych fryzur</h3>
                    <p style="color: #6b7280; margin-top: 10px;">Dodaj fryzury do ulubionych klikając serduszko</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = filtered.map(hairstyle => 
            this.renderParentCard(hairstyle, state)
        ).join('');
        
        this.attachEventListeners(state);
    }};