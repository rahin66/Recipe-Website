fetch('/api/user-info')
            .then(response => response.json())
            .then(data => {
                const userGreeting = document.getElementById('userGreeting');
                const authButton = document.getElementById('authButton');
                if (data.username) {
                    userGreeting.innerHTML = `Hello, ${data.username}`;
                    authButton.innerHTML = 'Logout';
                    authButton.href = '/logout';
                } else {
                    userGreeting.innerHTML = '';
                    authButton.innerHTML = 'Login';
                    authButton.href = '/login.html';
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });