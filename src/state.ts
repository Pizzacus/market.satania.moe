import { InjectionKey } from "vue";

export type Currency = "aud" | "gbp" | "eur" | "nzd" | "sgd" | "usd";

export interface GlobalState {
	currency: Currency;
	country: string;
}

const globalStateKey: InjectionKey<GlobalState> = Symbol("GlobalState");
export default globalStateKey;
