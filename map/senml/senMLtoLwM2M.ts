import type { MeasurementType, SenMLType } from './SenMLSchema'
import { lwm2mTimestampResources } from '../generated/lwm2mTimestampResources.js'

type LwM2MObject = {
	ObjectID: number
	ObjectVersion: string
	Resources: Record<number, string | number | boolean | Date>
}
type MeasurementWithObjectInfo = MeasurementType & {
	bn: number
	blv: string
	bt: number
}
const isObjectInfo = (
	measurement: MeasurementType,
): measurement is MeasurementWithObjectInfo => 'bn' in measurement
const getValue = (measurement: MeasurementType): string | number | boolean => {
	if ('bv' in measurement && !('v' in measurement)) return measurement.bv
	if ('bv' in measurement && 'v' in measurement)
		return measurement.bv + measurement.v
	if ('v' in measurement) return measurement.v
	if ('vs' in measurement) return measurement.vs
	if ('vb' in measurement) return measurement.vb
	return measurement.vd
}
export const senMLtoLwM2M = (senML: SenMLType): Array<LwM2MObject> => {
	let currentObject: LwM2MObject | undefined = undefined
	const items: LwM2MObject[] = []

	for (const item of senML) {
		if (isObjectInfo(item)) {
			if (currentObject !== undefined) items.push(currentObject)
			const tsRes = lwm2mTimestampResources[item.bn]
			if (tsRes === undefined)
				throw new Error(`Unknown LwM2M Object ID: ${item.bn}!`)
			currentObject = {
				ObjectID: item.bn,
				ObjectVersion: item.blv,
				Resources: {
					[tsRes]: new Date(item.bt),
				},
			}
		}
		if (currentObject?.Resources === undefined) continue
		currentObject.Resources = {
			...currentObject.Resources,
			[item.n]: getValue(item),
		}
	}
	if (currentObject !== undefined) items.push(currentObject)

	return items
}
