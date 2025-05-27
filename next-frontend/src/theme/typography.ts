export const typography = {

    // Heading variants
    h1: {
        fontSize: '2.25rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        '@media (min-width:600px)': {
            fontSize: '2.75rem',
        },
        '@media (min-width:900px)': {
            fontSize: '3.5rem',
        },
        '@media (min-width:1200px)': {
            fontSize: '4rem',
        },
    },
    h2: {
        fontSize: '1.875rem',
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: '-0.015em',
        '@media (min-width:600px)': {
            fontSize: '2.25rem',
        },
        '@media (min-width:900px)': {
            fontSize: '3rem',
        },
    },
    h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        '&.gradient-color-heading': {
            background: 'linear-gradient(45deg, var(--mui-palette-primary-main), var(--mui-palette-secondary-main))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        '@media (min-width:600px)': {
            fontSize: '1.75rem',
        },
        '@media (min-width:900px)': {
            fontSize: '2.25rem',
        },
    },
    h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.35,
        letterSpacing: '-0.005em',
        '@media (min-width:600px)': {
            fontSize: '1.5rem',
        },
        '@media (min-width:900px)': {
            fontSize: '1.75rem',
        },
    },
    h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
        '@media (min-width:600px)': {
            fontSize: '1.25rem',
        },
        '@media (min-width:900px)': {
            fontSize: '1.5rem',
        },
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.45,
        '@media (min-width:600px)': {
            fontSize: '1.125rem',
        },
    },
    
    // Subtitle variants
    subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        '@media (min-width:600px)': {
            fontSize: '1.125rem',
        },
    },
    subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
        '@media (min-width:600px)': {
            fontSize: '1rem',
        },
    },
    
    // Body text variants
    body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
    },
    body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
    },
    
    // Small text variants
    caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.4,
    },
    overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1.2,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
    },
    
    // Button text
    button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1.2,
        textTransform: 'none' as const,
        letterSpacing: '0.25px',
        color: 'inherit',
        '@media (min-width:600px)': {
            fontSize: '1rem',
        },
    },
};
