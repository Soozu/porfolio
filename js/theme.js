// Simple theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on system preference
    if (prefersDark) {
        setDarkTheme();
    }

    function setDarkTheme() {
        root.style.setProperty('--bg-color', '#0f172a');
        root.style.setProperty('--text-color', '#e2e8f0');
        root.style.setProperty('--light-gray', '#1e293b');
        root.style.setProperty('--border-color', '#334155');
    }

    function setLightTheme() {
        root.style.setProperty('--bg-color', '#ffffff');
        root.style.setProperty('--text-color', '#1f2937');
        root.style.setProperty('--light-gray', '#f3f4f6');
        root.style.setProperty('--border-color', '#e5e7eb');
    }

    // Optional: Add theme toggle button functionality
    // Uncomment if you want to add a theme toggle button
    /*
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = root.style.getPropertyValue('--bg-color') === '#0f172a';
            if (isDark) {
                setLightTheme();
            } else {
                setDarkTheme();
            }
        });
    }
    */
}); 