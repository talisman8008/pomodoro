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
    const hours= math.floor(timeLeft/3600);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    // makes 25:9 look like 25:09
        timerDisplay.textContent = `:${minutes < 10 ? '0':''}${minutes} :${seconds < 10 ? '0' : ''}${seconds}`;
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

// Grab Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal');
const setCustomBtn = document.getElementById('set-custom');
const customMin = document.getElementById('custom-minutes');
const customSec = document.getElementById('custom-seconds');
const customHrs = document.getElementById('custom-hours');

// opening modal
customtBrk.addEventListener('click',() =>{modalOverlay.classList.remove('hidden');});

// closing modal
closeModalBtn.addEventListener('click',()=>{modalOverlay.classList.add('hidden');});


// setting custom time button
setCustomBtn.addEventListener('click',() => {

const min = parseInt(customMin.value);
const sec = parseInt(customSec.value);
// const hrs = parseInt(customHrs.value);


if(!isNaN(min) && !isNaN(sec) && min>=0 && sec >=0){

    clearInterval(timerId);//stop any ongoing process
    timerId=null;//resets the timer
    startBtn.textContent = 'Start';//resets 'pause' button to 'start'

    //tu confirm if button is workin
    console.log(`Hours=${hrs}:minutes=${min}:seconds=${sec}`);

    timeLeft=(hrs*3600)+(min*60)+sec; //update time left in seconds
    console.log(`seconds=${timeLeft}`);

    updateDisplay();//update the timer
   customHrs.value = '';//input box
    customMin.value = '';//input box
    customSec.value = '';//input box
}else {
    alert("Please valid time");
}
});//func ends