export const colors = {
    'light-background': '#FFFFFF', // Pure white for main backgrounds
    'card-background': '#F2F6FA', // Very light gray/blue for card backgrounds
    'primary-blue': '#4D85FF',    // Soft blue accent for primary actions
    'primary-blue-light': '#8DAEFF', // Lighter shade for hover/active if needed
    'secondary-pink': '#FFDDE2', // Pastel pink accent
    'secondary-yellow': '#FFECB3', // Pastel yellow accent
    'secondary-green': '#C8E6C9', // Pastel green accent
    'dark-text': '#333333',       // Dark gray for main text
    'muted-text': '#6B7280',      // Medium gray for subtle text
    'border-light': '#E5E7EB',    // Light gray for borders/separators
    success: '#4CAF50', // Still useful, can adapt slightly
    warning: '#FFC107',
    error: '#F44336',
};

export const typography = {
    fontFamily: {
        sans: ["Inter", "sans-serif"],
    },
    fontSize: {
        'xs': '0.75rem', 'sm': '0.875rem', 'base': '1rem', 'lg': '1.125rem',
        'xl': '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem',
    },
};

export const borderRadius = {
    'none': '0', 'sm': '0.125rem', 'md': '0.375rem', 'lg': '0.5rem',
    'xl': '0.75rem', '2xl': '1rem', '3xl': '1.5rem', 'full': '9999px',
};

export const spacing = {
    'px': '1px', '0': '0', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem', '2': '0.5rem',
    '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem', '4': '1rem', '5': '1.25rem',
};

export const designTokens = {
    colors, typography, borderRadius, spacing,
};