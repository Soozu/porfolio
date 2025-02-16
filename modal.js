// Modal Controller
const ModalController = {
    modal: null,
    modalTitle: null,
    modalBody: null,
    modalLink: null,
    shareMenu: null,
    currentProject: null,
    isOpen: false,

    init() {
        // Cache DOM elements
        this.modal = document.getElementById('projectModal');
        this.modalTitle = this.modal.querySelector('.modal-title');
        this.modalTechStack = this.modal.querySelector('.modal-tech-stack');
        this.projectPreview = this.modal.querySelector('.project-preview');
        this.projectInfo = this.modal.querySelector('.project-info');
        this.modalLink = this.modal.querySelector('.project-link');
        this.shareMenu = this.modal.querySelector('.share-menu');
        
        // Bind event listeners
        this.bindEvents();
    },

    bindEvents() {
        // Close button click
        const closeBtn = this.modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });

        // Share button
        const shareBtn = this.modal.querySelector('.share-btn');
        shareBtn.addEventListener('click', () => this.toggleShareMenu());

        // Close share menu
        const closeShareBtn = this.shareMenu.querySelector('.close-share');
        closeShareBtn.addEventListener('click', () => this.toggleShareMenu(false));

        // Share buttons
        this.shareMenu.querySelectorAll('.share-button').forEach(btn => {
            btn.addEventListener('click', () => this.shareProject(btn.dataset.platform));
        });

        // Copy link button
        const copyLinkBtn = this.shareMenu.querySelector('.copy-link');
        copyLinkBtn.addEventListener('click', () => this.copyProjectLink());

        // Click outside modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Prevent modal content clicks from closing
        this.modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Enhanced mobile touch handling
        let touchStartY = 0;
        let touchStartX = 0;
        let isSwiping = false;
        let modalContent = this.modal.querySelector('.modal-content');
        let lastTouchY = 0;
        let isScrollingPossible = false;

        this.modal.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStartY = touch.clientY;
            touchStartX = touch.clientX;
            lastTouchY = touch.clientY;
            isSwiping = false;

            // Check if we're at the top of the content
            isScrollingPossible = modalContent.scrollTop > 0;

            // Only allow swipe on header or if at top of content
            const isHeader = e.target.closest('.modal-header');
            if (isHeader || modalContent.scrollTop <= 0) {
                modalContent.style.transition = 'none';
            }
        }, { passive: true });

        this.modal.addEventListener('touchmove', (e) => {
            if (!touchStartY) return;

            const touch = e.touches[0];
            const currentY = touch.clientY;
            const deltaY = currentY - touchStartY;
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const touchDeltaY = currentY - lastTouchY;

            // Store last touch position
            lastTouchY = currentY;

            // If we're scrolling the content and not at the top, let the default scroll happen
            if (isScrollingPossible && touchDeltaY < 0) {
                return;
            }

            // Check if we can start swiping
            const canSwipe = (modalContent.scrollTop <= 0 && deltaY > 0) || isSwiping;

            // Determine if gesture is more vertical than horizontal
            if (deltaY > 5 && deltaY > deltaX && canSwipe) {
                // Only prevent default if we're actually swiping to close
                if (!isScrollingPossible) {
                    e.preventDefault();
                }
                
                isSwiping = true;
                
                const opacity = Math.max(0, 1 - (deltaY / window.innerHeight));
                const transform = `translateY(${deltaY}px)`;
                
                modalContent.style.transform = transform;
                this.modal.style.background = `rgba(10, 25, 47, ${opacity * 0.95})`;
            }
        }, { passive: false });

        this.modal.addEventListener('touchend', (e) => {
            if (!isSwiping) return;

            const touch = e.changedTouches[0];
            const deltaY = touch.clientY - touchStartY;
            modalContent.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

            if (deltaY > 100) {
                this.close();
            } else {
                modalContent.style.transform = '';
                this.modal.style.background = '';
            }

            touchStartY = 0;
            isSwiping = false;
            isScrollingPossible = false;
        }, { passive: true });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.shareMenu.classList.contains('active')) {
                    this.toggleShareMenu(false);
                } else if (this.isOpen) {
                    this.close();
                }
            }
        });
    },

    open(projectCard) {
        if (this.isOpen) return;

        this.currentProject = projectCard;
        
        // Clear previous content
        this.clearContent();

        // Get new content
        const title = projectCard.querySelector('h3').textContent;
        const details = projectCard.querySelector('.project-details').cloneNode(true);
        const link = projectCard.querySelector('.project-link').href;
        const techStack = projectCard.querySelector('.tech-stack').cloneNode(true);

        // Set new content
        this.modalTitle.textContent = title;
        this.modalTechStack.appendChild(techStack);
        
        // Handle project icon
        const icon = details.querySelector('.project-icon');
        if (icon) {
            const iconClone = icon.cloneNode(true);
            this.projectPreview.querySelector('.project-icon').replaceWith(iconClone);
            icon.remove(); // Remove the original icon from details
        }
        
        // Add remaining content to info section
        this.projectInfo.appendChild(details);
        details.style.display = 'block';
        
        this.modalLink.href = link;

        // Show modal with animation
        document.body.style.overflow = 'hidden';
        this.modal.style.display = 'block';
        
        // Force reflow and add animations
        this.modal.offsetHeight;
        requestAnimationFrame(() => {
            this.modal.classList.add('show');
            this.isOpen = true;
            
            // Animate content elements
            const elements = this.modal.querySelectorAll('.modal-header, .project-preview, .project-info, .modal-footer');
            elements.forEach((el, index) => {
                el.style.animation = `slideIn 0.5s ease forwards ${index * 0.1}s`;
            });
        });
    },

    close() {
        if (!this.isOpen) return;

        // Close share menu if open
        if (this.shareMenu.classList.contains('active')) {
            this.toggleShareMenu(false);
        }

        this.modal.classList.remove('show');
        document.body.style.overflow = '';
        this.isOpen = false;

        setTimeout(() => {
            if (!this.isOpen) {
                this.modal.style.display = 'none';
                this.clearContent();
            }
        }, 300);
    },

    clearContent() {
        this.modalTitle.textContent = '';
        this.modalTechStack.innerHTML = '';
        this.projectPreview.innerHTML = '<div class="project-icon"></div>';
        this.projectInfo.innerHTML = '';
    },

    toggleShareMenu(show = true) {
        if (show) {
            this.shareMenu.classList.add('active');
        } else {
            this.shareMenu.classList.remove('active');
        }
    },

    shareProject(platform) {
        const projectTitle = this.modalTitle.textContent;
        const projectUrl = this.modalLink.href;
        const text = `Check out this awesome project: ${projectTitle}`;

        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(projectUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`,
            github: projectUrl
        };

        window.open(urls[platform], '_blank');
        this.toggleShareMenu(false);
    },

    copyProjectLink() {
        const link = this.modalLink.href;
        navigator.clipboard.writeText(link).then(() => {
            // Show success message
            const copyBtn = this.shareMenu.querySelector('.copy-link');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    }
};

// Initialize modal controller
document.addEventListener('DOMContentLoaded', () => {
    ModalController.init();
    // Make openModal function globally available
    window.openModal = (projectCard) => ModalController.open(projectCard);
}); 