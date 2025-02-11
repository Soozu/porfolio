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

                // Use the full URL based on environment
                const apiUrl = window.location.protocol === 'file:' 
                    ? 'https://portfolio2-api-nine.vercel.app/api/send'  // Your actual Vercel deployment URL
                    : '/api/send';

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': window.location.origin
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    successMessage.classList.add('show');
                    form.reset();
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 3000);
                } else {
                    throw new Error(result.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Failed to send message. Please try again.');
            } finally {
                submitButton.disabled = false;
            }
        });
    }
}); 