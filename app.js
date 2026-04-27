/* ═══════════════════════════════════════════
   INNERALIGN — APP LOGIC
   Zero-friction onboarding + dashboard interactions
   ═══════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════
// STATE
// ══════════════════════════════════
const state = {
  userName: 'Aryan',
  userGoal: 'Ship InnerAlign to 100 users',
  clarityScore: 72,
  alignmentScore: 58,
  driftScore: 72,
  streak: 7,
  entries: [],
  selectedIntents: [],
  currentView: 'home',
  energyState: 'high',
};

// ══════════════════════════════════
// ONBOARDING
// ══════════════════════════════════
let currentStep = 0;

function goToStep(targetId) {
  const current = document.querySelector('.ob-step.active');
  const target  = document.getElementById(targetId);
  if (!target || !current) return;

  current.classList.add('exit');
  setTimeout(() => {
    current.classList.remove('active', 'exit');
    target.classList.add('active');

    // Step-specific init
    if (targetId === 'ob-3') initBaselineScore();
  }, 300);
}

// Choice selection
document.querySelectorAll('.choice-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
    const selected = document.querySelectorAll('.choice-card.selected');
    const btn = document.getElementById('btn-ob1');
    if (selected.length > 0) {
      btn.classList.remove('disabled');
      state.selectedIntents = [...selected].map(c => c.dataset.val);
    } else {
      btn.classList.add('disabled');
    }
  });
});

// Journal input — char count + live sentiment
const obJournal = document.getElementById('ob-journal');
const charCount  = document.getElementById('char-count');
const sentPill   = document.getElementById('sentiment-label');
const sentDot    = document.querySelector('.s-dot');

let sentTimeout;
obJournal?.addEventListener('input', () => {
  const len = obJournal.value.length;
  charCount.textContent = `${Math.min(len, 300)} / 300`;

  clearTimeout(sentTimeout);
  sentPill.textContent = 'Analyzing…';
  sentDot.style.background = 'var(--text-muted)';

  sentTimeout = setTimeout(() => {
    const sentiment = detectSentiment(obJournal.value);
    sentPill.textContent = sentiment.label;
    sentDot.style.background = sentiment.color;
  }, 600);
});

function detectSentiment(text) {
  const t = text.toLowerCase();
  const anxious = ['fear', 'anxious', 'worry', 'scared', 'nervous', 'stress', 'avoid'];
  const positive = ['happy', 'excited', 'clear', 'confident', 'focus', 'great', 'good'];
  const conflict = ['but', 'however', 'struggle', 'hard', 'difficult', 'torn', 'unsure'];

  const aScore = anxious.filter(w => t.includes(w)).length;
  const pScore = positive.filter(w => t.includes(w)).length;
  const cScore = conflict.filter(w => t.includes(w)).length;

  if (aScore > pScore)  return { label: 'Anxious undertone', color: '#F87171' };
  if (pScore > aScore)  return { label: 'Positive energy', color: '#34D399' };
  if (cScore > 1)       return { label: 'Internal conflict', color: '#FBBF24' };
  return { label: 'Neutral clarity', color: '#A78BFA' };
}

// Baseline score animation
function initBaselineScore() {
  const score = 62 + Math.floor(Math.random() * 15);
  const fill  = document.getElementById('ring-fill');
  const num   = document.getElementById('ring-score');
  const sigs  = document.getElementById('baseline-signals');

  const circum = 2 * Math.PI * 80; // 502
  const offset = circum - (score / 100) * circum;

  setTimeout(() => {
    fill.style.strokeDashoffset = offset;
    animateNumber(num, 0, score, 1200);
  }, 200);

  const signals = ['Overthinking', 'Avoidance Pattern', 'Decision Clarity Needed'];
  sigs.innerHTML = signals.map(s =>
    `<div class="bs-pill">${s}</div>`
  ).join('');
}

function animateNumber(el, from, to, duration) {
  const start = performance.now();
  const raf = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(from + (to - from) * easeOut(t));
    if (t < 1) requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// Navigation between steps
document.querySelectorAll('.ob-next').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('disabled')) return;
    goToStep(btn.dataset.target);
  });
});

// Enter dashboard
document.getElementById('enter-dashboard')?.addEventListener('click', () => {
  const name = document.getElementById('user-name').value.trim() || 'Aryan';
  const goal = document.getElementById('user-goal').value.trim() || 'Ship to 100 users';

  state.userName = name;
  state.userGoal = goal;

  // Animate out
  const ob = document.getElementById('onboarding');
  ob.style.opacity = '0';
  ob.style.transform = 'scale(1.02)';
  ob.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  setTimeout(() => {
    ob.classList.add('hidden');
    initDashboard();
  }, 500);
});

// ══════════════════════════════════
// DASHBOARD INIT
// ══════════════════════════════════
function initDashboard() {
  const dash = document.getElementById('dashboard');
  dash.classList.remove('hidden');
  dash.classList.add('visible');

  // Animate in
  dash.style.opacity = '0';
  requestAnimationFrame(() => {
    dash.style.transition = 'opacity 0.5s ease';
    dash.style.opacity = '1';
  });

  // Populate user info
  document.getElementById('sidebar-name').textContent = state.userName;
  document.getElementById('sidebar-avatar').textContent = state.userName[0].toUpperCase();
  document.getElementById('greeting-name').textContent = state.userName;
  document.getElementById('greeting-sub').textContent =
    `Your clarity engine has detected 2 new patterns. Goal: "${state.userGoal}"`;
  document.getElementById('goal-text').textContent = state.userGoal;
  document.getElementById('header-date').textContent = formatDate(new Date());

  setJepDate();
  buildSparkChart();
  buildStreakDots();
  buildTimeline();
  buildLoopDiagram();
  buildPastEntries();
  animateClarityRing();
  revealBentoCards();
  updateEnergyOrb('high');
}

// ══════════════════════════════════
// CLARITY RING ANIMATION
// ══════════════════════════════════
function animateClarityRing() {
  const driftCircum  = 2 * Math.PI * 66; // 414
  const alignCircum  = 2 * Math.PI * 54; // 339
  const driftOffset  = driftCircum  - (state.driftScore  / 100) * driftCircum;
  const alignOffset  = alignCircum  - (state.alignmentScore / 100) * alignCircum;

  setTimeout(() => {
    document.getElementById('cring-drift').style.strokeDashoffset = driftOffset;
    document.getElementById('cring-align').style.strokeDashoffset = alignOffset;
    animateNumber(document.getElementById('clarity-num'), 0, state.clarityScore, 1400);
    document.getElementById('leg-drift').textContent  = state.driftScore;
    document.getElementById('leg-align').textContent  = state.alignmentScore;
  }, 300);
}

// ══════════════════════════════════
// SPARK CHART
// ══════════════════════════════════
function buildSparkChart() {
  const data   = [48, 55, 61, 59, 67, 70, 72];
  const chart  = document.getElementById('spark-chart');
  if (!chart) return;
  const max = Math.max(...data);

  chart.innerHTML = data.map((v, i) =>
    `<div class="spark-bar" style="height:${(v/max)*100}%;animation-delay:${i*0.08}s"></div>`
  ).join('');
}

// ══════════════════════════════════
// STREAK DOTS
// ══════════════════════════════════
function buildStreakDots() {
  const container = document.getElementById('streak-dots');
  if (!container) return;
  container.innerHTML = Array.from({length: 7}, (_, i) =>
    `<div class="streak-dot ${i < state.streak ? 'active' : ''}"></div>`
  ).join('');
}

// ══════════════════════════════════
// TIMELINE
// ══════════════════════════════════
function buildTimeline() {
  const tl = document.getElementById('timeline');
  if (!tl) return;

  const events = [
    { day: 'Day 1', text: 'First journal entry. <strong>Baseline clarity: 62</strong>', cls: 'teal', icon: '📝' },
    { day: 'Day 2', text: 'Pattern Detector found avoidance loop', cls: 'purple', icon: '🔍' },
    { day: 'Day 4', text: '<strong>Shipped without perfecting</strong> — broke overthinking loop', cls: 'teal', icon: '🚀' },
    { day: 'Day 5', text: 'Alignment Coach flagged goal misalignment in task selection', cls: 'purple', icon: '🧭' },
    { day: 'Day 6', text: 'Clarity score crossed <strong>70</strong> — 3 cold calls completed', cls: 'teal', icon: '⚡' },
    { day: 'Today', text: '<strong>7-day streak</strong> achieved. Score: 72 and rising', cls: 'purple', icon: '🔥' },
  ];

  tl.innerHTML = events.map(e => `
    <div class="tl-item">
      <div class="tl-dot ${e.cls}">${e.icon}</div>
      <div class="tl-content">
        <div class="tl-day">${e.day}</div>
        <div class="tl-text">${e.text}</div>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════
// LOOP DIAGRAM
// ══════════════════════════════════
function buildLoopDiagram() {
  const d = document.getElementById('loop-diagram');
  if (!d) return;
  d.innerHTML = `
    <div class="loop-box">
      <div class="loop-box-title">Loop 1 — Awareness</div>
      <div class="loop-box-steps">User Journals<br/>↓<br/>AI Extracts Pattern<br/>↓<br/>Tags Emotional State</div>
    </div>
    <div class="loop-arrow">⇄</div>
    <div class="loop-box">
      <div class="loop-box-title">Loop 2 — Correction</div>
      <div class="loop-box-steps">AI Assigns Task<br/>↓<br/>Tracks Compliance<br/>↓<br/>Updates Clarity Score</div>
    </div>
  `;
}

// ══════════════════════════════════
// PAST ENTRIES
// ══════════════════════════════════
function buildPastEntries() {
  const list = document.getElementById('pe-list');
  if (!list) return;

  const sample = [
    { date: '3 days ago', preview: 'I avoided calling the client again. I know what I need to do but…' },
    { date: '5 days ago', preview: 'Clarity felt high this morning. Shipped the first version without editing.' },
    { date: '1 week ago', preview: 'Struggling to decide between two paths. Both feel right but neither feels…' },
  ];

  list.innerHTML = sample.map(e => `
    <div class="pe-item">
      <div class="pe-date">${e.date}</div>
      <div class="pe-preview">${e.preview}</div>
    </div>
  `).join('');
}

// ══════════════════════════════════
// REVEAL BENTO CARDS (staggered)
// ══════════════════════════════════
function revealBentoCards() {
  const cards = document.querySelectorAll('.reveal');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, 100 + i * 80);
  });
}

// ══════════════════════════════════
// NAVIGATION
// ══════════════════════════════════
function switchView(viewName) {
  // Nav items
  document.querySelectorAll('.nav-item, .bn-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  // Views
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id === `view-${viewName}`);
  });

  state.currentView = viewName;

  // Re-reveal cards when switching back to home
  if (viewName === 'home') {
    setTimeout(() => revealBentoCards(), 50);
  }
}

document.querySelectorAll('[data-view]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const v = el.dataset.view;
    if (v && el.id !== 'fab-btn') switchView(v);
  });
});

// ══════════════════════════════════
// COPILOT INPUT
// ══════════════════════════════════
const copilotInput = document.getElementById('copilot-input');
const copilotSend  = document.getElementById('copilot-send');

const aiResponses = [
  "Based on your last 3 entries, your <strong>avoidance pattern</strong> peaks on Tuesday and Wednesday mornings — right before your scheduled client calls. A 3-minute grounding reset at 9AM could reduce drift by ~15%.",
  "I notice you mention 'posting content' in 4 of your last 7 entries but haven't actually published. Your <strong>alignment score</strong> drops when intention and action diverge. Try publishing one imperfect post today.",
  "Your <strong>clarity is highest between 6-10AM</strong>. You're scheduling complex decisions in the afternoon when your energy state is low. Shift decision-making to mornings for better alignment.",
  "Pattern detected: You say 'I'll do it tomorrow' most often on Thursdays. This is a recurrence signal. Setting a micro-commitment right now could break the loop.",
  "Your goal is to reach 100 users. At current trajectory (34 users, 12 days left), you need 66 more — about 5-6 per day. The <strong>main blocker</strong> is delayed outreach. Your next action: send 3 messages in the next hour.",
];

let aiIdx = 0;

function sendCopilotMessage() {
  const msg = copilotInput.value.trim();
  if (!msg) return;

  copilotInput.value = '';

  // Show loading
  const msgEl = document.getElementById('insight-message');
  msgEl.innerHTML = '';
  const loading = document.createElement('div');
  loading.className = 'ai-loading';
  loading.innerHTML = '<div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div>';
  msgEl.appendChild(loading);

  setTimeout(() => {
    const response = aiResponses[aiIdx % aiResponses.length];
    aiIdx++;
    typeMessage(msgEl, response);
  }, 1200 + Math.random() * 600);
}

function typeMessage(el, html) {
  el.innerHTML = '';
  el.classList.add('typing');
  // Strip tags for typing animation, then render
  const plain = html.replace(/<[^>]+>/g, '');
  let i = 0;
  const interval = setInterval(() => {
    if (i >= plain.length) {
      clearInterval(interval);
      el.classList.remove('typing');
      el.innerHTML = html; // render with formatting
    } else {
      el.textContent = plain.slice(0, ++i);
    }
  }, 18);
}

copilotSend?.addEventListener('click', sendCopilotMessage);
copilotInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendCopilotMessage();
});

// Insight action buttons
document.getElementById('insight-actions')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.ia-btn');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'reset') showToast('3-minute reset started 🌬', 'success');
  if (action === 'task')  addTaskFromCopilot();
  if (action === 'journal') switchView('journal');
});

function addTaskFromCopilot() {
  const list = document.getElementById('tasks-list');
  if (!list) return;
  const task = document.createElement('div');
  task.className = 'task-item';
  task.innerHTML = `
    <button class="task-check" data-done="false"></button>
    <div class="task-body">
      <span class="task-title">Copilot micro-task: Outreach to 1 lead</span>
      <span class="task-due">Added just now</span>
    </div>
    <span class="task-badge urgent">Now</span>
  `;
  list.prepend(task);
  task.style.opacity = '0';
  task.style.transform = 'translateY(-8px)';
  task.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  requestAnimationFrame(() => { task.style.opacity = '1'; task.style.transform = ''; });
  initTaskChecks();
  showToast('Task created by Clarity Copilot ✅', 'success');
}

// Task checks
function initTaskChecks() {
  document.querySelectorAll('.task-check').forEach(btn => {
    btn.onclick = () => {
      const done = btn.dataset.done === 'true';
      btn.dataset.done = (!done).toString();
      const body = btn.nextElementSibling;
      body?.classList.toggle('task-done', !done);
      if (!done) showToast('Task complete! +2 clarity points 🎯', 'success');
    };
  });
}
initTaskChecks();

// Add task button
document.getElementById('add-task-btn')?.addEventListener('click', () => {
  const title = prompt('New micro-correction task:');
  if (!title) return;
  const list = document.getElementById('tasks-list');
  const task = document.createElement('div');
  task.className = 'task-item';
  task.innerHTML = `
    <button class="task-check" data-done="false"></button>
    <div class="task-body">
      <span class="task-title">${title}</span>
      <span class="task-due">Added just now</span>
    </div>
    <span class="task-badge medium">Today</span>
  `;
  list.appendChild(task);
  initTaskChecks();
});

// ══════════════════════════════════
// QUICK JOURNAL MODAL
// ══════════════════════════════════
document.getElementById('quick-journal-btn')?.addEventListener('click', openModal);
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

function openModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.2s ease';
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.style.opacity = '';
  }, 200);
}

document.getElementById('modal-analyze')?.addEventListener('click', () => {
  const text = document.getElementById('modal-journal').value.trim();
  if (!text) return;
  closeModal();
  showToast('Entry saved. Analyzing patterns… 🧠', 'success');

  // Add to past entries
  const list = document.getElementById('pe-list');
  if (list) {
    const el = document.createElement('div');
    el.className = 'pe-item';
    el.innerHTML = `<div class="pe-date">Just now</div><div class="pe-preview">${text.slice(0, 80)}…</div>`;
    list.prepend(el);
  }

  // Update copilot insight
  setTimeout(() => {
    const msgEl = document.getElementById('insight-message');
    if (msgEl) {
      const loading = document.createElement('div');
      loading.className = 'ai-loading';
      loading.innerHTML = '<div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div>';
      msgEl.innerHTML = '';
      msgEl.appendChild(loading);
      setTimeout(() => {
        typeMessage(msgEl, `New entry analyzed. Key signal: <strong>${detectSentiment(text).label}</strong>. This aligns with your recurring pattern — update your micro-task list accordingly.`);
      }, 1500);
    }
  }, 500);
});

// ══════════════════════════════════
// JOURNAL VIEW
// ══════════════════════════════════
function setJepDate() {
  const el = document.getElementById('jep-date');
  if (el) el.textContent = formatDate(new Date());
}

document.getElementById('journal-main')?.addEventListener('input', function() {
  const tag = document.getElementById('jtag-sentiment');
  if (!tag) return;
  clearTimeout(sentTimeout);
  sentTimeout = setTimeout(() => {
    const s = detectSentiment(this.value);
    tag.textContent = s.label;
    tag.style.color = s.color;
    tag.style.borderColor = s.color + '40';
  }, 600);
});

document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.getElementById('analyze-journal-btn')?.addEventListener('click', function() {
  const text = document.getElementById('journal-main').value.trim();
  const result = document.getElementById('ji-result');
  const placeholder = document.getElementById('ji-placeholder');
  if (!result || !text) return;

  placeholder.style.display = 'none';
  result.classList.remove('hidden');
  result.innerHTML = '<div class="ai-loading"><div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div></div>';

  setTimeout(() => {
    const s = detectSentiment(text);
    result.innerHTML = `
      <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary)">
        <strong style="color:var(--teal)">Sentiment:</strong> ${s.label}
      </div>
      <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary)">
        <strong style="color:var(--purple)">Patterns detected:</strong> Avoidance undertone before key decisions. Clarity intent present but action deferred.
      </div>
      <div style="font-size:13px;color:var(--text-secondary)">
        <strong style="color:var(--teal)">Recommended action:</strong> Set one micro-commitment within the next 60 minutes. No planning — just execution.
      </div>
    `;
    showToast('Entry analyzed. 3 patterns tagged.', 'success');
  }, 1800);
});

// ══════════════════════════════════
// ENERGY STATE
// ══════════════════════════════════
const energyConfig = {
  high:  { emoji: '⚡', label: 'High Focus',  color: 'rgba(251,191,36,0.3)',  shadow: '#FBBF24', time: 'Peak: 6–10 AM' },
  flow:  { emoji: '🌊', label: 'Flow State',  color: 'rgba(126,232,200,0.3)', shadow: '#7EE8C8', time: 'Usually 10–12 PM' },
  low:   { emoji: '🌫', label: 'Low Energy',  color: 'rgba(156,163,175,0.2)', shadow: '#9CA3AF', time: 'Often 2–4 PM' },
  rest:  { emoji: '🌙', label: 'Rest Mode',   color: 'rgba(167,139,250,0.2)', shadow: '#A78BFA', time: 'Evening wind-down' },
};

function updateEnergyOrb(s) {
  const cfg = energyConfig[s];
  const orb = document.getElementById('energy-orb');
  const label = document.getElementById('energy-state-text');
  const time  = document.querySelector('.energy-time');
  if (!orb) return;

  orb.querySelector('.energy-emoji').textContent = cfg.emoji;
  orb.style.background = `radial-gradient(circle, ${cfg.color} 0%, transparent 70%)`;
  orb.style.borderColor = cfg.shadow + '50';
  orb.style.boxShadow  = `0 0 20px ${cfg.shadow}30`;
  if (label) label.textContent = cfg.label;
  if (time)  time.textContent  = cfg.time;
  state.energyState = s;
}

document.querySelectorAll('.es-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.es-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateEnergyOrb(btn.dataset.state);
  });
});

// ══════════════════════════════════
// TOAST
// ══════════════════════════════════
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(10px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ══════════════════════════════════
// UTILS
// ══════════════════════════════════
function formatDate(d) {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

// ══════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'j' && e.ctrlKey) { e.preventDefault(); openModal(); }
});

// ══════════════════════════════════
// INTERSECTION OBSERVER for reveals
// ══════════════════════════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function observeRevealCards() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// Re-observe when views change
const mutationObs = new MutationObserver(() => observeRevealCards());
mutationObs.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });

// ══════════════════════════════════
// INIT
// ══════════════════════════════════
// Set greeting based on time
(function setGreetingTime() {
  const hour = new Date().getHours();
  const greetEl = document.querySelector('.page-title');
  // Will be set when dashboard inits
})();
