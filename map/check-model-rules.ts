import chalk from 'chalk'
import jsonata from 'jsonata'
import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { ModelIDRegExp, ModelInfo } from './model/model.js'
import { validateWithTypeBox } from '../validator/validateWithTypeBox.js'
import { parseMarkdown } from './parseMarkdown.js'

const validateModelInfo = validateWithTypeBox(ModelInfo)

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
						expressionFile.replace(/\.jsonata$/, '.input.json'),
					),
					'utf-8',
				),
			)
			const result = JSON.parse(
				await readFile(
					path.join(
						modelDir,
						'shadow',
						expressionFile.replace(/\.jsonata$/, '.result.json'),
					),
					'utf-8',
				),
			)
			const e = jsonata(expr)
			assert.deepEqual(await e.evaluate(input), result)
			console.log(
				' ',
				chalk.green('✔'),
				chalk.gray('JSONata expression is valid'),
			)
		}
	}
}
