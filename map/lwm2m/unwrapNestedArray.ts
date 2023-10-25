/**
 * A recursive function that walks through the given object and for each property checks if its value is an array and only has one element. If that is the case it takes the first element and uses it instead.
 */
export const unwrapNestedArray = (
	object: Record<string, unknown>,
): Record<string, unknown> => {
	if (typeof object === 'string') return object
	return Object.entries(object).reduce((result, [k, v]) => {
		if (typeof v === 'string') return { ...result, [k]: v }
		if (Array.isArray(v)) {
			if (v.length === 1) {
				return {
					...result,
					[k]: unwrapNestedArray(v[0]),
				}
			}
			return {
				...result,
				[k]: v.map(unwrapNestedArray),
			}
		}
		return {
			...result,
			[k]: unwrapNestedArray(v as Record<string, unknown>),
		}
	}, {})
}
