/**
 * The orientation of a device (normal or upside-down)
 *
 * Direction: deviceToCloud
 *
 * @see https://github.com/nRFCloud/application-protocols/tree/v1/schemas/deviceToCloud/flip/flip.json
 */
export type FLIP = Readonly<{
	appId: string
	messageType: string
	data?: string
	ts?: number
	time?: number
}>
