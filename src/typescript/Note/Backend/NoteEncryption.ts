import { NoteStorage } from "./NoteStorage.js";

export const NoteEncryption = {
	encryptingKey: '❘',

	encryptingTranslationChars: {
		
	},

	encrypt: (
		data: string,
	) => {
		for(const key in NoteEncryption.encryptingTranslationChars) {
			data = data.replaceAll(key, NoteEncryption.encryptingTranslationChars[key]);
		}
		return data
	},

	decrypt: (
		data: string,
	) => {
		for(const key in NoteEncryption.encryptingTranslationChars) {
			data = data.replaceAll(NoteEncryption.encryptingTranslationChars[key], key);
		}
		return data
	},

	encode: (
		//Encode parameters into a string
		param: {
			type: string;
			parameters: (string | number)[];
			content: string;
			index: number;
		}
	): string => {
		let encodedString = `${param.type}${NoteEncryption.encryptingKey}${param.index}${NoteEncryption.encryptingKey}`; //The string parameters will be added to
		for (const paramVal of param.parameters) {
			//Loop through parameters
			encodedString += `${paramVal}${NoteEncryption.encryptingKey}`; //Add parameter to string with spacer
		}
		// encodedString = NoteEncryption.encrypt(encodedString); //Encrypt the string
		encodedString += `${NoteEncryption.encryptingKey}${param.content}`; //Add content to string
		return encodedString; //Return encoded string
	},
	decode: (encodedString: string) => {
		//Decode string into parameters and content
		const parameters = encodedString
			.replace(NoteStorage.prefix, "")
			.substring(0, encodedString.indexOf(NoteEncryption.encryptingKey.repeat(2)))
			.split(NoteEncryption.encryptingKey); //Get parameters from string and the split with space to get array

		const content = encodedString.substring(
			encodedString.indexOf(NoteEncryption.encryptingKey.repeat(2)) + 2,
			encodedString.length
		); //Get content from string

		return {
			type: parameters[0],
			parameters: parameters.slice(2, parameters.length),
			content: content,
			index: parseInt(parameters[1])
		}; //Return parameters and content
	}
};
