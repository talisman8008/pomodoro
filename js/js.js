
// Default Configurations
const modes = {
  WORK: { time: 25 * 60, label: 'STAY FOCUSED' },
  SHORT: { time: 5 * 60, label: 'SHORT BREAK' },
  LONG: { time: 15 * 60, label: 'LONG BREAK' },
  CUSTOM: { time: 25 * 60, label: 'CUSTOM BLOCK' } // default fallback
};
let activeSession = 'WORK';
let timeLeft = modes.WORK.time;
let totalTime = modes.WORK.time;
let timerId = null;
let sessionCount = 1;
// variables
const timerDisplay = document.getElementById('timer');
const timerStateLabel = document.getElementById('timer-state-label');
const sessionCountEl = document.getElementById('session-count');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const skipBtn = document.getElementById('skip');
const playIcon = document.getElementById('play-icon');
const autoFlowToggle = document.getElementById('auto-flow');
const alarm = document.getElementById('alarm');

//  Progress Circle
const progressCircle = document.getElementById('progress-circle');
// Initial Circumference
function getCircumference() {
  return progressCircle.r.baseVal.value * 2 * Math.PI;
}
function updateProgress() {
  const circumference = getCircumference();
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;

  // Calculate percentage
  const percent = timeLeft / totalTime;
  const offset = circumference - (percent * circumference);
  progressCircle.style.strokeDashoffset = offset;
}

// Window resize handler for progress ring responsiveness
window.addEventListener('resize', () => {
  updateProgress();
});

// =========================================================================
// Clock Logic
// =========================================================================
function updateDisplay() {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  let timerString = "";
  if (hours > 0) {
    timerString += `${hours < 10 ? '0' : ''}${hours}:`;
  }
  timerString += `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  timerDisplay.textContent = timerString;
  document.title = `(${timerString}) Aura Focus`;
  // Update SVG progress ring
  updateProgress();
}

function startTimer() {
  if (timerId !== null) return;

  playIcon.setAttribute('name', 'pause');

  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      playIcon.setAttribute('name', 'play');

      // Try to play alarm
      alarm.currentTime = 0;
      alarm.play().catch(e => console.log("Audio play prevented:", e));

      handleSessionComplete();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerId);
  timerId = null;
  playIcon.setAttribute('name', 'play');
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  playIcon.setAttribute('name', 'play');

  timeLeft = totalTime;
  updateDisplay();
}

function skipTimer() {
  clearInterval(timerId);
  timerId = null;
  playIcon.setAttribute('name', 'play');
  handleSessionComplete();
}

function handleSessionComplete() {
  if (activeSession === 'WORK') {
    sessionCount++;
    sessionCountEl.textContent = sessionCount;

    // Every 4th session is a long break
    if (sessionCount % 4 === 0) {
      handleModeSwitch('LONG');
    } else {
      handleModeSwitch('SHORT');
    }
  } else {
    handleModeSwitch('WORK');
  }
  if (autoFlowToggle && autoFlowToggle.checked) {
    setTimeout(startTimer, 1500);
  }
}
// =========================================================================
// Controls
// =========================================================================
startBtn.addEventListener('click', () => {
  if (timerId === null) {
    startTimer();
  } else {
    pauseTimer();
  }
});

resetBtn.addEventListener('click', () => {
  alarm.pause();
  alarm.currentTime = 0;
  resetTimer();
});
skipBtn.addEventListener('click', () => {
  skipTimer();
});
// =========================================================================
// Mode Logic
// =========================================================================
const modeButtons = document.querySelectorAll('.mode-btn');
function handleModeSwitch(modeKey) {
  activeSession = modeKey;
  const modeObj = modes[modeKey];
  totalTime = modeObj.time;
  timeLeft = totalTime;
  timerStateLabel.textContent = modeObj.label;
  clearInterval(timerId);
  timerId = null;
  playIcon.setAttribute('name', 'play');
  updateDisplay();
  // Update active pill
  modeButtons.forEach(btn => btn.classList.remove('active'));

  let targetBtnId = '';
  if (modeKey === 'WORK') targetBtnId = 'work-mode';
  if (modeKey === 'SHORT') targetBtnId = 'short-break';
  if (modeKey === 'LONG') targetBtnId = 'long-break';
  if (modeKey === 'CUSTOM') targetBtnId = 'custom-aloo';

  document.getElementById(targetBtnId).classList.add('active');
}
document.getElementById('work-mode').addEventListener('click', () => handleModeSwitch('WORK'));
document.getElementById('short-break').addEventListener('click', () => handleModeSwitch('SHORT'));
document.getElementById('long-break').addEventListener('click', () => handleModeSwitch('LONG'));

// =========================================================================
// Custom Modal Logic
// =========================================================================

const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal');
const setCustomBtn = document.getElementById('set-custom');
const customMin = document.getElementById('custom-minutes');
const customSec = document.getElementById('custom-seconds');
const customHrs = document.getElementById('custom-hours');
const customModeBtn = document.getElementById('custom-aloo');

customModeBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('hidden');
});
closeModalBtn.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});
setCustomBtn.addEventListener('click', () => {
  const min = parseInt(customMin.value) || 0;
  const sec = parseInt(customSec.value) || 0;
  const hrs = parseInt(customHrs.value) || 0;

  if (!isNaN(min) && !isNaN(sec) && !isNaN(hrs) && (hrs > 0 || min > 0 || sec > 0) && sec < 60 && min < 60) {
    const customTotalSeconds = (hrs * 3600) + (min * 60) + sec;
    // Update Custom time dynamically
    modes.CUSTOM.time = customTotalSeconds;
    handleModeSwitch('CUSTOM');
    modalOverlay.classList.add('hidden');
    // clearing values
    customHrs.value = '';
    customMin.value = '';
    customSec.value = '';
  } else {
    // basic feedback
    alert("Please enter a valid duration.");
  }
});


// =========================================================================
// Themes System
// =========================================================================

const themeBtn = document.getElementById('theme-btn');
const themeDropdown = document.getElementById('theme-dropdown');
const themeOptions = document.querySelectorAll('.theme-option');

let currentTheme = localStorage.getItem('auraTheme') || 'dark';

function applyTheme(themeKey) {
  document.body.setAttribute('data-theme', themeKey);
  localStorage.setItem('auraTheme', themeKey);
  currentTheme = themeKey;
}
//  dropdown Toggle
themeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  themeDropdown.classList.toggle('hidden');
});
// Close dropdown clicking outside
window.addEventListener('click', () => {
  if (!themeDropdown.classList.contains('hidden')) {
    themeDropdown.classList.add('hidden');
  }
});


// theme selection
themeOptions.forEach(opt => {
  opt.addEventListener('click', (e) => {
    e.stopPropagation();
    const themeId = opt.getAttribute('data-t');
    applyTheme(themeId);
    themeDropdown.classList.add('hidden');
  });
});

// Initialization
function init() {
  applyTheme(currentTheme);
  setTimeout(() => {
    handleModeSwitch('WORK');
  }, 10);
  // TODO:PERSIST CUSTOM
}
document.addEventListener('DOMContentLoaded', init);
