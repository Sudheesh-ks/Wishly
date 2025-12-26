'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#D42426', // Santa Red
        },
        secondary: {
            main: '#165B33', // Evergreen
        },
        warning: {
            main: '#F8B229', // Gold
        },
        background: {
            default: '#050A18', // Fallback color, gradient handled by global CSS
            paper: 'rgba(255, 255, 255, 0.1)',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    typography: {
        fontFamily: 'var(--font-inter)',
        h1: {
            fontFamily: 'var(--font-mountains)',
        },
        h2: {
            fontFamily: 'var(--font-mountains)',
        },
        h3: {
            fontFamily: 'var(--font-mountains)',
        },
        h4: {
            fontFamily: 'var(--font-mountains)',
        },
        h5: {
            fontFamily: 'var(--font-mountains)',
        },
        h6: {
            fontFamily: 'var(--font-mountains)',
        },
        button: {
            fontFamily: 'var(--font-inter)',
            textTransform: 'none',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    borderRadius: 16,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                },
            },
        },
    },
});

export default theme;
