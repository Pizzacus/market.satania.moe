import type {UserConfig} from "vite";

const config: UserConfig = {
	optimizeDeps: {
		exclude: ["bootstrap"],
	},
};

export default config;
