let selectedSubjects = [];

function setupEventListeners() {
  const subjectInput = document.getElementById('subjects');
  const addBtn = document.querySelector('.btn-add');
  const saveBtn = document.getElementById('save-btn');

  // Handle enter key
  subjectInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  });

  // Add subject when button is clicked
  addBtn?.addEventListener('click', addSubject);
saveBtn?.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const level = document.getElementById('level').value || "Beginner";

  if (!token || !userId) {
    alert("Login expired or invalid. Please log in again.");
    window.location.href = 'index.html';
    return;
  }

  if (selectedSubjects.length < 5) {
    alert("Please add at least 5 subjects.");
    return;
  }

  console.log(" Token:", token);
  console.log(" User ID:", userId);
  console.log("Subjects:", selectedSubjects);

  await savePreferences(userId, token, selectedSubjects, level);
});

}

function addSubject() {
  const input = document.getElementById('subjects');
  const value = input?.value.trim();

  if (!value) return alert('Please enter a subject.');
  if (selectedSubjects.includes(value)) return alert('This subject is already added.');
  if (selectedSubjects.length >= 5) return alert('You can add a maximum of 5 subjects.');

  selectedSubjects.push(value);
  input.value = '';
  displaySubjects();
}

function removeSubject(index) {
  selectedSubjects.splice(index, 1);
  displaySubjects();
}

function displaySubjects() {
  const list = document.getElementById('subjects-list');
  list.innerHTML = '';

  selectedSubjects.forEach((subj, idx) => {
    const li = document.createElement('li');
    li.className = 'subject-item';
    li.innerHTML = `
      <span class="subject-name">${subj}</span>
      <button class="btn-remove" onclick="removeSubject(${idx})">
        <i class="fas fa-times"></i>
      </button>
    `;
    list.appendChild(li);
  });
}

async function loadPreferences(token, userId) {
  const url = `http://localhost:5000/api/preferences/${userId}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.success && data.preferences) {
      selectedSubjects = data.preferences.subjects || [];
      const level = data.preferences.level || "Beginner";
      document.getElementById("level").value = level;
      displaySubjects();
    }
  } catch (err) {
    console.error("Failed to load preferences:", err);
  }
}

async function savePreferences(userId, token, subjects, level) {
  const url = `http://localhost:5000/api/preferences/${userId}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ subjects, level })
    });

    const data = await res.json();
    if (data.success) {
      // Trigger recommendations
      const mlRes = await fetch(`http://localhost:5000/api/ml/recommend/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const mlData = await mlRes.json();
      if (mlData.success) {
        alert("Preferences saved and recommendations generated!");
        window.location.href = "dashboard.html";
      } else {
        alert("Preferences saved, but recommendation generation failed.");
      }
    } else {
      alert(data.message || "Failed to save preferences.");
    }
  } catch (err) {
    console.error("Server error:", err);
    alert("Something went wrong while saving preferences.");
  }
}

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token || !userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
    alert('Please log in again.');
    window.location.href = 'index.html';
    return;
  }

  setupEventListeners();
  await loadPreferences(token, userId);
});
