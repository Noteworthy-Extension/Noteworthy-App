import { Note } from './../Note.js';
import { NoteStorage } from '../Backend/NoteStorage.js';
import { NoteEncryption } from '../Backend/NoteEncryption.js';
import { NoteData } from '../Backend/NoteData.js';
import { EditBar } from 'src/typescript/UI/Rendered/EditBar/EditBar.js';
import { NoteSelect } from '../Backend/NoteSelect.js';
export class Textbox extends Note {
    constructor(parameters, content, index = 0) {
        super('Textbox', index);
        this.editor = null;
        this.valueIndex = {
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
        this.values = {
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
        this.$setPosition = (position = this.values.position) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.style.left = `${position.x}px`;
            note.style.top = `${position.y}px`;
            NoteSelect.updateSelectBox();
        };
        this.$setSize = (size = this.values.size) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.style.width = `${size.width}px`;
            note.style.height = `${size.height}px`;
            NoteSelect.updateSelectBox();
        };
        this.$setRotation = (rotation = this.values.rotation) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.style.rotate = `${rotation}deg`;
            NoteSelect.updateSelectBox();
        };
        this.$setFill = (fill = this.values.fill) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.style.backgroundColor = fill;
        };
        this.$setStroke = (stroke = this.values.stroke) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.style.borderColor = stroke;
        };
        this.$setWidth = (width = this.values.width) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.style.borderWidth = `${width}px`;
        };
        this.$setRadius = (radius = this.values.radius) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.style.borderRadius = `${radius}px`;
        };
        this.$setText = (text = this.values.content) => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.innerHTML = text;
        };
        this.gotQuill = false;
        this.$init_editor = () => {
            EditBar.addToolbar(this.$raw_id());
            console.log('INIT EDITOR');
            document.addEventListener('quillReturnData', (quill) => {
                if (this.gotQuill)
                    return;
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
                editor.setContents(JSON.parse(this.values.content));
                const thisRef = this;
                editor.on('text-change', (_delta, _oldDelta, source) => {
                    console.log(JSON.stringify(editor.getContents()));
                    thisRef.$text(JSON.stringify(editor.getContents()));
                    thisRef.$save();
                });
                this.editor = editor;
                this.$enableEditor(false);
            });
            document.dispatchEvent(new CustomEvent('quillRequestData'));
        };
        this.$focusEditor = () => {
            if (!this.editor)
                return;
            this.editor.focus();
        };
        this.$isFocusedEditor = () => {
            if (!this.editor)
                return false;
            return this.editor.hasFocus();
        };
        this.$enableEditor = (status = true) => {
            if (!this.editor)
                return;
            this.editor.enable(status);
        };
        this.dragData = {
            isDragging: false,
            notePos: { x: 0, y: 0 },
        };
        this.$init_draggable = () => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.addEventListener('mousedown', (e) => {
                if (!NoteSelect.enabled)
                    return;
                if (this.$isFocusedEditor())
                    return;
                e.stopImmediatePropagation();
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
                if (this.$isFocusedEditor()) {
                    this.dragData.isDragging = false;
                    return;
                }
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
        this.$size = (size = this.values.size) => {
            let changed = false;
            if (size.width !== this.values.size.width) {
                this.values.size.width = size.width;
                changed = true;
            }
            if (size.height !== this.values.size.height) {
                this.values.size.height = size.height;
                changed = true;
            }
            if (changed)
                this.$setSize();
            return this.values.size;
        };
        this.$init = () => {
            console.log(this.$getHTML());
            document.querySelector(this.mainContainer)?.insertAdjacentHTML('beforeend', this.$getHTML());
            this.$init_draggable();
            this.$init_selectable();
            if (this.noteIndex != 0)
                this.$init_editor();
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
        this.$data = () => {
            const compressedParameters = [];
            const assignParam = (index, val) => {
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
        this.$save = (recordHistory = true) => {
            const noteData = NoteEncryption.encode(this.$data());
            if (NoteSelect.active == this)
                NoteSelect.updateSelectBox();
            if (this.noteIndex === 0) {
                this.noteIndex = NoteStorage.saveNote(noteData);
                this.$updateID();
                this.$init_editor();
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
        this.$text = (text = this.values.content) => {
            if (text !== this.values.content) {
                this.values.content = text;
            }
            return this.values.content;
        };
        this.$position = (position = this.values.position, add_position = { x: 0, y: 0 }) => {
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
                this.$setPosition();
            }
            return this.values.position;
        };
        this.$rotation = (rotation = this.values.rotation) => {
            if (rotation !== this.values.rotation) {
                this.values.rotation = rotation;
                this.$setRotation();
            }
            return this.values.rotation;
        };
        this.$fill = (fill = this.values.fill) => {
            if (fill !== this.values.fill) {
                this.values.fill = fill;
                this.$setFill();
            }
            return this.values.fill;
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
        this.$radius = (radius = this.values.radius) => {
            if (radius !== this.values.radius) {
                this.values.radius = radius;
                this.$setRadius();
            }
            return this.values.radius;
        };
        this.$getHTML = () => {
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
        this.$updateID = () => {
            const noteElement = document.getElementById(this.$raw_id());
            this.noteID = `${this.noteType}-${this.noteIndex}`;
            if (noteElement)
                noteElement.setAttribute('id', this.noteID);
        };
        this.$init_selectable = () => {
            const note = document.getElementById(this.$raw_id());
            if (note === null)
                return;
            note.addEventListener('pointerdown', () => {
                if (NoteSelect.active !== this)
                    this.$enableEditor(false);
                console.log('Active: ', NoteSelect.active == this);
                NoteSelect.select(this);
            }, true);
            note.addEventListener('dblclick', () => {
                if (NoteSelect.active == this) {
                    this.$enableEditor(true);
                    this.$focusEditor();
                }
            });
        };
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
    $getBoundingBox() {
        return {
            x: this.values.position.x,
            y: this.values.position.y,
            width: this.values.size.width,
            height: this.values.size.height,
            rotation: this.values.rotation,
        };
    }
}
