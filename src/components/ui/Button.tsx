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

type PossibleRefElement = HTMLButtonElement | HTMLAnchorElement | HTMLElement;

interface ButtonProps extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'ref' | 'type'>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    asChild?: boolean;
}

type ChildWithOptionalRef = React.ReactElement<
    React.HTMLAttributes<HTMLElement> & {
        className?: string;
        ref?: React.Ref<unknown>;
    }
>;

const Button = React.forwardRef<PossibleRefElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            fullWidth,
            focusOffset,
            isLoading,
            asChild,
            children,
            ...props
        },
        ref
    ) => {
        const baseClasses = buttonVariants({
            variant,
            size,
            fullWidth,
            focusOffset,
            className,
        });

        if (asChild) {
            if (React.Children.count(children) !== 1) {
                console.warn('Button with asChild expects exactly one child.');
                return null;
            }

            const child = React.Children.only(children) as ChildWithOptionalRef;

            const mergedClassName = `${baseClasses} ${child.props.className || ''}`.trim();

            return React.cloneElement(child, {
                className: mergedClassName,
                ref: ref as React.Ref<unknown>,
                ...props,
            });
        }

        return (
            <button
                className={baseClasses}
                ref={ref as React.Ref<HTMLButtonElement>}
                disabled={isLoading || props.disabled}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
