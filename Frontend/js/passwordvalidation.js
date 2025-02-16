// Function to toggle password visibility
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;
  }



// Function to validate the registration form
function validateForm() {
    let isValid = true;
  
    // Clear previous error messages
    clearErrors();
  
    // Validate Email
    const email = document.getElementById('email').value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    }
  
    // Validate Password
    const password = document.getElementById('password').value;
    if (!validatePassword(password)) {
      isValid = false;
    }
  
    return isValid;
  }
  
  // Function to validate the password strength
  function validatePassword(password) {
    const minLength = 8;
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*]/;
  
    if (password.length < minLength) {
      showError('password', 'Password must be at least 8 characters long.');
      return false;
    }
  
    if (!upperCase.test(password)) {
      showError('password', 'Password must contain at least one uppercase letter.');
      return false;
    }
  
    if (!lowerCase.test(password)) {
      showError('password', 'Password must contain at least one lowercase letter.');
      return false;
    }
  
    if (!number.test(password)) {
      showError('password', 'Password must contain at least one digit.');
      return false;
    }
  
    if (!specialChar.test(password)) {
      showError('password', 'Password must contain at least one special character (e.g., !@#$%^&*).');
      return false;
    }
  
    return true;
  }
  
  // Function to show error message in red
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');  // Add error class to style with red color
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }
  
  // Function to clear all error messages
  function clearErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.remove());
  }
  