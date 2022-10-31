export const NoteStorage = {
	prefix: 'savedNoteData=>',

	//Loaded all Notes
	loadNotes(): string[] {
		const loadedNotes: any[] = [];
		let noteCount = 1; //Starts note count at 1
		while (localStorage.getItem(`${NoteStorage.prefix}${location.href}:note:${noteCount}`) !== null) {
			//While there is a note in the local storage

			// Get note from local storage
			const note: string | null =
				localStorage.getItem(`${NoteStorage.prefix}${location.href}:note:${noteCount}`) || '';

			loadedNotes.push(note); //Add note to loadedNotes

			noteCount++;
		}

		return loadedNotes;
	},

	//Returns singular note content
	getNote(noteNum: number, pathname: string = location.href): string {
		return localStorage.getItem(`${NoteStorage.prefix}${pathname}:note:${noteNum}`) || '';
	},

	// Gets the index of the last note
	getIndex(pathname: string = location.href): number {
		return parseInt(localStorage.getItem(`${NoteStorage.prefix}${pathname}:noteCount`) || '0');
	},

	//Saves a new note to local storage
	saveNote(noteContent: string): number {
		const newIndex =
			parseInt(localStorage.getItem(`${NoteStorage.prefix}${location.href}:noteCount`) || '0') + 1;

		//Encodes the note name, ex note name is: "/home/profile.html:note:2" meaning it is the second note on the profile subpage
		const encodedNoteName = `${NoteStorage.prefix}${location.href}:note:${newIndex}`;

		const encodedNoteContent: string = noteContent; //The note content to be saved

		localStorage.setItem(encodedNoteName, encodedNoteContent); //Saves the note to local storage

		localStorage.setItem(`${NoteStorage.prefix}${location.href}:noteCount`, newIndex.toString()); //Updates the note count for the specific subdomain

		return newIndex;
	},

	//Updates a note
	updateNote(
		noteNum: number,
		noteContent: string,
		pathname: string = location.href
	): void {
		localStorage.setItem(`${NoteStorage.prefix}${pathname}:note:${noteNum}`, noteContent);
	},

	//Deletes a certain note
	deleteNote(noteNum: number, pathname: string = location.href): void {
		localStorage.removeItem(`${NoteStorage.prefix}${pathname}:note:${noteNum}`); //Remove note from local storage

		let noteCount = noteNum + 1; //Start at the note after the one we deleted

		while (localStorage.getItem(`${NoteStorage.prefix}${pathname}:note:${noteCount}`) !== null) {
			//Increments through notes until it reaches a null value meaning there are no more notes

			const oldNoteValue: string | null =
				localStorage.getItem(`${NoteStorage.prefix}${location.href}:note:${noteCount}`) || ''; //Gets note content to be moved into new note that is moved up

			const newNoteName = `${NoteStorage.prefix}${location.href}:note:${noteCount - 1}`; //Makes new note name to move up note

			localStorage.setItem(newNoteName, oldNoteValue); //Moves note up one

			noteCount++; //Increment noteCount
		}

		//Removes the last note since all notes were moved up one spot
		localStorage.removeItem(
			`${NoteStorage.prefix}${pathname}:note:${parseInt(
				localStorage.getItem(`${pathname}:noteCount`) || '0'
			)}`
		);

		localStorage.setItem(`${NoteStorage.prefix}${pathname}:noteCount`, (noteCount - 2).toString()); //Updates note count
	},
};
