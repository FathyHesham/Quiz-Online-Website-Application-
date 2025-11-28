// =============================== Create General Variables ===============================
let questions = [];  // Array To Store Question In It
let userAnswers = [];  // Array To Store User Answers In It
let currentQuestionIndex = 0;  // Index Of Question
let correctAnswers = 0;  //  Counter Of Correct Answer
let timerInterval;  // Interval ID For The Main Quiz Countdown Timer 
let timerDownQuiz = 600;  // Timer Of Quiz
let startCouterDown = 5;  // Counter Of Start Quiz
let quizStarted = false;  // Boolean Value To Explain Start Quiz Or Not
let counterDownInterval;  // Interval ID For The Start Quiz Countdown Timer 

// =============================== Fetch Data From API Link ===============================
/**
 * Fetches Quiz Questions From The Provided Open Trivia DB API endpoint. 
 * @param {string} linkApi - The Full API URL To Retrieve Question From
 * @returns {Promise<Array>} - Array Of Question Object
 */
async function getQuestion (linkApi) {
    try {
        const response = await fetch(linkApi);
        // Check If The Response Was Successful Or Not
        if (response.ok) {
            console.log("🤌 Fetching Data....");
            // Convert Object API To Object JS
            let data = await response.json();
            // Store Question In Global Variable Named "questions"
            questions = data.questions_answers || [];
            return questions;
        } else {
            throw new Error(`Error Status - ${response.status}`);
        }
    } catch (error) {
        console.error("Error Fetching Data:", error.message);
    } finally {
        console.log("☑️ Fetch Attempt Finished.");
    }
}
// Self-Invoking Async Function To Kick Off Question Loading As Soon As The Script Run
(async () => {
    questions = await getQuestion("data/questions.json");
})();

// =============================== Get All Element ===============================
const bodyElement = document.body;
const startScreen = document.getElementById("start-screen");
const startTimerElement = document.getElementById("start-timer");
const startCounterElement = document.getElementById("start-counter");
const startQuizButton = document.getElementById("start-quiz-button");

const quizScreen = document.getElementById("quiz-screen");
const headerElement = document.getElementById("header-card");
const timerQuiz = document.getElementById("counter");
const numberOfPage = document.getElementById("number-of-page");

const contentElement = document.getElementById("content-card");
const metaInformation = document.getElementById("meta-information");
const typeElement = document.getElementById("type");
const categoryElement = document.getElementById("category");
const difficultyElement = document.getElementById("difficulty");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");

const footerElement = document.getElementById("footer-card");
const nextPrevButtonsElement = document.getElementById("next-prev-buttons");
const prevButton = document.getElementById("prev-ques");
const nextButton = document.getElementById("next-ques");
const darkIcon = document.getElementById("dark-icon");

const resultScreen = document.getElementById("result-screen");
const statusElement = document.getElementById("status");
const scoreElement = document.getElementById("score");
const gradeElement = document.getElementById("grade");
const percentageElement = document.getElementById("percentage");
const tryAgainButton = document.getElementById("try-again");

// =============================== Animation Helper Functions ===============================
/**
 * Add Animation Class To Element And Remove It After Animation Ends
 * @param {HTMLElement} element - The Element To Animate
 * @param {string} animationClass - The Animation Class To Add
 */
function animateElement (element, animationClass) {
    element.classList.add(animationClass);
    element.addEventListener('animationend', function handler () {
        element.classList.remove(animationClass);
        element.removeEventListener('animationend', handler);
    });
}

/**
 * Transition Between Screens With Animation
 * @param {HTMLElement} hideScreen - Screen To Hide
 * @param {HTMLElement} showScreen - Screen To Show
 * @param {string} hideAnimation - Animation For Hiding
 * @param {string} showAnimation - Animation For Showing
 */
function transitionScreen (hideScreen, showScreen, hideAnimation = 'fade-out', showAnimation = 'fade-in') {
    // Add Hide Animation
    hideScreen.classList.add(hideAnimation);

    // Wait For Animation To Complete Before Switching Screens
    setTimeout(() => {
        hideScreen.classList.add('hidden');
        hideScreen.classList.remove(hideAnimation);

        showScreen.classList.remove('hidden');
        animateElement(showScreen, showAnimation);
    }, 600); // Match Animation Duration
}

// =============================== Start Screen ===============================
// Hidden Quiz Screen & Result Screen & Show Start Screen
quizScreen.classList.add("hidden");
resultScreen.classList.add("hidden");
// Add Initial Animation To Start Screen
animateElement(startScreen, 'scale-in');

// Add Event To startQuizButton "Click"
startQuizButton.addEventListener("click", () => {
    // Disable The Start Button To Prevent Multiple Clicks
    startQuizButton.disabled = true;
    startQuizButton.style.opacity = "0.5";
    startQuizButton.style.cursor = "not-allowed";

    // Show Timer Element Of Remove Class "hidden" From "startTimerElement"
    startTimerElement.classList.remove("hidden");
    animateElement(startTimerElement, 'scale-in');
    startCounterElement.textContent = startCouterDown;

    // Start The Counter Down To Start Quiz
    counterDownInterval = setInterval(() => {
        startCouterDown--;
        startCounterElement.textContent = startCouterDown;

        // Add pulse Animation To Counter
        animateElement(startCounterElement, 'pulse');

        // When CounterDown Reaches Zero -> Hide CounterDown And show The Actual Quiz
        if (startCouterDown <= 0) {
            clearInterval(counterDownInterval);
            showQuizScreen();  // Function To Show Quiz Screen
        }
    }, 1000);
});

// =============================== Quiz Screen ===============================
// Create Function To Show The Quiz Screen & Content In It & Hidden To Start Screen
function showQuizScreen () {
    // Transition from start screen to quiz screen with animation
    transitionScreen(startScreen, quizScreen, 'fade-out', 'slide-in-right');

    quizStarted = true;  // Mark That The Quiz Has Officially Started
    userAnswers = new Array(questions.length).fill(null); // Initialize An Array To Store User's Answers
    startTimer();  // Call "startTimer" Function To Start Timer Of Start The Quiz
    startQuiz(); // Call "startQuiz" Function To  Start Quiz
}

// Create Function Named "startTimer" Using To Calculation The Time Of Quiz
function startTimer () {
    // Store The Original Quiz Duration
    const totalTime = timerDownQuiz;

    // Start 1-Second Interval That CountDown The Remaining Quiz Time
    timerInterval = setInterval(() => {
        timerDownQuiz--;  // Decrease Remaining Time By 1-Second
        // Calculation The Minute & Second
        const minutes = Math.floor(timerDownQuiz / 60);
        const seconds = timerDownQuiz % 60;
        timerQuiz.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Visual Alert : When Half Or Less Of The Time Remains -> True Timer Red
        if (timerDownQuiz <= (totalTime / 2)) {
            timerQuiz.style.color = "white";
            timerQuiz.style.background = "#ef4444";
            timerQuiz.style.fontWeight = "bold";
        }

        // Time's Up -> Stop Timer & End The Quiz
        if (timerDownQuiz <= 0) {
            clearInterval(timerInterval);
            endQuiz();  // Call End Quiz Function
        }
    }, 1000);
}

/**
 * Shuffles The Elements Of An Array In Place Using The Fisher-Yates (Shuffle Algorithm).
 * Return A New Shuffle Array Without Modifiying The Original One.
 * @param {Array} array - The Array To Shuffle (Can Contain Any Type Of Elements)
 * @returns {Array} - A New Array With The Same Elements In Random Order
 */
function shuffleArray (array) {
    // Create A Copy Of The Original Array To Avoid Mutating It
    let newArray = [...array];
    // Start Form The Last Element And Move Backwards To The Second Element   
    for (let i = newArray.length - 1; i > 0; i--) {
        // Generate A Random Index Between 0 And i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap Elements At Indeices i & j Using Array Destructuring
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Create "startQuiz" Function To Building The Heading And Content Quiz [Meta Information - Questions - Answers]
function startQuiz () {
    // If currentQuestionIndex Is Greater Than Or Equal Length Of Question [End The Quiz]
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    // ==================== Update Question Meta Information ====================
    typeElement.textContent = currentQuestion.type === "multiple" ? "Multiple Choice" : "True or False";
    categoryElement.textContent = currentQuestion.category;

    categoryElement.textContent === "Science: Computers"
        ? categoryElement.textContent = "Computer Science"
        : categoryElement.textContent = "None";

    difficultyElement.textContent = currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1);

    // ==================== Display The Question Text ====================
    questionElement.textContent = currentQuestion.question;

    // ==================== Prepare and Shuffle Answers ====================
    const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
    const shuffleAnswers = shuffleArray(allAnswers);

    // Clear Previous Answer Choices
    answersElement.innerHTML = '';

    // Create Answers Choice Elements
    shuffleAnswers.forEach((answer, index) => {
        const choiceDiv = document.createElement("div");
        choiceDiv.classList.add("choice");

        if (answer === currentQuestion.correct_answer) {
            choiceDiv.classList.add('correct');
        }

        const input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "quiz");
        input.setAttribute("id", `ch-${index}`);

        const label = document.createElement("label");
        label.setAttribute("for", `ch-${index}`);
        label.textContent = answer;

        choiceDiv.append(input, label);

        choiceDiv.addEventListener("click", () => {
            selectAnswer(choiceDiv, input);
            // Enable next button when answer is selected
            updateNextButtonState();
        });

        answersElement.appendChild(choiceDiv);
    });

    // ==================== Update Progress Indicator ====================
    numberOfPage.textContent = `${currentQuestionIndex + 1} Of ${questions.length} Questions`;
    animateElement(numberOfPage, 'fade-in');

    // ==================== Restore Previously Selected Answer (if any) ====================
    if (userAnswers[currentQuestionIndex]) {
        const savedAnswer = userAnswers[currentQuestionIndex];
        const choices = document.querySelectorAll(".choice");
        choices.forEach((choice) => {
            const label = choice.querySelector('label');
            if (label.textContent === savedAnswer) {
                const input = choice.querySelector("input");
                input.checked = true;
                choice.classList.add('selected');
            }
        });
    }

    // ==================== Previous Button Visibility ====================
    if (currentQuestionIndex === 0) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'inline-block';
    }

    // ==================== Update Next Button State ====================
    updateNextButtonState();
}

/**
 * Update the state of next button based on whether an answer is selected
 */
function updateNextButtonState () {
    const selectedAnswer = document.querySelector('input[name="quiz"]:checked');

    if (selectedAnswer || userAnswers[currentQuestionIndex]) {
        nextButton.disabled = false;
        nextButton.style.opacity = "1";
        nextButton.style.cursor = "pointer";
    } else {
        nextButton.disabled = true;
        nextButton.style.opacity = "0.5";
        nextButton.style.cursor = "not-allowed";
    }
}

/**
 * Handling The Selection Of An Answer Choice In A Quiz Interface.
 * @param {HTMLElement} choiceDiv - The Div / Container Representing A Single Answer Choice
 * @param {HTMLElement} input - The Radio Input Element Associated With This Choice
 */
function selectAnswer (choiceDiv, input) {
    // Remove Previous Selections
    document.querySelectorAll('.choice').forEach(choice => {
        choice.classList.remove('selected');
    });

    // Check The Radio Button
    input.checked = true;

    // Highlight Selected Answer With Animation
    choiceDiv.classList.add('selected');
    animateElement(choiceDiv, 'pulse');

    // Extract The Visible Text Of The Selected Answer  
    const selectedText = choiceDiv.querySelector('label').textContent.trim();
    // Store Of User's Answer
    userAnswers[currentQuestionIndex] = selectedText;
}

// Add Event Of Next Question Button
nextButton.addEventListener("click", () => {
    // Find The Currently Checked Redio Input Within The Quiz
    const selectedAnswer = document.querySelector('input[name="quiz"]:checked');

    // Animate content before moving to next question
    animateElement(contentElement, 'fade-out');

    setTimeout(() => {
        // Move To The Next Question
        currentQuestionIndex++;
        if (currentQuestionIndex >= questions.length) {
            endQuiz();
        } else {
            startQuiz();
            animateElement(contentElement, 'slide-in-right');
        }

        // Update The Next/Submit Button Text Based On The Current Question
        if (currentQuestionIndex === (questions.length - 1)) {
            nextButton.textContent = "Submit";
            nextButton.style.background = "#10b981";
            nextButton.style.color = "#FFFFFF";
        } else {
            nextButton.textContent = "Next Question";
            nextButton.style.background = ""; // revert to default
        }
    }, 300);
});

// Add Event Of Previous Question Button
prevButton.addEventListener("click", () => {
    // If The User Is Aleardy On Question 0 (The First One), Do Nothing
    if (currentQuestionIndex <= 0) return;

    // Animate content before moving to previous question
    animateElement(contentElement, 'fade-out');

    setTimeout(() => {
        // Move To The Previous Question
        currentQuestionIndex--;
        startQuiz();  // Re-Render The Quiz with The New Previous Question
        animateElement(contentElement, 'slide-in-right');
    }, 300);
});

// =============================== Result Screen ===============================
/**
 * End The Quiz, Stop Timer, Hidden Quiz Screen
 * Show Result Screen, Display final Score With Feedback
 */
function endQuiz () {
    // Stop The CounterDown Timer Immediately
    clearInterval(timerInterval);
    // Mark The Quiz As No Longer Active
    quizStarted = false;

    // Calculate Final Score By Comparing All User Answers With Correct Answers
    userAnswers.forEach((answer, index) => {
        if (answer && answer === questions[index].correct_answer) {
            correctAnswers++;
        }
    });

    // Transition from quiz screen to result screen with animation
    transitionScreen(quizScreen, resultScreen, 'fade-out', 'scale-in');

    // Calculation The User's Score As Percentage
    const percentage = ((correctAnswers / questions.length) * 100).toFixed(1);

    // Provide Motivational Feedback Based On Performance
    if (percentage >= 70) {
        statusElement.textContent = 'Congratulation 🎊🎉🎈';
        statusElement.style.color = 'var(--success)';
    } else if (percentage >= 50) {
        statusElement.textContent = 'Good Job 👍';
        statusElement.style.color = 'var(--accent)';
    } else {
        statusElement.textContent = 'Try Again 💪';
        statusElement.style.color = 'var(--danger)';
    }

    // Display The Score 
    gradeElement.querySelector('span').textContent = `${correctAnswers} / ${questions.length}`;
    // Display The Percentage Score
    percentageElement.querySelector('span').textContent = `${percentage} %`;
}

// Add Event Dark Theme
darkIcon.addEventListener("click", () => {
    bodyElement.classList.toggle("dark-theme");
    animateElement(darkIcon, 'pulse');
});

// If Event Try Again Button, Loading The Quiz Again & Start With Starting Screen
tryAgainButton.addEventListener("click", () => {
    animateElement(resultScreen, 'fade-out');
    setTimeout(() => {
        location.reload();
    }, 600);
});