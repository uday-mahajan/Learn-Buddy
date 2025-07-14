// learnbuddy-frontend/login.js

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const errorBox = document.getElementById('login-error');
  const btn      = document.getElementById('login-btn');
  const spinner  = document.getElementById('login-spinner');
  const btnText  = document.getElementById('login-btn-text');

  // Reset UI
  errorBox.style.display     = 'none';
  btn.disabled               = true;
  spinner.style.display      = 'inline-block';
  btnText.textContent        = 'Logging in...';

  try {
    console.log('Attempting login to:', 'http://localhost:5000/api/auth/login');
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    // HTTP status check
    if (!res.ok) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    // Pick whichever userId field exists
    const loggedInUserId = (data.user && (data.user._id || data.user.id));
    if (!data.token || !loggedInUserId) {
      throw new Error('Invalid login response');
    }

    // Persist auth info
    localStorage.setItem('token',  data.token);
    localStorage.setItem('userId', loggedInUserId);
    localStorage.setItem('user',   JSON.stringify(data.user));

    console.log('Login successful, redirecting...');
    window.location.href = 'preferences.html';
  } catch (err) {
    console.error('Login error details:', err);
    let message = 'Failed to connect to server. Please try again.';
    if (err.message.includes('Failed to fetch')) {
      message = 'Unable to connect to the server. Please check if it’s running.';
    } else {
      message = err.message;
    }
    errorBox.textContent   = message;
    errorBox.style.display = 'block';
  } finally {
    btn.disabled         = false;
    spinner.style.display = 'none';
    btnText.textContent  = 'Log In';
  }
});
