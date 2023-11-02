/**
 * Generate code from the model and schema definitions
 */

import chalk from 'chalk'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { unwrapNestedArray } from './lwm2m/unwrapNestedArray.js'
import xml2js from 'xml2js'
import type { ParsedLwM2MObjectDefinition } from './lwm2m/ParsedLwM2MObjectDefinition.js'
import { generateLwm2mTimestampResources } from './generator/generateLwm2mTimestampResources.js'
import { printNode } from './generator/printNode.js'
import os from 'node:os'
import { parseMarkdown } from './parseMarkdown.js'
import { validateWithTypeBox } from '../validator/validateWithTypeBox.js'
import { ModelInfoSchema } from './model/model.js'
import type { Static } from '@sinclair/typebox'
import { generateModels } from './generator/generateModels.js'
import { codeBlockFromMarkdown } from './codeBlockFromMarkdown.js'

const subDir = (...tree: string[]): string =>
	path.join(process.cwd(), 'map', ...tree)

console.log(chalk.gray('LwM2M'))
console.log(chalk.gray('', '·'), chalk.gray('timestamp resources map'))
const lwm2mTimestampResources: Record<number, number> = {}
for (const objectDefinitionFile of (await readdir(subDir('lwm2m'))).filter(
	(s) => s.endsWith('.xml'),
)) {
	const definition = (
		unwrapNestedArray(
			await xml2js.parseStringPromise(
				await readFile(subDir('lwm2m', objectDefinitionFile), 'utf-8'),
			),
		) as any
	).LWM2M.Object as ParsedLwM2MObjectDefinition
	const ObjectID = parseInt(definition.ObjectID, 10)
	const ResourceId = parseInt(
		definition.Resources.Item.find(({ Type }) => Type === 'Time')?.$
			.ID as string,
		10,
	)
	lwm2mTimestampResources[ObjectID] = ResourceId
	console.log(
		'  ',
		chalk.gray('·'),
		`${chalk.white(ObjectID)}${chalk.gray('.')}${chalk.white(ResourceId)}`,
	)
}
try {
	await mkdir(subDir('generated'))
} catch {
	// pass
}
const lwm2mTimestampResourcesFile = subDir(
	'generated',
	'lwm2mTimestampResources.ts',
)
console.log(chalk.green('Writing'), chalk.blue(lwm2mTimestampResourcesFile))
await writeFile(
	lwm2mTimestampResourcesFile,
	generateLwm2mTimestampResources(lwm2mTimestampResources)
		.map(printNode)
		.join(os.EOL),
	'utf-8',
)

console.log(chalk.gray('Models'))

const validateModelInfo = validateWithTypeBox(ModelInfoSchema)

const loadModelInfo = async (
	model: string,
): Promise<Static<typeof ModelInfoSchema>> => {
	const { data: info } = await parseMarkdown.process(
		await readFile(subDir('model', model, 'README.md'), 'utf-8'),
	)
	const infoWithName = {
		name: model,
		...info,
	}
	const maybeModelInfo = validateModelInfo(infoWithName)
	if ('errors' in maybeModelInfo) {
		console.debug(infoWithName)
		console.error(maybeModelInfo.errors)
		throw new Error(`Model info for ${model} is invalid.`)
	}
	return maybeModelInfo.value
}

// FIXME: use markdown format
const loadModelTransforms = async (
	model: string,
): Promise<{
	shadow: {
		match: string
		transform: string
	}[]
}> => ({
	shadow: await Promise.all(await readdir(subDir('model', model, 'shadow')))
		.then((entries) => entries.filter((e) => e.endsWith('.md')))
		.then(async (expressions) =>
			Promise.all(
				expressions.map(async (expression) =>
					readFile(subDir('model', model, 'shadow', expression), 'utf-8'),
				),
			),
		)
		.then((transforms) =>
			transforms.map((markdown) => {
				const findBlock = codeBlockFromMarkdown(markdown)
				return {
					match: findBlock('jsonata', 'Match Expression'),
					transform: findBlock('jsonata', 'Transform Expression'),
				}
			}),
		),
})

const models = await Promise.all(
	(
		await Promise.all(
			(await readdir(subDir('model'))).map(async (f) => ({
				name: f,
				stat: await stat(subDir('model', f)),
			})),
		)
	)
		.filter(({ stat }) => stat.isDirectory())
		.map(async (model) => {
			console.log(chalk.gray('·'), chalk.white(model.name))
			return {
				info: await loadModelInfo(model.name),
				transforms: await loadModelTransforms(model.name),
			}
		}),
)

const modelsFile = subDir('generated', 'models.ts')
console.log(chalk.green('Writing'), chalk.blue(modelsFile))
await writeFile(
	modelsFile,
	generateModels(models).map(printNode).join(os.EOL),
	'utf-8',
)
