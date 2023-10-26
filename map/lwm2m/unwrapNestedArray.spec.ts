import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { unwrapNestedArray } from './unwrapNestedArray.js'

describe('unwrapNestedArray()', () => {
	it('should unwrap an array', () =>
		assert.deepEqual(
			unwrapNestedArray({
				LWM2M: {
					$: {
						'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
						'xsi:noNamespaceSchemaLocation':
							'http://www.openmobilealliance.org/tech/profiles/LWM2M-v1_1.xsd',
					},
					Object: [
						{
							$: { ObjectType: 'MODefinition' },
							Name: ['Location'],
							Description1: [
								'This LwM2M Object provides a range of location telemetry related information which can be queried by the LwM2M Server.',
							],
							ObjectID: ['6'],
							ObjectURN: ['urn:oma:lwm2m:oma:6'],
							LWM2MVersion: ['1.0'],
							ObjectVersion: ['1.0'],
							MultipleInstances: ['Single'],
							Mandatory: ['Optional'],
							Resources: [
								{
									Item: [
										{
											$: { ID: '0' },
											Name: ['Latitude'],
											Operations: ['R'],
											MultipleInstances: ['Single'],
											Mandatory: ['Mandatory'],
											Type: ['Float'],
											RangeEnumeration: [''],
											Units: ['lat'],
											Description: [
												'The decimal notation of latitude, e.g. -43.5723 [World Geodetic System 1984].',
											],
										},
										{
											$: { ID: '1' },
											Name: ['Longitude'],
											Operations: ['R'],
											MultipleInstances: ['Single'],
											Mandatory: ['Mandatory'],
											Type: ['Float'],
											RangeEnumeration: [''],
											Units: ['lon'],
											Description: [
												'The decimal notation of longitude, e.g. 153.21760 [World Geodetic System 1984].',
											],
										},
										{
											$: { ID: '2' },
											Name: ['Altitude'],
											Operations: ['R'],
											MultipleInstances: ['Single'],
											Mandatory: ['Optional'],
											Type: ['Float'],
											RangeEnumeration: [''],
											Units: ['m'],
											Description: [
												'The decimal notation of altitude in meters above sea level.',
											],
										},
										{
											$: { ID: '3' },
											Name: ['Radius'],
											Operations: ['R'],
											MultipleInstances: ['Single'],
											Mandatory: ['Optional'],
											Type: ['Float'],
											RangeEnumeration: [''],
											Units: ['m'],
											Description: [
												'The value in this resource indicates the radius of a circular area in meters. The circular area is used to describe uncertainty about a point for coordinates in a two-dimensional coordinate reference systems (CRS). The center point of a circular area is specified by using the Latitude and the Longitude Resources.',
											],
										},
										{
											$: { ID: '4' },
											Name: ['Velocity'],
											Operations: ['R'],
											MultipleInstances: ['Single'],
											Mandatory: ['Optional'],
											Type: ['Opaque'],
											RangeEnumeration: [''],
											Units: [''],
											Description: [
												'The velocity of the LwM2M Client, as defined in [3GPP-TS_23.032].',
											],
										},
										{
											$: { ID: '5' },
											Name: ['Timestamp'],
											Operations: ['R'],
											MultipleInstances: ['Single'],
											Mandatory: ['Mandatory'],
											Type: ['Time'],
											RangeEnumeration: [''],
											Units: [''],
											Description: [
												'The timestamp of when the location measurement was performed.',
											],
										},
										{
											$: { ID: '6' },
											Name: ['Speed'],
											Operations: ['R'],
											MultipleInstances: ['Single'],
											Mandatory: ['Optional'],
											Type: ['Float'],
											RangeEnumeration: [''],
											Units: ['m/s'],
											Description: [
												'Speed is the time rate of change in position of a LwM2M Client without regard for direction: the scalar component of velocity.',
											],
										},
									],
								},
							],
							Description2: [''],
						},
					],
				},
			}),
			{
				LWM2M: {
					$: {
						'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
						'xsi:noNamespaceSchemaLocation':
							'http://www.openmobilealliance.org/tech/profiles/LWM2M-v1_1.xsd',
					},
					Object: {
						$: { ObjectType: 'MODefinition' },
						Name: 'Location',
						Description1:
							'This LwM2M Object provides a range of location telemetry related information which can be queried by the LwM2M Server.',
						ObjectID: '6',
						ObjectURN: 'urn:oma:lwm2m:oma:6',
						LWM2MVersion: '1.0',
						ObjectVersion: '1.0',
						MultipleInstances: 'Single',
						Mandatory: 'Optional',
						Resources: {
							Item: [
								{
									$: { ID: '0' },
									Name: 'Latitude',
									Operations: 'R',
									MultipleInstances: 'Single',
									Mandatory: 'Mandatory',
									Type: 'Float',
									RangeEnumeration: '',
									Units: 'lat',
									Description:
										'The decimal notation of latitude, e.g. -43.5723 [World Geodetic System 1984].',
								},
								{
									$: { ID: '1' },
									Name: 'Longitude',
									Operations: 'R',
									MultipleInstances: 'Single',
									Mandatory: 'Mandatory',
									Type: 'Float',
									RangeEnumeration: '',
									Units: 'lon',
									Description:
										'The decimal notation of longitude, e.g. 153.21760 [World Geodetic System 1984].',
								},
								{
									$: { ID: '2' },
									Name: 'Altitude',
									Operations: 'R',
									MultipleInstances: 'Single',
									Mandatory: 'Optional',
									Type: 'Float',
									RangeEnumeration: '',
									Units: 'm',
									Description:
										'The decimal notation of altitude in meters above sea level.',
								},
								{
									$: { ID: '3' },
									Name: 'Radius',
									Operations: 'R',
									MultipleInstances: 'Single',
									Mandatory: 'Optional',
									Type: 'Float',
									RangeEnumeration: '',
									Units: 'm',
									Description:
										'The value in this resource indicates the radius of a circular area in meters. The circular area is used to describe uncertainty about a point for coordinates in a two-dimensional coordinate reference systems (CRS). The center point of a circular area is specified by using the Latitude and the Longitude Resources.',
								},
								{
									$: { ID: '4' },
									Name: 'Velocity',
									Operations: 'R',
									MultipleInstances: 'Single',
									Mandatory: 'Optional',
									Type: 'Opaque',
									RangeEnumeration: '',
									Units: '',
									Description:
										'The velocity of the LwM2M Client, as defined in [3GPP-TS_23.032].',
								},
								{
									$: { ID: '5' },
									Name: 'Timestamp',
									Operations: 'R',
									MultipleInstances: 'Single',
									Mandatory: 'Mandatory',
									Type: 'Time',
									RangeEnumeration: '',
									Units: '',
									Description:
										'The timestamp of when the location measurement was performed.',
								},
								{
									$: { ID: '6' },
									Name: 'Speed',
									Operations: 'R',
									MultipleInstances: 'Single',
									Mandatory: 'Optional',
									Type: 'Float',
									RangeEnumeration: '',
									Units: 'm/s',
									Description:
										'Speed is the time rate of change in position of a LwM2M Client without regard for direction: the scalar component of velocity.',
								},
							],
						},
						Description2: '',
					},
				},
			},
		))
})
