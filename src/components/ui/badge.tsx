import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium uppercase transition-colors duration-300',
  {
    variants: {
      variant: {
        default: 'bg-canvas-alt text-ink-muted',
        live: 'bg-status-live-bg text-status-live',
        closed: 'bg-status-closed-bg text-status-closed',
        upcoming: 'bg-status-upcoming-bg text-status-upcoming',
      },
      size: {
        sm: 'gap-1 px-2 py-0.5 text-[0.625rem] leading-none tracking-[0.12em]',
        lg: 'gap-1.5 px-3 py-1 text-label tracking-wider',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean;
}

function Badge({ className, variant, size, pulse, children, ...props }: BadgeProps) {
  const pulseDotClassName = size === 'lg' ? 'h-2 w-2' : 'h-1.5 w-1.5';

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {pulse && variant === 'live' && (
        <span className={cn('relative flex', pulseDotClassName)}>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-75" />
          <span className="relative inline-flex h-full w-full rounded-full bg-status-live" />
        </span>
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
