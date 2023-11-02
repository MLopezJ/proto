import ts from 'typescript'
import { addDocBlock } from './addDocBlock.js'
import { URLRegExp, type ModelInfoSchema } from 'map/model/model.js'
import type { Static } from '@sinclair/typebox'

export const generateModels = (
	models: {
		info: Static<typeof ModelInfoSchema>
		transforms: {
			shadow: string[]
		}
	}[],
): ts.Node[] => {
	const types: ts.Node[] = []

	types.push(
		ts.factory.createImportDeclaration(
			undefined,
			ts.factory.createImportClause(
				false,
				undefined,
				ts.factory.createNamedImports([
					ts.factory.createImportSpecifier(
						true,
						undefined,
						ts.factory.createIdentifier('Models'),
					),
				]),
			),
			ts.factory.createStringLiteral(`../model/model.js`),
		),
	)

	const type = ts.factory.createVariableStatement(
		[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList(
			[
				ts.factory.createVariableDeclaration(
					ts.factory.createIdentifier(`models`),
					undefined,
					ts.factory.createTypeReferenceNode('Models'),
					ts.factory.createObjectLiteralExpression(
						models.map((model) =>
							ts.factory.createPropertyAssignment(
								ts.factory.createStringLiteral(model.info.name),
								createAssignment(model),
							),
						),
					),
				),
			],
			ts.NodeFlags.Const,
		),
	)
	addDocBlock(['The models defined for hello.nrfcloud.com'], type)
	types.push(type)

	return types
}

const createAssignment = (v: unknown): ts.Expression => {
	if (v === null) return ts.factory.createNull()
	if (typeof v === 'string') {
		if (URLRegExp.test(v)) {
			return ts.factory.createNewExpression(
				ts.factory.createIdentifier('URL'),
				undefined,
				[ts.factory.createStringLiteral(v)],
			)
		}
		return ts.factory.createStringLiteral(v)
	}
	if (Array.isArray(v)) {
		return ts.factory.createArrayLiteralExpression(
			v.map((el) => createAssignment(el)),
		)
	}
	if (typeof v === 'object')
		return ts.factory.createObjectLiteralExpression(
			Object.entries(v).map(([k, v]) =>
				ts.factory.createPropertyAssignment(
					ts.factory.createStringLiteral(k),
					createAssignment(v),
				),
			),
		)
	const nullNode = ts.factory.createNull()
	addDocBlock([`Could not convert node`, JSON.stringify(v)], nullNode)
	return nullNode
}
