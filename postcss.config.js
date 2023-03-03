import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import nested from 'postcss-nested';
import postcssImport from 'postcss-import';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

export default {
	plugins: [
		nested(),
		autoprefixer(),
		postcssImport(),
		!dev &&
			cssnano({
				preset: 'default',
			}),
	],
};
