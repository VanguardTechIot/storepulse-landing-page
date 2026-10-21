/**
 * StorePulse Landing Page Interactions
 * VanguardTech - Sprint 1
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Menú Móvil Colapsable (Hamburguesa)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('open');
        });

        // Cerrar menú al hacer clic en un enlace de navegación
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('open');
            });
        });
    }

    // 2. Acordeón Interactivo de Preguntas Frecuentes (FAQ - VS-05)
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isAlreadyActive = item.classList.contains('active');

            // Cerrar otros acordeones abiertos
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));

            // Alternar el actual
            if (!isAlreadyActive) {
                item.classList.add('active');
            }
        });
    });

    // 3. Toggle de Facturación Mensual / Anual en Planes (VS-04)
    const billingToggle = document.getElementById('billingToggle');
    const priceValues = document.querySelectorAll('.price-value');

    if (billingToggle) {
        billingToggle.addEventListener('change', () => {
            const isAnnual = billingToggle.checked;

            priceValues.forEach(priceEl => {
                const monthly = priceEl.getAttribute('data-monthly');
                const annual = priceEl.getAttribute('data-annual');

                // Transición de cambio numérico
                priceEl.style.opacity = '0';
                setTimeout(() => {
                    priceEl.textContent = isAnnual ? annual : monthly;
                    priceEl.style.opacity = '1';
                }, 150);
            });
        });
    }

    // 4. Validación y Envío del Formulario de Demostración (VS-06)
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

            // Validación simple con feedback visual
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
                submitBtn.textContent = 'Enviando solicitud...';

                // Simulación de respuesta asíncrona (200 OK)
                setTimeout(() => {
                    demoForm.reset();
                    submitBtn.style.display = 'none';
                    formSuccess.style.display = 'block';
                }, 1200);
            }
        });

        // Limpieza de estados inválidos al tipear
        const inputs = demoForm.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('invalid');
            });
        });
    }

    // 5. Sombra dinámica en Navbar al hacer Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

});