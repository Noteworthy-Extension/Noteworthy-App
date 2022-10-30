import { inject } from './../../util/common.js';
import { NoteTypes } from '../Note';
import { EditBar } from 'src/typescript/UI/Rendered/EditBar/EditBar.js';
import { Textbox } from '../Derived/Textbox.js';
import { NoteEncryption } from './NoteEncryption.js';
import { NoteHistory } from './NoteHistory.js';
import { NoteStorage } from './NoteStorage.js';
import { Rect } from '../Derived/Rect.js';
import { Circle } from '../Derived/Circle.js';
import { Line } from '../Derived/Line.js';

const selectBoxHandleHTML = `
    <div class="Noteworthy-selectBox-handle handle-r_line"></div>
    <div class="Noteworthy-selectBox-handle handle-r"></div>

    <div class="Noteworthy-selectBox-handle handle-n handle-w"></div>
    <div class="Noteworthy-selectBox-handle handle-n handle-e"></div>
    <div class="Noteworthy-selectBox-handle handle-s handle-w"></div>
    <div class="Noteworthy-selectBox-handle handle-s handle-e"></div>

    <div class="Noteworthy-selectBox-handle handle-n"></div>
    <div class="Noteworthy-selectBox-handle handle-s"></div>
    <div class="Noteworthy-selectBox-handle handle-w"></div>
    <div class="Noteworthy-selectBox-handle handle-e"></div>
`;

export const NoteSelect = {
	active: <NoteTypes | null>null,

	enabled: false,

	copyKey: 'NoteWorthyOfficialClipboard',

	init: () => {
		document.addEventListener('click', (e: MouseEvent) => {
			if (!(<Element>e.target).closest('#NoteWorthyOfficial')) NoteSelect.unselect();
		});

		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (!NoteSelect.enabled) return;
			if (!NoteSelect.active) return;
			if (NoteSelect.active instanceof Textbox && NoteSelect.active.$isFocusedEditor()) {
				if (e.key === 'Escape') NoteSelect.active.$enableEditor(false);
				return;
			}
			if (e.key === 'c' && e.ctrlKey) {
				navigator.clipboard.writeText(
					NoteSelect.copyKey + NoteEncryption.encode(NoteSelect.active.$data())
				);
			}
			if (e.key === 'Escape') NoteSelect.unselect();
			if (e.key === 'Backspace') {
				if (confirm('Are you sure you want to delete this note?')) {
					NoteSelect.active.$delete();
					NoteSelect.unselect();
				}
			}
		});

		//add event listener to paste event
		document.addEventListener('paste', (e: ClipboardEvent) => {
			if (!NoteSelect.enabled) return;
			if (NoteSelect.active instanceof Textbox && NoteSelect.active.$isFocusedEditor()) return;
			let text = e.clipboardData?.getData('text/plain').trim();
			if (!text) return;
			if (!text.startsWith(NoteSelect.copyKey)) return;
			text = text.replace(NoteSelect.copyKey, '');
			e.preventDefault();
			const data = NoteEncryption.decode(text);
			console.log('GOT THE DATA FROM THE CLIPBOARD: ', data);
			switch (data.type) {
				case 'Textbox':
					NoteSelect.active = new Textbox(data.parameters, data.content);
					break;
				case 'Rect':
					NoteSelect.active = new Rect(data.parameters, data.content);
					break;
				case 'Circle':
					NoteSelect.active = new Circle(data.parameters, data.content);
					break;
				case 'Line':
					NoteSelect.active = new Line(data.parameters, data.content);
					break;
			}
		});
	},

	unselect: () => {
		if (NoteSelect.active) {
			NoteSelect.active = null;
			NoteSelect.clearSelectBox();
			EditBar.clear();
			EditBar.hide();
		}
	},

	select: (note: NoteTypes) => {
		if (!NoteSelect.enabled) return;
		if (NoteSelect.active === note) return;
		NoteSelect.active = note;
		NoteSelect.addSelectBox();
		NoteSelect.updateEditBar();
	},

	clearSelectBox: () => {
		const selectBox = document.querySelectorAll(`#Noteworthy-selectBox`);
		selectBox.forEach(box => {
			box.remove();
		});
	},

	updateEditBar: () => {
		if (!NoteSelect.active) return;
		EditBar.loadInputs(NoteSelect.active.$getInputs());
		if (NoteSelect.active instanceof Textbox) EditBar.showToolbar(NoteSelect.active.$raw_id());
	},

	updateSelectBox: () => {
		if (!NoteSelect.active) return;
		console.log('Updating select box');
		const selectBox = document.getElementById('Noteworthy-selectBox');
		const boundaries = NoteSelect.active.$getBoundingBox();
		if (selectBox) {
			selectBox.style.top = `${boundaries.y}px`;
			selectBox.style.left = `${boundaries.x}px`;
			selectBox.style.width = `${boundaries.width}px`;
			selectBox.style.height = `${boundaries.height}px`;
			// if (
			// 	parseInt(selectBox.style.rotate) !== boundaries.rotation ||
			// 	selectBox.classList.contains('Noteworthy-selectBox-uninitialized')
			// ) {
			// 	console.log('Rotating select box');
			// 	if (selectBox.classList.contains('Noteworthy-selectBox-uninitialized'))
			// 		selectBox.classList.remove('Noteworthy-selectBox-uninitialized');
			// 	const handles = selectBox.querySelectorAll('.Noteworthy-selectBox-handle');
			// 	handles.forEach(handle => {
			// 		if (!handle) return;
			// 		if (handle.classList.contains('handle-r_line') || handle.classList.contains('hander-r'))
			// 			return;

			// 		handle.classList.remove('handlemove-n');
			// 		handle.classList.remove('handlemove-s');
			// 		handle.classList.remove('handlemove-e');
			// 		handle.classList.remove('handlemove-w');

			// 		const inRange = (rot: number, range: number) => {
			// 			return (rot >= range - 45 / 2 && rot <= range + 45 / 2) || rot === range;
			// 		};
			// 		const addClass = (classes: string[]) => {
			// 			classes.forEach(c => handle.classList.add(c));
			// 		};

			// 		const rotation = boundaries.rotation;

			// 		let rotations = [0, 45, 90, 135, 180, 225, 270, 315];

			// 		const classes = [
			// 			['handlemove-n'],
			// 			['handlemove-n', 'handlemove-e'],
			// 			['handlemove-e'],
			// 			['handlemove-s', 'handlemove-e'],
			// 			['handlemove-s'],
			// 			['handlemove-s', 'handlemove-w'],
			// 			['handlemove-w'],
			// 			['handlemove-n', 'handlemove-w'],
			// 		];

			// 		let offset = 0;
			// 		if (handle.classList.contains('handle-n') && handle.classList.contains('handle-e')) {
			// 			offset = 1;
			// 		} else if (handle.classList.contains('handle-e')) {
			// 			offset = 2;
			// 		} else if (handle.classList.contains('handle-s') && handle.classList.contains('handle-e')) {
			// 			offset = 3;
			// 		} else if (handle.classList.contains('handle-s')) {
			// 			offset = 4;
			// 		} else if (handle.classList.contains('handle-s') && handle.classList.contains('handle-w')) {
			// 			offset = 5;
			// 		} else if (handle.classList.contains('handle-w')) {
			// 			offset = 6;
			// 		} else if (handle.classList.contains('handle-n') && handle.classList.contains('handle-w')) {
			// 			offset = 7;
			// 		}

			// 		//using offset, take items from start of rotations array and put at end
			// 		//then check if rotation is in range of any of the rotations
			// 		//if it is, add the classes for that rotation
			// 		//if not, add the classes for the first rotation

			// 		rotations = rotations.slice(offset).concat(rotations.slice(0, offset));

			// 		console.log("offset: " + offset);
			// 		console.log("rotations: " + rotations);

			// 		for (let i = 0; i < rotations.length; i++) {
			// 			const rot = rotations[i];
			// 			if (inRange(rotation, rot)) {
			// 				addClass(classes[i]);
			// 				break;
			// 			}
			// 		}
			// 		console.log(handle.classList);
			// 	});
			// }
			selectBox.style.rotate = `${boundaries.rotation}deg`;
		}
	},

	addSelectBox: () => {
		if (!NoteSelect.active) return;
		NoteSelect.clearSelectBox();
		const note = document.getElementById(NoteSelect.active.$raw_id());
		if (note === null) return;

		const boundaries = NoteSelect.active.$getBoundingBox();

		const selectBoxHTML = `
            <div
				id="Noteworthy-selectBox"
				class="Noteworthy-selectBox Noteworthy-selectBox-uninitialized"
				style="position: absolute;
				top: ${boundaries.y}px;
				left: ${boundaries.x}px;
				width: ${boundaries.width}px;
				height: ${boundaries.height}px;
				rotate: ${boundaries.rotation}deg;
				">
                ${selectBoxHandleHTML}
            </div>
        `;

		inject('#NoteWorthyOfficial-MainContainer', selectBoxHTML);

		NoteSelect.updateSelectBox();
		NoteSelect.initSelectBox(<HTMLElement>document.querySelector('#Noteworthy-selectBox'));
	},

	initSelectBox: (selectBox: HTMLElement) => {
		if (!NoteSelect.active) return;

		const initHandle = (handle: HTMLElement) => {
			if (!NoteSelect.active) return;
			if (handle.classList.contains('handle-r_line')) return;
			if (!handle.classList.contains('handle-r')) {
				const handleData = {
					moving: false,
					x: 0,
					y: 0,

					mousedown: (e: MouseEvent) => {
						if (!NoteSelect.active) return;
						handleData.moving = true;
						handleData.x = e.clientX;
						handleData.y = e.clientY;
					},
					mousemove: (e: MouseEvent) => {
						if (!NoteSelect.active) return;
						if (!handleData.moving) return;
						if (handle.classList.contains('handle-w')) {
							const deltaX = -(e.clientX - handleData.x);
							if(!(NoteSelect.active instanceof Line))
							NoteSelect.active.$position(NoteSelect.active.values.position, { x: -deltaX, y: 0 });
							NoteSelect.active.$size(NoteSelect.active.values.size, { width: deltaX, height: 0 });
						} else if (handle.classList.contains('handle-e')) {
							const deltaX = e.clientX - handleData.x;
							// if (NoteSelect.active instanceof Line) NoteSelect.active.$position(NoteSelect.active.values.position, { x: deltaX, y: 0});
							NoteSelect.active.$size(NoteSelect.active.values.size, { width: deltaX, height: 0 }, { width: true, height: false });
						}
						if (handle.classList.contains('handle-n')) {
							const deltaY = -(e.clientY - handleData.y);
							if(!(NoteSelect.active instanceof Line))
							NoteSelect.active.$position(NoteSelect.active.values.position, { x: 0, y: -deltaY });
							NoteSelect.active.$size(NoteSelect.active.values.size, { width: 0, height: deltaY });
						} else if (handle.classList.contains('handle-s')) {
							const deltaY = e.clientY - handleData.y;
							// if (NoteSelect.active instanceof Line) NoteSelect.active.$position(NoteSelect.active.values.position, { x: 0, y: deltaY });
							NoteSelect.active.$size(NoteSelect.active.values.size, { width: 0, height: deltaY }, { width: false, height: true });
						}

						handleData.x = e.clientX;
						handleData.y = e.clientY;
						NoteSelect.updateSelectBox();
					},
					mouseup: () => {
						if (!NoteSelect.active) return;
						if (!handleData.moving) return;
						handleData.moving = false;
						NoteSelect.active.$save();
					},
				};
				handle.addEventListener('mousedown', handleData.mousedown);
				document.addEventListener('mousemove', handleData.mousemove);
				document.addEventListener('mouseup', handleData.mouseup);
			} else {
				const handleData = {
					moving: false,
					rot: NoteSelect.active.values.rotation,
					x: 0,
					y: 0,

					mousedown: (e: MouseEvent) => {
						if (!NoteSelect.active) return;
						handleData.moving = true;

						const boundaries = NoteSelect.active.$getBoundingBox();
						handleData.x = boundaries.x + boundaries.width / 2;
						handleData.y = boundaries.y + boundaries.height / 2;
					},
					mousemove: (e: MouseEvent) => {
						if (!NoteSelect.active) return;
						if (!handleData.moving) return;
						const deltaX = e.clientX - handleData.x;
						const deltaY = e.clientY - handleData.y;

						const rot = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
						NoteSelect.active.$rotation(rot);

						NoteSelect.updateSelectBox();
						handleData.rot = rot;
					},
					mouseup: () => {
						if (!NoteSelect.active) return;
						if (!handleData.moving) return;
						handleData.moving = false;
						NoteSelect.active.$save();
						NoteSelect.updateSelectBox();
					},
				};
				handle.addEventListener('mousedown', handleData.mousedown);
				document.addEventListener('mousemove', handleData.mousemove);
				document.addEventListener('mouseup', handleData.mouseup);
			}
		};

		const handles = selectBox.querySelectorAll('.Noteworthy-selectBox-handle');
		handles.forEach(handle => initHandle(<HTMLElement>handle));
	},
};
