function showPopup() {
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}


function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // For demonstration purpose, output the email and password (you can remove this in actual use)
    console.log('Email:', email);
    console.log('Password:', password);

    // Redirect to ClientDashboard.html
    window.location.href = 'ClientDashboard.html';
}