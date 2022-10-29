import { NoteStorage } from '../Backend/NoteStorage.js';
import { NoteEncryption } from '../Backend/NoteEncryption.js';
import { Note, noteClass } from './../Note.js';
import { inputsListType } from 'src/typescript/UI/Rendered/EditBar/EditBar.js';
import { NoteSelect } from '../Backend/NoteSelect.js';

/** A line, can be a line, polyline; arrow, polyarrow. */
export class Line extends Note {
	constructor(parameters: (string | number)[], content: string, index = 0) {
		super('Line', index);

		this.values.stroke = parameters[this.valueIndex.stroke]?.toString() || this.values.stroke;
		this.values.width = parseInt(parameters[this.valueIndex.width]?.toString()) || this.values.width;

		this.values.markers.start =
			parameters[this.valueIndex.markers.start]?.toString() || this.values.markers.start;
		this.values.markers.end =
			parameters[this.valueIndex.markers.end]?.toString() || this.values.markers.end;
		this.values.pattern = parameters[this.valueIndex.pattern]?.toString() || this.values.pattern;

		this.values.points = this.$extractPoints(content);
		this.$init();
	}

	readonly valueIndex = {
		stroke: 1,
		width: 2,
		markers: {
			start: 3,
			end: 4,
		},
		pattern: 5,
	};

	values: {
		stroke: string;
		width: number;
		markers: {
			start: string;
			end: string;
		};
		position: {
			x: number;
			y: number;
		};
		size: {
			width: number;
			height: number;
		};
		rotation: number;
		pattern: string;
		points: { x: number; y: number }[];
		buffer: number;
		hitID: string;
	} = {
		stroke: '#000000',
		width: 1,
		markers: {
			start: 'none',
			end: 'none',
		},
		position: {
			x: 0,
			y: 0,
		},
		size: {
			width: 0,
			height: 0,
		},
		rotation: 0,
		pattern: 'none',
		points: [],
		buffer: 25,
		hitID: '-hitbox',
	};

	private readonly $extractPoints = (content: string): { x: number; y: number }[] => {
		const pointsArray: { x: number; y: number }[] = [];

		const points = content.split(' ');
		points.forEach(point => {
			const pointVal = point.split(',');
			pointsArray.push({ x: parseInt(pointVal[0]), y: parseInt(pointVal[1]) });
		});

		return pointsArray;
	};

	private readonly $compressPoints = (
		points: { x: number; y: number }[] = this.values.points
	): string => {
		let compressedPoints = '';

		points.forEach(point => (compressedPoints += ` ${point.x},${point.y}`));

		return compressedPoints.trim();
	};

	private readonly $setPoints = (points = this.values.points): void => {
		const note = <HTMLElement>document.getElementById(this.$raw_id());
		const note2 = <HTMLElement>document.getElementById(this.$raw_id() + this.values.hitID);

		note.setAttribute('points', this.$compressPoints(points));
		note2.setAttribute('points', this.$compressPoints(points));
		NoteSelect.updateSelectBox();
	};

	private readonly $setRotation = (rotation = this.values.rotation): void => {
		const note = <HTMLElement>document.getElementById(this.$raw_id());
		const note2 = <HTMLElement>document.getElementById(this.$raw_id() + this.values.hitID);

		note.style.rotate = `${rotation}deg`;
		note2.style.rotate = `${rotation}deg`;
		NoteSelect.updateSelectBox();
	};

	private readonly $setStroke = (stroke = this.values.stroke): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.stroke = stroke;
	};

	private readonly $setWidth = (width = this.values.width): void => {
		const note = <HTMLElement>document.getElementById(this.$raw_id());
		const note2 = <HTMLElement>document.getElementById(this.$raw_id() + this.values.hitID);

		note.style.strokeWidth = `${width}px`;
		note2.style.strokeWidth = `${width + this.values.buffer}px`;
		NoteSelect.updateSelectBox();
	};

	private readonly $setPattern = (pattern = this.values.pattern): void => {
		const note = <HTMLElement>document.getElementById(this.$raw_id());

		note.style.strokeDasharray = pattern;
	};

	private readonly $setMarkers = (
		start = this.values.markers.start,
		end = this.values.markers.end
	): void => {
		const note = document.getElementById(this.$raw_id());
		if (note === null) return;

		note.style.markerStart = `url(#${start})`;
		note.style.markerEnd = `url(#${end})`;
	};

	private dragData = {
		isDragging: false,
		notePos: { x: 0, y: 0 },
	};

	private readonly $init_draggable = (): void => {
		const note = <HTMLElement>document.getElementById(this.$raw_id() + this.values.hitID);

		note.addEventListener('mousedown', (e: MouseEvent) => {
			e.stopImmediatePropagation();
			console.log('mousedown');
			if (!NoteSelect.enabled) return;
			this.dragData.isDragging = true; // start dragging

			this.dragData.notePos = { x: e.pageX, y: e.pageY }; // get the current mouse position
		});

		document.addEventListener('mouseup', (e: MouseEvent) => {
			if (!this.dragData.isDragging) return; // Returns if not dragging
			const differNotePos = {
				x: e.pageX - this.dragData.notePos.x,
				y: e.pageY - this.dragData.notePos.y,
			}; // Calculates the difference between the mouse position and the note position
			this.$position(differNotePos); // Sets the new position

			this.$save(); // Saves the notes new position

			this.dragData.isDragging = false; // Resets the dragging state
		});

		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (!NoteSelect.enabled) return;
			if (!this.dragData.isDragging) return; //Returns if not dragging

			const differNotePos = {
				x: e.pageX - this.dragData.notePos.x,
				y: e.pageY - this.dragData.notePos.y,
			}; // Difference between mouse and note previous position
			this.$position(differNotePos); // Updates the notes position by adding x and y as second param

			this.dragData.notePos = { x: e.pageX, y: e.pageY }; // Updates the notes previous position
		});
	};

	/* ====== Public Methods ================================================================= */

	public readonly $init = (): void => {
		document.querySelector(`${this.mainContainer} > svg`);

		document
			.querySelector(`${this.mainContainer} > svg`)
			?.insertAdjacentElement('beforeend', this.$getHTML());
		document
			.querySelector(`${this.mainContainer} > svg`)
			?.insertAdjacentElement('beforeend', this.$getHTML(true));

		this.$init_selectable();
		this.$init_draggable();

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
				label: 'pattern',
				value: this.values.pattern.replaceAll(',', '_'),
				fn: newVal => {
					this.$pattern(newVal.toString().replaceAll('_', ','));
					this.$save();
				},
			},
			{
				type: 'select',
				label: 'line-Start',
				value: this.values.markers.start,
				fn: newVal => {
					this.$markerStart(newVal.toString());
					this.$save();
				},
			},
			{
				type: 'select',
				label: 'line-End',
				value: this.values.markers.end,
				fn: newVal => {
					this.$markerEnd(newVal.toString());
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

		assignParam(this.valueIndex.stroke, this.values.stroke);
		assignParam(this.valueIndex.width, this.values.width);
		assignParam(this.valueIndex.markers.start, this.values.markers.start);
		assignParam(this.valueIndex.markers.end, this.values.markers.end);
		assignParam(this.valueIndex.pattern, this.values.pattern);

		console.log('Compressed Parameters: ', compressedParameters);
		const data = {
			type: this.noteType,
			parameters: compressedParameters,
			content: this.$compressPoints(),
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
			this.$save();
			return;
		} else {
			NoteStorage.updateNote(this.noteIndex, noteData);

			if (recordHistory) this.$saveHistory();
		}
	};

	public readonly $setValues = (values: any): void => {
		this.values = values;
		this.$setPoints();
		this.$setStroke();
		this.$setWidth();
		this.$setMarkers();
		this.$save(false);
	};

	public readonly $points = (
		points: { x: number; y: number }[] = this.values.points
	): { x: number; y: number }[] => {
		if (points && points !== this.values.points) {
			this.values.points = points;
			this.$setPoints();
		}

		return this.values.points;
	};

	public readonly $addPoint = (point: { x: number; y: number }): void => {
		this.values.points.push(point);
		this.$setPoints();
	};

	public readonly $removePoint = (index: number): void => {
		this.values.points.splice(index, 1);
		this.$setPoints();
	};

	public readonly $setPoint = (index: number, point: { x: number; y: number }): void => {
		this.values.points[index] = point;
		this.$setPoints();
	};

	public readonly $position = (add_position = { x: 0, y: 0 }) => {
		this.values.points = this.values.points.map(point => {
			return {
				x: point.x + add_position.x,
				y: point.y + add_position.y,
			};
		});
		this.$setPoints();
	};

	//size = { width: 0, height: 0 },
	public readonly $size = (add_size = { width: 0, height: 0 }) => {
		//scale the size based on the size of the note only using add_size
	};

	public readonly $rotation = (rotation: number = this.values.rotation) => {
		if (rotation && rotation !== this.values.rotation) {
			this.values.rotation = rotation;
			this.$setRotation();
		}
		return this.values.rotation;
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

	public readonly $pattern = (pattern: string = this.values.pattern): string => {
		if (pattern !== this.values.pattern) {
			this.values.pattern = pattern;
			this.$setPattern(); //Sets the pattern of the note
		}
		return this.values.pattern; //Returns the new pattern
	};

	public readonly $markerStart = (marker: string = this.values.markers.start): string => {
		if (marker !== this.values.markers.start) {
			this.values.markers.start = marker;
			this.$setMarkers(); //Sets the start marker of the note
		}
		return this.values.markers.start; //Returns the new start marker
	};

	public readonly $markerEnd = (marker: string = this.values.markers.end): string => {
		if (marker !== this.values.markers.end) {
			this.values.markers.end = marker;
			this.$setMarkers(); //Sets the end marker of the note
		}
		return this.values.markers.end; //Returns the new end marker
	};

	public readonly $getHTML = (hitLine = false): SVGPolylineElement => {
		let line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		line.classList.add(noteClass);
		line.setAttribute('id', hitLine ? this.$raw_id() + this.values.hitID : this.$raw_id());
		line.setAttribute('points', this.$compressPoints());
		if (!hitLine)
			line.setAttribute(
				'style',
				`
			marker-start: url(#${this.values.markers.start});
			marker-mid: none;
			marker-end: url(#${this.values.markers.end});
            fill: none;
            stroke: ${this.values.stroke};
            stroke-width: ${this.values.width};
			stroke-dasharray: ${this.values.pattern};
        `
			);
		else
			line.setAttribute(
				'style',
				`
			marker-start: none;
			marker-mid: none;
			marker-end: none;
			fill: none;
			stroke: rgb(0, 0, 0, 0);
			stroke-width: ${this.values.width + this.values.buffer};
		`
			);
		return line;
	};

	$getBoundingBox() {
		const points = this.$points();
		const pointsX = points.map(point => point.x);
		const pointsY = points.map(point => point.y);
		const x = Math.min(...pointsX) - this.values.buffer;
		const y = Math.min(...pointsY) - this.values.width / 2;
		const width = Math.max(...pointsX) - x + this.values.width / 2;
		const height = Math.max(...pointsY) - y + this.values.width / 2;
		return {
			x: x,
			y: y,
			width: width,
			height: height,
			rotation: this.values.rotation,
		};
	}

	public readonly $init_selectable = (): void => {
		const note = <HTMLElement>document.getElementById(this.$raw_id());
		const note2 = <HTMLElement>document.getElementById(this.$raw_id() + this.values.hitID);

		const fn = () => {
			NoteSelect.select(this);
		};

		note.addEventListener('pointerdown', fn, true);
		note2.addEventListener('pointerdown', fn, true);
	};
}
