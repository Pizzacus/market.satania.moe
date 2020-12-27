import { InjectionKey } from "vue";

export enum CurrencyEnum {
	aud,
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
};

const globalStateKey: InjectionKey<GlobalState> = Symbol("GlobalState");
export default globalStateKey;
