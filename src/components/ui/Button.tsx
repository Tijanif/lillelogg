import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const buttonVariants = tv({
    base: 'inline-flex items-center justify-center font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    variants: {
        variant: {
            primary: 'bg-primary-blue text-white hover:bg-primary-blue-light focus:ring-primary-blue',
            'secondary-outline': 'border border-primary-blue text-primary-blue hover:bg-primary-blue/10 focus:ring-primary-blue',
            ghost: 'text-dark-text hover:bg-card-background focus:ring-primary-blue',
        },
        size: {
            sm: 'px-3 py-1.5 text-sm rounded-md',
            md: 'px-4 py-2 text-base rounded-lg',
            lg: 'px-6 py-3 text-lg rounded-xl',
            xl: 'px-8 py-4 text-xl rounded-2xl',
        },
        fullWidth: {
            true: 'w-full',
        },
        focusOffset: {
            light: 'focus:ring-offset-light-background',
            card: 'focus:ring-offset-card-background',
        }
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
        focusOffset: 'light',
    },
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, focusOffset, isLoading, children, ...props }, ref) => {
        return (
            <button
                className={buttonVariants({ variant, size, fullWidth, focusOffset, className })}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    // Simple loading spinner placeholder (can replace with an actual spinner component later)
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                    children
                )}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };