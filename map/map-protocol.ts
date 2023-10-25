import chalk from 'chalk'
import { readFile, readdir, stat } from 'node:fs/promises'
import path, { parse } from 'node:path'
import assert from 'node:assert/strict'
import xml2js from 'xml2js'
import { exec } from 'node:child_process'
import { unwrapNestedArray } from './lwm2m/unwrapNestedArray'
import {
	LWM2MObjectDefinition,
	type LWM2MObjectDefinitionType,
} from './lwm2m/LWM2MObjectDefinition.js'
import { validateWithTypeBox } from '../validator/validateWithTypeBox.js'
import { undefinedIfBlank } from './lwm2m/undefinedIfBlank'
import type { ParsedLwM2MObjectDefinition } from './lwm2m/ParsedLwM2MObjectDefinition'

const v = validateWithTypeBox(LWM2MObjectDefinition)

const listLwm2mDefinitions = async (
	modelDir: string,
): Promise<LWM2MObjectDefinitionType[]> => {
	const defs: LWM2MObjectDefinitionType[] = []
	const files = await readdir(modelDir)
	for (const file of files) {
		if (!file.endsWith('.xml')) continue
		console.log(chalk.white('·'), chalk.white.bold(file))
		assert.match(
			file,
			/^[0-9]+\.xml$/,
			'LwM2M object definition files must only have numbers in their file names',
		)
		console.log(chalk.green('✔'), chalk.gray('File name is correct'))
		const objectDefinitionFile = path.join(modelDir, file)
		if ((await stat(objectDefinitionFile)).isDirectory()) continue

		// validate
		const schemaValidated = await new Promise<boolean>((resolve) =>
			exec(
				`xmllint --noout --schema ${path.join(
					process.cwd(),
					'map',
					'lwm2m',
					'LWM2M.xsd',
				)} ${objectDefinitionFile}`,
				(error, _, stderr) => {
					if (error) {
						console.error(stderr)
						return resolve(false)
					}
					resolve(true)
				},
			),
		)
		assert.equal(schemaValidated, true, '')
		console.log(
			chalk.green('✔'),
			chalk.gray('Is a valid LwM2M object definition'),
		)
		const ObjectID = parseInt(parse(objectDefinitionFile).name, 10)
		assert.equal(ObjectID > 14200, true, 'ObjectID must be greater than 14200')
		assert.equal(ObjectID < 15000, true, 'ObjectID must be smaller than 15000')
		const ObjectURN = `urn:oma:lwm2m:x:${ObjectID}`

		const { $, ...definition } = (
			unwrapNestedArray(
				await xml2js.parseStringPromise(
					await readFile(objectDefinitionFile, 'utf-8'),
				),
			) as any
		).LWM2M.Object as ParsedLwM2MObjectDefinition

		assert.equal(
			ObjectID.toString(),
			definition.ObjectID,
			`ObjectID must match filename`,
		)
		assert.equal(
			ObjectURN,
			definition.ObjectURN,
			`ObjectURN must follow schema`,
		)

		console.log(
			chalk.green('✔'),
			chalk.blue(ObjectURN),
			chalk.gray('ObjectID and URN match filename and schema'),
		)

		const objectDef: LWM2MObjectDefinitionType = {
			...definition,
			Description2: undefinedIfBlank(definition.Description2),
			Resources: definition.Resources.Item.reduce(
				(resources, { $, ...item }) => ({
					...resources,
					[$.ID]: {
						...item,
						RangeEnumeration: undefinedIfBlank(item.RangeEnumeration),
						Units: undefinedIfBlank(item.Units),
					},
				}),
				{},
			),
		}

		const maybeValid = v(objectDef)
		if ('errors' in maybeValid) {
			console.error(maybeValid.errors)
			throw new Error(`The definition should be valid!`)
		}

		console.log(
			chalk.green('✔'),
			chalk.gray('hello.nrfcloud.com/map limitations are honored'),
		)

		defs.push(maybeValid.value)

		const { Name, Resources } = maybeValid.value

		const TimeResources = Object.values(Resources).filter(
			({ Type }) => Type === 'Time',
		)
		assert.equal(
			TimeResources.length,
			1,
			'Objects must defined one Time resource',
		)
		console.log(
			chalk.green('✔'),
			chalk.gray(`Object has one time resource (${TimeResources[0]?.Name})`),
		)

		console.log(`${chalk.yellow(ObjectID)}:`, chalk.white(Name))
		for (const [id, resource] of Object.entries(Resources)) {
			console.log(
				`${chalk.gray(ObjectID)}.${chalk.yellow(id)}:`,
				chalk.white(resource.Name),
				`${chalk.gray(resource.Type)} ${chalk.gray(
					`(${resource.Units ?? 'no unit'})`,
				)}`,
			)
		}
	}
	return defs
}

console.log(`hello.nrfcloud.com/map protocol definitions`)

console.log('')

// LwM2M
console.log(chalk.gray('LwM2M object definitions'))
console.log('')
const lwm2mDir = path.join(process.cwd(), 'map', 'lwm2m')
const lwm2mDefinitions = await listLwm2mDefinitions(lwm2mDir)
assert.equal(
	lwm2mDefinitions.length > 0,
	true,
	'LwM2M objects must be defined.',
)

console.log('')

// Models
console.log(chalk.gray('Models'))
console.log('')
const modelsDir = path.join(process.cwd(), 'map', 'model')
for (const model of await readdir(modelsDir)) {
	if (!(await stat(path.join(modelsDir, model))).isDirectory()) continue
	console.log(chalk.white('·'), chalk.white.bold(model))
	assert.match(
		model,
		/^[a-z0-9]+$/i,
		'Model identifiers must consist of numbers and letters only',
	)
	console.log(chalk.green('✔'), chalk.gray('Model name is correct'))
}
