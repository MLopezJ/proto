import chalk from 'chalk'
import jsonata from 'jsonata'
import { AssertionError } from 'node:assert'
import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

console.log(chalk.gray('Models rules check'))
console.log('')
const modelsDir = path.join(process.cwd(), 'map', 'model')
for (const model of await readdir(modelsDir)) {
	const modelDir = path.join(modelsDir, model)
	if (!(await stat(modelDir)).isDirectory()) continue
	console.log(chalk.white('·'), chalk.white.bold(model))
	assert.match(
		model,
		/^[a-z0-9]+$/i,
		'Model identifiers must consist of numbers and letters only',
	)
	console.log(chalk.green('✔'), chalk.gray('Model name is correct'))

	// Validate jsonata shadow expressions
	for (const expressionFile of (
		await readdir(path.join(modelDir, 'shadow'))
	).filter((f) => f.endsWith('.jsonata'))) {
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
