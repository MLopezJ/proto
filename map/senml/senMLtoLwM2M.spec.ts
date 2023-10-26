import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { SenMLType } from './SenMLSchema'

const senMLtoLwM2M = (sendML: SenMLType): Array<Record<string, unknown>> => []

describe('senMLtoLwM2M()', () => {
	it('should resolve a senML message into objects', () =>
		assert.deepEqual(
			senMLtoLwM2M([
				{
					bn: '14201',
					blv: '1.1',
					bt: 1698155694999,
					n: '0',
					v: 33.98755678796222,
				},
				{
					n: '1',
					v: -84.506132079174634,
				},
				{
					n: '2',
					v: 295.468994140625,
				},
				{
					n: '3',
					v: 17.74077033996582,
				},
				{
					n: '4',
					v: 26.376304626464844,
				},
				{
					n: '5',
					v: 359.15457153320312,
				},
			]),
			[
				{
					ObjectID: '14201',
					ObjectVersion: '1.1',
					Resources: {
						'0': 33.98755678796222,
						'1': -84.506132079174634,
						'2': 295.468994140625,
						'3': 17.74077033996582,
						'4': 26.376304626464844,
						'5': 359.15457153320312,
						'9': 1698155694999,
					},
				},
			],
		))
})
