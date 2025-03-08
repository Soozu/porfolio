document.addEventListener('DOMContentLoaded', function() {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
        // First visit - play animations
        document.body.classList.add('first-visit');
        localStorage.setItem('hasVisited', 'true');
    } else {
        // Returning visit - no animations
        document.body.classList.add('no-animation');
    }

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - sectionHeight/3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}); 