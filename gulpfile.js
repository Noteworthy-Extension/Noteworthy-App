/**
 * Concatenates all the JS files into one file
 * Goes from Typescript -> JS -> Minified & Bundled JS
 */

const { src, dest, watch } = require('gulp');
const replace = require('gulp-replace');
const minifyJs = require('gulp-uglify');
const concat = require('gulp-concat');
const gulpIgnore = require('gulp-ignore');
const fs = require('fs');

// Order of the files that they get concatenated in
const JsFiles = [
	'dist/typescript/Style.js',
	'dist/typescript/UI/Rendered/Themes/Themes.js',
	'dist/typescript/UI/Rendered/EditBar/Inputs/colorPicker.js',
	'dist/typescript/UI/Rendered/EditBar/Inputs/dropdownSelect.js',
	'dist/typescript/UI/Rendered/DropdownSVGs.js',
	'dist/typescript/Note/Backend/NoteHistory.js',
	'dist/typescript/Note/Backend/NoteStorage.js',
	'dist/typescript/Quill/quill.js',
	'dist/typescript/Note/Note.js',
	'dist/typescript/Note/Derived/*.js',
	'dist/typescript/Note/Backend/NoteEncryption.js',
	'dist/typescript/Create/CreateNote.js',
	'dist/typescript/Note/Backend/NoteSelect.js',
	'dist/typescript/UI/Rendered/EditBar/EditBar.js',
	'dist/typescript/UI/Rendered/OptionsBar/OptionsBar.js',
	'dist/typescript/Note/Backend/NoteData.js',
	'dist/typescript/UI/Menu.js',
	'dist/typescript/**/*.js',
];

const cssFiles = ['dist/css/Style.css'];

const AllFiles = [...JsFiles, ...cssFiles];

const matchExports = new RegExp(/export{[A-Za-z0-9_.,$]*};/gim);
const matchImports = new RegExp(/import{[A-Za-z0-9_.,$]*}from"[A-Za-z0-9_./-]*";/gim);
const matchUseStrict = new RegExp(/"use strict";/gim);
const matchStyle = new RegExp(/%NoteWorthyOfficial_stylecode%/gm);
const matchConsoleLogs = new RegExp(/console.log\([A-Za-z0-9_.,$]*\);/gim);

const miniBundle = () => {
	return (
		src(JsFiles)
			.pipe(gulpIgnore.exclude('**/Inject.js'))
			.pipe(minifyJs())
			.pipe(concat('main.min.js'))
			.pipe(replace(matchImports, ''))
			.pipe(replace(matchExports, ''))
			.pipe(replace(matchUseStrict, ''))
			// .pipe(replace(matchConsoleLogs, '')) Todo: turn on to remove console.logs
			.pipe(replace(matchStyle, fs.readFileSync('dist/css/Style.css')))
			.pipe(dest('dist/js'))
	);
};

const bundleExtension = () => {
	return src(JsFiles)
		.pipe(gulpIgnore.exclude('**/Inject.js'))
		.pipe(minifyJs())
		.pipe(concat('main.min.js'))
		.pipe(replace(matchImports, ''))
		.pipe(replace(matchExports, ''))
		.pipe(replace(matchUseStrict, ''))
		.pipe(replace(matchConsoleLogs, ''))
		.pipe(replace(matchStyle, fs.readFileSync('dist/css/Style.css')))
		.pipe(dest('../Noteworthy-Extension/dist/assets/js'));
};

const bundle = () => {
	return (
		src(JsFiles)
			.pipe(gulpIgnore.exclude('**/Inject.js'))
			.pipe(concat('main.js'))
			.pipe(replace(matchImports, ''))
			.pipe(replace(matchUseStrict, ''))
			.pipe(replace(matchExports, ''))
			// .pipe(replace(matchConsoleLogs, '')) Todo: turn on to remove console.logs
			.pipe(replace(matchStyle, fs.readFileSync('dist/css/Style.css')))
			.pipe(dest('dist/js'))
	);
};

const watchJs = () => watch(AllFiles, miniBundle);
const watchExtension = () => watch(JsFiles, bundleExtension);

exports.miniBundle = miniBundle;
exports.bundleExtension = bundleExtension;
exports.bundle = bundle;
exports.watchJs = watchJs;
exports.watchExtension = watchExtension;
