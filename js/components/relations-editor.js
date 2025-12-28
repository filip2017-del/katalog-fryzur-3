/**
 * Edytor relacji fryzur (parent-child) z drag and drop, podziałem na 3 sekcje,
 * podświetlaniem, wyszukiwarką, cofnięciem i walidacją.
 */

const RelationsEditor = {
    state: {
        search: '',
        undoStack: [],
        redoStack: [],
        dragType: null, // 'child' | 'parent'
        dragId: null,
    },

    /**
     * Renderuje cały edytor relacji
     */
    render(appState) {
        const container = document.getElementById('relations-editor');
        if (!container) return;
        // Przechowaj kopię do cofania
        this._appState = appState;
        // Filtrowanie
        const search = this.state.search.toLowerCase();
        const children = appState.hairstyles.filter(h => h.type === 'child');
        const parents = appState.hairstyles.filter(h => h.type === 'parent');
        // Niesparowane dzieci: child bez parentIds lub parentIds pusty/nieistniejący
        const unpairedChildren = children.filter(h => !h.parentIds || h.parentIds.length === 0 || h.parentIds.every(pid => !appState.hairstyles.find(x => x.id === pid)));
        // Tryb widoku dzieci: 'unpaired' (domyślnie) lub 'all'
        if (!this.state.childrenView) this.state.childrenView = 'unpaired';
        const childrenToShow = (this.state.childrenView === 'all' ? children : unpairedChildren)
            .filter(h => h.name.toLowerCase().includes(search));
        // Niesparowani rodzice: parent bez childrenIds lub childrenIds pusty/nieistniejący
        const unpairedParents = parents.filter(h => !h.childrenIds || h.childrenIds.length === 0 || h.childrenIds.every(cid => !appState.hairstyles.find(x => x.id === cid)));
        // Drzewka: parent z co najmniej jednym dzieckiem lub niesparowani rodzice
        const trees = parents.filter(h => (h.childrenIds && h.childrenIds.some(cid => appState.hairstyles.find(x => x.id === cid))) || !h.childrenIds || h.childrenIds.length === 0);

        container.innerHTML = `
            <div class="relations-toolbar">
                <input type="text" id="relations-search" placeholder="Szukaj fryzury..." value="${this.state.search || ''}" />
                <button id="relations-undo" class="btn btn-secondary" ${this.state.undoStack.length === 0 ? 'disabled' : ''}>Cofnij</button>
                <button id="relations-redo" class="btn btn-secondary" ${this.state.redoStack.length === 0 ? 'disabled' : ''}>Ponów</button>
                <span id="relations-validation"></span>
            </div>
            <div class="relations-grid">
                <div class="relations-col">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <h3 style="margin:0;">Dzieci</h3>
                        <select id="children-view-select" style="margin-left:10px;padding:4px 8px;border-radius:6px;">
                            <option value="unpaired"${this.state.childrenView === 'unpaired' ? ' selected' : ''}>Niesparowane</option>
                            <option value="all"${this.state.childrenView === 'all' ? ' selected' : ''}>Wszystkie</option>
                        </select>
                    </div>
                    <div class="relations-convert" id="convert-to-child" style="margin-bottom:10px;padding:8px;border:2px dashed #4b5563;border-radius:8px;text-align:center;color:#9ca3af;cursor:pointer;">⬇️ Zamień w dziecko</div>
                    <div class="relations-list" id="unpaired-children">
                        ${childrenToShow.map(h => this.renderItem(h, 'child')).join('')}
                    </div>
                </div>
                <div class="relations-col">
                    <h3>Drzewka i niesparowani rodzice</h3>
                    <div class="relations-convert" id="convert-to-parent-top" style="margin-bottom:12px;padding:8px;border:2px dashed #4b5563;border-radius:8px;text-align:center;color:#9ca3af;cursor:pointer;">⬆️ Zamień w rodzica</div>
                    <div class="relations-trees" id="relations-trees">
                        ${trees.filter(h => h.name.toLowerCase().includes(search)).map(parent => this.renderTree(parent, appState)).join('')}
                    </div>

                </div>
            </div>
        `;
        this.attachEvents(appState);
        this.validate(appState);
    },

    renderItem(h, type) {
        return `<div class="relations-item" draggable="true" data-id="${h.id}" data-type="${type}">
            <span>${h.name} <span style="color:#9ca3af;font-size:0.8em;">(ID: ${h.id})</span></span>
        </div>`;
    },

    renderTree(parent, appState) {
        const children = (parent.childrenIds || []).map(cid => appState.hairstyles.find(h => h.id === cid)).filter(Boolean);
        return `<div class="relations-tree" data-id="${parent.id}">
            <div class="relations-item parent" draggable="true" data-id="${parent.id}" data-type="parent">
                <span>${parent.name} <span style="color:#9ca3af;font-size:0.8em;">(ID: ${parent.id})</span></span>
            </div>
            <div class="relations-children" style="display:block;">
                ${children.map(child => this.renderItem(child, 'child')).join('')}
            </div>
        </div>`;
    },

    attachEvents(appState) {
                        // Zmiana trybu widoku dzieci
                        const childrenViewSelect = document.getElementById('children-view-select');
                        if (childrenViewSelect) {
                            childrenViewSelect.addEventListener('change', e => {
                                this.state.childrenView = e.target.value;
                                this.render(appState);
                            });
                        }
                // Brak zwijania/rozwijania drzewek – dzieci zawsze widoczne
        // Szukajka
        document.getElementById('relations-search').addEventListener('input', e => {
            this.state.search = e.target.value;
            this.render(appState);
        });
        // Undo/redo
        document.getElementById('relations-undo').addEventListener('click', () => this.undo());
        document.getElementById('relations-redo').addEventListener('click', () => this.redo());
        // Drag and drop
        this.attachDragAndDrop(appState);
    },

    attachDragAndDrop(appState) {
                        // Drop na pole "Zamień w rodzica" na górze drzewek
                        const convertToParentTop = document.getElementById('convert-to-parent-top');
                        if (convertToParentTop) {
                            convertToParentTop.addEventListener('dragover', e => {
                                if (this.state.dragType === 'child') e.preventDefault();
                            });
                            convertToParentTop.addEventListener('drop', e => {
                                if (this.state.dragType === 'child') {
                                    this.saveState();
                                    this.changeType(appState, this.state.dragId, 'parent');
                                    this.render(appState);
                                }
                            });
                        }
                // Drop na pole "Dodaj drzewko do drzewka" - czyści childrenIds i parentIds przeciąganego rodzica
                const addTreeToTree = document.getElementById('add-tree-to-tree');
                if (addTreeToTree) {
                    addTreeToTree.addEventListener('dragover', e => {
                        if (this.state.dragType === 'parent') e.preventDefault();
                    });
                    addTreeToTree.addEventListener('drop', e => {
                        if (this.state.dragType === 'parent') {
                            this.saveState();
                            const parent = appState.hairstyles.find(h => h.id === this.state.dragId);
                            if (parent) {
                                parent.childrenIds = [];
                                parent.parentIds = [];
                                this.render(appState);
                            }
                        }
                    });
                }
        let dragType = null, dragId = null;
        document.querySelectorAll('.relations-item[draggable=true]').forEach(item => {
            item.addEventListener('dragstart', e => {
                dragType = item.dataset.type;
                dragId = parseInt(item.dataset.id);
                item.classList.add('dragging');
                this.state.dragType = dragType;
                this.state.dragId = dragId;
            });
            item.addEventListener('dragend', e => {
                item.classList.remove('dragging');
                this.state.dragType = null;
                this.state.dragId = null;
            });
        });
        // Drop na rodzica (dodaj dziecko)
        document.querySelectorAll('.relations-item.parent').forEach(parentItem => {
            parentItem.addEventListener('dragover', e => {
                if (this.state.dragType === 'child') {
                    e.preventDefault();
                    parentItem.classList.add('drag-over');
                }
            });
            parentItem.addEventListener('dragleave', e => {
                parentItem.classList.remove('drag-over');
            });
            parentItem.addEventListener('drop', e => {
                parentItem.classList.remove('drag-over');
                if (this.state.dragType === 'child') {
                    this.saveState();
                    this.addChildToParent(appState, this.state.dragId, parseInt(parentItem.dataset.id));
                    this.render(appState);
                }
            });
        });
        // Drop na drzewko (przenieś dziecko do innego rodzica)
        document.querySelectorAll('.relations-tree').forEach(tree => {
            tree.addEventListener('dragover', e => {
                if (this.state.dragType === 'child') e.preventDefault();
            });
            tree.addEventListener('drop', e => {
                if (this.state.dragType === 'child') {
                    this.saveState();
                    this.addChildToParent(appState, this.state.dragId, parseInt(tree.dataset.id));
                    this.render(appState);
                }
            });
        });
        // Drop na pole "Zamień w dziecko"
        const convertToChild = document.getElementById('convert-to-child');
        if (convertToChild) {
            convertToChild.addEventListener('dragover', e => {
                if (this.state.dragType === 'parent') e.preventDefault();
            });
            convertToChild.addEventListener('drop', e => {
                if (this.state.dragType === 'parent') {
                    this.saveState();
                    this.changeType(appState, this.state.dragId, 'child');
                    this.render(appState);
                }
            });
        }
        // Drop na pole "Zamień w rodzica" (teraz w drzewkach)
        const convertToParent = document.getElementById('add-tree-to-tree');
        if (convertToParent) {
            convertToParent.addEventListener('dragover', e => {
                if (this.state.dragType === 'child') e.preventDefault();
            });
            convertToParent.addEventListener('drop', e => {
                if (this.state.dragType === 'child') {
                    this.saveState();
                    this.changeType(appState, this.state.dragId, 'parent');
                    this.render(appState);
                }
            });
        }
        // Drop na niesparowane dzieci (usuń powiązanie)
        const unpairedChildren = document.getElementById('unpaired-children');
        if (unpairedChildren) {
            unpairedChildren.addEventListener('dragover', e => {
                if (this.state.dragType === 'child') e.preventDefault();
            });
            unpairedChildren.addEventListener('drop', e => {
                if (this.state.dragType === 'child') {
                    this.saveState();
                    this.removeChildFromParents(appState, this.state.dragId);
                    this.render(appState);
                }
            });
        }
        // Drop na niesparowanych rodziców (usuń dzieci)
        const unpairedParents = document.getElementById('unpaired-parents');
        if (unpairedParents) {
            unpairedParents.addEventListener('dragover', e => {
                if (this.state.dragType === 'parent') e.preventDefault();
            });
            unpairedParents.addEventListener('drop', e => {
                if (this.state.dragType === 'parent') {
                    this.saveState();
                    this.removeAllChildren(appState, this.state.dragId);
                    this.render(appState);
                }
            });
        }
    },

    changeType(appState, id, newType) {
        const h = appState.hairstyles.find(x => x.id === id);
        if (!h) return;
        h.type = newType;
        if (newType === 'parent') {
            h.childrenIds = h.childrenIds || [];
            h.parentIds = [];
        } else if (newType === 'child') {
            h.parentIds = h.parentIds || [];
            h.childrenIds = [];
        }
    },

    addChildToParent(appState, childId, parentId) {
        const child = appState.hairstyles.find(h => h.id === childId);
        const parent = appState.hairstyles.find(h => h.id === parentId);
        if (!child || !parent) return;
        // Dodaj parentId do dziecka
        child.parentIds = child.parentIds || [];
        if (!child.parentIds.includes(parentId)) child.parentIds.push(parentId);
        // Dodaj childId do rodzica
        parent.childrenIds = parent.childrenIds || [];
        if (!parent.childrenIds.includes(childId)) parent.childrenIds.push(childId);
    },

    removeChildFromParents(appState, childId) {
        const child = appState.hairstyles.find(h => h.id === childId);
        if (!child) return;
        // Usuń parentId z dziecka
        child.parentIds = [];
        // Usuń childId z każdego rodzica
        appState.hairstyles.forEach(h => {
            if (h.childrenIds) h.childrenIds = h.childrenIds.filter(cid => cid !== childId);
        });
    },

    removeAllChildren(appState, parentId) {
        const parent = appState.hairstyles.find(h => h.id === parentId);
        if (!parent) return;
        // Usuń childrenIds z rodzica
        if (parent.childrenIds) {
            parent.childrenIds.forEach(cid => {
                const child = appState.hairstyles.find(h => h.id === cid);
                if (child && child.parentIds) child.parentIds = child.parentIds.filter(pid => pid !== parentId);
            });
        }
        parent.childrenIds = [];
    },

    saveState() {
        // Zapisz kopię do undo
        this.state.undoStack.push(JSON.stringify(this._appState.hairstyles));
        this.state.redoStack = [];
    },
    undo() {
        if (this.state.undoStack.length === 0) return;
        this.state.redoStack.push(JSON.stringify(this._appState.hairstyles));
        const prev = this.state.undoStack.pop();
        this._appState.hairstyles = JSON.parse(prev);
        App.saveData();
        this.render(this._appState);
    },
    redo() {
        if (this.state.redoStack.length === 0) return;
        this.state.undoStack.push(JSON.stringify(this._appState.hairstyles));
        const next = this.state.redoStack.pop();
        this._appState.hairstyles = JSON.parse(next);
        App.saveData();
        this.render(this._appState);
    },
    validate(appState) {
        // Walidacja cykli i spójności
        let error = '';
        // Cykl: parent jest swoim dzieckiem
        appState.hairstyles.forEach(h => {
            if (h.childrenIds && h.childrenIds.includes(h.id)) error = 'Fryzura nie może być swoim dzieckiem!';
            if (h.parentIds && h.parentIds.includes(h.id)) error = 'Fryzura nie może być swoim rodzicem!';
        });
        // Cykl: dziecko i rodzic są wzajemnie rodzicem
        appState.hairstyles.forEach(h => {
            if (h.childrenIds) h.childrenIds.forEach(cid => {
                const child = appState.hairstyles.find(x => x.id === cid);
                if (child && child.childrenIds && child.childrenIds.includes(h.id)) error = 'Nieprawidłowa relacja cykliczna!';
            });
        });
        document.getElementById('relations-validation').textContent = error;
    }
};
