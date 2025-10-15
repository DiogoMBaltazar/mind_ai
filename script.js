// Custom Cursor and Brain Synapse Effect
class BrainSynapseEffect {
    constructor() {
        this.cursor = document.getElementById('customCursor');
        this.synapseContainer = document.getElementById('synapseContainer');
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.lastSynapseTime = 0;
        this.synapseDelay = 80; // Reduced delay for more frequent synapses
        this.isMoving = false;

        this.init();
        this.startSmoothCursor();
    }

    init() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isMoving = true;
            this.createSynapse(e);
        });

        // Handle hover states
        document.addEventListener('mouseover', (e) => {
            if (this.isInteractiveElement(e.target)) {
                this.cursor.classList.add('hover');
            } else {
                this.cursor.classList.remove('hover');
            }
        });

        // Handle click states
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('click');
        });

        // Stop movement detection after a delay
        document.addEventListener('mousemove', () => {
            clearTimeout(this.moveTimeout);
            this.moveTimeout = setTimeout(() => {
                this.isMoving = false;
            }, 100);
        });
    }

    startSmoothCursor() {
        const updateCursor = () => {
            // Smooth interpolation for cursor movement
            const ease = 0.15;
            this.cursorX += (this.mouseX - this.cursorX) * ease;
            this.cursorY += (this.mouseY - this.cursorY) * ease;

            this.cursor.style.left = this.cursorX + 'px';
            this.cursor.style.top = this.cursorY + 'px';

            requestAnimationFrame(updateCursor);
        };
        updateCursor();
    }

    isInteractiveElement(element) {
        const interactiveSelectors = [
            'a', 'button', '.btn', '.tech-card', '.service-card',
            '.case-study', '.nav-link', 'input', 'textarea'
        ];

        return interactiveSelectors.some(selector =>
            element.matches(selector) || element.closest(selector)
        );
    }

    createSynapse(e) {
        const now = Date.now();
        if (now - this.lastSynapseTime < this.synapseDelay) return;

        // Only create synapses in empty areas (not over interactive elements)
        if (this.isInteractiveElement(e.target)) return;

        // Only create synapses when moving
        if (!this.isMoving) return;

        this.lastSynapseTime = now;

        // Create more synapses for enhanced effect
        const synapseCount = Math.random() > 0.5 ? 3 : 2;

        for (let i = 0; i < synapseCount; i++) {
            setTimeout(() => {
                this.generateSynapse(e.clientX, e.clientY);
            }, i * 50); // Faster succession
        }
    }

    generateSynapse(startX, startY) {
        // Create synapse line
        const synapse = document.createElement('div');
        synapse.className = 'synapse';

        // Random direction and length
        const angle = Math.random() * 360;
        const length = 60 + Math.random() * 120; // Increased length for more visibility
        const endX = startX + Math.cos(angle * Math.PI / 180) * length;
        const endY = startY + Math.sin(angle * Math.PI / 180) * length;

        // Position and style the synapse
        synapse.style.left = Math.min(startX, endX) + 'px';
        synapse.style.top = Math.min(startY, endY) + 'px';
        synapse.style.width = Math.abs(endX - startX) + 'px';
        synapse.style.height = '2px'; // Increased thickness
        synapse.style.transform = `rotate(${angle}deg)`;
        synapse.style.transformOrigin = '0 0';
        synapse.style.animation = 'enhancedSynapseFlow 2.5s ease-out forwards';

        this.synapseContainer.appendChild(synapse);

        // Create nodes at both ends
        this.createNode(startX, startY);
        this.createNode(endX, endY);

        // Create electrical pulse
        setTimeout(() => {
            this.createElectricalPulse(startX, startY, endX, endY);
        }, 200); // Faster pulse timing

        // Remove synapse after animation
        setTimeout(() => {
            if (synapse.parentNode) {
                synapse.parentNode.removeChild(synapse);
            }
        }, 3000); // Longer duration for enhanced effect
    }

    createNode(x, y) {
        const node = document.createElement('div');
        node.className = 'synapse-node';
        node.style.left = (x - 2.25) + 'px'; // Adjusted for reduced node size
        node.style.top = (y - 2.25) + 'px';
        node.style.animation = 'enhancedNodeGlow 3s ease-out forwards';

        this.synapseContainer.appendChild(node);

        setTimeout(() => {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }, 3500); // Longer duration
    }

    createElectricalPulse(startX, startY, endX, endY) {
        const pulse = document.createElement('div');
        pulse.className = 'electrical-pulse';

        // Start at beginning of synapse
        pulse.style.left = (startX - 3.75) + 'px'; // Adjusted for reduced pulse size
        pulse.style.top = (startY - 3.75) + 'px';
        pulse.style.animation = 'enhancedElectricalPulse 1.8s ease-out forwards';

        this.synapseContainer.appendChild(pulse);

        // Animate pulse along the synapse with enhanced smoothness
        const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        const duration = 1200; // Slower for more visibility
        const startTime = Date.now();

        const animatePulse = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smoother movement
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const currentX = startX + (endX - startX) * easeProgress;
            const currentY = startY + (endY - startY) * easeProgress;

            pulse.style.left = (currentX - 3.75) + 'px';
            pulse.style.top = (currentY - 3.75) + 'px';

            if (progress < 1) {
                requestAnimationFrame(animatePulse);
            } else {
                setTimeout(() => {
                    if (pulse.parentNode) {
                        pulse.parentNode.removeChild(pulse);
                    }
                }, 500); // Delay removal for fade out
            }
        };

        requestAnimationFrame(animatePulse);
    }
}

// Initialize brain synapse effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const brainEffect = new BrainSynapseEffect();
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
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

// Header background on scroll with Apple-style transition
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;

    if (scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.backdropFilter = 'blur(30px)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.8)';
        header.style.backdropFilter = 'blur(20px)';
    }
});

// Apple-inspired Intersection Observer for sophisticated animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Staggered animation observer for multiple elements
const staggeredObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate');
                }, index * 150); // Stagger by 150ms
            });
        }
    });
}, observerOptions);

// Initialize animations on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements
    const fadeUpElements = document.querySelectorAll('.tech-card, .service-card, .case-study');
    fadeUpElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        animationObserver.observe(el);
    });

    // Staggered animations for grids
    const gridContainers = document.querySelectorAll('.tech-grid, .services-grid, .case-studies-grid');
    gridContainers.forEach(container => {
        staggeredObserver.observe(container);
    });

    // Side animations for team content
    const teamText = document.querySelector('.team-text');
    const teamImage = document.querySelector('.team-image');

    if (teamText) {
        teamText.classList.add('animate-slide-left');
        animationObserver.observe(teamText);
    }

    if (teamImage) {
        teamImage.classList.add('animate-slide-right');
        animationObserver.observe(teamImage);
    }

    // Scale animation for hero stats
    const heroStats = document.querySelectorAll('.stat-item');
    heroStats.forEach((stat, index) => {
        stat.classList.add('animate-scale');
        setTimeout(() => {
            stat.classList.add('animate');
        }, 1000 + (index * 200));
    });
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const text = counter.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (number) {
                animateCounter(counter, number);
                counterObserver.unobserve(counter);
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

// Apple-style parallax effects and scroll animations
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const scrollProgress = scrolled / (document.body.scrollHeight - windowHeight);

    // Parallax for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom > 0) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }

    // Parallax for section backgrounds
    const sections = document.querySelectorAll('.technology, .services, .case-studies, .team');
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const speed = 0.1 + (index * 0.05);

        if (rect.bottom > 0 && rect.top < windowHeight) {
            const yPos = -(scrolled - section.offsetTop) * speed;
            section.style.backgroundPosition = `center ${yPos}px`;
        }
    });

    // Floating animation for tech icons
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach((icon, index) => {
        const rect = icon.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < windowHeight) {
            const floatOffset = Math.sin(scrolled * 0.01 + index) * 5;
            icon.style.transform = `translateY(${floatOffset}px)`;
        }
    });

    // Dynamic glow effect based on scroll
    const glowElements = document.querySelectorAll('.stat-number, .logo');
    glowElements.forEach(element => {
        const intensity = Math.sin(scrollProgress * Math.PI * 2) * 0.5 + 0.5;
        element.style.textShadow = `0 0 ${20 + intensity * 20}px rgba(0, 122, 255, ${0.3 + intensity * 0.4})`;
    });
});

// Loading animation
window.addEventListener('load', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            document.body.classList.add('loaded');
        }, 500);
    }, 1000);
});

// Form handling (if contact form is added later)
function handleContactForm(event) {
    event.preventDefault();
    // Add form submission logic here
    console.log('Contact form submitted');
}

// DISABLED - Typing animation for hero title (handled in HTML)
// function typeWriter(element, text, speed = 100) {
//     let i = 0;
//     element.innerHTML = '';

//     function type() {
//         if (i < text.length) {
//             element.innerHTML += text.charAt(i);
//             i++;
//             setTimeout(type, speed);
//         }
//     }
//     type();
// }

// DISABLED - Initialize typing animation when page loads (handled in HTML)
// document.addEventListener('DOMContentLoaded', () => {
//     const heroTitle = document.querySelector('.hero-title');
//     const originalText = heroTitle.textContent;

//     setTimeout(() => {
//         typeWriter(heroTitle, originalText, 80);
//     }, 1500);
// });

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
createScrollProgress();

// Add CSS for hamburger animation and other styles
const style = document.createElement('style');
style.textContent = `
    .nav-toggle.active .bar:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .nav-toggle.active .bar:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active .bar:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }

    body.loaded {
        opacity: 1;
    }

    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .hero-title {
        /* REMOVED BLINKING CURSOR - border-right: 2px solid #667eea; */
        /* REMOVED BLINKING ANIMATION - animation: blink 1s infinite; */
        animation: none !important;
        border: none !important;
    }

    /* DISABLED BLINKING ANIMATION
    @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: #667eea; }
    }
    */

    .tech-card, .service-card, .case-study {
        cursor: pointer;
    }

    .case-study:hover .case-image {
        transform: scale(1.05);
        transition: transform 0.3s ease;
    }

    .case-image {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Apple-style interactive elements and micro-animations
document.addEventListener('DOMContentLoaded', () => {
    // Enhanced card interactions
    document.querySelectorAll('.tech-card, .service-card, .case-study').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px rgba(0, 122, 255, 0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });

        card.addEventListener('click', () => {
            card.style.transform = 'translateY(-15px) scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            }, 100);
        });
    });

    // Enhanced button interactions
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-4px) scale(1.05)';
            btn.style.boxShadow = '0 15px 35px rgba(0, 122, 255, 0.4)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = '';
        });

        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(-2px) scale(1.02)';
        });

        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-4px) scale(1.05)';
        });
    });

    // Magnetic effect for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            link.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0, 0)';
        });
    });

    // Enhanced smooth reveal animation for sections
    const revealSections = () => {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85;

            if (isVisible && !section.classList.contains('revealed')) {
                setTimeout(() => {
                    section.classList.add('revealed');
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, index * 100); // Stagger the animations
            }
        });
    };

    // Initialize enhanced section reveal
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // Enhanced scroll-based animations
    const enhancedScrollAnimations = () => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Parallax effect for backgrounds
        const parallaxElements = document.querySelectorAll('.technology, .services, .case-studies');
        parallaxElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled - element.offsetTop) * speed;
                element.style.backgroundPosition = `center ${yPos}px`;
            }
        });

        // Floating animation for cards
        const cards = document.querySelectorAll('.tech-card, .service-card, .case-study');
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const centerY = rect.top + rect.height / 2;
                const distanceFromCenter = Math.abs(centerY - windowHeight / 2);
                const maxDistance = windowHeight / 2;
                const intensity = Math.max(0, 1 - distanceFromCenter / maxDistance);

                const floatOffset = Math.sin(scrolled * 0.01 + index) * 3 * intensity;
                card.style.transform = `translateY(${floatOffset}px)`;
            }
        });

        revealSections();
    };

    window.addEventListener('scroll', enhancedScrollAnimations);
    enhancedScrollAnimations(); // Initial check

    // Advanced scroll-triggered animations
    initAdvancedScrollAnimations();
});

// Advanced scroll animations inspired by Apple
function initAdvancedScrollAnimations() {
    // DISABLED - Create scroll timeline for hero title (prevents blinking)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // DISABLED scroll animations that affect hero title
        // window.addEventListener('scroll', () => {
        //     const scrolled = window.pageYOffset;
        //     const rate = scrolled * -0.5;
        //     heroTitle.style.transform = `translateY(${rate}px)`;

        //     // Fade out hero content as user scrolls
        //     const opacity = Math.max(0, 1 - scrolled / (window.innerHeight * 0.8));
        //     heroTitle.style.opacity = opacity;
        // });

        // Lock hero title properties to prevent any changes
        heroTitle.style.opacity = "1";
        heroTitle.style.transform = "none";
        heroTitle.style.animation = "none";
        heroTitle.style.transition = "none";
    }

    // Morphing background animation
    const morphingSections = document.querySelectorAll('.technology, .services, .case-studies');
    morphingSections.forEach((section, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    section.classList.add('morphing-background');
                }
            });
        }, { threshold: 0.3 });

        observer.observe(section);
    });

    // Image reveal animations for case studies
    const caseImages = document.querySelectorAll('.case-image');
    caseImages.forEach((image, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        image.style.transform = 'scale(1.1)';
                        image.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

                        setTimeout(() => {
                            image.style.transform = 'scale(1)';
                        }, 800);
                    }, index * 200);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(image);
    });

    // Text reveal animation
    const textElements = document.querySelectorAll('h2, h3, p');
    textElements.forEach((element, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 50);
                }
            });
        }, { threshold: 0.8 });

        observer.observe(element);
    });

    // Scroll-based color transitions
    window.addEventListener('scroll', () => {
        const scrollProgress = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
        const hue = Math.floor(scrollProgress * 60) + 200; // Blue to purple range

        document.documentElement.style.setProperty('--dynamic-color', `hsl(${hue}, 70%, 60%)`);

        // Update glow effects based on scroll
        const glowElements = document.querySelectorAll('.tech-card, .service-card');
        glowElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const screenCenter = window.innerHeight / 2;
            const distance = Math.abs(elementCenter - screenCenter);
            const maxDistance = window.innerHeight / 2;
            const intensity = Math.max(0, 1 - distance / maxDistance);

            element.style.boxShadow = `0 0 ${intensity * 30}px rgba(0, 122, 255, ${intensity * 0.3})`;
        });
    });

    // Magnetic cursor effect for interactive elements
    const magneticElements = document.querySelectorAll('.btn, .tech-card, .service-card');
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const strength = 0.3;
            element.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.05)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}
