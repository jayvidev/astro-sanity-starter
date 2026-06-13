import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

export default defineConfig([
  js.configs.recommended,

  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: (await import('astro-eslint-parser')).default,
      parserOptions: {
        parser: (await import('@typescript-eslint/parser')).default,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.astro'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      astro: (await import('eslint-plugin-astro')).default,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^astro$', '^astro/'],
            ['^@?\\w'],
            ['^@/'],
            ['^\\.\\.(?!/?$)', '^\\./'],
            ['\\.css$', '\\.scss$', '\\.less$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'prettier/prettier': 'error',
    },
  },

  {
    files: ['src/**/*.{js,ts}'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': (await import('@typescript-eslint/eslint-plugin')).default,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^astro$', '^astro/'],
            ['^@?\\w'],
            ['^@/'],
            ['^\\.\\.(?!/?$)', '^\\./'],
            ['\\.css$', '\\.scss$', '\\.less$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'prettier/prettier': 'error',
    },
  },

  {
    files: ['*.{js,mjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    ignores: ['node_modules/**', 'dist/**', '.astro/**', '.vercel/**', 'studio/**'],
  },
])
