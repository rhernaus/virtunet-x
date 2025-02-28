/*
Virtunet - Cloud Engineering & Architecture
Modern JavaScript functionality
*/

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Initialize Particles.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#007bff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#007bff',
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
                // Add a class to trigger a subtle animation when typing is done
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
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // SIMPLIFIED DIRECT APPROACH FOR BUTTONS IN HERO SECTION
    document.querySelector('a[href="#services"].btn').addEventListener('click', function(e) {
        e.preventDefault();
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const offsetTop = servicesSection.offsetTop - 100; // Adjust offset as needed
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
    
    document.querySelector('a[href="#contact"].btn').addEventListener('click', function(e) {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const offsetTop = contactSection.offsetTop - 100; // Adjust offset as needed
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
    
    // General smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]:not(.btn)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Adjust offset as needed
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile navbar if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show') && navbarToggler) {
                    navbarToggler.click();
                }
            }
        });
    });
    
    // Contact form submission (example, replace with actual implementation)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Example form validation
            const formElements = this.elements;
            let isValid = true;
            
            for (let i = 0; i < formElements.length; i++) {
                if (formElements[i].hasAttribute('required') && !formElements[i].value.trim()) {
                    isValid = false;
                    formElements[i].classList.add('is-invalid');
                } else {
                    formElements[i].classList.remove('is-invalid');
                }
            }
            
            if (isValid) {
                // Simulate form submission success
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
                
                setTimeout(() => {
                    this.reset();
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Sent Successfully';
                    
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    }, 3000);
                }, 1500);
            }
        });
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
    document.querySelector('.tm-current-year').textContent = new Date().getFullYear();
});

// Service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}