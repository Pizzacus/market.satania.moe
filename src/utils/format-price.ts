import { Currency } from "../state";

const DOLLARS_CODES = {
	aud: "AU",
	nzd: "NZ",
	sgd: "SG",
	usd: "US",
};

const SYMBOLS: Record<Exclude<Currency, keyof typeof DOLLARS_CODES>, string> = {
	eur: "€",
	gbp: "£",
}

export default function formatPrice(value: number | Record<Currency, number>, currency: Currency): string {
	let strValue: string;

	if (typeof value !== "number") {
		value = value[currency];
	}

	if (Math.round(value) === value) {
		// Whole numbers don't get cents
		// Ex: US $24 instead of US $24.00
		strValue = value.toLocaleString();
	} else {
		const paddedValue = value.toFixed(2);
		const preciseValue = value.toString();

		if (paddedValue.length > preciseValue.length) {
			// Fractions with less than two digits get a zero
			// Ex: 0.1 -> US $0.10
			strValue = paddedValue;
		} else {
			// Fractions with more than two digits are written as a whole
			// Ex: 0.12345 -> US $0.12345
			// it makes errors apparent and sometimes,
			// you really do wanna deal with fractions of cents, like with stocks!
			strValue = preciseValue;
		}
	}

	if (currency in DOLLARS_CODES) {
		return DOLLARS_CODES[currency as keyof typeof DOLLARS_CODES] + "\u202F$" + strValue;
	} else if (currency in SYMBOLS) {
		return SYMBOLS[currency as keyof typeof SYMBOLS] + strValue;
	} else {
		throw new Error("Unknown currency: " + currency);
	}
}