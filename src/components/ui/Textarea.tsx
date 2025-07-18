import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, name, error, ...props }, ref) => {
        const errorClasses = error ? 'border-error focus-visible:ring-error' : 'border-border-light focus-visible:ring-primary-blue';

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={name} className="block text-sm font-medium text-dark-text mb-1">
                        {label}
                    </label>
                )}
                <textarea
                    id={name}
                    name={name}
                    ref={ref}
                    className={`
            block w-full min-h-[80px] rounded-xl border bg-card-background px-3 py-2 text-sm 
            text-dark-text placeholder:text-muted-text
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50
            ${errorClasses} ${className}
          `}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-error">{error}</p>}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };