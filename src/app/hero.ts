import { heroui } from '@heroui/theme';


export default heroui({
    layout: {
        disabledOpacity: 0.6
    },
    themes: {
        light: {
            colors: {
                danger: {
                    DEFAULT: '#dc2626', // red-600
                    foreground: '#ffffff'
                }
            }
        }
    }
});
