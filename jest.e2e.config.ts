import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: '.e2e-spec.ts$',
};
export default config;
