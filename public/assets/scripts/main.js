/**
 * StorePulse Landing Page Interactions
 * VanguardTech - Sprint 1
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Collapsible mobile menu (hamburger)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('open');
        });

        // Close menu when clicking a navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('open');
            });
        });
    }

    // 2. Interactive FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isAlreadyActive = item.classList.contains('active');

            // Close other open accordion items
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));

            // Toggle the selected item
            if (!isAlreadyActive) {
                item.classList.add('active');
            }
        });
    });

    // 3. Monthly / annual billing toggle for plans
    const billingToggle = document.getElementById('billingToggle');
    const priceValues = document.querySelectorAll('.price-value');

    if (billingToggle) {
        billingToggle.addEventListener('change', () => {
            const isAnnual = billingToggle.checked;

            priceValues.forEach(priceEl => {
                const monthly = priceEl.getAttribute('data-monthly');
                const annual = priceEl.getAttribute('data-annual');

                // Number change fade transition
                priceEl.style.opacity = '0';
                setTimeout(() => {
                    priceEl.textContent = isAnnual ? annual : monthly;
                    priceEl.style.opacity = '1';
                }, 150);
            });
        });
    }

    // 4. Contact form validation and submission
    const demoForm = document.getElementById('demoForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const galleryName = document.getElementById('galleryName');

            let isValid = true;

            // Simple validation with visual feedback
            const validateField = (input, condition) => {
                if (!condition) {
                    input.classList.add('invalid');
                    isValid = false;
                } else {
                    input.classList.remove('invalid');
                }
            };

            validateField(fullName, fullName.value.trim().length >= 3);
            validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
            validateField(phone, phone.value.trim().length >= 7);
            validateField(galleryName, galleryName.value.trim().length >= 2);

            if (isValid) {
                submitBtn.disabled = true;
                submitBtn.textContent = window.i18n ? window.i18n.t('form.sending') : 'Sending request...';
                // Simulated asynchronous response (200 OK)
                setTimeout(() => {
                    demoForm.reset();
                    submitBtn.style.display = 'none';
                    formSuccess.style.display = 'block';
                }, 1200);
            }
        });

        // Clear invalid state while typing
        const inputs = demoForm.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('invalid');
            });
        });
    }

    // 5. Dynamic navbar shadow on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // 6. Terms and conditions index: highlights the clause currently in view
    const termsLinks = document.querySelectorAll('.terms-index-link');
    const termsClauses = document.querySelectorAll('.terms-clause');

    if (termsLinks.length && 'IntersectionObserver' in window) {
        const termsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                termsLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        termsClauses.forEach(clause => termsObserver.observe(clause));
    }

});