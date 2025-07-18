'use client';

import React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

type SegmentedControlProps = React.ComponentProps<typeof ToggleGroup.Root> &{
    type: "single";
    value: string;
    onValueChange: (value: string) => void;
};
type SegmentedControlItemProps = React.ComponentProps<typeof ToggleGroup.Item>;

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
    ({ className, children, type, value, onValueChange, ...props }, ref) => (
        <ToggleGroup.Root
            ref={ref}
            type="single"
            value={value}
            onValueChange={onValueChange}
            className={`grid grid-cols-2 gap-2 p-1 bg-gray-200 rounded-xl ${className}`}
            {...props}
        >
            {children}
        </ToggleGroup.Root>
    )
);
SegmentedControl.displayName = 'SegmentedControl';

const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
    ({ className, children, ...props }, ref) => (
        <ToggleGroup.Item
            ref={ref}
            className={`px-4 py-2 text-center text-sm font-medium rounded-lg 
                  transition-colors duration-200 ease-in-out
                  data-[state=on]:bg-card-background data-[state=on]:text-primary-blue data-[state=on]:shadow-sm
                  text-muted-text hover:bg-white/50
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2
                  ${className}`}
            {...props}
        >
            {children}
        </ToggleGroup.Item>
    )
);
SegmentedControlItem.displayName = 'SegmentedControlItem';

export { SegmentedControl, SegmentedControlItem };