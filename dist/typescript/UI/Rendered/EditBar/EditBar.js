import { inject } from './../../../util/common.js';
import { colorPicker } from './Inputs/colorPicker.js';
import { dropdownSelect } from './Inputs/dropdownSelect.js';
const editBarHTML = `
    <div class="Noteworthy-edit_bar" style="display: none">
		<div class="Noteworthy-edit_bar-toolbars"></div>
		<div class="Noteworthy-edit_bar-inputs"></div>
	</div>
		`;
const toolbarHTML = `
	<span class="quillEditor-formats">
		<select class="quillEditor-header quill-headings-tab">
			<option value="1">Heading</option>
			<option value="2">Subheading</option>
			<option selected>Normal</option>
		</select>
		<select class="quillEditor-font quill-fonts-tab">
			<option selected>Sailec Light</option>
			<option value="sofia">Sofia Pro</option>
			<option value="slabo">Slabo 27px</option>
			<option value="roboto">Roboto Slab</option>
			<option value="inconsolata">Inconsolata</option>
			<option value="ubuntu">Ubuntu Mono</option>
		</select>
	</span>
	<span class="quillEditor-formats">
		<button class="quillEditor-bold">B</button>
		<button class="quillEditor-italic">I</button>
		<button class="quillEditor-underline">U</button>
	</span>
	<span class="quillEditor-formats">
		<span class="quillEditor-color quillEditor-picker quillEditor-color-picker"><span class="quillEditor-picker-label" tabindex="0" role="button" aria-expanded="false" aria-controls="quillEditor-picker-options-2"><svg viewBox="0 0 18 18"> <line class="quillEditor-color-label quillEditor-stroke quillEditor-transparent" x1="3" x2="15" y1="15" y2="15"></line> <polyline class="quillEditor-stroke" points="5.5 11 9 3 12.5 11"></polyline> <line class="quillEditor-stroke" x1="11.63" x2="6.38" y1="9" y2="9"></line> </svg></span><span class="quillEditor-picker-options" aria-hidden="true" tabindex="-1" id="quillEditor-picker-options-2"><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-selected quillEditor-primary"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#e60000" style="background-color: rgb(230, 0, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#ff9900" style="background-color: rgb(255, 153, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#ffff00" style="background-color: rgb(255, 255, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#008a00" style="background-color: rgb(0, 138, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#0066cc" style="background-color: rgb(0, 102, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#9933ff" style="background-color: rgb(153, 51, 255);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ffffff" style="background-color: rgb(255, 255, 255);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#facccc" style="background-color: rgb(250, 204, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ffebcc" style="background-color: rgb(255, 235, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ffffcc" style="background-color: rgb(255, 255, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#cce8cc" style="background-color: rgb(204, 232, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#cce0f5" style="background-color: rgb(204, 224, 245);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ebd6ff" style="background-color: rgb(235, 214, 255);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#bbbbbb" style="background-color: rgb(187, 187, 187);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#f06666" style="background-color: rgb(240, 102, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ffc266" style="background-color: rgb(255, 194, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ffff66" style="background-color: rgb(255, 255, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#66b966" style="background-color: rgb(102, 185, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#66a3e0" style="background-color: rgb(102, 163, 224);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#c285ff" style="background-color: rgb(194, 133, 255);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#888888" style="background-color: rgb(136, 136, 136);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#a10000" style="background-color: rgb(161, 0, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#b26b00" style="background-color: rgb(178, 107, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#b2b200" style="background-color: rgb(178, 178, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#006100" style="background-color: rgb(0, 97, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#0047b2" style="background-color: rgb(0, 71, 178);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#6b24b2" style="background-color: rgb(107, 36, 178);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#444444" style="background-color: rgb(68, 68, 68);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#5c0000" style="background-color: rgb(92, 0, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#663d00" style="background-color: rgb(102, 61, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#666600" style="background-color: rgb(102, 102, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#003700" style="background-color: rgb(0, 55, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#002966" style="background-color: rgb(0, 41, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#3d1466" style="background-color: rgb(61, 20, 102);"></span></span></span><select class="quillEditor-color" style="display: none;"><option selected="selected"></option><option value="#e60000"></option><option value="#ff9900"></option><option value="#ffff00"></option><option value="#008a00"></option><option value="#0066cc"></option><option value="#9933ff"></option><option value="#ffffff"></option><option value="#facccc"></option><option value="#ffebcc"></option><option value="#ffffcc"></option><option value="#cce8cc"></option><option value="#cce0f5"></option><option value="#ebd6ff"></option><option value="#bbbbbb"></option><option value="#f06666"></option><option value="#ffc266"></option><option value="#ffff66"></option><option value="#66b966"></option><option value="#66a3e0"></option><option value="#c285ff"></option><option value="#888888"></option><option value="#a10000"></option><option value="#b26b00"></option><option value="#b2b200"></option><option value="#006100"></option><option value="#0047b2"></option><option value="#6b24b2"></option><option value="#444444"></option><option value="#5c0000"></option><option value="#663d00"></option><option value="#666600"></option><option value="#003700"></option><option value="#002966"></option><option value="#3d1466"></option></select>
		<span class="quillEditor-background quillEditor-picker quillEditor-color-picker"><span class="quillEditor-picker-label" tabindex="0" role="button" aria-expanded="false" aria-controls="quillEditor-picker-options-3"><svg viewBox="0 0 18 18"> <g class="quillEditor-fill quillEditor-color-label"> <polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"></polygon> <rect height="1" width="1" x="4" y="4"></rect> <polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"></polygon> <rect height="1" width="1" x="2" y="6"></rect> <rect height="1" width="1" x="3" y="5"></rect> <rect height="1" width="1" x="4" y="7"></rect> <polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"></polygon> <rect height="1" width="1" x="2" y="12"></rect> <rect height="1" width="1" x="2" y="9"></rect> <rect height="1" width="1" x="2" y="15"></rect> <polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"></polygon> <rect height="1" width="1" x="3" y="8"></rect> <path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"></path> <path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"></path> <path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"></path> <rect height="1" width="1" x="12" y="2"></rect> <rect height="1" width="1" x="11" y="3"></rect> <path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"></path> <rect height="1" width="1" x="2" y="3"></rect> <rect height="1" width="1" x="6" y="2"></rect> <rect height="1" width="1" x="3" y="2"></rect> <rect height="1" width="1" x="5" y="3"></rect> <rect height="1" width="1" x="9" y="2"></rect> <rect height="1" width="1" x="15" y="14"></rect> <polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"></polygon> <rect height="1" width="1" x="13" y="7"></rect> <rect height="1" width="1" x="15" y="5"></rect> <rect height="1" width="1" x="14" y="6"></rect> <rect height="1" width="1" x="15" y="8"></rect> <rect height="1" width="1" x="14" y="9"></rect> <path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"></path> <rect height="1" width="1" x="14" y="3"></rect> <polygon points="12 6.868 12 6 11.62 6 12 6.868"></polygon> <rect height="1" width="1" x="15" y="2"></rect> <rect height="1" width="1" x="12" y="5"></rect> <rect height="1" width="1" x="13" y="4"></rect> <polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"></polygon> <rect height="1" width="1" x="9" y="14"></rect> <rect height="1" width="1" x="8" y="15"></rect> <path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"></path> <rect height="1" width="1" x="5" y="15"></rect> <path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"></path> <rect height="1" width="1" x="11" y="15"></rect> <path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"></path> <rect height="1" width="1" x="14" y="15"></rect> <rect height="1" width="1" x="15" y="11"></rect> </g> <polyline class="quillEditor-stroke" points="5.5 13 9 5 12.5 13"></polyline> <line class="quillEditor-stroke" x1="11.63" x2="6.38" y1="11" y2="11"></line> </svg></span><span class="quillEditor-picker-options" aria-hidden="true" tabindex="-1" id="quillEditor-picker-options-3"><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#000000" style="background-color: rgb(0, 0, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#e60000" style="background-color: rgb(230, 0, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#ff9900" style="background-color: rgb(255, 153, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#ffff00" style="background-color: rgb(255, 255, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#008a00" style="background-color: rgb(0, 138, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#0066cc" style="background-color: rgb(0, 102, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-primary" data-value="#9933ff" style="background-color: rgb(153, 51, 255);"></span><span tabindex="0" role="button" class="quillEditor-picker-item quillEditor-selected"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#facccc" style="background-color: rgb(250, 204, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ffebcc" style="background-color: rgb(255, 235, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ffffcc" style="background-color: rgb(255, 255, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#cce8cc" style="background-color: rgb(204, 232, 204);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#cce0f5" style="background-color: rgb(204, 224, 245);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ebd6ff" style="background-color: rgb(235, 214, 255);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#bbbbbb" style="background-color: rgb(187, 187, 187);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#f06666" style="background-color: rgb(240, 102, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ffc266" style="background-color: rgb(255, 194, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#ffff66" style="background-color: rgb(255, 255, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#66b966" style="background-color: rgb(102, 185, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#66a3e0" style="background-color: rgb(102, 163, 224);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#c285ff" style="background-color: rgb(194, 133, 255);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#888888" style="background-color: rgb(136, 136, 136);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#a10000" style="background-color: rgb(161, 0, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#b26b00" style="background-color: rgb(178, 107, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#b2b200" style="background-color: rgb(178, 178, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#006100" style="background-color: rgb(0, 97, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#0047b2" style="background-color: rgb(0, 71, 178);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#6b24b2" style="background-color: rgb(107, 36, 178);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#444444" style="background-color: rgb(68, 68, 68);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#5c0000" style="background-color: rgb(92, 0, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#663d00" style="background-color: rgb(102, 61, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#666600" style="background-color: rgb(102, 102, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#003700" style="background-color: rgb(0, 55, 0);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#002966" style="background-color: rgb(0, 41, 102);"></span><span tabindex="0" role="button" class="quillEditor-picker-item" data-value="#3d1466" style="background-color: rgb(61, 20, 102);"></span></span></span><select class="quillEditor-background" style="display: none;"><option value="#000000"></option><option value="#e60000"></option><option value="#ff9900"></option><option value="#ffff00"></option><option value="#008a00"></option><option value="#0066cc"></option><option value="#9933ff"></option><option selected="selected"></option><option value="#facccc"></option><option value="#ffebcc"></option><option value="#ffffcc"></option><option value="#cce8cc"></option><option value="#cce0f5"></option><option value="#ebd6ff"></option><option value="#bbbbbb"></option><option value="#f06666"></option><option value="#ffc266"></option><option value="#ffff66"></option><option value="#66b966"></option><option value="#66a3e0"></option><option value="#c285ff"></option><option value="#888888"></option><option value="#a10000"></option><option value="#b26b00"></option><option value="#b2b200"></option><option value="#006100"></option><option value="#0047b2"></option><option value="#6b24b2"></option><option value="#444444"></option><option value="#5c0000"></option><option value="#663d00"></option><option value="#666600"></option><option value="#003700"></option><option value="#002966"></option><option value="#3d1466"></option></select>
  	</span>
	<span class="quillEditor-formats">
		<button class="quillEditor-list" value="ordered"></button>
		<button class="quillEditor-list" value="bullet"></button>
		<select class="quillEditor-align">
			<option label="left" selected></option>
			<option label="center" value="center"></option>
			<option label="right" value="right"></option>
			<option label="justify" value="justify"></option>
		</select>
		<button class="quillEditor-indent" value="-1">
		<button class="quillEditor-indent" value="+1">
	</span>
	<span class="quillEditor-formats">
		<button class="quillEditor-blockquote"></button>
		<button class="quillEditor-code-block"></button>
		<button class="quillEditor-link"></button>
		<button class="quillEditor-clean"></button>
	</span>
`;
const editBarInput = (type, label, value) => {
    switch (type) {
        case 'select':
            return `${dropdownSelect.html(label, value)}`;
        case 'color':
            return `${colorPicker.html(label, value.toString())}`;
        case 'number':
            return `<input type="number" id="${label}"" />`;
        case 'toggle':
            return `<input type="checkbox" id="${label}" />`;
        default:
            return '';
    }
};
export const EditBar = {
    init: () => {
        inject('#NoteWorthyOfficial', editBarHTML);
    },
    toolbars: new Map(),
    addToolbar: (id) => {
        inject('.Noteworthy-edit_bar-toolbars', `<div class="Noteworthy-edit_bar-toolbar"id="${id}-toolbar">${toolbarHTML}</div>`);
        EditBar.toolbars.set(id, id);
    },
    hideToolbars: () => {
        document.querySelectorAll('.Noteworthy-edit_bar-toolbar').forEach((toolbar) => {
            toolbar.style.display = 'none';
        });
    },
    showToolbar: (id) => {
        EditBar.hideToolbars();
        document.querySelector('.Noteworthy-edit_bar-toolbars').style.display = 'flex';
        document.querySelector(`#${id}-toolbar`).style.display = 'flex';
    },
    loadInputs(inputs) {
        EditBar.clear();
        EditBar.show();
        console.log('Edit bar loading inputs: ', inputs);
        for (const input of inputs) {
            const inputHTML = EditBar.getHTML(editBarInput(input.type, input.label, input.value));
            inject('.Noteworthy-edit_bar-inputs', inputHTML);
            switch (input.type) {
                case 'color':
                    colorPicker.init(input.label, input.value.toString(), input.fn);
                    break;
                case 'select':
                    dropdownSelect.init(input.label, input.value, input.fn);
                    break;
            }
        }
    },
    getHTML: (html) => {
        return `<div class="Noteworthy-edit_bar-item">${html}</div>`;
    },
    clear: () => {
        document.querySelector('.Noteworthy-edit_bar-inputs').innerHTML = '';
        EditBar.hideToolbars();
    },
    show: () => {
        document.querySelector('.Noteworthy-edit_bar').style.display = 'flex';
    },
    hide: () => {
        document.querySelector('.Noteworthy-edit_bar').style.display = 'none';
        document.querySelector('.Noteworthy-edit_bar-toolbars').style.display = 'none';
    },
};
