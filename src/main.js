import './style.css';



const loginForm = document.querySelector('#loginForm');

const message = document.querySelector('#message');

loginForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const email = document.querySelector('#email').value;

  const password = document.querySelector('#password').value;

  message.textContent = 'Logging in...';

  try {

    const response = await fetch('https://transcation-wallet-spa-backend.vercel.app/auth/login', {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json'

      },

      body: JSON.stringify({

        email,

        password

      })

    });

    const data = await response.json();

    if (!response.ok) {

      message.textContent = data.message || 'Login failed';

      return;

    }

    // Save JWT

    localStorage.setItem('token', data.token);
    window.location.href = 'dashboard.html';

    message.textContent = 'Login successful!';

    console.log(data);

  } catch (error) {

    console.error(error);

    message.textContent = 'Could not connect to server';

  }

});