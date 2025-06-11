const questions = [
    {
      question: "What is the first thing police must tell you when you're arrested?",
      options: [
        "That you are guilty",
        "That you must stay silent until bail",
        "Why you are being arrested",
        "That you can talk to a lawyer only after court"
      ],
      correctAnswer: 2,
      explanation: "You must be told the reason for your arrest immediately."
    },
    {
      question: "When should you be told about your right to stay silent?",
      options: [
        "When you get to the police station",
        "Before going to court",
        "Right when you are arrested",
        "After you are charged"
      ],
      correctAnswer: 2,
      explanation: "You must be informed of your right to remain silent at the time of arrest."
    },
    {
      question: "In what language must your rights be explained?",
      options: [
        "English only",
        "Kiswahili only",
        "A language you understand",
        "Written on a sign"
      ],
      correctAnswer: 2,
      explanation: "Your rights must be communicated in a language you understand."
    },
    {
      question: "If not released, how soon should you be taken to court?",
      options: [
        "In 12 hours",
        "In 48 hours",
        "In 72 hours",
        "In one week"
      ],
      correctAnswer: 1,
      explanation: "You must be taken to court within 48 hours if not released."
    },
    {
      question: "If you are kept in police cells for more than 48 hours without going to court, what does the law say?",
      options: [
        "Police can hold you as long as they want",
        "You must be released unless taken to court",
        "You should pay a fine",
        "You lose your rights"
      ],
      correctAnswer: 1,
      explanation: "Holding someone without charging them in court within 48 hours is unlawful."
    },
    {
      question: "Can you be denied bail or bond?",
      options: [
        "Yes, if a senior officer arrests you",
        "Yes, if there is a good reason",
        "Yes, if you're questioned",
        "Yes, if you say you're guilty"
      ],
      correctAnswer: 1,
      explanation: "Bail can be denied only with valid legal justification."
    },
    {
      question: "Can you be forced to say something in court?",
      options: [
        "Yes, if police ask",
        "Yes, after 24 hours",
        "No, only if a judge is there",
        "No, unless you choose to speak"
      ],
      correctAnswer: 3,
      explanation: "You can only speak in court if you choose to; you cannot be forced to speak."
    },
    {
      question: "If police delay letting you speak to your lawyer, is that okay?",
      options: [
        "Yes, if they are busy",
        "No, it is your right to speak to a lawyer immediately",
        "Only after you’ve been charged",
        "Only if you are guilty"
      ],
      correctAnswer: 1,
      explanation: "You have a right to speak to a lawyer immediately upon arrest."
    },
    {
      question: "Which of these is NOT your right when arrested?",
      options: [
        "To be kept in a secret place",
        "To talk to your lawyer",
        "To be treated well",
        "To go to court within 48 hours"
      ],
      correctAnswer: 0,
      explanation: "Being held in a secret location is not a legal right and violates due process."
    },
    {
      question: "If you are arrested and there is no written record or reason given, what is the risk?",
      options: [
        "You will be fined later",
        "You may be released faster",
        "You can be held without anyone knowing",
        "You can still go to court"
      ],
      correctAnswer: 2,
      explanation: "Without records, your arrest can become unlawful and you risk being held without accountability."
    },
    {
      question: "Which of the following is a right of arrested persons that is often NOT respected in police cells?",
      options: [
        "Right to free Wi-Fi",
        "Right to a clean and safe place to stay",
        "Right to be fed by family",
        "Right to private toilets"
      ],
      correctAnswer: 1,
      explanation: "Many police cells fail to meet the requirement of being clean and safe for detainees."
    },
    {
      question: "What should you do if police hurt you or abuse you in the cell?",
      options: [
        "Stay silent",
        "Wait until court to talk",
        "Report to the Independent Policing Oversight Authority (IPOA)",
        "Run away"
      ],
      correctAnswer: 2,
      explanation: "You should report abuse to IPOA, the official body overseeing police conduct."
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

        // Hide or show header based on step attribute
        const header = document.getElementById('main-header');
        if (header) {
            const shouldHide = step.dataset.hideHeader === 'true';
            header.style.display = shouldHide ? 'none' : '';
        }
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

    // Clear previous content and set up the question container
    questionContainer.innerHTML = '';
    
    // Create main question container
    const container = document.createElement('div');
    container.className = 'question-container';
    
    // Create question element
    const questionEl = document.createElement('div');
    questionEl.className = 'question-header';
    questionEl.textContent = q.question;
    container.appendChild(questionEl);
    
    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    // Add options to container with A, B, C, D labels
    const optionLetters = ['A', 'B', 'C', 'D'];
    q.options.forEach((option, index) => {
        const optionWrapper = document.createElement('div');
        optionWrapper.className = 'option-wrapper';
        optionWrapper.innerHTML = `
            <label class="option" data-index="${index}">
                <input type="radio" name="answer" value="${index}">
                <div class="option-letter">${optionLetters[index]})</div>
                <div class="option-text">${option}</div>
                <div class="option-checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            </label>`;
        optionsContainer.appendChild(optionWrapper);
    });
    
    container.appendChild(optionsContainer);
    questionContainer.appendChild(container);
    
    // Add feedback container
    const feedbackEl = document.createElement('div');
    feedbackEl.id = 'feedback';
    feedbackEl.className = 'feedback';
    questionContainer.appendChild(feedbackEl);

    // Add click event listeners to option labels
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', (e) => {
            // Don't do anything if clicking on the radio input directly
            if (e.target.tagName === 'INPUT') return;
            
            // Get the radio input inside this option
            const radio = option.querySelector('input[type="radio"]');
            if (!radio) return;
            
            // Set the radio button as checked
            radio.checked = true;
            
            // Update UI for selection
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // Enable submit button
            const submitBtn = document.getElementById('submitAnswerBtn');
            if (submitBtn) submitBtn.disabled = false;
            
            // Trigger change event on the radio button
            const event = new Event('change');
            radio.dispatchEvent(event);
        });
    });
    
    // Also handle direct radio button changes (for accessibility)
    document.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            const label = e.target.closest('.option');
            if (label) {
                label.classList.add('selected');
            }
            
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
    const shareTitle = `Do you know the rights of an arrested persons in Kenya? I scored ${appState.score}/${questions.length} on the test! Think you can beat me? #UongoZi`;

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
