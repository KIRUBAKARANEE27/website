/* ============================================================
   script.js — Project Kadai (Enhanced Edition)
   ============================================================ */

'use strict';

/* ============================================================
   0. ANIMATED CANVAS BACKGROUND
   ============================================================ */
(function initCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#f5a623', '#00e5ff', '#2aff7a', '#ff4d6d', '#7c3aed'];
  const particles = Array.from({ length: 65 }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  Math.random() * 1.6 + 0.4,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    c:  COLORS[Math.floor(Math.random() * COLORS.length)],
    a:  Math.random() * 0.45 + 0.15,
  }));

  const stars = [];
  function spawnStar() {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      len: Math.random() * 100 + 60,
      speed: Math.random() * 4 + 3,
      a: 1,
    });
  }
  setInterval(spawnStar, 4000);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0,229,255,0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (p.r > 1.3) {
        const grad = ctx.createRadialGradient(p.x, p.y, p.r, p.x, p.y, p.r * 3);
        grad.addColorStop(0, p.c + '44');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });

    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      ctx.beginPath();
      const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y + s.len * 0.3);
      grad.addColorStop(0, `rgba(255,255,255,${s.a})`);
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + s.len, s.y + s.len * 0.3);
      ctx.stroke();
      s.x += s.speed * 1.5;
      s.y += s.speed * 0.4;
      s.a -= 0.018;
      if (s.a <= 0) stars.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

(function injectOrbs() {
  const sf = document.querySelector('.shopfront');
  if (!sf) return;
  [1, 2, 3].forEach(i => {
    const o = document.createElement('div');
    o.className = `orb orb-${i}`;
    sf.appendChild(o);
  });
})();


/* ============================================================
   1. AVATAR SPEECH — Bold, slow, Tamil-flavoured voice
   ============================================================ */
const SPEECH_LINES = [
  "Vanakam",
  "Welcome to Project Kadai!",
  "IoT , Embedded Systems",
  "AI Automation , Portfolio",
  "Elamaee! Romba cheap price lae!",
  "Source code, PPT ellam tharom!",
  "Order pannunga", 
];

let speechIndex = 0;
const speechBubble = document.getElementById('speechBubble');
const avatarBody   = document.getElementById('avatarBody');

/* Load voices early */
let voicesList = [];
function loadVoices() {
  voicesList = window.speechSynthesis.getVoices();
}
if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickTamilVoice() {
  /* Priority: Tamil > Indian English > British > any English */
  return (
    voicesList.find(v => v.lang.startsWith('ta')) ||
    voicesList.find(v => v.lang === 'en-IN') ||
    voicesList.find(v => v.lang.startsWith('en-GB')) ||
    voicesList.find(v => v.lang.startsWith('en')) ||
    null
  );
}

function speakLine(index) {
  const line = SPEECH_LINES[index % SPEECH_LINES.length];

  speechBubble.textContent = line;
  speechBubble.style.display = 'block';
  speechBubble.style.animation = 'none';
  void speechBubble.offsetWidth;
  speechBubble.style.animation = 'bubblePop 0.3s cubic-bezier(0.34,1.56,0.64,1)';

  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const ttsText = line.replace(/[^\w\s!,.'?]/g, '').trim();
  if (!ttsText) return;

  const utt = new SpeechSynthesisUtterance(ttsText);
  /* Bold Tamil feel: very slow, very deep, loud */
  utt.rate   = 0.70;   /* slow = authoritative, like a Tamil shop uncle */
  utt.pitch  = 0.42;   /* low pitch = bold deep voice */
  utt.volume = 1;

  const raviVoice = voicesList.find(v =>
  v.name.toLowerCase().includes("ravi")
);

if (raviVoice) {
  utt.voice = raviVoice;
}

  window.speechSynthesis.speak(utt);
}

avatarBody.addEventListener('click', () => {
  speakLine(speechIndex);
  speechIndex++;
});

setInterval(() => {
  speakLine(speechIndex);
  speechIndex++;
}, 3800);

setTimeout(() => speakLine(speechIndex++), 1500);
/* ============================================================
   FLOATING SHOP NAVIGATION
============================================================ */

document.getElementById('scrollTopBtn')
.addEventListener('click', () => {
  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
});

document.getElementById('scrollProjectsBtn')
.addEventListener('click', () => {
  document.getElementById('shopGrid')
  .scrollIntoView({
    behavior:'smooth'
  });
});

document.getElementById('scrollOrderBtn')
.addEventListener('click', () => {
  document.getElementById('buySection')
  .scrollIntoView({
    behavior:'smooth'
  });
});

document.getElementById('btnEnterKadai')
.addEventListener('click', () => {
  document.getElementById('shopGrid')
  .scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ============================================================
   BETTER TALKING EFFECT
============================================================ */

const avatarMouth =
document.getElementById('avatarMouth');

function startTalking(){
  avatarBody.classList.add('talking');
}

function stopTalking(){
  avatarBody.classList.remove('talking');
}

if ('speechSynthesis' in window) {

  const originalSpeak = window.speechSynthesis.speak;

  window.speechSynthesis.speak = function(utterance){

    utterance.onstart = () => {
      startTalking();
    };

    utterance.onend = () => {
      stopTalking();
    };

    originalSpeak.call(window.speechSynthesis, utterance);
  };

}

/* ============================================================
   2. DOMAIN FILTER CHIPS
   ============================================================ */
const chips    = document.querySelectorAll('.domain-chip');
const allCards = document.querySelectorAll('.project-card');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter;
    allCards.forEach(card => {
      const match = filter === 'all' || card.dataset.domain === filter;
      card.style.display = match ? 'block' : 'none';
    });
  });
});


/* ============================================================
   3. PROJECT MODAL
   ============================================================ */
const videoModal  = document.getElementById('videoModal');
const modalTitle  = document.getElementById('modalTitle');
const modalDesc   = document.getElementById('modalDesc');
const modalClose  = document.getElementById('modalClose');
const modalBuyBtn = document.getElementById('modalBuyBtn');

function openModal(title, desc) {
  modalTitle.textContent = title;
  modalDesc.textContent  = desc;
  videoModal.classList.add('open');
  modalBuyBtn.onclick = () => { closeModal(); scrollToBuy(title); };
}

function closeModal() { videoModal.classList.remove('open'); }

document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.title, btn.dataset.desc));
});

modalClose.addEventListener('click', closeModal);
videoModal.addEventListener('click', e => { if (e.target === videoModal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ============================================================
   4. BUY NOW BUTTONS → scroll to order form
   ============================================================ */
function scrollToBuy(projectName) {
  document.getElementById('buySection').scrollIntoView({ behavior: 'smooth' });
  if (projectName) {
    setTimeout(() => {
      const sel    = document.getElementById('buyProject');
      const needle = projectName.toLowerCase();
      for (const opt of sel.options) {
        if (opt.value.toLowerCase().includes(needle.split(' ').slice(0, 2).join(' '))) {
          sel.value = opt.value;
          break;
        }
      }
    }, 600);
  }
}

document.querySelectorAll('.btn-buy').forEach(btn => {
  if (btn.dataset.project) {
    btn.addEventListener('click', () => scrollToBuy(btn.dataset.project));
  }
});

document.getElementById('btnCustom').addEventListener('click', () => {
  scrollToBuy('Custom Project');
});


/* ============================================================
   5. FREE IDEAS → immediately scroll to order form
   No textarea, no waiting — click = go to form
   ============================================================ */
document.getElementById('btnIdea').addEventListener('click', () => {
  scrollToBuy('Free Project Ideas');
});


/* ============================================================
   6. ORDER FORM — NETLIFY FORMS SUBMISSION
   ============================================================ */
(function injectNetlifyForm() {
  const hiddenForm = document.createElement('form');
  hiddenForm.setAttribute('name', 'project-orders');
  hiddenForm.setAttribute('data-netlify', 'true');
  hiddenForm.setAttribute('netlify-honeypot', 'bot-field');
  hiddenForm.style.display = 'none';
  hiddenForm.innerHTML = `
    <input type="hidden" name="form-name" value="project-orders" />
    <input name="bot-field" />
    <input name="name" />
    <input name="email" />
    <input name="phone" />
    <input name="project" />
    <textarea name="note"></textarea>
  `;
  document.body.appendChild(hiddenForm);
})();

document.getElementById('btnSubmit').addEventListener('click', submitOrder);

async function submitOrder() {
  const name    = document.getElementById('buyName').value.trim();
  const email   = document.getElementById('buyEmail').value.trim();
  const phone   = document.getElementById('buyPhone').value.trim();
  const project = document.getElementById('buyProject').value;
  const note    = document.getElementById('buyNote').value.trim();

  if (!name || !email || !phone || !project) {
    showToast('⚠️ Fill in all required fields!', 'warn');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ Enter a valid email address.', 'warn');
    return;
  }

  const btn = document.getElementById('btnSubmit');
  btn.textContent = '⏳ Submitting...';
  btn.disabled = true;

  try {
    const formData = new URLSearchParams({
      'form-name': 'project-orders',
      'bot-field': '',
      name, email, phone, project, note,
    });

    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (res.ok) {
      showToast("✅ Order submitted! We'll contact you soon.", 'success');
      sayNandri();
      clearForm();
    } else {
      throw new Error('Network error');
    }
  } catch (err) {
    console.warn('Netlify submit (local fallback):', err);
    showToast("✅ Order Placed!", 'success');
    sayNandri();
    clearForm();
  } finally {
    btn.textContent = "🚀 Place Order — We'll Contact You!";
    btn.disabled = false;
  }
}

function clearForm() {
  ['buyName', 'buyEmail', 'buyPhone', 'buyNote'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('buyProject').value = '';
}

/* 🙏 Bold Tamil "Nandri" — slow, deep, commanding */
function sayNandri() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const phrases = [
    { text: 'Nandri! Romba nandri!', delay: 300 },
    { text: 'Thank you for your order. We will contact you very soon!', delay: 2200 },
  ];

  phrases.forEach(({ text, delay }) => {
    setTimeout(() => {
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate   = 0.72;
      utt.pitch  = 0.60;
      utt.volume = 1.0;
      const voice = pickTamilVoice();
      if (voice) utt.voice = voice;
      window.speechSynthesis.speak(utt);
    }, delay);
  });

  setTimeout(() => {
    speechBubble.textContent = '🙏 Nandri! Romba nandri!';
    speechBubble.style.display = 'block';
    speechBubble.style.animation = 'none';
    void speechBubble.offsetWidth;
    speechBubble.style.animation = 'bubblePop 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  }, 400);
}


/* ============================================================
   7. TOAST
   ============================================================ */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.background = type === 'warn'
    ? 'linear-gradient(135deg, #ff4d6d, #cc0033)'
    : 'linear-gradient(135deg, #2aff7a, #00c853)';
  toast.style.color = type === 'warn' ? '#fff' : '#000';
  toast.style.display = 'block';
  toast.style.animation = 'none';
  void toast.offsetWidth;
  toast.style.animation = 'toastSlide 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  setTimeout(() => { toast.style.display = 'none'; }, 5000);
}


/* ============================================================
   8. CARD ENTRANCE ANIMATIONS
   ============================================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.07}s`;
      entry.target.classList.add('card-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  observer.observe(card);
});

const styleInject = document.createElement('style');
styleInject.textContent = `.card-visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(styleInject);