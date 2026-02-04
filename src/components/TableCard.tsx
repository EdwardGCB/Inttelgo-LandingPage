import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";

interface TableCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  headerClassName?: string;
  borderClassName?: string;
  className?: string;
}

export function TableCard({
  title,
  description,
  children,
  headerClassName = "bg-gradient-to-b from-gray-500 to-gray-600",
  borderClassName = "border-gray-200",
  className = "",
}: TableCardProps) {
  return (
    <Card
      className={`overflow-hidden ${borderClassName} shadow-lg w-full p-0 ${className}`}
    >
      <CardContent className="p-0 overflow-x-hidden">
        <CardHeader
          className={`${headerClassName} text-white py-3 px-4 sm:px-6`}
        >
          <CardTitle className="text-lg sm:text-xl break-words">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-white/80 text-sm sm:text-base break-words">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        {children}
      </CardContent>
    </Card>
  );
}
