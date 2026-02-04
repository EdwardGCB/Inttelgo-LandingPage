import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ReactNode } from "react";

export type PaymentAccordionItem<T> = {
  id: string | number;
  data: T;
  getSummary: (data: T) => {
    title: string | ReactNode;
    subtitle?: string;
    primaryValue?: string;
    secondaryValue?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    hasWarning?: boolean;
  };
  getDetails: (data: T) => {
    leftColumn: Array<{ label: string; value: ReactNode }>;
    rightColumn: Array<{ label: string; value: ReactNode }>;
  };
};

interface PaymentAccordionProps<T> {
  title: string;
  subtitle?: string;
  totalAmount: number;
  formatCurrency: (value: number) => string;
  items: PaymentAccordionItem<T>[];
  headerClassName?: string;
  borderClassName?: string;
  accentColor?: "blue" | "orange";
  className?: string;
  onItemClick?: (item: T, index: number) => void;
  actionButton?: (item: T, index: number) => ReactNode;
  enableSelection?: boolean;
  selectedItems?: Set<string | number>;
  onSelectionChange?: (itemId: string | number, checked: boolean) => void;
}

export function PaymentAccordion<T>({
  title,
  subtitle,
  totalAmount,
  formatCurrency,
  items,
  headerClassName,
  borderClassName = "border-gray-200",
  accentColor = "blue",
  className = "",
  onItemClick,
  actionButton,
  enableSelection = false,
  selectedItems = new Set(),
  onSelectionChange,
}: PaymentAccordionProps<T>) {
  const colorClasses = {
    blue: {
      header: "bg-gradient-to-b from-blue-500 to-blue-600",
      border: "border-blue-100",
      hover: "hover:bg-blue-50/50",
      content: "bg-blue-50/30",
      primary: "text-blue-700",
      secondary: "text-blue-900",
      headerText: "text-blue-100",
    },
    orange: {
      header: "bg-gradient-to-b from-[#ff9900] to-[#ec5406]",
      border: "border-orange-100",
      hover: "hover:bg-orange-50/50",
      content: "bg-orange-50/30",
      primary: "text-orange-700",
      secondary: "text-orange-900",
      headerText: "text-orange-100",
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <Card
      className={`${borderClassName} shadow-lg w-full overflow-hidden p-0 ${className}`}
    >
      <CardContent className="p-0">
        <PageHeader
          className={`${headerClassName || colors.header
            } text-white py-4 sm:py-6 px-4 sm:px-6`}
          iconClassName=""
          titleClassName="text-lg sm:text-xl font-bold text-white"
          subtitleClassName={`${colors.headerText} text-xs sm:text-sm`}
          title={
            <div className="flex items-center justify-between flex-wrap gap-2 w-full">
              <div>
                <div>{title}</div>
                {subtitle && (
                  <p className={`${colors.headerText} text-xs mt-1`}>
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-sm ${colors.headerText}`}>Total:</p>
                <p className="font-bold text-white text-base sm:text-lg">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          }
          subtitle={undefined}
        />
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => {
            const summary = item.getSummary(item.data);
            const details = item.getDetails(item.data);

            return (
              <AccordionItem
                key={item.id}
                value={`item-${item.id}`}
                className={`border-b ${colors.border} last:border-b-0 ${summary.hasWarning ? "bg-amber-50/50 border-amber-200" : ""
                  }`}
              >
                <AccordionTrigger
                  className={`px-4 sm:px-6 py-4 hover:no-underline ${colors.hover
                    } transition-colors ${summary.hasWarning
                      ? "bg-amber-50/50 hover:bg-amber-100/50"
                      : ""
                    }`}
                  onClick={() => onItemClick?.(item.data, index)}
                >
                  <div className="flex items-center justify-between w-full pr-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      {enableSelection && (
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            onSelectionChange?.(item.id, e.target.checked);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border border-black/40 text-[#ff6400] focus:ring-[#ff6400] cursor-pointer flex-shrink-0"
                          aria-label={`Seleccionar cuenta ${item.id}`}
                        />
                      )}
                      <div className="min-w-0">
                        <div
                          className={`font-semibold ${colors.secondary} text-sm sm:text-base break-words`}
                        >
                          {summary.title}
                        </div>
                        {summary.subtitle && (
                          <p className="text-xs text-gray-600 mt-1">
                            {summary.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {summary.primaryValue && (
                        <div className="text-right hidden sm:block">
                          {summary.primaryLabel && (
                            <p className="text-xs text-gray-600">
                              {summary.primaryLabel}
                            </p>
                          )}
                          <p
                            className={`text-base font-bold ${colors.primary}`}
                          >
                            {summary.primaryValue}
                          </p>
                        </div>
                      )}
                      {summary.secondaryValue && (
                        <div className="text-right">
                          {summary.secondaryLabel && (
                            <p className="text-xs text-gray-600">
                              {summary.secondaryLabel}
                            </p>
                          )}
                          <p
                            className={`text-base font-semibold ${colors.secondary}`}
                          >
                            {summary.secondaryValue}
                          </p>
                        </div>
                      )}
                      {actionButton && actionButton(item.data, index)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent
                  className={`px-4 sm:px-6 pb-4 ${colors.content}`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-3">
                      {details.leftColumn.map((detail, idx) => (
                        <div key={idx}>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                            {detail.label}
                          </p>
                          <div className="text-sm text-gray-900 break-words">
                            {detail.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {details.rightColumn.map((detail, idx) => (
                        <div key={idx}>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                            {detail.label}
                          </p>
                          <div
                            className={`text-sm sm:text-lg font-bold ${colors.primary} break-words`}
                          >
                            {detail.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
