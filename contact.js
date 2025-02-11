document.addEventListener('DOMContentLoaded', function() {
    // Email validation
    const emailInput = document.getElementById('email');
    const emailFeedback = document.querySelector('.email-feedback');

    if (emailInput && emailFeedback) {
        emailInput.addEventListener('input', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailRegex.test(email)) {
                emailFeedback.textContent = 'Valid email';
                emailFeedback.className = 'email-feedback valid';
            } else {
                emailFeedback.textContent = 'Please enter a valid email';
                emailFeedback.className = 'email-feedback invalid';
            }
        });
    }

    // Form submission
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    if (form && successMessage) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            
            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                // Remove subject if it exists
                delete data.subject;

                // Get the base URL from the current window location
                const baseUrl = window.location.hostname.includes('localhost') || window.location.protocol === 'file:'
                    ? 'https://portfolio2-soozu.vercel.app'  // Your Vercel deployment URL
                    : '';

                const response = await fetch(`${baseUrl}/api/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                successMessage.classList.add('show');
                form.reset();
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 3000);
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to send message. Please try again.');
            } finally {
                submitButton.disabled = false;
            }
        });
    }
}); 