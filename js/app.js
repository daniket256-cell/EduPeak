// ── EduPeak Shared JS ──

// ── AUTH ──
const Auth = {
  getUser() {
    try { return JSON.parse(localStorage.getItem('ep_user')); } catch { return null; }
  },
  setUser(u) { localStorage.setItem('ep_user', JSON.stringify(u)); },
  logout() { localStorage.removeItem('ep_user'); window.location.href = '../index.html'; },
  isAdmin() { const u = this.getUser(); return u && u.role === 'admin'; },
  require(redirect = '../index.html') {
    if (!this.getUser()) { window.location.href = redirect; return false; }
    return true;
  },
  requireAdmin(redirect = '../index.html') {
    if (!this.isAdmin()) { window.location.href = redirect; return false; }
    return true;
  }
};

// ── TESTS STORE ──
const Store = {
  getTests() {
    try { return JSON.parse(localStorage.getItem('ep_tests')) || defaultTests(); } catch { return defaultTests(); }
  },
  saveTests(tests) { localStorage.setItem('ep_tests', JSON.stringify(tests)); },
  getResults() {
    try { return JSON.parse(localStorage.getItem('ep_results')) || []; } catch { return []; }
  },
  saveResult(r) {
    const results = this.getResults();
    results.push(r);
    localStorage.setItem('ep_results', JSON.stringify(results));
  },
  getUsers() {
    try { return JSON.parse(localStorage.getItem('ep_users')) || []; } catch { return []; }
  },
  addUser(u) {
    const users = this.getUsers();
    users.push(u);
    localStorage.setItem('ep_users', JSON.stringify(users));
  },
  findUser(email) { return this.getUsers().find(u => u.email === email); }
};

function defaultTests() {
  return [
    {
      id: 'test_001', title: 'JEE Main Mock Test #1',
      exam: 'JEE', subject: 'PCM', duration: 180, totalMarks: 300,
      description: 'Full syllabus mock test covering Physics, Chemistry and Mathematics.',
      uploadedBy: 'admin@edupeak.in', uploadedAt: '2025-01-10',
      questions: [
        { id: 1, text: 'A body of mass 2 kg is thrown vertically upward with a velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)', options: ['10 m','20 m','30 m','40 m'], correct: 1, marks: 4, subject: 'Physics' },
        { id: 2, text: 'The de Broglie wavelength associated with an electron accelerated through a potential of 100V is approximately:', options: ['1.23 Å','1.23 nm','12.3 Å','0.123 nm'], correct: 0, marks: 4, subject: 'Physics' },
        { id: 3, text: 'Which of the following is the correct IUPAC name of CH₃-CH(OH)-CH₂-CH₃?', options: ['2-butanol','3-butanol','1-methylpropanol','Butan-2-ol'], correct: 3, marks: 4, subject: 'Chemistry' },
        { id: 4, text: 'The number of solutions of the equation sin x = x/10 is:', options: ['1','3','5','7'], correct: 3, marks: 4, subject: 'Maths' },
        { id: 5, text: 'If f(x) = x² - 3x + 2, then f(f(x)) = 0 has how many real roots?', options: ['2','3','4','6'], correct: 2, marks: 4, subject: 'Maths' },
      ]
    },
    {
      id: 'test_002', title: 'CBSE 12th Physics - Electrostatics',
      exam: 'CBSE 12th', subject: 'Physics', duration: 60, totalMarks: 40,
      description: 'Chapter-wise test on Electrostatics covering Coulomb\'s law, electric field, and potential.',
      uploadedBy: 'admin@edupeak.in', uploadedAt: '2025-01-12',
      questions: [
        { id: 1, text: "Coulomb's force between two charges is F. If both charges are doubled and distance is halved, the new force is:", options: ['F','4F','8F','16F'], correct: 3, marks: 2, subject: 'Physics' },
        { id: 2, text: 'Electric field inside a hollow charged conductor is:', options: ['Maximum','Zero','Uniform','Infinite'], correct: 1, marks: 2, subject: 'Physics' },
        { id: 3, text: 'A capacitor of capacitance C is charged to potential V. Energy stored is:', options: ['CV','CV²','½CV²','2CV²'], correct: 2, marks: 2, subject: 'Physics' },
        { id: 4, text: "The SI unit of electric flux is:", options: ['N/C','Vm','N·m²/C','C/m²'], correct: 2, marks: 2, subject: 'Physics' },
      ]
    },
    {
      id: 'test_003', title: 'IIT JAM Mathematics - Calculus',
      exam: 'IIT JAM', subject: 'Mathematics', duration: 90, totalMarks: 60,
      description: 'Topic-wise test on single-variable and multivariable calculus for JAM aspirants.',
      uploadedBy: 'admin@edupeak.in', uploadedAt: '2025-01-15',
      questions: [
        { id: 1, text: 'The value of lim(x→0) [sin(3x)/x] is:', options: ['0','1','3','∞'], correct: 2, marks: 3, subject: 'Calculus' },
        { id: 2, text: 'The derivative of xˣ with respect to x is:', options: ['xˣ','xˣ(1+ln x)','xˣ ln x','x·xˣ⁻¹'], correct: 1, marks: 3, subject: 'Calculus' },
        { id: 3, text: '∫₀^π sin²x dx equals:', options: ['0','π/4','π/2','π'], correct: 2, marks: 3, subject: 'Calculus' },
      ]
    }
  ];
}

// ── TOAST ──
function showToast(msg, type = '') {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  t.innerHTML = `<span>${icon}</span> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ── NAV RENDER ──
function renderNav(activePage = '') {
  const user = Auth.getUser();
  const isAdmin = user && user.role === 'admin';
  const base = document.body.dataset.root || '../';
  return `
  <nav>
    <a href="${base}index.html" class="logo">Edu<span>Peak</span></a>
    <ul class="nav-links">
      <li><a href="${base}index.html" ${activePage==='home'?'class="active"':''}>Home</a></li>
      <li><a href="${base}pages/tests.html" ${activePage==='tests'?'class="active"':''}>Test Series</a></li>
      ${isAdmin ? `<li><a href="${base}pages/upload.html" ${activePage==='upload'?'class="active"':''}>Upload</a></li>
      <li><a href="${base}pages/admin.html" ${activePage==='admin'?'class="active"':''}>Dashboard</a></li>` : ''}
      ${user ? `<li><a href="${base}pages/results.html" ${activePage==='results'?'class="active"':''}>My Results</a></li>` : ''}
    </ul>
    <div class="nav-user">
      ${user
        ? `<div class="avatar" title="${user.name}">${user.name[0].toUpperCase()}</div>
           <button class="btn btn-outline btn-sm" onclick="Auth.logout()">Logout</button>`
        : `<button class="btn btn-primary btn-sm" onclick="openAuth()">Login / Sign Up</button>`
      }
    </div>
  </nav>`;
}

// ── TIMER ──
class Timer {
  constructor(seconds, onTick, onEnd) {
    this.remaining = seconds;
    this.onTick = onTick;
    this.onEnd = onEnd;
    this.interval = null;
  }
  start() {
    this.onTick(this.remaining);
    this.interval = setInterval(() => {
      this.remaining--;
      this.onTick(this.remaining);
      if (this.remaining <= 0) { this.stop(); this.onEnd(); }
    }, 1000);
  }
  stop() { clearInterval(this.interval); }
  format(s) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }
}
