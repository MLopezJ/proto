import ts from 'typescript'
import { addDocBlock } from './addDocBlock.js'
import { type ModelInfo } from 'map/model/model.js'
import type { Static } from '@sinclair/typebox'

export const generateModels = (
	models: Static<typeof ModelInfo>[],
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
						ts.factory.createIdentifier('Static'),
					),
				]),
			),
			ts.factory.createStringLiteral(`@sinclair/typebox`),
		),
	)

	types.push(
		ts.factory.createImportDeclaration(
			undefined,
			ts.factory.createImportClause(
				false,
				undefined,
				ts.factory.createNamedImports([
					ts.factory.createImportSpecifier(
						false,
						undefined,
						ts.factory.createIdentifier('ModelInfo'),
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
					ts.factory.createTypeReferenceNode('Readonly', [
						ts.factory.createTypeReferenceNode('Record', [
							ts.factory.createTypeReferenceNode('string'),
							ts.factory.createTypeReferenceNode('Static', [
								ts.factory.createExpressionWithTypeArguments(
									ts.factory.createTypeOfExpression(
										ts.factory.createIdentifier('ModelInfo'),
									),
									undefined,
								),
							]),
						]),
					]),
					ts.factory.createObjectLiteralExpression(
						models.map((model) =>
							ts.factory.createPropertyAssignment(
								ts.factory.createStringLiteral(model.name),
								ts.factory.createObjectLiteralExpression(
									Object.entries(model).map(([k, v]) =>
										ts.factory.createPropertyAssignment(
											ts.factory.createStringLiteral(k),
											createAssignment(v),
										),
									),
								),
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
	if (typeof v === 'string') return ts.factory.createStringLiteral(v)
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
