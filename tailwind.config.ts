import flowbitePlugin from 'flowbite/plugin';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			colors: {
				// Definindo cores do tema light
				light: {
					background: '#ffffff',
					text: '#000000',
					primary: {
						50: '#FFF5F2',
						100: '#FFF1EE',
						200: '#FFE4DE',
						300: '#FFD5CC',
						400: '#FFBCAD',
						500: '#FE795D',
						600: '#EF562F',
						700: '#EB4F27',
						800: '#CC4522',
						900: '#A5371B'
					}
				},
				// Definindo cores do tema dark
				dark: {
					background: '#1e293b',
					text: '#ffffff',
					primary: {
						50: '#E0F7FF',
						100: '#B3EFFF',
						200: '#80E4FF',
						300: '#4DD9FF',
						400: '#26CFFF',
						500: '#00C4FF',
						600: '#00A8D9',
						700: '#008CB3',
						800: '#00708D',
						900: '#005467'
					}
				}
			},
			backgroundColor: (theme) => ({
				'light-background': theme('colors.light.background'),
				'dark-background': theme('colors.dark.background')
			}),
			textColor: (theme) => ({
				'light-text': theme('colors.light.text'),
				'dark-text': theme('colors.dark.text')
			})
		}
	},
	plugins: [flowbitePlugin]
};
