import { InjectionKey } from "vue";

export interface GlobalState {
	currency: string;
	country: string;
}

const globalStateKey: InjectionKey<GlobalState> = Symbol("GlobalState");
export default globalStateKey;
