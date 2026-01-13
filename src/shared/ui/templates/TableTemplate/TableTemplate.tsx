import {useCallback, useRef, type ReactElement, type ReactNode} from 'react';
import {
    flexRender,
    getCoreRowModel,
    type HeaderGroup,
    type Row,
    type Table,
    type ColumnDef,
    useReactTable,
} from '@tanstack/react-table';
import {useVirtualizer, type VirtualItem} from '@tanstack/react-virtual';
import clsx from 'clsx';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { icons } from '@/shared/assets/images';
import styles from './TableTemplate.module.scss';

type RenderHeader<T> = (table: Table<T>) => ReactNode;
type RenderBody<T> = (table: Table<T>) => ReactNode;
type RowClassName<T> = (row: Row<T>) => string | undefined;
type RowClickHandler<T> = (row: Row<T>) => void;
type TableTemplateChildren<T> = (virtualItems: VirtualItem[], rows: Row<T>[]) => ReactElement | ReactElement[];

interface TableTemplateProps<T> {
    columns: ColumnDef<T, unknown>[];
    data: T[];
    className?: string;
    tableClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    tbodyHeight?: number | string;
    bodyMinHeight?: number | string;
    emptyIconSrc?: string;
    emptyIconAlt?: string;
    emptyText?: string;
    renderHeader?: RenderHeader<T>;
    renderBody?: RenderBody<T>;
    rowClassName?: RowClassName<T>;
    onRowClick?: RowClickHandler<T>;
    rowClickable?: boolean;
    children?: ReactNode | TableTemplateChildren<T>;
}

const TableTemplate = <T extends object>({
    columns,
    data,
    className,
    tableClassName,
    headerClassName,
    bodyClassName,
    tbodyHeight,
    bodyMinHeight,
    emptyIconSrc = icons.empty.emptyState,
    emptyIconAlt = '',
    emptyText = '데이터가 없습니다.',
    renderHeader,
    renderBody,
    rowClassName,
    onRowClick,
    rowClickable = true,
    children,
}: TableTemplateProps<T>) => {
    const scrollableNodeRef = useRef<HTMLDivElement>(null);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    const rows = table.getRowModel().rows;
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollableNodeRef.current,
        estimateSize: () => 48,
        overscan: 6,
    });
    const virtualItems = rowVirtualizer.getVirtualItems();

    const defaultHeader = (headerGroups: HeaderGroup<T>[]) => (
        <thead className={clsx(styles.thead, headerClassName)}>
            {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} className={styles.headerRow}>
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            className={styles.headerCell}
                            style={{width: header.getSize() || undefined}}
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );

    const resolveSizeValue = (value?: number | string) => {
        if (value === undefined) return undefined;
        return typeof value === 'number' ? `${value}px` : value;
    };

    const bodyHeightValue = resolveSizeValue(tbodyHeight);
    const bodyMinHeightValue = resolveSizeValue(bodyMinHeight);
    const rowHeight = 48;
    const headerScrollRef = useRef<HTMLDivElement>(null);
    const bodyScrollStyle = bodyHeightValue
        ? {height: bodyHeightValue}
        : bodyMinHeightValue
            ? {minHeight: bodyMinHeightValue}
            : undefined;
    const emptyBodyHeight = bodyHeightValue ?? bodyMinHeightValue;
    const fillerHeight =
        typeof tbodyHeight === 'number' && rows.length > 0
            ? Math.max(0, tbodyHeight - rows.length * rowHeight)
            : 0;
    const isRowClickable = rowClickable && !!onRowClick;
    const handleBodyScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        if (!headerScrollRef.current) return;
        headerScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }, []);

    const defaultBody = (rows: Row<T>[]) => (
        <tbody
            className={clsx(styles.tbody, bodyClassName)}
            style={bodyMinHeight ? {minHeight: bodyMinHeight} : undefined}
        >
            {rows.length === 0 ? (
                <tr className={styles.emptyRow}>
                    <td
                        className={styles.emptyCell}
                        colSpan={table.getAllLeafColumns().length}
                        style={emptyBodyHeight ? {height: emptyBodyHeight} : undefined}
                    >
                        <div className={styles.emptyContent}>
                            {emptyIconSrc && (
                                <img alt={emptyIconAlt} className={styles.emptyIcon} src={emptyIconSrc} />
                            )}
                            <span className={styles.emptyText}>{emptyText}</span>
                        </div>
                    </td>
                </tr>
            ) : (
                <>
                    {rows.map((row) => (
                        <tr
                            key={row.id}
                            className={clsx(
                                styles.row,
                                isRowClickable && styles.rowClickable,
                                rowClassName?.(row)
                            )}
                            onClick={isRowClickable ? () => onRowClick(row) : undefined}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className={styles.cell}
                                    style={{width: cell.column.getSize() || undefined}}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {fillerHeight > 0 && (
                        <tr className={styles.fillerRow} style={{height: `${fillerHeight}px`}}>
                            <td className={styles.fillerCell} colSpan={table.getAllLeafColumns().length} />
                        </tr>
                    )}
                </>
            )}
        </tbody>
    );

    return (
        <div className={clsx(styles.tableWrapper, className)}>
            <div className={styles.headerScroll} ref={headerScrollRef}>
                <table className={clsx(styles.table, styles.headerTable, tableClassName)}>
                    {renderHeader ? renderHeader(table) : defaultHeader(table.getHeaderGroups())}
                </table>
            </div>
            <SimpleBar
                className={styles.bodyScroll}
                scrollableNodeProps={{ref: scrollableNodeRef, onScroll: handleBodyScroll}}
                style={bodyScrollStyle}
            >
                <table className={clsx(styles.table, styles.bodyTable, tableClassName)}>
                    {renderBody
                        ? renderBody(table)
                        : typeof children === 'function'
                            ? (
                                <tbody
                                    className={clsx(styles.tbody, bodyClassName)}
                                    style={bodyMinHeight ? {minHeight: bodyMinHeight} : undefined}
                                >
                                    {children(virtualItems, rows)}
                                </tbody>
                            )
                            : children
                                ? (
                                    <tbody
                                        className={clsx(styles.tbody, bodyClassName)}
                                        style={bodyMinHeight ? {minHeight: bodyMinHeight} : undefined}
                                    >
                                        {children}
                                    </tbody>
                                )
                                : defaultBody(rows)}
                </table>
            </SimpleBar>
        </div>
    );
};

export default TableTemplate;
