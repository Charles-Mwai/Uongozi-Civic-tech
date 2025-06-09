// Questions array
const questions = [
    {
        question: "What is the minimum voting age in Kenya?",
        options: ["16 years", "18 years", "21 years", "25 years"],
        correctAnswer: 1
    },
    {
        question: "How often are general elections held in Kenya?",
        options: ["Every 3 years", "Every 4 years", "Every 5 years", "Every 6 years"],
        correctAnswer: 2
    },
    {
        question: "What is the main role of the Independent Electoral and Boundaries Commission (IEBC)?",
        options: [
            "To make laws for Kenya",
            "To conduct and supervise elections and referenda",
            "To oversee the judiciary",
            "To manage county governments"
        ],
        correctAnswer: 1
    },
    {
        question: "Which document outlines the rights and responsibilities of Kenyan citizens?",
        options: [
            "The Penal Code",
            "The Constitution of Kenya",
            "The Elections Act",
            "The Political Parties Act"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the main function of the National Assembly in Kenya?",
        options: [
            "To interpret the law",
            "To make laws and oversee government operations",
            "To implement government policies",
            "To adjudicate disputes"
        ],
        correctAnswer: 1
    }
];

// Helper functions
function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show the requested step
    const step = document.getElementById(stepId);
    if (step) {
        step.classList.add('active');
    }
}

function startQuiz() {
    // Reset the app state
    appState.currentQuestion = 0;
    appState.score = 0;
    appState.answers = [];
    appState.userInfo = { name: '', ageGroup: '', gender: '' };
    
    // Show the first question
    showStep('exam');
    showQuestion();
}

function submitExam() {
    // Calculate score and show demographics form
    appState.score = calculateScore();
    showStep('demographics');
}

function submitDemographics() {
    // Save user info and show results
    appState.userInfo = {
        name: document.getElementById('userName').value,
        ageGroup: document.getElementById('ageGroup').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || ''
    };
    
    // Save results to server
    saveResults();
    
    // Show results
    showResults();
}

function showResults() {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        const percentage = Math.round((appState.score / questions.length) * 100);
        scoreDisplay.innerHTML = `
            <h3>${appState.userInfo.name}'s Results</h3>
            <div class="score">
                <span class="score-number">${appState.score}</span>
                <span class="score-total">/ ${questions.length}</span>
                <div class="score-percentage">${percentage}%</div>
            </div>
            <p>${getResultMessage(percentage)}</p>
        `;
    }
    
    showStep('results');
}

function shareResults() {
    const percentage = Math.round((appState.score / questions.length) * 100);
    const shareText = `I scored ${appState.score} out of ${questions.length} (${percentage}%) on the Uongozi Civic Knowledge Test!`;
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=true&name=${encodeURIComponent(appState.userInfo.name)}&score=${appState.score}&total=${questions.length}&percentage=${percentage}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Civic Knowledge Test Results',
            text: shareText,
            url: shareUrl
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            // Fallback if clipboard API fails
            prompt('Copy this link to share your results:', shareUrl);
        });
    }
}

function getResultMessage(percentage) {
    if (percentage >= 80) {
        return 'Excellent! You have a strong understanding of civic knowledge.';
    } else if (percentage >= 60) {
        return 'Good job! You have a solid foundation of civic knowledge.';
    } else if (percentage >= 40) {
        return 'Not bad! Consider learning more about civic responsibilities.';
    } else {
        return 'Keep learning! Check out our resources to improve your civic knowledge.';
    }
}

function calculateScore() {
    // Calculate score based on correct answers
    let score = 0;
    appState.answers.forEach((answer, index) => {
        if (answer === questions[index].correctAnswer) {
            score++;
        }
    });
    return score;
}

async function saveResults() {
    try {
        const response = await fetch('/.netlify/functions/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...appState.userInfo,
                score: appState.score,
                total: questions.length,
                answers: appState.answers
            })
        });
        
        if (!response.ok) {
            console.error('Failed to save results');
        }
    } catch (error) {
        console.error('Error saving results:', error);
    }
}

function showQuestion() {
    const currentQuestion = questions[appState.currentQuestion];
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    
    if (!currentQuestion || !questionElement || !optionsElement) return;
    
    // Display the question
    questionElement.textContent = `${appState.currentQuestion + 1}. ${currentQuestion.question}`;
    
    // Clear previous options
    optionsElement.innerHTML = '';
    
    // Create and append options
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="answer" id="option${index}" value="${index}">
            <label for="option${index}">${option}</label>
        `;
        optionsElement.appendChild(optionElement);
    });
    
    // Update progress
    updateProgressBar();
}

function updateProgressBar() {
    const progress = ((appState.currentQuestion + 1) / questions.length) * 100;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        if (index === Math.floor((appState.currentQuestion + 1) / 5)) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function handleAnswer() {
    const selectedOption = document.querySelector('.option.selected');
    if (!selectedOption) {
        alert('Please select an answer');
        return false;
    }
    
    const selectedIndex = Array.from(selectedOption.parentElement.children).indexOf(selectedOption);
    const currentQ = questions[appState.currentQuestion];
    const isCorrect = selectedIndex === currentQ.correctAnswer;
    
    // Save the answer
    appState.answers[appState.currentQuestion] = selectedIndex;
    
    // Show feedback
    const feedback = document.getElementById('feedback');
    const options = document.querySelectorAll('.option');
    const submitButton = document.getElementById('submitAnswer');
    const nextButton = document.getElementById('nextButton');
    
    // Disable all options
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.classList.remove('selected');
    });
    
    // Mark correct and incorrect answers
    options[currentQ.correctAnswer].classList.add('correct');
    if (!isCorrect) {
        selectedOption.classList.add('incorrect');
    }
    
    // Show feedback message
    if (isCorrect) {
        feedback.innerHTML = '<div class="feedback correct">✓ Correct! Well done!</div>';
        feedback.style.display = 'block';
    } else {
        feedback.innerHTML = `
            <div class="feedback incorrect">
                ✗ Incorrect. The correct answer is: <strong>${currentQ.options[currentQ.correctAnswer]}</strong>
            </div>
        `;
        feedback.style.display = 'block';
    }
    
    // Hide submit button, show next button
    submitButton.style.display = 'none';
    nextButton.style.display = 'block';
    
    // Handle next button click
    nextButton.onclick = () => {
        appState.currentQuestion++;
        if (appState.currentQuestion < questions.length) {
            showQuestion();
        } else {
            submitExam();
        }
    };
    
    return true;
}

// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}

// Global state
const appState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    userInfo: {
        name: '',
        ageGroup: '',
        gender: ''
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize event listeners
    document.getElementById('startQuiz')?.addEventListener('click', startQuiz);
    document.getElementById('nextBtn')?.addEventListener('click', handleAnswer);
    
    const demographicsForm = document.getElementById('demographicsForm');
    if (demographicsForm) {
        demographicsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitDemographics();
        });
    }
    
    // Handle restart button
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            // Reset app state
            appState.currentQuestion = 0;
            appState.score = 0;
            appState.answers = [];
            appState.userInfo = { name: '', ageGroup: '', gender: '' };
            
            // Reset form
            const form = document.getElementById('demographicsForm');
            if (form) form.reset();
            
            // Restart the quiz
            showStep('landing');
        });
    }
    
    // Handle share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResults);
    }
    
    // Check if we're loading a shared result
    const urlParams = getUrlParams();
    if (urlParams.name && urlParams.score && urlParams.total) {
        // We have shared result data, show the results directly
        const score = parseInt(urlParams.score);
        const total = parseInt(urlParams.total);
        const percentage = Math.round((score / total) * 100);
        
        // Update the results display
        const scoreDisplay = document.getElementById('score-display');
        if (scoreDisplay) {
            scoreDisplay.innerHTML = `
                <h3>${decodeURIComponent(urlParams.name)}'s Results</h3>
                <div class="score">
                    <span class="score-number">${score}</span>
                    <span class="score-total">/ ${total}</span>
                    <div class="score-percentage">${percentage}%</div>
                </div>
                <p>${getResultMessage(percentage)}</p>
                <p class="shared-notice">This is a shared result</p>
            `;
        }
        
        // Show the results step
        showStep('results');
        
        // Hide the share button for shared results
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.style.display = 'none';
        }
                
        // Don't initialize the rest of the app
        return;
    }

    // Initialize the quiz with the first question
    showQuestion();
});

function updateProgress(currentStep) {
    const progressBar = document.querySelector('.progress-bar');
    const steps = document.querySelectorAll('.step-indicator');
    const progressPercentage = (currentStep / 4) * 100;
    
    progressBar.style.setProperty('--progress', `${progressPercentage}%`);
    
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('completed');
        } else {
            step.classList.remove('completed');
        }
        if (index === currentStep - 1) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

    // Show Question
    function showQuestion() {
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        step1.classList.remove('active');
        step2.classList.add('active');
        updateProgress(2); // Update progress to step 2 (questions)
        
        const questionText = document.getElementById('questionText');
        const options = document.getElementById('options');
        const submitButton = document.getElementById('submitAnswer');
        const feedback = document.getElementById('feedback');
        const nextButton = document.getElementById('nextButton');
        
        // Reset UI state
        options.innerHTML = '';
        feedback.textContent = '';
        feedback.style.display = 'none';
        submitButton.disabled = true;
        submitButton.style.display = 'block';
        nextButton.style.display = 'none';
        
        // Update button text based on current question
        if (appState.currentQuestion === questions.length - 1) {
            nextButton.textContent = 'Finish Quiz';
        } else {
            nextButton.textContent = 'Next Question';
        }

        // Display question number and total questions (e.g., "1/10")
        const currentQ = questions[appState.currentQuestion];
        questionText.innerHTML = `
            <div class="question-number">Question ${appState.currentQuestion + 1} of ${questions.length}</div>
            <div class="question-text">${currentQ.question}</div>
        `;

        // Create options
        currentQ.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => {
                // Only allow selection if no answer has been submitted yet
                if (nextButton.style.display !== 'block') {
                    const selectedOptions = document.querySelectorAll('.option.selected');
                    selectedOptions.forEach(opt => opt.classList.remove('selected'));
                    optionDiv.classList.add('selected');
                    submitButton.disabled = false;
                }
            });
            options.appendChild(optionDiv);
        });
    }

    // Submit Answer
    const submitAnswer = document.getElementById('submitAnswer');
    const nextButton = document.createElement('button');
    nextButton.id = 'nextButton';
    nextButton.textContent = 'Next Question';
    nextButton.style.display = 'none';
    nextButton.style.marginTop = '10px';
    document.getElementById('questionContainer').appendChild(nextButton);

    submitAnswer.addEventListener('click', () => {
        const selectedOption = document.querySelector('.option.selected');
        if (selectedOption) {
            const selectedAnswer = Array.from(selectedOption.parentElement.children).indexOf(selectedOption);
            const feedback = document.getElementById('feedback');

            if (selectedAnswer === questions[currentQuestion].correctAnswer) {
                score++;
                feedback.className = 'feedback correct';
                feedback.textContent = 'Correct!';
            } else {
                feedback.className = 'feedback incorrect';
                feedback.textContent = `Incorrect. The correct answer is: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`;
            }

            // Disable options and submit button
            document.querySelectorAll('.option').forEach(opt => opt.style.pointerEvents = 'none');
            submitAnswer.disabled = true;
            
            // Show next button
            nextButton.style.display = 'block';
        }
    });

    // Handle next question button click
    nextButton.addEventListener('click', () => {
        if (currentQuestion < questions.length) {
            // Update button text if it's the last question
            if (currentQuestion === questions.length - 1) {
                nextButton.textContent = 'Next';
            }
            currentQuestion++;
            showQuestion();
        } else {
            showDemographics();
        }
    });

    // Show demographic info before results
    function showDemographics() {
        // Hide question container
        document.getElementById('questionContainer').style.display = 'none';
        // Show demographics step
        document.getElementById('step3').style.display = 'block';
        // Hide results step
        document.getElementById('step4').style.display = 'none';
        
        // Update progress
        updateProgress(3);
    }

    // Handle show results button click
    document.getElementById('showResultsBtn').addEventListener('click', () => {
        // Get user info from form
        user.name = document.getElementById('userName').value;
        user.gender = document.querySelector('input[name="gender"]:checked').value;
        user.ageGroup = document.getElementById('ageGroup').value;
        
        // Validate age group is selected
        if (!user.ageGroup) {
            alert('Please select your age group');
            return;
        }
        
        // Show results
        showResults();
    });

    // Show results
    function showResults() {
        // Hide demographics
        document.getElementById('step3').style.display = 'none';
        // Show results
        document.getElementById('step4').style.display = 'block';
        
        // Calculate score
        const percentage = Math.round((score / questions.length) * 100);
        
        // Update results
        document.getElementById('nameResult').textContent = user.name ? `Name: ${user.name}` : '';
        document.getElementById('scoreResult').textContent = `Your score: ${score} out of ${questions.length} (${percentage}%)`;
        
        // Update progress
        updateProgress(4);
        
        // Show the score graphic
        createScoreGraphic(user.name || 'You', score, questions.length, percentage);
    }

    // Create score graphic on canvas
    function createScoreGraphic(userName, userScore, totalQuestions, percentage) {
        const canvas = document.getElementById('scoreCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 600;
        canvas.height = 400;
        
        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f5f7fa');
        gradient.addColorStop(1, '#c3cfe2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 28px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Civic Knowledge Score', canvas.width / 2, 60);
        
        // Add user name
        ctx.font = '20px Poppins, sans-serif';
        ctx.fillText(userName, canvas.width / 2, 100);
        
        // Draw score circle
        const centerX = canvas.width / 2;
        const centerY = 200;
        const radius = 80;
        
        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 15;
        ctx.stroke();
        
        // Draw score arc
        const startAngle = -Math.PI / 2;
        const endAngle = (Math.PI * 2 * percentage / 100) - (Math.PI / 2);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Add score text
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 42px Poppins, sans-serif';
        ctx.fillText(`${percentage}%`, centerX, centerY + 15);
        
        // Add score details
        ctx.font = '18px Poppins, sans-serif';
        ctx.fillText(`You scored ${userScore} out of ${totalQuestions}`, centerX, centerY + 60);
        
        // Add website URL
        ctx.font = '14px Poppins, sans-serif';
        ctx.fillStyle = '#7f8c8d';
        ctx.fillText('uongozi-civic.tech', centerX, canvas.height - 30);
        
        return canvas.toDataURL('image/png');
    }

    const userScore = score;
    const totalQuestions = questions.length;
    const percentage = Math.round((userScore / totalQuestions) * 100);

    // Hide the text score and show the canvas
    nameResult.style.display = 'none';
    scoreResult.style.display = 'none';

    // Create the score graphic
    const scoreImage = createScoreGraphic(userName, userScore, totalQuestions, percentage);
    
    // Share functionality
    const shareText = `I scored ${userScore}/${totalQuestions} (${percentage}%) on the Uongozi Civic Tech Exam! Test your civic knowledge now!`;
        
    // Update URL with score parameters for sharing
    const shareParams = new URLSearchParams({
        name: encodeURIComponent(userName),
        score: userScore,
        total: totalQuestions,
        percentage: percentage,
        share: 'true'  // Add share parameter for permalinks
    });
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?${shareParams.toString()}`;
    
    // Update the page URL without reloading
    window.history.pushState({}, '', shareUrl);
    
    // Generate the URL for the dynamic score image
    const ogImageUrl = `${window.location.origin}/api/og-image?name=${encodeURIComponent(userName)}&score=${userScore}&total=${totalQuestions}&percentage=${percentage}`;
    
    // Update Open Graph meta tags
    const ogTitle = document.getElementById('og-title');
    const ogDescription = document.getElementById('og-description');
    const ogUrl = document.getElementById('og-url');
    const ogImage = document.getElementById('og-image');
    const twitterTitle = document.getElementById('twitter-title');
    const twitterDescription = document.getElementById('twitter-description');
    const twitterUrl = document.getElementById('twitter-url');
    const twitterImage = document.getElementById('twitter-image');

    if (ogTitle) ogTitle.content = `${userName}'s Civic Knowledge Score: ${percentage}%`;
    if (ogDescription) ogDescription.content = `Scored ${userScore} out of ${totalQuestions} on the Uongozi Civic Tech Exam!`;
    if (ogUrl) ogUrl.content = shareUrl;
    if (ogImage) ogImage.content = ogImageUrl;
    if (twitterTitle) twitterTitle.content = `${userName}'s Civic Knowledge Score: ${percentage}%`;
    if (twitterDescription) twitterDescription.content = `Scored ${userScore} out of ${totalQuestions} on the Uongozi Civic Tech Exam!`;
    if (twitterUrl) twitterUrl.content = shareUrl;
    if (twitterImage) twitterImage.content = ogImageUrl;

    // Set up share buttons
    const shareFacebook = document.getElementById('shareFacebook');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareWhatsApp = document.getElementById('shareWhatsApp');
    const copyLink = document.getElementById('copyLink');

    if (shareFacebook) {
        shareFacebook.addEventListener('click', () => {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
            showMessage('Shared on Facebook!');
        });
    }

    if (shareTwitter) {
        shareTwitter.addEventListener('click', () => {
            const twitterText = `${userName} scored ${userScore}/${totalQuestions} on the Uongozi Civic Tech Exam!`;
            const twitterShareUrl = `https://x.com/intent/post?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterShareUrl, '_blank', 'width=600,height=400');
            showMessage('Shared on X!');
        });
    }

    if (shareWhatsApp) {
        shareWhatsApp.addEventListener('click', () => {
            const whatsappText = `${userName} scored ${userScore}/${totalQuestions} (${percentage}%) on the Uongozi Civic Tech Exam! ${shareUrl}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
            window.open(whatsappUrl, '_blank');
            showMessage('Shared on WhatsApp!');
        });
    }

    // Copy Link with Image
    if (copyLink) {
        copyLink.addEventListener('click', async () => {
            try {
                // Create a temporary link to download the image
                const link = document.createElement('a');
                link.href = scoreImage;
                link.download = `civic-score-${userName.replace(/\s+/g, '-').toLowerCase()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Also copy the URL to clipboard
                await navigator.clipboard.writeText(shareUrl);
                showMessage('Score image downloaded and link copied!');
            } catch (err) {
                console.error('Failed to save image: ', err);
                try {
                    // Fallback to just copying the URL
                    await navigator.clipboard.writeText(shareUrl);
                    showMessage('Link copied to clipboard!');
                } catch (err2) {
                    console.error('Failed to copy link: ', err2);
                    showMessage('Failed to copy. Please try again.');
                }
            }
        });
    }

    function showMessage(msg) {
    const shareMessage = document.getElementById('share-message');
    if (shareMessage) {
        shareMessage.textContent = msg;
        setTimeout(() => {
            if (shareMessage) shareMessage.textContent = '';
        }, 3000);
    }
}

// Initialize restart button event listener
const restartButton = document.getElementById('restart-btn');
if (restartButton) {
    restartButton.addEventListener('click', () => {
        // Reset app state
        appState.currentQuestion = 0;
        appState.score = 0;
        appState.answers = [];
        appState.userInfo = { name: '', ageGroup: '', gender: '' };
        
        // Reset UI
        const demographicsForm = document.getElementById('demographicsForm');
        if (demographicsForm) {
            demographicsForm.reset();
        }
        
        // Show landing page
        showStep('landing');
    });
}
