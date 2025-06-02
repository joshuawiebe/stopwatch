let isRunning = false;
let stopwatch = 0;
let intervalId;

const display = document.getElementById('display');
const stopwatchBtn = document.getElementById('stopwatch');

document.getElementById('stopwatch').addEventListener('click', () => {
  if (!isRunning) {
    // Start
    isRunning = true;
    startTime = Date.now();

    intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
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
  stopwatch = 0;
  isRunning = false;
  display.textContent = '00:00,00';
  stopwatchBtn.textContent = 'Start';
});

document.body.addEventListener('click', function(e) {
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
