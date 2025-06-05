document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "What is the main role of the Independent Electoral and Boundaries Commission (IEBC)?",
            options: [
                "To make laws for Kenya",
                "To register political parties",
                "To manage elections and referenda",
                "To appoint judges"
            ],
            correctAnswer: 2
        },
        {
            question: "How often are General Elections held in Kenya?",
            options: [
                "Every 3 years",
                "Every 4 years",
                "Every 5 years",
                "Every 6 years"
            ],
            correctAnswer: 2
        },
        {
            question: "Which of the following is NOT a role of a Member of Parliament (MP)?",
            options: [
                "Representing their constituency",
                "Judging court cases",
                "Making laws",
                "Oversight of the executive"
            ],
            correctAnswer: 1
        },
        {
            question: "Who is allowed to vote in Kenyan elections?",
            options: [
                "Any resident of Kenya",
                "Only government employees",
                "Kenyan citizens aged 18 and above, and registered to vote",
                "People with a driving license"
            ],
            correctAnswer: 2
        },
        {
            question: "Which of the following elective positions is voted for in a General Election?",
            options: [
                "Cabinet Secretaries",
                "Principal Secretaries",
                "Chief Justice",
                "Members of County Assembly (MCAs)"
            ],
            correctAnswer: 3
        },
        {
            question: "How many elective positions does a Kenyan voter typically vote for in a General Election?",
            options: ["2", "4", "6", "7"],
            correctAnswer: 2
        },
        {
            question: "What is the term limit for a President in Kenya?",
            options: [
                "5 years",
                "10 years",
                "Two 5-year terms",
                "Unlimited"
            ],
            correctAnswer: 2
        },
        {
            question: "What is the main document that guides how Kenya is governed?",
            options: [
                "Presidential Decree",
                "The Constitution of Kenya, 2010",
                "Party Manifesto",
                "County Budget"
            ],
            correctAnswer: 1
        },
        {
            question: "What does 'devolution' mean in the context of the Kenyan Constitution?",
            options: [
                "Giving more powers to the President",
                "Transferring power from counties to the national government",
                "Sharing power and resources between the national and county governments",
                "Reducing the number of government jobs"
            ],
            correctAnswer: 2
        },
        {
            question: "Who is the head of a county government?",
            options: [
                "Senator",
                "County Commissioner",
                "Governor",
                "Member of Parliament"
            ],
            correctAnswer: 2
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let user = null;

    // Personal Information Form
    const personalInfoForm = document.getElementById('personalInfoForm');
    personalInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        user = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value
        };
        showQuestion();
    });

    // Update progress bar and step indicators
    function updateProgress(currentStep) {
        const progressBar = document.querySelector('.progress-bar');
        const steps = document.querySelectorAll('.step-indicator');
        const progressPercentage = (currentStep / 3) * 100;
        
        progressBar.style.setProperty('--progress', `${progressPercentage}%`);
        
        steps.forEach((step, index) => {
            if (index < currentStep) {
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
        
        // Update button text based on current question
        if (currentQuestion === questions.length - 1) {
            nextButton.textContent = 'Show Results';
        } else {
            nextButton.textContent = 'Next Question';
        }

        const questionText = document.getElementById('questionText');
        const options = document.getElementById('options');
        const submitButton = document.getElementById('submitAnswer');
        const feedback = document.getElementById('feedback');

        // Display question number and total questions (e.g., "1/10")
        questionText.innerHTML = `<span class="question-number">${currentQuestion + 1}/${questions.length}</span> ${questions[currentQuestion].question}`;
        options.innerHTML = '';
        feedback.textContent = '';
        submitButton.disabled = true;

        questions[currentQuestion].options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => {
                const selectedOptions = document.querySelectorAll('.option.selected');
                selectedOptions.forEach(opt => opt.classList.remove('selected'));
                optionDiv.classList.add('selected');
                submitButton.disabled = false;
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
        currentQuestion++;
        if (currentQuestion < questions.length) {
            // Update button text if it's the last question
            if (currentQuestion === questions.length - 1) {
                nextButton.textContent = 'Show Results';
            }
            showQuestion();
        } else {
            showResults();
        }
    });

    // Show Results
    function showResults() {
        const step2 = document.getElementById('step2');
        const step3 = document.getElementById('step3');
        step2.classList.remove('active');
        step3.classList.add('active');
        updateProgress(3); // Update progress to step 3 (results)

        const nameResult = document.getElementById('nameResult');
        const scoreResult = document.getElementById('scoreResult');
        const restartButton = document.getElementById('restartButton');
        const shareMessage = document.getElementById('shareMessage');
        const shareTwitter = document.getElementById('shareTwitter');
        const shareWhatsApp = document.getElementById('shareWhatsApp');
        const copyLink = document.getElementById('copyLink');

        const userName = user.name;
        const userScore = score;
        const totalQuestions = questions.length;
        const percentage = Math.round((userScore / totalQuestions) * 100);

        nameResult.textContent = `Name: ${userName}`;
        scoreResult.textContent = `Your Civic Score: ${userScore}/${totalQuestions} (${percentage}%)`;

        // Share functionality
        const shareText = `I scored ${userScore}/${totalQuestions} (${percentage}%) on the Uongozi Civic Tech Exam! Test your civic knowledge now!`;
        const shareUrl = window.location.href.split('?')[0]; // Get current URL without query params

        // Twitter Share
        shareTwitter.addEventListener('click', () => {
            const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
            showMessage('Shared on X!');
        });

        // WhatsApp Share
        shareWhatsApp.addEventListener('click', () => {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
            window.open(whatsappUrl, '_blank');
            showMessage('Shared on WhatsApp!');
        });

        // Copy Link
        copyLink.addEventListener('click', () => {
            navigator.clipboard.writeText(shareUrl).then(() => {
                showMessage('Link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showMessage('Failed to copy link. Please try again.');
            });
        });

        function showMessage(msg) {
            shareMessage.textContent = msg;
            setTimeout(() => {
                shareMessage.textContent = '';
            }, 3000);
        }

        restartButton.addEventListener('click', () => {
            currentQuestion = 0;
            score = 0;
            step3.classList.remove('active');
            step1.classList.add('active');
            personalInfoForm.reset();
        });
    }
});
