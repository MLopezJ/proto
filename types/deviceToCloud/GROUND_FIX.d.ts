type accessPointsItem = Readonly<{
	/**
	 * String comprised of 6 hexadecimal pairs, separated by colons or dashes
	 */
	macAddress: string
	/**
	 * Name of Wi-Fi network
	 */
	ssid?: string
	/**
	 * Signal strength in dBm
	 */
	signalStrength?: number
	/**
	 * Channel frequency in MHz (only one of Channel or Frequency should be used)
	 */
	frequency?: number
	/**
	 * Channel number (only one of Channel or Frequency should be used)
	 */
	channel?: number
}>
type nmrItem = Readonly<{
	/**
	 * Evolved Absolute Radio Frequency Channel (E-ARFCN).
	 */
	earfcn: number
	/**
	 * Physical Cell Identity (PCI).
	 */
	pci: number
	/**
	 * Signal power
	 */
	rsrp?: number
	/**
	 * Signal quality
	 */
	rsrq?: number
}>
type lteItem = Readonly<{
	/**
	 * Mobile Country Code
	 */
	mcc: number
	/**
	 * Mobile Network Code
	 */
	mnc: number
	/**
	 * Tracking Area Code
	 */
	tac: number
	/**
	 * E-UTRA Cell Identifier
	 */
	eci: number
	/**
	 * Signal power
	 */
	rsrp?: number
	/**
	 * Signal quality
	 */
	rsrq?: number
	/**
	 * Evolved Absolute Radio Frequency Channel (E-ARFCN).
	 */
	earfcn?: number
	nmr?: nmrItem[]
}>
/**
 * GROUND_FIX request
 *
 * Direction: deviceToCloud
 *
 * @see https://github.com/nRFCloud/application-protocols/tree/v1/schemas/deviceToCloud/ground_fix/ground-fix.json
 */
export type GROUND_FIX = Readonly<{
	appId: 'GROUND_FIX'
	messageType: 'DATA'
	data: {
		/**
		 * Does not reply, even in event of an error, if set to false. Defaults to true.
		 */
		doReply?: boolean
		wifi?: {
			/**
			 * At least two access points are required
			 */
			accessPoints: accessPointsItem[]
		}
		lte?: lteItem[]
	}
}>
