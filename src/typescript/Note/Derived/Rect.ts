import { NoteStorage } from '../Backend/NoteStorage.js';
import { NoteEncryption } from '../Backend/NoteEncryption.js';
import { Note, noteClass } from './../Note.js';
import { NoteSelect } from '../Backend/NoteSelect.js';
import { inputsListType } from 'src/typescript/UI/Rendered/EditBar/EditBar.js';

/** This is a rectangle that can be dragged around */
export class Rect extends Note {
	constructor(parameters: (string | number)[], content: string, index = 0) {
		super('Rect', index);

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
		this.$init();
	}

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
		note.setAttribute('x', `${position.x}`);
		note.setAttribute('y', `${position.y}`);
		this.$setOrigin();
		NoteSelect.updateSelectBox();
	};

	private readonly $setSize = (size = this.values.size): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.setAttribute('width', `${size.width}`);
		note.setAttribute('height', `${size.height}`);
		this.$setOrigin();
		NoteSelect.updateSelectBox();
	};

	private readonly $setOrigin = (): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.transformOrigin = `${this.values.position.x + this.values.size.width / 2}px ${this.values.position.y + this.values.size.height / 2}px`;
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

		note.style.fill = fill;
	};

	private readonly $setStroke = (stroke = this.values.stroke): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.stroke = stroke;
	};

	private readonly $setWidth = (width = this.values.width): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.strokeWidth = `${width}`;
	};

	private readonly $setRadius = (radius = this.values.radius): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.setAttribute('rx', `${radius}`);
		note.setAttribute('ry', `${radius}`);
	};

	private dragData = {
		isDragging: false,
		notePos: { x: 0, y: 0 },
	};

	private readonly $init_draggable = (): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.addEventListener('mousedown', (e: MouseEvent) => {
			e.stopImmediatePropagation();
			if(!NoteSelect.enabled) return;
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
			if(!NoteSelect.enabled) return;
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

	public readonly $init = (): void => {
		document.querySelector(`${this.mainContainer} > svg`);

		document
			.querySelector(`${this.mainContainer} > svg`)
			?.insertAdjacentElement('beforeend', this.$getHTML());

		this.$init_draggable();

		this.$init_selectable();

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
			content: '',
			index: this.noteIndex,
		};

		return data;
	};

	public readonly $save = (recordHistory = true): void => {
		const noteData = NoteEncryption.encode(this.$data());

		if(NoteSelect.active == this) NoteSelect.updateSelectBox();

		if (this.noteIndex === 0) {
			this.noteIndex = NoteStorage.saveNote(noteData);
			this.$updateID();
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
		this.$setRotation();
		this.$setFill();
		this.$setStroke();
		this.$setWidth();
		this.$setRadius();
		this.$save(false);
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
		if (changed) this.$setPosition(); //Sets the position of the note
		return this.values.position; //Returns the new position
	};

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

	public readonly $rotation = (rotation: number = this.values.rotation, add_rotation: number = 0): number => {
		let changed = false;
		if (rotation !== this.values.rotation) {
			this.values.rotation = rotation;
			changed = true;
		}
		if (add_rotation !== 0) {
			this.values.rotation = parseInt(this.values.rotation.toString()) + add_rotation;
			changed = true;
		}
		if (changed) this.$setRotation(); //Sets the rotation of the note
		return this.values.rotation; //Returns the new rotation
	};

	public readonly $fill = (fill: string = this.values.fill): string => {
		if (fill !== this.values.fill) {
			this.values.fill = fill;
			this.$setFill(); //Sets the fill of the note
		}
		return this.values.fill; //Returns the new fill
	};

	public readonly $stroke = (stroke: string = this.values.stroke): string => {
		if (stroke !== this.values.stroke) {
			this.values.stroke = stroke;
			this.$setStroke(); //Sets the stroke of the note
		}
		return this.values.stroke; //Returns the new stroke
	};

	public readonly $width = (width: number = this.values.width): number => {
		if (width !== this.values.width) {
			this.values.width = width;
			this.$setWidth(); //Sets the width of the note
		}
		return this.values.width; //Returns the new width
	};

	public readonly $radius = (radius: number = this.values.radius): number => {
		if (radius !== this.values.radius) {
			this.values.radius = radius;
			this.$setRadius(); //Sets the radius of the note
		}
		return this.values.radius; //Returns the new radius
	};

	public readonly $getHTML = (): SVGRectElement => {
		let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		rect.classList.add(noteClass);
		rect.setAttribute('id', this.$raw_id());
		rect.setAttribute('x', `${this.values.position.x}`);
		rect.setAttribute('y', `${this.values.position.y}`);
		rect.setAttribute('width', `${this.values.size.width}`);
		rect.setAttribute('height', `${this.values.size.height}`);
		rect.setAttribute('rx', `${this.values.radius}`);
		rect.setAttribute('ry', `${this.values.radius}`);
		rect.setAttribute(
			'style',
			`
            fill: ${this.values.fill};
            stroke: ${this.values.stroke};
            stroke-width: ${this.values.width};
			transform-origin: ${this.values.position.x + this.values.size.width / 2}px ${this.values.position.y + this.values.size.height / 2}px;
			rotate: ${this.values.rotation}deg
        `
		);

		return rect;
	};

	$getBoundingBox() {
		return {
			x: this.values.position.x - this.values.width / 2,
			y: this.values.position.y - this.values.width / 2,
			width: this.values.size.width + this.values.width,
			height: this.values.size.height + this.values.width,
			rotation: this.values.rotation,
		};
	}

	public readonly $init_selectable = (): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.addEventListener(
			'pointerdown',
			() => {
				NoteSelect.select(this);
			},
			true
		);
	};
}
