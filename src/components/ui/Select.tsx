import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, className, id, ...props }, ref) => {
        const selectId = id || props.name || `select-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={selectId} className="block text-dark-text text-sm font-medium mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        id={selectId}
                        ref={ref}
                        className={`
                            w-full px-4 py-3 rounded-xl bg-card-background text-dark-text
                            border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-blue
                            appearance-none pr-8 cursor-pointer
                            ${error ? 'border-error' : ''}
                            ${className || ''}
                        `}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-text">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                {error && (
                    <p className="mt-1 text-sm text-error" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Select.displayName = 'Select';

export { Select };