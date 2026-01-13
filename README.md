# Project Folder Guide

## Project Overview

- React 19 + Vite + TypeScript 기반
- Feature-Sliced Design(FSD) 구조 사용
- 전역 상태: Zustand, 라우팅: React Router
- 스타일: Tailwind v4 + Sass module 병행

## Docs

- 아키텍처 개요: `ARCHITECTURE.md`
- src 레이어 안내: `src/README.md`

프로젝트 내 주요 폴더의 역할과 규칙을 2계층까지 정리했습니다.

---

## Overview

- **정적 리소스**: `public`, `src/assets`, `src/shared/assets`
- **애플리케이션 레이어**: `src/app`, `src/pages`, `src/widgets`, `src/features`, `src/entities`, `src/shared`
- **보조 스크립트**: `scripts`

---

## Workflows

### 정적 이미지 추가/수정

- 이미지는 `src/assets/images` 아래에 추가합니다.
- 추가/이동/이름 변경 후 아래 명령으로 생성 파일을 갱신합니다.

```bash
npm run generate:images
```

- 생성 결과: `src/shared/assets/images/generated.ts`
- 삭제/이름 변경 영향 확인:

```bash
npm run check:images
```

### API/Swagger 스키마 변경

- Swagger 문서가 변경되면 타입/클라이언트를 재생성합니다.

```bash
npm run generate:api
```

- 생성 경로: `src/api`

---

## Folders
## `public`
**역할**
- Vite가 그대로 제공하는 정적 리소스 위치입니다.
- 빌드 시 해시 처리 없이 경로가 유지됩니다.
**규칙**
- HTML에서 직접 참조하는 파일만 둡니다.
- 앱 로직/타입스크립트 코드는 두지 않습니다.
- 파일명 변경 시 참조 경로를 함께 수정합니다.

## `scripts`
**역할**
- 개발/빌드 보조 스크립트를 모아둡니다.
**규칙**
- Node 환경에서 실행되는 스크립트만 둡니다.
- 앱 런타임 코드와 의존성을 섞지 않습니다.
- 동일 입력에 대해 재실행 가능한 형태를 유지합니다.

## `src`
**역할**
- 애플리케이션 소스 코드의 루트입니다.
**규칙**
- Feature-Sliced 구조를 따릅니다.
- 전역 설정은 app 레이어에 둡니다.
- 재사용 요소는 shared로 이동합니다.

### `src/app`
**역할**
- 앱 진입점과 전역 설정이 위치합니다.
- 라우터, 전역 Provider, 전역 스토어를 구성합니다.
**규칙**
- 도메인별 비즈니스 로직은 넣지 않습니다.
- 전역 영향이 있는 설정만 둡니다.

### `src/assets`
**역할**
- 앱 전용 정적 리소스를 둡니다.
**규칙**
- 도메인/화면 전용 리소스를 배치합니다.
- 공용 리소스는 shared/assets로 이동합니다.

### `src/entities`
**역할**
- 도메인 단위의 최소 모델/표현을 둡니다.
- CRUD 중 R 성격의 표시를 담당합니다.
**규칙**
- 순수한 데이터/표현 중심으로 유지합니다.
- 상호작용은 features에서 처리합니다.

### `src/features`
**역할**
- 하나의 기능 단위 UI와 로직을 묶습니다.
- CRUD 중 CUD 성격의 상호작용을 담당합니다.
**규칙**
- 도메인 표현은 entities를 사용합니다.
- 특정 페이지 전용 로직은 pages 내부로 둡니다.

### `src/modules`
**역할**
- 기능 모듈 단위로 분리한 코드 영역입니다.
**규칙**
- 모듈 간 의존은 최소화합니다.
- 사용하지 않는 모듈은 정리합니다.

### `src/pages`
**역할**
- URL 진입 시 렌더링되는 페이지 단위입니다.
**규칙**
- 페이지 구성은 widgets/features를 조합합니다.
- 라우팅 경로는 여기에서만 연결합니다.

### `src/shared`
**역할**
- 비즈니스 로직과 무관한 재사용 요소를 둡니다.
**규칙**
- 도메인 지식에 의존하지 않습니다.
- 여러 레이어에서 공통으로 쓰일 때만 추가합니다.

### `src/widgets`
**역할**
- features와 entities를 조합한 UI 블록입니다.
**규칙**
- 페이지에 재사용 가능한 구성만 둡니다.
- 도메인 로직은 features/entities에 유지합니다.
