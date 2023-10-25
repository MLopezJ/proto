import { Type, type Static } from '@sinclair/typebox'

const MultipleInstances = Type.Union([
	Type.Literal('Multiple'),
	Type.Literal('Single'),
])
const Mandatory = Type.Union([
	Type.Literal('Optional'),
	Type.Literal('Mandatory'),
])
const ResourceType = Type.Union([
	Type.Literal('String'),
	Type.Literal('Integer'),
	Type.Literal('Float'),
	Type.Literal('Boolean'),
	Type.Literal('Opaque'),
	Type.Literal('Time'),
	Type.Literal('Objlnk'),
])
export const LWM2MObjectDefinition = Type.Object(
	{
		Name: Type.String({ minLength: 1, examples: ['Location'] }),
		Description1: Type.String({
			minLength: 1,
			examples: [
				'This LwM2M Object provides a range of location telemetry related information which can be queried by the LwM2M Server.',
			],
		}),
		ObjectID: Type.RegExp(/^14[0-9]{3}$/),
		ObjectURN: Type.RegExp(/^urn:oma:lwm2m:x:14[0-9]{3}$/),
		MultipleInstances,
		Mandatory,
		Resources: Type.Record(
			Type.Integer({ minimum: 1 }),
			Type.Object({
				Name: Type.String({ minLength: 1, examples: ['Latitude'] }),
				Operations: Type.Literal('R', {
					description: 'Only read-properties are supported',
				}),
				MultipleInstances,
				Mandatory,
				Type: ResourceType,
				RangeEnumeration: Type.Optional(Type.String({ minLength: 1 })),
				Units: Type.Optional(Type.String({ minLength: 1, examples: ['lat'] })),
				Description: Type.String({
					minLength: 1,
					examples: [
						'The decimal notation of latitude, e.g. -43.5723 [World Geodetic System 1984].',
					],
				}),
			}),
			{
				minProperties: 1,
				description: 'Defines the object resources as a map',
			},
		),
		Description2: Type.Optional(Type.String({ minLength: 1 })),
	},
	{
		description:
			'LwM2M Object definitions with additional limitations applied to suit the hello.nrfcloud.com/map use-case',
	},
)

export type LWM2MObjectDefinitionType = Static<typeof LWM2MObjectDefinition>
