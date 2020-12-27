import { countries } from "countries-list";
import { CurrencyEnum, CurrencyString } from "../state";

export default function getCurrency(countryCode: string): CurrencyString {
	countryCode = countryCode.toUpperCase();

	if (countryCode in countries) {
		const country = countries[countryCode as keyof typeof countries];
		const currency = country.currency.toLowerCase();
		
		if (currency in CurrencyEnum) {
			return currency as keyof typeof CurrencyEnum;
		}
	}
	
	return "usd";
}
