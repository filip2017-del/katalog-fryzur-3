/**
 * Moduł zarządzania localStorage
 * Obsługuje zapisywanie, odczytywanie i usuwanie danych
 */

const Storage = {
    /**
     * Zapisuje dane do localStorage
     * @param {string} key - Klucz
     * @param {any} data - Dane do zapisania
     * @returns {boolean} - Czy operacja się powiodła
     */
    save(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            CONFIG.log('Zapisano dane:', key);
            return true;
        } catch (error) {
            console.error('Błąd podczas zapisywania do localStorage:', error);
            return false;
        }
    },

    /**
     * Odczytuje dane z localStorage
     * @param {string} key - Klucz
     * @param {any} defaultValue - Wartość domyślna jeśli brak danych
     * @returns {any} - Odczytane dane lub wartość domyślna
     */
    load(key, defaultValue = null) {
        try {
            const jsonData = localStorage.getItem(key);
            if (jsonData === null) {
                CONFIG.log('Brak danych dla klucza:', key);
                return defaultValue;
            }
            const data = JSON.parse(jsonData);
            CONFIG.log('Odczytano dane:', key);
            return data;
        } catch (error) {
            console.error('Błąd podczas odczytu z localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Usuwa dane z localStorage
     * @param {string} key - Klucz
     * @returns {boolean} - Czy operacja się powiodła
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            CONFIG.log('Usunięto dane:', key);
            return true;
        } catch (error) {
            console.error('Błąd podczas usuwania z localStorage:', error);
            return false;
        }
    },

    /**
     * Sprawdza czy klucz istnieje w localStorage
     * @param {string} key - Klucz
     * @returns {boolean} - Czy klucz istnieje
     */
    exists(key) {
        return localStorage.getItem(key) !== null;
    },

    /**
     * Czyści całą localStorage (ostrożnie!)
     * @returns {boolean} - Czy operacja się powiodła
     */
    clear() {
        try {
            localStorage.clear();
            CONFIG.log('Wyczyszczono localStorage');
            return true;
        } catch (error) {
            console.error('Błąd podczas czyszczenia localStorage:', error);
            return false;
        }
    },

    /**
     * Zwraca rozmiar danych w localStorage (w bajtach)
     * @returns {number} - Rozmiar w bajtach
     */
    getSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    },

    /**
     * Zwraca rozmiar w czytelnym formacie
     * @returns {string} - Rozmiar jako string (np. "1.5 KB")
     */
    getSizeFormatted() {
        const bytes = this.getSize();
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
};

// Funkcje specyficzne dla aplikacji

/**
 * Zapisuje fryzury do localStorage
 * @param {Array} hairstyles - Tablica fryzur
 */
function saveHairstyles(hairstyles) {
    return Storage.save(CONFIG.storageKey, hairstyles);
}

/**
 * Wczytuje fryzury z localStorage
 * @returns {Array} - Tablica fryzur
 */
function loadHairstyles() {
    // Ładuj fryzury tylko z pliku JSON (asynchronicznie)
    // UWAGA: Funkcja zwraca Promise!
    return fetch('data/hairstyles.json')
        .then(response => response.json())
        .then(data => Array.isArray(data.hairstyles) ? data.hairstyles : [])
        .catch(err => {
            console.error('Błąd ładowania fryzur z JSON:', err);
            return [];
        });
}

/**
 * Zapisuje ulubione fryzury
 * @param {Array} favorites - Tablica ID ulubionych fryzur
 */
function saveFavorites(favorites) {
    return Storage.save(CONFIG.favoritesKey, favorites);
}

/**
 * Wczytuje ulubione fryzury
 * @returns {Array} - Tablica ID ulubionych fryzur
 */
function loadFavorites() {
    const stored = Storage.load(CONFIG.favoritesKey);
    return stored && Array.isArray(stored) ? stored : [];
}

/**
 * Resetuje dane do wartości początkowych
 */
function resetToDefaults() {
    if (confirm('Czy na pewno chcesz zresetować wszystkie dane?')) {
        saveHairstyles(getInitialHairstyles());
        saveFavorites([]);
        CONFIG.log('Dane zresetowane do wartości początkowych');
        return true;
    }
    return false;
}

/**
 * Eksportuje dane jako JSON
 * @returns {string} - JSON z wszystkimi danymi
 */
function exportData() {
    const data = {
        hairstyles: loadHairstyles(),
        favorites: loadFavorites(),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    return JSON.stringify(data, null, 2);
}

/**
 * Importuje dane z JSON
 * @param {string} jsonString - JSON z danymi
 * @returns {boolean} - Czy import się powiódł
 */
function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        
        if (data.hairstyles && Array.isArray(data.hairstyles)) {
            saveHairstyles(data.hairstyles);
        }
        
        if (data.favorites && Array.isArray(data.favorites)) {
            saveFavorites(data.favorites);
        }
        
        CONFIG.log('Dane zaimportowane pomyślnie');
        return true;
    } catch (error) {
        console.error('Błąd podczas importu danych:', error);
        return false;
    }
}

// Eksport dla modułów (jeśli używane)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Storage,
        saveHairstyles,
        loadHairstyles,
        saveFavorites,
        loadFavorites,
        resetToDefaults,
        exportData,
        importData
    };
}
