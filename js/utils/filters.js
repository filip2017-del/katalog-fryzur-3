/**
 * Moduł funkcji filtrowania
 * Zawiera dodatkowe funkcje pomocnicze do filtrowania danych
 * (opcjonalny - główne filtrowanie jest w catalog.js)
 */

const Filters = {
    /**
     * Filtruje fryzury według długości
     */
    filterByLength(hairstyles, length) {
        if (length === 'all') {
            return hairstyles;
        }
        return hairstyles.filter(h => h.tags.includes(length));
    },

    /**
     * Filtruje fryzury według stylu
     */
    filterByStyle(hairstyles, style) {
        if (style === 'all') {
            return hairstyles;
        }
        return hairstyles.filter(h => h.tags.includes(style));
    },

    /**
     * Filtruje fryzury według wielu kryteriów
     */
    filterMultiple(hairstyles, criteria) {
        return hairstyles.filter(hairstyle => {
            // Sprawdź każde kryterium
            for (let key in criteria) {
                if (criteria[key] === 'all') continue;
                
                if (!hairstyle.tags.includes(criteria[key])) {
                    return false;
                }
            }
            return true;
        });
    },

    /**
     * Wyszukuje fryzury według nazwy
     */
    searchByName(hairstyles, query) {
        if (!query || query.trim() === '') {
            return hairstyles;
        }
        
        const lowerQuery = query.toLowerCase().trim();
        return hairstyles.filter(h => 
            h.name.toLowerCase().includes(lowerQuery)
        );
    },

    /**
     * Wyszukuje fryzury według opisu
     */
    searchByDescription(hairstyles, query) {
        if (!query || query.trim() === '') {
            return hairstyles;
        }
        
        const lowerQuery = query.toLowerCase().trim();
        return hairstyles.filter(h => 
            h.description.toLowerCase().includes(lowerQuery)
        );
    },

    /**
     * Wyszukuje w nazwach i opisach
     */
    searchAll(hairstyles, query) {
        if (!query || query.trim() === '') {
            return hairstyles;
        }
        
        const lowerQuery = query.toLowerCase().trim();
        return hairstyles.filter(h => 
            h.name.toLowerCase().includes(lowerQuery) ||
            h.description.toLowerCase().includes(lowerQuery)
        );
    },

    /**
     * Sortuje fryzury według nazwy
     */
    sortByName(hairstyles, ascending = true) {
        return [...hairstyles].sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return ascending ? comparison : -comparison;
        });
    },

    /**
     * Sortuje według popularności (liczby w ulubionych)
     */
    sortByPopularity(hairstyles, favorites) {
        return [...hairstyles].sort((a, b) => {
            const aCount = favorites.includes(a.id) ? 1 : 0;
            const bCount = favorites.includes(b.id) ? 1 : 0;
            return bCount - aCount;
        });
    },

    /**
     * Pobiera unikalne wartości tagów
     */
    getUniqueTags(hairstyles) {
        const allTags = hairstyles.flatMap(h => h.tags);
        return [...new Set(allTags)].sort();
    },

    /**
     * Zlicza fryzury według tagu
     */
    countByTag(hairstyles, tag) {
        return hairstyles.filter(h => h.tags.includes(tag)).length;
    },

    /**
     * Zwraca statystyki tagów
     */
    getTagStatistics(hairstyles) {
        const tags = this.getUniqueTags(hairstyles);
        return tags.map(tag => ({
            tag: tag,
            count: this.countByTag(hairstyles, tag)
        }));
    },

    /**
     * Filtruje ulubione fryzury
     */
    getFavorites(hairstyles, favoriteIds) {
        return hairstyles.filter(h => favoriteIds.includes(h.id));
    },

    /**
     * Paginacja wyników
     */
    paginate(hairstyles, page = 1, perPage = 9) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        
        return {
            items: hairstyles.slice(start, end),
            currentPage: page,
            totalPages: Math.ceil(hairstyles.length / perPage),
            totalItems: hairstyles.length,
            hasNext: end < hairstyles.length,
            hasPrev: page > 1
        };
    }
};

// Eksport dla modułów (jeśli używane)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Filters;
}
