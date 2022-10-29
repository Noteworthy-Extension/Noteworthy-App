import { loadSavedNotes } from '../Note/Backend/Initialize.js';
import { NoteHistory } from '../Note/Backend/NoteHistory.js';
import { OptionsBar } from './Rendered/OptionsBar/OptionsBar.js';
import { EditBar } from './Rendered/EditBar/EditBar.js';
import { Theme } from './Rendered/Themes/Themes.js';
import { AddStyle } from './../Style.js';

(() => {
	AddStyle();
	const gCS = (elem: HTMLElement) => getComputedStyle(elem);

	const body = document.body;
	const html = document.documentElement;
	const innerHeight = Math.max(parseInt(gCS(body).height), parseInt(gCS(html).height));
	const innerWidth = Math.max(parseInt(gCS(body).width), parseInt(gCS(html).width));

	document.body.insertAdjacentHTML(
		'afterend',
		`
		<div id="NoteWorthyOfficial" style="position: absolute; width: ${innerWidth}px; height: ${innerHeight}px; top: 0; left: 0; pointer-events: none;">
			<div id="NoteWorthyOfficial-MainContainer" class="MainContainer-Deactive" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
				<svg style="position: absolute; top: 0; left: 0; width: 100%; height: ${innerHeight}; width: 100%; height: 100%; pointer-events: none;"></svg>
			</div>
		</div>
    `
	);

	NoteHistory.init();

	OptionsBar.init();
	EditBar.init();
	loadSavedNotes();

	Theme.set(Theme.cssThemes.default);

	setInterval(() => {
		const newInnerHeight = Math.max(parseInt(gCS(body).height), parseInt(gCS(html).height));
		const newInnerWidth = Math.max(parseInt(gCS(body).width), parseInt(gCS(html).width));
		if (newInnerWidth !== innerWidth || newInnerHeight !== innerHeight) {
			(<HTMLElement>document.getElementById('NoteWorthyOfficial')).style.width = `${newInnerWidth}px`;
			(<HTMLElement>(
				document.getElementById('NoteWorthyOfficial')
			)).style.height = `${newInnerHeight}px`;
		}
	}, 500);
})();
