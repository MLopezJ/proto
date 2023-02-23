/**
 * The button state of the device
 *
 * Direction: deviceToCloud
 *
 * @see https://github.com/nRFCloud/application-protocols/tree/v1/schemas/deviceToCloud/button/button.json
 */
export type BUTTON = Readonly<{
	appId: string
	messageType: string
	data: string
	ts?: number
	time?: number
}>
