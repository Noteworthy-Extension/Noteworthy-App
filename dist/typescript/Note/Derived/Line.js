import { NoteStorage } from '../Backend/NoteStorage.js';
import { NoteEncryption } from '../Backend/NoteEncryption.js';
import { Note, noteClass } from './../Note.js';
import { NoteSelect } from '../Backend/NoteSelect.js';
export class Line extends Note {
    constructor(parameters, content, index = 0) {
        super('Line', index);
        this.valueIndex = {
            opacity: 0,
            stroke: 1,
            width: 2,
            markers: {
                start: 3,
                end: 4,
            },
            pattern: 5,
        };
        this.values = {
            opacity: 100,
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
        this.$extractPoints = (content) => {
            const pointsArray = [];
            const points = content.split(' ');
            points.forEach(point => {
                const pointVal = point.split(',');
                pointsArray.push({ x: parseInt(pointVal[0]), y: parseInt(pointVal[1]) });
            });
            return pointsArray;
        };
        this.$compressPoints = (points = this.values.points) => {
            let compressedPoints = '';
            points.forEach(point => (compressedPoints += ` ${point.x},${point.y}`));
            return compressedPoints.trim();
        };
        this.$setPoints = (points = this.values.points) => {
            const note = document.getElementById(this.$raw_id());
            const note2 = document.getElementById(this.$raw_id() + this.values.hitID);
            note.setAttribute('points', this.$compressPoints(points));
            note2.setAttribute('points', this.$compressPoints(points));
            this.$setOrigin();
            NoteSelect.updateSelectBox();
        };
        this.$setOrigin = () => {
            const note = document.getElementById(this.$raw_id());
            const note2 = document.getElementById(this.$raw_id() + this.values.hitID);
            const pts = {
                x: this.values.points.map(point => point.x),
                y: this.values.points.map(point => point.y),
            };
            const average = {
                x: (Math.max(...pts.x) + Math.min(...pts.x)) / 2,
                y: (Math.max(...pts.y) + Math.min(...pts.y)) / 2,
            };
            note.style.transformOrigin = `${average.x}px ${average.y}px`;
            note2.style.transformOrigin = `${average.x}px ${average.y}px`;
        };
        this.$setRotation = (rotation = this.values.rotation) => {
            const note = document.getElementById(this.$raw_id());
            const note2 = document.getElementById(this.$raw_id() + this.values.hitID);
            note.style.rotate = `${rotation}deg`;
            note2.style.rotate = `${rotation}deg`;
            NoteSelect.updateSelectBox();
        };
        this.$setStroke = (stroke = this.values.stroke) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.style.stroke = stroke;
        };
        this.$setWidth = (width = this.values.width) => {
            const note = document.getElementById(this.$raw_id());
            const note2 = document.getElementById(this.$raw_id() + this.values.hitID);
            note.style.strokeWidth = `${width}px`;
            note2.style.strokeWidth = `${width + this.values.buffer}px`;
            NoteSelect.updateSelectBox();
        };
        this.$setOpacity = (opacity = this.values.opacity) => {
            const note = document.getElementById(this.$raw_id());
            const note2 = document.getElementById(this.$raw_id() + this.values.hitID);
            note.style.opacity = `${opacity}%`;
            note2.style.opacity = `${opacity}%`;
        };
        this.$setPattern = (pattern = this.values.pattern) => {
            const note = document.getElementById(this.$raw_id());
            note.style.strokeDasharray = pattern;
        };
        this.$setMarkers = (start = this.values.markers.start, end = this.values.markers.end) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.style.markerStart = `url(#${start})`;
            note.style.markerEnd = `url(#${end})`;
        };
        this.dragData = {
            isDragging: false,
            notePos: { x: 0, y: 0 },
        };
        this.$init_draggable = () => {
            const note = document.getElementById(this.$raw_id() + this.values.hitID);
            note.addEventListener('mousedown', (e) => {
                e.stopImmediatePropagation();
                if (!NoteSelect.enabled)
                    return;
                this.dragData.isDragging = true;
                this.dragData.notePos = { x: e.pageX, y: e.pageY };
            });
            document.addEventListener('mouseup', (e) => {
                if (!this.dragData.isDragging)
                    return;
                const differNotePos = {
                    x: e.pageX - this.dragData.notePos.x,
                    y: e.pageY - this.dragData.notePos.y,
                };
                this.$position(this.values.position, differNotePos);
                this.$save();
                this.dragData.isDragging = false;
            });
            document.addEventListener('mousemove', (e) => {
                if (!NoteSelect.enabled)
                    return;
                if (!this.dragData.isDragging)
                    return;
                const differNotePos = {
                    x: e.pageX - this.dragData.notePos.x,
                    y: e.pageY - this.dragData.notePos.y,
                };
                this.$position(this.values.position, differNotePos);
                this.dragData.notePos = { x: e.pageX, y: e.pageY };
            });
        };
        this.$init = () => {
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
        this.$getInputs = () => {
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
                    label: 'opacity',
                    value: this.values.opacity,
                    fn: newVal => {
                        this.$opacity(parseInt(newVal.toString()));
                        this.$save();
                    }
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
        this.$data = () => {
            const compressedParameters = [];
            const assignParam = (index, val) => {
                compressedParameters[index] = val;
            };
            assignParam(this.valueIndex.opacity, this.values.opacity);
            assignParam(this.valueIndex.stroke, this.values.stroke);
            assignParam(this.valueIndex.width, this.values.width);
            assignParam(this.valueIndex.markers.start, this.values.markers.start);
            assignParam(this.valueIndex.markers.end, this.values.markers.end);
            assignParam(this.valueIndex.pattern, this.values.pattern);
            const data = {
                type: this.noteType,
                parameters: compressedParameters,
                content: this.$compressPoints(),
                index: this.noteIndex,
            };
            return data;
        };
        this.$save = (recordHistory = true) => {
            const noteData = NoteEncryption.encode(this.$data());
            if (NoteSelect.active == this)
                NoteSelect.updateSelectBox();
            if (this.noteIndex === 0) {
                this.noteIndex = NoteStorage.saveNote(noteData);
                this.$updateID();
                this.$save();
                return;
            }
            else {
                NoteStorage.updateNote(this.noteIndex, noteData);
                if (recordHistory)
                    this.$saveHistory();
            }
        };
        this.$setValues = (values) => {
            this.values = values;
            this.$setPoints();
            this.$setStroke();
            this.$setWidth();
            this.$setMarkers();
            this.$save(false);
        };
        this.$points = (points = this.values.points) => {
            if (points && points !== this.values.points) {
                this.values.points = points;
                this.$setPoints();
            }
            return this.values.points;
        };
        this.$addPoint = (point) => {
            this.values.points.push(point);
            this.$setPoints();
        };
        this.$removePoint = (index) => {
            this.values.points.splice(index, 1);
            this.$setPoints();
        };
        this.$setPoint = (index, point) => {
            this.values.points[index] = point;
            this.$setPoints();
        };
        this.$position = (position = { x: 0, y: 0 }, add_position = { x: 0, y: 0 }) => {
            this.values.points = this.values.points.map(point => {
                return {
                    x: point.x + add_position.x,
                    y: point.y + add_position.y,
                };
            });
            this.$setPoints();
        };
        this.$size = (size = { width: 0, height: 0 }, add_size = { width: 0, height: 0 }, pos = { width: false, height: false }) => {
            const maxX = Math.max(...this.values.points.map(point => point.x));
            const maxY = Math.max(...this.values.points.map(point => point.y));
            const min = {
                x: Math.min(...this.values.points.map(point => point.x)),
                y: Math.min(...this.values.points.map(point => point.y)),
            };
            const ratioX = add_size.width != 0 ? (maxX + add_size.width) / maxX : 1;
            const ratioY = add_size.height != 0 ? (maxY + add_size.height) / maxY : 1;
            this.values.points = this.values.points.map(point => {
                return {
                    x: point.x * ratioX - (maxX * ratioX - maxX),
                    y: point.y * ratioY - (maxY * ratioY - maxY),
                };
            });
            const newMin = {
                x: Math.min(...this.values.points.map(point => point.x)),
                y: Math.min(...this.values.points.map(point => point.y)),
            };
            if (pos.width)
                this.$position(this.values.position, { x: min.x - newMin.x, y: 0 });
            if (pos.height)
                this.$position(this.values.position, { x: 0, y: min.y - newMin.y });
            this.$setPoints();
        };
        this.$rotation = (rotation = this.values.rotation) => {
            if (rotation && rotation !== this.values.rotation) {
                this.values.rotation = rotation;
                this.$setRotation();
            }
            return this.values.rotation;
        };
        this.$stroke = (stroke = this.values.stroke) => {
            if (stroke !== this.values.stroke) {
                this.values.stroke = stroke;
                this.$setStroke();
            }
            return this.values.stroke;
        };
        this.$width = (width = this.values.width) => {
            if (width !== this.values.width) {
                this.values.width = width;
                this.$setWidth();
            }
            return this.values.width;
        };
        this.$opacity = (opacity = this.values.opacity) => {
            if (opacity !== this.values.opacity) {
                this.values.opacity = opacity;
                this.$setOpacity();
            }
            return this.values.opacity;
        };
        this.$pattern = (pattern = this.values.pattern) => {
            if (pattern !== this.values.pattern) {
                this.values.pattern = pattern;
                this.$setPattern();
            }
            return this.values.pattern;
        };
        this.$markerStart = (marker = this.values.markers.start) => {
            if (marker !== this.values.markers.start) {
                this.values.markers.start = marker;
                this.$setMarkers();
            }
            return this.values.markers.start;
        };
        this.$markerEnd = (marker = this.values.markers.end) => {
            if (marker !== this.values.markers.end) {
                this.values.markers.end = marker;
                this.$setMarkers();
            }
            return this.values.markers.end;
        };
        this.$getHTML = (hitLine = false) => {
            let line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            line.classList.add(noteClass);
            line.setAttribute('id', hitLine ? this.$raw_id() + this.values.hitID : this.$raw_id());
            line.setAttribute('points', this.$compressPoints());
            if (!hitLine)
                line.setAttribute('style', `
			marker-start: url(#${this.values.markers.start});
			marker-mid: none;
			marker-end: url(#${this.values.markers.end});
            fill: none;
			opacity: ${this.values.opacity}%;
            stroke: ${this.values.stroke};
            stroke-width: ${this.values.width};
			stroke-dasharray: ${this.values.pattern};
        `);
            else
                line.setAttribute('style', `
			marker-start: none;
			marker-mid: none;
			marker-end: none;
			fill: none;
			stroke: rgb(0, 0, 0, 0);
			stroke-width: ${this.values.width + this.values.buffer};
		`);
            return line;
        };
        this.$updateID = () => {
            const noteElement = document.getElementById(this.$raw_id());
            const noteElement2 = document.getElementById(this.$raw_id() + this.values.hitID);
            this.noteID = `${this.noteType}-${this.noteIndex}`;
            if (noteElement)
                noteElement.setAttribute('id', this.noteID);
            if (noteElement2)
                noteElement2.setAttribute('id', this.noteID + this.values.hitID);
        };
        this.$init_selectable = () => {
            const note = document.getElementById(this.$raw_id());
            const note2 = document.getElementById(this.$raw_id() + this.values.hitID);
            const fn = () => {
                NoteSelect.select(this);
            };
            note.addEventListener('pointerdown', fn, true);
            note2.addEventListener('pointerdown', fn, true);
        };
        this.values.opacity = parseInt(parameters[this.valueIndex.opacity]?.toString()) || this.values.opacity;
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
}
