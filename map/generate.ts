/**
 * Generate code from the model and schema definitions
 */

import chalk from 'chalk'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { unwrapNestedArray } from './lwm2m/unwrapNestedArray.js'
import xml2js from 'xml2js'
import type { ParsedLwM2MObjectDefinition } from './lwm2m/ParsedLwM2MObjectDefinition.js'
import { generateLwm2mTimestampResources } from './generator/generateLwm2mTimestampResources.js'
import { printNode } from './generator/printNode.js'
import os from 'node:os'

console.log(chalk.gray('LwM2M'))
console.log(chalk.gray('', '·'), chalk.gray('timestamp resources map'))
const lwm2mTimestampResources: Record<number, number> = {}
for (const objectDefinitionFile of (
	await readdir(path.join(process.cwd(), 'map', 'lwm2m'))
).filter((s) => s.endsWith('.xml'))) {
	const definition = (
		unwrapNestedArray(
			await xml2js.parseStringPromise(
				await readFile(
					path.join(process.cwd(), 'map', 'lwm2m', objectDefinitionFile),
					'utf-8',
				),
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
const lwm2mTimestampResourcesFile = path.join(
	process.cwd(),
	'map',
	'generated',
	'lwm2mTimestampResources.ts',
)
await writeFile(
	lwm2mTimestampResourcesFile,
	generateLwm2mTimestampResources(lwm2mTimestampResources)
		.map(printNode)
		.join(os.EOL),
	'utf-8',
)

console.log('  ', chalk.green('✔'), chalk.gray(`map written`))
