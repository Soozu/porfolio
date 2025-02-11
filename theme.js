document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.checked = currentTheme === 'light';
    
    // Update background particles
    const updateParticles = (theme) => {
        const points = document.querySelector('canvas');
        if (points) {
            const material = points.material;
            if (material) {
                const color = theme === 'light' ? 0x0a192f : 0x64ffda;
                material.color.setHex(color);
                material.needsUpdate = true;
            }
        }
    };

    function switchTheme(e) {
        const theme = e.target.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update background
        document.body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#0a192f';
        
        // Update particles
        updateParticles(theme);
    }

    // Set initial background color
    document.body.style.backgroundColor = currentTheme === 'light' ? '#ffffff' : '#0a192f';
    
    // Initial particles update
    updateParticles(currentTheme);
    
    themeToggle.addEventListener('change', switchTheme);
}); 