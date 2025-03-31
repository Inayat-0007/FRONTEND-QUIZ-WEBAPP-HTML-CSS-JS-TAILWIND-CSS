// State variables
let name = '';
let category = '';
let currentQuestion = 0;
let score = 0;
let usedFiftyFifty = false;
let usedShowAnswer = false;
let selectedAnswer = null;

// Full questions array
const questions = [
    {
        question: "Which sport is known as the 'King of Sports'?",
        options: ["Cricket", "Football", "Tennis", "Basketball"],
        correctAnswer: "Cricket",
        explanation: "Cricket is often referred to as the 'King of Sports' due to its long history and global popularity."
    },
    {
        question: "Which religion is the largest in the world?",
        options: ["Islam", "Hinduism", "Christianity", "Buddhism"],
        correctAnswer: "Christianity",
        explanation: "Christianity is the largest religion in the world with over 2.4 billion followers."
    },
    {
        question: "Who won the 2022 FIFA World Cup?",
        options: ["Brazil", "France", "Argentina", "Germany"],
        correctAnswer: "Argentina",
        explanation: "Argentina won the 2022 FIFA World Cup, defeating France in the final."
    },
    {
        question: "What is the oldest major world religion?",
        options: ["Hinduism", "Islam", "Christianity", "Buddhism"],
        correctAnswer: "Hinduism",
        explanation: "Hinduism is considered the oldest major world religion, with roots dating back over 4,000 years."
    },
    {
        question: "Which sport is played with a shuttlecock?",
        options: ["Basketball", "Tennis", "Badminton", "Volleyball"],
        correctAnswer: "Badminton",
        explanation: "Badminton is played with a shuttlecock, which is a small, feathered projectile."
    }
];

// Ensure DOM is loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            category = e.target.value;
            const startButton = document.querySelector('#category-section button');
            if (startButton) startButton.disabled = !category;
        });
    }
});

function submitName() {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!nameInput || !nameError) return console.error('Name input or error element not found');
    
    name = nameInput.value.trim();
    if (!name) {
        nameError.classList.remove('hidden');
        return;
    }
    nameError.classList.add('hidden');
    document.getElementById('name-section').classList.add('hidden');
    document.getElementById('category-section').classList.remove('hidden');
    document.getElementById('welcome-name').textContent = `Welcome, ${name}!`;
}

function startQuiz() {
    const categorySection = document.getElementById('category-section');
    const quizSection = document.getElementById('quiz-section');
    if (!categorySection || !quizSection) return console.error('Section elements not found');
    
    categorySection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= questions.length) return showResults();
    
    const q = questions[currentQuestion];
    const quizTitle = document.getElementById('quiz-title');
    const scoreDisplay = document.getElementById('score');
    const questionNumber = document.getElementById('question-number');
    const totalQuestions = document.getElementById('total-questions');
    const questionText = document.getElementById('question');
    const optionsDiv = document.getElementById('options');

    if (!quizTitle || !scoreDisplay || !questionNumber || !totalQuestions || !questionText || !optionsDiv) {
        return console.error('Quiz elements not found');
    }

    quizTitle.textContent = `Quiz: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    scoreDisplay.textContent = score;
    questionNumber.textContent = currentQuestion + 1;
    totalQuestions.textContent = questions.length;
    questionText.textContent = q.question;
    
    optionsDiv.innerHTML = '';
    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.className = 'p-4 text-left border rounded-lg hover:bg-indigo-50 transition-colors';
        btn.onclick = () => handleAnswer(option);
        optionsDiv.appendChild(btn);
    });

    // Reset lifeline buttons
    document.getElementById('fifty-fifty').disabled = usedFiftyFifty;
    document.getElementById('show-answer').disabled = usedShowAnswer;
}

function handleAnswer(answer) {
    selectedAnswer = answer;
    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll('#options button');
    const explanation = document.getElementById('explanation');
    const nextBtn = document.getElementById('next-btn');

    if (!explanation || !nextBtn) return console.error('Explanation or next button not found');

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === q.correctAnswer) {
            btn.classList.add('bg-green-500', 'text-white');
        } else if (btn.textContent === answer && answer !== q.correctAnswer) {
            btn.classList.add('bg-red-500', 'text-white');
        }
    });

    explanation.textContent = q.explanation;
    explanation.classList.remove('hidden');
    nextBtn.classList.remove('hidden');

    if (answer === q.correctAnswer) score++;
    document.getElementById('score').textContent = score;
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }
    selectedAnswer = null;
    usedFiftyFifty = false;
    usedShowAnswer = false;
    document.getElementById('explanation').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    loadQuestion();
}

function showResults() {
    const quizSection = document.getElementById('quiz-section');
    const resultSection = document.getElementById('result-section');
    const finalScore = document.getElementById('final-score');
    const upiForm = document.getElementById('upi-form');

    if (!quizSection || !resultSection || !finalScore || !upiForm) {
        return console.error('Result elements not found');
    }

    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    finalScore.textContent = `${score} out of ${questions.length}`;
    if (score === questions.length) {
        upiForm.classList.remove('hidden');
    }
}

function submitUPI() {
    const upiInput = document.getElementById('upi-id');
    const upiError = document.getElementById('upi-error');
    if (!upiInput || !upiError) return console.error('UPI elements not found');

    const upi = upiInput.value.trim();
    if (!upi) {
        upiError.classList.remove('hidden');
        return;
    }
    upiError.classList.add('hidden');
    alert('Thank you! Your reward will be credited soon.');
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    usedFiftyFifty = false;
    usedShowAnswer = false;
    selectedAnswer = null;
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.remove('hidden');
    loadQuestion();
}

function useFiftyFifty() {
    if (usedFiftyFifty) return;
    const q = questions[currentQuestion];
    const wrongOptions = q.options.filter(opt => opt !== q.correctAnswer);
    const keepWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    const newOptions = [q.correctAnswer, keepWrong].sort(() => Math.random() - 0.5);
    
    const optionsDiv = document.getElementById('options');
    if (!optionsDiv) return console.error('Options div not found');

    optionsDiv.innerHTML = '';
    newOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.className = 'p-4 text-left border rounded-lg hover:bg-indigo-50 transition-colors';
        btn.onclick = () => handleAnswer(option);
        optionsDiv.appendChild(btn);
    });
    usedFiftyFifty = true;
    document.getElementById('fifty-fifty').disabled = true;
}

function useShowAnswer() {
    if (usedShowAnswer) return;
    const q = questions[currentQuestion];
    handleAnswer(q.correctAnswer);
    usedShowAnswer = true;
    document.getElementById('show-answer').disabled = true;
}