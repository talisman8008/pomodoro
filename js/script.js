let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;

const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset');
const startBtn = document.getElementById('start');

const alarm =document.getElementById('alarm');
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    // makes 25:9 look like 25:09
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

startBtn.addEventListener('click', () => {
    if (timerId === null) {
        startBtn.textContent='pause'
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                alert("Time is up! Take a break.");
            }
        }, 1000);
    }
     else {
         clearInterval(timerId);
         startBtn.textContent='start'
    }
});
 resetBtn.addEventListener('click',() => {
     clearInterval(timerId);
     timeLeft = 25 * 60; // 25 minutes in seconds
     timerId = null;
     updateDisplay();
     startBtn.textContent='start';
 });