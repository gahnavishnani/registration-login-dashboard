function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}
function populateCities() {
  const state = document.getElementById("state").value;
  const city = document.getElementById("city");
  city.innerHTML = '<option value="">Select City</option>';
  const cities = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bengaluru", "Mysuru", "Hubli"],
    UttarPradesh: ["Lucknow", "Kanpur", "Varanasi"],
    Delhi: ["New Delhi", "Dwarka", "Rohini"],
    Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
    Uttarakhand: ["Dehradun", "Haridwar", "Nainital"],
    Bihar: ["Patna", "Gaya", "Muzaffarpur"]
  };
  if (cities[state]) {
    cities[state].forEach(c => {
      const opt = document.createElement("option");
      opt.value = opt.text = c;
      city.add(opt);
    });
  }
}
document.getElementById("registerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;
  const confirmPass = document.getElementById("confirmPassword").value;
  const phone = document.getElementById("phone").value.trim();
  const gender = document.querySelector("input[name='gender']:checked")?.value;
  const dob = document.getElementById("dob").value;
  const address = document.getElementById("address").value.trim();
  const state = document.getElementById("state").value;
  const city = document.getElementById("city").value;
  const skills = [...document.querySelectorAll("input[type='checkbox']:checked")].map(el => el.value);
  const terms = document.getElementById("terms").checked;
  const profileInput = document.getElementById("profilePic");
  const error = document.getElementById("errorMsg");

  if (name.length < 3 || /\d/.test(name) || /(.)\1\1/.test(name)) return error.innerText = "Invalid Name";
  if (!/^\S+@\S+\.\S+$/.test(email)) return error.innerText = "Invalid Email";
  if (pass.length < 8 || !/[A-Z]/.test(pass) || !/[a-z]/.test(pass) || !/[0-9]/.test(pass)) return error.innerText = "Weak Password";
  if (pass !== confirmPass) return error.innerText = "Passwords don't match";
  if (!/^[0-9]{10}$/.test(phone)) return error.innerText = "Invalid Phone";
  if (!gender) return error.innerText = "Select Gender";
  if (new Date().getFullYear() - new Date(dob).getFullYear() < 18) return error.innerText = "Must be 18+";
  if (address.length < 10) return error.innerText = "Address too short";
  if (!state || !city) return error.innerText = "Select State and City";
  if (skills.length < 1) return error.innerText = "Select at least one skill";
  if (!terms) return error.innerText = "Accept the terms";

  if (profileInput.files[0]) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      const user = { name, email, pass, phone, gender, dob, address, state, city, skills, base64Image };
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "login.html";
    };
    reader.readAsDataURL(profileInput.files[0]);
  } else {
    const user = { name, email, pass, phone, gender, dob, address, state, city, skills };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "login.html";
  }
});
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.email !== email || user.pass !== pass) return error.innerText = "Invalid credentials";
  sessionStorage.setItem("loggedIn", "true");
  window.location.href = "dashboard.html";
});
window.onload = () => {
  if (window.location.pathname.includes("dashboard.html")) {
    if (sessionStorage.getItem("loggedIn") !== "true") {
      window.location.href = "login.html";
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      document.getElementById("userName").innerText = user.name;
      if (user.base64Image) {
        document.getElementById("profilePreview").src = user.base64Image;
      }
      const details = `
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Gender:</strong> ${user.gender}</p>
        <p><strong>DOB:</strong> ${user.dob}</p>
        <p><strong>Address:</strong> ${user.address}, ${user.city}, ${user.state}</p>
        <p><strong>Skills:</strong> ${user.skills.join(", ")}</p>
      `;
      document.getElementById("userDetails").innerHTML = details;
    }
  }
};
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}