// Story data
const story = [
  {
    en: "One sunny morning, Mia ran to the park.",
    es: "Una mañana soleada, Mia corrió al parque.",
    color1: "#ffd166",
    color2: "#ffb347"
  },
  {
    en: "She held her bright red kite.",
    es: "Sostenía su cometa roja brillante.",
    color1: "#ef476f",
    color2: "#ff6b6b"
  },
  {
    en: "The wind was strong. The kite flew high, high, high!",
    es: "El viento era fuerte. ¡La cometa voló alto, alto, alto!",
    color1: "#06d6a0",
    color2: "#4ecdc4"
  },
  {
    en: "“Oh no!” cried Mia. The string slipped from her hand.",
    es: "“¡Oh, no!”, gritó Mia. La cuerda se le resbaló de la mano.",
    color1: "#118ab2",
    color2: "#073b4c"
  },
  {
    en: "The kite floated over the trees. It landed on a tall branch.",
    es: "La cometa flotó sobre los árboles. Aterrizó en una rama alta.",
    color1: "#06d6a0",
    color2: "#073b4c"
  },
  {
    en: "Mia felt sad. She could not reach her kite.",
    es: "Mia se sintió triste. No podía alcanzar su cometa.",
    color1: "#6a4c93",
    color2: "#1982c4"
  },
  {
    en: "Just then, her friend Leo came by. He carried a long stick.",
    es: "En ese momento, su amigo Leo pasó por allí. Llevaba un palo largo.",
    color1: "#ffca3a",
    color2: "#8ac926"
  },
  {
    en: "“I can help!” said Leo. He lifted the stick carefully.",
    es: "“¡Puedo ayudar!”, dijo Leo. Levantó el palo con cuidado.",
    color1: "#1982c4",
    color2: "#6a4c93"
  },
  {
    en: "Down came the red kite. Mia clapped and smiled.",
    es: "La cometa roja cayó. Mia aplaudió y sonrió.",
    color1: "#ff595e",
    color2: "#ffca3a"
  },
  {
    en: "“Thank you, Leo!” she said. Together, they flew the kite again.",
    es: "“¡Gracias, Leo!”, dijo. Juntos, volvieron a volar la cometa.",
    color1: "#8ac926",
    color2: "#1982c4"
  },
  {
    en: "The wind whooshed. The kite danced across the sky.",
    es: "El viento silbó. La cometa bailó por el cielo.",
    color1: "#4ecdc4",
    color2: "#ffd166"
  }
];

// Global variables
let currentPage = 0;
let currentLanguage = 'en';
let scale = Number(localStorage.getItem('scale') || 1);
let hideTimer;

// DOM elements
const veil = document.getElementById('veil');
const screenEl = document.getElementById('screen');
const root = document.documentElement;
const pEn = document.getElementById('p-en');
const pLoc = document.getElementById('p-loc');
const btnLang = document.getElementById('btn-lang');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnSave = document.getElementById('btn-save');
const btnSmaller = document.getElementById('btn-smaller');
const btnBigger = document.getElementById('btn-bigger');
const stage = document.getElementById('stage');
const ctx = stage.getContext('2d');

// Initialize the app
function init() {
  // Set up event listeners
  setupEventListeners();
  
  // Apply saved font scale
  applyScale();
  
  // Set up canvas
  setupCanvas();
  
  // Render the first page
  renderPage();
  
  // Start auto-hide timer
  poke();
}

// Set up event listeners
function setupEventListeners() {
  // Navigation buttons
  btnPrev.addEventListener('click', prevPage);
  btnNext.addEventListener('click', nextPage);
  
  // Language toggle
  btnLang.addEventListener('click', toggleLanguage);
  
  // Font size controls
  btnBigger.addEventListener('click', increaseFontSize);
  btnSmaller.addEventListener('click', decreaseFontSize);
  
  // Save button
  btnSave.addEventListener('click', saveImage);
  
  // Swipe navigation
  let touchStartX = 0;
  screenEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  });
  
  screenEl.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    
    if (deltaX > 50) {
      prevPage();
    } else if (deltaX < -50) {
      nextPage();
    }
  });
  
  // Click navigation (left/right sides of screen)
  screenEl.addEventListener('click', e => {
    const x = e.clientX / window.innerWidth;
    if (x < 0.33) {
      prevPage();
    } else if (x > 0.66) {
      nextPage();
    }
  });
  
  // Auto-hide controls on user interaction
  ['mousemove', 'touchstart', 'keydown', 'click'].forEach(ev => {
    document.addEventListener(ev, poke, {passive: true});
  });
}

// Render the current page
function renderPage() {
  // Update text content
  pEn.textContent = story[currentPage][currentLanguage];
  
  // Update Spanish text
  const spanishText = story[currentPage]['es'];
  pLoc.firstChild.textContent = spanishText + " ";
  
  // Update navigation buttons
  btnPrev.disabled = currentPage === 0;
  btnNext.disabled = currentPage === story.length - 1;
  
  // Draw background
  drawBackground();
  
  // Update page indicator
  updatePageIndicator();
}

// Draw gradient background
function drawBackground() {
  const page = story[currentPage];
  const gradient = ctx.createLinearGradient(0, 0, stage.width, stage.height);
  gradient.addColorStop(0, page.color1);
  gradient.addColorStop(1, page.color2);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, stage.width, stage.height);
  
  // Draw a simple kite for visual interest
  const centerX = stage.width / 2;
  const centerY = stage.height / 2;
  const kiteSize = Math.min(stage.width, stage.height) * 0.15;
  
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - kiteSize);
  ctx.lineTo(centerX + kiteSize, centerY);
  ctx.lineTo(centerX, centerY + kiteSize);
  ctx.lineTo(centerX - kiteSize, centerY);
  ctx.closePath();
  ctx.fill();
  
  // Draw kite string
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + kiteSize);
  ctx.lineTo(centerX, centerY + kiteSize * 3);
  ctx.stroke();
}

// Navigate to previous page
function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
}

// Navigate to next page
function nextPage() {
  if (currentPage < story.length - 1) {
    currentPage++;
    renderPage();
  }
}

// Toggle between English and Spanish
function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
  renderPage();
}

// Increase font size
function increaseFontSize() {
  scale = Math.min(1.6, +(scale + 0.05).toFixed(2));
  localStorage.setItem('scale', scale);
  applyScale();
}

// Decrease font size
function decreaseFontSize() {
  scale = Math.max(0.85, +(scale - 0.05).toFixed(2));
  localStorage.setItem('scale', scale);
  applyScale();
}

// Apply font scale
function applyScale() {
  root.style.setProperty('--fontScale', scale);
}

// Save image (placeholder functionality)
function saveImage() {
  alert("Save functionality would be implemented here. In a real app, this would save the current page as an image.");
}

// Set up canvas
function setupCanvas() {
  function fitCanvas() {
    stage.width = stage.clientWidth * devicePixelRatio;
    stage.height = stage.clientHeight * devicePixelRatio;
    renderPage(); // Redraw when resized
  }
  
  window.addEventListener('resize', fitCanvas, {passive: true});
  fitCanvas();
}

// Update page indicator
function updatePageIndicator() {
  // Remove existing indicator if any
  const existingIndicator = document.querySelector('.page-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Create new indicator
  const indicator = document.createElement('div');
  indicator.className = 'page-indicator fade';
  
  for (let i = 0; i < story.length; i++) {
    const dot = document.createElement('div');
    dot.className = `page-dot ${i === currentPage ? 'active' : ''}`;
    indicator.appendChild(dot);
  }
  
  screenEl.appendChild(indicator);
}

// Auto-hide controls after idle time
function poke() {
  screenEl.classList.remove('hidden-chrome');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => screenEl.classList.add('hidden-chrome'), 3000);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
