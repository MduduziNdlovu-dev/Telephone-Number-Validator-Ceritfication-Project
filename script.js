document.getElementById("check-btn").addEventListener("click", function() {
    const phoneNumber = document.getElementById("user-input").value.trim();
    const resultDiv = document.getElementById("results-div");

    if (!phoneNumber) {
        alert("Please provide a phone number");
        return;
    }

    const validPattern = /^(1\s?)?(\(\d{3}\)|\d{3})([\s\-]?)\d{3}([\s\-]?)\d{4}$/;
    
    if (validPattern.test(phoneNumber)) {
        resultDiv.innerHTML = `Valid US number: ${phoneNumber}`;
    } else {
        resultDiv.innerHTML = `Invalid US number: ${phoneNumber}`;
    }
});

document.getElementById("clear-btn").addEventListener("click", function() {
    document.getElementById("user-input").value = '';
    document.getElementById("results-div").innerHTML = '';
});
