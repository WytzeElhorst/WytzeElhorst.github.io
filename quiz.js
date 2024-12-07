let totalScore = 0;
let questions = [];
let currentQuestion = null;
let remainingQuestions = [];

// Fetch questions from JSON file
async function loadQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();

    // Initialize remaining questions
    remainingQuestions = [...Array(questions.length).keys()];
}

// Show the first question and hide the introduction
function startQuiz() {
    document.getElementById("introContainer").style.display = "none";
    document.getElementById("questionContainer").style.display = "block";
    document.getElementById("scoreDisplay").style.display = "block";

    loadQuestion();
}

function loadQuestion() {
    if (remainingQuestions.length === 0) {
        // End the quiz if no questions remain
        const questionContainer = document.getElementById("questionContainer");
        questionContainer.style.display = "none";

        const resultMessage = document.getElementById("resultMessage");
        resultMessage.innerHTML = `
            <p>De Quiz is af, hopelijk mag iedereen mee! Zo niet, dan kan je hem nog een keertje proberen!</p>
            <button class="button" onclick="resetQuiz()">Reset Quiz</button>
        `;
        resultMessage.style.display = "block";
        return;
    }

    // Randomly select a question
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const selectedIndex = remainingQuestions.splice(randomIndex, 1)[0];
    currentQuestion = questions[selectedIndex]; // Assign the selected question to the global variable

    const questionContainer = document.getElementById("questionContainer");
    const questionData = currentQuestion;

    let newQuestionHTML = `
        <div>
            <img src="${questionData.image}" alt="Question Image" class="question-image">
        </div>
        <div>
            <p>${questionData.question}</p>
        </div>
    `;

    if (questionData.answerType === "text") {
        for (let i = 0; i < questionData.correctAnswers.length; i++) {
            newQuestionHTML += `
                <div>
                    <input type="text" class="answer-box" id="answer${i + 1}" placeholder="Answer ${i + 1}">
                </div>
            `;
        }
    } else if (questionData.answerType === "multiple-choice") {
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
    } else if (questionData.answerType === "ranking") {
        questionData.options.forEach((option, idx) => {
            let dropdownHTML = `<select id="answer${idx + 1}" class="ranking-dropdown"><option value="">Select</option>`;
            questionData.dropdownOptions.forEach((dropdownOption) => {
                dropdownHTML += `<option value="${dropdownOption}">${dropdownOption}</option>`;
            });
            dropdownHTML += `</select>`;

            newQuestionHTML += `
                <div>
                    <label>
                        ${option}: ${dropdownHTML}
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
    questionContainer.style.display = "block";
}

function bevestig() {
    if (!currentQuestion) {
        console.error("No current question found!");
        return;
    }

    let correctCount = 0;

    if (currentQuestion.answerType === "text") {
        // Gather user inputs and compare without considering order
        const userAnswers = currentQuestion.placeholders.map((_, idx) =>
            document.getElementById(`answer${idx + 1}`).value.trim().toLowerCase()
        );
        const correctAnswers = currentQuestion.correctAnswers.map(answer => answer.toLowerCase());
        correctCount = userAnswers.filter(answer => correctAnswers.includes(answer)).length;
    } else if (currentQuestion.answerType === "multiple-choice") {
        // Evaluate the selected option
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        const userAnswer = selectedOption ? selectedOption.value : null;
        if (userAnswer === currentQuestion.correctAnswer) {
            correctCount = 2; // Assign 2 points for correct multiple-choice answers
        }
    } else if (currentQuestion.answerType === "ranking") {
        // Check each dropdown selection against the correct answers
        const userAnswers = currentQuestion.options.map((_, idx) =>
            document.getElementById(`answer${idx + 1}`).value
        );
        correctCount = userAnswers.reduce((count, selectedOption, idx) => {
            return count + (selectedOption === currentQuestion.correctAnswers[idx] ? 1 : 0);
        }, 0);
    }

    // Update the total score
    totalScore += correctCount;

    // Update the score display
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = `Score: ${totalScore}`;

    // Show the popup and add another image if score reaches a certain value
    if (totalScore >= 7 && !document.querySelector('.invite-item img[alt="Lisanne"]')) {
        showPopup("Lisanne");
        addInviteeImage("Images/schatje.jpg", "Lisanne");
    }

    if (totalScore >= 14 && !document.querySelector('.invite-item img[alt="Jeroen"]')) {
        showPopup("Jeroen");
        addInviteeImage("Images/jeroen.jpg", "Jeroen");
    }

    if (totalScore >= 22 && !document.querySelector('.invite-item img[alt="Didi"]')) {
        showPopup("Didi");
        addInviteeImage("Images/Didi.jpg", "Didi");
    }

    if (totalScore >= 28 && !document.querySelector('.invite-item img[alt="Wytze"]')) {
        showPopup("Wytze");
        addInviteeImage("Images/wytze.jpg", "Wytze");
    }

    // Load the next question
    loadQuestion();
}

function showPopup(name) {
    const popup = document.getElementById("popupMessage");
    popup.innerHTML = `<p>${name} eet ook mee!</p>`;
    popup.style.display = "block";
}

function hidePopup() {
    const popup = document.getElementById("popupMessage");
    popup.style.display = "none";
}

function addInviteeImage(imagePath, name) {
    const inviteList = document.querySelector(".invite-list");
    const newInviteItem = `
        <div class="invite-item">
            <img src="${imagePath}" alt="${name}">
            <p>${name}</p>
        </div>
    `;
    inviteList.insertAdjacentHTML('beforeend', newInviteItem);
}

function resetQuiz() {
    totalScore = 0;
    remainingQuestions = [...Array(questions.length).keys()];

    document.getElementById("introContainer").style.display = "block";
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("resultMessage").style.display = "none";
    document.getElementById("scoreDisplay").textContent = "Score: 0";
}

// Load questions on page load
window.onload = loadQuestions;
