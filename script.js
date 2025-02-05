"use strict";

// Localization messages
const locales = {
  en: {
    valid: "Valid SA number:",
    invalid: "Invalid SA number:",
    empty: "Please provide a phone number",
    areaCodeError: "Invalid area code. Please ensure it starts with 0 or +27.",
    digitError: "Phone number must be 9 digits after the area code."
  },
  af: {
    valid: "Geldige SA nommer:",
    invalid: "Ongeldige SA nommer:",
    empty: "Verskaf asseblief 'n telefoon nommer",
    areaCodeError: "Ongeldige area kode. Maak seker dit begin met 0 of +27.",
    digitError: "Telefoonnommer moet 9 syfers wees na die area kode."
  }
};

// Set default language
let currentLocale = "en";

// DOM Elements
const languageSelector = document.getElementById("language-selector");
const inputField = document.getElementById("user-input");
const resultsDiv = document.getElementById("results-div");
const historyDiv = document.getElementById("history-div");
const themeToggle = document.getElementById("theme-toggle");

// Listen for language change
languageSelector.addEventListener("change", e => {
  currentLocale = e.target.value;
});

// Regex pattern for South African mobile numbers
const zaPattern = /^(?:\+27|0)[6-8]\d{8}$/;

// Function to validate SA phone numbers
const isValidPhoneNumber = phoneNumber => zaPattern.test(phoneNumber);

// Save validation history to localStorage
const saveToHistory = (phoneNumber, isValid) => {
  const history = JSON.parse(localStorage.getItem("validationHistory")) || [];
  history.push({ phoneNumber, isValid, date: new Date().toISOString() });
  localStorage.setItem("validationHistory", JSON.stringify(history));
};

// Display validation history from localStorage
const displayHistory = () => {
  const history = JSON.parse(localStorage.getItem("validationHistory")) || [];
  if (history.length === 0) {
    historyDiv.innerHTML = "<p>No history available.</p>";
    return;
  }
  historyDiv.style.display = "block";
  historyDiv.innerHTML =
    "<h3>Validation History:</h3>" +
    history
      .map(item => {
        const date = new Date(item.date).toLocaleString();
        return `<p>${date}: ${item.phoneNumber} was ${item.isValid ? "Valid" : "Invalid"}</p>`;
      })
      .join("");
};

// Validate input and provide detailed error messages
const validateInput = phoneNumber => {
  if (!phoneNumber) {
    resultsDiv.innerHTML = "";
    inputField.classList.remove("valid", "invalid");
    return;
  }

  if (!zaPattern.test(phoneNumber)) {
    if (!phoneNumber.startsWith("0") && !phoneNumber.startsWith("+27")) {
      inputField.classList.add("invalid");
      inputField.classList.remove("valid");
      resultsDiv.style.color = "red";
      resultsDiv.innerHTML = locales[currentLocale].areaCodeError;
    } else if (phoneNumber.length < 13) {
      inputField.classList.add("invalid");
      inputField.classList.remove("valid");
      resultsDiv.style.color = "red";
      resultsDiv.innerHTML = locales[currentLocale].digitError;
    } else {
      inputField.classList.add("invalid");
      inputField.classList.remove("valid");
      resultsDiv.style.color = "red";
      resultsDiv.innerHTML = `${locales[currentLocale].invalid} ${phoneNumber}`;
    }
  } else {
    inputField.classList.add("valid");
    inputField.classList.remove("invalid");
    resultsDiv.style.color = "green";
    resultsDiv.innerHTML = `${locales[currentLocale].valid} ${phoneNumber}`;
  }
};

// Real-time feedback as the user types
inputField.addEventListener("input", () => {
  const phoneNumber = inputField.value.trim();
  validateInput(phoneNumber);
});

// Button: Check - Validate and save history
document.getElementById("check-btn").addEventListener("click", () => {
  const phoneNumber = inputField.value.trim();
  if (!phoneNumber) {
    alert(locales[currentLocale].empty);
    return;
  }
  validateInput(phoneNumber);
  saveToHistory(phoneNumber, isValidPhoneNumber(phoneNumber));
});

// Button: Clear - Reset input and results
document.getElementById("clear-btn").addEventListener("click", () => {
  inputField.value = "";
  resultsDiv.innerHTML = "";
  inputField.classList.remove("valid", "invalid");
});

// Button: Show History - Display validation history
document.getElementById("show-history-btn").addEventListener("click", () => {
  displayHistory();
});

// Button: Toggle Theme (Dark Mode)
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".container").classList.toggle("dark-mode"); // Added this line
    document.querySelector(".history-div").classList.toggle("dark-mode"); // Added this line
    const mode = document.body.classList.contains("dark-mode") ? "Dark" : "Light";
    themeToggle.textContent = `Switch to ${mode} Mode`;
  });
  

// PWA - Service Worker registration (Optional enhancement)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(registration => console.log("Service Worker registered:", registration))
      .catch(error => console.log("Service Worker registration failed:", error));
  });
}
