const noButton = document.getElementById('noButton');
const yesButton = document.getElementById('yesButton');
const questionTitle = document.getElementById('questionTitle');
const questionText = document.getElementById('questionText');
const container = document.querySelector('.container'); // Get the container element
const celebrationImage = document.getElementById('celebration-image');
const starContainer = document.getElementById('star-container');

const questions = [
    { title: 'Question 1', text: 'Will you be my Valentine?', alert: 'Yay! You made my day!' },
    { title: 'Question 2', text: 'Am I the best person you know?', alert: 'Awww, you\'re so sweet!' },
    { title: 'Question 3', text: 'Am I the best sex you ever had?', alert: 'Yeah I thought so!' },
    { title: 'Question 4', text: 'Will you ask my dad for my hand in marriage, until he says yes?', alert: 'Aww! see? This is how I know you\'re the one for me' },
    { title: 'Question 5', text: 'Do you love me for making this?', alert: 'I knew you would! I love you babe!!!!' }
];

let currentQuestionIndex = 0;
let yesButtonSize = 18;
let noButtonSize = 18;
let noButtonClicks = 0; // Track number of "No" clicks

function loadQuestion() {
    questionTitle.textContent = questions[currentQuestionIndex].title;
    questionText.textContent = questions[currentQuestionIndex].text;
    // Reset button sizes and positions
    yesButtonSize = 18;
    noButtonSize = 18;
    noButtonClicks = 0;
    yesButton.style.fontSize = yesButtonSize + 'px';
    noButton.style.fontSize = noButtonSize + 'px';
    noButton.style.position = 'absolute';
    noButton.style.display = 'block';  // Ensure "No" button is visible
    updateButtonPositions(); // Set initial button positions
}

function updateButtonPositions() {
    // Position buttons on opposite sides
    noButton.style.left = '10%';
    noButton.style.top = '50%';
    yesButton.style.right = '10%';
    yesButton.style.top = '50%';
    noButton.style.transform = 'translateY(-50%)';
    yesButton.style.transform = 'translateY(-50%)';
}

function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * 100 + 'vw';
    star.style.animationDuration = Math.random() * 3 + 2 + 's'; // Random duration
    star.style.opacity = Math.random(); // Random opacity
    starContainer.appendChild(star);

    // Remove star after it falls
    star.addEventListener('animationend', () => {
        star.remove();
    });
}

function startStarRain() {
    setInterval(createStar, 100); // Create stars every 100ms
}

function showCelebration() {
    celebrationImage.style.transform = 'translate(-50%, -50%) scale(1)'; // Make image visible
}

loadQuestion();

noButton.addEventListener('click', () => {
    noButtonClicks++;

    // Calculate how much to increase Yes button size
    const growthFactor = Math.min(1.2, 1 + (noButtonClicks * 0.08)); // Gradual increase
    yesButtonSize *= growthFactor;

    // Calculate how much to shrink No button size (but don't shrink below a minimum)
    noButtonSize = Math.max(5, noButtonSize * Math.pow(0.90, 1));

    yesButton.style.fontSize = yesButtonSize + 'px';
    noButton.style.fontSize = noButtonSize + 'px';

    // Get bounding rectangle for the YES Button
    const yesButtonRect = yesButton.getBoundingClientRect();
    let maxX = container.offsetWidth - noButton.offsetWidth;
    let maxY = container.offsetHeight - noButton.offsetHeight;

    let randomX = Math.floor(Math.random() * maxX);
    let randomY = Math.floor(Math.random() * maxY);

    // Ensure No button never overlaps Yes button
    if (randomX + noButton.offsetWidth > yesButtonRect.left &&
        randomX < yesButtonRect.right &&
        randomY + noButton.offsetHeight > yesButtonRect.top &&
        randomY < yesButtonRect.bottom) {
        // Recalculate if they overlap
        randomX = Math.max(0, randomX - yesButtonRect.width); // Move left if overlapping
        randomY = Math.max(0, randomY - yesButtonRect.height); // Move up if overlapping
    }
    noButton.style.position = 'absolute';
    noButton.style.left = randomX + 'px';
    noButton.style.top = randomY + 'px';

    // Get bounding rectangle for the CONTAINER
    const containerRect = container.getBoundingClientRect();

    // Get the size of Yes button, relative to the size of the container
    const yesButtonRelativeSize = (yesButtonSize / containerRect.width) * 100;

    // Hide the "No" button only after 15+ clicks AND when Yes occupies most of the screen
    if (noButtonClicks >= 15 && yesButtonRelativeSize > 80) {
      noButton.style.display = 'none';
    }

});

yesButton.addEventListener('click', () => {
    // Display the question-specific alert
    alert(questions[currentQuestionIndex].alert);

    // Move to the next question
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        // Trigger the celebration!
        showCelebration();
        startStarRain();

        // Optionally, hide the quiz content
        container.style.display = 'none';
    }
});
