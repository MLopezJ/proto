import { describe, it } from 'node:test'
import { validateWithTypeBox } from '../validator/validateWithTypeBox.js'
import { SenML, type SenMLType } from './SenMLSchema'
import assert from 'node:assert/strict'

describe('SenMLType', () => {
	it('it should validate a SenML payload', () => {
		const example: SenMLType = [
			{
				bn: 'urn:oma:lwm2m:x:14201:',
				n: '0',
				v: 33.98755678796222,
			},
			{ n: '1', v: -84.506132079174634 },
		]
		const res = validateWithTypeBox(SenML)(example)
		assert.equal('errors' in res, false)
		assert.deepEqual('value' in res && res.value, example)
	})
})
