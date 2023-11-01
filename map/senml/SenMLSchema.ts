import { Type, type Static } from '@sinclair/typebox'

const ResourceID = Type.Integer({ minimum: 0, title: 'ResourceID' })
const ObjectID = Type.Integer({ minimum: 0, title: 'ObjectID' })
const BaseValue = Type.Number({ title: 'Base Value' })
const Value = Type.Number({ title: 'Value' })
const Time = Type.Integer({ minimum: 0, title: 'Time' })

/**
 * Defines a SenML type with some unsupported elements removed: Sum, Base Sum, Update Time
 *
 * @see https://datatracker.ietf.org/doc/html/rfc8428
 */
export const Measurement = Type.Intersect(
	[
		Type.Union([
			Type.Object({
				n: ResourceID,
			}),
			Type.Object({
				bn: ObjectID,
				blv: Type.String({
					minLength: 1,
					description: 'The LwM2M object version used',
				}),
				bt: Type.Optional(Time),
				n: ResourceID,
			}),
		]),
		// Value combinations
		Type.Union([
			Type.Union([
				Type.Object({
					bv: BaseValue,
				}),
				Type.Object({
					bv: BaseValue,
					v: Value,
				}),
				Type.Object({
					v: Value,
				}),
			]),
			Type.Object({
				vs: Type.String({ minLength: 1, title: 'String Value' }),
			}),
			Type.Object({
				vb: Type.Boolean({ title: 'Boolean Value' }),
			}),
			Type.Object({
				vd: Type.String({
					title: 'Data Value.',
					description:
						'Octets in the Data Value are base64 encoded with the URL-safe alphabet as defined in Section 5 of [RFC4648], with padding omitted.',
				}),
			}),
		]),
	],
	{
		description:
			'SenML schema for conversion results. This is limited to properties useful for the hello.nrfcloud.com/map application.',
	},
)

export const SenML = Type.Array(Measurement, { minItems: 1 })

export type SenMLType = Static<typeof SenML>
export type MeasurementType = Static<typeof Measurement>
