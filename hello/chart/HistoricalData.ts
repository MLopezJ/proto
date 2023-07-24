import { Type } from '@sinclair/typebox'
import { Gain } from '../Gain.js'
import { Location } from '../Location.js'
import { ts } from 'hello/ts.js'

export const BatteryData = Type.Object({
	ts,
	// History contains averages, which are floats
	'%': Type.Number({
		minimum: 0,
		maximum: 100,
		examples: [94.5],
		description: 'Battery capacity in percent',
	}),
})

export const GainData = Type.Pick(Gain, ['mA', 'ts'])

export const LocationData = Type.Pick(Location, ['lat', 'lng', 'acc', 'ts'])
