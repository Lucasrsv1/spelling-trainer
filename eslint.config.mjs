/* eslint sort-keys: "warn" */

import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import onlyWarn from "eslint-plugin-only-warn";
import path from "node:path";
import stylistic from "@stylistic/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	allConfig: js.configs.all,
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended
});

export default [
	{ ignores: ["projects/**/*"] },
	{
		plugins: {
			"@stylistic": stylistic,
			"only-warn": onlyWarn
		},
		rules: {
			"no-dupe-class-members": "warn"
		}
	},
	stylistic.configs["recommended-flat"],
	...compat.extends(
		"plugin:@angular-eslint/recommended",
		"plugin:@angular-eslint/template/process-inline-templates"
	).map(config => ({
		...config,
		files: ["**/*.ts"]
	})),
	{
		files: ["**/*.ts"],
		languageOptions: {
			ecmaVersion: 5,
			parserOptions: {
				createDefaultProgram: true,
				project: ["tsconfig.json"]
			},
			sourceType: "script"
		},
		rules: {
			"@angular-eslint/component-class-suffix": ["error", {
				suffixes: ["Page", "Component"]
			}],
			"@angular-eslint/component-selector": ["error", {
				prefix: "app",
				style: "kebab-case",
				type: "element"
			}],
			"@angular-eslint/directive-selector": ["error", {
				prefix: "app",
				style: "camelCase",
				type: "attribute"
			}],
			"@angular-eslint/no-empty-lifecycle-method": "off",
			"no-underscore-dangle": ["warn", { allowAfterThis: true }]
		}
	},
	{
		files: ["**/*.js", "**/*.mjs", "**/*.ts"],
		rules: {
			"@stylistic/arrow-parens": ["warn", "as-needed"],
			"@stylistic/arrow-spacing": "warn",
			"@stylistic/brace-style": ["warn", "1tbs"],
			"@stylistic/comma-dangle": ["warn", "never"],
			"@stylistic/func-call-spacing": ["warn", "never"],
			"@stylistic/implicit-arrow-linebreak": ["warn", "beside"],
			"@stylistic/indent": ["warn", "tab", { SwitchCase: 1 }],
			"@stylistic/member-delimiter-style": ["warn", {
				multiline: {
					delimiter: "semi",
					requireLast: true
				},
				singleline: {
					delimiter: "semi",
					requireLast: true
				}
			}],
			"@stylistic/no-confusing-arrow": "off",
			"@stylistic/no-mixed-operators": "warn",
			"@stylistic/no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
			"@stylistic/no-multi-spaces": "warn",
			"@stylistic/no-tabs": "off",
			"@stylistic/no-trailing-spaces": "warn",
			"@stylistic/no-whitespace-before-property": "warn",
			"@stylistic/quote-props": ["warn", "as-needed"],
			"@stylistic/quotes": ["warn", "double", { avoidEscape: true }],
			"@stylistic/semi": ["warn", "always"],
			"@stylistic/space-before-function-paren": ["warn", "always"],
			"array-callback-return": "warn",
			"arrow-body-style": ["warn", "as-needed"],
			camelcase: "warn",
			curly: ["warn", "multi-or-nest", "consistent"],
			"default-case-last": "warn",
			"default-param-last": "warn",
			"dot-notation": "warn",
			"eol-last": ["warn", "always"],
			"keyword-spacing": "warn",
			"max-len": "off",
			"no-array-constructor": "warn",
			"no-console": "off",
			"no-const-assign": "warn",
			"no-dupe-class-members": "warn",
			"no-duplicate-imports": "warn",
			"no-empty": "warn",
			"no-eval": "warn",
			"no-fallthrough": "warn",
			"no-irregular-whitespace": "warn",
			"no-multiple-empty-lines": ["warn", { max: 2, maxEOF: 0 }],
			"no-new-func": "warn",
			"no-new-object": "warn",
			"no-unneeded-ternary": "warn",
			"no-unreachable": "warn",
			"no-unused-expressions": "warn",
			"no-unused-labels": "warn",
			"no-unused-vars": "off",
			"no-useless-constructor": "off",
			"no-useless-escape": "warn",
			"no-var": "warn",
			"object-curly-spacing": ["warn", "always"],
			"object-shorthand": ["warn", "always"],
			"prefer-arrow-callback": "warn",
			"prefer-const": "warn",
			"prefer-spread": "warn",
			"sort-imports": ["warn", {
				allowSeparatedGroups: true,
				ignoreCase: true,
				memberSyntaxSortOrder: ["none", "all", "single", "multiple"]
			}],
			"sort-keys": "off",
			"sort-vars": "off",
			"space-before-blocks": "warn",
			strict: ["warn", "never"]
		}
	},
	...compat.extends(
		"plugin:@angular-eslint/template/recommended"
	).map(config => ({
		...config,
		files: ["**/*.html"]
	}))
];
