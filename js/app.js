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
        
        // Wyczyść stare dane jeśli istnieją i nie mają zdjęć lub type property
        const existingData = Storage.load(CONFIG.storageKey);
        if (existingData && existingData.length > 0 && (!existingData[0].image || !existingData[0].type)) {
            CONFIG.log('Usuwanie starych danych bez zdjęć lub type property...');
            Storage.remove(CONFIG.storageKey);
            Storage.remove(CONFIG.favoritesKey);
        }
        
        // Wczytaj dane
        this.loadData();
        
        // Inicjalizuj komponenty
        this.initTabs();
        this.initCatalog();
        this.initBuilder();
        this.initAdmin();
        this.initModal();
        
        // Renderuj początkowy widok
        this.renderCurrentTab();
        
        CONFIG.log('Aplikacja zainicjalizowana pomyślnie');
    },

    /**
     * Wczytuje dane z localStorage
     */
    loadData() {
        this.state.hairstyles = loadHairstyles();
        this.state.favorites = loadFavorites();
        CONFIG.log('Wczytano dane:', {
            hairstyles: this.state.hairstyles.length,
            favorites: this.state.favorites.length
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
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    },

    /**
     * Przełącza zakładkę
     */
    switchTab(tabName) {
        this.state.currentTab = tabName;
        
        // Aktualizuj nawigację
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Aktualizuj sekcje
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.toggle('active', section.id === tabName);
        });
        
        // Renderuj odpowiednią sekcję
        this.renderCurrentTab();
        
        CONFIG.log('Przełączono na zakładkę:', tabName);
    },

    /**
     * Renderuje aktualnie aktywną zakładkę
     */
    renderCurrentTab() {
        switch(this.state.currentTab) {
            case 'catalog':
                Catalog.render(this.state);
                break;
            case 'builder':
                Builder.render(this.state);
                break;
            case 'admin':
                Admin.render(this.state);
                break;
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
            Catalog.render(this.state);
        });
        
        document.getElementById('filter-style').addEventListener('change', (e) => {
            this.state.filters.style = e.target.value;
            Catalog.render(this.state);
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
    },

    /**
     * Inicjalizuje modal
     */
    initModal() {
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
        Catalog.render(this.state);
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
