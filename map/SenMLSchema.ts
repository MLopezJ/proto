import { Type, type Static } from '@sinclair/typebox'

const Name = Type.String({ minLength: 1, title: 'Name' })
const BaseName = Type.String({ minLength: 1, title: 'Base Name' })
const BaseValue = Type.Number({ title: 'Base Value' })
const Value = Type.Number({ title: 'Value' })

/**
 * Defines a SenML type with some unsupported elements removed: Sum, Base Sum, Update Time, Time, Base Time
 *
 * Time fields are removed because they have to be explicitly defined as a value field.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc8428
 */
const Measurement = Type.Intersect(
	[
		// Name combinations
		Type.Union([
			Type.Object({
				n: Name,
			}),
			Type.Object({
				bn: Type.Optional(BaseName),
				n: Name,
			}),
			Type.Object({
				bn: BaseName,
			}),
		]),
		// Value combinations
		Type.Union([
			Type.Object({
				bv: BaseValue,
			}),
			Type.Object({
				bv: Type.Optional(BaseValue),
				v: Value,
			}),
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
