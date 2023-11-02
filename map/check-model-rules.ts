import chalk from 'chalk'
import jsonata from 'jsonata'
import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { ModelIDRegExp, ModelInfoSchema } from './model/model.js'
import { validateWithTypeBox } from '../validator/validateWithTypeBox.js'
import { parseMarkdown } from './parseMarkdown.js'
import { SenML } from './senml/SenMLSchema.js'
import { senMLtoLwM2M } from './senml/senMLtoLwM2M.js'
import { codeBlockFromMarkdown } from './codeBlockFromMarkdown.js'

const validateModelInfo = validateWithTypeBox(ModelInfoSchema)
const validateSenML = validateWithTypeBox(SenML)

console.log(chalk.gray('Models rules check'))
console.log('')
const modelsDir = path.join(process.cwd(), 'map', 'model')
for (const model of await readdir(modelsDir)) {
	const modelDir = path.join(modelsDir, model)
	if (!(await stat(modelDir)).isDirectory()) continue
	console.log(chalk.white('·'), chalk.white.bold(model))
	assert.match(
		model,
		ModelIDRegExp,
		'Model identifiers must consist of numbers and letters only',
	)
	console.log(chalk.green('✔'), chalk.gray('Model name is correct'))

	// Validate README.md
	const readmeFile = path.join(modelDir, 'README.md')
	try {
		await stat(readmeFile)
	} catch {
		throw new Error(`No README.md defined for model ${model}!`)
	}
	const readme = await readFile(readmeFile, 'utf-8')
	const { data: info } = await parseMarkdown.process(readme)
	const modelInfoValid = validateModelInfo({
		name: model,
		...info,
	})
	if ('errors' in modelInfoValid) {
		console.debug({
			name: model,
			...info,
		})
		console.error(modelInfoValid.errors)
		throw new Error(`Model information is not valid!`)
	}
	console.log(chalk.green('✔'), chalk.gray(`README.md is valid`))

	// Validate jsonata shadow expressions
	let hasShadowTransformers = false
	const shadowFolder = path.join(modelDir, 'shadow')
	try {
		await stat(shadowFolder)
		hasShadowTransformers = true
		console.log(' ', chalk.gray('Shadow transformers:'))
	} catch {
		console.log(' ', chalk.gray('No transformers found.'))
	}
	if (hasShadowTransformers) {
		for (const transformer of (await readdir(shadowFolder)).filter((f) =>
			f.endsWith('.md'),
		)) {
			console.log(' ', chalk.white('·'), chalk.white.bold(transformer))
			const markdown = await readFile(
				path.join(modelDir, 'shadow', transformer),
				'utf-8',
			)

			const findBlock = codeBlockFromMarkdown(markdown)
			const matchExpression = findBlock('jsonata', 'Match Expression')
			const transformExpression = findBlock('jsonata', 'Transform Expression')
			const inputExample = JSON.parse(findBlock('json', 'Input Example'))
			const resultExample = JSON.parse(findBlock('json', 'Result Example'))

			const selectResult = await jsonata(matchExpression).evaluate(inputExample)
			if (selectResult !== true) {
				throw new Error(
					`The select expression did not evaluate to true with the given example.`,
				)
			}
			console.log(
				' ',
				chalk.green('✔'),
				chalk.gray('Select expression evaluated to true for the example input'),
			)

			const transformResult =
				await jsonata(transformExpression).evaluate(inputExample)
			const maybeValidSenML = validateSenML(transformResult)
			if ('errors' in maybeValidSenML) {
				console.error(maybeValidSenML.errors)
				throw new Error('The JSONata expression must produce valid SenML')
			}
			assert.deepEqual(maybeValidSenML.value, resultExample)
			console.log(
				' ',
				chalk.green('✔'),
				chalk.gray('Transformation result is valid SenML'),
			)

			assert.deepEqual(transformResult, resultExample)
			console.log(
				' ',
				chalk.green('✔'),
				chalk.gray('The transformation result matches the example'),
			)

			senMLtoLwM2M(maybeValidSenML.value)
			// FIXME: validate LwM2M (see #)
		}
	}
}
