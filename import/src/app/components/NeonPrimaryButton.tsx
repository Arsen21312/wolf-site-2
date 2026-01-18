import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/components/ui/utils';

interface NeonPrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const NeonPrimaryButton = forwardRef<HTMLButtonElement, NeonPrimaryButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative px-8 py-3.5 rounded-[14px]',
          'bg-neon-emerald-500 text-forest-950',
          'transition-all duration-300',
          'hover:bg-neon-emerald-400 hover:-translate-y-0.5',
          'active:translate-y-0',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
          'shadow-[0_0_18px_rgba(16,185,129,0.35)]',
          'hover:shadow-[0_0_28px_rgba(16,185,129,0.5)]',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeonPrimaryButton.displayName = 'NeonPrimaryButton';
