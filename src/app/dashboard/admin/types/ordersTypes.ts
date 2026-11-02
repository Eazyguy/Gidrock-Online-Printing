export type orders = Record<
	string,
	| string
	| number
	| Record<string, string | number | Record<string, string | number | null>>[]
>[];
