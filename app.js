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