document.addEventListener('DOMContentLoaded', () => {
    const loginSectionContainer = document.getElementById('login-section-container');

    if (loginSectionContainer) {
        fetch('partials/login-section.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                loginSectionContainer.innerHTML = html;
                initializeLoginSection();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                // Fallback to initializeLoginSection if fetch fails
                initializeLoginSection();
            });
    } else {
        initializeLoginSection();
    }

    function initializeLoginSection() {
        const loginForm = document.getElementById('login-form');
        const passwordInput = document.getElementById('password');
        const passwordStrength = document.getElementById('password-strength');
        const loginMessage = document.getElementById('login-message');
        const googleUserInfo = document.getElementById('google-user-info');

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                const strength = getPasswordStrength(passwordInput.value);
                passwordStrength.textContent = `Password strength: ${strength}`;
                passwordStrength.style.color = getStrengthColor(strength);
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const strength = getPasswordStrength(password);

                if (email && password.length >= 8 && strength !== 'Weak' && strength !== 'Too short') {
                    loginMessage.textContent = 'Login successful!';
                    loginMessage.style.color = 'green';
                    // Redirect to the success page
                    window.location.href = 'success.html';
                } else {
                    loginMessage.textContent = 'All fields are required and password must be at least 8 characters and not weak.';
                    loginMessage.style.color = 'red';
                }
            });
        }

        window.onSignIn = function(response) {
            const credential = response.credential;
            const user = parseJwt(credential);
            const userInfoHtml = `
                <p><strong>ID:</strong> ${user.sub}</p>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <img src="${user.picture}" alt="Profile Image">
            `;
            googleUserInfo.innerHTML = userInfoHtml;
        };

        function parseJwt(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }

        function getPasswordStrength(password) {
            if (password.length < 8) {
                return 'Too short';
            }
            let strength = 0;
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;
            switch (strength) {
                case 1:
                    return 'Weak';
                case 2:
                    return 'Average';
                case 3:
                    return 'Strong';
                case 4:
                    return 'Very strong';
                default:
                    return 'Weak';
            }
        }

        function getStrengthColor(strength) {
            switch (strength) {
                case 'Too short':
                    return 'red';
                case 'Weak':
                    return 'orange';
                case 'Average':
                    return 'yellow';
                case 'Strong':
                    return 'green';
                case 'Very strong':
                    return 'darkgreen';
                default:
                    return 'red';
            }
        }
    }
});