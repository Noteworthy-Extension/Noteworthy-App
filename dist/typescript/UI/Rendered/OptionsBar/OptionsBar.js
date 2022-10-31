import { NoteStorage } from './../../../Note/Backend/NoteStorage.js';
import { createNote } from './../../../Create/CreateNote.js';
import { inject } from './../../../util/common.js';
import { iconURLs } from './../DropdownSVGs.js';
import { NoteSelect } from '../../../Note/Backend/NoteSelect.js';
import { EditBar } from '../EditBar/EditBar.js';
const optionsBarHTML = `
<div class="Noteworthy_options_bar" style="position: fixed; display: none;">
	<div class="Noteworthy_options_bar-blur"></div>
	<button class="Noteworthy_options_bar-btn">
		<img width="20px" height="20px" style="width: 20px !important; height: 20px !important;" ondragstart="return false;" src="${iconURLs.logo}" alt="options" />
	</button>

	<div class="Noteworthy_options_bar-item active_option Noteworthy_tooltip" id="option-select">
		<span class="tool_tip_text flow_right">Select</span>
		<img src="${iconURLs.select}" alt="select" class="Noteworthy_options_bar-item-btn-default" />
	</div>

	<div class="Noteworthy_options_bar-item parent-dropdown Noteworthy_tooltip" id="option-draw suboption-pencil">
		<span class="tool_tip_text flow_right">Draw</span>
		<img src="${iconURLs.draw.pencil}" alt="draw" class="Noteworthy_options_bar-item-btn-default" />
	</div>

	<div class="Noteworthy_options_bar-dropdown draw_dropdown">
		<div class="Noteworthy_options_bar-subitem active_option" id="suboption-pencil">
			<img src="${iconURLs.draw.pencil}" alt="" />
		</div>

		<div class="Noteworthy_options_bar-subitem" id="suboption-brush">
			<img src="${iconURLs.draw.brush}" alt="" />
		</div>

		<div class="Noteworthy_options_bar-subitem" id="suboption-highlight">
			<img src="${iconURLs.draw.highlight}" alt="" />
		</div>
	</div>

	<div class="Noteworthy_options_bar-item parent-dropdown Noteworthy_tooltip" id="option-line">
		<span class="tool_tip_text flow_right">Line</span>
		<img src="${iconURLs.line.line}" alt="" class="Noteworthy_options_bar-item-btn-default" />
	</div>

	<div class="Noteworthy_options_bar-dropdown line_dropdown">
		<div class="Noteworthy_options_bar-subitem active_option" id="suboption-line">
			<img src="${iconURLs.line.line}" alt="" />
		</div>

		<div class="Noteworthy_options_bar-subitem" id="suboption-polyline">
			<img src="${iconURLs.line.polyline}" alt="" />
		</div>
	</div>

	<div class="Noteworthy_options_bar-item parent-dropdown Noteworthy_tooltip" id="option-arrow">
		<span class="tool_tip_text flow_right">Arrow</span>
		<img src="${iconURLs.arrow.arrow}" alt="" class="Noteworthy_options_bar-item-btn-default" />
	</div>

	<div class="Noteworthy_options_bar-dropdown arrow_dropdown">
		<div class="Noteworthy_options_bar-subitem active_option" id="suboption-arrow">
			<img src="${iconURLs.arrow.arrow}" alt="" />
		</div>

		<div class="Noteworthy_options_bar-subitem" id="suboption-polyarrow">
			<img src="${iconURLs.arrow.polyarrow}" alt="" />
		</div>
	</div>

	<div class="Noteworthy_options_bar-item Noteworthy_tooltip" id="option-note">
		<span class="tool_tip_text flow_right">Note</span>
		<img src="${iconURLs.note}" alt="" class="Noteworthy_options_bar-item-btn-default" />
	</div>

	<div class="Noteworthy_options_bar-item Noteworthy_tooltip" id="option-text">
		<span class="tool_tip_text flow_right">Text</span>
		<img src="${iconURLs.text}" alt="" class="Noteworthy_options_bar-item-btn-default" />
	</div>

	<div class="Noteworthy_options_bar-item parent-dropdown Noteworthy_tooltip" id="option-shape suboption-rect">
		<span class="tool_tip_text flow_right">Shape</span>
		<img src="${iconURLs.shape.rect}" alt="rect" class="Noteworthy_options_bar-item-btn-default" />
	</div>

	<div class="Noteworthy_options_bar-dropdown rect_dropdown">
		<div class="Noteworthy_options_bar-subitem active_option" id="suboption-rect">
			<img src="${iconURLs.shape.rect}" alt="" />
		</div>

		<div class="Noteworthy_options_bar-subitem" id="suboption-square">
			<img src="${iconURLs.shape.square}" alt="" />
		</div>

		<div class="Noteworthy_options_bar-subitem" id="suboption-circle">
			<img src="${iconURLs.shape.circle}" alt="" />
		</div>

		<div class="Noteworthy_options_bar-subitem" id="suboption-ellipse">
			<img src="${iconURLs.shape.ellipse}" alt="" />
		</div>
	</div>

	<div class="Noteworthy_options_bar-item parent-dropdown Noteworthy_tooltip" id="option-visibility">
		<span class="tool_tip_text flow_right">Visibility</span>
		<img src="${iconURLs.visibility}" alt="" class="Noteworthy_options_bar-item-btn-default" />
	</div>

	<div class="Noteworthy_options_bar-dropdown visibility_dropdown">
		<input type="range" min="0" max="100" step="1" value="100" id="Noteworthy-visibility_slider" />
	</div>


</div>

<svg width="0" height="0" style="pointer-events: none;">
	<defs>
		<marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto-start-reverse">
			<polygon points="0 0, 6 3, 0 6" style="fill: none; stroke: black; stroke-width: 1px;" />
		</marker>
		<marker id="arrow2" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto-start-reverse">
			<polygon points="0 0, 6 3, 0 6" style="fill: #000000; stroke: black; stroke-width: 1px;" />
		</marker>
		<marker id="dot" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto-start-reverse">
			<circle cx="3" cy="3" r="3" style="fill: none; stroke: black; stroke-width: 1px;" />
		</marker>
		<marker id="dot2" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto-start-reverse">
			<circle cx="3" cy="3" r="3" style="fill: #000000; stroke: black; stroke-width: 1px;" />
		</marker>
	</defs>
</svg>
`;
export const OptionsBar = {
    activeNum: 0,
    pos: {
        x: 0,
        y: 0,
    },
    offset: {
        width: 65,
        height: 65,
    },
    loadPos: () => {
        OptionsBar.pos = JSON.parse(`${localStorage.getItem(`${NoteStorage.prefix}${location.pathname}:optionsBarPos`)}` ||
            '{x:0,y:0}');
        OptionsBar.position.fixed = JSON.parse(`${localStorage.getItem(`${NoteStorage.prefix}${location.pathname}:optionsBarFixed`)}` ||
            '{"x":"left","y":"top"}');
        if (!OptionsBar.pos)
            OptionsBar.pos = { x: 0, y: 0 };
        if (!OptionsBar.position.fixed)
            OptionsBar.position.fixed = { x: 'left', y: 'top' };
        const optionsBar = document.querySelector('.Noteworthy_options_bar');
        optionsBar.classList.remove(...Array.from(optionsBar.classList).filter(c => c.startsWith('Noteworthy_options_bar-align')));
        if (window.innerWidth < OptionsBar.pos.x) {
            OptionsBar.pos.x = window.innerWidth - OptionsBar.offset.width;
        }
        if (window.innerHeight < OptionsBar.pos.y) {
            OptionsBar.pos.y = window.innerHeight - OptionsBar.offset.height;
        }
        if (OptionsBar.position.fixed.x === 'left') {
            optionsBar.style.left = `${OptionsBar.pos.x}px`;
            optionsBar.classList.add(`Noteworthy_options_bar-alignX-left`);
        }
        else {
            optionsBar.style.right = `${OptionsBar.pos.x}px`;
            optionsBar.classList.add(`Noteworthy_options_bar-alignX-right`);
        }
        if (OptionsBar.position.fixed.y === 'top') {
            optionsBar.style.top = `${OptionsBar.pos.y}px`;
            optionsBar.classList.add(`Noteworthy_options_bar-alignY-top`);
        }
        else {
            optionsBar.style.bottom = `${OptionsBar.pos.y}px`;
            optionsBar.classList.add(`Noteworthy_options_bar-alignY-bottom`);
        }
    },
    savePos: () => {
        localStorage.setItem(`${NoteStorage.prefix}${location.pathname}:optionsBarPos`, JSON.stringify(OptionsBar.pos));
        localStorage.setItem(`${NoteStorage.prefix}${location.pathname}:optionsBarFixed`, JSON.stringify(OptionsBar.position.fixed));
    },
    loadVisibility: () => {
        const opacity = parseInt(localStorage.getItem(`${NoteStorage.prefix}${location.pathname}:optionsBarOpacity`) || '100');
        (document.querySelector('#NoteWorthyOfficial-MainContainer')).style.opacity = `${opacity}%`;
        document.querySelector('#Noteworthy-visibility_slider').value = `${opacity}`;
    },
    saveVisibility: (opacity = document.querySelector('#Noteworthy-visibility_slider').value) => {
        localStorage.setItem(`${NoteStorage.prefix}${location.pathname}:optionsBarOpacity`, `${parseInt(opacity)}`);
    },
    initToggle: () => {
        const optionsBar = document.querySelector('.Noteworthy_options_bar');
        const mainContainer = document.querySelector('#NoteWorthyOfficial-MainContainer');
        OptionsBar.setActive('option-select');
        document.addEventListener('Noteworthy-Toggle', () => {
            if (optionsBar.style.display === 'none') {
                optionsBar.style.display = 'flex';
                NoteSelect.enabled = true;
                optionsBar.classList.add('Noteworthy_options_bar-open');
                mainContainer.classList.remove('MainContainer-Deactive');
            }
            else {
                optionsBar.style.display = 'none';
                NoteSelect.enabled = false;
                optionsBar.classList.remove('Noteworthy_options_bar-open');
                mainContainer.classList.add('MainContainer-Deactive');
            }
        });
    },
    init: () => {
        inject('#NoteWorthyOfficial', optionsBarHTML);
        OptionsBar.loadPos();
        OptionsBar.initToggle();
        OptionsBar.initDraggable();
        createNote.init();
        NoteSelect.init();
        document.querySelector('.Noteworthy_options_bar-btn').addEventListener('click', () => {
            const optionsBarBtn = document.querySelector('.Noteworthy_options_bar-btn');
            optionsBarBtn.classList.toggle('Noteworthy_options_bar-btn-active');
            OptionsBar.toggle();
        });
        const optionButtons = document.querySelectorAll('.Noteworthy_options_bar-item');
        optionButtons.forEach((option) => {
            option.addEventListener('click', () => {
                const id = option.id.split(' ')[0] || '';
                OptionsBar.setActive(id);
                OptionsBar.setOption(option.id || 'option-select');
            });
        });
        const subOptionButtons = document.querySelectorAll('.Noteworthy_options_bar-subitem');
        subOptionButtons.forEach((option) => {
            option?.addEventListener('click', () => {
                const id = option.parentElement?.previousElementSibling?.id.split(' ')[0] || '';
                const dropdown_id = option.id.split(' ')[0] || '';
                OptionsBar.setActive(id);
                OptionsBar.setSubActive(dropdown_id);
                OptionsBar.setOption(option.parentElement?.previousElementSibling?.id || 'option-select');
            });
        });
        OptionsBar.loadVisibility();
        const slider = document.querySelector('#Noteworthy-visibility_slider');
        slider.addEventListener('change', () => {
            (document.querySelector('#NoteWorthyOfficial-MainContainer')).style.opacity = `${slider.value}%`;
            OptionsBar.saveVisibility(slider.value);
        });
    },
    position: {
        moving: false,
        fixed: {
            x: 'left',
            y: 'top',
        },
        last: {
            x: 0,
            y: 0,
        },
    },
    initDraggable: () => {
        const optionsBar = document.querySelector('.Noteworthy_options_bar');
        const optionsBarBtn = document.querySelector('.Noteworthy_options_bar-btn');
        const align = (side_x, side_y) => {
            optionsBar.classList.remove(...Array.from(optionsBar.classList).filter(c => c.startsWith('Noteworthy_options_bar-align')));
            optionsBar.classList.add(`Noteworthy_options_bar-alignX-${side_x}`);
            optionsBar.classList.add(`Noteworthy_options_bar-alignY-${side_y}`);
        };
        const updatePosition = (old_pos, new_pos) => {
            const barPos = {
                x: parseInt(OptionsBar.position.fixed.x === 'left' ? optionsBar.style.left : optionsBar.style.right),
                y: parseInt(OptionsBar.position.fixed.y === 'top' ? optionsBar.style.top : optionsBar.style.bottom),
            };
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const addPos = {
                x: new_pos.x - old_pos.x,
                y: new_pos.y - old_pos.y,
            };
            let xPos = OptionsBar.position.fixed.x === 'left' ? barPos.x + addPos.x : barPos.x - addPos.x;
            let yPos = OptionsBar.position.fixed.y === 'top' ? barPos.y + addPos.y : barPos.y - addPos.y;
            if (isNaN(xPos) || !xPos)
                xPos = 0;
            if (isNaN(yPos) || !yPos)
                yPos = 0;
            const fixedBefore = {
                x: `${OptionsBar.position.fixed.x}`,
                y: `${OptionsBar.position.fixed.y}`,
            };
            OptionsBar.position.fixed.x = (OptionsBar.position.fixed.x === 'left' ? xPos < screenWidth / 2 : xPos > screenWidth / 2)
                ? 'left'
                : 'right';
            OptionsBar.position.fixed.y = (OptionsBar.position.fixed.y === 'top' ? yPos < screenHeight / 2 : yPos > screenHeight / 2)
                ? 'top'
                : 'bottom';
            align(OptionsBar.position.fixed.x, OptionsBar.position.fixed.y);
            if (OptionsBar.position.fixed.x !== fixedBefore.x)
                xPos = screenWidth - xPos - OptionsBar.offset.width;
            if (OptionsBar.position.fixed.y !== fixedBefore.y) {
                yPos = screenHeight - yPos - OptionsBar.offset.height;
            }
            OptionsBar.pos = {
                x: xPos,
                y: yPos,
            };
            OptionsBar.savePos();
            if (xPos >= 0 && xPos <= screenWidth) {
                if (OptionsBar.position.fixed.x === 'left') {
                    optionsBar.style.left = `${xPos}px`;
                    optionsBar.style.right = '';
                }
                else {
                    optionsBar.style.right = `${xPos}px`;
                    optionsBar.style.left = '';
                }
            }
            if (yPos >= 0 && yPos <= screenHeight) {
                if (OptionsBar.position.fixed.y === 'top') {
                    optionsBar.style.top = `${yPos}px`;
                    optionsBar.style.bottom = '';
                }
                else {
                    optionsBar.style.bottom = `${yPos}px`;
                    optionsBar.style.top = '';
                }
            }
        };
        optionsBarBtn.addEventListener('mousedown', (e) => {
            OptionsBar.position.moving = true;
            OptionsBar.position.last = {
                x: e.clientX,
                y: e.clientY,
            };
        });
        document.addEventListener('mousemove', (e) => {
            if (!OptionsBar.position.moving)
                return;
            updatePosition(JSON.parse(JSON.stringify(OptionsBar.position.last)), {
                x: e.clientX,
                y: e.clientY,
            });
            OptionsBar.position.last = {
                x: e.clientX,
                y: e.clientY,
            };
        });
        document.addEventListener('mouseup', (e) => {
            if (!OptionsBar.position.moving)
                return;
            OptionsBar.position.moving = false;
            updatePosition(JSON.parse(JSON.stringify(OptionsBar.position.last)), {
                x: e.clientX,
                y: e.clientY,
            });
        });
    },
    toggle: () => {
        const optionsBar = document.querySelector('.Noteworthy_options_bar');
        optionsBar.classList.toggle('Noteworthy_options_bar-open');
        const dropdowns = document.querySelectorAll('.Noteworthy_options_bar-dropdown');
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove('dropdown_open');
        });
        OptionsBar.setActive("option-select");
        createNote.disableAll();
    },
    toggleDropdownItem: () => {
        const parentDropdown = document.querySelectorAll('.parent-dropdown');
        parentDropdown.forEach((item) => {
            item.addEventListener('click', () => {
                item.classList.toggle('Noteworthy_options_bar-dropdown-item-open');
            });
        });
    },
    setOption: (option_id) => {
        createNote.disableAll();
        EditBar.hide();
        EditBar.clear();
        NoteSelect.unselect();
        const optionPrefix = ['option-', 'suboption-'];
        const item_id = option_id
            .replaceAll(optionPrefix[1], '')
            .replaceAll(optionPrefix[0], '')
            .split(' ');
        switch (item_id[0]) {
            case 'select':
                createNote.disableAll();
                break;
            case 'draw':
                createNote.enableDraw(item_id[1] || 'pencil');
                break;
            case 'note':
                createNote.enableShape('textbox');
                break;
            case 'text':
                createNote.enableShape('text');
                break;
            case 'shape':
                createNote.enableShape(item_id[1] || 'rect');
                break;
            case 'line':
                if (!item_id[1]) {
                    createNote.enableLine('line');
                }
                else {
                    switch (item_id[1]) {
                        case 'polyline':
                            createNote.enablePolyline(item_id[1]);
                            break;
                    }
                }
                break;
            case 'arrow':
                if (!item_id[1]) {
                    createNote.enableLine('arrow');
                }
                else {
                    switch (item_id[1]) {
                        case 'polyarrow':
                            createNote.enablePolyline(item_id[1]);
                            break;
                    }
                }
                break;
            default:
                createNote.disableAll();
        }
    },
    setActive: (option_id) => {
        const options = document.querySelectorAll('.Noteworthy_options_bar-item');
        const dropdowns = document.querySelectorAll('.Noteworthy_options_bar-dropdown');
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove('dropdown_open');
        });
        options.forEach(option => {
            option.classList.remove('active_option');
            option.classList.add('Noteworthy_tooltip');
            option.querySelector('.tool_tip_text').style.display = 'inline';
            if (option.id.split(' ')[0] === option_id) {
                option.classList.add('active_option');
                option.classList.remove('Noteworthy_tooltip');
                option.querySelector('.tool_tip_text').style.display = 'none';
                if (option.classList.contains('parent-dropdown')) {
                    option.nextElementSibling?.classList.add('dropdown_open');
                }
            }
        });
    },
    setSubActive: (suboption_id) => {
        const suboptionElement = document.querySelector(`#${suboption_id}.Noteworthy_options_bar-subitem`);
        suboptionElement.parentElement?.previousElementSibling?.setAttribute('id', suboptionElement.parentElement?.previousElementSibling?.id.split(' ')[0] + ' ' + suboption_id);
        const options = suboptionElement.parentElement?.querySelectorAll('.Noteworthy_options_bar-subitem');
        options.forEach(option => option.classList.remove('active_option'));
        suboptionElement.classList.add('active_option');
        suboptionElement.parentElement?.previousElementSibling
            ?.querySelector('img')
            ?.setAttribute('src', suboptionElement.querySelector('img')?.getAttribute('src') || '');
    },
};
