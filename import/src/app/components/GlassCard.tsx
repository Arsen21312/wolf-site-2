import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/components/ui/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'strong';
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[16px] backdrop-blur-xl',
          'border transition-all duration-300',
          variant === 'default' && 'bg-glass border-border-glass-strong',
          variant === 'strong' && 'bg-glass-strong border-border-glass-strong',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
