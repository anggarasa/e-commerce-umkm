import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
}

export interface PaginationProps {
    /** Pagination metadata from Laravel */
    meta: PaginationMeta;
    /** Called when page changes */
    onPageChange: (page: number) => void;
    /** Called when per page changes */
    onPerPageChange?: (perPage: number) => void;
    /** Per page options */
    perPageOptions?: number[];
    /** Show per page selector */
    showPerPageSelector?: boolean;
    /** Show page info text */
    showPageInfo?: boolean;
    /** Show first/last page buttons */
    showFirstLastButtons?: boolean;
    /** Additional className */
    className?: string;
    /** Disabled state */
    disabled?: boolean;
}

// ============================================================================
// Pagination Component
// ============================================================================

export function Pagination({
    meta,
    onPageChange,
    onPerPageChange,
    perPageOptions = [10, 25, 50, 100],
    showPerPageSelector = true,
    showPageInfo = true,
    showFirstLastButtons = true,
    className,
    disabled = false,
}: PaginationProps) {
    const { current_page, last_page, per_page, total, from, to } = meta;

    const canGoPrevious = current_page > 1;
    const canGoNext = current_page < last_page;

    // Calculate displayed range
    const displayFrom = from ?? (current_page - 1) * per_page + 1;
    const displayTo = to ?? Math.min(current_page * per_page, total);

    return (
        <div
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
        >
            {/* Left side: Per page selector and page info */}
            <div className="flex flex-wrap items-center gap-4">
                {showPerPageSelector && onPerPageChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Tampilkan
                        </span>
                        <Select
                            value={String(per_page)}
                            onValueChange={(value) =>
                                onPerPageChange(Number(value))
                            }
                            disabled={disabled}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {perPageOptions.map((option) => (
                                    <SelectItem
                                        key={option}
                                        value={String(option)}
                                    >
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                            data
                        </span>
                    </div>
                )}

                {showPageInfo && total > 0 && (
                    <span className="text-sm text-muted-foreground">
                        Menampilkan {displayFrom} - {displayTo} dari {total}{' '}
                        data
                    </span>
                )}
            </div>

            {/* Right side: Pagination buttons */}
            <div className="flex items-center gap-1">
                {showFirstLastButtons && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => onPageChange(1)}
                        disabled={disabled || !canGoPrevious}
                        aria-label="Halaman pertama"
                    >
                        <ChevronsLeft className="size-4" />
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={disabled || !canGoPrevious}
                    aria-label="Halaman sebelumnya"
                >
                    <ChevronLeft className="size-4" />
                </Button>

                {/* Page number buttons */}
                <div className="flex items-center gap-1">
                    {generatePageNumbers(current_page, last_page).map(
                        (page, index) =>
                            page === 'ellipsis' ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="flex size-8 items-center justify-center text-muted-foreground"
                                >
                                    ...
                                </span>
                            ) : (
                                <Button
                                    key={page}
                                    variant={
                                        page === current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="icon"
                                    className="size-8"
                                    onClick={() => onPageChange(page as number)}
                                    disabled={disabled}
                                    aria-label={`Halaman ${page}`}
                                    aria-current={
                                        page === current_page
                                            ? 'page'
                                            : undefined
                                    }
                                >
                                    {page}
                                </Button>
                            ),
                    )}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={disabled || !canGoNext}
                    aria-label="Halaman berikutnya"
                >
                    <ChevronRight className="size-4" />
                </Button>

                {showFirstLastButtons && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => onPageChange(last_page)}
                        disabled={disabled || !canGoNext}
                        aria-label="Halaman terakhir"
                    >
                        <ChevronsRight className="size-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate page numbers with ellipsis for pagination
 * Shows: first page, last page, current page, and 1 page on each side of current
 */
function generatePageNumbers(
    currentPage: number,
    lastPage: number,
): (number | 'ellipsis')[] {
    if (lastPage <= 7) {
        // Show all pages if 7 or fewer
        return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const showEllipsisStart = currentPage > 4;
    const showEllipsisEnd = currentPage < lastPage - 3;

    // Always show first page
    pages.push(1);

    if (showEllipsisStart) {
        pages.push('ellipsis');
    }

    // Calculate range around current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(lastPage - 1, currentPage + 1);

    // Adjust if near start or end
    if (currentPage <= 4) {
        start = 2;
        end = 5;
    } else if (currentPage >= lastPage - 3) {
        start = lastPage - 4;
        end = lastPage - 1;
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (showEllipsisEnd) {
        pages.push('ellipsis');
    }

    // Always show last page
    pages.push(lastPage);

    return pages;
}

// ============================================================================
// Simple Pagination (just prev/next buttons)
// ============================================================================

export interface SimplePaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    className?: string;
    disabled?: boolean;
}

export function SimplePagination({
    currentPage,
    lastPage,
    onPageChange,
    className,
    disabled = false,
}: SimplePaginationProps) {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < lastPage;

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={disabled || !canGoPrevious}
            >
                <ChevronLeft className="mr-1 size-4" />
                Sebelumnya
            </Button>

            <span className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {lastPage}
            </span>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disabled || !canGoNext}
            >
                Selanjutnya
                <ChevronRight className="ml-1 size-4" />
            </Button>
        </div>
    );
}
