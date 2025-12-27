/**
 * Komponent Modal - obsługa formularza edycji/dodawania fryzur
 */

const Modal = {
    currentImage: null,

    /**
     * Otwiera modal
     */
    open(hairstyle = null) {
        const modal = document.getElementById('modal');
        const title = document.getElementById('modal-title');
        
        if (hairstyle) {
            // Tryb edycji
            title.textContent = 'Edytuj fryzurę';
            this.fillForm(hairstyle);
        } else {
            // Tryb dodawania
            title.textContent = 'Dodaj nową fryzurę';
            this.resetForm();
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Zablokuj scroll
    },

    /**
     * Zamyka modal
     */
    close() {
        const modal = document.getElementById('modal');
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Przywróć scroll
        this.currentImage = null;
        this.resetForm();
    },

    /**
     * Wypełnia formularz danymi fryzury
     */
    fillForm(hairstyle) {
        document.getElementById('form-name').value = hairstyle.name || '';
        document.getElementById('form-length').value = hairstyle.length || '';
        document.getElementById('form-style').value = hairstyle.style || '';
        document.getElementById('form-description').value = hairstyle.description || '';
        document.getElementById('form-tags').value = hairstyle.tags ? hairstyle.tags.join(', ') : '';
        document.getElementById('form-type').value = hairstyle.type || '';
        document.getElementById('form-emoji').value = hairstyle.emoji || '';
        
        // Atrybuty
        if (hairstyle.attributes) {
            document.getElementById('form-sides').value = hairstyle.attributes.sides || '';
            document.getElementById('form-top').value = hairstyle.attributes.top || '';
            document.getElementById('form-bangs').value = hairstyle.attributes.bangs || '';
            document.getElementById('form-attr-style').value = hairstyle.attributes.style || '';
        }
        
        // IDs wariantów i rodziców
        if (hairstyle.childrenIds) {
            document.getElementById('form-childrenIds').value = hairstyle.childrenIds.join(', ');
        }
        if (hairstyle.parentIds) {
            document.getElementById('form-parentIds').value = hairstyle.parentIds.join(', ');
        }
        
        // Pokaż zdjęcie lub emoji
        const preview = document.getElementById('form-image-preview');
        if (hairstyle.image) {
            preview.innerHTML = `<img src="${hairstyle.image}" alt="${hairstyle.name}">`;
            this.currentImage = hairstyle.image;
        } else {
            preview.textContent = hairstyle.emoji || CONFIG.defaultEmoji;
        }
    },

    /**
     * Resetuje formularz
     */
    resetForm() {
        document.getElementById('hairstyle-form').reset();
        document.getElementById('form-image-preview').textContent = CONFIG.defaultEmoji;
        this.currentImage = null;
    },

    /**
     * Obsługuje przesyłanie zdjęcia
     */
    handleImageUpload(event) {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }
        
        // Walidacja rozmiaru
        if (file.size > CONFIG.maxImageSize) {
            alert(CONFIG.messages.imageTooBig);
            return;
        }
        
        // Walidacja typu
        if (!CONFIG.allowedImageTypes.includes(file.type)) {
            alert(CONFIG.messages.imageInvalidType);
            return;
        }
        
        // Odczytaj i wyświetl zdjęcie
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const preview = document.getElementById('form-image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            this.currentImage = e.target.result;
        };
        
        reader.onerror = () => {
            alert('Błąd podczas wczytywania zdjęcia');
        };
        
        reader.readAsDataURL(file);
    },

    /**
     * Pobiera dane z formularza
     */
    getFormData() {
        const name = document.getElementById('form-name').value.trim();
        const length = document.getElementById('form-length').value.trim();
        const style = document.getElementById('form-style').value.trim();
        const description = document.getElementById('form-description').value.trim();
        const tagsString = document.getElementById('form-tags').value.trim();
        const type = document.getElementById('form-type').value.trim();
        const emoji = document.getElementById('form-emoji').value.trim();
        
        // Walidacja
        if (!name || !description) {
            alert(CONFIG.messages.validationError);
            return null;
        }
        
        const tags = tagsString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        
        // Atrybuty
        const attributes = {
            sides: document.getElementById('form-sides').value || '',
            top: document.getElementById('form-top').value || '',
            bangs: document.getElementById('form-bangs').value || '',
            style: document.getElementById('form-attr-style').value || ''
        };
        
        // Parsuj IDs
        const parseIds = (str) => {
            return str
                .split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id));
        };
        
        const childrenIds = parseIds(document.getElementById('form-childrenIds').value);
        const parentIds = parseIds(document.getElementById('form-parentIds').value);
        
        const formData = {
            name,
            length,
            style,
            description,
            tags,
            image: this.currentImage,
            type: type || undefined,
            emoji: emoji || CONFIG.defaultEmoji,
            attributes
        };
        
        if (childrenIds.length > 0) {
            formData.childrenIds = childrenIds;
        }
        if (parentIds.length > 0) {
            formData.parentIds = parentIds;
        }
        
        return formData;
    },

    /**
     * Waliduje formularz
     */
    validateForm() {
        const name = document.getElementById('form-name').value.trim();
        const description = document.getElementById('form-description').value.trim();
        
        if (!name) {
            this.showFieldError('form-name', 'Nazwa jest wymagana');
            return false;
        }
        
        if (!description) {
            this.showFieldError('form-description', 'Opis jest wymagany');
            return false;
        }
        
        return true;
    },

    /**
     * Pokazuje błąd walidacji pola
     */
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.style.borderColor = '#ef4444';
        
        // Usuń błąd po zmianie wartości
        field.addEventListener('input', () => {
            field.style.borderColor = '';
        }, { once: true });
        
        alert(message);
    }
};
