import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/components/ui/utils';

interface GlassSecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const GlassSecondaryButton = forwardRef<HTMLButtonElement, GlassSecondaryButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative px-6 py-3 rounded-[14px]',
          'bg-glass backdrop-blur-xl',
          'border border-border-glass',
          'text-mist-200',
          'transition-all duration-300',
          'hover:bg-glass-strong hover:border-border-neon-ice hover:text-neon-ice-300',
          'active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassSecondaryButton.displayName = 'GlassSecondaryButton';
