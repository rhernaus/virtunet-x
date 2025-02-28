/*
Virtunet B.V. - Next-Gen AI Innovation
*/

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize AOS animations with optimized settings
    AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        disable: 'mobile', // Disable on mobile for better performance
        disableMutationObserver: false // Keep mutation observer for better performance
    });
    
    // Initialize Particles.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#9C27B0' }, // Purple for AI
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#9C27B0', // Purple for AI
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
    
    // Hero image animation
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        // Add a subtle animation for the hero image
        heroImage.style.transition = 'transform 3s ease-in-out';
        
        // Simple animation loop
        const animateHero = () => {
            setTimeout(() => {
                heroImage.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    heroImage.style.transform = 'scale(1)';
                    animateHero();
                }, 3000);
            }, 3000);
        };
        
        // Start the animation when the image loads
        if (heroImage.complete) {
            animateHero();
        } else {
            heroImage.onload = animateHero;
        }
    }
    
    // Initialize Typed.js for text animation
    if (document.querySelector('.hero-section h1')) {
        const typedElement = document.querySelector('.hero-section h1');
        const originalText = typedElement.textContent;
        typedElement.textContent = '';
        
        new Typed(typedElement, {
            strings: [originalText],
            typeSpeed: 60,
            backSpeed: 0,
            loop: false,
            showCursor: false,
            onComplete: function() {
                typedElement.classList.add('typed-complete');
            }
        });
    }
    
    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Cross-browser compatible smooth scrolling
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Get section position relative to the viewport
        const sectionRect = section.getBoundingClientRect();
        
        // Get current scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate target position with offset for navbar
        const offset = 80;
        const targetPosition = scrollTop + sectionRect.top - offset;
        
        // Fallback for browsers that don't support smooth scrolling
        if (typeof window.scrollTo !== 'function' || !('behavior' in document.documentElement.style) ||
            !('scrollBehavior' in document.documentElement.style)) {
            // Use manual animation for older browsers
            scrollToSmoothly(targetPosition);
        } else {
            // Modern browsers - use native smooth scrolling
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Fallback smooth scroll function
    function scrollToSmoothly(position) {
        const startPosition = window.pageYOffset;
        const distance = position - startPosition;
        const duration = 500; // ms
        let start = null;
        
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function - easeInOutQuad
            const easing = percentage < 0.5
                ? 2 * percentage * percentage
                : 1 - Math.pow(-2 * percentage + 2, 2) / 2;
                
            window.scrollTo(0, startPosition + distance * easing);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    }
    
    // Apply the scrolling function to all navigation links and buttons
    document.addEventListener('click', function(e) {
        // Look for the link element (either the target or a parent)
        let linkElement = e.target;
        
        // If the clicked element isn't an A tag, try to find a parent that is
        while (linkElement && linkElement.tagName !== 'A' && linkElement !== document.body) {
            linkElement = linkElement.parentElement;
        }
        
        // If we found a link with a hash
        if (linkElement && linkElement.tagName === 'A' && linkElement.hash) {
            const targetId = linkElement.hash.substring(1); // Remove the # from the hash
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                scrollToSection(targetId);
                
                // Close mobile navbar if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    if (navbarToggler) {
                        navbarToggler.click();
                    }
                }
            }
        }
    });
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Function to set up form validation
    const setupFormValidation = (form) => {
        if (!form) return;
        
        // Disable the default browser validation to use our custom Dutch messages
        form.setAttribute('novalidate', 'novalidate');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const formElements = this.elements;
            let isValid = true;
            
            // Custom validation messages in Dutch
            const validationMessages = {
                required: 'Dit veld is verplicht',
                email: 'Voer een geldig e-mailadres in',
                tel: 'Voer een geldig telefoonnummer in',
                select: 'Selecteer een optie',
                checkbox: 'Dit veld is verplicht'
            };
            
            for (let i = 0; i < formElements.length; i++) {
                // Check for validation requirements
                let isFieldValid = true;
                let errorMessage = '';
                
                // Skip submit buttons and disabled fields
                if (formElements[i].type === 'submit' || formElements[i].disabled) {
                    continue;
                }
                
                // Required field validation
                if (formElements[i].hasAttribute('required')) {
                    if (formElements[i].type === 'checkbox' && !formElements[i].checked) {
                        isFieldValid = false;
                        errorMessage = validationMessages.checkbox;
                    } 
                    else if (formElements[i].tagName === 'SELECT' && 
                             (formElements[i].value === '' || formElements[i].value === 'Selecteer een optie')) {
                        isFieldValid = false;
                        errorMessage = validationMessages.select;
                    }
                    else if (!formElements[i].value.trim()) {
                        isFieldValid = false;
                        errorMessage = validationMessages.required;
                    }
                }
                
                // Email validation
                if (isFieldValid && formElements[i].type === 'email' && formElements[i].value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(formElements[i].value.trim())) {
                        isFieldValid = false;
                        errorMessage = validationMessages.email;
                    }
                }
                
                // Phone validation
                if (isFieldValid && formElements[i].type === 'tel' && formElements[i].value.trim()) {
                    // More lenient phone validation for international formats
                    const phoneRegex = /^[+]?[0-9\s\-()]{8,}$/;
                    if (!phoneRegex.test(formElements[i].value.trim())) {
                        isFieldValid = false;
                        errorMessage = validationMessages.tel;
                    }
                }
                
                if (!isFieldValid) {
                    isValid = false;
                    formElements[i].classList.add('is-invalid');
                    
                    // Dutch validation message
                    const invalidFeedback = document.createElement('div');
                    invalidFeedback.className = 'invalid-feedback';
                    invalidFeedback.textContent = errorMessage;
                    
                    // Special handling for checkboxes and radio buttons which are often wrapped in labels
                    const isInputGroup = formElements[i].parentNode.classList.contains('input-group');
                    const isFormCheck = formElements[i].parentNode.classList.contains('form-check');
                    
                    // Remove existing feedback if any
                    let parent = formElements[i].parentNode;
                    const existingFeedback = parent.querySelector('.invalid-feedback');
                    if (existingFeedback) {
                        existingFeedback.remove();
                    }
                    
                    // For checkbox and radio in form-check, append to the parent (the label wrapper)
                    if (isFormCheck) {
                        parent.appendChild(invalidFeedback);
                    } 
                    // For input groups, append after the input group
                    else if (isInputGroup) {
                        parent.parentNode.insertBefore(invalidFeedback, parent.nextSibling);
                    }
                    // For normal inputs
                    else {
                        formElements[i].parentNode.insertBefore(invalidFeedback, formElements[i].nextSibling);
                    }
                } else {
                    formElements[i].classList.remove('is-invalid');
                    
                    // Remove feedback if exists
                    const parent = formElements[i].parentNode;
                    const existingFeedback = parent.querySelector('.invalid-feedback');
                    if (existingFeedback) {
                        existingFeedback.remove();
                    }
                }
            }
            
            if (isValid) {
                // Simulate form submission success
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verzenden...';
                
                setTimeout(() => {
                    this.reset();
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Verzonden';
                    
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    }, 3000);
                }, 1500);
            }
        });
    };
    
    // Set up validation for forms
    if (contactForm) {
        setupFormValidation(contactForm);
    }
    
    if (newsletterForm) {
        setupFormValidation(newsletterForm);
    }
    // Initialize counter animations for skills section
    const skillPercentages = document.querySelectorAll('.skill-percentage');
    
    const animateCounter = (el) => {
        const target = parseInt(el.textContent);
        let count = 0;
        const duration = 1500;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        const increment = target / totalFrames;
        
        const animate = () => {
            count += increment;
            if (count < target) {
                el.textContent = Math.floor(count) + '%';
                requestAnimationFrame(animate);
            } else {
                el.textContent = target + '%';
            }
        };
        
        animate();
    };
    
    // Use Intersection Observer to trigger counter animations
    if (skillPercentages.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillPercentages.forEach(percentage => {
            observer.observe(percentage);
        });
    }
    
    // Update current year in footer
    const yearElement = document.querySelector('.tm-current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});