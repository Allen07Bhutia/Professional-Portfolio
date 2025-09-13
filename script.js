// Smooth scrolling navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation link highlighting
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // Form submission
        document.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I\'ll get back to you soon.');
            this.reset();
        });

        // Mobile menu toggle (basic implementation)
        document.querySelector('.mobile-menu').addEventListener('click', function() {
            alert('Mobile menu functionality would be implemented here');
        });

        // Add smooth hover effects for social links
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });


        class PortfolioRouter {
        constructor() {
        this.routes = new Map();
        this.currentRoute = '';
        this.defaultRoute = 'Home';
        
        // Initialize router
        this.init();
    }
    
    init() {
        // Define routes based on your portfolio sections
        this.addRoute('home', {
            element: '#home',
            title: 'Allen Ongchen Bhutia - Portfolio',
            callback: () => this.scrollToSection('home')
        });
        
        this.addRoute('about', {
            element: '#about',
            title: 'about - Allen Ongchen Bhutia',
            callback: () => this.scrollToSection('about')
        });
        
        this.addRoute('skills', {
            element: '#skills',
            title: 'skills - Allen Ongchen Bhutia',
            callback: () => this.scrollToSection('skills')
        });
        
        this.addRoute('education', {
            element: '#education',
            title: 'education - Allen Ongchen Bhutia',
            callback: () => this.scrollToSection('education')
        });
        
        this.addRoute('projects', {
            element: '#projects',
            title: 'projects - Allen Ongchen Bhutia',
            callback: () => this.scrollToSection('projects')
        });
        
        this.addRoute('contact', {
            element: '#contact',
            title: 'Contact - Allen Ongchen Bhutia',
            callback: () => this.scrollToSection('contact')
        });
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Handle initial route
        this.handleRoute();
    }
    
    addRoute(path, config) {
        this.routes.set(path, config);
    }
    
    setupEventListeners() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
        
        // Listen for page load
        window.addEventListener('load', () => {
            this.handleRoute();
        });
        
        // Intercept navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const hash = link.getAttribute('href').substring(1);
                this.navigate(hash);
            }
        });
        
        // Handle scroll-based navigation highlighting
        this.setupScrollListener();
    }
    
    setupScrollListener() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Set a timeout to avoid excessive calls
            scrollTimeout = setTimeout(() => {
                this.updateActiveNavOnScroll();
            }, 100);
        });
    }
    
    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = this.defaultRoute;
        const scrollPosition = window.pageYOffset + 200; // Offset for better detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Update URL hash without triggering hashchange event
        if (current !== this.getCurrentRoute()) {
            this.updateURLHash(current, false);
        }
        
        // Update active navigation
        this.updateActiveNavigation(current);
    }
    
    handleRoute() {
        const hash = window.location.hash.substring(1);
        const route = hash || this.defaultRoute;
        
        if (this.routes.has(route)) {
            this.currentRoute = route;
            const routeConfig = this.routes.get(route);
            
            // Update document title
            document.title = routeConfig.title;
            
            // Execute route callback
            if (routeConfig.callback) {
                routeConfig.callback();
            }
            
            // Update active navigation
            this.updateActiveNavigation(route);
            
            // Trigger custom event
            this.triggerRouteChange(route);
        } else {
            // Fallback to default route
            this.navigate(this.defaultRoute);
        }
    }
    
    navigate(route) {
        if (this.routes.has(route)) {
            // Update URL hash
            this.updateURLHash(route, true);
        }
    }
    
    updateURLHash(route, triggerChange = true) {
        const newHash = `#${route}`;
        
        if (triggerChange) {
            window.location.hash = newHash;
        } else {
            // Update URL without triggering hashchange
            history.replaceState(null, null, newHash);
        }
    }
    
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    updateActiveNavigation(activeRoute) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === `#${activeRoute}`) {
                link.classList.add('active');
            }
        });
    }
    
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    getAllRoutes() {
        return Array.from(this.routes.keys());
    }
    
    getRouteConfig(route) {
        return this.routes.get(route);
    }
    
    triggerRouteChange(route) {
        const event = new CustomEvent('routeChanged', {
            detail: {
                route: route,
                config: this.routes.get(route)
            }
        });
        window.dispatchEvent(event);
    }
    
    // Method to programmatically go to a specific section
    goTo(route) {
        this.navigate(route);
    }
    
    // Method to go back in history
    goBack() {
        window.history.back();
    }
    
    // Method to go forward in history
    goForward() {
        window.history.forward();
    }
    
    // Method to add custom route handlers
    onRouteChange(callback) {
        window.addEventListener('routeChanged', callback);
    }
    
    // Method to remove route handlers
    offRouteChange(callback) {
        window.removeEventListener('routeChanged', callback);
    }
    
    // Method to check if a route exists
    hasRoute(route) {
        return this.routes.has(route);
    }
    
    // Method to get route from element
    getRouteFromElement(element) {
        const id = element.getAttribute('id');
        return this.hasRoute(id) ? id : null;
    }
}

// Initialize the router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create router instance
    const router = new PortfolioRouter();
    
    // Make router globally available
    window.portfolioRouter = router;
    
    // Example of listening to route changes
    router.onRouteChange((event) => {
        console.log('Route changed to:', event.detail.route);
        
        // You can add custom logic here for specific routes
        switch(event.detail.route) {
            case 'home':
                // Custom logic for home page
                break;
            case 'about':
                // Custom logic for about page
                break;
            case 'contact':
                // Custom logic for contact page
                // You could initialize the contact form here
                initializeContactForm();
                break;
        }
    });
    
    // Contact form initialization (example)
    function initializeContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm && !contactForm.hasAttribute('data-initialized')) {
            contactForm.setAttribute('data-initialized', 'true');
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const name = formData.get('name') || document.getElementById('name').value;
                const email = formData.get('email') || document.getElementById('email').value;
                const message = formData.get('message') || document.getElementById('message').value;
                
                // Basic validation
                if (!name || !email || !message) {
                    alert('Please fill in all fields');
                    return;
                }
                
                // Simulate form submission
                console.log('Form submitted:', { name, email, message });
                alert(`Thank you ${name}! I'll get back to you soon.`);
                this.reset();
            });
        }
    }
    
    // Example usage methods you can call from console or other scripts:
    
    // Navigate to a section
    // router.goTo('about');
    
    // Get current route
    // console.log(router.getCurrentRoute());
    
    // Check if route exists
    // console.log(router.hasRoute('skills'));
    
    // Get all available routes
    // console.log(router.getAllRoutes());
});

// Export for use in modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioRouter;
}

