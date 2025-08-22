import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function TableContainer({ 
  children, 
  className,
  isLoading,
  emptyState 
}: TableContainerProps) {
  console.log('[TableContainer] Rendering with props:', { isLoading, hasEmptyState: !!emptyState });
  
  return (
    <Card className={cn("relative", className)}>
      <div className="relative overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-full animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : React.Children.count(children) === 0 ? (
          <div className="p-8 text-center">
            {emptyState}
          </div>
        ) : (
          <div className="w-full">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
} 