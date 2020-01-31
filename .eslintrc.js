module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
	"no-tabs": 0,
	"indent": ["error", 4],
	"quotes": 0,
	"semi": [2, "always", { "omitLastInOneLineBlock": true}]
  }
}
