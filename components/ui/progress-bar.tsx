'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, showPercentage = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800',
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-green-500 transition-all duration-300 ease-out rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
      />
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-300">
          {Math.round(value || 0)}%
        </div>
      )}
    </div>
  )
);
ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
