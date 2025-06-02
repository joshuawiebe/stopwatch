let isRunning = false;
let stopwatch = 0;
let intervalId;

document.getElementById('stopwatch').addEventListener('click', () => {
    const display = document.getElementById('display');

    if (!isRunning) {
      // Start
      isRunning = true;
      startTime = Date.now();

      intervalId = setInterval(() => {
        const time = ((Date.now() - startTime) / 1000).toFixed(2);
        display.textContent = time + ' seconds';
      }, 10); // update every 100 ms

      document.getElementById('stopwatch').textContent = 'Stop';
    } else {
      // Stop
      isRunning = false;
      clearInterval(intervalId);
      document.getElementById('stopwatch').textContent = 'Start';
    }
  });
