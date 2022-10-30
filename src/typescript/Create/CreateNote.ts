import { Circle } from '../Note/Derived/Circle.js';
import { Line } from '../Note/Derived/Line.js';
import { Rect } from '../Note/Derived/Rect.js';
import { Textbox } from '../Note/Derived/Textbox.js';
import { EditBar } from '../UI/Rendered/EditBar/EditBar.js';
import type { inputsListType } from '../UI/Rendered/EditBar/EditBar.js';
import { OptionsBar } from '../UI/Rendered/OptionsBar/OptionsBar.js';

let activeElement: null | Textbox | Rect | Circle | Line;

const createData = {
	createEnabled: true,
	firstPos: {
		x: 0,
		y: 0,
	},
	active: {
		shape: 'Rect',
		line: 'Line',
		polyline: 'Line',
		draw: 'Pencil',
	},
	enabled: {
		shape: false,
		line: false,
		polyline: false,
		draw: false,
	},
	defaultparam: {
		line: {
			opacity: 100,
			color: '#000000',
			width: 2,
			markers: {
				start: 'none',
				end: 'none',
			},
			pattern: 'none',
		},
		shape: {
			rotation: 0,
			fill: 'rgba(0, 0, 0, 0)',
			stroke: 'none',
			width: 2,
			radius: 0,
		},
	},
	param: {
		line: {
			opacity: 1,
			color: '#000000',
			width: 2,
			markers: {
				start: 'none',
				end: 'none',
			},
			pattern: 'none',
		},
		shape: {
			constraint: false,
			rotation: 0,
			fill: 'rgba(0, 0, 0, 0)',
			stroke: 'none',
			width: 2,
			radius: 0,
		},
	},
};

export const createNote = {
	escapeCreate: (): void => {
		if (!activeElement) return;
		activeElement.$delete();
		activeElement = null;
	},

	finishCreate: (pointer = false): void => {
		if (!activeElement) return;
		activeElement.$save();
		activeElement = null;
		if (pointer) OptionsBar.setActive('option-select');
	},

	checkBoundary: (e: any): boolean => {
		if (
			e.target === document.querySelectorAll('#NoteWorthyOfficial > .Noteworthy_options_bar') ||
			e.target.closest('.Noteworthy_options_bar') ||
			e.target === document.querySelectorAll('#NoteWorthyOfficial > .Noteworthy-edit_bar') ||
			e.target.closest('.Noteworthy-edit_bar')
		)
			return true;
		else return false;
	},

	initNote: () => {
		document.addEventListener('mousedown', e => {
			if (!createData.enabled.shape) return;
			if (createNote.checkBoundary(e)) return;
			if (activeElement) return;

			createData.firstPos = {
				x: e.pageX,
				y: e.pageY,
			};

			switch (createData.active.shape) {
				case 'textbox':
				case 'text':
					activeElement = new Textbox(
						[
							createData.firstPos.x,
							createData.firstPos.y,
							0,
							0,
							createData.param.shape.rotation,
							createData.param.shape.fill,
							createData.param.shape.stroke,
							createData.param.shape.width,
							createData.param.shape.radius,
						],
						''
					);
					break;
				case 'square':
				case 'rect':
					activeElement = new Rect(
						[
							createData.firstPos.x,
							createData.firstPos.y,
							0,
							0,
							createData.param.shape.rotation,
							createData.param.shape.fill,
							createData.param.shape.stroke,
							createData.param.shape.width,
							createData.param.shape.radius,
						],
						''
					);
					break;
				case 'circle':
				case 'ellipse':
					activeElement = new Circle(
						[
							createData.firstPos.x,
							createData.firstPos.y,
							0,
							0,
							createData.param.shape.rotation,
							createData.param.shape.fill,
							createData.param.shape.stroke,
							createData.param.shape.width,
							createData.param.shape.radius,
						],
						''
					);
					break;
			}
		});

		document.addEventListener('mouseup', () => {
			if (!createData.enabled.shape) return;
			createNote.finishCreate(true);
			createNote.disableAll();
		});

		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (!createData.enabled.shape) return;
			if (!activeElement || activeElement instanceof Line) return;

			if (
				(activeElement instanceof Textbox || activeElement instanceof Rect) &&
				!createData.param.shape.constraint
			) {
				if (e.pageX < createData.firstPos.x) {
					activeElement.$position({
						x: createData.firstPos.x - (createData.firstPos.x - e.pageX),
						y: activeElement.$position().y,
					});
				}
				if (e.pageY < createData.firstPos.y) {
					activeElement.$position({
						x: activeElement.$position().x,
						y: createData.firstPos.y - (createData.firstPos.y - e.pageY),
					});
				}
			}

			if (createData.param.shape.constraint) {
				const size =
					Math.round(
						(Math.abs(e.pageX - createData.firstPos.x) + Math.abs(e.pageY - createData.firstPos.y)) / 2
					) * 2;
				if (activeElement instanceof Rect) {
					activeElement.$position({
						x: createData.firstPos.x - size / 2,
						y: createData.firstPos.y - size / 2,
					});
				}
				activeElement.$size({
					width: Math.abs(size),
					height: Math.abs(size),
				});
			} else {
				activeElement.$size({
					width: Math.abs(e.pageX - createData.firstPos.x),
					height: Math.abs(e.pageY - createData.firstPos.y),
				});
			}
		});
	},
	initLine: () => {
		document.addEventListener('mousedown', (e: MouseEvent) => {
			if (!createData.enabled.line) return;
			if (createNote.checkBoundary(e)) return;
			if (activeElement) return;

			createData.firstPos = {
				x: e.pageX,
				y: e.pageY,
			};

			activeElement = new Line(
				[
					createData.param.line.opacity,
					createData.param.line.color,
					createData.param.line.width,
					createData.param.line.markers.start,
					createData.param.line.markers.end,
					createData.param.line.pattern,
				],
				`${createData.firstPos.x},${createData.firstPos.y} ${createData.firstPos.x},${createData.firstPos.y}`
			);
		});

		document.addEventListener('mouseup', () => {
			if (!createData.enabled.line) return;
			createNote.finishCreate(true);
		});

		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (!createData.enabled.line) return;
			if (!activeElement || !(activeElement instanceof Line)) return;

			activeElement.$points([
				{ x: createData.firstPos.x, y: createData.firstPos.y },
				{ x: e.pageX, y: e.pageY },
			]);
		});
	},

	initPolyline: () => {
		document.addEventListener('click', (e: MouseEvent) => {
			if (!createData.enabled.polyline) return;
			if (createNote.checkBoundary(e)) return;
			if (activeElement && activeElement instanceof Line) {
				activeElement.$points([...activeElement.$points(), { x: e.pageX, y: e.pageY }]);
				activeElement.$save();
			} else {
				createData.firstPos = {
					x: e.pageX,
					y: e.pageY,
				};

				activeElement = new Line(
					[
						createData.param.line.opacity,
						createData.param.line.color,
						createData.param.line.width,
						createData.param.line.markers.start,
						createData.param.line.markers.end,
						createData.param.line.pattern,
					],
					`${createData.firstPos.x},${createData.firstPos.y} ${createData.firstPos.x},${createData.firstPos.y}`
				);
			}
		});

		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (!createData.enabled.polyline) return;
			if (!activeElement || !(activeElement instanceof Line)) return;

			const points = activeElement.$points();
			const newPoints = [...points.slice(0, points.length - 1), { x: e.pageX, y: e.pageY }];

			activeElement.$points(newPoints);
		});

		document.addEventListener('dblclick', () => {
			if (!createData.enabled.polyline) return;
			createNote.finishCreate(true);
		});
	},

	initDraw: () => {
		document.addEventListener('mousedown', (e: MouseEvent) => {
			if (!createData.enabled.draw) return;
			if (createNote.checkBoundary(e)) return;
			if (activeElement) return;

			activeElement = new Line(
				[
					createData.param.line.opacity,
					createData.param.line.color,
					createData.param.line.width,
					createData.param.line.markers.start,
					createData.param.line.markers.end,
					createData.param.line.pattern,
				],
				`${e.pageX},${e.pageY}`
			);
		});

		document.addEventListener('mouseup', () => {
			if (!createData.enabled.draw) return;
			createNote.finishCreate();
		});

		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (!createData.enabled.draw) return;
			if (!activeElement || !(activeElement instanceof Line)) return;

			activeElement.$addPoint({ x: e.pageX, y: e.pageY });
		});
	},

	init: () => {
		createNote.initNote();
		createNote.initLine();
		createNote.initPolyline();
		createNote.initDraw();

		document.addEventListener('mousemove', () => {
			if (!Object.values(createData.enabled).includes(true)) return;
			window.getSelection()?.removeAllRanges();
		});

		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (!Object.values(createData.enabled).includes(true)) return;

			if (!activeElement) {
				if (
					(e.key === 'Escape')
				) {
					console.log('cancel');
					createNote.disableAll();
					OptionsBar.setActive("option-select");
				}
				return;
			}

			if (e.key === 'Escape') createNote.escapeCreate();

			if (e.key === 'Enter') createNote.finishCreate();
		});
	},

	disableAll: () => {
		createData.enabled.shape = false;
		createData.enabled.line = false;
		createData.enabled.polyline = false;
		createData.enabled.draw = false;
		createData.param.line = JSON.parse(JSON.stringify(createData.defaultparam.line));
		createData.param.shape = JSON.parse(JSON.stringify(createData.defaultparam.shape));
	},
	enableShape: (shape: string) => {
		createData.active.shape = shape;
		createData.enabled.shape = true;
		switch (createData.active.shape) {
			case 'textbox':
				createData.param.shape.fill = 'rgb(255, 255, 255)';
				break;
			case 'text':
				createData.param.shape.fill = 'rgb(0, 0, 0, 0)';
				break;
			case 'circle':
			case 'square':
				createData.param.shape.constraint = true;
				createData.param.shape.stroke = 'rgb(0, 0, 0)';
				createData.param.shape.width = 1;
				break;
			case 'rect':
			case 'ellipse':
				createData.param.shape.stroke = 'rgb(0, 0, 0)';
				createData.param.shape.width = 1;
				break;
		}
		const inputs: inputsListType = [
			{
				type: 'color',
				label: 'stroke',
				value: createData.param.shape.stroke,
				fn: newVal => {
					createData.param.shape.stroke = newVal.toString();
				},
			},
			{
				type: 'color',
				label: 'fill',
				value: createData.param.shape.fill,
				fn: newVal => {
					createData.param.shape.fill = newVal.toString();
				},
			},
			{
				type: 'select',
				label: 'width',
				value: createData.param.shape.width,
				fn: newVal => {
					createData.param.shape.width = parseInt(newVal.toString());
				},
			},
		];
		switch (createData.active.shape) {
			case 'textbox':
			case 'text':
			case 'square':
			case 'rect':
				inputs.push({
					type: 'select',
					label: 'radius',
					value: createData.param.shape.radius,
					fn: newVal => {
						createData.param.shape.radius = parseInt(newVal.toString());
					},
				});
				break;
			case 'circle':
			case 'ellipse':
				break;

			default:
				break;
		}
		// for (const key in createData.param.shape) {
		// 	inputs.push({
		// 		label: key,
		// 		type: typeof createData.param.shape[key],
		// 		fn: (element: HTMLInputElement): void => {
		// 			if (!element) return;
		// 			element.value = createData.param.shape[key];
		// 			element.addEventListener('change', () => {
		// 				createData.param.shape[key] = element.value;
		// 			});
		// 		},
		// 	});
		// }
		EditBar.loadInputs(inputs);
	},

	enableLine: (line: string) => {
		createData.active.line = line;
		createData.enabled.line = true;
		console.log('CREATING LINE: ', createData.active.line);
		switch (createData.active.line) {
			case 'line':
				break;
			case 'arrow':
				createData.param.line.markers.end = 'arrow';
				break;
		}
		const inputs: inputsListType = [
			{
				type: 'color',
				label: 'stroke',
				value: createData.param.line.color,
				fn: newVal => {
					createData.param.shape.stroke = newVal.toString();
				},
			},
			{
				type: 'select',
				label: 'width',
				value: createData.param.line.width,
				fn: newVal => {
					createData.param.shape.width = parseInt(newVal.toString());
				},
			},
			{
				type: 'select',
				label: 'opacity',
				value: createData.param.line.opacity,
				fn: newVal => {
					createData.param.line.opacity = parseFloat(newVal.toString());
				},
			},
			{
				type: 'select',
				label: 'line-Start',
				value: createData.param.line.markers.start,
				fn: newVal => {
					createData.param.line.markers.start = newVal.toString();
				},
			},
			{
				type: 'select',
				label: 'line-End',
				value: createData.param.line.markers.end,
				fn: newVal => {
					createData.param.line.markers.end = newVal.toString();
				},
			},
		];
		EditBar.loadInputs(inputs);
	},

	enablePolyline: (polyline: string) => {
		createData.active.polyline = polyline;
		createData.enabled.polyline = true;
		switch (createData.active.polyline) {
			case 'polyline':
				break;
			case 'polyarrow':
				createData.param.line.markers.end = 'arrow';
				break;
		}

		const inputs: inputsListType = [
			{
				type: 'color',
				label: 'stroke',
				value: createData.param.line.color,
				fn: newVal => {
					createData.param.shape.stroke = newVal.toString();
				},
			},
			{
				type: 'select',
				label: 'width',
				value: createData.param.line.width,
				fn: newVal => {
					createData.param.shape.width = parseInt(newVal.toString());
				},
			},
			{
				type: 'select',
				label: 'opacity',
				value: createData.param.line.opacity,
				fn: newVal => {
					createData.param.line.opacity = parseFloat(newVal.toString());
				},
			},
			{
				type: 'select',
				label: 'line-Start',
				value: createData.param.line.markers.start,
				fn: newVal => {
					createData.param.line.markers.start = newVal.toString();
				},
			},
			{
				type: 'select',
				label: 'line-End',
				value: createData.param.line.markers.end,
				fn: newVal => {
					createData.param.line.markers.end = newVal.toString();
				},
			},
		];
		EditBar.loadInputs(inputs);
	},

	enableDraw: (draw: string) => {
		createData.active.draw = draw;
		createData.enabled.draw = true;
		switch (createData.active.draw) {
			case 'pencil':
				createData.param.line.width = 1;
				break;
			case 'brush':
				createData.param.line.width = 3;
				break;
			case 'highlight':
				createData.param.line.width = 15;
				createData.param.line.color = '#ffff00';
				createData.param.line.opacity = 50;
				break;
			default:
		}
		const inputs: inputsListType = [
			{
				type: 'color',
				label: 'stroke',
				value: createData.param.line.color,
				fn: newVal => {
					createData.param.shape.stroke = newVal.toString();
				},
			},
			{
				type: 'select',
				label: 'width',
				value: createData.param.line.width,
				fn: newVal => {
					createData.param.shape.width = parseInt(newVal.toString());
				},
			},
			{
				type: 'select',
				label: 'opacity',
				value: createData.param.line.opacity,
				fn: newVal => {
					createData.param.line.opacity = parseFloat(newVal.toString());
				},
			},
			{
				type: 'select',
				label: 'line-Start',
				value: createData.param.line.markers.start,
				fn: newVal => {
					createData.param.line.markers.start = newVal.toString();
				},
			},
			{
				type: 'select',
				label: 'line-End',
				value: createData.param.line.markers.end,
				fn: newVal => {
					createData.param.line.markers.end = newVal.toString();
				},
			},
		];
		EditBar.loadInputs(inputs);
	},
};
