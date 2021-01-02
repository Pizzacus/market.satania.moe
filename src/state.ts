import { InjectionKey } from "vue";

export enum CurrencyEnum {
	aud,
	cad,
	gbp,
	eur,
	nzd,
	sgd,
	usd,
};

export type CurrencyString = keyof typeof CurrencyEnum;

export interface GlobalState {
	currency: CurrencyString;
	country: string;
	ipCountry: string | null;
};

const globalStateKey: InjectionKey<GlobalState> = Symbol("GlobalState");
export default globalStateKey;
