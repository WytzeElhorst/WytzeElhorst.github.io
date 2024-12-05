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
