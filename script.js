const API_URL = "";

// ----------------------------
// PATIENT FORM (index.html)
// ----------------------------
const patientForm = document.getElementById("patientForm");

if (patientForm) {
  patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    // Helper to collect checkbox values
    const getCheckedValues = (name) => {
      return [...form.querySelectorAll(`input[name="${name}"]:checked`)]
        .map(el => el.value.trim())
        .join(", ");
    };

    const payload = {
      patient_id: form.patient_id.value.trim(),
      name: form.name.value.trim(),
      taste_preferences: getCheckedValues("taste_pref"),
      texture_likes: getCheckedValues("texture_like"),
      dietary_restriction: form.dietary_restriction.value.trim(),
      symptoms: getCheckedValues("symptom"),
      sensory_sweet: parseInt(form.sensory_sweet.value),
      sensory_salty: parseInt(form.sensory_salty.value),
      sensory_bitter: parseInt(form.sensory_bitter.value),
      sensory_umami: parseInt(form.sensory_umami.value),
      sensory_sour: parseInt(form.sensory_sour.value),
      known_deficits: form.known_deficits.value.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/patients/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message || "✅ Patient data submitted successfully!");
      form.reset();
    } catch (err) {
      alert("❌ Failed to submit patient data. Check the console.");
      console.error("Submit Error:", err);
    }
  });
}

// ----------------------------
// LLM QUERY FORM (query.html)
// ----------------------------
const queryForm = document.getElementById("queryForm");

if (queryForm) {
  queryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const payload = {
      patient_id: form.patient_id.value.trim(),
      name: form.name.value.trim(),
      query: form.query.value.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const resultBox = document.getElementById("resultBox");

      if (data.recommendation) {
        resultBox.textContent = data.recommendation;
      } else if (data.error) {
        resultBox.textContent = "⚠️ " + data.error;
      } else {
        resultBox.textContent = "⚠️ No recommendation received.";
      }
    } catch (err) {
      console.error("Query Error:", err);
      const resultBox = document.getElementById("resultBox");
      resultBox.textContent = "❌ Network error while querying. Check server.";
    }
  });
}

// ----------------------------
// FEEDBACK FORM (feedback.html)
// ----------------------------
const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const payload = {
      patient_id: form.patient_id.value.trim(),
      recipe_name: form.recipe_name.value.trim(),
      feedback_text: form.feedback_text.value.trim()
    };

    console.log("Submitting feedback:", payload); // Debug

    try {
      const res = await fetch(`${API_URL}/feedback/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const statusBox = document.getElementById("feedbackStatus");

      if (data.message) {
        statusBox.textContent = "✅ " + data.message;
        form.reset();
      } else {
        statusBox.textContent = "⚠️ Submission failed.";
      }
    } catch (err) {
      console.error("Feedback Error:", err);
      document.getElementById("feedbackStatus").textContent = "❌ Network error. Try again.";
    }
  });
}
