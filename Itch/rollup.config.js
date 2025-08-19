// rollup.config.js
import terser
from '@rollup/plugin-terser';

export default {
	input: '../Assets/oozaru/dist/scripts/core/main.js',
	output: [
		{
			file: 'dist/scripts/core/main.js',
			format: 'es',
			plugins: [terser({
				mangle: {
        			keep_classnames: true
				}
			})]
		}
	]
};