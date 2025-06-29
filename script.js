// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click animation to social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 100);
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // Add parallax effect to background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body');
        const speed = scrolled * 0.5;
        
        parallax.style.backgroundPosition = `center ${speed}px`;
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Form submission handling
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', handleFormSubmission);
    }
});

// Form submission handler
async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('clientName'),
        email: formData.get('clientEmail'),
        phone: formData.get('clientPhone'),
        serviceType: formData.get('serviceType'),
        budget: formData.get('projectBudget'),
        description: formData.get('projectDescription'),
        deadline: formData.get('projectDeadline')
    };
    
    // Validate form
    if (!validateFormData(data)) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        return;
    }
    
    try {
        // Send email
        await sendEmail(data);
        
        // Send WhatsApp message
        await sendWhatsApp(data);
        
        // Show success message
        showSuccessMessage('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showErrorMessage('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
        // Hide loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Form validation
function validateFormData(data) {
    let isValid = true;
    const form = document.getElementById('serviceForm');
    
    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    });
    
    // Validate each field
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key === 'name' ? 'clientName' : key === 'email' ? 'clientEmail' : key === 'phone' ? 'clientPhone' : key}"]`);
        const formGroup = input?.closest('.form-group');
        
        if (!data[key] || data[key].trim() === '') {
            if (formGroup) {
                formGroup.classList.add('error');
                showFieldError(formGroup, 'هذا الحقل مطلوب');
            }
            isValid = false;
        } else if (key === 'email' && !isValidEmail(data[key])) {
            if (formGroup) {
                formGroup.classList.add('error');
                showFieldError(formGroup, 'يرجى إدخال بريد إلكتروني صحيح');
            }
            isValid = false;
        } else if (key === 'phone' && !isValidPhone(data[key])) {
            if (formGroup) {
                formGroup.classList.add('error');
                showFieldError(formGroup, 'يرجى إدخال رقم هاتف صحيح');
            }
            isValid = false;
        } else if (formGroup) {
            formGroup.classList.add('success');
        }
    });
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Show field error
function showFieldError(formGroup, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

// Send email using PHP service
// Send email using Netlify Function
async function sendEmail(data) {
    const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return await response.json();
}


// Send WhatsApp message
async function sendWhatsApp(data) {
    const message = `
🔥 *طلب خدمة جديد من موقع NXT4* 🔥

👤 *الاسم:* ${data.name}
📧 *البريد الإلكتروني:* ${data.email}
📱 *رقم الهاتف:* ${data.phone}
🛠️ *نوع الخدمة:* ${getServiceTypeName(data.serviceType)}
💰 *الميزانية:* ${data.budget}
📅 *الموعد النهائي:* ${data.deadline}

📝 *وصف المشروع:*
${data.description}

---
تم الإرسال تلقائياً من موقع NXT4
    `.trim();
    
    const whatsappUrl = `https://wa.me/01277576772?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab (this will work on mobile and desktop)
    window.open(whatsappUrl, '_blank');
    
    return Promise.resolve();
}

// Get service type name in Arabic
function getServiceTypeName(serviceType) {
    const serviceTypes = {
        'frontend': 'تطوير واجهات المستخدم',
        'backend': 'تطوير الخادم',
        'mobile': 'تطبيقات الهاتف المحمول',
        'api': 'تطوير واجهات برمجة التطبيقات',
        'database': 'تصميم قواعد البيانات',
        'devops': 'النشر والإدارة السحابية',
        'fullstack': 'حلول متكاملة'
    };
    return serviceTypes[serviceType] || serviceType;
}

// Show success message
function showSuccessMessage(message) {
    const form = document.getElementById('serviceForm');
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) existingMessage.remove();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    form.appendChild(successDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const form = document.getElementById('serviceForm');
    const existingMessage = form.querySelector('.error-message');
    if (existingMessage) existingMessage.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.marginTop = '1rem';
    errorDiv.textContent = message;
    form.appendChild(errorDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Add mobile menu functionality (if needed in future)
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Add scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }
});


// Advanced Animations and Interactions

// Scroll Progress Indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Enhanced Scroll Animations
function initAdvancedScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Stagger animations for child elements
                const children = entry.target.querySelectorAll('.service-card, .team-member');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
}

// Particle Mouse Trail Effect
function createMouseTrail() {
    const trail = [];
    const trailLength = 10;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (trail.length > trailLength) {
            trail.shift();
        }
        
        // Remove old particles
        document.querySelectorAll('.mouse-particle').forEach(particle => {
            const age = Date.now() - parseInt(particle.dataset.time);
            if (age > 1000) {
                particle.remove();
            }
        });
        
        // Create new particle
        if (Math.random() > 0.8) {
            createParticle(e.clientX, e.clientY);
        }
    });
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'mouse-particle';
    particle.dataset.time = Date.now();
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: rgba(0, 191, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: particleFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
}

// Add particle fade animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(style);

// Enhanced Form Interactions
function enhanceFormInteractions() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add floating label effect
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            input.addEventListener('focus', () => {
                label.style.transform = 'translateY(-25px) scale(0.8)';
                label.style.color = '#00bfff';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = '#ffffff';
                }
            });
        }
        
        // Add ripple effect on focus
        input.addEventListener('focus', (e) => {
            createRipple(e.target);
        });
    });
}

function createRipple(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 191, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Smooth Page Transitions
function initPageTransitions() {
    // Add page load animation
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    window.addEventListener('load', () => {
        document.body.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    });
}

// Enhanced Service Card Interactions
function enhanceServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add glow effect
            card.style.boxShadow = '0 20px 40px rgba(0, 191, 255, 0.4), 0 0 20px rgba(0, 191, 255, 0.2)';
            
            // Animate other cards
            serviceCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.opacity = '0.7';
                    otherCard.style.transform = 'scale(0.95)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset all cards
            serviceCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
                otherCard.style.transform = 'scale(1)';
            });
        });
    });
}

// Team Member Card Flip Effect
function enhanceTeamMembers() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('click', () => {
            member.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                member.style.transform = 'rotateY(0deg)';
            }, 600);
        });
    });
}

// Initialize all advanced features
document.addEventListener('DOMContentLoaded', () => {
    createScrollProgress();
    initAdvancedScrollAnimations();
    createMouseTrail();
    enhanceFormInteractions();
    initPageTransitions();
    enhanceServiceCards();
    enhanceTeamMembers();
});

// Performance optimization for animations
function optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.style.animationPlayState = 'paused';
        } else {
            document.body.style.animationPlayState = 'running';
        }
    });
}

// Call optimization function
optimizeAnimations();

