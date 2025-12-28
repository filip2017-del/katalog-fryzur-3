/**
 * Początkowe dane fryzur
 * Każda fryzura zawiera:
 * - id: unikalny identyfikator
 * - name: nazwa fryzury
 * - length: długość włosów
 * - style: styl fryzury
 * - description: opis
 * - tags: tagi do filtrowania
 * - image: URL do zdjęcia (null jeśli brak)
 * - emoji: emoji jako placeholder
 * - attributes: atrybuty do dopasowywania w builderze
 */

// Ten plik nie zawiera już danych fryzur. Wszystkie fryzury są ładowane z data/hairstyles.json.

// Funkcja do generowania nowego ID
function generateNewId(existingHairstyles) {
    if (!existingHairstyles || existingHairstyles.length === 0) {
        return 1;
    }
    return Math.max(...existingHairstyles.map(h => h.id)) + 1;
}

// Funkcja do walidacji struktury fryzury
function validateHairstyle(hairstyle) {
    const required = ['id', 'name', 'description'];
    for (const field of required) {
        if (!hairstyle[field]) {
            console.error(`Brak wymaganego pola: ${field}`);
            return false;
        }
    }
    
    if (!hairstyle.attributes || typeof hairstyle.attributes !== 'object') {
        console.error('Brak lub nieprawidłowe atrybuty');
        return false;
    }
    
    return true;
}

// Eksport dla modułów (jeśli używane)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        INITIAL_HAIRSTYLES,
        getInitialHairstyles,
        generateNewId,
        validateHairstyle
    };
}