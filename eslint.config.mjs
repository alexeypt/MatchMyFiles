import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import newlineDestructuring from 'eslint-plugin-newline-destructuring';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import os from 'os';


export default defineConfig([
    {
        extends: [...nextCoreWebVitals, ...nextTs],

        plugins: {
            'simple-import-sort': simpleImportSort
        },

        rules: {
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^\\u0000'],
                        ['^react', '^[^.]'],
                        ['^@/common/', '^@/'],
                        ['^\\.'],
                        [
                            '^styles/images/.*\\.(png|gif|jpg|jpeg)$',
                            '^styles/icons/.*\\.svg$',
                            '\\.s?css$',
                            '^\\u0000.*\\.s?css$'
                        ]
                    ]
                }
            ],

            'react/jsx-max-props-per-line': [
                'error',
                {
                    maximum: {
                        single: 1,
                        multi: 1
                    }
                }
            ],

            'semi': ['error', 'always']
        }
    },
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: true,
        jsx: true,
        severity: 'error',
        pluginName: '@stylistic',
        quoteProps: 'consistent-as-needed',
        commaDangle: 'never',
        braceStyle: '1tbs',
        blockSpacing: true,
        arrowParens: false
    }),
    {
        plugins: {
            'newline-destructuring': newlineDestructuring,
            '@stylistic': stylistic
        },
        rules: {
            '@stylistic/indent': [
                'error',
                4,
                {
                    SwitchCase: 1
                }
            ],
            '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
            '@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],

            '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
            '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
            '@stylistic/jsx-one-expression-per-line': 'off',
            '@stylistic/jsx-sort-props': [
                'error',
                {
                    callbacksLast: true,
                    shorthandLast: true,
                    noSortAlphabetically: true,
                    reservedFirst: ['key', 'ref']
                }
            ],
            '@stylistic/jsx-max-props-per-line': [
                'error',
                {
                    maximum: {
                        single: 1,
                        multi: 1
                    }
                }
            ],
            '@stylistic/jsx-curly-newline': [
                'error',
                {
                    multiline: 'require',
                    singleline: 'consistent'
                }
            ],
            '@stylistic/jsx-child-element-spacing': 'error',

            '@stylistic/linebreak-style': [
                'error',
                os.EOL === '\r\n'
                    ? 'windows'
                    : 'unix'
            ],

            '@stylistic/max-len': [
                'warn',
                150,
                {
                    ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
                    ignoreComments: true,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true
                }
            ],
            '@stylistic/padding-line-between-statements': [
                'error',
                {
                    blankLine: 'always',
                    prev: '*',
                    next: ['enum', 'interface', 'type']
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'return'
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'block-like'
                },
                {
                    blankLine: 'always',
                    prev: 'block-like',
                    next: '*'
                },
                {
                    blankLine: 'never',
                    prev: ['case', 'switch'],
                    next: ['case', 'default']
                },
                {
                    blankLine: 'never',
                    prev: 'function-overload',
                    next: 'function'
                }
            ],
            '@stylistic/array-element-newline': ['error', { consistent: true, multiline: true }],
            '@stylistic/array-bracket-newline': ['error', { multiline: true }],
            '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
            '@stylistic/semi-style': ['error', 'last'],

            '@stylistic/object-curly-newline': [
                'error',
                {
                    ObjectExpression: {
                        minProperties: 4,
                        multiline: true,
                        consistent: true
                    },

                    ObjectPattern: {
                        minProperties: 4,
                        multiline: true,
                        consistent: true
                    }
                }
            ],

            '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
            '@stylistic/multiline-ternary': ['error', 'always', { ignoreJSX: true }],
            'newline-destructuring/newline': [
                'error',
                {
                    items: 3,
                    itemsWithRest: 3,
                    maxLength: 150,
                    consistent: true
                }
            ]
        }
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'error',
            reportUnusedInlineConfigs: 'error',
            noInlineConfig: false
        }
    },
    globalIgnores(['src/clients'])
]);
