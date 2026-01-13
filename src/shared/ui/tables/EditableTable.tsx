import * as React from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import clsx from "clsx";
import styles from "@/shared/ui/templates/TableTemplate/TableTemplate.module.scss";
import {
	flexRender,
	type Column,
	type HeaderGroup,
	type RowData,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { parseCopyData } from "@/features/table/model/parseCopyData";
import {
	useCellSelection,
	type CellCoordinates,
} from "@/features/table/model/useCellSelection";
import {
	type UseDataTableProps,
	useDataTable,
} from "@/features/table/model/useDataTable";

type EditableTableProps<TData extends RowData, TValue> = UseDataTableProps<
	TData,
	TValue
> & {
	className?: string;
	tableClassName?: string;
	headerClassName?: string;
	bodyClassName?: string;
	bodyHeight?: number | string;
	autoAddRowsOnPaste?: boolean;
};

function EditableTable<TData extends RowData, TValue>({
	columns,
	data,
	className,
	tableClassName,
	headerClassName,
	bodyClassName,
	bodyHeight,
	autoAddRowsOnPaste,
	history,
	maxHistorySize,
	createRow,
	...tableOptions
}: EditableTableProps<TData, TValue>) {
	const { table, paste, undo, redo, canUndo, canRedo } = useDataTable<
		TData,
		TValue
	>({
		columns,
		data,
		history,
		maxHistorySize,
		createRow,
		autoAddRowsOnPaste,
		...tableOptions,
	});
	const rows = table.getRowModel().rows;
	const visibleColumns = table.getVisibleFlatColumns();
	const headerScrollRef = React.useRef<HTMLDivElement>(null);
	const scrollableNodeRef = React.useRef<HTMLDivElement>(null);
	const [editingCell, setEditingCell] = React.useState<CellCoordinates | null>(
		null
	);
	const editingInputRef = React.useRef<HTMLInputElement | null>(null);
	const baselineRef = React.useRef<TData[]>(data);
	const skipBlurCommitRef = React.useRef(false);
	const {
		selectedCell,
		selection,
		getCellRef,
		isCellSelected,
		isCellInRange,
		handleKeyDown,
		handleMouseDown,
		handleMouseEnter,
	} = useCellSelection(rows, visibleColumns);

	const defaultHeader = (headerGroups: HeaderGroup<TData>[]) => (
		<thead className={clsx(styles.thead, headerClassName)}>
			{headerGroups.map((headerGroup) => (
				<tr key={headerGroup.id} className={styles.headerRow}>
					{headerGroup.headers.map((header) => (
						<th
							key={header.id}
							className={styles.headerCell}
							style={{ width: header.getSize() || undefined }}
						>
							{header.isPlaceholder
								? null
								: flexRender(
										header.column.columnDef.header,
										header.getContext()
									)}
						</th>
					))}
				</tr>
			))}
		</thead>
	);

	const getDisplayValue = (value: unknown) => {
		if (typeof value === "object" && value !== null && "display" in value) {
			return (value as { display?: string }).display ?? "";
		}
		return value ?? "";
	};

	const getBaselineValue = React.useCallback(
		(rowIndex: number, column: Column<TData>) => {
			const baselineRow = baselineRef.current[rowIndex];
			if (!baselineRow) return undefined;
			const accessorKey = column.columnDef.accessorKey;
			if (typeof accessorKey === "string") {
				return (baselineRow as Record<string, unknown>)[accessorKey];
			}
			if (column.columnDef.accessorFn) {
				return column.columnDef.accessorFn(baselineRow, rowIndex);
			}
			return (baselineRow as Record<string, unknown>)[column.id];
		},
		[table]
	);

	const isCellChanged = React.useCallback(
		(rowIndex: number, column: Column<TData>, currentValue: unknown) => {
			const baselineValue = getBaselineValue(rowIndex, column);
			const normalizedCurrent = getDisplayValue(currentValue) ?? "";
			const normalizedBaseline = getDisplayValue(baselineValue) ?? "";
			return String(normalizedCurrent) !== String(normalizedBaseline);
		},
		[getBaselineValue]
	);

	const focusCell = React.useCallback(
		(rowId: string, columnId: string) => {
			const cellRef = getCellRef(rowId, columnId);
			requestAnimationFrame(() => {
				cellRef.current?.focus();
			});
		},
		[getCellRef]
	);

	const handleCommitEdit = React.useCallback(
		(rowIndex: number, columnId: string, nextValue: string) => {
			const row = table.getRowModel().rows[rowIndex];
			if (row) {
				const currentValue = row.getValue(columnId);
				const normalize = (value: unknown) =>
					value === null || value === undefined ? "" : String(value);
				if (normalize(currentValue) === normalize(nextValue)) {
					return;
				}
			}
			const updateCellData = table.options.meta?.updateCellData;
			if (typeof updateCellData === "function") {
				updateCellData(rowIndex, columnId, nextValue);
			}
		},
		[table]
	);

	const finalizeEdit = React.useCallback(
		(rowIndex: number, columnId: string, nextValue: string) => {
			handleCommitEdit(rowIndex, columnId, nextValue);
			setEditingCell(null);
			focusCell(String(rowIndex), columnId);
		},
		[handleCommitEdit, focusCell]
	);

	const handleDoubleClick = React.useCallback(
		(rowId: string, columnId: string) => {
			const column = visibleColumns.find((col) => col.id === columnId);
			if (column?.columnDef?.meta?.editable === false) return;
			setEditingCell({ rowId, columnId });
		},
		[visibleColumns]
	);

	const handleEnterToEdit = React.useCallback(
		(
			event: React.KeyboardEvent<HTMLElement>,
			rowId: string,
			columnId: string
		) => {
			if (event.key !== "Enter") return false;
			if (editingCell) return true;
			const column = visibleColumns.find((col) => col.id === columnId);
			if (column?.columnDef?.meta?.editable === false) return true;
			setEditingCell({ rowId, columnId });
			return true;
		},
		[editingCell, visibleColumns]
	);

	const handleCopy = React.useCallback(
		(event: React.ClipboardEvent<HTMLDivElement>) => {
			if (editingCell) return;
			if (!selection) return;
			const text = parseCopyData(selection, rows, visibleColumns);
			event.clipboardData.setData("text/plain", text);
			event.preventDefault();
		},
		[editingCell, selection, rows, visibleColumns]
	);

	const handlePaste = React.useCallback(
		(event: React.ClipboardEvent<HTMLDivElement>) => {
			if (editingCell) return;
			if (!selectedCell) return;
			const text = event.clipboardData.getData("text/plain");
			if (!text) return;
			const range =
				selection ?? { start: selectedCell, end: selectedCell };
			paste(selectedCell, range, text);
			event.preventDefault();
		},
		[editingCell, selectedCell, selection, paste]
	);

	const handleBodyScroll = React.useCallback(
		(event: React.UIEvent<HTMLDivElement>) => {
			if (!headerScrollRef.current) return;
			headerScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
		},
		[]
	);

	const resolveSizeValue = (value?: number | string) => {
		if (value === undefined) return undefined;
		return typeof value === "number" ? `${value}px` : value;
	};

	const bodyHeightValue = resolveSizeValue(bodyHeight);
	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => scrollableNodeRef.current,
		estimateSize: () => 48,
		overscan: 6,
	});
	const virtualItems = rowVirtualizer.getVirtualItems();
	const totalSize = rowVirtualizer.getTotalSize();
	const paddingTop = virtualItems.length ? virtualItems[0].start : 0;
	const paddingBottom = virtualItems.length
		? totalSize - virtualItems[virtualItems.length - 1].end
		: 0;

	React.useEffect(() => {
		if (!editingCell) return;
		if (editingInputRef.current) {
			editingInputRef.current.focus();
			editingInputRef.current.select();
		}
	}, [editingCell]);

	React.useEffect(() => {
		baselineRef.current = data;
	}, [data]);

	const handleDeleteKey = React.useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			if (event.key !== "Delete" && event.key !== "Backspace") return false;
			const target = event.target as HTMLElement | null;
			if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
				return false;
			}
			if (target?.isContentEditable) return false;
			const activeSelection =
				selection ??
				(selectedCell ? { start: selectedCell, end: selectedCell } : null);
			if (!activeSelection) return false;
			event.preventDefault();

			const columns = table.getVisibleFlatColumns();
			const rows = table.getRowModel().rows;
			const startRowIndex = rows.findIndex(
				(row) => row.id === activeSelection.start.rowId
			);
			const endRowIndex = rows.findIndex(
				(row) => row.id === activeSelection.end.rowId
			);
			const startColIndex = columns.findIndex(
				(col) => col.id === activeSelection.start.columnId
			);
			const endColIndex = columns.findIndex(
				(col) => col.id === activeSelection.end.columnId
			);
			if (
				startRowIndex === -1 ||
				endRowIndex === -1 ||
				startColIndex === -1 ||
				endColIndex === -1
			) {
				return true;
			}

			const rowMin = Math.min(startRowIndex, endRowIndex);
			const rowMax = Math.max(startRowIndex, endRowIndex);
			const colMin = Math.min(startColIndex, endColIndex);
			const colMax = Math.max(startColIndex, endColIndex);

			for (let r = rowMin; r <= rowMax; r += 1) {
				for (let c = colMin; c <= colMax; c += 1) {
					const column = columns[c];
					if (!column || column.columnDef?.meta?.editable === false) continue;
					handleCommitEdit(r, column.id, "");
				}
			}
			return true;
		},
		[handleCommitEdit, selection, selectedCell, table]
	);

	const handleHistoryKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (editingCell) return;
			if (handleDeleteKey(event)) return;
			const target = event.target as HTMLElement | null;
			if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
				return;
			}
			if (target?.isContentEditable) return;

			const isCommand = event.ctrlKey || event.metaKey;
			if (!isCommand || event.key.toLowerCase() !== "z") return;

			event.preventDefault();
			if (event.shiftKey) {
				if (canRedo) redo();
				return;
			}
			if (canUndo) undo();
		},
		[canRedo, canUndo, editingCell, handleDeleteKey, redo, undo]
	);

	return (
		<div
			className={clsx(styles.tableWrapper, className)}
			onCopy={handleCopy}
			onPaste={handlePaste}
			onKeyDown={handleHistoryKeyDown}
		>
			<div className={styles.headerScroll} ref={headerScrollRef}>
				<table className={clsx(styles.table, styles.headerTable, tableClassName)}>
					{defaultHeader(table.getHeaderGroups())}
				</table>
			</div>
			<SimpleBar
				className={styles.bodyScroll}
				scrollableNodeProps={{
					ref: scrollableNodeRef,
					onScroll: handleBodyScroll,
				}}
				style={bodyHeightValue ? { height: bodyHeightValue } : undefined}
			>
				<table className={clsx(styles.table, styles.bodyTable, tableClassName)}>
					<tbody className={clsx(styles.tbody, bodyClassName)}>
						{paddingTop > 0 && (
							<tr className={styles.fillerRow} style={{ height: `${paddingTop}px` }}>
								<td
									className={styles.fillerCell}
									colSpan={visibleColumns.length}
								/>
							</tr>
						)}
						{virtualItems.map((virtualRow) => {
							const row = rows[virtualRow.index];
							if (!row) return null;
							return (
								<tr
									key={row.id}
									className={styles.row}
									style={{ height: `${virtualRow.size}px` }}
								>
									{row.getVisibleCells().map((cell) => {
									const isEditing =
										editingCell?.rowId === row.id &&
										editingCell?.columnId === cell.column.id;
									const cellValue = getDisplayValue(cell.getValue());
									const titleValue =
										typeof cellValue === "string" || typeof cellValue === "number"
											? String(cellValue)
											: undefined;
									const isChanged = isCellChanged(
										row.index,
										cell.column,
										cell.getValue()
									);
									const metaClassName = (() => {
										const meta = cell.column.columnDef
											.meta as
											| { cellClassName?: string | ((row: typeof row) => string) }
											| undefined;
										if (!meta?.cellClassName) return undefined;
										return typeof meta.cellClassName === "function"
											? meta.cellClassName(row)
											: meta.cellClassName;
									})();
									const isSelected = isCellSelected(row.id, cell.column.id);
									const isInRange = isCellInRange(row.id, cell.column.id);
									return (
										<td
											key={cell.id}
											ref={getCellRef(row.id, cell.column.id)}
											className={clsx(
												styles.cell,
												metaClassName,
												isChanged && styles.cellChanged,
												isSelected && styles.cellSelected,
												!isSelected && isInRange && styles.cellInRange
											)}
											title={!isEditing ? titleValue : undefined}
											style={{ width: cell.column.getSize() || undefined }}
											tabIndex={0}
											onMouseDown={() => handleMouseDown(row.id, cell.column.id)}
											onMouseEnter={() =>
												handleMouseEnter(row.id, cell.column.id)
											}
											onKeyDown={(event) => {
												if (handleDeleteKey(event)) return;
												if (handleEnterToEdit(event, row.id, cell.column.id)) {
													event.preventDefault();
													return;
												}
												handleKeyDown(event, row.id, cell.column.id);
											}}
											onDoubleClick={() =>
												handleDoubleClick(row.id, cell.column.id)
											}
										>
											{isEditing ? (
												<input
													className={clsx(
														styles.cellInput,
														'h-full'
													)}
													ref={editingInputRef}
													defaultValue={String(cellValue)}
													autoFocus
													onBlur={(event) => {
														if (skipBlurCommitRef.current) {
															skipBlurCommitRef.current = false;
															return;
														}
														finalizeEdit(
															row.index,
															cell.column.id,
															event.target.value
														);
													}}
													onKeyDown={(event) => {
														if (event.key === "Enter") {
															skipBlurCommitRef.current = true;
															finalizeEdit(
																row.index,
																cell.column.id,
																(event.target as HTMLInputElement).value
															);
														}
														if (event.key === "Escape") {
															skipBlurCommitRef.current = true;
															setEditingCell(null);
														}
													}}
												/>
											) : (
												flexRender(cell.column.columnDef.cell, cell.getContext())
											)}
										</td>
									);
								})}
								</tr>
							);
						})}
						{paddingBottom > 0 && (
							<tr
								className={styles.fillerRow}
								style={{ height: `${paddingBottom}px` }}
							>
								<td
									className={styles.fillerCell}
									colSpan={visibleColumns.length}
								/>
							</tr>
						)}
					</tbody>
				</table>
			</SimpleBar>
		</div>
	);
}

export default EditableTable;
