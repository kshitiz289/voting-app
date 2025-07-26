let adminPassword = "password";
let headBoy = { "Aryan": 0, "Adarsh": 0 };
let headGirl = { "Priya": 0, "Anjali": 0 };
let images = {
  "Aryan": "https://via.placeholder.com/100?text=Aryan",
  "Adarsh": "https://via.placeholder.com/100?text=Adarsh",
  "Priya": "https://via.placeholder.com/100?text=Priya",
  "Anjali": "https://via.placeholder.com/100?text=Anjali"
};

let stage = "head_boy";
let currentAadhaar = null;
const votedAadhaars = new Set();

function buildCandidates() {
  const box = document.getElementById("candidates-box");
  box.innerHTML = "";
  const list = stage === "head_boy" ? headBoy : headGirl;
  for (const name in list) {
    const div = document.createElement("div");
    div.className = "candidate";
    div.innerHTML = `<img src='${images[name]}'/><p>${name}</p><button onclick="vote('${name}')">Vote</button>`;
    box.appendChild(div);
  }
  document.getElementById("stage-title").innerText = "Vote for " + (stage === "head_boy" ? "Head Boy" : "Head Girl");
}

function vote(name) {
  const voterName = document.getElementById("name").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const aadhaar = document.getElementById("aadhaar").value.trim();
  const cls = document.getElementById("class").value.trim();
  const section = document.querySelector("input[name='section']:checked");
  const gender = document.querySelector("input[name='gender']:checked");

  if (!voterName || isNaN(age) || !aadhaar || !cls || !section || !gender) {
    alert("Please fill all fields.");
    return;
  }
  if (aadhaar.length !== 4 || isNaN(aadhaar)) {
    alert("Aadhaar must be 4 digits.");
    return;
  }
  if (age < 11) {
    alert("You must be at least 11 years old to vote.");
    return;
  }

  if (stage === "head_boy") {
    if (votedAadhaars.has(aadhaar)) {
      alert("This Aadhaar has already voted.");
      return;
    }
    headBoy[name]++;
    currentAadhaar = aadhaar;
    stage = "head_girl";
    buildCandidates();
    alert("Vote recorded for Head Boy. Now vote for Head Girl.");
  } else {
    if (aadhaar !== currentAadhaar) {
      alert("Please use the same Aadhaar to vote for Head Girl.");
      return;
    }
    headGirl[name]++;
    votedAadhaars.add(aadhaar);
    alert("Thank you! Your vote has been recorded.");
    ["name", "age", "aadhaar", "class"].forEach(id => document.getElementById(id).value = "");
    document.querySelectorAll("input[name='section']").forEach(i => i.checked = false);
    document.querySelectorAll("input[name='gender']").forEach(i => i.checked = false);
    stage = "head_boy";
    buildCandidates();
  }
}

function showAdminPanel() {
  document.getElementById("admin-panel").style.display = "block";
  window.scrollTo(0, document.body.scrollHeight);
}

function checkAdmin() {
  const pass = document.getElementById("admin-pass").value;
  if (pass !== adminPassword) {
    alert("Incorrect password.");
    return;
  }

  let result = "Voting Results\n\nHead Boy:\n";
  const maxBoy = Math.max(...Object.values(headBoy));
  const winnersBoy = [];
  for (const [k, v] of Object.entries(headBoy)) {
    result += `${k}: ${v} votes\n`;
    if (v === maxBoy) winnersBoy.push(k);
  }
  result += `\nWinner(s): ${winnersBoy.join(', ')}\n\nHead Girl:\n`;
  const maxGirl = Math.max(...Object.values(headGirl));
  const winnersGirl = [];
  for (const [k, v] of Object.entries(headGirl)) {
    result += `${k}: ${v} votes\n`;
    if (v === maxGirl) winnersGirl.push(k);
  }
  result += `\nWinner(s): ${winnersGirl.join(', ')}`;
  document.getElementById("results").innerText = result;
  document.getElementById("change-btn").classList.remove("hidden");
}

function exitAdminPanel() {
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("admin-pass").value = "";
  document.getElementById("results").innerText = "";
  document.getElementById("change-btn").classList.add("hidden");
}

function showChangeCandidates() {
  document.getElementById("candidate-change-section").classList.remove("hidden");
  window.scrollTo(0, document.body.scrollHeight);
}

function buildCandidateForms() {
  const boys = parseInt(document.getElementById("boy-count").value);
  const girls = parseInt(document.getElementById("girl-count").value);
  const formBox = document.getElementById("candidate-forms");
  formBox.innerHTML = "<h3>Head Boy Candidates</h3>";
  for (let i = 0; i < boys; i++) {
    formBox.innerHTML += `
      <div class="candidate-form">
        <label>Name: <input class="boy-name" /></label>
        <label>Photo: <input type="file" class="boy-img" accept="image/*" /></label>
      </div>`;
  }
  formBox.innerHTML += "<h3>Head Girl Candidates</h3>";
  for (let i = 0; i < girls; i++) {
    formBox.innerHTML += `
      <div class="candidate-form">
        <label>Name: <input class="girl-name" /></label>
        <label>Photo: <input type="file" class="girl-img" accept="image/*" /></label>
      </div>`;
  }
}

function saveNewCandidates() {
  headBoy = {};
  headGirl = {};
  images = {};
  const boyNames = document.querySelectorAll(".boy-name");
  const boyImgs = document.querySelectorAll(".boy-img");
  for (let i = 0; i < boyNames.length; i++) {
    const name = boyNames[i].value.trim();
    const file = boyImgs[i].files[0];
    if (name && file) {
      headBoy[name] = 0;
      images[name] = URL.createObjectURL(file);
    }
  }
  const girlNames = document.querySelectorAll(".girl-name");
  const girlImgs = document.querySelectorAll(".girl-img");
  for (let i = 0; i < girlNames.length; i++) {
    const name = girlNames[i].value.trim();
    const file = girlImgs[i].files[0];
    if (name && file) {
      headGirl[name] = 0;
      images[name] = URL.createObjectURL(file);
    }
  }
  alert("Candidates updated!");
  stage = "head_boy";
  buildCandidates();
  document.getElementById("candidate-change-section").classList.add("hidden");
}

function changeAdminPassword() {
  const newPass = document.getElementById("new-admin-pass").value.trim();
  if (newPass.length < 4) {
    alert("Password must be at least 4 characters.");
    return;
  }
  adminPassword = newPass;
  alert("Admin password changed!");
}

buildCandidates();
