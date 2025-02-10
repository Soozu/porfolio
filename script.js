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

    // Create a success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Message sent successfully!';
    document.body.appendChild(successMessage);

    function isValidEmail(email) {
        // Basic email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function isDisposableEmail(email) {
        const disposableDomains = [
            "mailinator.com",
            "10minutemail.com",
            "tempmail.com",
            "guerrillamail.com",
            "yopmail.com",
            // Add more disposable domains as needed
        ];

        const domain = email.split('@')[1];
        return disposableDomains.includes(domain);
    }

    // Create a reference to the email feedback element
    const emailFeedback = document.getElementById('email-feedback');

    // Function to set a cookie
    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }

    // Form submission handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const email = formData.get('email');

            // Validate email
            if (!isValidEmail(email)) {
                emailFeedback.textContent = 'Please enter a valid email address.';
                emailFeedback.classList.remove('valid');
                emailFeedback.classList.add('invalid');
                return;
            }

            if (isDisposableEmail(email)) {
                emailFeedback.textContent = 'Please use a non-disposable email address.';
                emailFeedback.classList.remove('valid');
                emailFeedback.classList.add('invalid');
                return;
            }

            // If valid
            emailFeedback.textContent = 'Valid email address!';
            emailFeedback.classList.remove('invalid');
            emailFeedback.classList.add('valid');

            const data = {
                name: formData.get('name'),
                email: email,
                message: formData.get('message')
            };

            fetch('/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Message sent successfully!') {
                    // Set the IP address in a cookie
                    setCookie('user_ip', data.ip, 7); // Store for 7 days
                    successMessage.classList.add('show');
                    contactForm.reset();
                    emailFeedback.textContent = ''; // Clear feedback
                    // Hide the message after 3 seconds
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 3000);
                } else {
                    alert('Error sending message.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error sending message.');
            });
        });
    }

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

    // Cursor effect
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Add slight delay to follower
        setTimeout(function() {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });
    
    // Add hover effect for interactive elements
    const links = document.querySelectorAll('a, button, .project-card, .skill');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('link-hover');
            cursorFollower.classList.add('follower-hover');
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('link-hover');
            cursorFollower.classList.remove('follower-hover');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
        cursorFollower.style.display = 'block';
    });

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