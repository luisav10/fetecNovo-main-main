// --- 1. SPA Router State Management (Sistema de Troca de Páginas Virtuais) ---
const validViews = ['inicio', 'curso'];

function navigateTo(targetView) {
    if (!validViews.includes(targetView)) {
        targetView = 'inicio';
    }

    // Reproduz efeito sonoro de transição futurista ao mudar de tela
    playBeep(480, 'triangle', 0.08);

    // Esconde todas as telas
    validViews.forEach(viewId => {
        const element = document.getElementById(`view-${viewId}`);
        if (element) {
            element.classList.add('hidden');
        }
    });

    // Mostra a tela selecionada
    const activeElement = document.getElementById(`view-${targetView}`);
    if (activeElement) {
        activeElement.classList.remove('hidden');
    }

    // Atualiza o estado visual do menu ativo
    const desktopLinks = document.querySelectorAll('#desktop-nav .nav-link');
    desktopLinks.forEach(link => {
        const linkView = link.getAttribute('data-view');
        if (linkView === targetView) {
            link.className = "nav-link text-cyber-cyan py-2 border-b-2 border-cyber-cyan transition-all font-bold";
        } else {
            link.className = "nav-link text-slate-500 dark:text-slate-400 hover:text-cyber-cyan py-2 border-b-2 border-transparent hover:border-cyber-cyan transition-all";
        }
    });

    // Reseta a rolagem da tela para o topo
    window.scrollTo({top: 0, behavior: 'instant'});

    // Atualiza a hash URL de navegação no navegador
    if (window.location.hash !== `#/${targetView}`) {
        window.location.hash = `/${targetView}`;
    }

    // Fecha o menu hamburguer caso esteja ativo no celular
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

// Listener de navegação por botões avançar/voltar do navegador
window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#/', '').replace('#', '');
    if (currentHash && validViews.includes(currentHash)) {
        navigateTo(currentHash);
    }
});


// --- 2. Synthesizer Sound System (Web Audio API para Sons Tecnológicos) ---
let audioCtx = null;
let audioSystemActive = false;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playBeep(frequency, type = 'sine', duration = 0.1, volume = 0.08) {
    if (!audioSystemActive) return;
    try {
        initAudioContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.log("Audio synthesis bypassed: ", e);
    }
}

function toggleAudioSystem() {
    audioSystemActive = !audioSystemActive;
    const soundIcon = document.getElementById('soundIcon');
    const soundBtn = document.getElementById('soundToggle');

    if (audioSystemActive) {
        initAudioContext();
        soundIcon.className = "fas fa-volume-up text-lg";
        soundBtn.className = "bg-cyber-cyan/20 border border-cyber-cyan hover:border-cyber-cyan p-4 rounded-full shadow-neon-cyan transition-all duration-300 flex items-center justify-center text-cyber-cyan backdrop-blur-md";
        playBeep(600, 'sine', 0.2);
    } else {
        soundIcon.className = "fas fa-volume-mute text-lg";
        soundBtn.className = "bg-white hover:bg-slate-100 border border-slate-200 dark:bg-cyber-darkBlue/80 dark:border-cyber-cyan/50 dark:hover:border-cyber-cyan p-4 rounded-full shadow-lg dark:shadow-neon-cyan transition-all duration-300 flex items-center justify-center text-cyber-cyan backdrop-blur-md";
    }
}


// --- 3. Light / Dark Mode Toggle Feature (Alternador Estético Claro/Escuro) ---
function applySavedTheme() {
    const savedTheme = localStorage.getItem('infotecTheme') || 'dark';
    const htmlNode = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    
    if (savedTheme === 'light') {
        htmlNode.classList.remove('dark');
        htmlNode.classList.add('light');
        themeIcon.className = "fas fa-moon text-lg";
    } else {
        htmlNode.classList.remove('light');
        htmlNode.classList.add('dark');
        themeIcon.className = "fas fa-sun text-lg";
    }
}

function toggleThemeSystem() {
    const htmlNode = document.documentElement;
    const isDarkNow = htmlNode.classList.contains('dark');
    playBeep(isDarkNow ? 400 : 700, 'sine', 0.15);

    if (isDarkNow) {
        localStorage.setItem('infotecTheme', 'light');
    } else {
        localStorage.setItem('infotecTheme', 'dark');
    }
    applySavedTheme();
}


// --- 4. Constellation Particle Canvas Background (Efeito de Rede de Dados Dinâmica) ---
const canvas = document.getElementById('constellationCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 160 };

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    
    const numParticles = Math.min(Math.floor(window.innerWidth / 15), 100);
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2.5 + 1,
            color: Math.random() > 0.5 ? '#06b6d4' : '#a855f7'
        });
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.classList.contains('dark');
    
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                p.x -= dx * force * 0.03;
                p.y -= dy * force * 0.03;
            }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? p.color : 'rgba(15, 23, 42, 0.4)';
        ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = isDark ? `rgba(6, 182, 212, ${1 - dist / 120})` : `rgba(15, 23, 42, ${(1 - dist / 120) * 0.25})`;
                ctx.lineWidth = 0.4;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateCanvas);
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', () => {
    initCanvas();
});


// --- 5. Filtering Logic for Exhibits (Filtro Inteligente de Projetos) ---
function filterExhibits(category) {
    const cards = document.querySelectorAll('.exhibit-card');
    const btns = document.querySelectorAll('.filter-btn');

    playBeep(440, 'triangle', 0.05);

    btns.forEach(btn => {
        btn.className = "filter-btn px-5 py-2.5 rounded-lg border border-slate-300 dark:border-cyber-border hover:border-cyber-cyan text-slate-700 dark:text-slate-300 hover:text-white hover:bg-cyber-cyan dark:hover:bg-transparent transition-all duration-300";
    });
    const activeBtn = document.getElementById(`btn-${category}`);
    if (activeBtn) {
        activeBtn.className = "filter-btn px-5 py-2.5 rounded-lg border border-cyber-cyan bg-cyber-cyan text-cyber-bg dark:text-cyber-bg font-bold transition-all duration-300 shadow-sm dark:shadow-neon-cyan";
    }

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}


// --- 6. Mobile Menu Trigger ---
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    playBeep(440, 'triangle', 0.05);
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});


// --- 7. Scroll Observer for Back To Top Button ---
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (window.scrollY > 400) {
        scrollBtn.classList.remove('hidden');
    } else {
        scrollBtn.classList.add('hidden');
    }
});


// --- 8. Window Load & Initial Setup ---
window.onload = function() {
    applySavedTheme();
    initCanvas();
    animateCanvas();

    // Roteador SPA lendo rotas de hash
    const initialHash = window.location.hash.replace('#/', '').replace('#', '');
    navigateTo(initialHash || 'inicio');
}