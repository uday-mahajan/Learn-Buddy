document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
      alert("All fields are required.");
      return;
    }

    try {
      console.log("Attempting signup...");

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup successful:", data);

      // Store token and user ID in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);  // Make sure backend returns `user.id`

      // Redirect to preferences.html
      window.location.href = "preferences.html";
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error: " + error.message);
    }
  });
});
