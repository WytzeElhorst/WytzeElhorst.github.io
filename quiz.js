let currentQuestionIndex = 0;
let questions = [];

// Fetch questions from JSON file
async function loadQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
}

// Show the first question and hide the introduction
function startQuiz() {
    document.getElementById("introContainer").style.display = "none";
    document.getElementById("questionContainer").style.display = "block";
    document.getElementById("scoreDisplay").style.display = "block";

    loadQuestion(currentQuestionIndex);
}

function loadQuestion(index) {
    const questionContainer = document.getElementById("questionContainer");
    const questionData = questions[index];
    let newQuestionHTML = `
        <div>
            <textarea class="textbox" rows="4" readonly>${questionData.explanation}</textarea>
        </div>
        <div>
            <img src="${questionData.image}" alt="Question Image" style="width: 100%; max-width: 400px; border-radius: 10px; margin: 20px 0;">
        </div>
        <div>
            <p>${questionData.question}</p>
        </div>
    `;

    if (questionData.answerType === "text") {
        // Render multiple text boxes if placeholders are provided
        questionData.placeholders.forEach((placeholder, idx) => {
            newQuestionHTML += `
                <div>
                    <input type="text" class="answer-box" id="answer${idx + 1}" placeholder="${placeholder}">
                </div>
            `;
        });
    } else if (questionData.answerType === "multiple-choice") {
        // Render multiple-choice options
        questionData.options.forEach((option, idx) => {
            newQuestionHTML += `
                <div>
                    <label>
                        <input type="radio" name="answer" id="answer${idx}" value="${option}">
                        ${option}
                    </label>
                </div>
            `;
        });
    }

    newQuestionHTML += `
        <div>
            <button class="button" onclick="bevestig()">Bevestig</button>
        </div>
        <div id="resultMessage"></div>
    `;

    questionContainer.innerHTML = newQuestionHTML;
}

function bevestig() {
    const currentQuestion = questions[currentQuestionIndex];
    let correctCount = 0;

    if (currentQuestion.answerType === "text") {
        // Collect answers from text boxes
        const userAnswers = currentQuestion.placeholders.map((_, idx) =>
            document.getElementById(`answer${idx + 1}`).value.trim().toLowerCase()
        );
        correctCount = userAnswers.filter((answer, idx) => answer === currentQuestion.correctAnswers[idx].toLowerCase()).length;
    } else if (currentQuestion.answerType === "multiple-choice") {
        // Collect selected answer from radio buttons
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        const userAnswer = selectedOption ? selectedOption.value : null;
        if (userAnswer === currentQuestion.correctAnswer) {
            correctCount = 1;
        }
    }

    // Update the score display
    const scoreDisplay = document.getElementById("scoreDisplay");
    const currentScore = parseInt(scoreDisplay.textContent.replace("Score: ", "")) || 0;
    scoreDisplay.textContent = `Score: ${currentScore + correctCount}`;

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        document.getElementById("questionContainer").innerHTML = `<p>The quiz is over! Thanks for participating.</p>`;
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
