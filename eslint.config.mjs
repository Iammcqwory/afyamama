import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

export default [
  {
    ignores: ['dist/**/*']
  },
  ...compat.extends('plugin:@firebase/security-rules/recommended'),
  {
    files: ['**/*.rules'],
    rules: {
      // Add custom rules or overrides if needed
    }
  }
];
