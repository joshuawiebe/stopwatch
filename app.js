let isRunning = false;
let elapsedBefore = 0; // Stores the elapsed time before pause
let intervalId;
let startTime;
let laps = []; // Stores the lap times

const display = document.getElementById('display');
const stopwatchBtn = document.getElementById('stopwatch');
const lapBtn = document.getElementById('lap');

stopwatchBtn.addEventListener('click', () => {
  if (!isRunning) {
    // Start or Continue
    isRunning = true;
    startTime = Date.now() - elapsedBefore;

    intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      elapsedBefore = elapsed; // Stores the elapsed time for continue
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      const milliseconds = Math.floor((elapsed % 1000) / 10);

      display.textContent =
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0') + ',' +
        String(milliseconds).padStart(2, '0');
    }, 10); // update every 100 ms

    stopwatchBtn.textContent = 'Stop';
  } else {
    // Stop
    isRunning = false;
    clearInterval(intervalId);
    if (display.textContent !== '00:00,00') {
    stopwatchBtn.textContent = 'Continue';
    } else {
      stopwatchBtn.textContent = 'Start';
    }
  }
});

document.getElementById('reset').addEventListener('click', () => {
  clearInterval(intervalId);
  elapsedBefore = 0;
  isRunning = false;
  display.textContent = '00:00,00';
  stopwatchBtn.textContent = 'Start';
  lapBtn.textContent = 'Lap';
  laps = []; // Reset lap times
});

document.getElementById('lap').addEventListener('click', () => {
  if (display.textContent === '00:00,00') {
    showToast('Please start the stopwatch before recording a lap.', 3000);
    return;
  } else {
    if (laps.at(-1) === display.textContent) {
      showToast('You cannot record the same lap time twice.', 3000);
      return;
    }
    laps.push(display.textContent);
    lapBtn.textContent = 'Lap (' + laps.length + ')';
    console.log('Lap times:', laps);
  }
});

document.body.addEventListener('dblclick', function(e) {
  // Check if the click is outside the container
  if (!e.target.closest('.container')) {
    document.body.classList.toggle('darkmode');

    if (document.body.classList.contains('darkmode')) {
      localStorage.setItem('darkmode', 'on');
    } else {
      localStorage.setItem('darkmode', 'off');
    }
  }
});

if (localStorage.getItem('darkmode') === 'on') {
  document.body.classList.add('darkmode');
}

function showToast(message, time) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  // Remove after specified time from the DOM
  setTimeout(() => {
    toast.remove();
  }, time);
};

function info() {
  showToast('This is a simple stopwatch application. Click to start, stop,' + '<br>' + 'or reset the stopwatch. Double-click to toggle dark mode.', 5000);
};

info();
