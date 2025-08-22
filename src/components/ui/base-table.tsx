import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
  dir?: 'rtl' | 'ltr';
}

export interface BaseTableProps<T> {
  data: T[] | null;
  columns: TableColumn<T>[];
  isLoading: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyState?: React.ReactNode;
  getItemId: (item: T) => string | number;
  className?: 'table align-middle table-row-dashed fs-6 gy-5 dataTable';
}

export function formatDate(date: string, time: string) {
  if (!date || !time) return 'N/A';
  return `${date} ${time}`;
}

export function BaseTable<T>({
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
  emptyState,
  getItemId,
  className
}: BaseTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "h-12 px-6 text-left align-middle font-semibold text-gray-700 bg-gray-50/80",
                    column.className, 
                    column.key === 'actions' && 'text-right'
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                {columns.map((column) => (
                  <TableCell key={column.key} className="h-16 px-6">
                    <Skeleton className={cn(
                      "h-4 w-full bg-gray-200 rounded",
                      column.key === 'actions' && "h-8 w-24"
                    )} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return emptyState || (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-dashed border-gray-300 shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <i className="ki-duotone ki-file-deleted fs-2x text-gray-400">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No items found</h3>
        <p className="text-gray-500 text-sm">There are no items to display at the moment.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <Table className={className}>
        <TableHeader>
          <TableRow className="border-b border-gray-100 bg-gray-50/80">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "h-12 px-6 text-left align-middle font-semibold text-gray-700",
                  column.className, 
                  column.key === 'actions' && 'text-right'
                )}
              >
                <div className={cn(column.key === 'actions' && 'w-full text-right pr-4')}>
                  {column.header}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow 
              key={getItemId(item)} 
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200 group"
            >
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={cn(
                    "h-16 px-6 align-middle",
                    column.className, 
                    column.key === 'actions' && 'text-right'
                  )}
                  dir={column.dir}
                >
                  {column.key === 'actions' && onEdit && onDelete ? (
                    <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 transition-colors"
                        >
                        <i className="ki-duotone ki-pencil fs-4">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(item)}
                        className="h-8 w-8 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        <i className="ki-duotone ki-trash fs-4">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                          <span className="path4"></span>
                          <span className="path5"></span>
                        </i>
                      </Button>
                    </div>
                  ) : (
                    column.cell(item)
                  )}
                </TableCell>
              ))}
            </TableRow>
          )) || []}
        </TableBody>
      </Table>
    </div>
  );
} 