import { Circle } from '../Derived/Circle.js';
import { Line } from '../Derived/Line.js';
import { Rect } from '../Derived/Rect.js';
import { Textbox } from './../Derived/Textbox.js';
import { NoteEncryption } from './NoteEncryption.js';
import { NoteStorage } from './NoteStorage.js';
export function loadSavedNotes() {
    for (const note of NoteStorage.loadNotes()) {
        const decodedNote = NoteEncryption.decode(note);
        switch (decodedNote.type) {
            case 'Textbox':
                new Textbox(decodedNote.parameters, decodedNote.content, decodedNote.index);
                break;
            case 'Line':
                new Line(decodedNote.parameters, decodedNote.content, decodedNote.index);
                break;
            case 'Rect':
                new Rect(decodedNote.parameters, decodedNote.content, decodedNote.index);
                break;
            case 'Circle':
                new Circle(decodedNote.parameters, decodedNote.content, decodedNote.index);
                break;
        }
    }
}
