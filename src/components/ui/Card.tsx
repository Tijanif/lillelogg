import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={`bg-card-background rounded-2xl shadow-sm p-4 shadow-gray-200/50 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
}