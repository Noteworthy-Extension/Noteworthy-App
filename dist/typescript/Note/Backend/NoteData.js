export const NoteData = {
    notes: new Map(),
    setData: (index, data) => {
        NoteData.notes.set(index, data);
    },
    getData: (index) => {
        return NoteData.notes.get(index);
    },
};
