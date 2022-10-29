import type { NoteTypes } from './../Note.js';

export const NoteData = {
	notes: <Map<number, NoteTypes>>new Map(),

	setData: (index: number, data: NoteTypes): void => {
		NoteData.notes.set(index, data);
	},

	getData: (index: number): NoteTypes | undefined => {
		return NoteData.notes.get(index);
	},
};
