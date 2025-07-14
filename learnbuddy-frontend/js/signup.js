document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const errorBox = document.getElementById('signup-error');
  const btn = document.getElementById('signup-btn');
  const spinner = document.getElementById('signup-spinner');
  const btnText = document.getElementById('signup-btn-text');

  errorBox.style.display = 'none';
  btn.disabled = true;
  spinner.style.display = 'inline-block';
  btnText.textContent = 'Creating account...';

  try {
    console.log('Attempting signup...');
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Network error occurred' }));
      throw new Error(errorData.message || 'Signup failed');
    }

    const data = await res.json();
    console.log('Signup response:', data);

    // Store user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    console.log('Signup successful, redirecting...');
    window.location.href = 'index.html';
  } catch (err) {
    console.error('Signup error:', err);
    errorBox.textContent = err.message || 'Failed to connect to server. Please try again.';
    errorBox.style.display = 'block';
  } finally {
    btn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent = 'Sign Up';
  }
});

// Toggle between login and signup forms
document.getElementById('show-signup').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('signup-container').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}); 