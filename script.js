// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name') ? decodeURIComponent(params.get('name')) : null,
        score: params.get('score') ? parseInt(params.get('score')) : null,
        total: params.get('total') ? parseInt(params.get('total')) : null,
        percentage: params.get('percentage') ? parseInt(params.get('percentage')) : null,
        share: params.has('share')
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're loading a shared result
    const urlParams = getUrlParams();
    if (urlParams.name && urlParams.score !== null && urlParams.total !== null) {
        // We have shared result data, show the results directly
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        
        const sharedScore = urlParams.score;
        const sharedTotal = urlParams.total;
        const sharedName = urlParams.name;
        const isPermalink = urlParams.share;
        
        if (sharedScore && sharedTotal) {
            // If loading from a shared URL, show the results directly
            const scorePercentage = urlParams.percentage || Math.round((sharedScore / sharedTotal) * 100);
            const displayName = sharedName || 'You';
            
            document.getElementById('nameResult').textContent = `${displayName}'s Results:`;
            document.getElementById('scoreResult').textContent = `You scored ${sharedScore} out of ${sharedTotal} (${scorePercentage}%)`;
            
            // Show the results section
            document.getElementById('step3').style.display = 'block';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step1').style.display = 'none';
            
            // If this is a permalink (shared URL), show the embedded score image
            if (isPermalink) {
                const ogImageUrl = `${window.location.origin}/api/og-image?name=${encodeURIComponent(displayName)}&score=${sharedScore}&total=${sharedTotal}&percentage=${scorePercentage}`;
                const embeddedImage = document.getElementById('embedded-score-image');
                const embeddedContainer = document.getElementById('embedded-score-container');
                
                // Set the image source and show the container
                embeddedImage.src = ogImageUrl;
                embeddedContainer.style.display = 'block';
                
                // Hide the canvas since we're showing the image
                document.getElementById('score-canvas-container').style.display = 'none';
            } else {
                // Generate the score graphic for the shared result (not a permalink)
                createScoreGraphic(displayName, parseInt(sharedScore), parseInt(sharedTotal), scorePercentage);
            }
            
            // Update the page title
            document.title = `${displayName}'s Civic Knowledge Score | Uongozi Civic Tech`;
        }
    }
    
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
        const shareFacebook = document.getElementById('shareFacebook');
        const shareWhatsApp = document.getElementById('shareWhatsApp');
        const copyLink = document.getElementById('copyLink');

        const userName = user.name;
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
        document.getElementById('og-title').content = `${userName}'s Civic Knowledge Score: ${percentage}%`;
        document.getElementById('og-description').content = `Scored ${userScore} out of ${totalQuestions} on the Uongozi Civic Tech Exam!`;
        document.getElementById('og-url').content = shareUrl;
        document.getElementById('og-image').content = ogImageUrl;
        
        // Update Twitter meta tags
        document.getElementById('twitter-title').content = `${userName}'s Civic Knowledge Score: ${percentage}%`;
        document.getElementById('twitter-description').content = `Scored ${userScore} out of ${totalQuestions} on the Uongozi Civic Tech Exam!`;
        document.getElementById('twitter-url').content = shareUrl;
        document.getElementById('twitter-image').content = ogImageUrl;

        // Facebook Share
        shareFacebook.addEventListener('click', () => {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
            showMessage('Shared on Facebook!');
        });

        // Twitter Share
        shareTwitter.addEventListener('click', () => {
            const twitterText = `${userName} scored ${userScore}/${totalQuestions} on the Uongozi Civic Tech Exam!`;
            const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
            showMessage('Shared on X!');
        });

        // WhatsApp Share
        shareWhatsApp.addEventListener('click', () => {
            const whatsappText = `${userName} scored ${userScore}/${totalQuestions} (${percentage}%) on the Uongozi Civic Tech Exam! ${shareUrl}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
            window.open(whatsappUrl, '_blank');
            showMessage('Shared on WhatsApp!');
        });

        // Copy Link with Image
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
