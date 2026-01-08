let timeLeft = 25*60; // 25 minutes in seconds
let timerId = null;

const modes = {
    WORK: {
        time: 25 * 60,
       color: "#2C3E50", // Sleek dark blue
       // sound: "work-end.mp3"
    },
    SHORT: {
        time: 5 * 60,
      color: "#27AE60", // Calm green
        //sound: "break-end.mp3"
    },
    LONG: {
        time: 15 * 60,
     color: "#2980B9", // Deep blue
        //sound: "long-break-end.mp3"
    }
};

const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset');
const startBtn = document.getElementById('start');
const shortBrk = document.getElementById('short-break');
const longBrk = document.getElementById('long-break');
const customtBrk = document.getElementById('custom');
const Focusbtn = document.getElementById('Focus');

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

//===============================================================================
                            //different modes logic
//===============================================================================

function modeSwitcher(typashii) {
   let moda=modes[typashii]

    clearInterval(timerId);
    timerId=null;
    startBtn.textContent = 'Start';

    timeLeft = moda.time;
    document.body.style.backgroundColor = moda.color;

    updateDisplay();
}

shortBrk.addEventListener('click', () => modeSwitcher('SHORT'));
longBrk.addEventListener('click', () => modeSwitcher('LONG'));

Focusbtn.addEventListener('click',() =>modeSwitcher('WORK'));



//===============================================================================
                            //customize button
//===============================================================================


