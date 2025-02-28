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
    
    // Initialize 3D Cloud Scene
    if (document.getElementById('cloud-scene-container')) {
        initCloudScene();
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

// Initialize the 3D Cloud Scene with Three.js
function initCloudScene() {
    // Scene setup
    const container = document.getElementById('cloud-scene-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x171920, 0.8);
    container.appendChild(renderer.domElement);
    
    // Set up camera position
    camera.position.z = 10;
    camera.position.y = 1;
    
    // Add orbit controls for mouse interaction
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    
    // Directional light (like the sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Blue point light for accent
    const blueLight = new THREE.PointLight(0x0066ff, 1, 20);
    blueLight.position.set(-5, 2, 5);
    scene.add(blueLight);
    
    // Create cloud objects
    const cloudGroup = new THREE.Group();
    scene.add(cloudGroup);
    
    // Cloud material
    const cloudMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x101820,
        specular: 0x0088ff,
        shininess: 5,
        transparent: true,
        opacity: 0.9
    });
    
    // Create multiple cloud shapes
    for (let i = 0; i < 12; i++) {
        const cloudGeometry = new THREE.SphereGeometry(
            Math.random() * 0.8 + 0.6, // Random size
            6, 6
        );
        
        // Randomly distort sphere vertices for cloud-like appearance
        const vertices = cloudGeometry.attributes.position;
        for (let j = 0; j < vertices.count; j++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(vertices, j);
            
            vertex.x += (Math.random() - 0.5) * 0.3;
            vertex.y += (Math.random() - 0.5) * 0.3;
            vertex.z += (Math.random() - 0.5) * 0.3;
            
            vertices.setXYZ(j, vertex.x, vertex.y, vertex.z);
        }
        
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        
        // Position clouds in a circular formation
        const angle = (i / 12) * Math.PI * 2;
        const radius = Math.random() * 2 + 3;
        cloud.position.x = Math.cos(angle) * radius;
        cloud.position.y = Math.sin(angle) * 0.5 + (Math.random() - 0.5) * 2;
        cloud.position.z = Math.sin(angle) * radius;
        
        // Add rotation
        cloud.rotation.x = Math.random() * Math.PI;
        cloud.rotation.y = Math.random() * Math.PI;
        
        cloudGroup.add(cloud);
    }
    
    // Add server rack in the center
    const rackGroup = new THREE.Group();
    scene.add(rackGroup);
    
    // Server rack
    const rackGeometry = new THREE.BoxGeometry(1.5, 3, 1);
    const rackMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        emissive: 0x101010,
        specular: 0x777777,
        shininess: 30
    });
    const rack = new THREE.Mesh(rackGeometry, rackMaterial);
    rackGroup.add(rack);
    
    // Add server units inside the rack
    for (let i = 0; i < 5; i++) {
        const serverGeometry = new THREE.BoxGeometry(1.3, 0.4, 0.8);
        const serverMaterial = new THREE.MeshPhongMaterial({
            color: 0x222222,
            emissive: 0x050505,
            specular: 0x444444,
            shininess: 20
        });
        const server = new THREE.Mesh(serverGeometry, serverMaterial);
        server.position.y = -1.2 + i * 0.5;
        rackGroup.add(server);
        
        // Add blinking LED lights
        const ledGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
        const ledMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            specular: 0xffffff,
            shininess: 100
        });
        
        // Add multiple LEDs to each server
        for (let j = 0; j < 3; j++) {
            const led = new THREE.Mesh(ledGeometry, ledMaterial.clone());
            led.position.set(0.6, server.position.y, 0.3 - j * 0.2);
            led.userData = { 
                blinkRate: 0.5 + Math.random() * 2,
                initialIntensity: 0.3 + Math.random() * 0.7,
                material: led.material
            };
            rackGroup.add(led);
        }
    }
    
    // Add connection lines between cloud objects and rack
    const connectionMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00aaff,
        transparent: true,
        opacity: 0.4
    });
    
    cloudGroup.children.forEach((cloud, index) => {
        if (index % 2 === 0) { // Add lines to every other cloud
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(
                    cloud.position.x, 
                    cloud.position.y, 
                    cloud.position.z
                )
            ]);
            const line = new THREE.Line(lineGeometry, connectionMaterial);
            rackGroup.add(line);
        }
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    let elapsedTime = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Update elapsed time
        elapsedTime = clock.getElapsedTime();
        
        // Rotate cloud group slowly
        cloudGroup.rotation.y = elapsedTime * 0.1;
        
        // Make individual clouds float slightly
        cloudGroup.children.forEach((cloud, index) => {
            cloud.position.y += Math.sin(elapsedTime * 0.5 + index) * 0.002;
        });
        
        // Blink LEDs
        rackGroup.children.forEach(object => {
            if (object.userData && object.userData.blinkRate) {
                const intensity = object.userData.initialIntensity + 
                    Math.sin(elapsedTime * object.userData.blinkRate) * 0.3;
                
                // Update the LED's emissive color
                object.material.emissive.setRGB(0, intensity, 0);
            }
        });
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
    
    // Start animation
    animate();
}