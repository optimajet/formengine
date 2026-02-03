const {
  defineConfig,
  globalIgnores,
} = require("eslint/config");

const globals = require("globals");

const {
  fixupConfigRules,
  fixupPluginRules,
} = require("@eslint/compat");

const _import = require("eslint-plugin-import");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
  FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = defineConfig([{
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",

    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },

    globals: {
      ...globals.browser,
      ...globals.commonjs,
    },
  },

  extends: compat.extends("eslint:recommended"),

}, globalIgnores(["!**/.server", "!**/.client", "eslint.config.cjs"]), {
  files: ["**/*.{js,jsx,ts,tsx}"],

  plugins: {
  },

  extends: fixupConfigRules(compat.extends(
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  )),

  settings: {
    react: {
      version: "detect",
    },

    formComponents: ["Form"],

    linkComponents: [{
      name: "Link",
      linkAttribute: "to",
    }, {
      name: "NavLink",
      linkAttribute: "to",
    }],

    "import/resolver": {
      typescript: {},
    },
  },
}, {
  files: ["**/*.{ts,tsx}"],

  plugins: {
    import: fixupPluginRules(_import),
  },

  languageOptions: {
    parser: tsParser,
  },

  settings: {
    "import/internal-regex": "^~/",

    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
      },

      typescript: {
        alwaysTryTypes: true,
      },
    },
  },

  extends: fixupConfigRules(compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  )),
}, {
  files: ["**/.eslintrc.cjs"],

  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
}]);
