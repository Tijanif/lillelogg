import React from 'react';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, id, ...props }, ref) => {

        const inputId = id || props.name || `input-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-dark-text text-sm font-medium mb-1">
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}

                    className={`
            w-full px-4 py-3 rounded-xl bg-card-background text-dark-text placeholder-muted-text
            focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent
            ${error ? 'border border-error' : 'border border-transparent'}
            ${className || ''}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-error" role="alert"> {/* role="alert" for accessibility */}
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };