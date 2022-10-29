export const Theme = {
    cssThemes: {
        default: {
            'Theme-light': '#fbd58d',
            'Theme-dark': '#c78b1f',
            'Theme-border': '#bb7f11',
        },
        dark: {},
        light: {},
        highContrast: {},
        highContrastLight: {},
        highContrastDark: {},
        blue: {},
        purple: {},
    },
    set(theme) {
        console.log(theme);
        for (const [key, value] of Object.entries(theme)) {
            document.querySelector('#NoteWorthyOfficial').style.setProperty(`--${key}`, value.toString());
        }
    },
};
