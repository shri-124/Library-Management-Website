// function login() {
//     event.preventDefault();  // Prevent the default form submission behavior

//     var email = document.getElementById('email').value;
//     var password = document.getElementById('password').value;

//     var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
//     if (!emailPattern.test(email)) {
//         alert('Please enter a valid email address.');
//         return false;  // Stop here if validation fails
//     }

  
//     // If all checks pass, you can submit the form programmatically:
//     document.querySelector('.login-form').submit();
//     return true;
// }


document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Constructing the fetch request to send the email and password
    try {
        const response = await fetch('/verify-client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const result = await response.json();

        if (response.ok && result.authorized) {
            window.location.href = 'ClientDashboard.html'; // Redirect on successful login
        } else {
            alert('Invalid email or password. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed due to server error. Please try again later.');
    }
});
