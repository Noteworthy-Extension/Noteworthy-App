// async function importAssets(assets: Record<string, string[]>): Promise<void> {
// 	console.groupCollapsed('Importing assets');
// 	console.time('Loading Time');
// 	//Adds a div to contain all imported assets
// 	const assetDiv = document.createElement('div');
// 	assetDiv.setAttribute('id', 'NoteWorthyOfficial_Assets');
// 	document.body.appendChild(assetDiv);

// 	const assetsElement = document.querySelector('#NoteWorthyOfficial_Assets') as HTMLElement;

// 	//Imports all css files
// 	console.groupCollapsed('Importing CSS files');
// 	for await (const asset of assets.css) {
// 		console.groupCollapsed(`Imported ${asset}`);
// 		console.time('CSS Load Time');
// 		const injectingStyle = document.createElement('link');
// 		injectingStyle.href = asset;
// 		injectingStyle.rel = 'stylesheet';
// 		injectingStyle.type = 'text/css';
// 		assetsElement.appendChild(injectingStyle);
// 		console.timeEnd('CSS Load Time');
// 		console.groupEnd();
// 	}
// 	console.groupEnd();

// 	//Imports all js files
// 	console.groupCollapsed('Importing JS files');
// 	for await (const asset of assets.js) {
// 		console.groupCollapsed(`Imported ${asset}`);
// 		console.time('Script Load Time');
// 		const injectingScript = document.createElement('script');
// 		injectingScript.src = asset;
// 		injectingScript.setAttribute('defer', 'defer');
// 		assetsElement.appendChild(injectingScript);
// 		console.timeEnd('Script Load Time');
// 		console.groupEnd();
// 	}
// 	console.groupEnd();

// 	//Imports all js module files
// 	console.groupCollapsed('Importing JS Module files');
// 	for await (const asset of assets.js_modules) {
// 		console.groupCollapsed(`Imported ${asset}`);
// 		console.time('Script Load Time');
// 		const injectingScript = document.createElement('script');
// 		injectingScript.src = asset;
// 		injectingScript.type = 'module';
// 		injectingScript.setAttribute('defer', 'defer');
// 		assetsElement.appendChild(injectingScript);
// 		// await injectingScript.onload; //Awaits script load to continue
// 		console.timeEnd('Script Load Time');
// 		console.groupEnd();
// 	}
// 	console.groupEnd();

// 	console.timeEnd('Loading Time');
// 	console.groupEnd();
// 	console.groupEnd();
// }

// importAssets({
// 	js: [],
// 	js_modules: [
// 		'js/main.min.js'
// 	],
// 	// js_modules: ['https://touch-grass.github.io/CookieNotes-Injection/dist/js/main.js'],
// 	// Test commend out
// 	css: [
// 		// 'https://touch-grass.github.io/CookieNotes-Injection/dist/css/Style.css',
// 		'css/Style.css',
// 		// 'https://touch-grass.github.io/CookieNotes-Injection/dist/css/theme/theme-default.css',
// 		// 'css/theme/theme-default.css',
// 		// 'https://cdn.quilljs.com/1.3.6/quill.core.css',
// 	],
// });
