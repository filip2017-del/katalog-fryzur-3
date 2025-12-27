# Katalog Fryzur Męskich

Interaktywna aplikacja webowa do przeglądania, filtrowania i wyszukiwania fryzur męskich.

## ✨ Funkcjonalności

- **Katalog Fryzur** - Przegląd wszystkich fryzur z możliwością filtrowania
- **Warianty** - Przeglądanie wariantów wybranej fryzury
- **Widok Drzewa** - Hierarchiczny widok fryzur z ich wariantami
- **Builder** - Zaawansowany system rekomendacji fryzur na podstawie preferencji
- **Ulubione** - Zapisywanie i przeglądanie polubionych fryzur
- **Admin** - Panel edytora do zarządzania fryzurami (CRUD)
- **Responsywny Design** - Optymalizacja dla urządzeń mobilnych i desktopowych

## 🛠️ Technologia

- **HTML5** - Struktura aplikacji
- **CSS3** - Stylizacja z efektami i animacjami
- **Vanilla JavaScript** - Logika aplikacji bez zależności zewnętrznych
- **localStorage** - Przechowywanie danych i ulubionych

## 📁 Struktura Projektu

```
katalog/
├── index.html              # Główna strona HTML
├── css/
│   ├── style.css          # Stylizacja główna
│   ├── components.css     # Komponenty UI
│   └── responsive.css     # Media queries
├── js/
│   ├── app.js             # Główna logika aplikacji
│   ├── config.js          # Konfiguracja
│   ├── hairstyles-data.js # Baza danych fryzur
│   ├── components/
│   │   ├── catalog.js     # Komponent katalog
│   │   ├── builder.js     # Komponent builder
│   │   ├── admin.js       # Komponent admin
│   │   └── modal.js       # Komponent modal
│   └── utils/
│       ├── storage.js     # Zarządzanie localStorage
│       ├── filters.js     # Funkcje filtrowania
│       └── matching.js    # Algorytm matchingu
├── data/
│   └── hairstyles.json    # Backup bazy danych
└── images/                # Obrazki fryzur
```

## 🚀 Instalacja i Uruchomienie

1. Klonuj repozytorium:
```bash
git clone https://github.com/twoj-login/katalog.git
cd katalog
```

2. Uruchom lokalny serwer:
```bash
python3 -m http.server 8000
```

3. Otwórz w przeglądarce:
```
http://localhost:8000
```

## 📊 Struktura Danych Fryzury

```javascript
{
  id: 1,
  name: 'Pompadour',
  length: 'Krótkie, Średnie',
  style: 'Klasyczny, Retro',
  description: 'Opis fryzury...',
  tags: ['Średnie', 'Klasyczny'],
  image: 'images/pompadour.jpg',
  emoji: '👨‍🦱',
  type: 'parent',           // 'parent' lub 'child'
  childrenIds: [11, 12, 13],
  parentIds: [],
  attributes: {
    sides: 'mid-fade',
    top: 'with-volume',
    bangs: 'swept',
    style: 'classic'
  }
}
```

## 🎨 Komponenty

### Catalog
Wyświetla listę fryzur w trzech widokach:
- **Main** - Główny katalog (tylko rodzice)
- **Variants** - Warianty wybranej fryzury
- **Tree** - Hierarchiczny widok drzewa
- **Favorites** - Polubione fryzury

### Builder
System rekomendacji na podstawie:
- Boki (sides)
- Góra (top)
- Grzywka (bangs)
- Styl (style)

### Admin
Zarządzanie fryzurami:
- Dodawanie nowych
- Edycja istniejących
- Usuwanie
- Edycja wszystkich właściwości w JSON

### Modal
Formularz do edycji/dodawania fryzur z:
- Przesyłaniem obrazków
- Edycją atrybutów
- Zarządzaniem relacjami parent/child

## 💾 Przechowywanie Danych

- Fryzury są przechowywane w `localStorage` pod kluczem `hairstyles`
- Ulubione są przechowywane w `localStorage` pod kluczem `favorites`
- Fallback do `hairstyles-data.js` jeśli localStorage jest pusty

## 📱 Responsive Design

Optymalizacja dla:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (480px - 767px)
- Small Mobile (<480px)

## 🔍 Filtrowanie

Można filtrować fryzury po:
- Długości włosów
- Stylu
- Polubionej liście

## 📝 Licencja

MIT License

## 👨‍💻 Autor

Filip
