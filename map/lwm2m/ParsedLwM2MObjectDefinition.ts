export type ParsedLwM2MObjectDefinition = {
	$: { ObjectType: 'MODefinition' }
	Name: string // e.g. 'Location'
	Description1: string // e.g. 'This LwM2M Object provides a range of location telemetry related information which can be queried by the LwM2M Server.'
	ObjectID: string // e.g. '14201'
	ObjectURN: string // e.g. 'urn:oma:lwm2m:x:14201'
	LWM2MVersion: string // e.g. '1.0'
	ObjectVersion: string // e.g. '1.0'
	MultipleInstances: 'Single' | 'Multiple'
	Mandatory: 'Optional' | 'Mandatory'
	Resources: {
		Item: {
			$: {
				ID: string // e.g. '0'
			}
			Name: string // e.g. 'Latitude'
			Operations: 'R' | 'W' | 'RW' | 'E' | ''
			MultipleInstances: 'Single' | 'Multiple'
			Mandatory: 'Optional' | 'Mandatory'
			Type:
				| 'String'
				| 'Integer'
				| 'Float'
				| 'Boolean'
				| 'Opaque'
				| 'Time'
				| 'Objlnk'
				| ''
			RangeEnumeration: string // e.g. ''
			Units: string // e.g. 'lat'
			Description: string // e.g. 'The decimal notation of latitude, e.g. -43.5723 [World Geodetic System 1984].'
		}[]
	}
	Description2: string // e.g. ''
}
