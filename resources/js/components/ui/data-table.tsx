import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    InboxIcon,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<TData> {
    /** Unique identifier for the column */
    id: string;
    /** Header text or custom header renderer */
    header: React.ReactNode | ((props: { sortDirection?: SortDirection }) => React.ReactNode);
    /** Cell content - can access the full row data */
    cell: (row: TData, rowIndex: number) => React.ReactNode;
    /** Optional header class name */
    headerClassName?: string;
    /** Optional cell class name */
    cellClassName?: string;
    /** Enable sorting for this column */
    enableSorting?: boolean;
    /** Column width (CSS value) */
    width?: string;
}

export interface DataTableProps<TData> {
    /** Columns definition */
    columns: ColumnDef<TData>[];
    /** Data to display in the table */
    data: TData[];
    /** Loading state */
    isLoading?: boolean;
    /** Number of skeleton rows to show when loading */
    loadingRowsCount?: number;
    /** Empty state configuration */
    emptyState?: {
        icon?: React.ReactNode;
        title: string;
        description?: string;
        action?: React.ReactNode;
    };
    /** Row key extractor */
    getRowKey: (row: TData, index: number) => string | number;
    /** Optional row click handler */
    onRowClick?: (row: TData) => void;
    /** Optional row className or function that returns className */
    rowClassName?: string | ((row: TData, index: number) => string);
    /** Current sort column id */
    sortColumn?: string | null;
    /** Current sort direction */
    sortDirection?: SortDirection;
    /** Sort change handler */
    onSortChange?: (columnId: string, direction: SortDirection) => void;
    /** Additional table className */
    className?: string;
    /** Additional table container className */
    containerClassName?: string;
}

// ============================================================================
// DataTable Component
// ============================================================================

export function DataTable<TData>({
    columns,
    data,
    isLoading = false,
    loadingRowsCount = 5,
    emptyState = {
        title: 'Tidak ada data',
    },
    getRowKey,
    onRowClick,
    rowClassName,
    sortColumn,
    sortDirection,
    onSortChange,
    className,
    containerClassName,
}: DataTableProps<TData>) {
    // Handle sort click
    const handleSortClick = (column: ColumnDef<TData>) => {
        if (!column.enableSorting || !onSortChange) return;

        let newDirection: SortDirection = 'asc';
        if (sortColumn === column.id) {
            if (sortDirection === 'asc') {
                newDirection = 'desc';
            } else if (sortDirection === 'desc') {
                newDirection = null;
            }
        }

        onSortChange(column.id, newDirection);
    };

    // Get sort icon for column
    const getSortIcon = (column: ColumnDef<TData>) => {
        if (!column.enableSorting) return null;

        const isActive = sortColumn === column.id;

        if (!isActive || !sortDirection) {
            return (
                <ChevronsUpDown className="ml-1 size-4 text-muted-foreground/50" />
            );
        }

        return sortDirection === 'asc' ? (
            <ChevronUp className="ml-1 size-4" />
        ) : (
            <ChevronDown className="ml-1 size-4" />
        );
    };

    // Render header content
    const renderHeader = (column: ColumnDef<TData>) => {
        const headerContent =
            typeof column.header === 'function'
                ? column.header({
                      sortDirection:
                          sortColumn === column.id ? sortDirection : null,
                  })
                : column.header;

        if (column.enableSorting) {
            return (
                <button
                    type="button"
                    className="inline-flex items-center hover:text-foreground"
                    onClick={() => handleSortClick(column)}
                >
                    {headerContent}
                    {getSortIcon(column)}
                </button>
            );
        }

        return headerContent;
    };

    // Render loading skeleton rows
    const renderLoadingRows = () => {
        return Array.from({ length: loadingRowsCount }).map((_, rowIndex) => (
            <TableRow key={`loading-${rowIndex}`}>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        className={column.cellClassName}
                    >
                        <Skeleton className="h-4 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    // Render empty state
    const renderEmptyState = () => {
        return (
            <TableRow>
                <TableCell colSpan={columns.length} className="py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        {emptyState.icon || (
                            <InboxIcon className="mb-3 size-12 text-muted-foreground/40" />
                        )}
                        <h3 className="mb-1 text-sm font-medium text-foreground">
                            {emptyState.title}
                        </h3>
                        {emptyState.description && (
                            <p className="mb-4 text-sm text-muted-foreground">
                                {emptyState.description}
                            </p>
                        )}
                        {emptyState.action}
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    // Render data rows
    const renderDataRows = () => {
        return data.map((row, rowIndex) => {
            const computedRowClassName =
                typeof rowClassName === 'function'
                    ? rowClassName(row, rowIndex)
                    : rowClassName;

            return (
                <TableRow
                    key={getRowKey(row, rowIndex)}
                    className={cn(
                        onRowClick && 'cursor-pointer',
                        computedRowClassName,
                    )}
                    onClick={() => onRowClick?.(row)}
                >
                    {columns.map((column) => (
                        <TableCell
                            key={column.id}
                            className={column.cellClassName}
                            style={column.width ? { width: column.width } : undefined}
                        >
                            {column.cell(row, rowIndex)}
                        </TableCell>
                    ))}
                </TableRow>
            );
        });
    };

    return (
        <div className={containerClassName}>
            <Table className={className}>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.id}
                                className={column.headerClassName}
                                style={column.width ? { width: column.width } : undefined}
                            >
                                {renderHeader(column)}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading
                        ? renderLoadingRows()
                        : data.length === 0
                          ? renderEmptyState()
                          : renderDataRows()}
                </TableBody>
            </Table>
        </div>
    );
}

// ============================================================================
// Re-export base table primitives for flexibility
// ============================================================================

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from '@/components/ui/table';
