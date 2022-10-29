export const NoteHistory = {
	eventIndex: 0,

	events: <{ undo: () => void; redo: () => void }[]>[],

	pushEvent: (event: { undo: () => void; redo: () => void }) => {
		if (NoteHistory.events.length > NoteHistory.eventIndex) {
			NoteHistory.events.splice(
				NoteHistory.eventIndex,
				NoteHistory.events.length - NoteHistory.eventIndex
			);
		}
		NoteHistory.events.push(event);
		NoteHistory.eventIndex++;
	},

	undo: () => {
		if (NoteHistory.eventIndex <= 0) return;
		NoteHistory.eventIndex--;
		NoteHistory.events[NoteHistory.eventIndex].undo();
	},

	redo: () => {
		if (NoteHistory.eventIndex >= NoteHistory.events.length) return;
		NoteHistory.events[NoteHistory.eventIndex].redo();
		NoteHistory.eventIndex++;
	},

	init: () => {
		document.addEventListener('keydown', e => {
			if (e.ctrlKey && e.key === 'z') {
				NoteHistory.undo();
			}
			if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
				NoteHistory.redo();
			}
		});
	},
};
