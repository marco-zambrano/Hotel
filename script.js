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
            // change the icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-bars' : 'fas fa-times';
            }
        } else if (window.innerWidth < 1024 && nav.style.display === 'block') {
            // if the click was outside the menu and the button, and the menu is open
            nav.style.display = 'none';
            // restore the button icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });
    
    // minimum date for check-in (today)
    const today = new Date().toISOString().split('T')[0];
    const checkIn = document.getElementById('check-in');
    const checkOut = document.getElementById('check-out');

    // configure minimum dates
    checkIn.min = today;
    checkIn.value = today;
    
    // update minimum date of check-out when check-in changes
    checkIn.addEventListener('change', function() {
        const nextDay = new Date(this.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOut.min = nextDay.toISOString().split('T')[0];
        
        // if the check-out date is less than the new minimum date, update it
        if (checkOut.value < checkOut.min) {
            checkOut.value = checkOut.min;
        }
    });

    // set initial check-out date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkOut.min = tomorrow.toISOString().split('T')[0];
    checkOut.value = checkOut.min;

    // guests selector
    const guestsSelector = document.querySelector('.guests-selector');
    const guestsDisplay = document.getElementById('guests-display');
    const guestsDropdown = document.querySelector('.guests-dropdown');
    let adultsCount = 0;
    let childrenCount = 0;

    // show/hide dropdown when clicking on the selector
    guestsDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        guestsDropdown.style.display = guestsDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!guestsSelector.contains(e.target)) {
            guestsDropdown.style.display = 'none';
        }
    });

    // handle the guests counters
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

            // update the counter
            countElement.textContent = count;

            // update the global variables
            if (type === 'adults') {
                adultsCount = count;
            } else {
                childrenCount = count;
            }

            // update the display text
            updateGuestsDisplay();
        });
    });

    function updateGuestsDisplay() {
        const displayText = `${adultsCount} Adulto${adultsCount !== 1 ? 's' : ''}, ${childrenCount} Niño${childrenCount !== 1 ? 's' : ''}`;
        guestsDisplay.querySelector('span').textContent = displayText;
    }

    // function to handle the cards animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // once the element is visible, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // observe all cards and the about image
    const roomCards = document.querySelectorAll('.room-card');
    const serviceCards = document.querySelectorAll('.service-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const aboutImage = document.querySelector('.about-image');
    
    // observe each room card
    roomCards.forEach(card => {
        observer.observe(card);
    });

    // observe each service card
    serviceCards.forEach(card => {
        observer.observe(card);
    });

    // observe each testimonial card
    testimonialCards.forEach(card => {
        observer.observe(card);
    });

    // observe the about image
    if (aboutImage) {
        observer.observe(aboutImage);
    }
});