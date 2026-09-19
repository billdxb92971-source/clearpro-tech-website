document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if(menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            
            // Hamburger animation
            const hamburger = document.querySelector('.hamburger');
            if (!isExpanded) {
                hamburger.style.background = 'transparent';
                hamburger.style.setProperty('--before-rotate', '45deg');
                hamburger.style.setProperty('--after-rotate', '-45deg');
            } else {
                hamburger.style.background = 'var(--navy)';
            }
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.querySelector('.hamburger').style.background = 'var(--navy)';
            });
        });
    }

    // Scroll Animations
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // Sticky Header Shrink
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 15px rgba(18, 58, 94, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('https://billdxb.app.n8n.cloud/webhook/clearpro-contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success !== false) {
                    formStatus.textContent = result.message || 'Thank you! Your message has been sent successfully.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                formStatus.innerHTML = 'There was an error sending your message. Please email us directly at <a href="mailto:info@clearprotech.com">info@clearprotech.com</a>.';
                formStatus.classList.add('error');
            } finally {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }
});