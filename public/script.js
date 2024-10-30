const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");
const counterDisplay = document.createElement("div"); // Create new element for counter display

// Add counter display below textarea
textArea.parentNode.insertBefore(counterDisplay, textArea.nextSibling);
counterDisplay.style.marginTop = "5px";
counterDisplay.style.fontSize = "14px";

textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);

// First, we disable the submit button by default when the user loads the website.
submitButton.disabled = true;

function verifyTextLength(e) {
  const textarea = e.target;
  const charCount = textarea.value.length;
  // Update counter display
  counterDisplay.innerHTML = `Characters: ${charCount}/5170`;
  
  // Add color indication for character count
  if (charCount > 5170) {
    counterDisplay.style.color = "red";
  } else if (charCount > 4500) {
    counterDisplay.style.color = "orange";
  } else {
    counterDisplay.style.color = "white";
  }
  
  // Check if the text length is within bounds
  if (charCount > 200 && charCount <= 5170) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

function submitData(e) {
  submitButton.classList.add("submit-button--loading");
  const text_to_summarize = textArea.value;
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", 'Bearer ${process.env.ACCESS_TOKEN}');
  
  const raw = JSON.stringify({
    "text_to_summarize": text_to_summarize
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch('/summarize', requestOptions)
    .then(response => response.text())
    .then(summary => {
      summarizedTextArea.value = summary;
      submitButton.classList.remove("submit-button--loading");
    })
    .catch(error => {
      console.log(error.message);
      submitButton.classList.remove("submit-button--loading");
    });
}
