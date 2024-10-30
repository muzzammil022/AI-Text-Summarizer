const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");
textArea.addEventListener("input",verifyTextLength);
submitButton.addEventListener("click",submitData);
// First, we disable the submit button by default when the user loads the website.
submitButton.disabled = true;

// Next, we define a function called verifyTextLength(). This function will be called when the user enters something in the text area. It receives an event, called ‘e’ here
function verifyTextLength(e) {

  // The e.target property gives us the HTML element that triggered the event, which in this case is the textarea. We save this to a variable called ‘textarea’
  const textarea = e.target;

  // Check if the text in the text area is the right length - between 200 and 100,000 characters
  if (textarea.value.length > 200 && textarea.value.length < 5170) {
    // If it is, we enable the submit button.
    submitButton.disabled = false;
  } else {
    // If it is not, we disable the submit button.
    submitButton.disabled = true;
  }
}
function submitData(e) {
  submitButton.classList.add("submit-button--loading");

  const text_to_summarize = textArea.value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.ACCESS_TOKEN}`);

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
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      if (data.summary) {
        // Format the summary
        const formattedSummary = data.summary
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n\n');

        // Update the output text area with the formatted summary
        summarizedTextArea.value = formattedSummary;
      } else {
        summarizedTextArea.value = "Error: Unable to generate summary.";
      }

      // Stop the spinning loading animation
      submitButton.classList.remove("submit-button--loading");
    })
    .catch(error => {
      console.error('Error:', error);
      summarizedTextArea.value = "An error occurred while summarizing. Please try again.";
      submitButton.classList.remove("submit-button--loading");
    });
}
