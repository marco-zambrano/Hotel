// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.classList.add('mobile-menu-button');
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const header = document.querySelector('.header .container');
    const nav = document.querySelector('.main-nav');
    const reserveButton = document.querySelector('.header .btn-primary');
    
    // Only add mobile menu button if screen width is less than 768px
    function checkScreenSize() {
        if (window.innerWidth < 1024 && !document.querySelector('.mobile-menu-button')) {
            header.insertBefore(mobileMenuButton, nav);
            nav.style.display = 'none';
            if (reserveButton) {
                reserveButton.style.display = 'none';
            }
        } else if (window.innerWidth >= 1024) {
            if (document.querySelector('.mobile-menu-button')) {
                document.querySelector('.mobile-menu-button').remove();
            }
            nav.style.display = 'block';
            if (reserveButton) {
                reserveButton.style.display = 'inline-block';
            }
        }
    }
    
    // Check on load
    checkScreenSize();
    
    // Check on resize
    window.addEventListener('resize', checkScreenSize);
    
    // Toggle menu when button is clicked
    document.addEventListener('click', function(e) {
        if (e.target.closest('.mobile-menu-button')) {
            const isOpen = nav.style.display === 'block';
            nav.style.display = isOpen ? 'none' : 'block';
            // Cambiar el ícono del botón
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-bars' : 'fas fa-times';
            }
        } else if (window.innerWidth < 1024 && nav.style.display === 'block') {
            // Si el clic fue fuera del menú y del botón, y el menú está abierto
            nav.style.display = 'none';
            // Restaurar el ícono del botón
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth < 1024) {
                    nav.style.display = 'none';
                }
            }
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                alert('¡Gracias por su mensaje! Nos pondremos en contacto con usted pronto.');
                this.reset();
            } else {
                alert('Por favor, complete todos los campos del formulario.');
            }
        });
    }
    
    // Newsletter subscription
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('¡Gracias por suscribirse a nuestro boletín!');
                emailInput.value = '';
            } else {
                alert('Por favor, introduzca una dirección de correo electrónico válida.');
                emailInput.style.borderColor = 'red';
            }
        });
    }
    
    // Add active class to current section in navigation
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Adjust for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Add active class to navigation on scroll
    window.addEventListener('scroll', highlightCurrentSection);
    
    // Initialize gallery image lightbox effect
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // In a real implementation, this would open a lightbox
            alert('En una implementación real, aquí se abriría una galería lightbox con la imagen ampliada.');
        });
    });

    // Fecha mínima para check-in (hoy)
    const today = new Date().toISOString().split('T')[0];
    const checkIn = document.getElementById('check-in');
    const checkOut = document.getElementById('check-out');

    // Configurar fechas mínimas
    checkIn.min = today;
    checkIn.value = today;
    
    // Actualizar fecha mínima de check-out cuando cambie check-in
    checkIn.addEventListener('change', function() {
        const nextDay = new Date(this.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOut.min = nextDay.toISOString().split('T')[0];
        
        // Si la fecha de salida es menor que la nueva fecha mínima, actualizarla
        if (checkOut.value < checkOut.min) {
            checkOut.value = checkOut.min;
        }
    });

    // Establecer fecha inicial de check-out (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkOut.min = tomorrow.toISOString().split('T')[0];
    checkOut.value = checkOut.min;

    // Selector de huéspedes
    const guestsSelector = document.querySelector('.guests-selector');
    const guestsDisplay = document.getElementById('guests-display');
    const guestsDropdown = document.querySelector('.guests-dropdown');
    let adultsCount = 0;
    let childrenCount = 0;

    // Mostrar/ocultar dropdown al hacer clic en el selector
    guestsDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        guestsDropdown.style.display = guestsDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!guestsSelector.contains(e.target)) {
            guestsDropdown.style.display = 'none';
        }
    });

    // Manejar los contadores de huéspedes
    document.querySelectorAll('.counter-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.dataset.action;
            const type = this.dataset.type;
            const countElement = this.parentElement.querySelector('.count');
            let count = parseInt(countElement.textContent);

            if (action === 'increase') {
                if ((type === 'adults' && count < 4) || (type === 'children' && count < 4)) {
                    count++;
                }
            } else if (action === 'decrease' && count > 0) {
                count--;
            }

            // Actualizar el contador
            countElement.textContent = count;

            // Actualizar las variables globales
            if (type === 'adults') {
                adultsCount = count;
            } else {
                childrenCount = count;
            }

            // Actualizar el texto del display
            updateGuestsDisplay();
        });
    });

    function updateGuestsDisplay() {
        const displayText = `${adultsCount} Adulto${adultsCount !== 1 ? 's' : ''}, ${childrenCount} Niño${childrenCount !== 1 ? 's' : ''}`;
        guestsDisplay.querySelector('span').textContent = displayText;
    }

    // Función para manejar la animación de las cards
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Una vez que el elemento es visible, ya no necesitamos observarlo
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todas las cards y la imagen del about
    const roomCards = document.querySelectorAll('.room-card');
    const serviceCards = document.querySelectorAll('.service-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const aboutImage = document.querySelector('.about-image');
    
    // Observar cada card de habitaciones
    roomCards.forEach(card => {
        observer.observe(card);
    });

    // Observar cada card de servicios
    serviceCards.forEach(card => {
        observer.observe(card);
    });

    // Observar cada card de testimonios
    testimonialCards.forEach(card => {
        observer.observe(card);
    });

    // Observar la imagen del about
    if (aboutImage) {
        observer.observe(aboutImage);
    }
});