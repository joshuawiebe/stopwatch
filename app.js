let isRunning = false;
let elapsedBefore = 0; // Stores the elapsed time before pause
let intervalId;
let startTime;
let laps = []; // Stores the lap times

const display = document.getElementById('display');
const stopwatchBtn = document.getElementById('stopwatch');
const lapBtn = document.getElementById('lap');
const toastContainer = document.getElementById('toast-container');
const toggleLapsBtn = document.getElementById('toggle-laps');
const lapsList = document.getElementById('lap-times');

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
  renderLaps(); // Clear lap times display
  console.log('Stopwatch reset');
  showToast('Stopwatch has been reset.', 3000);
  showToast('All lap times have been cleared.', 3000);
  console.log('Lap times cleared');
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
    renderLaps();
    console.log('Lap times:', laps);
  }
});

document.body.addEventListener('dblclick', function(e) {
  // Check if the click is outside the container
  if (!e.target.closest('.container') && !e.target.closest('#toast-container')) {
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
  // Create a toast element and append it to the toast container
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Remove the toast from the DOM after the specified time (in milliseconds)
  setTimeout(() => {
    toast.remove();
  }, time);
};

toggleLapsBtn.addEventListener('click', () => {
  if (lapsList.style.display === 'none' || lapsList.style.display === '') {
    lapsList.style.display = 'block';
    toggleLapsBtn.textContent = 'Hide Laps';
  } else {
    lapsList.style.display = 'none';
    toggleLapsBtn.textContent = 'Show Laps';
  }
});

function renderLaps() {
  lapsList.innerHTML = ''; // Clear previous laps
  laps.forEach((lap, index) => {
    const li = document.createElement('li');
    li.textContent = `Lap ${index + 1}: ${lap}`;
    lapsList.appendChild(li);
  });
};

function info() {
  showToast('This is a simple stopwatch application. Click to start, stop, or reset the stopwatch. Double-click to toggle dark mode.', 5000);
};

info();
