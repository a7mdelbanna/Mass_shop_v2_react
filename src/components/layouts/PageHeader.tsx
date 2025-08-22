
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import i18n from '@/i18n';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className
}: PageHeaderProps) {
  return (

    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6", className)}>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-lg">{description}</p>
        )}
      </div>
      {action && (
        <Button onClick={action.onClick} className="shadow-sm self-start">
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
      
    </div>

  );
} 
