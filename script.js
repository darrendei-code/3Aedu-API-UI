// ==================== 通用：画面切换 ====================
const homeScreen = document.getElementById("homeScreen");
const videoScreen = document.getElementById("videoScreen");
const quizScreen = document.getElementById("quizScreen");

function showScreen(screen) {
  homeScreen.style.display = screen === "home" ? "flex" : "none";
  videoScreen.style.display = screen === "video" ? "flex" : "none";
  quizScreen.style.display = screen === "quiz" ? "flex" : "none";
}

// 默认显示 Home
showScreen("home");

// ==================== HOME JS ====================
const homeHintText = document.getElementById("homeHintText");

const watchBtn = document.getElementById("watchBtn");
const videoBtn = document.getElementById("videoBtn");
const quizBtn = document.getElementById("quizBtn");

function playHomeClickAndHint(target, message) {
  // ✅ 音效已删除：这里不再播放 sound

  // 小动画
  target.classList.add("bump");
  setTimeout(() => target.classList.remove("bump"), 160);

  // 更新提示文字
  homeHintText.textContent = message;
  homeHintText.style.color = "#4b5563";
  setTimeout(() => {
    homeHintText.style.color = "#9ca3af";
  }, 1200);
}

watchBtn.addEventListener("click", () => {
  playHomeClickAndHint(watchBtn, "Opening Video Lesson…");
  showScreen("video");
});

videoBtn.addEventListener("click", () => {
  playHomeClickAndHint(videoBtn, "Navigating to Video Lesson…");
  showScreen("video");
});

quizBtn.addEventListener("click", () => {
  playHomeClickAndHint(quizBtn, "Navigating to Quiz…");
  showScreen("quiz");
});

// ==================== VIDEO JS ====================

// 两个 lesson 对应的 YouTube embed 链接
const videoSources = [
  "https://www.youtube.com/embed/Xh7lrudBzh8?si=8MHGMkKXtkI_nG0o",
  "https://www.youtube.com/embed/0CgMtqh4AM8?si=aR8DcKgA2UNg2Y41",
];

const player = document.getElementById("lessonPlayer");
const chips = document.querySelectorAll("#videoScreen .lesson-chip");
const playLessonBtn = document.getElementById("playLessonBtn");
const videoHintText = document.getElementById("videoHintText");
const backBtn = document.getElementById("backBtn");

// 切换 lesson
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    // ✅ 音效已删除：这里不再播放 sound

    // 更新 active 样式
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    // 切换视频
    const index = Number(chip.dataset.video);
    player.src = videoSources[index];

    // 更新 hint
    videoHintText.textContent =
      "Video changed. Tap ▶ inside the player to start the song.";
  });
});

// Play Lesson 按钮（主要做反馈）
playLessonBtn.addEventListener("click", () => {
  // ✅ 音效已删除：这里不再播放 sound

  // 简单强调提示文字
  videoHintText.textContent =
    "Please tap the ▶ button inside the YouTube video to start playing.";
  videoHintText.style.color = "#4b5563";

  playLessonBtn.textContent = "Ready! Tap ▶ in the video";
  setTimeout(() => {
    videoHintText.style.color = "#9ca3af";
  }, 1200);
});

// 返回 Home
backBtn.addEventListener("click", () => {
  // ✅ 音效已删除：这里不再播放 sound
  showScreen("home");
});

// ==================== QUIZ JS ====================

// -------------------- Quiz Data --------------------
const quizData = [
  {
    tag: "Quiz 1",
    question: "6+10?",
    options: [
      { text: "16", correct: true },
      { text: "17", correct: false },
      { text: "15", correct: false },
      { text: "19", correct: false },
    ],
  },
  {
    tag: "Quiz 2",
    question: "80*30?",
    options: [
      { text: "240", correct: true },
      { text: "320", correct: false },
      { text: "110", correct: false },
      { text: "270", correct: false },
    ],
  },
  {
    tag: "Quiz 3",
    question: "97-63?",
    options: [
      { text: "36", correct: false },
      { text: "34", correct: true },
      { text: "33", correct: false },
      { text: "31", correct: false },
    ],
  },
  {
    tag: "Quiz 4",
    question: "300/60?",
    options: [
      { text: "4", correct: false },
      { text: "8", correct: false },
      { text: "5", correct: true },
      { text: "7", correct: false },
    ],
  },
  {
    tag: "Quiz 5",
    question: "(615/3)+6*3?",
    options: [
      { text: "633", correct: false },
      { text: "223", correct: true },
      { text: "12", correct: false },
      { text: "621", correct: false },
    ],
  },
];

let currentIndex = 0;
let selectedOption = null;
let score = 0;

// DOM shortcuts
const quizTag = document.getElementById("quizTag");
const quizQuestion = document.getElementById("quizQuestion");
const optionsBox = document.getElementById("optionsBox");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const resultText = document.getElementById("resultText");

const soundCorrect = document.getElementById("sound-correct");
const soundWrong = document.getElementById("sound-wrong");
const quizCloseBtn = document.getElementById("quizCloseBtn");

// -------------------- Load a Question --------------------
function loadQuestion() {
  const q = quizData[currentIndex];

  quizTag.textContent = q.tag;
  quizQuestion.textContent = q.question;

  optionsBox.innerHTML = "";
  selectedOption = null;

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerHTML = `
      <span class="radio"></span>
      <span class="label">${opt.text}</span>
    `;
    btn.dataset.correct = opt.correct;

    btn.addEventListener("click", () => {
      document
        .querySelectorAll("#quizScreen .option")
        .forEach((o) => o.classList.remove("selected"));

      btn.classList.add("selected");
      selectedOption = btn;
      resultText.textContent = "";
      resultText.className = "result-text";
    });

    optionsBox.appendChild(btn);
  });

  progressFill.style.width = (currentIndex / quizData.length) * 100 + "%";
  progressText.textContent = `${currentIndex} / ${quizData.length}`;

  checkBtn.style.display = "block";
  nextBtn.style.display = "none";
  resultText.textContent = "";
}

// 初次加载
loadQuestion();

// -------------------- Check Answer --------------------
checkBtn.addEventListener("click", () => {
  if (!selectedOption) {
    resultText.textContent = "Please choose an answer.";
    resultText.className = "result-text wrong";
    soundWrong.currentTime = 0;
    soundWrong.play();
    return;
  }

  const correct = selectedOption.dataset.correct === "true";

  if (correct) {
    selectedOption.classList.add("correct");
    score++;
    resultText.textContent = "Correct! 🎉";
    resultText.className = "result-text correct";
    soundCorrect.currentTime = 0;
    soundCorrect.play();
  } else {
    selectedOption.classList.add("wrong");
    resultText.textContent = "Wrong answer ❌";
    resultText.className = "result-text wrong";
    soundWrong.currentTime = 0;
    soundWrong.play();
  }

  checkBtn.style.display = "none";
  nextBtn.style.display = "block";
});

// -------------------- Next Question --------------------
nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex < quizData.length) {
    loadQuestion();
  } else {
    showFinalScore();
  }
});

// -------------------- Final Score Page --------------------
function showFinalScore() {
  quizTag.textContent = "Quiz Completed!";
  quizQuestion.textContent = `Your Score: ${score} / ${quizData.length}`;

  optionsBox.innerHTML = "";
  resultText.textContent = "Well done!";
  resultText.className = "result-text correct";

  progressFill.style.width = "100%";
  progressText.textContent = `${quizData.length} / ${quizData.length}`;

  checkBtn.style.display = "none";
  nextBtn.style.display = "none";
}

// Quiz 关闭按钮 → 回到 Home
quizCloseBtn.addEventListener("click", () => {
  showScreen("home");
});