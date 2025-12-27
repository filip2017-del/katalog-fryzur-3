/**
 * Moduł algorytmu dopasowywania fryzur
 * Znajduje najlepiej dopasowaną fryzurę na podstawie wybranych kryteriów
 */

const Matching = {
    /**
     * Oblicza wynik dopasowania dla pojedynczej fryzury
     * @param {Object} hairstyle - Fryzura do oceny
     * @param {Object} criteria - Kryteria użytkownika
     * @returns {number} - Wynik dopasowania (0-100)
     */
    calculateScore(hairstyle, criteria) {
        if (!hairstyle.attributes) {
            CONFIG.log('Brak atrybutów dla fryzury:', hairstyle.name);
            return 0;
        }

        let score = 0;
        const weights = CONFIG.matchingWeights;

        // Porównaj każdy atrybut
        if (hairstyle.attributes.sides === criteria.sides) {
            score += weights.sides;
        }
        
        if (hairstyle.attributes.top === criteria.top) {
            score += weights.top;
        }
        
        if (hairstyle.attributes.bangs === criteria.bangs) {
            score += weights.bangs;
        }
        
        if (hairstyle.attributes.style === criteria.style) {
            score += weights.style;
        }

        return score;
    },

    /**
     * Znajduje najlepiej dopasowaną fryzurę
     * @param {Object} criteria - Kryteria użytkownika
     * @param {Array} hairstyles - Tablica dostępnych fryzur
     * @returns {Object} - Obiekt z najlepszym dopasowaniem i wynikiem
     */
    findBestMatch(criteria, hairstyles) {
        if (!hairstyles || hairstyles.length === 0) {
            CONFIG.log('Brak fryzur do dopasowania');
            return null;
        }

        let bestMatch = null;
        let highestScore = -1;

        hairstyles.forEach(hairstyle => {
            const score = this.calculateScore(hairstyle, criteria);
            
            if (score > highestScore) {
                highestScore = score;
                bestMatch = hairstyle;
            }
        });

        // Jeśli nie znaleziono dopasowania, zwróć pierwszą fryzurę
        if (!bestMatch && hairstyles.length > 0) {
            bestMatch = hairstyles[0];
            highestScore = this.calculateScore(bestMatch, criteria);
        }

        CONFIG.log('Najlepsze dopasowanie:', bestMatch?.name, 'Wynik:', highestScore);

        return {
            hairstyle: bestMatch,
            score: highestScore
        };
    },

    /**
     * Znajduje wszystkie dopasowania posortowane według wyniku
     * @param {Object} criteria - Kryteria użytkownika
     * @param {Array} hairstyles - Tablica dostępnych fryzur
     * @param {number} limit - Maksymalna liczba wyników (opcjonalnie)
     * @returns {Array} - Tablica obiektów z fryzurami i wynikami
     */
    findAllMatches(criteria, hairstyles, limit = null) {
        if (!hairstyles || hairstyles.length === 0) {
            return [];
        }

        const matches = hairstyles.map(hairstyle => ({
            hairstyle: hairstyle,
            score: this.calculateScore(hairstyle, criteria)
        }));

        // Sortuj według wyniku (malejąco)
        matches.sort((a, b) => b.score - a.score);

        // Ogranicz liczbę wyników jeśli podano limit
        if (limit && limit > 0) {
            return matches.slice(0, limit);
        }

        return matches;
    },

    /**
     * Sprawdza czy dopasowanie jest doskonałe (100%)
     * @param {number} score - Wynik dopasowania
     * @returns {boolean} - Czy dopasowanie jest doskonałe
     */
    isPerfectMatch(score) {
        return score === 100;
    },

    /**
     * Zwraca kategorie jakości dopasowania
     * @param {number} score - Wynik dopasowania
     * @returns {string} - Kategoria ('excellent', 'good', 'fair', 'poor')
     */
    getMatchCategory(score) {
        if (score === 100) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 50) return 'fair';
        return 'poor';
    },

    /**
     * Zwraca komunikat dla użytkownika na podstawie wyniku
     * @param {number} score - Wynik dopasowania
     * @returns {Object} - Obiekt z komunikatem i typem
     */
    getMatchMessage(score) {
        const category = this.getMatchCategory(score);
        
        const messages = {
            excellent: {
                text: '✨ Doskonałe dopasowanie! Ta fryzura idealnie pasuje do Twoich preferencji.',
                type: 'success'
            },
            good: {
                text: '👍 Bardzo dobre dopasowanie! Ta fryzura powinna Ci się spodobać.',
                type: 'success'
            },
            fair: {
                text: '💡 To najbliższe dopasowanie. Spróbuj zmienić kryteria, aby znaleźć idealne dopasowanie.',
                type: 'warning'
            },
            poor: {
                text: '🔍 Trudno znaleźć idealne dopasowanie. Rozważ zmianę kryteriów wyszukiwania.',
                type: 'warning'
            }
        };

        return messages[category];
    },

    /**
     * Generuje szczegółowy raport dopasowania
     * @param {Object} hairstyle - Fryzura
     * @param {Object} criteria - Kryteria
     * @returns {Object} - Szczegółowy raport
     */
    getDetailedReport(hairstyle, criteria) {
        if (!hairstyle.attributes) {
            return null;
        }

        const report = {
            overallScore: this.calculateScore(hairstyle, criteria),
            matches: {
                sides: hairstyle.attributes.sides === criteria.sides,
                top: hairstyle.attributes.top === criteria.top,
                bangs: hairstyle.attributes.bangs === criteria.bangs,
                style: hairstyle.attributes.style === criteria.style
            },
            differences: []
        };

        // Znajdź różnice
        Object.keys(criteria).forEach(key => {
            if (hairstyle.attributes[key] !== criteria[key]) {
                report.differences.push({
                    attribute: key,
                    expected: criteria[key],
                    actual: hairstyle.attributes[key]
                });
            }
        });

        return report;
    }
};

// Eksport dla modułów (jeśli używane)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Matching;
}
