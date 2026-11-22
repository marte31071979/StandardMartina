document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const chapters = Array.from(document.querySelectorAll('.chapter'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const chapterTitle = document.getElementById('chapterTitle');
  const progressIndicator = document.getElementById('progressIndicator');

  let currentIndex = 0;

  function formatTitleWithRedSuits(title) {
    return title
      .replace(/♥/g, '<span class="suit-red">♥</span>')
      .replace(/♦/g, '<span class="suit-red">♦</span>');
  }

  function showChapter(index) {
    if (index < 0 || index >= chapters.length) return;
    currentIndex = index;

    chapters.forEach((ch, idx) => {
      ch.classList.toggle('active', idx === currentIndex);
    });

    navLinks.forEach(link => {
      const target = parseInt(link.dataset.goto, 10);
      link.classList.toggle('active', target === currentIndex);
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === chapters.length - 1;
    chapterTitle.innerHTML = formatTitleWithRedSuits(chapters[currentIndex].dataset.title || '');
    progressIndicator.textContent = `${currentIndex + 1} / ${chapters.length}`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => showChapter(currentIndex - 1));
  nextBtn.addEventListener('click', () => showChapter(currentIndex + 1));

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const idx = parseInt(link.dataset.goto, 10);
      showChapter(idx);
      sidebar.classList.remove('open');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') showChapter(currentIndex + 1);
    if (e.key === 'ArrowLeft') showChapter(currentIndex - 1);
  });

  menuToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
  menuClose?.addEventListener('click', () => sidebar.classList.remove('open'));

  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const submenu = btn.nextElementSibling;
      submenu.classList.toggle('hidden');
    });
  });

  document.querySelectorAll('.toggle-sol').forEach(btn => {
    btn.addEventListener('click', () => {
      const sol = btn.nextElementSibling;
      sol.classList.toggle('hidden');
    });
  });

  // Inizializza il primo capitolo
  showChapter(0);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.error('Errore registrazione Service Worker:', err);
    });
  }
});

let allRevealed = false;
function toggleSingleSolution(btn) {
    const content = btn.closest('.solution-wrapper').querySelector('.solution-content');
    const nextEl = btn.closest('.bridge-hand').nextElementSibling;
    const isVisible = content.classList.toggle('visible');
    btn.textContent = isVisible ? '🙈 Nascondi' : '👁️ Mostra soluzione';
    if (nextEl && nextEl.classList.contains('solution-note')) nextEl.classList.toggle('visible', isVisible);
}
function toggleAllExamples() {
    allRevealed = !allRevealed;
    document.getElementById('toggleAllSolutions').textContent = allRevealed ? '🙈 Nascondi tutte le soluzioni' : '👁️ Mostra tutte le soluzioni';
    document.querySelectorAll('.solution-content').forEach(el => el.classList.toggle('visible', allRevealed));
    document.querySelectorAll('.solution-note').forEach(el => el.classList.toggle('visible', allRevealed));
    document.querySelectorAll('.btn-reveal').forEach(btn => btn.textContent = allRevealed ? '🙈 Nascondi' : '👁️ Mostra soluzione');
}
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }

const quizData = [
    { topic: "Prerequisiti imprescindibili", q: "Qual è il numero massimo di Punti Onore (PO) ammessi per un'apertura di barrage a livello 3?", opts: ["Fino a 14 PO.", "Meno di 12 PO (tra 6 e 10 PO).", "Esattamente 13 PO.", "Nessun limite."], correct: 1, hint: "Serve una mano troppo debole per aprire a livello 1.", expl: "Corretto! Sotto i 12 PO (in genere 6-10 PO)." },
    { topic: "Prerequisiti imprescindibili", q: "Quante prese difensive fuori dal colore d'atout sono tollerabili?", opts: ["Massimo 1 presa difensiva (al massimo un Asso).", "Fino a 3 prese.", "Almeno 2 Assi.", "Nessun limite."], correct: 0, hint: "Con valori difensivi esterni non è una mano da barrage.", expl: "Corretto! Massimo 1 presa difensiva fuori atout." },
	{ topic: "Regola del 2, 3 e 4", q: "In seconda contro prima (noi vulnerabili, loro no), quanti down ammissibili metti in conto?", opts: ["2 down.", "3 down.", "4 down.", "0 down."], correct: 0, hint: "2 in zona contro prima, 3 a pari vulnerabilità, 4 in prima contro zona.", expl: "Esatto! 2 down ammissibili." },
{ topic: "Regola del 2, 3 e 4", q: "In prima contro seconda (4 down ammissibili), quante vincenti bastano per aprire a livello 3?", opts: ["3 vincenti.", "5 vincenti (9 - 4 = 5).", "8 vincenti.", "9 vincenti."], correct: 1, hint: "9 prese del contratto meno 4 down ammissibili.", expl: "Corretto! Bastano 5 vincenti." },
{ topic: "Conteggio delle vincenti", q: "Quante prese affrancabili vale AKQxxxx?", opts: ["5 prese.", "7 prese.", "6 prese.", "8 prese."], correct: 1, hint: "Divisione probabile dei resti 3-2-1.", expl: "Esatto! 7 prese affrancabili di forza." },
{ topic: "Conteggio delle vincenti", q: "Valutando AKJxxxx in zona (con pessimismo), quante vincenti conti?", opts: ["6 vincenti e mezzo (contro 7 in prima).", "4 vincenti.", "8 vincenti.", "5 vincenti."], correct: 0, hint: "Ottimismo in prima, pessimismo in zona.", expl: "Corretto! 6,5 vincenti in zona." },
{ topic: "Quarta nobile a lato", q: "Perché evitare il barrage con una quarta nobile a lato?", opts: ["Troppi PO.", "Si rischia di perdere un fit 4-4 a manche nell'altro nobile.", "Vietato.", "Obbliga 3SA."], correct: 1, hint: "I fit 4-4 nei nobili hanno la priorità.", expl: "Esatto! Per non perdere la manche 4-4." },
{ topic: "Regola aurea", q: "Cosa fa l'apertore dopo aver dichiarato barrage?", opts: ["Ripete il seme.", "Va a prendere il caffè (dice sempre Passo salvo surlicita o nuovo colore del compagno).", "Chiede gli assi.", "Dice 3SA."], correct: 1, hint: "Il compagno è in comando assoluto.", expl: "Corretto! Parla solo su surlicita o nuovo colore." },
{ topic: "Trappola 3SA", q: "Su 3♦ (KQJ10982), perché Nord con AK52 AK94 3 KJ92 non deve dire 3SA?", opts: ["Pochi punti.", "L'apertore non ha rientri esterni: a Senza le comunicazioni sono impossibili.", "3SA è convenzionale.", "Ha 4 cuori."], correct: 1, hint: "Meglio giocare 5♦.", expl: "Esatto! Senza rientri al morto non incassi le quadri." },
{ topic: "Sottoaperture RONF", q: "Su 2♥ RONF, che caratteristiche ha la risposta 2♠?", opts: ["Non forzante.", "5ª+ forzante.", "Richiesta d'assi.", "Mostra 4 cuori."], correct: 1, hint: "Solo gli appoggi diretti non sono forzanti.", expl: "Corretto! 2♠ è 5ª+ forzante." },
{ topic: "2SA relay RONF", q: "Su 2♠ RONF → 2SA relay, cosa mostra la ripetizione 3♠?", opts: ["Massimo e fermo.", "AKQxxx.", "Minimo (fino a 8 PO) e assenza dei 3 onori maggiori.", "Singolo a cuori."], correct: 2, hint: "Col massimo dichiara il fermo.", expl: "Esatto! Mano minima senza AKQ." },
{ topic: "3SA Gambling", q: "Cosa garantisce l'apertura 3SA Gambling?", opts: ["25-27 PO.", "8 carte in un minore chiuso senza onori fuori.", "Bicolore 6-5.", "3 Assi."], correct: 1, hint: "Minore ottavo chiuso.", expl: "Corretto! 8 carte in un minore chiuso e nessun onore fuori." },
{ topic: "3SA Gambling: risposte", q: "Su 3SA Gambling, cosa significa 4♣?", opts: ["Chiede Assi.", "Passa o correggi (a 4♦).", "Slam a fiori.", "Fermo a cuori."], correct: 1, hint: "Il rispondente non ha i fermi per 3SA.", expl: "Esatto! 4♣ è passa o correggi." },
{ topic: "Transfer 4♣ / 4♦", q: "Cosa mostrano 4♣ e 4♦ in apertura?", opts: ["Barrage minori.", "Transfer per 4♥/4♠ con 2 Assi (di cui uno in atout).", "0 Assi.", "6-5 minore."], correct: 1, hint: "Unica apertura barrage con 2 Assi.", expl: "Corretto! Transfer con 2 Assi (uno in atout)." },
{ topic: "Sviluppi 4♣ / 4♦", q: "Su 4♣ → 4♥, cosa chiede 4SA del rispondente?", opts: ["Gli Assi.", "I Re (richiesta di K), poiché gli Assi sono già noti (2).", "Il singolo.", "Di giocare 4SA."], correct: 1, hint: "Il numero di Assi è già garantito.", expl: "Esatto! 4SA chiede i Re." },
{ topic: "Aperture 4♥ / 4♠", q: "Quanti Assi mostrano le aperture dirette 4♥ / 4♠?", opts: ["0 o 1 Asso (senza 2 Assi).", "2 Assi.", "3 Assi.", "Sempre 1 Asso."], correct: 0, hint: "Con 2 Assi si usa 4♣/4♦.", expl: "Corretto! 0 o 1 Asso." },
{ topic: "Richiesta d'assi su 4♥/4♠", q: "Su 4♠ (0 o 1 Asso) → 4SA, l'apertore risponde 5♦ (secondo gradino). Quanti Assi ha?", opts: ["0 Assi.", "1 Asso.", "2 Assi.", "3 Assi."], correct: 1, hint: "5♣ = 0 Assi, 5♦ = 1 Asso.", expl: "Esatto! 1 Asso." },
{ topic: "Apertura 4SA", q: "Cosa mostra l'apertura 4SA barrage?", opts: ["Minore ottavo.", "Bicolore minore almeno 6/5 (♣/♦ o ♦/♣).", "22-24 PO.", "Blackwood."], correct: 1, hint: "Bicolore minore ostruttiva.", expl: "Corretto! Almeno 6/5 nei minori." },
{ topic: "Quarta minore a lato", q: "Con ♠ AQJ8753 ♥ 2 ♦ 4 ♣ J862 (quarta di fiori a lato), puoi aprire 3♠?", opts: ["No.", "Sì, una quarta minore non ostacola il barrage.", "Apri 1♠.", "Passa."], correct: 1, hint: "Il divieto vale solo per le quarte nobili.", expl: "Esatto! Apri 3♠." },
{ topic: "Difesa dai barrage", q: "Avversario apre 3♠. Tu hai ♠ 5 ♥ AQ52 ♦ AJ82 ♣ A642. Cosa dichiari?", opts: ["Passo.", "Contro Informativo (Dbl).", "3SA.", "4♠."], correct: 1, hint: "Singolo a picche e 3 Assi.", expl: "Corretto! Contro Informativo." },
{ topic: "Difesa dai barrage", q: "Avversario apre 3♥. Tu hai ♠ KJ9752 ♥ 52 ♦ Q8 ♣ K64. Cosa dichiari?", opts: ["3♠.", "Passo.", "Dbl.", "3SA."], correct: 1, hint: "Mano minima (9 PO) e seme non solido per il livello 3.", expl: "Esatto! Meglio passare." },
{ topic: "Saggezza dei 1100", q: "Cosa significa se a fine anno non hai mai pagato 1100?", opts: ["Sei perfetto.", "Sei troppo timido e gli avversari dichiarano tranquilli.", "Conti troppo ottimisticamente.", "Mai carte lunghe."], correct: 1, hint: "Non stai mettendo abbastanza pressione.", expl: "Corretto! Troppa timidezza." }
];
let currentScore = 0;
function answerQuiz(qIdx, optIdx, btn) {
    const item = quizData[qIdx];
    const card = btn.closest('.quiz-card');
    const allBtns = card.querySelectorAll('.quiz-opt');
    const fb = document.getElementById('fb-' + qIdx);

    allBtns.forEach(function(b, i) {
        b.disabled = true;
        if (i === item.correct) {
            b.classList.add('correct');
        }
    });

    if (optIdx === item.correct) {
        currentScore++;
        fb.className = 'quiz-feedback show-ok';
        fb.textContent = item.expl;
    } else {
        btn.classList.add('wrong');
        fb.className = 'quiz-feedback show-err';
        fb.textContent = 'Risposta errata. ' + item.expl;
    }

    updateScore();
}


function renderQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    container.innerHTML = '';
    currentScore = 0;
    updateScore();

    quizData.forEach(function(item, idx) {
        const card = document.createElement('div');
        card.className = 'quiz-card';

        let optionsHTML = '';
        item.opts.forEach(function(opt, oIdx) {
            optionsHTML += '<button class="quiz-opt" onclick="answerQuiz(' + idx + ', ' + oIdx + ', this)">' + opt + '</button>';
        });

        card.innerHTML =
            '<div class="quiz-topic">' + (idx + 1) + '. ' + item.topic + '</div>' +
            '<div class="quiz-q">' + item.q + '</div>' +
            '<div class="quiz-options">' + optionsHTML + '</div>' +
            '<button class="quiz-hint-btn" onclick="this.nextElementSibling.style.display=\'block\'; this.style.display=\'none\';">💡 Mostra suggerimento</button>' +
            '<div class="quiz-hint-text">Suggerimento: ' + item.hint + '</div>' +
            '<div class="quiz-feedback" id="fb-' + idx + '"></div>';

        container.appendChild(card);
    });
}

function updateScore() {
    document.getElementById('score-main').textContent = 'Punteggio: ' + currentScore + ' / ' + quizData.length;
}

function resetQuiz() {
    renderQuiz();
    document.getElementById('quiz-completo').scrollIntoView({ behavior: 'smooth' });
}

renderQuiz();