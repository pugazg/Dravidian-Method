// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://dravidian-method.vercel.app',
	integrations: [
		starlight({
			title: 'The Dravidian Method',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/pugazg/Dravidian-Method' }],
			customCss: ['./src/styles/custom.css'],
			components: {
				Head: './src/components/Head.astro',
			},
			sidebar: [
				{
					label: 'The Book',
					items: [{ autogenerate: { directory: 'book' } }],
				},
				{
					label: 'Appendices',
					items: [{ autogenerate: { directory: 'appendices' } }],
				},
			],
		}),
	],
});
