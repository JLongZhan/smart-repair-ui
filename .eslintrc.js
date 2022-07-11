module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'eslint:recommended'
	],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-unused-vars': 0,
		'eslint-disable-next-line': 0,
		'no-mixed-spaces-and-tabs': 0,
		'vue/no-unused-components': 0,
		'vue/no-unused-vars': 0,
		'no-undef': 0,
		'vue/no-v-model-argument': 0
	}
};
