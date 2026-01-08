let timeLeft = 1; // 25 minutes in seconds
let timerId = null;




const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset');
const startBtn = document.getElementById('start');
const shortBrk = document.getElementById('start');
const longBrk = document.getElementById('start');
const customtBrk = document.getElementById('start');

const alarm =document.getElementById('alarm');

//===============================================================================
                                //clock logic
//===============================================================================

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    // makes 25:9 look like 25:09
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
//===============================================================================
                                // start button
//===============================================================================

startBtn.addEventListener('click', () => {
    if (timerId === null) {
        startBtn.textContent='pause'
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);

                alarm.play();
                alert("Time is up! Take a break.");
            }
        }, 1000);
    }
     else {
         clearInterval(timerId);
        timerId=null;
         startBtn.textContent='start'
    }
});
//===============================================================================
                                //rest button
//===============================================================================

resetBtn.addEventListener('click',() => {
     clearInterval(timerId);
     timerId = null;
     timeLeft = 25 * 60; // time minutes in seconds

    alarm.pause();
    alarm.currentTime = 0;
    console.log("button works")
    updateDisplay();
     startBtn.textContent='start';
 });

// resetBtn.addEventListener('click', () => {
//     clearInterval(timerId);
//     timerId = null;           // ✅ always reset state
//     timeLeft = 25 * 60;
//
//     alarm.pause();
//     alarm.currentTime = 0;
//
//     updateDisplay();
//     startBtn.textContent = 'start';
// });


