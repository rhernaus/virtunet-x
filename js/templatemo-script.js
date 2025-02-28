/*
Virtunet B.V. - Cloud Engineering & Architectuur
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
    
    // Add draggable functionality and connections to tech icons
    const iconContainer = document.getElementById('tech-icons-container');
    const draggableIcons = document.querySelectorAll('.draggable');
    const svgContainer = document.querySelector('.connections-svg');
    
    if (iconContainer && draggableIcons.length > 0) {
        // Initial positions for SVG connections
        updateAllConnections();
        
        // Make icons draggable
        draggableIcons.forEach(icon => {
            let isDragging = false;
            let offsetX, offsetY;
            
            // Store original position for snapping back if needed
            icon.dataset.originalX = icon.offsetLeft;
            icon.dataset.originalY = icon.offsetTop;
            
            // Mouse down event - start dragging
            icon.addEventListener('mousedown', function(e) {
                // Prevent already dragging another element
                const alreadyDragging = document.querySelector('.dragging');
                if (alreadyDragging) {
                    return;
                }
                
                isDragging = true;
                this.classList.add('dragging');
                
                // Bring to front with higher z-index
                this.style.zIndex = '100';
                
                // If first drag, set absolute position based on current layout position
                if (!this.style.position || this.style.position !== 'absolute') {
                    const rect = this.getBoundingClientRect();
                    const containerRect = iconContainer.getBoundingClientRect();
                    
                    // Set original position as absolute coords
                    const originalX = rect.left - containerRect.left;
                    const originalY = rect.top - containerRect.top;
                    
                    this.style.position = 'absolute';
                    this.style.left = originalX + 'px';
                    this.style.top = originalY + 'px';
                    this.style.transform = 'none';
                    
                    this.dataset.originalX = originalX;
                    this.dataset.originalY = originalY;
                }
                
                // Calculate the offset from mouse position to icon's top-left corner
                const rect = this.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                
                // Prevent default behavior to avoid text selection during drag
                e.preventDefault();
            });
            
            // Mouse move event - move the icon
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                
                // Calculate new position
                const containerRect = iconContainer.getBoundingClientRect();
                let newX = e.clientX - containerRect.left - offsetX;
                let newY = e.clientY - containerRect.top - offsetY;
                
                // Boundary check to keep icons within container
                const iconWidth = icon.offsetWidth;
                const iconHeight = icon.offsetHeight;
                
                // Limit to container boundaries
                newX = Math.max(0, Math.min(newX, containerRect.width - iconWidth));
                newY = Math.max(0, Math.min(newY, containerRect.height - iconHeight));
                
                // Update position
                icon.style.left = `${newX}px`;
                icon.style.top = `${newY}px`;
                
                // Store current position for calculations
                icon.dataset.currentX = newX;
                icon.dataset.currentY = newY;
                
                // Throttle connection updates during drag for better performance
                if (!icon.updateThrottle) {
                    icon.updateThrottle = setTimeout(() => {
                        updateAllConnections();
                        icon.updateThrottle = null;
                    }, 30);
                }
            });
            
            // Mouse up event - stop dragging
            document.addEventListener('mouseup', function() {
                if (isDragging) {
                    isDragging = false;
                    icon.classList.remove('dragging');
                    
                    // Reset z-index to normal
                    setTimeout(() => {
                        icon.style.zIndex = '3';
                    }, 10);
                    
                    // Use actual left/top values for future calculations
                    if (icon.dataset.currentX && icon.dataset.currentY) {
                        icon.style.transform = 'none';
                        icon.style.left = icon.dataset.currentX + 'px';
                        icon.style.top = icon.dataset.currentY + 'px';
                    }
                    
                    // Clear throttle if any
                    if (icon.updateThrottle) {
                        clearTimeout(icon.updateThrottle);
                        icon.updateThrottle = null;
                    }
                    
                    // Final connection update after drag stops
                    updateAllConnections();
                }
            });
            
            // Mouse out event - stop dragging if mouse leaves the container
            iconContainer.addEventListener('mouseleave', function() {
                if (isDragging) {
                    isDragging = false;
                    icon.classList.remove('dragging');
                    
                    // Reset z-index to normal
                    setTimeout(() => {
                        icon.style.zIndex = '3';
                    }, 10);
                    
                    // Use actual left/top values for future calculations
                    if (icon.dataset.currentX && icon.dataset.currentY) {
                        icon.style.transform = 'none';
                        icon.style.left = icon.dataset.currentX + 'px';
                        icon.style.top = icon.dataset.currentY + 'px';
                    }
                    
                    // Clear throttle if any
                    if (icon.updateThrottle) {
                        clearTimeout(icon.updateThrottle);
                        icon.updateThrottle = null;
                    }
                    
                    // Final connection update after drag stops
                    updateAllConnections();
                }
            });
        });
        
        // Function to update all connections
        function updateAllConnections() {
            // Clear existing connections
            svgContainer.innerHTML = '';
            
            // Get all capability icons
            const capabilities = document.querySelectorAll('.capability');
            
            // For each capability, create connections to providers
            capabilities.forEach(capability => {
                const connects = capability.dataset.connects.split(',');
                const containerRect = iconContainer.getBoundingClientRect();
                
                // Get accurate positions for capabilities including transforms
                let capX, capY;
                if (capability.dataset.currentX && capability.dataset.currentY) {
                    // Use stored position from drag
                    capX = parseInt(capability.dataset.currentX) + capability.offsetWidth / 2;
                    capY = parseInt(capability.dataset.currentY) + capability.offsetHeight / 2;
                } else {
                    // Calculate from current position
                    const capabilityRect = capability.getBoundingClientRect();
                    capX = capabilityRect.left - containerRect.left + capabilityRect.width / 2;
                    capY = capabilityRect.top - containerRect.top + capabilityRect.height / 2;
                }
                
                // For each provider connection
                connects.forEach(providerId => {
                    const provider = document.querySelector(`.provider[data-id="${providerId}"]`);
                    if (provider) {
                        // Get accurate positions for providers including transforms
                        let provX, provY;
                        if (provider.dataset.currentX && provider.dataset.currentY) {
                            // Use stored position from drag
                            provX = parseInt(provider.dataset.currentX) + provider.offsetWidth / 2;
                            provY = parseInt(provider.dataset.currentY) + provider.offsetHeight / 2;
                        } else {
                            // Calculate from current position
                            const providerRect = provider.getBoundingClientRect();
                            provX = providerRect.left - containerRect.left + providerRect.width / 2;
                            provY = providerRect.top - containerRect.top + providerRect.height / 2;
                        }
                        
                        // Create path
                        createConnection(capX, capY, provX, provY, providerId, capability.dataset.id);
                    }
                });
            });
        }
        
        // Function to create a curved connection between points
        function createConnection(x1, y1, x2, y2, providerId, capabilityId) {
            // Calculate control points for curved line
            const controlX = (x1 + x2) / 2;
            const controlY = (y1 + y2) / 2 - 30; // Adjust for curvature
            
            // Create path element
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${x1} ${y1} Q ${controlX} ${controlY}, ${x2} ${y2}`);
            
            // Style based on provider type
            let strokeColor;
            switch(providerId) {
                case 'azure':
                    strokeColor = 'rgba(0, 120, 212, 0.7)'; // Microsoft blue
                    break;
                case 'aws':
                    strokeColor = 'rgba(255, 153, 0, 0.7)'; // AWS orange
                    break;
                case 'gcp':
                    strokeColor = 'rgba(52, 168, 83, 0.7)'; // Google green (part of Google's color palette)
                    break;
                default:
                    strokeColor = 'rgba(100, 150, 255, 0.7)';
            }
            
            // Apply path styling
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', strokeColor);
            path.setAttribute('stroke-width', '2');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-dasharray', '5,5');
            path.setAttribute('class', `connection ${providerId}-${capabilityId}`);
            
            // Add animation
            const animateElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animateElement.setAttribute('attributeName', 'stroke-dashoffset');
            animateElement.setAttribute('from', '10');
            animateElement.setAttribute('to', '0');
            animateElement.setAttribute('dur', '1s');
            animateElement.setAttribute('repeatCount', 'indefinite');
            
            path.appendChild(animateElement);
            svgContainer.appendChild(path);
        }
        
        // Update connections on window resize
        window.addEventListener('resize', updateAllConnections);
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
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
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

