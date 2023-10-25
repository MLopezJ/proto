export const undefinedIfBlank = (s: string): string | undefined =>
	s.length === 0 ? undefined : s
