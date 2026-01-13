# Architecture

이 문서는 프로젝트의 구성, 레이어 구조, 상태/라우팅/스타일링 방식을 정리합니다.

---

## Overview

- React 19 + Vite + TypeScript 기반
- Feature-Sliced Design(FSD) 레이어 구조 사용
- 전역 상태는 Zustand로 관리
- 스타일은 Tailwind v4 유틸리티 + Sass module 병행

---

## Entry Point

- 앱 진입점: `src/main.tsx`
  - 전역 스타일 로드: `src/index.css` -> `src/app/globals.css`
  - React Router 기반 라우팅은 `src/pages/App.tsx`에서 구성

---

## Layered Architecture (FSD)

레이어는 아래 순서대로 의존하며, 상위 레이어가 하위 레이어를 조합합니다.

- `src/app`
  - 앱 진입/전역 설정, 전역 Provider, 전역 스토어
- `src/pages`
  - 라우팅 단위 페이지
- `src/widgets`
  - 페이지에서 재사용 가능한 UI 블록
- `src/features`
  - 기능 단위 UI + 상호작용 로직(CUD)
- `src/entities`
  - 도메인 단위 최소 모델/표현(R)
- `src/shared`
  - 도메인과 무관한 공용 UI/유틸/타입/에셋

각 레이어의 세부 규칙은 해당 폴더의 `README.md`를 참고합니다.

---

## State Management

- 전역 상태: `src/app/store` (Zustand)
- 도메인/기능 단위 상태: `src/features` 또는 `src/entities` 내부로 분리

---

## Routing

- 라우팅 구성: `src/pages/App.tsx`
- 페이지 단위 컴포넌트는 `src/pages/*`에 위치

---

## UI & Styling

- 전역 스타일/토큰: `src/app/globals.css`
  - CSS 변수로 색상 토큰 관리
- 폰트 로드: `src/index.css`
- 스타일링 방식
  - Tailwind v4 유틸리티
  - Sass module (`*.module.scss`) 병행
- 공용 UI 컴포넌트: `src/shared/ui`

---

## Assets & Images

- 앱 전용 리소스: `src/assets`
- 공용 리소스: `src/shared/assets`
- 이미지 생성/검증 워크플로우
  - 생성: `npm run generate:images`
  - 검증: `npm run check:images`
  - 생성 결과: `src/shared/assets/images/generated.ts`

---

## API Types

- Swagger 변경 시 타입 생성 스크립트 사용
  - `npm run generate:api`
  - 출력 경로: `src/api`

---

## Build & Dev

- 개발 서버: `npm run dev`
- 프로덕션 빌드: `npm run build`
- 미리보기: `npm run preview`
