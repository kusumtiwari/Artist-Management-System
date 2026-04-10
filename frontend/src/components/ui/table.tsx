import * as React from "react";
import { cn } from "../../utils/cn";
import Pagination from "./pagination";
import { Skeleton } from "./skeleton";

const Table = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    containerClassname?: string;
  }
>(({ className, containerClassname, ...props }, ref) => (
  <div
    ref={ref}
    style={{ overflowAnchor: "none" }}
    className={cn(
      "border h-[400px] border-border rounded-md relative w-full shadow-sm overflow-auto scrollbar-thin",
      containerClassname,
    )}
  >
    <table
      className={cn(
        "min-w-max w-full caption-bottom text-sm scrollbar-thin",
        className,
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("sticky top-0 z-[1]  text-text-default", className)}
    style={{ background: "var(--bg-secondary)" }}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 [&_tr]:bg-background text-text-default-secondary", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { clickable?: boolean }
>(({ className, clickable, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-soft",
      clickable && "cursor-pointer hover:bg-secondary",
      className,
    )}
    {...props}
    onClick={clickable ? props.onClick : undefined}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left min-w-[180px] whitespace-nowrap text-default-secondary text-14 font-semibold",
        className,
      )}
      {...props}
    />
  );
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 text-14 text-default align-middle min-w-[180px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

const TablePaginationRow = ({
  className,
  total,
  pageSize = 10,
  page,
  onPageChange,
  isLoading = false,
  totalColumns,
}: {
  className?: string;
  total: number;
  pageSize?: number;
  page: number;
  isLoading?: boolean;
  totalColumns: number;
  onPageChange: (page: number) => void;
}) => {
  // hide pagination if table is loading or only 1 page
  if (isLoading || total <= pageSize) return null;

  return (
    <TableFooter>
      <TableRow className={cn("bg-background", className)}>
        <TableCell colSpan={totalColumns}>
          <div className="flex justify-center">
            <Pagination
              currentPage={page}
              pageCount={Math.ceil(total / pageSize)}
              onPageChange={onPageChange}
            />
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

const TableSkeleton = ({ col, row = 10 }: { col: number; row?: number }) => {
  return new Array(row).fill(null).map((_, i) => (
    <TableRow key={i} className="border-0">
      <TableRowSkeleton col={col} />
    </TableRow>
  ));
};

const TableRowSkeleton = ({ col }: { col: number }) => {
  return new Array(col).fill(null).map((_, i) => (
    <TableCell className="min-w-0" key={i}>
      <Skeleton className="w-full h-3.5 rounded-3" />
    </TableCell>
  ));
};

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TablePaginationRow,
  TableRow,
  TableRowSkeleton,
  TableSkeleton,
};
