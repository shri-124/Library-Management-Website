function login() {
    event.preventDefault();  // Prevent the default form submission behavior

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return false;  // Stop here if validation fails
    }

  
    // If all checks pass, you can submit the form programmatically:
    document.querySelector('.login-form').submit();
    return true;
}
