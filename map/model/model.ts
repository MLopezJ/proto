import { Type, type Static } from '@sinclair/typebox'

export const ModelIDRegExp = /^[A-Za-z0-9+]+$/
export const URLRegExp = /^http?s:\/\/.+/
const Version = Type.RegExp(/^\d\.\d\.\d/, {
	title: 'Version',
	description:
		'The version of the firmware, must follow semantic versioning rules, see https://semver.org/',
	examples: ['1.1.2'],
})

export const ModelInfoSchema = Type.Object(
	{
		name: Type.RegExp(ModelIDRegExp, {
			title: 'Name',
			description: 'The model name',
			examples: ['PCA20035+solar'],
		}),
		title: Type.String({
			minLength: 1,
			maxLength: 40,
			title: 'Title',
			description: 'The title of the model',
			examples: ['Thingy:91 with Solar Shield'],
		}),
		tagline: Type.String({
			minLength: 1,
			maxLength: 255,
			title: 'Tagline',
			description: 'A snappy tagline for the model',
			examples: [
				'Powerfoyle solar cell converts any form of light to electrical energy',
			],
		}),
		abstract: Type.String({
			minLength: 1,
			maxLength: 1024,
			title: 'Abstract',
			description: 'A short description of the model',
			examples: [
				'The Nordic Thingy:91 has been fitted with a light harvesting add-on, giving the platforms autonomous charging capabilities.',
			],
		}),
		links: Type.Object(
			{
				learnMore: Type.RegExp(URLRegExp, {
					title: 'Learn more',
					description:
						'Link to a page that provides additional information for the model, for example the product page.',
					examples: [
						'https://www.exeger.com/updates/exeger-and-nordic-semiconductor-in-partnership/',
					],
				}),
				documentation: Type.RegExp(URLRegExp, {
					title: 'Documentation',
					description:
						'Link to a page that provides documentation for the model, for example a Getting Started Guide',
					examples: [
						'https://docs.nordicsemi.com/bundle/ug_thingy91/page/UG/thingy91/intro/frontpage.html',
					],
				}),
			},
			{
				title: 'Links',
				description: 'Provides links to further information for the model',
			},
		),
		firmware: Type.Object(
			{
				version: Version,
				link: Type.RegExp(URLRegExp, {
					title: 'Link',
					description: 'The URL where the firmware release can be downloaded.',
					examples: [
						'https://github.com/hello-nrfcloud/firmware/releases/tag/v1.1.2',
					],
				}),
			},
			{
				title: 'Application firmware',
				description:
					'Describes the current application firmware version for this model.',
			},
		),
		mfw: Type.Object(
			{
				version: Version,
				link: Type.RegExp(URLRegExp, {
					title: 'Link',
					description: 'The URL where the firmware release can be downloaded.',
					examples: [
						'https://www.nordicsemi.com/Products/Development-hardware/Nordic-Thingy-91/Download?lang=en#infotabs',
					],
				}),
			},
			{
				title: 'Modem firmware',
				description:
					'Describes the current modem firmware version for this model.',
			},
		),
		video: Type.Optional(
			Type.Object({
				youtube: Type.Optional(
					Type.Object(
						{
							id: Type.RegExp(/^[A-Za-z0-9_-]+$/),
							title: Type.String({ minLength: 1 }),
						},
						{
							title: 'YouTube',
							description: 'Describes a YouTube video about the model.',
						},
					),
				),
			}),
		),
	},
	{
		$id: 'https://hello.nrfcloud.com/map/model-info',
		title: 'ModelInfo',
		description: 'Describes a model',
	},
)

export type ModelInfo = Omit<
	Static<typeof ModelInfoSchema>,
	'links' | 'firmware' | 'mfw'
> & {
	links: {
		learnMore: URL
		documentation: URL
	}
	firmware: Omit<Static<typeof ModelInfoSchema>['firmware'], 'link'> & {
		link: URL
	}
	mfw: Omit<Static<typeof ModelInfoSchema>['mfw'], 'link'> & { link: URL }
}

export type Models = Readonly<
	Record<
		string,
		{
			info: ModelInfo
			transforms: {
				shadow: string[]
			}
		}
	>
>
