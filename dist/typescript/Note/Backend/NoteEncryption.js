import { NoteStorage } from "./NoteStorage.js";
export const NoteEncryption = {
    encryptingKey: '❚',
    encryptingTranslationChars: {
        '1': '❚',
        '2': '❙',
        '3': '❘',
        '4': '❗',
        '5': '❖',
        '6': '❕',
        '7': '❔',
        '8': '❓',
        '9': '❒',
        '0': '❑',
        ' ': '❐',
    },
    encrypt: (data) => {
        for (const key in NoteEncryption.encryptingTranslationChars) {
            data = data.replaceAll(key, NoteEncryption.encryptingTranslationChars[key]);
        }
        return data;
    },
    decrypt: (data) => {
        for (const key in NoteEncryption.encryptingTranslationChars) {
            data = data.replaceAll(NoteEncryption.encryptingTranslationChars[key], key);
        }
        return data;
    },
    encode: (param) => {
        let encodedString = `${param.type}${NoteEncryption.encryptingKey}${param.index}${NoteEncryption.encryptingKey}`;
        for (const paramVal of param.parameters) {
            encodedString += `${paramVal}${NoteEncryption.encryptingKey}`;
        }
        encodedString += `${NoteEncryption.encryptingKey}${param.content}`;
        return encodedString;
    },
    decode: (encodedString) => {
        const parameters = encodedString
            .replace(NoteStorage.prefix, "")
            .substring(0, encodedString.indexOf(NoteEncryption.encryptingKey.repeat(2)))
            .split(NoteEncryption.encryptingKey);
        const content = encodedString.substring(encodedString.indexOf(NoteEncryption.encryptingKey.repeat(2)) + 2, encodedString.length);
        return {
            type: parameters[0],
            parameters: parameters.slice(2, parameters.length),
            content: content,
            index: parseInt(parameters[1])
        };
    }
};
