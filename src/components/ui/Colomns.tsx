import type { INotification } from "@/types/type";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "./button";
import { ArrowUpDown } from "lucide-react";
import { formatToJalali } from "@/lib/formatToJalali";

export const columns: ColumnDef<INotification>[] = [
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