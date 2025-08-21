// DOM Elements
const scrollToTopBtn = document.getElementById('scrollToTop');
const newsletterForm = document.getElementById('newsletterForm');
const submitBtn = document.getElementById('submitBtn');
const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const formSuccess = document.getElementById('formSuccess');

// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, wait) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  }
};

// Validation Functions
const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.trim().length > 50) {
    return 'Name must not exceed 50 characters';
  }
  if (!nameRegex.test(name.trim())) {
    return 'Name can only contain letters and spaces';
  }
  return '';
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  if (email.length > 254) {
    return 'Email address is too long';
  }
  return '';
};

// Error Display Functions
const showError = (errorElement, message) => {
  errorElement.textContent = message;
  errorElement.classList.add('show');
};

const hideError = (errorElement) => {
  errorElement.textContent = '';
  errorElement.classList.remove('show');
};

// Form State Management
const setButtonState = (state) => {
  submitBtn.classList.remove('loading', 'success');
  submitBtn.disabled = false;
  
  switch (state) {
    case 'loading':
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      break;
    case 'success':
      submitBtn.classList.add('success');
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.classList.remove('success');
        submitBtn.disabled = false;
      }, 3000);
      break;
  }
};

const showSuccess = () => {
  formSuccess.classList.add('show');
  setTimeout(() => {
    formSuccess.classList.remove('show');
  }, 5000);
};

// Scroll to Top Functionality
const handleScroll = throttle(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const shouldShow = scrollTop > 300;
  
  if (shouldShow && !scrollToTopBtn.classList.contains('visible')) {
    scrollToTopBtn.classList.add('visible');
  } else if (!shouldShow && scrollToTopBtn.classList.contains('visible')) {
    scrollToTopBtn.classList.remove('visible');
  }
}, 100);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Form Submission Handler
const handleFormSubmit = async (e) => {
  e.preventDefault();
  
  // Reset previous errors
  hideError(nameError);
  hideError(emailError);
  
  // Get form values
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  
  // Validate inputs
  const nameValidationError = validateName(name);
  const emailValidationError = validateEmail(email);
  
  let hasErrors = false;
  
  if (nameValidationError) {
    showError(nameError, nameValidationError);
    hasErrors = true;
  }
  
  if (emailValidationError) {
    showError(emailError, emailValidationError);
    hasErrors = true;
  }
  
  if (hasErrors) {
    // Focus on first error field
    if (nameValidationError) {
      nameInput.focus();
    } else if (emailValidationError) {
      emailInput.focus();
    }
    return;
  }
  
  // Simulate form submission
  setButtonState('loading');
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success state
    setButtonState('success');
    showSuccess();
    
    // Reset form
    setTimeout(() => {
      newsletterForm.reset();
    }, 1000);
    
    // Analytics tracking (placeholder)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'newsletter_signup', {
        event_category: 'engagement',
        event_label: 'footer_form'
      });
    }
    
  } catch (error) {
    // Error state
    setButtonState('default');
    showError(emailError, 'Something went wrong. Please try again.');
    console.error('Form submission error:', error);
  }
};

// Real-time Validation
const handleNameInput = debounce(() => {
  const name = nameInput.value.trim();
  if (name) {
    const error = validateName(name);
    if (error) {
      showError(nameError, error);
    } else {
      hideError(nameError);
    }
  } else {
    hideError(nameError);
  }
}, 500);

const handleEmailInput = debounce(() => {
  const email = emailInput.value.trim();
  if (email) {
    const error = validateEmail(email);
    if (error) {
      showError(emailError, error);
    } else {
      hideError(emailError);
    }
  } else {
    hideError(emailError);
  }
}, 500);

// Smooth scrolling for anchor links
const handleAnchorClick = (e) => {
  const target = e.target.closest('a[href^="#"]');
  if (!target) return;
  
  const href = target.getAttribute('href');
  if (href === '#') return;
  
  const targetElement = document.querySelector(href);
  if (targetElement) {
    e.preventDefault();
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Intersection Observer for animations
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe footer sections
  document.querySelectorAll('.footer-section').forEach(section => {
    observer.observe(section);
  });
  
  // Observe tech categories
  document.querySelectorAll('.tech-category').forEach(category => {
    observer.observe(category);
  });
};

// Keyboard navigation enhancement
const enhanceKeyboardNavigation = () => {
  // Trap focus in forms when submitted
  const trapFocus = (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  };
  
  // Apply focus trap to newsletter form
  trapFocus(newsletterForm);
};

// Performance monitoring
const measurePerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        console.log('Page load time:', loadTime + 'ms');
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
          gtag('event', 'timing_complete', {
            name: 'load',
            value: Math.round(loadTime)
          });
        }
      }, 0);
    });
  }
};

// Local storage for form persistence
const saveFormData = () => {
  const formData = {
    name: nameInput.value,
    email: emailInput.value,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem('newsletterFormData', JSON.stringify(formData));
  } catch (e) {
    console.warn('Could not save form data to localStorage:', e);
  }
};

const loadFormData = () => {
  try {
    const saved = localStorage.getItem('newsletterFormData');
    if (saved) {
      const formData = JSON.parse(saved);
      
      // Only restore if saved within last hour
      if (Date.now() - formData.timestamp < 3600000) {
        nameInput.value = formData.name || '';
        emailInput.value = formData.email || '';
      } else {
        localStorage.removeItem('newsletterFormData');
      }
    }
  } catch (e) {
    console.warn('Could not load form data from localStorage:', e);
  }
};

const clearFormData = () => {
  try {
    localStorage.removeItem('newsletterFormData');
  } catch (e) {
    console.warn('Could not clear form data from localStorage:', e);
  }
};

// Theme detection and handling
const handleThemeChange = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e) => {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  };
  
  handleChange(mediaQuery);
  mediaQuery.addEventListener('change', handleChange);
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize
  loadFormData();
  observeElements();
  enhanceKeyboardNavigation();
  measurePerformance();
  handleThemeChange();
  
  // Scroll events
  window.addEventListener('scroll', handleScroll);
  scrollToTopBtn.addEventListener('click', scrollToTop);
  
  // Form events
  newsletterForm.addEventListener('submit', handleFormSubmit);
  nameInput.addEventListener('input', handleNameInput);
  emailInput.addEventListener('input', handleEmailInput);
  
  // Save form data on input
  nameInput.addEventListener('input', debounce(saveFormData, 1000));
  emailInput.addEventListener('input', debounce(saveFormData, 1000));
  
  // Clear form data on successful submission
  newsletterForm.addEventListener('submit', () => {
    setTimeout(clearFormData, 3000);
  });
  
  // Smooth scrolling for anchor links
  document.addEventListener('click', handleAnchorClick);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape key to close any open modals or reset forms
    if (e.key === 'Escape') {
      if (formSuccess.classList.contains('show')) {
        formSuccess.classList.remove('show');
      }
    }
    
    // Ctrl/Cmd + K to focus on email input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      emailInput.focus();
    }
  });
  
  // Handle form reset
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.activeElement && 
        (document.activeElement === nameInput || document.activeElement === emailInput)) {
      newsletterForm.reset();
      hideError(nameError);
      hideError(emailError);
      formSuccess.classList.remove('show');
      clearFormData();
    }
  });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, save form data
    saveFormData();
  }
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
  // Save form data before page unload
  saveFormData();
  
  // Show warning if form has unsaved data
  const hasUnsavedData = nameInput.value.trim() || emailInput.value.trim();
  if (hasUnsavedData && !formSuccess.classList.contains('show')) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    return e.returnValue;
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('Connection restored');
  // Could show a notification or retry failed submissions
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
  // Could show offline mode notification
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateName,
    validateEmail,
    debounce,
    throttle
  };
}