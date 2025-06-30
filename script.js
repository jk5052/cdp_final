// Get reference to the button and the message paragraph
const button = document.getElementById('clickMeBtn');
const message = document.getElementById('message');

// Add a click event listener to the button
button.addEventListener('click', function() {
  // Change the text of the message paragraph when button is clicked
  message.textContent = 'You clicked the button!';
});