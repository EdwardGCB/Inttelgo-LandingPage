import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface TableCalculateRow {
  label: string;
  value: string | number | ReactNode;
}

const tableVariants = {
  orange: {
    headerBorder: "border-orange-200",
    rowBorder: "border-orange-100",
    rowHover: "hover:bg-orange-50/30",
    valueText: "text-orange-700",
    totalBorder: "border-orange-300",
    totalValue: "text-orange-700",
  },
  blue: {
    headerBorder: "border-blue-200",
    rowBorder: "border-blue-100",
    rowHover: "hover:bg-blue-50/30",
    valueText: "text-blue-700",
    totalBorder: "border-blue-300",
    totalValue: "text-blue-700",
  },
  default: {
    headerBorder: "border-gray-200",
    rowBorder: "border-gray-100",
    rowHover: "hover:bg-gray-50/50",
    valueText: "text-gray-900",
    totalBorder: "border-gray-300",
    totalValue: "text-gray-900",
  },
} as const;

export type TableCalculateVariant = keyof typeof tableVariants;

interface TableCalculateProps {
  /** Filas: cada una tiene label (concepto) y value (valor en COP o texto) */
  rows: TableCalculateRow[];
  /** Variante de color de la tabla: orange, blue o default */
  variant?: TableCalculateVariant;
  /** Si true, la última fila se resalta como total (borde superior, negrita). Por defecto true */
  lastRowIsTotal?: boolean;
  /** Texto de la cabecera de la columna de concepto. Por defecto "Valor" */
  headerLabel?: string;
  /** Texto de la cabecera de la columna de valor (ej. "COP"). Por defecto "COP" */
  headerValue?: string;
  className?: string;
  /** Clases para la columna de valores (ej. color, alineación). Se combina con el color del variant */
  valueColumnClassName?: string;
  /** Clases para la fila de total. Se combina con el color del variant */
  totalRowClassName?: string;
}

export function TableCalculate({
  rows,
  variant = "orange",
  lastRowIsTotal = true,
  headerLabel = "Valor",
  headerValue = "COP",
  className,
  valueColumnClassName,
  totalRowClassName,
}: TableCalculateProps) {
  if (rows.length === 0) return null;

  const colors = tableVariants[variant];
  const bodyRows = lastRowIsTotal ? rows.slice(0, -1) : rows;
  const totalRow = lastRowIsTotal && rows.length > 0 ? rows[rows.length - 1] : null;

  return (
    <div className={cn("w-full overflow-hidden rounded-md border", colors.headerBorder, className)}>
      <Table className="w-full">
        <TableHeader>
          <TableRow className={cn("border-b hover:bg-transparent", colors.headerBorder)}>
            <TableHead className="py-2 pr-4 font-medium text-gray-600">
              {headerLabel}
            </TableHead>
            <TableHead className="text-right font-medium text-gray-600">
              {headerValue}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bodyRows.map((row, index) => (
            <TableRow
              key={index}
              className={cn("border-b", colors.rowBorder, colors.rowHover)}
            >
              <TableCell className="py-2 text-gray-900">{row.label}</TableCell>
              <TableCell className={cn("text-right font-semibold", colors.valueText, valueColumnClassName)}>
                {row.value}
              </TableCell>
            </TableRow>
          ))}
          {totalRow && (
            <TableRow className={cn("hover:bg-transparent border-t-2 font-semibold", colors.totalBorder, totalRowClassName)}>
              <TableCell className="py-2 text-gray-900">{totalRow.label}</TableCell>
              <TableCell className={cn("text-right", colors.totalValue, valueColumnClassName)}>
                {totalRow.value}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
