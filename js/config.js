/**
 * Konfiguracja aplikacji Katalog Fryzur Męskich
 */

const CONFIG = {
    // Klucze localStorage
    storageKey: 'hairstyles_catalog',
    favoritesKey: 'hairstyles_favorites',
    
    // Ustawienia zdjęć
    maxImageSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    
    // Czas animacji (ms)
    animationDuration: 300,
    
    // Domyślne wartości dla nowych fryzur
    defaultEmoji: '✂️',
    defaultAttributes: {
        sides: 'mid-fade',
        top: 'with-volume',
        bangs: 'with-texture',
        style: 'modern'
    },
    
    // Opcje filtrowania
    filterOptions: {
        length: ['Krótkie', 'Średnie', 'Długie'],
        style: ['Klasyczny', 'Nowoczesny', 'Retro', 'Alternatywny', 'Sportowy']
    },
    
    // Opcje buildera
    builderOptions: {
        sides: [
            { value: 'mid-fade', label: 'Mid fade (średnie wygolenie)' },
            { value: 'low-fade', label: 'Low fade (niskie wygolenie)' },
            { value: 'high-fade', label: 'High fade (wysokie wygolenie)' },
            { value: 'undercut', label: 'Undercut (podcięcie)' },
            { value: 'uniform', label: 'Jednolite' },
            { value: 'long', label: 'Długie' }
        ],
        top: [
            { value: 'with-volume', label: 'Z objętością' },
            { value: 'slick', label: 'Zaczesane' },
            { value: 'textured', label: 'Teksturowane' },
            { value: 'messy', label: 'Rozczochrane' },
            { value: 'short', label: 'Krótkie' },
            { value: 'long', label: 'Długie' }
        ],
        bangs: [
            { value: 'with-texture', label: 'Z teksturą' },
            { value: 'swept', label: 'Zaczesana' },
            { value: 'curtain', label: 'Kurtynowa' },
            { value: 'none', label: 'Brak' },
            { value: 'long', label: 'Długa' }
        ],
        style: [
            { value: 'modern', label: 'Nowoczesny' },
            { value: 'classic', label: 'Klasyczny' },
            { value: 'retro', label: 'Retro' },
            { value: 'alternative', label: 'Alternatywny' }
        ]
    },
    
    // Wagi dla algorytmu dopasowywania (muszą sumować się do 100)
    matchingWeights: {
        sides: 25,
        top: 25,
        bangs: 25,
        style: 25
    },
    
    // Komunikaty
    messages: {
        deleteConfirm: 'Czy na pewno chcesz usunąć tę fryzurę?',
        saveSuccess: 'Fryzura została zapisana pomyślnie!',
        deleteSuccess: 'Fryzura została usunięta.',
        validationError: 'Proszę wypełnić wszystkie wymagane pola.',
        imageTooBig: 'Plik jest za duży. Maksymalny rozmiar to 5MB.',
        imageInvalidType: 'Nieprawidłowy format pliku. Dozwolone formaty: JPG, PNG, GIF, WebP.'
    },
    
    // Debug mode
    debug: false
};

// Funkcja do logowania w trybie debug
CONFIG.log = function(...args) {
    if (this.debug) {
        console.log('[Katalog Fryzur]', ...args);
    }
};

// Eksport dla modułów (jeśli używane)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
