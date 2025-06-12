const questions = [
    {
      question: "What must a police officer do when arresting someone?",
      options: [
        "Arrest quietly to avoid panic",
        "Only speak after reaching the station",
        "Identify themselves and state the reason for the arrest",
        "Use handcuffs immediately"
      ],
      correctAnswer: 2,
      explanation: "A police officer must identify themselves and clearly state the reason for the arrest."
    },
    {
      question: "Which of the following is NOT a right of an arrested person under the Kenyan Constitution?",
      options: [
        "Right to information & communication",
        "Right to remain silent and legal representation",
        "Right to be held separately from convicted persons",
        "Right to wifi and entertainment"
      ],
      correctAnswer: 3,
      explanation: "The Kenyan Constitution does not guarantee entertainment or wifi as a right for arrested persons."
    },
    {
      question: "If not released, how soon should you be taken to court?",
      options: [
        "When the OCS decides",
        "Within 24 hours",
        "When a police vehicle is available",
        "As soon as you pay a bribe"
      ],
      correctAnswer: 1,
      explanation: "You must be taken to court within 24 hours if not released."
    },
    {
      question: "If you are kept in police cells for more than 24 hours without going to court, what does the law say?",
      options: [
        "Police can hold you as long as they want",
        "You must be released unless taken to court",
        "You should pay a fine",
        "You lose your rights"
      ],
      correctAnswer: 1,
      explanation: "You must be released unless taken to court within the time specified by law."
    },
    {
      question: "Which of the following is NOT a valid reason for denying bail or bond to an arrested person in Kenya?",
      options: [
        "The accused is likely to flee or interfere with witnesses",
        "The offence is serious and may endanger public safety",
        "The accused has no lawyer and cannot afford one",
        "The accused’s life may be at risk if released"
      ],
      correctAnswer: 2,
      explanation: "Not having a lawyer is not a legal reason to deny bail or bond."
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
      explanation: "You cannot be forced to speak in court unless you choose to."
    },
    {
      question: "Can the police stop you from talking to your lawyer or visitors after arrest?",
      options: [
        "Yes, if they are busy",
        "No, it is your right to speak to a lawyer and your visitors.",
        "Only after you’ve been charged",
        "Yes, if you are considered guilty"
      ],
      correctAnswer: 1,
      explanation: "Arrested persons have a right to contact their lawyer and visitors."
    },
    {
      question: "When should someone not be kept in custody after being arrested?",
      options: [
        "If the offence carries a possible life sentence",
        "If the offence is punishable only by a fine or up to six months in prison",
        "If the person has no lawyer",
        "If the offence is under investigation"
      ],
      correctAnswer: 1,
      explanation: "If the offence is minor and non-violent, remand may not be necessary."
    },
    {
      question: "What procedure should be followed if an arrested person is taken to a police station?",
      options: [
        "They should asked for bribe immediately",
        "They should be booked immediately",
        "They should be taken to court immediately",
        "They should write a statement immediately"
      ],
      correctAnswer: 1,
      explanation: "Upon arrival at the station, an arrested person must be formally recorded in the register."
    },
    {
      question: "What should happen if police beat or mistreat someone in custody?",
      options: [
        "Nothing, it's part of arrest",
        "They should be reported and held accountable",
        "They should apologize",
        "The person should not complain"
      ],
      correctAnswer: 1,
      explanation: "Police abuse should be reported so that the officers involved are held accountable."
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
    const shareTitle = `Do you know the rights of an arrested person in Kenya? I scored ${appState.score}/${questions.length} on the test! Think you can beat me? #UongoZi`;

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
    elements.startBtn = document.getElementById('START');
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
