import { NoteHistory } from './Backend/NoteHistory.js';
import { NoteStorage } from './Backend/NoteStorage.js';
export const noteClass = 'NoteWorthyOfficial-note';
export const $DEBUGMODE = false;
export class Note {
    constructor(type, index) {
        this.noteType = 'Note';
        this.noteIndex = 0;
        this.noteID = '';
        this.mainContainer = '#NoteWorthyOfficial-MainContainer';
        this.lastSave = {};
        this.$getInputs = () => {
            return [];
        };
        this.$saveHistory = () => {
            function clone(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
            if (this.values !== this.lastSave && Object.values(this.lastSave).length !== 0) {
                const lastSave = clone(this.lastSave);
                const currentSave = clone(this.values);
                const previousHistoryEvent = () => {
                    this.$setValues(lastSave);
                };
                const currentHistoryEvent = () => {
                    this.$setValues(currentSave);
                };
                NoteHistory.pushEvent({
                    undo: previousHistoryEvent,
                    redo: currentHistoryEvent,
                });
            }
            this.lastSave = clone(this.values);
        };
        this.$delete = () => {
            NoteStorage.deleteNote(this.noteIndex);
            document.getElementById(this.noteID)?.remove();
        };
        this.$id = () => `#${this.noteID}`;
        this.$raw_id = () => this.noteID;
        this.$updateID = () => {
            const noteElement = document.getElementById(this.$raw_id());
            this.noteID = `${this.noteType}-${this.noteIndex}`;
            if (noteElement)
                noteElement.setAttribute('id', this.noteID);
        };
        this.noteType = type;
        this.noteIndex = index;
        this.noteID = `${this.noteType}-${this.noteIndex}`;
    }
}
