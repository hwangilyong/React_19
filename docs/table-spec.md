# Table Spec (TableTemplate / EditableTable)

## Goal
- TableTemplate/EditableTable 재구성 기준과 구현 체크리스트를 제공한다.
- 레이아웃, 스타일, 가상화, 편집/선택 기능의 책임을 명확히 분리한다.

## Scope
- TableTemplate: 레이아웃/스크롤/헤더/빈 상태/가상화 컨테이너
- EditableTable: 편집/선택/클립보드/히스토리

## TableTemplate

### Responsibilities
- wrapper 높이를 기준으로 header/body 영역을 계산한다.
- 테이블 구조와 스크롤 영역만 제공한다.
- 데이터 렌더링은 호출부(또는 children)에서 제어한다.

### Props
- `columns: ColumnDef<T, unknown>[]`
- `data: T[]`
- `wrapperHeight: number | string`
- `rowHeight?: number` (body row height)
- `headerRowHeight?: number` (header row height)
- `className?: ClassValue`
- `tableClassName?: ClassValue`
- `headerClassName?: ClassValue`
- `bodyClassName?: ClassValue`
- `emptyIconSrc?: string`
- `emptyIconAlt?: string`
- `emptyText?: string`
- `renderHeader?: (table) => ReactNode`
- `renderBody?: (table) => ReactNode`
- `rowClassName?: (row) => string | undefined`
- `onRowClick?: (row) => void`
- `rowClickable?: boolean`
- `children?: ReactNode | (virtualItems, rows) => ReactElement | ReactElement[]`

### Layout Rules
- `tbodyHeight = wrapperHeight - headerHeight`
- `headerHeight = headerRowCount * headerRowHeight`
- wrapperHeight가 %일 때는 실제 body 높이를 `ResizeObserver`로 측정해 filler 계산에 사용한다.

### Virtualization
- children이 함수일 때만 virtualizer 사용.
- rowHeight는 virtualizer `estimateSize` 기준으로 사용.

### Empty State
- rows가 0일 때 empty row를 렌더.
- empty 높이는 계산된 bodyHeight 기준.

## EditableTable

### Responsibilities
- 셀 편집, 선택 범위, 복사/붙여넣기, 히스토리(undo/redo) 처리.
- TableTemplate과 동일한 스타일 규약/높이 계산 규칙 유지.

### Props
- `columns`, `data`, `wrapperHeight`, `rowHeight`, `headerRowHeight`
- `history?: boolean`, `maxHistorySize?: number`, `createRow?: () => TData`
- `autoAddRowsOnPaste?: boolean`
- `className`, `tableClassName`, `headerClassName`, `bodyClassName`

### Editing
- 더블 클릭 또는 Enter로 편집 진입.
- ESC로 편집 취소, Enter/Blur로 커밋.
- 셀 변경 여부는 baseline 스냅샷과 비교.

### Selection
- 마우스 드래그 선택 지원.
- Delete/Backspace는 선택 범위 일괄 삭제.
- 대량 업데이트는 batch 업데이트 메타 사용.

## Data Model
- `updateCellData(rowIndex, columnId, value)`
- `updateCellDataBatch([{ rowIndex, columnId, value }])`

## Styling
- CSS 변수 사용:
  - `--table-row-height`
  - `--table-header-row-height`
- 마지막 row 보더는 유지하고, 빈 공간은 filler row에 top border로 표시.

## Accessibility
- 셀 포커스 가능(tabIndex)
- 키보드 이동/선택 지원

## Testing Checklist
- wrapperHeight px/% 모두 정상 계산
- empty 상태 렌더
- 편집/붙여넣기/undo
- 대량 삭제 성능
- 마지막 row 보더/Wrapper 보더 시각 확인
