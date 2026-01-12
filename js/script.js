let timeLeft = 25*60; //   25 minutes in seconds
let timerId = null;
let activesession ='WORK';
const modes = {
    WORK: {
        time: 2*60*60,
       color: "#2C3E50", // Sleek dark blue
       // sound: "work-end.mp3"
        bg: 'url("img/work.jpg")'
    },
    SHORT: {
        time: 5 * 60,
      color: "#27AE60", // Calm green
        //sound: "break-end.mp3"
        bg: 'url("img/break.jpg")'
    },
    LONG: {
        time: 15 * 60,
        color: "#2980B9", // Deep blue
        //sound: "long-break-end.mp3"
        bg: 'url("img/long-break.jpg")'

    }
};

const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset');
const startBtn = document.getElementById('start');


const alarm =document.getElementById('alarm');

//===============================================================================
                                //Clock Logic
//===============================================================================

function updateDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft%60;

    const timer=`${hours < 10 ? '0':''}${hours}:${minutes < 10 ? '0':''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    // makes 25:9 look like 25:09
        timerDisplay.textContent = timer;
    document.title=`(${timer}) Aesthetic Pomodoro `
}

//===============================================================================
                                // Start Button
//===============================================================================
startBtn.addEventListener('click', () => {
    if (timerId === null) {
        startBtn.textContent='pause'
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
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
                                //Rest Button
//===============================================================================

resetBtn.addEventListener('click',() => {
     modeSwitcher(activesession);

    alarm.pause();
    alarm.currentTime = 0;

    updateDisplay();
     startBtn.textContent='Start';
 });

//===============================================================================
                            //Different Modes Logic
//===============================================================================

function modeSwitcher(typashii) {
    activesession=typashii;
    const selectedmode=modes[typashii];

    clearInterval(timerId);
    timerId=null;
    startBtn.textContent = 'Start';

    timeLeft = selectedmode.time;
    // document.body.style.backgroundColor = selectedmode.color;

    updateDisplay();
}

const shortBrk = document.getElementById('short-break');
const longBrk = document.getElementById('long-break');
const customtBrk = document.getElementById('custom-aloo');
const Focusbtn = document.getElementById('work-mode');
shortBrk.addEventListener('click', () => {
    modeSwitcher('SHORT');
    console.log("Short Session started");
    activityTracker('short-break');
});
longBrk.addEventListener('click', () => {modeSwitcher('LONG');
    console.log("Short Session started");
    activityTracker('long-break');
});

Focusbtn.addEventListener('click', () => {
    modeSwitcher('WORK');
    console.log("Short Session started");
    activityTracker('work-mode');
});

customtBrk.addEventListener('click',()=>activityTracker('custom-aloo'));

// ======================================================
// Active session
// ======================================================
function activityTracker(sessionmode) {
    const allbtns=document.querySelectorAll('.mode-buttons button');

    allbtns.forEach(btn=>{btn.classList.remove('active');});

    const activebtn= document.getElementById(sessionmode);
    activebtn.classList.add('active');
}

//===============================================================================
                            //Custom-Timer Button
//===============================================================================

// Grab Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal');
const setCustomBtn = document.getElementById('set-custom');
const customMin = document.getElementById('custom-minutes');
const customSec = document.getElementById('custom-seconds');
const customHrs = document.getElementById('custom-hours');

// opening modal
customtBrk.addEventListener('click',() =>{
    console.log("Custom button clicked!");
    modalOverlay.classList.remove('hidden');});

// closing modal
closeModalBtn.addEventListener('click',()=>{modalOverlay.classList.add('hidden');});


// setting custom time button
setCustomBtn.addEventListener('click',() => {

const min = parseInt(customMin.value) ||0;
const sec = parseInt(customSec.value)||0;
const hrs = parseInt(customHrs.value)||0;


if(!isNaN(min) && !isNaN(sec) && !isNaN(hrs) && hrs>=0 && min>=0 && sec >=0){

    timeLeft=(hrs*3600)+(min*60)+sec; //update time left in seconds
    if (timeLeft>0){
    clearInterval(timerId);//stop any ongoing process
    timerId=null;//resets the timer
    startBtn.textContent = 'Start';//resets 'pause' button to 'start'

    updateDisplay();//update the timer
    customHrs.value = '';//reset input box
    customMin.value = '';// reset input box
    customSec.value = '';// reset input box
    modalOverlay.classList.add('hidden');

    }
}else {
    alert("Please Enter Valid Time");
}
});//func ends
// ==================================================================================
//                                 THEME
// ==================================================================================

const themeToggle = document.getElementById('theme-toggle');
const themeMenu = document.getElementById('thememenu');

// 2. THEME TYPES
const themes = {
    dark: { name: 'Dark/Minimal' },
    cyberpunk: { name: 'Cyberpunk' },
    forest: { name: 'Forest Zen' },
    cream: { name: 'Vintage Cream' }
};

// 3. GET SAVED THEME
let currentTheme = localStorage.getItem('savedTheme') || 'dark';

// 4. THEME FUNCTIONS

function applyTheme(themeKey) {
    if (!themes[themeKey]) themeKey = 'dark';
    document.body.setAttribute('data-theme', themeKey);

    // Get the current background from the active session
    const selectedMode = modes[activesession];

    const bgUrl = selectedMode ? selectedMode.bg : modes.WORK.bg;

    currentTheme = themeKey;
    localStorage.setItem('savedTheme', themeKey);
}

// 2. Initialize everything properly at the VERY BOTTOM of your script
window.addEventListener('DOMContentLoaded', () => {
    // This ensures the DOM is fully loaded before we run logic
    applyTheme(currentTheme);
    updateDisplay();
    // Set the initial active button state
    activityTracker('work-mode');
});

// 5. EVENT LISTENERS

// Open/Close the menu
if (themeToggle && themeMenu) {
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.classList.toggle('hidden');
    });
}

// Close menu when clicking outside
window.addEventListener('click', () => {
    if (themeMenu) themeMenu.classList.add('hidden');
});

// Handle picking a theme
document.querySelectorAll('.theme-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop window listener from fighting this
        const themeId = opt.getAttribute('data-t');
        applyTheme(themeId);
        themeMenu.classList.add('hidden');
    });
});

// 6. INITIALIZE ON LOAD
// Wrap this in a check to ensure 'modes' and 'activesession' are ready
applyTheme(currentTheme);