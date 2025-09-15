import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpDown,
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
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
// import { ActionsCell } from "../action-colomn/ActionCell";
import type { INotification } from "@/types/type";
import { formatToJalali } from "@/lib/formatToJalali";
import { useNotifications } from "@/hooks/useNotifications";

const columns: ColumnDef<INotification>[] = [
  {
    accessorKey: "Title",
    header: "عنوان",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Title")}</div>
    ),
  },
  {
    accessorKey: "assign",
    header: "مسئول",
    cell: ({ row }) => <div>{row.getValue("assign")}</div>,
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        تاریخ پایان
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{formatToJalali(row.getValue("deadline"))}</div>,
  },
  {
    accessorKey: "massage",
    header: "پیام",
    cell: ({ row }) => <div>{row.getValue("massage") || "بدون پیام"}</div>,
  },
  {
    accessorKey: "From_Date",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        تاریخ شروع
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{formatToJalali(row.getValue("From_Date"))}</div>,
  },
  {
    accessorKey: "Item_URL",
    header: "لینک آیتم",
    cell: ({ row }) => (
      <a
        href={row.getValue("Item_URL")}
        target="_blank"
        rel="noopener noreferrer"
      >
        لینک آیتم
      </a>
    ),
  },
  {
    id: "actions",
    header: "عملیات",
    enableHiding: false,
    cell: ({ row }) => {
      const notification = row.original;
      if (!notification.ID || !notification.Title) {
        return <div className="text-red-500">داده‌های نامعتبر</div>;
      }
      // return <ActionsCell notification={notification} />;
    },
  },
];

export function NotificationTable() {
  const { data: notifications = [], isLoading, error } = useNotifications();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: notifications,
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

  if (isLoading) {
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

  if (error) {
    return (
      <div className="text-red-500">
        خطا در بارگذاری داده‌ها: {error.message}
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
