const questions = [
    {
        question: "Which body resolves disputes related to elections in Kenya?",
        options: ["National Assembly", "Supreme Court", "IEBC", "Political Parties Tribunal"],
        correctAnswer: 3,
        explanation: "The Political Parties Tribunal handles disputes related to political parties and their activities."
    },
    {
        question: "What is the minimum age to run for President in Kenya?",
        options: ["18 years", "25 years", "35 years", "40 years"],
        correctAnswer: 2,
        explanation: "The minimum age to run for President in Kenya is 35 years as per the Constitution."
    },
    {
        question: "What is the symbol of national unity in Kenya?",
        options: ["The Parliament", "The Governor", "The President", "The Constitution"],
        correctAnswer: 2,
        explanation: "The President is considered the symbol of national unity in Kenya."
    },
    {
        question: "Who represents a ward in the County Assembly?",
        options: ["Senator", "Member of Parliament", "Member of County Assembly (MCA)", "Cabinet Secretary"],
        correctAnswer: 2,
        explanation: "A Member of County Assembly (MCA) represents a ward in the County Assembly."
    },
    {
        question: "What is the role of the Senate in Kenya?",
        options: ["Managing the police", "Representing counties and protecting their interests", "Issuing national ID cards", "Running county schools"],
        correctAnswer: 1,
        explanation: "The Senate represents the counties and protects their interests in legislation."
    },
    {
        question: "Which level of government is responsible for health services?",
        options: ["National Government only", "County Government only", "Both National and County Governments", "The Judiciary"],
        correctAnswer: 2,
        explanation: "Health services are a shared responsibility between National and County Governments."
    },
    {
        question: "What is the importance of voting?",
        options: ["It makes one popular", "It is a constitutional right and a civic duty", "It is only for politicians", "It helps avoid taxes"],
        correctAnswer: 1,
        explanation: "Voting is both a constitutional right and a civic duty for citizens."
    },
    {
        question: "What does the Judiciary do?",
        options: ["Make laws", "Enforce laws", "Interpret and apply the law", "Run elections"],
        correctAnswer: 2,
        explanation: "The Judiciary interprets and applies the law in legal disputes."
    },
    {
        question: "Who appoints Cabinet Secretaries in Kenya?",
        options: ["The Senate", "The President", "The Chief Justice", "The National Assembly"],
        correctAnswer: 1,
        explanation: "The President appoints Cabinet Secretaries with approval from the National Assembly."
    },
    {
        question: "Who oversees revenue allocation to counties?",
        options: ["Auditor-General", "Senate", "IEBC", "Controller of Budget"],
        correctAnswer: 1,
        explanation: "The Senate oversees the allocation of national revenue among counties."
    }
];

// Global state
const appState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    userInfo: { name: '', ageGroup: '', gender: '' }
};

// --- DOM Element Cache ---
const elements = {};

// --- Core Functions ---

function showStep(stepId) {
    console.log(`Showing step: ${stepId}`);
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    const step = document.getElementById(stepId);
    if (step) {
        step.classList.add('active');
        updateProgressIndicator(stepId);
    } else {
        console.error(`Step element with ID '${stepId}' not found.`);
    }
    window.scrollTo(0, 0);
}

function startQuiz() {
    console.log("Starting quiz...");
    // Reset state
    appState.currentQuestion = 0;
    appState.score = 0;
    appState.answers = Array(questions.length).fill(null);
    appState.userInfo = { name: '', ageGroup: '', gender: '' };
    
    showStep('exam');
    showQuestion();
}

function showQuestion() {
    if (appState.currentQuestion >= questions.length) {
        showStep('user-info');
        return;
    }

    const q = questions[appState.currentQuestion];
    const questionContainer = document.getElementById('question-container');
    if (!questionContainer) {
        console.error("Question container not found!");
        return;
    }

    questionContainer.innerHTML = `
        <div class="question-header">${q.question}</div>
        <div class="options-container">
            ${q.options.map((option, index) => `
                <label class="option">
                    <input type="radio" name="answer" value="${index}">
                    <span>${option}</span>
                </label>
            `).join('')}
        </div>
        <div id="feedback" class="feedback"></div>
    `;

    document.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const submitBtn = document.getElementById('submitAnswerBtn');
            if (submitBtn) submitBtn.disabled = false;
        });
    });
    
    const submitBtn = document.getElementById('submitAnswerBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (submitBtn && nextBtn) {
        submitBtn.style.display = 'inline-block';
        submitBtn.disabled = true;
        nextBtn.style.display = 'none';
    }

    updateProgressBar();
}

function handleAnswer() {
    const selectedRadio = document.querySelector('input[name="answer"]:checked');
    if (!selectedRadio) return;

    const answer = parseInt(selectedRadio.value);
    const q = questions[appState.currentQuestion];
    const isCorrect = answer === q.correctAnswer;
    const feedback = document.getElementById('feedback');
    const options = document.querySelectorAll('.option');

    if (isCorrect) {
        appState.score++;
        selectedRadio.parentElement.classList.add('correct');
        feedback.textContent = 'Correct!';
        feedback.className = 'feedback correct';
    } else {
        selectedRadio.parentElement.classList.add('incorrect');
        options[q.correctAnswer].classList.add('correct');
        feedback.innerHTML = `Incorrect. The correct answer is: <strong>${q.options[q.correctAnswer]}</strong><br><em>${q.explanation}</em>`;
        feedback.className = 'feedback incorrect';
    }

    appState.answers[appState.currentQuestion] = answer;
    document.querySelectorAll('input[name="answer"]').forEach(radio => radio.disabled = true);
    
    const submitBtn = document.getElementById('submitAnswerBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (submitBtn && nextBtn) {
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
    }
}

function moveToNextQuestion() {
    appState.currentQuestion++;
    showQuestion();
}

function showResults() {
    showStep('results');

    const percentage = (appState.score / questions.length) * 100;
    const roundedPercentage = Math.round(percentage);

    // Update score text
    const scoreTextEl = document.getElementById('score-text');
    if (scoreTextEl) {
        scoreTextEl.innerHTML = `You scored <strong>${appState.score}</strong> out of ${questions.length}`;
    }

    // Update results message
    const messageEl = document.getElementById('results-message');
    if (messageEl) {
        let message = "Keep learning and try again!";
        if (roundedPercentage >= 80) {
            message = "Excellent work! You have a strong grasp of civic knowledge.";
        } else if (roundedPercentage >= 50) {
            message = "Good job! You have a solid foundation.";
        }
        messageEl.textContent = message;
    }

    // Update and animate the results graphic
    const circle = document.querySelector('.circle');
    const percentageText = document.querySelector('.percentage-text');

    if (circle && percentageText) {
        // The total length of the path is normalized to 100 for the dasharray
        circle.style.strokeDasharray = `${roundedPercentage}, 100`;
        
        // Animate the percentage text count-up
        let currentPercent = 0;
        const interval = setInterval(() => {
            if (currentPercent >= roundedPercentage) {
                clearInterval(interval);
                percentageText.textContent = `${roundedPercentage}%`; // Ensure final value is exact
            } else {
                currentPercent++;
                percentageText.textContent = `${currentPercent}%`;
            }
        }, 20);
    }
}

// --- Helper Functions ---

function updateProgressBar() {
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    if (!progressText || !progressBar) return;

    const progress = ((appState.currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Question ${appState.currentQuestion + 1} of ${questions.length}`;
}

function updateProgressIndicator(stepId) {
    const indicators = document.querySelectorAll('.progress-steps .step-indicator');
    indicators.forEach(indicator => indicator.classList.remove('active', 'completed'));
    let stepNumber;
    switch (stepId) {
        case 'landing': stepNumber = 1; break;
        case 'exam': stepNumber = 2; break;
        case 'user-info': stepNumber = 3; break;
        case 'results': stepNumber = 4; break;
        default: stepNumber = 1;
    }
    const activeIndicator = document.querySelector(`.step-indicator[data-step='${stepNumber}']`);
    if (activeIndicator) {
        activeIndicator.classList.add('active');
        for (let i = 1; i < stepNumber; i++) {
            document.querySelector(`.step-indicator[data-step='${i}']`).classList.add('completed');
        }
    }
}

// --- Sharing ---

function setupSharing() {
    const shareUrl = window.location.href;
    const shareTitle = `I scored ${appState.score}/${questions.length} on the Uongozi Civic Tech Quiz!`;

    document.getElementById('shareFacebook').onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
    document.getElementById('shareTwitter').onclick = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`);
    document.getElementById('shareWhatsApp').onclick = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`);
    
    document.getElementById('copyLink').onclick = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            const shareMessage = document.getElementById('share-message');
            shareMessage.textContent = 'Link copied to clipboard!';
            setTimeout(() => shareMessage.textContent = '', 2000);
        });
    };
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Cache elements
    elements.startBtn = document.getElementById('startQuiz');
    elements.demographicsForm = document.getElementById('demographicsForm');
    elements.restartBtn = document.getElementById('restart-btn');
    
    // Attach event listeners
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', startQuiz);
    }

    // Attach listeners dynamically to buttons that are part of a step
    document.addEventListener('click', (e) => {
        if (e.target.id === 'submitAnswerBtn') handleAnswer();
        if (e.target.id === 'nextQuestionBtn') moveToNextQuestion();
    });

    if (elements.demographicsForm) {
        elements.demographicsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            appState.userInfo.name = document.getElementById('userName').value;
            appState.userInfo.ageGroup = document.getElementById('ageGroup').value;
            appState.userInfo.gender = document.querySelector('input[name="gender"]:checked').value;
            showResults();
            setupSharing();
        });
    }
    if (elements.restartBtn) {
        elements.restartBtn.addEventListener('click', () => showStep('landing'));
    }

    showStep('landing');
});
