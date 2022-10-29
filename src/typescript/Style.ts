export const AddStyle = () => {
	const style = document.createElement('style');
	style.innerHTML = `
		%NoteWorthyOfficial_stylecode%
	`;
	document.body.appendChild(style);
};
