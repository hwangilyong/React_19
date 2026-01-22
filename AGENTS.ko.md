# 작업 지침 (읽기용 한국어 번역)

## 1) 컴포넌트 우선 확인
- UI 작업 전 `src/shared/ui`에 동일/유사 컴포넌트가 있는지 먼저 확인한다.
- 기존 컴포넌트가 있으면 재사용을 우선한다.
- 새 공용 컴포넌트가 필요하면 기존 패턴을 따라 `src/shared/ui`에 추가한다.

## 2) 색상 사용 규칙
- **RGB/Hex 직접 입력 금지.**
- `src/app/globals.css`와 `tailwind.config.js`에 정의된 `--mws-*` 토큰만 사용한다.
- 필요한 색상이 없으면:
  1) `globals.css`에 `--mws-*` 토큰 추가 (라이트/다크 모두)
  2) `tailwind.config.js`에 동일 토큰 등록
  3) 코드에서 해당 토큰으로 사용

## 3) Figma MCP 이미지 저장
- Figma MCP로 추출한 이미지는 **`src/assets/images/`에 저장**한다.
- 코드에서는 저장된 경로를 직접 참조한다.

## 4) 작업 전 체크리스트
- `src/shared/ui`에서 기존 컴포넌트 확인했는가?
- 모든 색상이 `--mws-*` 토큰으로만 되어 있는가?
- 색상을 추가했다면 라이트/다크 모두 반영했는가?
- Figma 에셋을 `src/assets/images/`에 저장했는가?
