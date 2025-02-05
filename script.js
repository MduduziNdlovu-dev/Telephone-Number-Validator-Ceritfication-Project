"use strict";

// Localization messages
const locales = {
  en: {
    valid: "Valid SA number:",
    invalid: "Invalid SA number:",
    empty: "Please provide a phone number"
  },
  af: {
    valid: "Geldige SA nommer:",
    invalid: "Ongeldige SA nommer:",
    empty: "Verskaf asseblief 'n telefoon nommer"
  }
};

// Set default language
let currentLocale = "en";

// DOM Elements
const languageSelector = document.getElementById("language-selector");
const inputField = document.getElementById("user-input");
const resultsDiv = document.getElementById("results-div");
const historyDiv = document.getElementById("history-div");

// Listen for language change
languageSelector.addEventListener("change", e => {
  currentLocale = e.target.value;
});

// Regex pattern for South African mobile numbers:
// Accepts numbers starting with either "0" or "+27", followed by a digit between 6 and 8, and then 8 more digits.
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
  historyDiv.innerHTML =
    "<h3>Validation History:</h3>" +
    history
      .map(item => {
        const date = new Date(item.date).toLocaleString();
        return `<p>${date}: ${item.phoneNumber} was ${item.isValid ? "Valid" : "Invalid"}</p>`;
      })
      .join("");
};

// Validate input in real time and update UI
const validateInput = phoneNumber => {
  if (!phoneNumber) {
    resultsDiv.innerHTML = "";
    inputField.classList.remove("valid", "invalid");
    return;
  }

  if (isValidPhoneNumber(phoneNumber)) {
    inputField.classList.add("valid");
    inputField.classList.remove("invalid");
    resultsDiv.style.color = "green";
    resultsDiv.innerHTML = `${locales[currentLocale].valid} ${phoneNumber}`;
  } else {
    inputField.classList.add("invalid");
    inputField.classList.remove("valid");
    resultsDiv.style.color = "red";
    resultsDiv.innerHTML = `${locales[currentLocale].invalid} ${phoneNumber}`;
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
