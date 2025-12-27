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

const INITIAL_HAIRSTYLES = [
    {
        id: 1,
        name: 'Pompadour',
        length: 'Krótkie, Średnie',
        style: 'Klasyczny, Retro',
        description: 'Wysoka, uniesiona góra, gładkie boki. Klasyczna fryzura inspirowana latami 50.',
        tags: ['Średnie', 'Klasyczny', 'Retro'],
        image: 'images/pompadour.jpg',
        emoji: '👨‍🦱',
        type: 'parent',
        childrenIds: [11, 12, 13],
        attributes: {
            sides: 'mid-fade',
            top: 'with-volume',
            bangs: 'swept',
            style: 'classic'
        }
    },
    {
        id: 2,
        name: 'Buzz Cut',
        length: 'Krótkie',
        style: 'Nowoczesny, Sportowy',
        description: 'Bardzo krótka fryzura o równomiernej długości. Nie wymaga stylizacji, idealna na lato.',
        tags: ['Krótkie', 'Nowoczesny', 'Sportowy'],
        image: 'images/buzz_cut.jpg',
        emoji: '👨‍🦲',
        type: 'parent',
        childrenIds: [14, 15],
        attributes: {
            sides: 'uniform',
            top: 'short',
            bangs: 'none',
            style: 'modern'
        }
    },
    {
        id: 3,
        name: 'Curtain Bangs',
        length: 'Średnie',
        style: 'Nowoczesny, Retro',
        description: 'Długa grzywka podzielona na dwie części, opadająca po bokach. Powrót stylu lat 90.',
        tags: ['Średnie', 'Retro', 'Nowoczesny'],
        image: 'images/curtain_bangs.jpg',
        emoji: '👨',
        type: 'parent',
        childrenIds: [],
        attributes: {
            sides: 'mid-fade',
            top: 'textured',
            bangs: 'curtain',
            style: 'modern'
        }
    },
    {
        id: 4,
        name: 'Man Bun',
        length: 'Długie',
        style: 'Alternatywny',
        description: 'Długie włosy związane w kok na czubku głowy. Wyrazisty, nowoczesny styl.',
        tags: ['Długie', 'Alternatywny'],
        image: 'images/man_bun.jpg',
        emoji: '👨‍🦰',
        attributes: {
            sides: 'long',
            top: 'long',
            bangs: 'long',
            style: 'alternative'
        }
    },
    {
        id: 5,
        name: 'Slick Back',
        length: 'Średnie',
        style: 'Klasyczny',
        description: 'Włosy zaczesane do tyłu z użyciem mocnej stylizacji. Elegancki i profesjonalny wygląd.',
        tags: ['Średnie', 'Klasyczny'],
        image: 'images/slick_back.jpg',
        emoji: '🧔',
        attributes: {
            sides: 'mid-fade',
            top: 'slick',
            bangs: 'swept',
            style: 'classic'
        }
    },
    {
        id: 6,
        name: 'Undercut',
        length: 'Średnie',
        style: 'Nowoczesny, Alternatywny',
        description: 'Krótkie lub ogolone boki z długą górą. Kontrastowa, odważna fryzura.',
        tags: ['Średnie', 'Nowoczesny', 'Alternatywny'],
        image: 'images/undercut.jpg',
        emoji: '👨‍💼',
        type: 'parent',
        childrenIds: [16, 17, 18],
        attributes: {
            sides: 'undercut',
            top: 'with-volume',
            bangs: 'with-texture',
            style: 'modern'
        }
    },
    {
        id: 7,
        name: 'Quiff',
        length: 'Średnie',
        style: 'Nowoczesny',
        description: 'Uniesiona góra z objętością, cieniowane boki. Połączenie pompadoura i flattopa.',
        tags: ['Średnie', 'Nowoczesny'],
        image: 'images/quiff.jpg',
        emoji: '🧑',
        type: 'parent',
        childrenIds: [19],
        attributes: {
            sides: 'mid-fade',
            top: 'with-volume',
            bangs: 'with-texture',
            style: 'modern'
        }
    },
    {
        id: 8,
        name: 'Crew Cut',
        length: 'Krótkie',
        style: 'Klasyczny',
        description: 'Krótka, równomierna fryzura, nieco dłuższa na górze. Praktyczna i ponadczasowa.',
        tags: ['Krótkie', 'Klasyczny'],
        image: 'images/crew_cut.jpg',
        emoji: '👨‍✈️',
        type: 'parent',
        childrenIds: [],
        attributes: {
            sides: 'low-fade',
            top: 'short',
            bangs: 'none',
            style: 'classic'
        }
    },
    {
        id: 9,
        name: 'Mohawk',
        length: 'Średnie',
        style: 'Alternatywny',
        description: 'Wyrazisty pas włosów na środku głowy z ogolonymi bokami. Odważny, buntowniczy styl.',
        tags: ['Średnie', 'Alternatywny'],
        image: 'images/mohawk.jpg',
        emoji: '🤘',
        type: 'parent',
        childrenIds: [],
        attributes: {
            sides: 'undercut',
            top: 'with-volume',
            bangs: 'none',
            style: 'alternative'
        }
    },
    {
        id: 10,
        name: 'Fade',
        length: 'Krótkie',
        style: 'Nowoczesny',
        description: 'Stopniowo skracane włosy od góry do boków. Czysty, nowoczesny wygląd.',
        tags: ['Krótkie', 'Nowoczesny'],
        image: 'images/taper_fade.jpg',
        emoji: '💈',
        type: 'parent',
        childrenIds: [],
        attributes: {
            sides: 'high-fade',
            top: 'short',
            bangs: 'none',
            style: 'modern'
        }
    },
    // WARIANTY (DZIECI)
    {
        id: 11,
        name: 'Pompadour Nowoczesny',
        length: 'Średnie',
        style: 'Nowoczesny',
        description: 'Współczesna interpretacja klasycznego pompadoura z teksturowaną górą.',
        tags: ['Średnie', 'Nowoczesny'],
        image: 'images/short_quiff.jpg',
        emoji: '👨‍💼',
        type: 'child',
        parentIds: [1],
        attributes: {
            sides: 'high-fade',
            top: 'with-volume',
            bangs: 'swept',
            style: 'modern'
        }
    },
    {
        id: 12,
        name: 'Pompadour z Przedziałkiem',
        length: 'Średnie',
        style: 'Klasyczny',
        description: 'Elegancki pompadour z wyraźnym przedziałkiem z boku.',
        tags: ['Średnie', 'Klasyczny'],
        image: 'images/side_part.jpg',
        emoji: '🎩',
        type: 'child',
        parentIds: [1],
        attributes: {
            sides: 'mid-fade',
            top: 'with-volume',
            bangs: 'swept',
            style: 'classic'
        }
    },
    {
        id: 13,
        name: 'Pompadour Textured',
        length: 'Średnie',
        style: 'Nowoczesny',
        description: 'Pompadour z silnie teksturowaną górą dla naturalnego wyglądu.',
        tags: ['Średnie', 'Nowoczesny'],
        image: 'images/textured_fringe.jpg',
        emoji: '🌊',
        type: 'child',
        parentIds: [1, 7],
        attributes: {
            sides: 'mid-fade',
            top: 'textured',
            bangs: 'with-texture',
            style: 'modern'
        }
    },
    {
        id: 14,
        name: 'Induction Cut',
        length: 'Bardzo krótkie',
        style: 'Militarny',
        description: 'Ekstremalnie krótka wersja buzz cut, militarny styl.',
        tags: ['Krótkie', 'Sportowy'],
        image: 'images/buzz_cut2.jpg',
        emoji: '⚔️',
        type: 'child',
        parentIds: [2],
        attributes: {
            sides: 'uniform',
            top: 'short',
            bangs: 'none',
            style: 'modern'
        }
    },
    {
        id: 15,
        name: 'Butch Cut',
        length: 'Krótkie',
        style: 'Sportowy',
        description: 'Nieco dłuższy buzz cut, równy na całej głowie.',
        tags: ['Krótkie', 'Sportowy'],
        image: 'images/crew_cut.jpg',
        emoji: '🏋️',
        type: 'child',
        parentIds: [2],
        attributes: {
            sides: 'uniform',
            top: 'short',
            bangs: 'none',
            style: 'modern'
        }
    },
    {
        id: 16,
        name: 'Undercut Slicked Back',
        length: 'Średnie',
        style: 'Nowoczesny, Elegancki',
        description: 'Undercut z zaczesanymi do tyłu włosami na górze.',
        tags: ['Średnie', 'Nowoczesny'],
        image: 'images/slick_back2.jpg',
        emoji: '💼',
        type: 'child',
        parentIds: [6],
        attributes: {
            sides: 'undercut',
            top: 'slick',
            bangs: 'swept',
            style: 'modern'
        }
    },
    {
        id: 17,
        name: 'Undercut Messy',
        length: 'Średnie',
        style: 'Casualowy',
        description: 'Undercut z rozczochraną, naturalną górą.',
        tags: ['Średnie', 'Alternatywny'],
        image: 'images/shag.jpg',
        emoji: '🎸',
        type: 'child',
        parentIds: [6],
        attributes: {
            sides: 'undercut',
            top: 'messy',
            bangs: 'with-texture',
            style: 'alternative'
        }
    },
    {
        id: 18,
        name: 'Disconnected Undercut',
        length: 'Średnie',
        style: 'Nowoczesny, Ostry',
        description: 'Undercut z wyraźnym kontrastem między bokami a górą.',
        tags: ['Średnie', 'Nowoczesny'],
        image: 'images/textured_crop.jpg',
        emoji: '⚡',
        type: 'child',
        parentIds: [6],
        attributes: {
            sides: 'undercut',
            top: 'with-volume',
            bangs: 'with-texture',
            style: 'modern'
        }
    },
    {
        id: 19,
        name: 'Textured Quiff',
        length: 'Średnie',
        style: 'Casualowy',
        description: 'Quiff z mocno teksturowanymi włosami dla naturalnego efektu.',
        tags: ['Średnie', 'Nowoczesny'],
        image: 'images/quifff.jpg',
        emoji: '🌿',
        type: 'child',
        parentIds: [7, 1],
        attributes: {
            sides: 'mid-fade',
            top: 'textured',
            bangs: 'with-texture',
            style: 'modern'
        }
    }
];

// Funkcja do pobrania domyślnych danych
function getInitialHairstyles() {
    return JSON.parse(JSON.stringify(INITIAL_HAIRSTYLES)); // Deep copy
}

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