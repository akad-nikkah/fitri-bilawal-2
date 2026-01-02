// DOM Elements
const cardCover = document.getElementById('cardCover');
const cardContent = document.getElementById('cardContent');
const giftButton = document.getElementById('giftButton');
const closeButton = document.getElementById('closeButton');
const copyButtons = document.querySelectorAll('.copy-btn');
const toast = document.getElementById('toast');

// State management
let isCardOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    createFloatingElements();
    addTouchSupport();
});

// Event Listeners
function initializeEventListeners() {
    // Open card when gift button is clicked
    giftButton.addEventListener('click', openCard);
    
    // Close card when close button is clicked
    closeButton.addEventListener('click', closeCard);
    
    // Close card when clicking outside (on card cover)
    cardCover.addEventListener('click', function(e) {
        if (e.target === cardCover && isCardOpen) {
            closeCard();
        }
    });
    
    // Copy functionality for all copy buttons
    copyButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const textToCopy = this.getAttribute('data-copy');
        copyToClipboard(textToCopy, e); // kirim event ke fungsi
    });
});
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isCardOpen) {
            closeCard();
        }
    });
    
    // Add click animation to payment items
    const paymentItems = document.querySelectorAll('.payment-item');
    paymentItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Card Animation Functions
function openCard() {
    if (isCardOpen) return;
    
    isCardOpen = true;
    
    // Add opening animation class
    cardCover.classList.add('opening');
    
    // Start the flip animation
    setTimeout(() => {
        cardCover.classList.add('hidden');
        cardContent.classList.add('active');
        
        // Add stagger animation to payment items
        animatePaymentItems();
    }, 100);
    
    // Add body class to prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Play opening sound effect (if needed)
    playOpenSound();
}

function closeCard() {
    if (!isCardOpen) return;
    
    isCardOpen = false;
    
    // Reverse the animation
    cardContent.classList.remove('active');
    
    setTimeout(() => {
        cardCover.classList.remove('hidden', 'opening');
        
        // Reset payment items animation
        resetPaymentItemsAnimation();
    }, 400);
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    // Play closing sound effect (if needed)
    playCloseSound();
}

// Payment Items Animation
function animatePaymentItems() {
    const paymentItems = document.querySelectorAll('.payment-item');
    
    paymentItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.320, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
}

function resetPaymentItemsAnimation() {
    const paymentItems = document.querySelectorAll('.payment-item');
    
    paymentItems.forEach(item => {
        item.style.transition = '';
        item.style.opacity = '';
        item.style.transform = '';
    });
}

// Copy to Clipboard Function
async function copyToClipboard(text, event) {
    try {
        // Modern browsers
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
        
        showToast('Nomor berhasil disalin!');
        
        // Add visual feedback to the copy button
        const copyBtn = event.target.closest('.copy-btn');
        if (copyBtn) {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = 'rgba(34, 197, 94, 0.2)';
            copyBtn.style.color = '#22c55e';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
            }, 2000);
        }
        
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showToast('Gagal menyalin nomor');
    }
}

// Toast Notification
function showToast(message) {
    const toastText = toast.querySelector('span');
    toastText.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Floating Elements Animation
function createFloatingElements() {
    const container = document.querySelector('.bg-decoration');
    
    // Create additional floating elements
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.position = 'absolute';
        element.style.width = Math.random() * 10 + 5 + 'px';
        element.style.height = element.style.width;
        element.style.background = 'rgba(255, 255, 255, 0.1)';
        element.style.borderRadius = '50%';
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animation = `floatRandom ${Math.random() * 10 + 5}s ease-in-out infinite`;
        element.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(element);
    }
}

// Touch Support for Mobile
function addTouchSupport() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    cardContent.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    cardContent.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 100;
        const swipeDistance = touchStartY - touchEndY;
        
        // Swipe down to close (when at top of content)
        if (swipeDistance < -swipeThreshold && cardContent.scrollTop === 0) {
            closeCard();
        }
    }
}

// Sound Effects (Optional)
function playOpenSound() {
    // Create a subtle sound effect for opening
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playCloseSound() {
    // Create a subtle sound effect for closing
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Particle Effect on Button Click
function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const particles = [];
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(255, 255, 255, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        particles.push(particle);
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let opacity = 1;
        let x = rect.left + rect.width / 2;
        let y = rect.top + rect.height / 2;
        
        const animate = () => {
            x += vx * 0.016;
            y += vy * 0.016;
            opacity -= 0.02;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(particle);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Add particle effect to gift button
giftButton.addEventListener('click', function() {
    createParticleEffect(this);
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes floatRandom {
        0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.1;
        }
        25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-10px) translateX(-15px) rotate(180deg);
            opacity: 0.2;
        }
        75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
            opacity: 0.4;
        }
    }
    
    .card-cover.opening {
        animation: cardPulse 0.3s ease-out;
    }
    
    @keyframes cardPulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized resize handler
const handleResize = debounce(() => {
    // Handle any resize-specific logic here
    if (window.innerWidth < 480) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}, 250);

window.addEventListener('resize', handleResize);

// Initial mobile check
handleResize();
