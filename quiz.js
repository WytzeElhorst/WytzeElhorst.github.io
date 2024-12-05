let currentQuestionIndex = 0;
let questions = [];

// Fetch questions from JSON file
async function loadQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
}

// Show the first question and hide the introduction
function startQuiz() {
    const introContainer = document.getElementById("introContainer");
    const questionContainer = document.getElementById("questionContainer");
    const scoreDisplay = document.getElementById("scoreDisplay");

    introContainer.style.display = "none"; // Hide intro
    questionContainer.style.display = "block"; // Show quiz container
    scoreDisplay.style.display = "block"; // Show score container

    loadQuestion(currentQuestionIndex); // Load the first question
}

function loadQuestion(index) {
    const questionContainer = document.getElementById("questionContainer");
    const questionData = questions[index];

    const newQuestionHTML = `
        <div>
            <textarea class="textbox" rows="4" readonly>${questionData.explanation}</textarea>
        </div>
        <div>
            <p>${questionData.question}</p>
        </div>
        <div>
            <input type="text" class="answer-box" id="answer1" placeholder="${questionData.placeholders[0]}">
        </div>
        <div>
            <input type="text" class="answer-box" id="answer2" placeholder="${questionData.placeholders[1]}">
        </div>
        <div>
            <input type="text" class="answer-box" id="answer3" placeholder="${questionData.placeholders[2]}">
        </div>
        <div>
            <input type="text" class="answer-box" id="answer4" placeholder="${questionData.placeholders[3]}">
        </div>
        <div>
            <button class="button" onclick="bevestig()">Bevestig</button>
        </div>
        <div id="resultMessage"></div>
    `;

    questionContainer.innerHTML = newQuestionHTML;
}

function bevestig() {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswers = currentQuestion.correctAnswers;
    let userAnswers = [
        document.getElementById("answer1").value.trim().toLowerCase(),
        document.getElementById("answer2").value.trim().toLowerCase(),
        document.getElementById("answer3").value.trim().toLowerCase(),
        document.getElementById("answer4").value.trim().toLowerCase()
    ];
    let correctCount = 0;

    for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] === correctAnswers[i].toLowerCase()) {
            correctCount++;
        }
    }

    const scoreDisplay = document.getElementById("scoreDisplay");
    const resultMessage = document.getElementById("resultMessage");
    scoreDisplay.innerHTML = `Your Score: ${correctCount}/4`;
    resultMessage.innerHTML = `You got ${correctCount} out of 4 correct!`;

    if (correctCount >= 4) {
        showPopup();
        const inviteList = document.querySelector(".invite-list");
        const thirdInviteItem = `
            <div class="invite-item">
                <img src="wytze.jpg" alt="Wytze">
                <p>Wytze</p>
            </div>
        `;
        inviteList.insertAdjacentHTML('beforeend', thirdInviteItem);
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        resultMessage.innerHTML += `<br><br>The quiz is over! Thanks for participating.`;
    }
}

function showPopup() {
    const popup = document.getElementById("popupMessage");
    popup.style.display = "block";
}

function hidePopup() {
    const popup = document.getElementById("popupMessage");
    popup.style.display = "none";
}

// Load questions on page load
window.onload = loadQuestions;
