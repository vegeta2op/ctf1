document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        "username": username,
        "password": password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // You can handle the response here as needed
        if (data.message === "Login successful!") {
            window.location.href = '/dashboard'; // Redirect to the dashboard
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
