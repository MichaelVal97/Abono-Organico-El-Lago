'use client';

import { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeContext } from '@/context/ThemeProvider';

export default function ThemeToggle() {
    // Using useContext directly to avoid the hook throwing if context is not found.
    // The try-catch block around a hook call is an invalid use of hooks.
    const context = useContext(ThemeContext);

    // If the context is not available (e.g., ThemeProvider is not in the tree),
    // context will be undefined (or the default value passed to createContext).
    if (!context) {
        return null;
    }

    const { theme, toggleTheme } = context;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
}
