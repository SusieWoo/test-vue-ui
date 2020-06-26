module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    plugins: [
        'vue'
    ],
    /*eslint 被删除许多，需要加上哪些，待讨论 todo*/
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/brace-style': 'error',
        'vue/camelcase': 'error',
        'vue/comma-dangle': 'error',
        'vue/component-name-in-template-casing': 'error',
        'vue/eqeqeq': 'error',
        'vue/match-component-file-name': 'error',
        "space-before-function-paren": 0,
        "vue/mustache-interpolation-spacing":0,
        "spaced-comment":0,
        "eol-last":0,
        "comma-spacing":0,
        "key-spacing":0,
        "vue/html-indent":0,
        "no-multiple-empty-lines":0,
        "semi": [2, "always"],//语句强制分号结尾,
        "indent": 0,
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/member-delimiter-style': ['error',
            {
                multiline: {
                    delimiter: 'none'
                },
                singleline: {
                    delimiter: 'comma'
                }
            }],
        '@typescript-eslint/no-explicit-any': 'off',
        'vue/array-bracket-spacing': 'error',
        'vue/arrow-spacing': 'error',
        'vue/block-spacing': 'error',
        'vue/key-spacing': 'error',
        'vue/object-curly-spacing': 'error'
    },
    'extends': [
        'eslint:recommended',
        'plugin:vue/recommended',
        '@vue/standard',
        '@vue/typescript'
    ]
}
