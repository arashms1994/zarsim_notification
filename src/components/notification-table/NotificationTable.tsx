import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCRMNotifications } from "@/hooks/useNotifications";
import { columns } from "../ui/Colomns";
import type { INotificationTableProps } from "@/types/type";

export function NotificationTable({ loginName }: INotificationTableProps) {
  const {
    data: crmNotifications = [],
    isLoading: crmIsLoading,
    error: crmError,
  } = useCRMNotifications();

  const filteredNotifications = crmNotifications.filter(
    (notification) => notification.assign === loginName
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: filteredNotifications,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (crmIsLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (crmError) {
    return (
      <div className="text-red-500">
        خطا در بارگذاری داده‌ها: {crmError.message}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Input
        placeholder="جست و جوی عنوان ..."
        value={(table.getColumn("Title")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("Title")?.setFilterValue(event.target.value)
        }
        className="max-w-sm px-2"
        aria-label="جستجوی عنوان اعلان"
      />
      <div className="overflow-hidden rounded-md border my-3">
        <Table>
          <TableHeader className="bg-slate-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  هیچ داده‌ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2 flex items-center justify-center">
          <div
            className={`flex items-center justify-center p-2 rounded-full hover:bg-slate-300 transition-all duration-300 ${
              !table.getCanNextPage() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => table.getCanNextPage() && table.nextPage()}
            role="button"
            aria-label="صفحه بعدی"
          >
            <CircleChevronRight color="black" />
          </div>
          <div
            className={`flex items-center justify-center p-2 rounded-full hover:bg-slate-300 transition-all duration-300 ${
              !table.getCanPreviousPage() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => table.getCanPreviousPage() && table.previousPage()}
            role="button"
            aria-label="صفحه قبلی"
          >
            <CircleChevronLeft color="black" />
          </div>
        </div>
      </div>
    </div>
  );
}
