'use strict';
/**
 * @author Brandon Kirbyson <bgkirbyson@gmail.com>
 * @author Tobin Palmer <toberock101@gmail.com>
 * @version 0.1.0
 *
 * @file Loads Main.js & is the base of the interNotes;
 * @copyright © Tobin Palmer & Brandon Kirbyson 2022. None of this material may be reproduced without both of our written conesent.
 */
(() => {
	const injectingScript = document.createElement('script');
	injectingScript.src = 'js/main.min.js';
	// injectingScript.src = 'https://gitcdn.xyz/cdn/Touch-Grass/CookieNotes-Injection/master/dist/typescript/Inject.js';
	injectingScript.classList.add('NoteWorthyOfficial');
	injectingScript.onload = () => {
	console.groupCollapsed(
			'%cNoteworthy Successfully Loaded!',
			`
			color: white;
			font-size: 25px;
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			font-weight: bolder;
			border-radius: 5px;
			padding: 2.5rem;
			background: linear-gradient(#e66465, #9198e5);
			display: flex; justify-content: center; align-items: center;
			`
		);
		console.log(`%c
			Thank you for using Noteworthy! You can now annotate the web!
		`,
		`
			color: white;
			font-size: 15px;
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			font-weight: bolder;
			border-radius: 5px;
			padding: 2.5rem;
			background: linear-gradient(#e66465, #9198e5);
			display: flex; justify-content: center; align-items: center;
		`);
		console.groupEnd();
	};
	document.body.appendChild(injectingScript);
})();
