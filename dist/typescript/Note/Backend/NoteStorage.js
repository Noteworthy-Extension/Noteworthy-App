export const NoteStorage = {
    prefix: 'savedNoteData=>',
    loadNotes: function () {
        const loadedNotes = [];
        let noteCount = 1;
        while (localStorage.getItem(`${NoteStorage.prefix}${location.href}:note:${noteCount}`) !== null) {
            const note = localStorage.getItem(`${NoteStorage.prefix}${location.href}:note:${noteCount}`) || '';
            loadedNotes.push(note);
            noteCount++;
        }
        return loadedNotes;
    },
    getNote: function (noteNum, pathname = location.href) {
        return localStorage.getItem(`${NoteStorage.prefix}${pathname}:note:${noteNum}`) || '';
    },
    getIndex: function (pathname = location.href) {
        return parseInt(localStorage.getItem(`${NoteStorage.prefix}${pathname}:index`) || '0');
    },
    saveNote: function (noteContent) {
        const newIndex = parseInt(localStorage.getItem(`${NoteStorage.prefix}${location.href}:noteCount`) || '0') + 1;
        const encodedNoteName = `${NoteStorage.prefix}${location.href}:note:${newIndex}`;
        const encodedNoteContent = noteContent;
        localStorage.setItem(encodedNoteName, encodedNoteContent);
        localStorage.setItem(`${NoteStorage.prefix}${location.href}:noteCount`, newIndex.toString());
        return newIndex;
    },
    updateNote: function (noteNum, noteContent, pathname = location.href) {
        localStorage.setItem(`${NoteStorage.prefix}${pathname}:note:${noteNum}`, noteContent);
    },
    deleteNote: function (noteNum, pathname = location.href) {
        localStorage.removeItem(`${NoteStorage.prefix}${pathname}:note:${noteNum}`);
        let noteCount = noteNum + 1;
        while (localStorage.getItem(`${NoteStorage.prefix}${pathname}:note:${noteCount}`) !== null) {
            const oldNoteValue = localStorage.getItem(`${NoteStorage.prefix}${location.href}:note:${noteCount}`) || '';
            const newNoteName = `${NoteStorage.prefix}${location.href}:note:${noteCount - 1}`;
            localStorage.setItem(newNoteName, oldNoteValue);
            noteCount++;
        }
        localStorage.removeItem(`${NoteStorage.prefix}${pathname}:note:${parseInt(localStorage.getItem(`${pathname}:noteCount`) || '0')}`);
        localStorage.setItem(`${NoteStorage.prefix}${pathname}:noteCount`, (noteCount - 2).toString());
    },
};
