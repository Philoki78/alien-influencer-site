const orbit = document.getElementById("orbitBot");
const messageEl = document.getElementById("alienMessage");
let isConnected = false, userAddress = "";

// Sounds
const hoverSFX = new Audio('assets/sounds/hover.wav');
const clickSFX = new Audio('assets/sounds/ping.wav');

// Voice
function speak(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.pitch = 1.2; u.rate = 1; u.volume = 1; u.lang = 'en-US';
  const voices = speechSynthesis.getVoices();
  const av = voices.find(v => v.name.includes('Zarvox') || v.name.includes('Trinoid'));
  if (av) u.voice = av;
  speechSynthesis.speak(u);
}

// Wallet detection
async function detectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    const accs = await ethereum.request({ method: 'eth_accounts' });
    if (accs.length > 0) {
      isConnected = true; userAddress = accs[0];
      const m = `🌌 Welcome, ${userAddress.slice(0,6)}...${userAddress.slice(-4)}!`;
      messageEl.innerText = m;
      speak(m);
      return;
    }
  }
  cycleIdle();
}

// Idle message typing
const idle = ["👾 Orbit online.", "💸 Connect wallet.", "🔊 Hover me!", "🪐 Laser drop ready.", "📡 NFT protocols armed."];
let iMsg = 0, cIndex = 0;

function cycleIdle() {
  messageEl.innerText = "";
  cIndex = 0;
  typeIdle();
}

function typeIdle() {
  const txt = idle[iMsg];
  if (cIndex < txt.length) {
    messageEl.innerText += txt.charAt(cIndex++);
    setTimeout(typeIdle, 50);
  } else {
    setTimeout(() => {
      iMsg = (iMsg + 1) % idle.length;
      cycleIdle();
    }, 2000);
  }
}

// UFO hover & laser click
orbit.addEventListener('mouseenter', () => {
  hoverSFX.volume = 0.4; hoverSFX.play();
  orbit.classList.add('active');
  setTimeout(() => orbit.classList.remove('active'), 400);
});

orbit.addEventListener('click', () => {
  clickSFX.volume = 0.6; clickSFX.play();
  const msg = "🔫 Laser drop! Minting NFT…";
  messageEl.innerText = msg;
  speak(msg);
  const beam = document.createElement('div');
  beam.className = 'laser-beam';
  beam.style.left = `${orbit.offsetLeft + 40}px`;
  document.body.appendChild(beam);
  setTimeout(() => beam.remove(), 500);
});

// Add CSS class for active state
const style = document.createElement('style');
style.innerHTML = `.alien-assistant.active { box-shadow: 0 0 30px #0ff; transform: scale(1.05); }`;
document.head.appendChild(style);

// Start everything
detectWallet();
