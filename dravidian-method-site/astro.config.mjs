// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://pugazg.github.io/Dravidian-Method',
	integrations: [
		starlight({
			title: 'The Dravidian Method',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/pugazg/Dravidian-Method' }],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{ label: 'Preface', slug: 'preface' },
				{ label: 'Introduction', slug: 'introduction' },
				{
					label: 'Part I',
					items: [
						{ label: 'A Recurring Obligation', slug: 'part-i/recurring-obligation' },
						{ label: 'Anna’s Question', slug: 'part-i/annas-question' },
					],
				},
				{
					label: 'Part II',
					items: [
						{ label: 'After Access', slug: 'part-ii/after-access' },
						{ label: 'Ownership as Ecosystem', slug: 'part-ii/ownership-ecosystem' },
					],
				},
				{
					label: 'Part III',
					items: [
						{ label: 'Innovation Architecture', slug: 'part-iii/innovation-architecture' },
						{ label: 'Closing the Loops', slug: 'part-iii/closing-the-loops' },
						{ label: 'The Question That Moved', slug: 'part-iii/question-that-moved' },
					],
				},
				{
					label: 'Appendices',
					items: [
						{ label: 'Evidence Matrix', slug: 'appendices/evidence-matrix' },
						{ label: 'Primary Sources', slug: 'appendices/primary-sources' },
						{ label: 'Suggested Reading', slug: 'appendices/suggested-reading' },
					],
				},
				{ label: 'About', slug: 'about' },
			],
		}),
	],
});
