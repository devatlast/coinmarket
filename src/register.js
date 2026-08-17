const registerForm = document.getElementById('registerForm');

const message = document.getElementById('message');

registerForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const name = document.getElementById('name').value;

    const email = document.getElementById('email').value;

    const password = document.getElementById('password').value;

    try {

        const response = await fetch('https://transcation-wallet-spa-backend.vercel.app/auth/register', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({

                name,

                email,

                password

            })

        });

        const data = await response.json();

        if (!response.ok) {

            message.textContent = data.message || 'Registration failed';

            return;

        }

        message.textContent =

            'Account created! Check your email to verify your account.';

        registerForm.reset();

    } catch (error) {

        console.error(error);

        message.textContent =

            'Unable to connect to the server.';

    }

});