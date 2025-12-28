/**
 * Główna logika aplikacji Katalog Fryzur Męskich
 * Zarządza stanem aplikacji i koordynuje wszystkie moduły
 */

const App = {
    // Stan aplikacji
    state: {
        hairstyles: [],
        favorites: [],
        currentTab: 'catalog',
        filters: {
            length: 'all',
            style: 'all'
        },
        builderCriteria: {
            sides: 'mid-fade',
            top: 'with-volume',
            bangs: 'with-texture',
            style: 'modern'
        },
        editingHairstyle: null
    },

    /**
     * Inicjalizacja aplikacji
     */
    init() {
        CONFIG.log('Inicjalizacja aplikacji...');
        // Wczytaj dane asynchronicznie
        this.loadData().then(() => {
            this.initTabs();
            this.initCatalog();
            this.initBuilder();
            this.initAdmin();
            this.initModal();
            this.renderCurrentTab();
            CONFIG.log('Aplikacja zainicjalizowana pomyślnie');
        });
    },

    /**
     * Wczytuje dane z localStorage
     */
    loadData() {
        // Asynchroniczne ładowanie fryzur z JSON
        return loadHairstyles().then(hairstyles => {
            this.state.hairstyles = hairstyles;
            this.state.favorites = loadFavorites();
            CONFIG.log('Wczytano dane:', {
                hairstyles: this.state.hairstyles.length,
                favorites: this.state.favorites.length
            });
        });
    },

    /**
     * Zapisuje dane do localStorage
     */
    saveData() {
        saveHairstyles(this.state.hairstyles);
        saveFavorites(this.state.favorites);
        CONFIG.log('Zapisano dane');
    },

    /**
     * Inicjalizuje system zakładek
     */
    initTabs() {
        // Użyj event delegation aby obsłużyć wszystkie nav-tab przyciski
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.nav-tab');
            if (button) {
                const tabName = button.dataset.tab;
                if (tabName) {
                    e.preventDefault();
                    this.switchTab(tabName);
                }
            }
        });
    },

    /**
     * Przełącza zakładkę
     */
    switchTab(tabName) {
        this.state.currentTab = tabName;
        
        // Aktualizuj nawigację
        document.querySelectorAll('.nav-tab').forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Aktualizuj sekcje
        document.querySelectorAll('.content-section').forEach(section => {
            if (section.id === tabName) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Renderuj odpowiednią sekcję
        this.renderCurrentTab();
        
        CONFIG.log('Przełączono na zakładkę:', tabName);
    },

    /**
     * Renderuje aktualnie aktywną zakładkę
     */
    renderCurrentTab() {
        if (this.state.currentTab === 'catalog') {
            Catalog.render(this.state);
        } else if (this.state.currentTab === 'builder') {
            Builder.render(this.state);
            // Dodatkowo czyścimy katalog-grid, by nie był widoczny
            const grid = document.getElementById('catalog-grid');
            if (grid) grid.innerHTML = '';
        } else if (this.state.currentTab === 'admin') {
            Admin.render(this.state);
            // Dodatkowo czyścimy katalog-grid, by nie był widoczny
            const grid = document.getElementById('catalog-grid');
            if (grid) grid.innerHTML = '';
        }
    },

    /**
     * Inicjalizuje katalog
     */
    initCatalog() {
        // Toggle filtry
        document.getElementById('toggle-filters-btn').addEventListener('click', () => {
            const panel = document.getElementById('filters-panel');
            panel.classList.toggle('collapsed');
        });
        
        // Filtry
        document.getElementById('filter-length').addEventListener('change', (e) => {
            this.state.filters.length = e.target.value;
            if (this.state.currentTab === 'catalog') {
                Catalog.render(this.state);
            }
        });
        
        document.getElementById('filter-style').addEventListener('change', (e) => {
            this.state.filters.style = e.target.value;
            if (this.state.currentTab === 'catalog') {
                Catalog.render(this.state);
            }
        });
        
        // Przycisk polubionych
        const favoritesBtn = document.getElementById('favorites-filter-btn');
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', () => {
                Catalog.showFavorites(this.state);
            });
        }
    },

    /**
     * Inicjalizuje builder
     */
    initBuilder() {
        const builderSelects = ['sides', 'top', 'bangs', 'style'];
        
        builderSelects.forEach(key => {
            const select = document.getElementById(`builder-${key}`);
            if (select) {
                select.addEventListener('change', (e) => {
                    this.state.builderCriteria[key] = e.target.value;
                    Builder.render(this.state);
                });
            }
        });
    },

    /**
     * Inicjalizuje panel admin
     */
    initAdmin() {
        document.getElementById('add-hairstyle-btn').addEventListener('click', () => {
            this.state.editingHairstyle = null;
            Modal.open(null);
        });

        // Eksport JSON (góra i dół)
        const exportBtns = [
            document.getElementById('export-json-btn'),
            document.getElementById('export-json-btn-bottom')
        ].filter(Boolean);
        exportBtns.forEach(exportBtn => {
            exportBtn.addEventListener('click', () => {
                const data = {
                    version: '1.0',
                    lastUpdated: new Date().toISOString().slice(0, 10),
                    hairstyles: this.state.hairstyles
                };
                const json = JSON.stringify(data, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'hairstyles.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        });

        // Inicjalizuj edytor relacji
        if (document.getElementById('relations-editor')) {
            RelationsEditor.render(this.state);
        }
    },

    /**
     * Inicjalizuje modal
     */
    initModal() {
                // Obsługa duplikowania fryzury
                const duplicateBtn = document.getElementById('modal-duplicate');
                if (duplicateBtn) {
                    duplicateBtn.addEventListener('click', () => {
                        if (!this.state.editingHairstyle) return;
                        const orig = this.state.editingHairstyle;
                        // Głęboka kopia bez referencji do parentIds/childrenIds
                        const copy = JSON.parse(JSON.stringify(orig));
                        // Nowe id: max istniejące + 1
                        const newId = Math.max(...this.state.hairstyles.map(h => h.id)) + 1;
                        copy.id = newId;
                        copy.name = orig.name + ' (kopia)';
                        // Usuwamy powiązania z rodzicami/dziećmi
                        copy.parentIds = Array.isArray(copy.parentIds) ? [] : copy.parentIds;
                        copy.childrenIds = Array.isArray(copy.childrenIds) ? [] : copy.childrenIds;
                        this.state.hairstyles.push(copy);
                        this.saveData();
                        Modal.close();
                        this.renderCurrentTab();
                    });
                }
        document.getElementById('modal-close').addEventListener('click', () => {
            Modal.close();
        });
        
        document.getElementById('modal-cancel').addEventListener('click', () => {
            Modal.close();
        });
        
        // Obsługa przesyłania zdjęć
        document.getElementById('image-input').addEventListener('change', (e) => {
            Modal.handleImageUpload(e);
        });
        
        // Obsługa formularza
        document.getElementById('hairstyle-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    },

    /**
     * Obsługuje zapisywanie formularza
     */
    handleFormSubmit() {
        const formData = Modal.getFormData();
        
        if (!formData) return;
        
        if (this.state.editingHairstyle) {
            // Edycja istniejącej fryzury
            const index = this.state.hairstyles.findIndex(
                h => h.id === this.state.editingHairstyle.id
            );
            
            if (index !== -1) {
                this.state.hairstyles[index] = {
                    ...this.state.hairstyles[index],
                    ...formData
                };
            }
        } else {
            // Dodawanie nowej fryzury
            const newId = generateNewId(this.state.hairstyles);
            const newHairstyle = {
                id: newId,
                ...formData
            };
            
            // Dodaj domyślne atrybuty jeśli nie zostały podane
            if (!newHairstyle.attributes || !newHairstyle.attributes.sides) {
                newHairstyle.attributes = newHairstyle.attributes || {};
                if (!newHairstyle.attributes.sides) newHairstyle.attributes.sides = 'mid-fade';
                if (!newHairstyle.attributes.top) newHairstyle.attributes.top = 'with-volume';
                if (!newHairstyle.attributes.bangs) newHairstyle.attributes.bangs = 'swept';
                if (!newHairstyle.attributes.style) newHairstyle.attributes.style = 'modern';
            }
            
            this.state.hairstyles.push(newHairstyle);
        }
        
        this.saveData();
        Modal.close();
        this.renderCurrentTab();
    },

    /**
     * Dodaje/usuwa z ulubionych
     */
    toggleFavorite(id) {
        const index = this.state.favorites.indexOf(id);
        
        if (index > -1) {
            this.state.favorites.splice(index, 1);
        } else {
            this.state.favorites.push(id);
        }
        
        this.saveData();
        if (this.state.currentTab === 'catalog') {
            Catalog.render(this.state);
        }
    },

    /**
     * Otwiera fryzurę do edycji
     */
    editHairstyle(id) {
        const hairstyle = this.state.hairstyles.find(h => h.id === id);
        if (hairstyle) {
            this.state.editingHairstyle = hairstyle;
            Modal.open(hairstyle);
        }
    },

    /**
     * Usuwa fryzurę
     */
    deleteHairstyle(id) {
        if (confirm(CONFIG.messages.deleteConfirm)) {
            this.state.hairstyles = this.state.hairstyles.filter(h => h.id !== id);
            
            // Usuń też z ulubionych
            const favIndex = this.state.favorites.indexOf(id);
            if (favIndex > -1) {
                this.state.favorites.splice(favIndex, 1);
            }
            
            this.saveData();
            this.renderCurrentTab();
        }
    }
};

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Globalny dostęp do aplikacji (dla debugowania)
window.App = App;
