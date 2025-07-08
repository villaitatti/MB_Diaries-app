// Navigation dots functionality for full-screen panels
(function() {
    'use strict';
    
    console.log('Loading navigation module...');
    
    let navigationInitialized = false;
    let isScrolling = false;
    
    // Optimized scroll-based active dot update with reduced delay
    function updateActiveDot() {
        if (isScrolling) return;
        
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Calculate active panel based on scroll position with better precision
        let activeIndex = Math.round(scrollY / viewportHeight);
        activeIndex = Math.max(0, Math.min(2, activeIndex));
        
        // Update navigation dots immediately
        const navDots = document.querySelectorAll('.nav-dot-css');
        
        navDots.forEach((dot, index) => {
            if (index === activeIndex) {
                if (!dot.classList.contains('active')) {
                    dot.classList.add('active');
                    console.log('✅ Activated dot', index + 1);
                }
            } else {
                if (dot.classList.contains('active')) {
                    dot.classList.remove('active');
                    console.log('❌ Deactivated dot', index + 1);
                }
            }
        });
    }
    
    // Handle navigation dot clicks
    function initNavDots() {
        const navDots = document.querySelectorAll('.nav-dot-css');
        console.log('Setting up click handlers for', navDots.length, 'dots');
        
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Dot clicked:', index + 1);
                
                // Set scrolling flag to prevent conflicts
                isScrolling = true;
                
                const targetScrollY = index * window.innerHeight;
                
                // Immediately update active state for instant feedback
                navDots.forEach((d, i) => {
                    if (i === index) {
                        d.classList.add('active');
                    } else {
                        d.classList.remove('active');
                    }
                });
                
                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth'
                });
                
                // Clear scrolling flag after animation completes
                setTimeout(() => {
                    isScrolling = false;
                    updateActiveDot(); // Ensure correct state after scroll
                }, 800);
            });
        });
    }
    
    // Handle scroll down button
    function initScrollButton() {
        const scrollDownBtn = document.querySelector('.scroll-down-btn');
        if (scrollDownBtn) {
            console.log('Setting up scroll down button');
            scrollDownBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Scroll down button clicked');
                
                isScrolling = true;
                
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
                
                // Clear scrolling flag and update dots
                setTimeout(() => {
                    isScrolling = false;
                    updateActiveDot();
                }, 800);
            });
        }
    }
    
    // Optimized scroll listener with immediate response
    let scrollTimeout;
    function handleScroll() {
        // Clear any pending timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Update immediately for responsive feel
        updateActiveDot();
        
        // Also set a small timeout for final cleanup
        scrollTimeout = setTimeout(() => {
            updateActiveDot();
        }, 100);
    }
    
    // Initialize everything
    function init() {
        if (navigationInitialized) {
            console.log('Navigation already initialized, skipping...');
            return true;
        }
        
        const panels = document.querySelectorAll('.full-screen-panel');
        const navDots = document.querySelectorAll('.nav-dot-css');
        
        console.log('Found panels:', panels.length, 'Found nav dots:', navDots.length);
        
        if (panels.length === 0 || navDots.length === 0) {
            console.log('Panels or nav dots not found yet, will retry...');
            return false;
        }
        
        navigationInitialized = true;
        console.log('Initializing navigation with', panels.length, 'panels and', navDots.length, 'nav dots');
        
        // Set up navigation dots
        initNavDots();
        
        // Set up optimized scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateActiveDot);
        
        // Initialize scroll button
        initScrollButton();
        
        // Initial update
        updateActiveDot();
        
        console.log('Navigation initialized successfully!');
        return true;
    }
    
    // MutationObserver to watch for React components
    function observeForReactTable() {
        console.log('🔍 Starting MutationObserver to watch for semantic-table rendering...');
        
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check if this is a diary container or contains navigation elements
                            if (node.classList && (
                                node.classList.contains('container_diary') ||
                                node.classList.contains('full-screen-panel') ||
                                node.classList.contains('nav-dot-css')
                            )) {
                                shouldCheck = true;
                            }
                            
                            // Also check descendants
                            if (node.querySelector && (
                                node.querySelector('.container_diary') ||
                                node.querySelector('.full-screen-panel') ||
                                node.querySelector('.nav-dot-css')
                            )) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldCheck) {
                console.log('Relevant DOM changes detected, attempting navigation initialization...');
                setTimeout(() => {
                    if (init()) {
                        console.log('Navigation successfully initialized after DOM changes');
                        observer.disconnect();
                    }
                }, 50); // Reduced delay for faster response
            }
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('MutationObserver started, watching for React components...');
        
        // Fallback timeout
        setTimeout(() => {
            if (!navigationInitialized) {
                console.log('Fallback: Attempting navigation initialization after 3 seconds...');
                init();
                observer.disconnect();
            }
        }, 3000);
        
        return observer;
    }
    
    // Initialize when DOM is ready
    function initializeNavigation() {
        console.log('Navigation module: DOM loaded, initializing...');
        
        // Try immediate initialization first
        if (!init()) {
            console.log('Initial navigation setup failed, setting up observers...');
            observeForReactTable();
        }
    }
    
    // Export initialization function for global access
    window.initializeNavigation = initializeNavigation;
    
    // Auto-initialize if DOM is already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNavigation);
    } else {
        initializeNavigation();
    }
    
})();