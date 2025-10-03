// script.js
let startTime, interval;
let loopCount = 0;
const loopDistance = 6.706;

const timerDisplay = document.getElementById('timer');
const loopDisplay = document.getElementById('loopCount');
const distanceDisplay = document.getElementById('distance');
const lapList = document.getElementById('lapList');

document.getElementById('start').onclick = () => {
  if (!interval) {
    startTime = Date.now();
    interval = setInterval(updateTimer, 1000);
  }
};

document.getElementById('lap').onclick = () => {
  if (!interval) return;
  loopCount++;
  const lapTime = formatTime(Date.now() - startTime);
  const li = document.createElement('li');
  li.textContent = `Loop ${loopCount}: ${lapTime}`;
  lapList.appendChild(li);
  loopDisplay.textContent = loopCount;
  distanceDisplay.textContent = (loopCount * loopDistance).toFixed(3);

//sending lap data to backend
fetch('http://localhost:4000/api/lap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loopNumber: loopCount, lapTime })
  }).catch(err => console.error('Failed to save lap:', err));

};

document.getElementById('reset').onclick = () => {
  clearInterval(interval);
  interval = null;
  timerDisplay.textContent = '00:00:00';
  loopCount = 0;
  loopDisplay.textContent = '0';
  distanceDisplay.textContent = '0.000';
  lapList.innerHTML = '';
};

document.getElementById('viewLaps').onclick = () => {
  fetch('http://localhost:4000/api/laps')
    .then(res => res.json())
    .then(data => {
      lapList.innerHTML = ''; // Clear current list
      data.forEach(lap => {
        const li = document.createElement('li');
        li.textContent = `Loop ${lap.loopNumber}: ${lap.lapTime} (${new Date(lap.timestamp).toLocaleString()})`;
        lapList.appendChild(li);
      });
    })
    .catch(err => console.error('Failed to fetch laps:', err));
};


function updateTimer() {
  const elapsed = Date.now() - startTime;
  timerDisplay.textContent = formatTime(elapsed);
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}
