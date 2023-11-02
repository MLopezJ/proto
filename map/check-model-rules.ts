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
import { Type } from '@sinclair/typebox'

const validateModelInfo = validateWithTypeBox(ModelInfoSchema)
const validateSenML = validateWithTypeBox(SenML)
const validateExpressionSelection = validateWithTypeBox(
	Type.Object({
		select: Type.Boolean({
			title: 'Select',
			description: 'Whether the result should be used.',
		}),
	}),
)

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
	} catch {
		console.log(' ', chalk.gray('No transformers found.'))
	}
	if (hasShadowTransformers) {
		for (const expressionFile of (await readdir(shadowFolder)).filter((f) =>
			f.endsWith('.jsonata'),
		)) {
			console.log(' ', chalk.white('·'), chalk.white.bold(expressionFile))
			const expr = await readFile(
				path.join(modelDir, 'shadow', expressionFile),
				'utf-8',
			)
			const input = JSON.parse(
				await readFile(
					path.join(
						modelDir,
						'shadow',
						expressionFile.replace(/\.jsonata$/, '.input.example.json'),
					),
					'utf-8',
				),
			)
			const result = JSON.parse(
				await readFile(
					path.join(
						modelDir,
						'shadow',
						expressionFile.replace(/\.jsonata$/, '.result.example.json'),
					),
					'utf-8',
				),
			)
			const e = jsonata(expr)
			const expressionResult = await e.evaluate(input)
			const maybeValidExpression = validateExpressionSelection(expressionResult)
			if ('errors' in maybeValidExpression) {
				console.error(maybeValidExpression.errors)
				throw new Error(
					`The JSONata expression must have a boolean 'select' property.`,
				)
			}

			const maybeValidSenML = validateSenML(expressionResult.result)
			if ('errors' in maybeValidSenML) {
				console.error(maybeValidSenML.errors)
				throw new Error('The JSONata expression must produce valid SenML')
			}
			assert.deepEqual(maybeValidSenML.value, result)
			console.log(
				' ',
				chalk.green('✔'),
				chalk.gray('Transformation result is valid SenML'),
			)
			senMLtoLwM2M(maybeValidSenML.value)
			// FIXME: validate LwM2M (see #)
		}
	}
}
