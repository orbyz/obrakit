import type {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type TableSize = "sm" | "md" | "lg";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  size?: TableSize;
}

const sizes = {
  sm: {
    table: "text-xs",
    head: "h-10 px-3",
    cell: "px-3 py-2.5",
  },
  md: {
    table: "text-sm",
    head: "h-11 px-4",
    cell: "px-4 py-3.5",
  },
  lg: {
    table: "text-sm",
    head: "h-12 px-5",
    cell: "px-5 py-4",
  },
};

export function Table({
  className,
  children,
  size = "md",
  ...props
}: TableProps) {
  const tableSize = sizes[size];

  return (
    <div className="w-full overflow-x-auto overscroll-x-contain">
      <table
        className={cn(
          "w-full min-w-[640px] caption-bottom border-collapse",
          tableSize.table,
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-b border-border bg-background",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0",
        className,
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-border",
        "transition-colors duration-150",
        "hover:bg-background/70",
        "focus-within:bg-background/70",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  size?: TableSize;
}

export function TableHead({
  className,
  children,
  size = "md",
  ...props
}: TableHeadProps) {
  const tableSize = sizes[size];

  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap align-middle text-left",
        "text-xs font-semibold uppercase tracking-wide text-muted",
        tableSize.head,
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

interface TableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  size?: TableSize;
}

export function TableCell({
  className,
  children,
  size = "md",
  ...props
}: TableCellProps) {
  const tableSize = sizes[size];

  return (
    <td
      className={cn(
        "align-middle text-text",
        tableSize.cell,
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
