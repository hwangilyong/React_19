import * as React from "react";
import type { ColumnDef, RowData, TableOptions } from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useHistoryState } from "./useHistoryState";
import type { CellCoordinates } from "./useCellSelection";
import { parsePasteData } from "./parsePasteData";
import {Selection} from "./useCellSelection";

/**
 * useDataTable 훅은 테이블 데이터를 관리하고, 편집, 복사-붙여넣기, 히스토리(undo/redo) 기능을 제공합니다.
 * @template TData - 테이블 데이터 타입
 * @template TValue - 컬럼 값 타입
 * @param {UseDataTableProps<TData, TValue>} props - 테이블 옵션 및 데이터 관련 속성
 * @returns 테이블 인스턴스, 붙여넣기 핸들러, undo/redo 기능 등을 포함한 객체
 */
export interface UseDataTableProps<TData extends RowData, TValue>
	extends Omit<TableOptions<TData>, "getCoreRowModel"> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	history?: boolean;
	maxHistorySize?: number;
	createRow?: () => TData;
	autoAddRowsOnPaste?: boolean;
}

export function useDataTable<TData extends Record<string, any>, TValue>({
	columns,
	data: initialData,
	history = false,
	maxHistorySize,
	createRow: createRowProp,
	autoAddRowsOnPaste = true,
	...props
}: UseDataTableProps<TData, TValue>) {
	const [data, setData] = React.useState<TData[]>(initialData);
	const createRow = React.useCallback(() => {
		if (createRowProp) return createRowProp();
		const row: Record<string, any> = {};
		columns.forEach((column) => {
			const columnId =
				typeof column.id === "string"
					? column.id
					: typeof column.accessorKey === "string"
						? column.accessorKey
						: undefined;
			if (columnId) row[columnId] = "";
		});
		return row as TData;
	}, [columns, createRowProp]);

	const { presentState, setPresent, undo, redo, clear, canUndo, canRedo } =
		useHistoryState<TData[]>(initialData, maxHistorySize);

	/**
	 * 테이블 데이터를 설정하는 함수입니다.
	 * 새로운 데이터 배열 또는 이전 데이터를 인자로 받아 업데이트를 수행합니다.
	 * 히스토리 기능이 활성화된 경우 변경 사항을 히스토리에 저장합니다.
	 * @param {TData[] | ((prevData: TData[]) => TData[])} newData - 새 데이터 배열 또는 이전 데이터를 받아 새 데이터를 반환하는 함수
	 */
	const handleSetData = React.useCallback(
		(newData: TData[] | ((prevData: TData[]) => TData[])) => {
			setData(prevData => {
				const updatedData =
					newData instanceof Function ? newData(prevData) : newData;
				if (history) {
					setPresent(updatedData);
				}
				return updatedData;
			});
		},
		[history, setPresent]
	);

	/**
	 * 특정 셀의 데이터를 업데이트하는 함수입니다.
	 * 행 인덱스, 컬럼 아이디, 새 값을 받아 해당 셀의 데이터를 변경합니다.
	 * @param {number} rowIndex - 수정할 행의 인덱스
	 * @param {string} columnId - 수정할 컬럼의 아이디
	 * @param {unknown} value - 새로 설정할 값
	 */
	const updateCellData = React.useCallback(
		(rowIndex: number, columnId: string, value: unknown) => {
			handleSetData(old =>
				old.map((row, index) =>
					index === rowIndex ? { ...row, [columnId]: value } : row
				)
			);
		},
		[handleSetData]
	);

	const updateCellDataBatch = React.useCallback(
		(
			updates: Array<{ rowIndex: number; columnId: string; value: unknown }>
		) => {
			if (updates.length === 0) return;
			handleSetData(old => {
				const next = [...old];
				const clonedRows = new Set<number>();
				updates.forEach(({ rowIndex, columnId, value }) => {
					if (!next[rowIndex]) return;
					const currentValue = (next[rowIndex] as Record<string, unknown>)[columnId];
					if (currentValue === value) return;
					if (!clonedRows.has(rowIndex)) {
						next[rowIndex] = { ...next[rowIndex] };
						clonedRows.add(rowIndex);
					}
					(next[rowIndex] as Record<string, unknown>)[columnId] = value;
				});
				return next;
			});
		},
		[handleSetData]
	);

	const table = useReactTable({
		data: history && presentState ? presentState : data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: { updateCellData, updateCellDataBatch },
		...props
	});

	/**
	 * 테이블 내 선택된 셀 위치에 클립보드 데이터를 붙여넣는 함수입니다.
	 * 붙여넣기 데이터를 파싱하여 해당 위치부터 데이터를 덮어씁니다.
	 * @param {CellCoordinates} selectedCell - 붙여넣기 시작 셀 좌표
	 * @param {string | undefined} clipboardData - 클립보드에서 복사한 문자열 데이터
	 */
	const handleTablePaste = React.useCallback(
		(
			selectedCell: CellCoordinates,
			selectedRange: Selection | null,
			clipboardData: string | undefined
		) => {
			if (!clipboardData) return;

			handleSetData(oldData => {
				const parsedData = parsePasteData(clipboardData);
				const newData = oldData.map(row => ({ ...row }));
				const ensureRow = (index: number) => {
					if (!autoAddRowsOnPaste) return false;
					while (newData.length <= index) {
						newData.push(createRow());
					}
					return true;
				};

				const rows = table.getRowModel().rows;
				const columns = table.getVisibleFlatColumns();
				const startRowIndex = rows.findIndex(
					row => row.id === selectedCell.rowId
				);
				const startColIndex = columns.findIndex(
					col => col.id === selectedCell.columnId
				);

				// ✅ parsedData가 1행이고, 선택된 셀 범위(selectedRange)가 존재하는 경우
				if (
					parsedData.length === 1 &&
					selectedRange?.start &&
					selectedRange?.end
				) {
					const singleRow = parsedData[0];
					const startRowIndex = rows.findIndex(r => r.id === selectedRange.start.rowId);
					const endRowIndex = rows.findIndex(r => r.id === selectedRange.end.rowId);
					const startColIndex = columns.findIndex(c => c.id === selectedRange.start.columnId);
					const endColIndex = columns.findIndex(c => c.id === selectedRange.end.columnId);

					for (let r = startRowIndex; r <= endRowIndex; r++) {
						for (let c = startColIndex; c <= endColIndex; c++) {
							const column = columns[c];
							if (!column || column.columnDef?.meta?.editable === false) continue;

							const columnId = column.id;
							const newValue = singleRow[c - startColIndex] ?? singleRow[0];
							(newData[r] as Record<string, any>)[columnId] = newValue;
						}
					}
				} else {
					parsedData.forEach((row, rowIndex) => {
						const targetRowIndex = startRowIndex + rowIndex;
						if (targetRowIndex < 0) return;
						if (targetRowIndex >= newData.length) {
							if (!ensureRow(targetRowIndex)) return;
						}

						row.forEach((newValue, colIndex) => {
							const targetColIndex = startColIndex + colIndex;
							if (targetColIndex < columns.length) {
								const column = columns[targetColIndex];
								// meta.editable이 false면 붙여넣기 무시
								if (column.columnDef?.meta?.editable === false) return;

								const columnId = column.id;
								if (newData[targetRowIndex][columnId] !== newValue) {
									(newData[targetRowIndex] as Record<string, any>)[columnId] =
										newValue;
								}
							}
						});
					});
				}

				return newData;
			});
		},
		[autoAddRowsOnPaste, createRow, table, handleSetData]
	);

	/**
	 * 초기 데이터가 변경될 때마다 내부 상태를 초기화합니다.
	 */
	React.useEffect(() => {
		setData(initialData);
	}, [initialData]);

	/**
	 * 히스토리 상태가 변경될 때마다 내부 데이터를 최신 히스토리 상태로 동기화합니다.
	 */
	React.useEffect(() => {
		if (history && presentState) {
			setData(presentState);
		}
	}, [presentState, history]);

	return {
		table,
		paste: handleTablePaste,
		undo,
		redo,
		clear,
		canUndo,
		canRedo
	};
}
