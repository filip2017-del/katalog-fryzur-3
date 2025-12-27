/**
 * Komponent Builder - dopasowuje fryzury na podstawie kryteriów
 */

const Builder = {
    /**
     * Renderuje builder z wynikiem dopasowania
     */
    render(state) {
        const match = Matching.findBestMatch(
            state.builderCriteria,
            state.hairstyles
        );
        
        if (!match || !match.hairstyle) {
            this.renderNoResults();
            return;
        }
        
        const result = document.getElementById('match-result');
        result.innerHTML = this.renderMatch(match);
    },

    /**
     * Renderuje brak wyników
     */
    renderNoResults() {
        const result = document.getElementById('match-result');
        result.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">😔</div>
                <h3 style="color: #9ca3af;">Brak dostępnych fryzur</h3>
                <p style="color: #6b7280; margin-top: 10px;">
                    Dodaj fryzury w panelu administratora
                </p>
            </div>
        `;
    },

    /**
     * Renderuje dopasowaną fryzurę
     */
    renderMatch(match) {
        const hairstyle = match.hairstyle;
        const score = match.score;
        const message = Matching.getMatchMessage(score);
        
        const imageHtml = hairstyle.image 
            ? `<img src="${hairstyle.image}" alt="${hairstyle.name}">`
            : hairstyle.emoji;

        return `
            <div class="match-header">
                <h3>Najlepsze dopasowanie:</h3>
                <div class="match-score">${score}% dopasowania</div>
            </div>
            
            <div class="match-image">
                ${imageHtml}
            </div>
            
            <h4 style="font-size: 1.8rem; margin-bottom: 10px; color: #fff;">
                ${hairstyle.name}
            </h4>
            
            <p style="color: #d1d5db; margin-bottom: 15px; line-height: 1.6;">
                ${hairstyle.description}
            </p>
            
            <div class="match-details">
                <p class="card-info">
                    <strong>Długość:</strong> ${hairstyle.length}
                </p>
                <p class="card-info">
                    <strong>Styl:</strong> ${hairstyle.style}
                </p>
            </div>
            
            <div class="match-alert alert-${message.type}">
                ${message.text}
            </div>
            
            ${this.renderMatchDetails(hairstyle, match.score)}
        `;
    },

    /**
     * Renderuje szczegóły dopasowania
     */
    renderMatchDetails(hairstyle, score) {
        if (score === 100) {
            return '';
        }

        return `
            <div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                <h4 style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 10px;">
                    Aktualne dopasowanie atrybutów:
                </h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 0.85rem;">
                    ${this.renderAttributeMatch(hairstyle.attributes.sides, 'Boki')}
                    ${this.renderAttributeMatch(hairstyle.attributes.top, 'Góra')}
                    ${this.renderAttributeMatch(hairstyle.attributes.bangs, 'Grzywka')}
                    ${this.renderAttributeMatch(hairstyle.attributes.style, 'Styl')}
                </div>
            </div>
        `;
    },

    /**
     * Renderuje dopasowanie pojedynczego atrybutu
     */
    renderAttributeMatch(value, label) {
        return `
            <div style="color: #d1d5db;">
                <strong style="color: #14b8a6;">${label}:</strong> ${this.formatAttributeValue(value)}
            </div>
        `;
    },

    /**
     * Formatuje wartość atrybutu do wyświetlenia
     */
    formatAttributeValue(value) {
        const labels = {
            'mid-fade': 'Mid fade',
            'low-fade': 'Low fade',
            'high-fade': 'High fade',
            'undercut': 'Undercut',
            'uniform': 'Jednolite',
            'long': 'Długie',
            'with-volume': 'Z objętością',
            'slick': 'Zaczesane',
            'textured': 'Teksturowane',
            'messy': 'Rozczochrane',
            'short': 'Krótkie',
            'with-texture': 'Z teksturą',
            'swept': 'Zaczesana',
            'curtain': 'Kurtynowa',
            'none': 'Brak',
            'modern': 'Nowoczesny',
            'classic': 'Klasyczny',
            'retro': 'Retro',
            'alternative': 'Alternatywny'
        };
        
        return labels[value] || value;
    }
};
