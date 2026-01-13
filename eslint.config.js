import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // 빌드 결과물은 린트 대상에서 제외합니다.
  globalIgnores(['dist']),
  {
    // TypeScript/TSX 파일만 검사합니다.
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 기본 JS 규칙은 필요 시 활성화합니다.
      // js.configs.recommended,
      // TypeScript 권장 규칙
      tseslint.configs.recommended,
      // React Hooks 규칙
      reactHooks.configs.flat.recommended,
      // Vite + React Refresh 환경 규칙
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // ECMAScript 문법 버전
      ecmaVersion: 2020,
      // 브라우저 전역 변수 사용 허용
      globals: globals.browser,
    },
    rules: {
      // React 컴포넌트는 컴포넌트만 export 하도록 경고합니다.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // 기본 JS no-unused-vars는 TS 규칙과 충돌하므로 끕니다.
      'no-unused-vars': 'true',

      // TypeScript에서 사용하지 않는 변수/인자를 검출합니다.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
      ],

      // 빈 블록문에 대한 경고 설정
      'no-empty': 'warn',

      // 세미콜론(;) 사용 강제
      semi: ['warn', 'always'],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
])
