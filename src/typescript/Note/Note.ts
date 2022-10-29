import { inputsListType } from '../UI/Rendered/EditBar/EditBar.js';
import { NoteHistory } from './Backend/NoteHistory.js';
import { NoteSelect } from './Backend/NoteSelect.js';
import { NoteStorage } from './Backend/NoteStorage.js';
import { Circle } from './Derived/Circle.js';
import { Line } from './Derived/Line.js';
import { Rect } from './Derived/Rect.js';
import { Textbox } from './Derived/Textbox.js';

export const noteClass = 'NoteWorthyOfficial-note';

export const $DEBUGMODE = false;

export type NoteTypes = Rect | Circle | Line | Textbox;

export abstract class Note {
	protected noteType = 'Note';
	protected noteIndex = 0;
	protected noteID = '';

	protected readonly mainContainer = '#NoteWorthyOfficial-MainContainer';

	constructor(type: string, index: number) {
		this.noteType = type;
		this.noteIndex = index;

		this.noteID = `${this.noteType}-${this.noteIndex}`; //Note-#_ClassType, ex: Note-5_Textbox
	}

	protected abstract valueIndex: Object;
	protected abstract values: Object;
	public lastSave = {};

	protected abstract $getHTML(): Element | string;
	protected abstract $init(): void;

	protected abstract $data(): {
		type: string;
		parameters: (string | number)[];
		content: string;
		index: number;
	};
	protected abstract $save(): void;

	protected abstract $setValues(values: Object): void;

	public readonly $getInputs = (): inputsListType => {
		return [];
	};

	protected readonly $saveHistory = (): void => {
		function clone(obj: Object) {
			return JSON.parse(JSON.stringify(obj));
		}

		if (this.values !== this.lastSave && Object.values(this.lastSave).length !== 0) {
			const lastSave = clone(this.lastSave);
			const currentSave = clone(this.values);

			const previousHistoryEvent = () => {
				// console.log(lastSave);
				this.$setValues(lastSave);
			};

			const currentHistoryEvent = () => {
				// console.log(currentSave);
				this.$setValues(currentSave);
			};

			NoteHistory.pushEvent({
				undo: previousHistoryEvent,
				redo: currentHistoryEvent,
			});
		}
		this.lastSave = clone(this.values);
	};

	public readonly $delete = (): void => {
		NoteStorage.deleteNote(this.noteIndex);
		document.getElementById(this.noteID)?.remove();
	};

	public readonly $id = (): string => `#${this.noteID}`;
	public readonly $raw_id = (): string => this.noteID;

	protected readonly $updateID = (): void => {
		const noteElement = document.getElementById(this.$raw_id());
		this.noteID = `${this.noteType}-${this.noteIndex}`;
		if (noteElement) noteElement.setAttribute('id', this.noteID);
	};

	protected abstract $init_selectable(): void;

	protected abstract $getBoundingBox(): {
		x: number;
		y: number;
		width: number;
		height: number;
		rotation: number;
	};
}
