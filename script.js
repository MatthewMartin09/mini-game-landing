const landingScreen = document.getElementById('landing-screen');
const loadingScreen = document.getElementById('loading-screen');
const transitionScreen = document.getElementById('transition-screen');
const mainMenuScreen = document.getElementById('main-menu-screen');
const dateScreen = document.getElementById('date-screen');
const startButton = document.getElementById('start-button');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const selectedFoodLabel = document.getElementById('selected-food-label');
const dateForm = document.getElementById('date-form');
const backButton = document.getElementById('date-back-button');
const foodCards = document.querySelectorAll('.food-card');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const clickAudio = new Audio('Click.mp3');
const bgmAudio = new Audio('Background.mp3');
clickAudio.preload = 'auto';
bgmAudio.preload = 'auto';
bgmAudio.loop = true;
bgmAudio.volume = 0.24;

function playTone(freq, duration = 0.08, type = 'square', volume = 0.15) {
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

function resumeAudio() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function startBackgroundMusic() {
  if (bgmAudio.paused) {
    bgmAudio.currentTime = 0;
    bgmAudio.play().catch(() => {});
  }
}

function playButtonSound() {
  resumeAudio();
  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {});
}

function playCompleteSound() {
  resumeAudio();
  playTone(560, 0.09, 'square', 0.17);
  setTimeout(() => playTone(700, 0.08, 'square', 0.16), 90);
  setTimeout(() => playTone(860, 0.07, 'triangle', 0.14), 180);
}

function playHoverSound() {
  resumeAudio();
  playTone(880, 0.04, 'triangle', 0.12);
}

startButton.addEventListener('click', () => {
  landingScreen.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  playButtonSound();
  startBackgroundMusic();
  startLoading();
});

foodCards.forEach(card => {
  card.addEventListener('mouseenter', () => playHoverSound());
  card.addEventListener('click', () => {
    playButtonSound();
    mainMenuScreen.classList.add('hidden');
    dateScreen.classList.remove('hidden');
    selectedFoodLabel.textContent = `${card.querySelector('.food-name').textContent} date details`;
  });
});

dateForm.addEventListener('submit', event => {
  event.preventDefault();
  // Gather local form values
  const dateRaw = document.getElementById('date').value;
  const timeRaw = document.getElementById('time').value;
  const loc = document.getElementById('location').value;
  const outfit = document.getElementById('outfit-theme').value;
  const punish = document.getElementById('punishment').value;

  const dateParts = dateRaw ? dateRaw.split('-').map(Number) : [null, null, null];
  const [year, month, day] = dateParts;
  const [hour, minute] = timeRaw ? timeRaw.split(':').map(Number) : [null, null];

  // Submit to Google Forms by creating and posting a hidden form (avoids CORS)
  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeG-gtxt7doUNBJHRdqpACChRJVvr2BkgX8kcotDVhV_iAO0g/formResponse';

  // Mapping discovered from the form metadata in the live form.
  const mapping = {
    // What day? (date fields)
    '403564709_year': year || '',
    '403564709_month': month || '',
    '403564709_day': day || '',
    // What time? (time fields)
    '1185363925_hour': hour != null ? hour : '',
    '1185363925_minute': minute != null ? minute : '',
    // Outfit?
    '624483929': outfit,
    // Punishment if late!
    '1050540772': punish
  };

  const gForm = document.createElement('form');
  gForm.action = googleFormUrl;
  gForm.method = 'POST';
  gForm.target = '_blank';
  gForm.style.display = 'none';

  Object.entries(mapping).forEach(([id, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = `entry.${id}`;
    input.value = value || '';
    gForm.appendChild(input);
  });

  document.body.appendChild(gForm);
  // Submit (this will open a new tab to Google Forms response endpoint)
  gForm.submit();
  setTimeout(() => document.body.removeChild(gForm), 1500);

  // Local confirmation (keeps current UX)
  alert('Date saved!');
});

backButton.addEventListener('click', () => {
  dateScreen.classList.add('hidden');
  mainMenuScreen.classList.remove('hidden');
});

function startLoading() {
  const duration = 3600; // total duration in ms
  const step = 100;
  let elapsed = 0;

  const timer = setInterval(() => {
    elapsed += step;
    const progress = Math.min(100, Math.round((elapsed / duration) * 100));
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;

    if (elapsed >= duration) {
      clearInterval(timer);
      loadingComplete();
    }
  }, step);
}

function loadingComplete() {
  loadingScreen.classList.add('hidden');
  transitionScreen.classList.remove('hidden');
  playCompleteSound();
  startTransition();
}

function startTransition() {
  setTimeout(() => {
    transitionScreen.classList.add('hidden');
    mainMenuScreen.classList.remove('hidden');
  }, 1600);
}
