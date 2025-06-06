let isRunning = false;
let elapsedBefore = 0;
let intervalId;
let startTime;
let laps = [];
let activeToasts = {};

const display = document.getElementById('display');
const stopwatchBtn = document.getElementById('stopwatch');
const lapBtn = document.getElementById('lap');
const toastContainer = document.getElementById('toast-container');
const lapsSection = document.querySelector('.laps-section');
const lapsList = document.getElementById('lap-times');
const currentLapDiv = document.getElementById('current-lap');

// Hide laps section initially
lapsSection.style.display = 'none';

// Stopwatch start/stop/continue logic
stopwatchBtn.addEventListener('click', () => {
  if (!isRunning) {
    // Start or continue
    isRunning = true;
    startTime = Date.now() - elapsedBefore;

    intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      elapsedBefore = elapsed;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      const milliseconds = Math.floor((elapsed % 1000) / 10);

      display.textContent =
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0') + ',' +
        String(milliseconds).padStart(2, '0');

      updateCurrentLapDisplay();
    }, 10); // update every 10 ms

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

// Reset button logic
document.getElementById('reset').addEventListener('click', () => {
  clearInterval(intervalId);
  elapsedBefore = 0;
  isRunning = false;
  display.textContent = '00:00,00';
  stopwatchBtn.textContent = 'Start';
  lapBtn.textContent = 'Lap';
  laps = []; // Reset lap times
  lapsSection.style.display = 'none'; // Hide laps section
  renderLaps(); // Clear lap times display
  updateCurrentLapDisplay();
  showToast('Stopwatch has been reset.', 3000);
  showToast('All lap times have been cleared.', 3000);
});

// Lap button logic
lapBtn.addEventListener('click', () => {
  if (display.textContent === '00:00,00') {
    showToast('Please start the stopwatch before recording a lap.', 3000);
    return;
  }
  if (laps.at(-1) === display.textContent) {
    showToast('You cannot record the same lap time twice.', 3000);
    return;
  }
  laps.push(display.textContent);
  lapBtn.textContent = 'Lap (' + laps.length + ')';
  renderLaps();
  lapsSection.style.display = 'block'; // Show laps section
  lapsList.style.display = 'block';
  updateCurrentLapDisplay();
});

// Double-click on background toggles dark mode
document.body.addEventListener('dblclick', function(e) {
  // Check if the click is outside the container and toast
  if (!e.target.closest('.container') && !e.target.closest('#toast-container')) {
    document.body.classList.toggle('darkmode');

    if (document.body.classList.contains('darkmode')) {
      localStorage.setItem('darkmode', 'on');
    } else {
      localStorage.setItem('darkmode', 'off');
    }
  }
});

// Check system dark mode if no localStorage setting exists
if (localStorage.getItem('darkmode') === null) {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'on');
  }
}

// Apply saved dark mode setting
if (localStorage.getItem('darkmode') === 'on') {
  document.body.classList.add('darkmode');
} else {
  document.body.classList.remove('darkmode');
}

// Toast notification logic
function showToast(message, time) {
  // If a toast with the same message exists, extend its duration
  if (activeToasts[message]) {
    clearTimeout(activeToasts[message].timeoutId);
    activeToasts[message].timeoutId = setTimeout(() => {
      activeToasts[message].element.remove();
      delete activeToasts[message];
    }, time);
    return;
  }

  // Create a new toast element and append it to the toast container
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Remove the toast from the DOM after the specified time (in milliseconds)
  const timeoutId = setTimeout(() => {
    toast.remove();
    delete activeToasts[message];
  }, time);

  activeToasts[message] = { element: toast, timeoutId };
}

// Converts "MM:SS,MS" to milliseconds
function timeStringToMs(str) {
  if (!str || typeof str !== 'string') return 0;
  const [minSec, ms] = str.split(',');
  if (!minSec || !ms) return 0;
  const [min, sec] = minSec.split(':');
  if (isNaN(Number(min)) || isNaN(Number(sec)) || isNaN(Number(ms))) return 0;
  return (
    parseInt(min, 10) * 60000 +
    parseInt(sec, 10) * 1000 +
    parseInt(ms, 10) * 10
  );
}

// Converts milliseconds to "MM:SS,MS"
function msToTimeString(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const ms2 = Math.floor((ms % 1000) / 10);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms2).padStart(2, '0')}`;
}

// Render laps with best/worst and diff
function renderLaps() {
  lapsList.innerHTML = '';
  if (laps.length === 0) {
    currentLapDiv.style.display = 'none';
    return;
  }

  // Calculate lap differences
  const diffs = [];
  for (let i = 0; i < laps.length; i++) {
    if (i === 0) {
      diffs.push(timeStringToMs(laps[0]));
    } else {
      diffs.push(timeStringToMs(laps[i]) - timeStringToMs(laps[i - 1]));
    }
  }

  // Only calculate min/max if there are at least 2 laps
  let minDiff = null, maxDiff = null;
  if (diffs.length > 1) {
    minDiff = Math.min(...diffs.slice(1));
    maxDiff = Math.max(...diffs.slice(1));
  }

  // Render laps in reverse order (latest on top)
  for (let i = laps.length - 1; i >= 0; i--) {
    const li = document.createElement('li');
    let diffText = '';
    if (i > 0) {
      const diff = diffs[i];
      diffText = ` (+${msToTimeString(diff)})`;
      if (minDiff !== null && diff === minDiff) li.classList.add('lap-best');
      if (maxDiff !== null && diff === maxDiff) li.classList.add('lap-worst');
    }
    li.textContent = `Lap ${i + 1}: ${laps[i]}${diffText}`;
    lapsList.appendChild(li);
  }
}

// Update the current lap display live
function updateCurrentLapDisplay() {
  if (!isRunning || laps.length === 0) {
    currentLapDiv.style.display = 'none';
    return;
  }
  currentLapDiv.style.display = 'block';
  let lastLapMs = 0;
  if (laps.length > 0) {
    lastLapMs = timeStringToMs(laps[laps.length - 1]);
  }
  const nowMs = elapsedBefore;
  const currentLapMs = Math.max(0, nowMs - lastLapMs);
  currentLapDiv.textContent = `Current Lap: ${msToTimeString(currentLapMs)}`;
}

// Initial render
display.textContent = '00:00,00';
renderLaps();
updateCurrentLapDisplay();

// Show info toast on load
function info() {
  showToast('This is a simple stopwatch application. Click to start, stop, or reset the stopwatch. Double-click to toggle dark mode.', 5000);
}
info();
