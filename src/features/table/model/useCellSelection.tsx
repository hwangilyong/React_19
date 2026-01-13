import * as React from "react";
import type { Column, Row } from "@tanstack/react-table";

export interface CellCoordinates {
	rowId: string;
	columnId: string;
}

export interface Selection {
	start: CellCoordinates;
	end: CellCoordinates;
}

/**
 * 테이블 내 셀 선택을 관리하는 커스텀 훅입니다.
 * 단일 셀 선택, 범위 선택, 키보드 내비게이션 기능을 처리합니다.
 *
 * @template TData - 각 행의 데이터 타입입니다.
 * @param {Row<TData>[]} rows - 행 객체 배열입니다.
 * @param {Column<TData>[]} columns - 열 객체 배열입니다.
 * @returns 셀 선택 상태와 셀 선택을 위한 핸들러들을 포함하는 객체를 반환합니다.
 */
export function useCellSelection<TData>(
	rows: Row<TData>[],
	columns: Column<TData>[]
) {
	const [selectedCell, setSelectedCell] =
		React.useState<CellCoordinates | null>(null);
	const [selection, setSelection] = React.useState<Selection | null>(null);
	const [isSelecting, setIsSelecting] = React.useState(false);
	const isSelectingRef = React.useRef(false);

	const cellRefs = React.useRef<{
		[key: string]: React.RefObject<HTMLTableCellElement>;
	}>({});

	const columnIndexMap = React.useMemo(() => {
		return columns.reduce((acc: { [key: string]: number }, column, index) => {
			acc[column.id] = index;
			return acc;
		}, {});
	}, [columns]);

	const rowIndexMap = React.useMemo(() => {
		return rows.reduce((acc: { [key: string]: number }, row, index) => {
			acc[row.id] = index;
			return acc;
		}, {});
	}, [rows]);

	/**
	 * 특정 셀(rowId, columnId)에 대한 ref 객체를 반환합니다.
	 * 해당 ref가 없으면 새로 생성합니다.
	 *
	 * @param {string} rowId - 행의 ID입니다.
	 * @param {string} columnId - 열의 ID입니다.
	 * @returns {React.RefObject<HTMLTableCellElement>} 해당 셀의 ref 객체입니다.
	 */
	const getCellRef = (rowId: string, columnId: string) => {
		const key = `${rowId}-${columnId}`;
		if (!cellRefs.current[key]) {
			cellRefs.current[key] = React.createRef();
		}
		return cellRefs.current[key];
	};

	/**
	 * 특정 셀이 현재 선택된 셀인지 여부를 판단합니다.
	 *
	 * @param {string} cellRowId - 셀의 행 ID입니다.
	 * @param {string} cellColumnId - 셀의 열 ID입니다.
	 * @returns {boolean} 셀이 선택되어 있으면 true, 아니면 false를 반환합니다.
	 */
	const isCellSelected = React.useCallback(
		(cellRowId: string, cellColumnId: string) => {
			return (
				selectedCell &&
				selectedCell.rowId === cellRowId &&
				selectedCell.columnId === cellColumnId
			);
		},
		[selectedCell]
	);

	/**
	 * 특정 셀이 현재 선택 범위(selection)에 포함되는지 여부를 판단합니다.
	 *
	 * @param {string} cellRowId - 셀의 행 ID입니다.
	 * @param {string} cellColumnId - 셀의 열 ID입니다.
	 * @returns {boolean} 셀이 선택 범위 내에 있으면 true, 아니면 false를 반환합니다.
	 */
	const isCellInRange = React.useCallback(
		(cellRowId: string, cellColumnId: string) => {
			if (!selection) return false;

			const rowIndex = rowIndexMap[cellRowId];
			const columnIndex = columnIndexMap[cellColumnId];

			const startRowIndex = rowIndexMap[selection.start.rowId];
			const startColumnIndex = columnIndexMap[selection.start.columnId];
			const endRowIndex = rowIndexMap[selection.end.rowId];
			const endColumnIndex = columnIndexMap[selection.end.columnId];

			const isRowInRange =
				rowIndex >= Math.min(startRowIndex, endRowIndex) &&
				rowIndex <= Math.max(startRowIndex, endRowIndex);
			const isColumnInRange =
				columnIndex >= Math.min(startColumnIndex, endColumnIndex) &&
				columnIndex <= Math.max(startColumnIndex, endColumnIndex);

			return isRowInRange && isColumnInRange;
		},
		[selection, columnIndexMap, rowIndexMap]
	);

	/**
	 * 테이블 셀 내에서 키보드 방향키를 이용한 내비게이션을 처리합니다.
	 * Shift 키를 누른 상태에서는 범위 선택이 가능합니다.
	 *
	 * @param {React.KeyboardEvent<HTMLDivElement>} e - 키보드 이벤트 객체입니다.
	 * @param {string} rowId - 현재 셀의 행 ID입니다.
	 * @param {string} columnId - 현재 셀의 열 ID입니다.
	 */
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLElement>,
		rowId: string,
		columnId: string
	) => {
		const { key } = e;

		if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
			e.preventDefault();

			const edgeRowId = selection ? selection.end.rowId : rowId;
			const edgeColumnId = selection ? selection.end.columnId : columnId;

			const rowIndex = rows.findIndex((r) => r.id === edgeRowId);
			const columnIndex = columns.findIndex((c) => c.id === edgeColumnId);

			let nextRowId = edgeRowId;
			let nextColumnId = edgeColumnId;

			switch (key) {
				case "ArrowUp":
					if (rowIndex > 0) {
						nextRowId = rows[rowIndex - 1].id;
					}
					break;
				case "ArrowDown":
					if (rowIndex < rows.length - 1) {
						nextRowId = rows[rowIndex + 1].id;
					}
					break;
				case "ArrowLeft":
					if (columnIndex > 0) {
						nextColumnId = columns[columnIndex - 1].id;
					}
					break;
				case "ArrowRight":
					if (columnIndex < columns.length - 1) {
						nextColumnId = columns[columnIndex + 1].id;
					}
					break;
				default:
					return;
			}

			const nextSelectedCell = { rowId: nextRowId, columnId: nextColumnId };

			if (e.shiftKey && selectedCell) {
				setSelection((prev) => {
					const start = prev?.start || selectedCell;
					return { start, end: nextSelectedCell };
				});
			} else {
				if (!e.shiftKey) {
					setSelectedCell(nextSelectedCell);
					setSelection({
						start: nextSelectedCell,
						end: nextSelectedCell,
					});
				}
			}
		}
	};

	/**
	 * 셀에서 마우스 다운 이벤트를 처리하여 선택을 시작합니다.
	 *
	 * @param {string} rowId - 마우스 다운이 발생한 행의 ID입니다.
	 * @param {string} columnId - 마우스 다운이 발생한 열의 ID입니다.
	 */
	const handleMouseDown = React.useCallback(
		(rowId: string, columnId: string) => {
			setSelectedCell({ rowId, columnId });
			setSelection({
				start: { rowId, columnId },
				end: { rowId, columnId },
			});
			setIsSelecting(true);
			isSelectingRef.current = true;
		},
		[]
	);

	/**
	 * 셀에서 마우스 엔터 이벤트를 처리하여 선택 범위를 업데이트합니다.
	 * 현재 선택 중(isSelecting)일 때만 동작합니다.
	 *
	 * @param {string} rowId - 마우스가 진입한 행의 ID입니다.
	 * @param {string} columnId - 마우스가 진입한 열의 ID입니다.
	 */
	const handleMouseEnter = React.useCallback(
		(rowId: string, columnId: string) => {
			if (isSelectingRef.current) {
				setSelection((prev) => {
					if (!prev) return null;
					return {
						start: prev.start,
						end: { rowId, columnId },
					};
				});
			}
		},
		[]
	);

	/**
	 * 마우스 업 이벤트를 처리하여 선택 상태를 종료합니다.
	 */
	const handleMouseUp = React.useCallback(() => {
		setIsSelecting(false);
		isSelectingRef.current = false;
	}, []);

	/**
	 * 셀 클릭 이벤트를 처리하여 해당 셀을 선택 상태로 설정합니다.
	 *
	 * @param {string} rowId - 클릭된 행의 ID입니다.
	 * @param {string} columnId - 클릭된 열의 ID입니다.
	 */
	const handleClick = React.useCallback((rowId: string, columnId: string) => {
		setSelectedCell({
			rowId,
			columnId,
		});
	}, []);

	React.useEffect(() => {
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseUp]);

	React.useLayoutEffect(() => {
		if (selectedCell) {
			const { rowId, columnId } = selectedCell;
			const key = `${rowId}-${columnId}`;
			const cellRef = cellRefs.current[key];
			if (cellRef && cellRef.current) {
				cellRef.current.focus();
			}
		}
	}, [selectedCell]);

	return {
		selectedCell,
		selection,
		getCellRef,
		isCellSelected,
		isCellInRange,
		handleClick,
		handleKeyDown,
		handleMouseDown,
		handleMouseEnter,
	};
}
