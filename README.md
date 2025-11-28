# Quiz Online Website Application

The Quiz application aims to deliver a smooth and interactive testing experience built entirely using Front-End technologies. It provides users with a structured and professional flow to navigate through questions, track remaining time, and view final results in a clear and engaging way.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [How to Run and Use the Project](#how-to-run-and-use-the-project)
- [Application Workflow](#application-workflow)
- [Images](#images)
- [Contributing](#contributing)
- [Contact](#contact)

## Overview

The Quiz application is a fully interactive project built entirely using Front-End technologies. It is designed to provide users with a smooth, engaging, and professional testing experience.

1. **Start Screen :** The app begins with a start screen that includes a Title, a Start Button, and a Countdown Timer. Once the countdown reaches zero, the user is taken to the main quiz interface. The main quiz screen consists of four primary sections:
2. **Quiz Screen :** The main quiz screen consists of four primary sections:
    - **Header Section** : The header includes two main elements:
        - The quiz timer runs continuously, and when the user reaches half of the allocated time, the timer turns red as a warning indicator.
        - The title of the quiz is clearly displayed in the header, along with the total number of questions or any additional details depending on the design.
    - **Information Section :** This section displays essential details about the quiz, including [Type Of Quiz - Category - Difficulty Level].
    - **Question Section** : The quiz contains 10 questions, each displayed with multiple-choice answers. A shuffle algorithm is applied to randomize the order of the answer choices, ensuring fairness and unpredictability.
    - **Navigation Section** : This section includes two buttons:
        - **Previous Question Button - Next Question Button**
        - Additional logic:
            - The Previous Question button is hidden on the first question.
            - The Next Question button remains disabled until the user selects an answer.
            - On the last question, the Next button changes to Submit, which calculates the final score.
        - **Theme Switching Button** : A button to toggle between light and dark themes for better user experience.
3. **Result Screen :** After submitting the quiz, the result page appears showing [Final score - Percentage - Performance label (e.g., Congratulation – Good Job – Try Again)]. It also includes a Try Again button to restart the quiz.

## Features

- A **countdown timer** runs before the quiz starts, and the **Start Button** remains disabled until the countdown ends.
- The quiz includes a **default time of 10 minutes**, and the timer turns **red** when half of the time is reached.
- Navigation between questions is supported through **Previous Question Button** and **Next Question Button**.
- The **Next Question Button** is disabled until the user selects an answer.
- **User answers are saved** immediately once an option is selected.
- **Randomizing answer choices** using a **Shuffle Algorithm** to ensure fairness.
- Support for **Light Theme** and **Dark Theme** modes.
- Display of the **final result** along with a performance evaluation such as: **Congratulation – Good Job – Try Again**.
- A **Try Again Button** is provided to restart the quiz.
- Fully **responsive design**, optimized for large, medium, and small screens.

## Technologies Used

- HTML5  
- CSS3  
- Bootstrap  
- Font Awesome  
- JavaScript ES6  
- Fetch API  
- Local JSON file

## Project Structure

``` Markdown
Quiz-Online-Website-Application/
│
├── index.html
├── Style/
│   ├── main.css
│   ├── bootstrap.min.css
│   └── all.min.css
│
├── Script/
│   ├── main.js
│   ├── bootstrap.bundle.min.js
│   └── all.min.js
│
└── Data/
    └── questions.json
```

## How to Run and Use the Project

1. For Developers (Using Git Clone):
    - You can run the project easily by cloning the repository from GitHub:

        ```bash
        git clone https://github.com/FathyHesham/quiz-online-website-application
        ```

    - Navigate to the project folder:

        ```bash
        cd quiz-online-website-application
        ```

2. For Non-Developers (No Git or VS Code Required):
    - The project does not require any tools or installations. Anyone can run it directly:
        - On the GitHub repository page, click: Code → Download ZIP
        - Extract the downloaded ZIP file.
        - Open the index.html file by double-clicking it.

## Application Workflow

1. **Start Screen :** When opening the application, the start screen displays:
    - Title of the Quiz
    - Start Button (disabled initially)
    - Countdown Counter starts when the Start Button is clicked.
        - Countdown begins from 5 seconds.
        - When it reaches zero, the user is automatically redirected to the Quiz Screen.

```javascript
startQuizButton.addEventListener("click", () => {
    startQuizButton.disabled = true;
    startTimerElement.classList.remove("hidden");
    startCounterElement.textContent = startCouterDown;

    counterDownInterval = setInterval(() => {
        startCouterDown--;
        startCounterElement.textContent = startCouterDown;

        if (startCouterDown <= 0) {
            clearInterval(counterDownInterval);
            showQuizScreen();
        }
    }, 1000);
});
```

2. **Quiz Screen :** After the countdown ends, quiz questions are displayed with the following sections:
    - **Question Meta Information :** Displays details for each question [Type Of Quiz - Category - Difficulty Level].

```javascript
typeElement.textContent = currentQuestion.type === "multiple" ? "Multiple Choice" : "True or False";
categoryElement.textContent = currentQuestion.category;
difficultyElement.textContent = currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1);
```

3. **Quiz Time :** Quiz duration is **10 minutes (600 seconds)**. When the timer reaches half of the time, it turns **red** as a warning.

```javascript
if (timerDownQuiz <= (totalTime / 2)) {
    timerQuiz.style.color = "white";
    timerQuiz.style.background = "#ef4444";
}
```

4. **Questions & Options Display :** The app contains 10 questions loaded from: ```Data/questions.json```. All options are randomized using a Shuffle Algorithm. The shuffle is applied for every question, showing a new order each time.

```javascript
function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
```

5. **Navigation (Next / Previous Buttons)**
    - **Previous Question Button** is hidden on the first question.
    - **Next Question Button** is disabled until an answer is selected.
    - When an answer is chosen → **Next Button** is activated.
    - On the last question, **Next Button** changes to **Submit**.

```javascript
function updateNextButtonState() {
    const selectedAnswer = document.querySelector('input[name="quiz"]:checked');
    nextButton.disabled = !(selectedAnswer || userAnswers[currentQuestionIndex]);
}
// Submit Button Logic
if (currentQuestionIndex === (questions.length - 1)) {
    nextButton.textContent = "Submit";
}
```

6. **User Answers Storage :** If the user navigates back to a previous question, the **previously selected answer** is displayed.

```javascript
if (userAnswers[currentQuestionIndex]) {
    const savedAnswer = userAnswers[currentQuestionIndex];
    const choices = document.querySelectorAll(".choice");
    choices.forEach(choice => {
        if (choice.querySelector('label').textContent === savedAnswer) {
            choice.classList.add('selected');
        }
    });
}
```

7. **Dark / Light Mode :** Users can toggle between **Light / Dark Theme** with a single button. The entire CSS updates according to **root variables** when toggling.

```javascript
darkIcon.addEventListener("click", () => {
    bodyElement.classList.toggle("dark-theme");
});
```

8. **Result Screen :** After pressing Submit or when the timer ends:
    - Calculate **number of correct answers**.
    - Calculate **percentage score**.
    - Display a **performance message** based on the result **[Congratulation – Good Job – Try Again]**.
    - Display **Try Again Button** to reload questions and restart the quiz.

```javascript
const percentage = ((correctAnswers / questions.length) * 100).toFixed(1);

if (percentage >= 70) {
    statusElement.textContent = 'Congratulation 🎊🎉🎈';
} else if (percentage >= 50) {
    statusElement.textContent = 'Good Job 👍';
} else {
    statusElement.textContent = 'Try Again 💪';
}
```

## Images

![Start Screen](ssets/screens/start.png)
![Quiz Screen](assets/screens/quiz.png)
![Result Screen](assets/screens/result.png)

## Contributing

We welcome contributions to this project! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Submit a pull request.

## Contact

For any inquiries or further information, feel free to reach out:

- **Mail**: [fathyhesham2001@gmail.com](mailto:fathyhesham2001@gmail.com)
- **LinkedIn**: [Fathy Hesham Fathy](https://www.linkedin.com/in/fathy-hesham-fathy/)

---

**Thank you for visiting our project!** 🚀
