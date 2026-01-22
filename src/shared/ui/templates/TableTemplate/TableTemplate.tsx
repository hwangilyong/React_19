import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type ReactElement,
    type ReactNode,
    type RefObject,
    type CSSProperties,
} from 'react';
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
import clsx, { type ClassValue } from 'clsx';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { icons } from '@/shared/assets/images';
import styles from './TableTemplate.module.scss';

type RenderHeader<T> = (table: Table<T>) => ReactNode;
type RenderBody<T> = (table: Table<T>) => ReactNode;
type RowClassName<T> = (row: Row<T>) => string | undefined;
type RowClickHandler<T> = (row: Row<T>) => void;
type TableTemplateChildren<T> = (virtualItems: VirtualItem[], rows: Row<T>[]) => ReactElement | ReactElement[];

type VirtualizedBodyProps<T> = {
    rows: Row<T>[];
    bodyClassName?: string;
    scrollableNodeRef: RefObject<HTMLDivElement>;
    children: TableTemplateChildren<T>;
    rowHeight: number;
};

const VirtualizedBody = <T extends object>({
    rows,
    bodyClassName,
    scrollableNodeRef,
    children,
    rowHeight,
}: VirtualizedBodyProps<T>) => {
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollableNodeRef.current,
        estimateSize: () => rowHeight,
        overscan: 6,
    });
    const virtualItems = rowVirtualizer.getVirtualItems();

    return (
        <tbody
            className={clsx(styles.tbody, bodyClassName)}
        >
            {children(virtualItems, rows)}
        </tbody>
    );
};

interface TableTemplateProps<T> {
    columns: ColumnDef<T, unknown>[];
    data: T[];
    className?: ClassValue;
    tableClassName?: ClassValue;
    headerClassName?: ClassValue;
    bodyClassName?: ClassValue;
    wrapperHeight?: number | string;
    rowHeight?: number;
    headerRowHeight?: number;
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
    className = 'h-full',
    tableClassName,
    headerClassName,
    bodyClassName,
    wrapperHeight = '100%',
    rowHeight,
    headerRowHeight,
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
    const [measuredBodyHeight, setMeasuredBodyHeight] = useState<number | null>(null);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    const rows = table.getRowModel().rows;

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

    const bodyRowHeightValue = rowHeight ?? 48;
    const headerRowHeightValue = headerRowHeight ?? bodyRowHeightValue;
    const wrapperHeightValue = resolveSizeValue(wrapperHeight);
    const tableStyle = {
        '--table-row-height': `${bodyRowHeightValue}px`,
        '--table-header-row-height': `${headerRowHeightValue}px`,
        height: wrapperHeightValue,
    } as CSSProperties;
    const headerScrollRef = useRef<HTMLDivElement>(null);
    const headerGroups = table.getHeaderGroups();
    const headerRowsCount = headerGroups.length || 1;
    const headerHeightPx = headerRowsCount * headerRowHeightValue;

    useLayoutEffect(() => {
        const node = scrollableNodeRef.current;
        if (!node) return;
        const update = () => setMeasuredBodyHeight(node.clientHeight);
        update();
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => update());
        observer.observe(node);
        return () => observer.disconnect();
    }, [wrapperHeightValue, headerHeightPx]);

    const bodyHeightValue = (() => {
        if (!wrapperHeightValue) return undefined;
        if (typeof wrapperHeight === 'number') {
            return `${Math.max(0, wrapperHeight - headerHeightPx)}px`;
        }
        return `calc(${wrapperHeightValue} - ${headerHeightPx}px)`;
    })();
    const bodyScrollStyle = bodyHeightValue ? {height: bodyHeightValue} : undefined;
    const emptyBodyHeight = bodyHeightValue;
    const bodyHeightPx =
        typeof wrapperHeight === 'number'
            ? Math.max(0, wrapperHeight - headerHeightPx)
            : measuredBodyHeight ?? 0;
    const fillerHeight =
        rows.length > 0 && bodyHeightPx
            ? Math.max(0, bodyHeightPx - rows.length * bodyRowHeightValue)
            : 0;
    const isRowClickable = rowClickable && !!onRowClick;
    const handleBodyScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        if (!headerScrollRef.current) return;
        headerScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }, []);

    const defaultBody = (rows: Row<T>[]) => (
        <tbody className={clsx(styles.tbody, bodyClassName)}>
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
                        <tr
                            className={clsx(styles.fillerRow, styles.fillerRowBorder)}
                            style={{height: `${fillerHeight}px`}}
                        >
                            <td className={styles.fillerCell} colSpan={table.getAllLeafColumns().length} />
                        </tr>
                    )}
                </>
            )}
        </tbody>
    );

    return (
        <div className={clsx(styles.tableWrapper, className)} style={tableStyle}>
            <div className={styles.headerScroll} ref={headerScrollRef}>
                <table className={clsx(styles.table, styles.headerTable, tableClassName)}>
                    {renderHeader ? renderHeader(table) : defaultHeader(headerGroups)}
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
                                <VirtualizedBody
                                    rows={rows}
                                    bodyClassName={bodyClassName}
                                    scrollableNodeRef={scrollableNodeRef}
                                    rowHeight={bodyRowHeightValue}
                                >
                                    {children}
                                </VirtualizedBody>
                            )
                            : children
                                ? (
                                    <tbody className={clsx(styles.tbody, bodyClassName)}>
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
