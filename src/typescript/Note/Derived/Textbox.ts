import { Note } from './../Note.js';
import { NoteStorage } from '../Backend/NoteStorage.js';
import { NoteEncryption } from '../Backend/NoteEncryption.js';
import { NoteData } from '../Backend/NoteData.js';
import { EditBar, inputsListType } from 'src/typescript/UI/Rendered/EditBar/EditBar.js';
import { NoteSelect } from '../Backend/NoteSelect.js';

/** The textbox class is a note that is a textbox. */
export class Textbox extends Note {
	constructor(parameters: (string | number)[], content: string, index = 0) {
		super('Textbox', index);

		this.values.position = {
			x: parseInt(parameters[this.valueIndex.position.x].toString()) || this.values.position.x,
			y: parseInt(parameters[this.valueIndex.position.y].toString()) || this.values.position.y,
		};

		this.values.size = {
			width: parseInt(parameters[this.valueIndex.size.width].toString()) || this.values.size.width,
			height: parseInt(parameters[this.valueIndex.size.height].toString()) || this.values.size.height,
		};

		this.values.rotation =
			parseInt(parameters[this.valueIndex.rotation].toString()) || this.values.rotation;

		this.values.fill = parameters[this.valueIndex.fill]?.toString() || this.values.fill;
		this.values.stroke = parameters[this.valueIndex.stroke]?.toString() || this.values.stroke;
		this.values.width = parseInt(parameters[this.valueIndex.width]?.toString()) || this.values.width;
		this.values.radius =
			parseInt(parameters[this.valueIndex.radius]?.toString()) || this.values.radius;

		this.values.content = content || '';

		NoteData.setData(this.noteIndex, this);

		this.lastSave = Object.create(this.values);

		this.$init();
	}

	private editor: null | any = null;

	readonly valueIndex = {
		position: {
			x: 0,
			y: 1,
		},
		size: {
			width: 2,
			height: 3,
		},
		rotation: 4,
		fill: 5,
		stroke: 6,
		width: 7,
		radius: 8,
	};

	values = {
		position: {
			x: 0,
			y: 0,
		},
		size: {
			width: 0,
			height: 0,
		},
		rotation: 0,
		fill: 'none',
		stroke: 'none',
		width: 0,
		radius: 0,
		content: '',
	};

	private readonly $setPosition = (position = this.values.position): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.left = `${position.x}px`;
		note.style.top = `${position.y}px`;
		NoteSelect.updateSelectBox();
	};

	private readonly $setSize = (size: Record<string, number> = this.values.size): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;
		note.style.width = `${size.width}px`;
		note.style.height = `${size.height}px`;
		NoteSelect.updateSelectBox();
	};

	private readonly $setRotation = (rotation = this.values.rotation): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.rotate = `${rotation}deg`;
		NoteSelect.updateSelectBox();
	};

	private readonly $setFill = (fill = this.values.fill): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.backgroundColor = fill;
	};

	private readonly $setStroke = (stroke = this.values.stroke): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.borderColor = stroke;
	};

	private readonly $setWidth = (width = this.values.width): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.borderWidth = `${width}px`;
	};

	private readonly $setRadius = (radius = this.values.radius): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.borderRadius = `${radius}px`;
	};

	private readonly $setText = (text: string = this.values.content): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;
		note.innerHTML = text;
	};

	private gotQuill = false;
	private readonly $init_editor = (): void => {
		EditBar.addToolbar(this.$raw_id());

		console.log('INIT EDITOR');
		document.addEventListener('quillReturnData', (quill: any) => {
			if (this.gotQuill) return;
			if (!quill) {
				document.dispatchEvent(new CustomEvent('quillRequestData'));
				return;
			}
			this.gotQuill = true;
			console.log('Got Quill!!!');
			let editor = new quill.detail(this.$id(), {
				modules: {
					toolbar: this.$id() + '-toolbar',
				},
				theme: 'snow',
			});
			editor.setContents((this.values.content !== "" && this.values.content.startsWith("{")) ? JSON.parse(this.values.content) : "{'ops':[{'insert':''}]}");
			//skipcq: JS-0342
			const thisRef = this;
			// Todo: Remove _'s; I set typescript to a stricter setting so it won't allow unused variables
			editor.on('text-change', (_delta: any, _oldDelta: any, source: string) => {
				console.log(JSON.stringify(editor.getContents()));

				thisRef.$text(JSON.stringify(editor.getContents()));
				thisRef.$save();
			});
			this.editor = editor;
			this.$enableEditor(false);
		});
		document.dispatchEvent(new CustomEvent('quillRequestData'));
	};

	public readonly $focusEditor = (): void => {
		if (!this.editor) return;
		this.editor.focus();
	};

	public readonly $isFocusedEditor = (): boolean => {
		if (!this.editor) return false;
		return this.editor.hasFocus();
	};

	public readonly $enableEditor = (status = true): void => {
		if (!this.editor) return;
		this.editor.enable(status);
	};

	private dragData = {
		isDragging: false,
		notePos: { x: 0, y: 0 },
	};

	private readonly $init_draggable = (): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.addEventListener('mousedown', (e: MouseEvent) => {
			if (!NoteSelect.enabled) return;
			if (this.$isFocusedEditor()) return;
			e.stopImmediatePropagation();
			this.dragData.isDragging = true; // start dragging

			this.dragData.notePos = { x: e.pageX, y: e.pageY }; // get the current mouse position
		});

		document.addEventListener('mouseup', (e: MouseEvent) => {
			if (!this.dragData.isDragging) return; // Returns if not dragging

			const differNotePos = {
				x: e.pageX - this.dragData.notePos.x,
				y: e.pageY - this.dragData.notePos.y,
			}; // Calculates the difference between the mouse position and the note position
			this.$position(this.values.position, differNotePos); // Sets the new position

			this.$save(); // Saves the notes new position

			this.dragData.isDragging = false; // Resets the dragging state
		});

		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (!NoteSelect.enabled) return;
			if (this.$isFocusedEditor()) {
				this.dragData.isDragging = false;
				return;
			}
			if (!this.dragData.isDragging) return; //Returns if not dragging

			const differNotePos = {
				x: e.pageX - this.dragData.notePos.x,
				y: e.pageY - this.dragData.notePos.y,
			}; // Difference between mouse and note previous position
			this.$position(this.values.position, differNotePos); // Updates the notes position by adding x and y as second param

			this.dragData.notePos = { x: e.pageX, y: e.pageY }; // Updates the notes previous position
		});
	};

	/* ====== Public Methods ================================================================= */

	public readonly $size = (
		size: { width: number; height: number } = this.values.size,
		add_size = { width: 0, height: 0 }
	): { width: number; height: number } => {
		let changed = false;
		if (size !== this.values.size) {
			this.values.size.width = size.width;
			this.values.size.height = size.height;
			changed = true;
		}
		if (add_size.width !== 0 || add_size.height !== 0) {
			this.values.size.width = parseInt(this.values.size.width.toString()) + add_size.width;
			this.values.size.height = parseInt(this.values.size.height.toString()) + add_size.height;
			changed = true;
		}
		if (changed) this.$setSize(); //Sets the size of the note
		return this.values.size; //Returns the new size
	};

	public readonly $init = (): void => {
		console.log(this.$getHTML());
		document.querySelector(this.mainContainer)?.insertAdjacentHTML('beforeend', this.$getHTML());
		//Runs methods that initialiaze that note without giving access to the user.
		this.$init_draggable();
		this.$init_selectable();
		if(this.noteIndex != 0) this.$init_editor();
		this.$save();
	};

	public readonly $getInputs = (): inputsListType => {
		return [
			{
				type: 'color',
				label: 'stroke',
				value: this.values.stroke,
				fn: newVal => {
					this.$stroke(newVal.toString());
					this.$save();
				},
			},
			{
				type: 'color',
				label: 'fill',
				value: this.values.fill,
				fn: newVal => {
					this.$fill(newVal.toString());
					this.$save();
				},
			},
			{
				type: 'select',
				label: 'width',
				value: this.values.width,
				fn: newVal => {
					this.$width(parseInt(newVal.toString()));
					this.$save();
				},
			},
			{
				type: 'select',
				label: 'radius',
				value: this.values.radius,
				fn: newVal => {
					this.$radius(parseInt(newVal.toString()));
					this.$save();
				},
			},
		];
	};

	public readonly $data = () => {
		const compressedParameters: (string | number)[] = [];

		const assignParam = (index: number, val: string | number): void => {
			compressedParameters[index] = val;
		};

		assignParam(this.valueIndex.position.x, this.values.position.x);
		assignParam(this.valueIndex.position.y, this.values.position.y);
		assignParam(this.valueIndex.size.width, this.values.size.width);
		assignParam(this.valueIndex.size.height, this.values.size.height);
		assignParam(this.valueIndex.rotation, this.values.rotation);
		assignParam(this.valueIndex.fill, this.values.fill);
		assignParam(this.valueIndex.stroke, this.values.stroke);
		assignParam(this.valueIndex.width, this.values.width);
		assignParam(this.valueIndex.radius, this.values.radius);

		const data = {
			type: this.noteType,
			parameters: compressedParameters,
			content: this.$text(),
			index: this.noteIndex,
		};

		return data;
	};

	public readonly $save = (recordHistory = true): void => {
		const noteData = NoteEncryption.encode(this.$data());

		if (NoteSelect.active == this) NoteSelect.updateSelectBox();

		if (this.noteIndex === 0) {
			this.noteIndex = NoteStorage.saveNote(noteData);
			this.$updateID();
			this.$init_editor();
			this.$save();
			return;
		} else {
			NoteStorage.updateNote(this.noteIndex, noteData);

			if (recordHistory) this.$saveHistory();
		}
	};

	public readonly $setValues = (values: any): void => {
		this.values = values;
		this.$setPosition();
		this.$setSize();
		this.$setText();
		this.$setRotation();
		this.$setFill();
		this.$setStroke();
		this.$setWidth();
		this.$setRadius();
		this.$save(false);
	};

	public readonly $text = (text: string = this.values.content): string => {
		if (text !== this.values.content) {
			this.values.content = text;
		}
		return this.values.content;
	};

	public readonly $position = (
		position: { x: number; y: number } = this.values.position,
		add_position = { x: 0, y: 0 }
	): { x: number; y: number } => {
		let changed = false;
		if (position !== this.values.position) {
			this.values.position.x = position.x;
			this.values.position.y = position.y;
			changed = true;
		}
		if (add_position.x !== 0 || add_position.y !== 0) {
			this.values.position.x = parseInt(this.values.position.x.toString()) + add_position.x;
			this.values.position.y = parseInt(this.values.position.y.toString()) + add_position.y;
			changed = true;
		}
		if (changed) {
			// this.$save(); //Saves the new position
			this.$setPosition(); //Sets the position of the note
		}
		return this.values.position; //Returns the new position
	};

	public readonly $rotation = (rotation: number = this.values.rotation): number => {
		if (rotation !== this.values.rotation) {
			this.values.rotation = rotation;
			this.$setRotation();
		}
		return this.values.rotation;
	};

	public readonly $fill = (fill: string = this.values.fill): string => {
		if (fill !== this.values.fill) {
			this.values.fill = fill;
			this.$setFill();
		}
		return this.values.fill;
	};

	public readonly $stroke = (stroke: string = this.values.stroke): string => {
		if (stroke !== this.values.stroke) {
			this.values.stroke = stroke;
			this.$setStroke();
		}
		return this.values.stroke;
	};

	public readonly $width = (width: number = this.values.width): number => {
		if (width !== this.values.width) {
			this.values.width = width;
			this.$setWidth();
		}
		return this.values.width;
	};

	public readonly $radius = (radius: number = this.values.radius): number => {
		if (radius !== this.values.radius) {
			this.values.radius = radius;
			this.$setRadius();
		}
		return this.values.radius;
	};

	public readonly $getHTML = (): string => {
		return `
			<div id="${this.$raw_id()}" style="
				position: absolute;
				left: ${this.values.position.x}px;
				top: ${this.values.position.y}px;
				width: ${this.values.size.width}px;
				height: ${this.values.size.height}px;
				rotate: ${this.values.rotation}deg;
				background-color: ${this.values.fill};
				border: ${this.values.width}px solid ${this.values.stroke};
				border-radius: ${this.values.radius}px;
				padding: 0;
			">
				${this.values.content}
			</div>
		`;
	};

	protected readonly $updateID = (): void => {
		const noteElement = document.getElementById(this.$raw_id());
		// const toolbar = document.getElementById(this.$raw_id() + '-toolbar');
		this.noteID = `${this.noteType}-${this.noteIndex}`;
		if (noteElement) noteElement.setAttribute('id', this.noteID);
		// if (toolbar) toolbar.setAttribute('id', this.noteID + '-toolbar');
	};

	$getBoundingBox() {
		return {
			x: this.values.position.x,
			y: this.values.position.y,
			width: this.values.size.width,
			height: this.values.size.height,
			rotation: this.values.rotation,
		};
	}

	public readonly $init_selectable = (): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.addEventListener(
			'pointerdown',
			() => {
				if (NoteSelect.active !== this) this.$enableEditor(false);
				console.log('Active: ', NoteSelect.active == this);
				NoteSelect.select(this);
			},
			true
		);
		note.addEventListener('dblclick', () => {
			if (NoteSelect.active == this) {
				this.$enableEditor(true);
				this.$focusEditor();
			}
		});
	};
}
