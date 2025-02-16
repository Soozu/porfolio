document.addEventListener('DOMContentLoaded', function() {
    // Three.js setup
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create ray-tracing like effect
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    for(let i = 0; i < 5000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
        
        colors.push(
            0.4,
            0.8,
            0.86
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.5
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    
    camera.position.z = 1000;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        points.rotation.x += 0.0003;
        points.rotation.y += 0.0003;
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate();

    // Modal functions
    function openModal(projectCard) {
        const modal = document.getElementById('projectModal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        
        // Get content from the project card
        const title = projectCard.querySelector('h3').textContent;
        const details = projectCard.querySelector('.project-details').innerHTML;
        
        modalTitle.textContent = title;
        modalBody.innerHTML = details;
        
        // Show modal with animation and prevent body scrolling
        document.body.classList.add('modal-open');
        modal.classList.add('show');
    }

    function closeModal() {
        const modal = document.getElementById('projectModal');
        modal.classList.remove('show');
        // Re-enable body scrolling
        document.body.classList.remove('modal-open');
    }

    // Make openModal function globally available
    window.openModal = openModal;

    // Close modal when clicking the close button or outside the modal
    const closeModalBtn = document.querySelector('.close-modal');
    const modalElement = document.getElementById('projectModal');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalElement) {
        modalElement.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Section navigation
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.nav-dot');
    
    // Navigation dot click handler
    navDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Update active dot
            navDots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const currentSection = document.querySelector('section.active');
        const currentIndex = Array.from(sections).indexOf(currentSection);
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % sections.length;
            const nextSectionId = sections[nextIndex].id;
            showSection(nextSectionId);
            navDots[nextIndex].classList.add('active');
            navDots[currentIndex].classList.remove('active');
        }
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
            const prevSectionId = sections[prevIndex].id;
            showSection(prevSectionId);
            navDots[prevIndex].classList.add('active');
            navDots[currentIndex].classList.remove('active');
        }
    });

    function showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionId).classList.add('active');
    }

    // Update navigation click handlers
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            
            // Update active dot
            const dots = document.querySelectorAll('.nav-dot');
            dots.forEach((dot, index) => {
                if(dot.getAttribute('data-section') === sectionId) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    });

    // Check if device is touch-enabled or mobile
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }

    const isSmallScreen = () => {
        return window.innerWidth <= 768;
    }

    // Only initialize custom cursor if not a touch device and not a small screen
    if (!isTouchDevice() && !isSmallScreen()) {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');

        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;

        function moveCustomCursor(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            
            // Add smooth following effect
            requestAnimationFrame(updateFollower);
        }

        function updateFollower() {
            // Calculate smooth following movement
            const deltaX = mouseX - followerX;
            const deltaY = mouseY - followerY;
            
            followerX += deltaX * 0.1;
            followerY += deltaY * 0.1;
            
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            
            if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
                requestAnimationFrame(updateFollower);
            }
        }

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .nav-links a');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('link-hover');
                cursorFollower.classList.add('follower-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('link-hover');
                cursorFollower.classList.remove('follower-hover');
            });
        });

        // Add mouse event listeners
        document.addEventListener('mousemove', moveCustomCursor);
        document.addEventListener('mouseout', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });
        document.addEventListener('mouseover', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    } else {
        // Remove custom cursor elements if on touch device or small screen
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursor) cursor.remove();
        if (cursorFollower) cursorFollower.remove();
    }

    // Add animation delay to each letter
    const h1Spans = document.querySelectorAll('.hero h1 span');
    const h2Spans = document.querySelectorAll('.hero h2 span');
    
    h1Spans.forEach((span, index) => {
        span.style.animationDelay = `${index * 0.1}s`;
    });
    
    h2Spans.forEach((span, index) => {
        span.style.animationDelay = `${index * 0.05}s`;
    });
}); 