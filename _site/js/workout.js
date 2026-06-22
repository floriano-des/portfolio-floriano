(function () {
  'use strict';

  var STORAGE_KEY = 'floriano-workout-v2';

  var DAYS = [
    {
      id: 'seg',
      label: 'Seg',
      type: 'gym',
      day: 'Segunda',
      sub: 'Full Body A, empurrar + quadríceps',
      tip: '48h até o Sanda. Foca em força nos compostos. Leva cada série até 1 ou 2 reps na reserva.',
      core: [
        { name: 'Pallof press no cabo', sets: 3, reps: '12 cada lado', note: 'Anti-rotacional, transfere para o clinch', timer: 45, timed: false },
        { name: 'Prancha lateral', sets: 3, reps: '30s cada', timer: 30, timed: true },
        { name: 'Pescoço, flexão e extensão', sets: 2, reps: '15 cada', note: 'Com a mão ou faixa, leve', timer: 45, timed: false }
      ],
      main: [
        { name: 'Salto no caixote', sets: 3, reps: '5 rep', note: 'Opcional. Pula se estiver cansado', timer: 90, timed: false, badge: 'explosivo' },
        { name: 'Agachamento livre', sets: 4, reps: '5 rep', note: 'Carga alta, explosivo na subida', timer: 150, timed: false, badge: 'base' },
        { name: 'Supino reto com barra', sets: 4, reps: '5 rep', note: 'Desce controlado, sobe socando a barra', alt: 'Supino reto com halteres', timer: 120, timed: false, badge: 'explosivo' },
        { name: 'Remada curvada com barra', sets: 4, reps: '6 rep', note: 'Explosivo na puxada', alt: 'Remada cavalinho, T-bar, ou remada curvada com halteres', timer: 120, timed: false, badge: 'explosivo' },
        { name: 'Stiff, terra romeno', sets: 3, reps: '8 rep', note: 'Posterior leve, quadril articula', alt: 'Stiff com halteres', timer: 90, timed: false },
        { name: 'Desenvolvimento com halteres', sets: 3, reps: '8 rep', alt: 'Desenvolvimento com barra', timer: 90, timed: false }
      ]
    },
    {
      id: 'ter',
      label: 'Ter',
      type: 'rest',
      day: 'Terça',
      sub: 'Descanso, recupera para o Sanda',
      restText: 'Recupera para o Sanda. Mobilidade leve, caminhada e sono.'
    },
    {
      id: 'qua',
      label: 'Qua',
      type: 'sanda',
      day: 'Quarta',
      sub: 'Sanda',
      tip: 'Sem academia hoje. Foca em timing, footwork e sparring. O treino já é o esforço.'
    },
    {
      id: 'qui',
      label: 'Qui',
      type: 'gym',
      day: 'Quinta',
      sub: 'Full Body B, puxar + posterior',
      tip: 'Costas fortes geram socos mais rápidos e projeções mais potentes. Cuidado no terra se a perna estiver pesada do Sanda de ontem.',
      core: [
        { name: 'Lenhador no cabo', sets: 3, reps: '10 cada lado', note: 'Rotacional, transfere para chute e soco', timer: 45, timed: false },
        { name: 'Elevação de pernas nas paralelas', sets: 3, reps: '12 rep', note: 'Joelho dobrado se 12 estendido for difícil', timer: 60, timed: false },
        { name: 'Pescoço, lateral', sets: 2, reps: '15 cada', note: 'Com a mão ou faixa, leve', timer: 45, timed: false }
      ],
      main: [
        { name: 'Levantamento terra', sets: 4, reps: '5 rep', note: 'Força máxima. Técnica antes de carga', timer: 180, timed: false, badge: 'base' },
        { name: 'Puxada frontal', sets: 4, reps: '7 rep', note: 'Pega aberta, puxa até o peito', alt: 'Barra fixa', timer: 120, timed: false },
        { name: 'Supino inclinado com halteres', sets: 3, reps: '10 rep', alt: 'Supino inclinado com barra', timer: 90, timed: false },
        { name: 'Remada unilateral com halter', sets: 3, reps: '10 rep', note: 'Cuidado com a rotação do tronco', alt: 'Remada serrote no banco', timer: 90, timed: false },
        { name: 'Facepull', sets: 3, reps: '12 rep', note: 'Saúde do ombro, não pule', alt: 'Crucifixo invertido com halteres', timer: 60, timed: false },
        { name: 'Elevação lateral', sets: 3, reps: '12 rep', note: 'Leve, protege o ombro para luta', alt: 'Elevação lateral no cabo', timer: 60, timed: false }
      ]
    },
    {
      id: 'sex',
      label: 'Sex',
      type: 'sanda',
      day: 'Sexta',
      sub: 'Sanda',
      tip: 'Se a perna ainda estiver pesada do terra de ontem, avisa o professor. Melhor adaptar do que lesionar.'
    },
    { id: 'sab', label: 'Sáb', type: 'rest', day: 'Sábado', sub: 'Descanso' },
    { id: 'dom', label: 'Dom', type: 'rest', day: 'Domingo', sub: 'Descanso' }
  ];

  var state = {
    activeDay: getTodayId(),
    setsDone: {}
  };

  var timerInterval = null;
  var timerRemaining = 0;
  var timerTotal = 0;
  var timerPaused = false;
  var activeTimerKey = null;
  var wakeLock = null;

  var tabsEl = document.getElementById('workoutTabs');
  var contentEl = document.getElementById('workoutContent');
  var progressValueEl = document.getElementById('workoutProgressValue');
  var progressFillEl = document.getElementById('workoutProgressFill');
  var timerEl = document.getElementById('workoutTimer');
  var timerLabelEl = document.getElementById('workoutTimerLabel');
  var timerNameEl = document.getElementById('workoutTimerName');
  var timerDisplayEl = document.getElementById('workoutTimerDisplay');
  var timerFillEl = document.getElementById('workoutTimerFill');
  var pauseButtonEl = document.querySelector('[data-pause-timer]');

  function getTodayId() {
    return ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][new Date().getDay()];
  }

  function loadState() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (stored && typeof stored === 'object') {
        state.activeDay = stored.activeDay || state.activeDay;
        state.setsDone = stored.setsDone || {};
      }
    } catch (_) {
      state.setsDone = {};
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function getActiveDay() {
    return DAYS.find(function (day) { return day.id === state.activeDay; }) || DAYS[0];
  }

  function renderTabs() {
    var todayId = getTodayId();
    tabsEl.innerHTML = DAYS.map(function (day) {
      var classes = [
        'workout-tab',
        day.type === 'sanda' ? 'workout-tab--sanda' : '',
        day.id === state.activeDay ? 'is-active' : '',
        day.id === todayId ? 'is-today' : ''
      ].filter(Boolean).join(' ');

      return '<button class="' + classes + '" type="button" data-day="' + day.id + '">' + day.label + '</button>';
    }).join('');
  }

  function renderContent() {
    var day = getActiveDay();

    if (day.type === 'rest') {
      contentEl.innerHTML = [
        '<article class="workout-day">',
          renderDayHeader(day),
          '<div class="workout-state">',
            '<span class="workout-state__eyebrow">Recuperação</span>',
            '<h2 class="workout-state__title">Descanso ativo</h2>',
            '<p class="workout-state__text">' + (day.restText || 'Mobilidade leve, caminhada e sono. O músculo cresce fora da academia também.') + '</p>',
          '</div>',
        '</article>'
      ].join('');
      updateProgress(day);
      return;
    }

    if (day.type === 'sanda') {
      contentEl.innerHTML = [
        '<article class="workout-day">',
          renderDayHeader(day),
          '<div class="workout-state workout-state--sanda">',
            '<span class="workout-state__eyebrow">Luta</span>',
            '<h2 class="workout-state__title">Treino de Sanda</h2>',
            '<p class="workout-state__text">' + day.tip + '</p>',
          '</div>',
        '</article>'
      ].join('');
      updateProgress(day);
      return;
    }

    contentEl.innerHTML = [
      '<article class="workout-day">',
        renderDayHeader(day),
        renderSection(day, 'core', 'Preparação, core e pescoço'),
        renderSection(day, 'main', 'Treino principal'),
      '</article>'
    ].join('');

    updateProgress(day);
  }

  function renderDayHeader(day) {
    var tip = day.tip ? '<p class="workout-day__tip">' + day.tip + '</p>' : '';
    return [
      '<header class="workout-day__header">',
        '<h2 class="workout-day__title">' + day.day + '</h2>',
        '<p class="workout-day__subtitle">' + day.sub + '</p>',
        tip,
      '</header>'
    ].join('');
  }

  function renderSection(day, section, label) {
    return [
      '<section class="workout-section">',
        '<h3 class="workout-section__label">' + label + '</h3>',
        day[section].map(function (exercise, index) {
          return renderExercise(day.id, section, index, exercise);
        }).join(''),
      '</section>'
    ].join('');
  }

  function renderExercise(dayId, section, index, exercise) {
    var total = exercise.sets;
    var done = countDone(dayId, section, index, total);
    var complete = done === total;
    var key = dayId + '-' + section + '-' + index;
    var isRunning = activeTimerKey === key;
    var timerClass = isRunning ? 'is-running' : (complete ? 'is-finished' : '');
    var badge = getBadge(section, exercise, complete);
    var sets = '';

    for (var i = 0; i < total; i++) {
      var setKey = dayId + '-' + section + '-' + index + '-' + i;
      var isDone = Boolean(state.setsDone[setKey]);
      sets += '<button class="workout-set ' + (isDone ? 'is-done' : '') + '" type="button" data-set="' + setKey + '" aria-pressed="' + isDone + '">' + (isDone ? '✓' : i + 1) + '</button>';
    }

    return [
      '<article class="workout-card ' + (complete ? 'is-complete' : '') + '">',
        '<div class="workout-card__top">',
          '<div>',
            '<h4 class="workout-card__name">' + exercise.name + '</h4>',
            exercise.note ? '<p class="workout-card__note">' + exercise.note + '</p>' : '',
            exercise.alt ? '<p class="workout-card__alt">' + exercise.alt + '</p>' : '',
          '</div>',
          '<button class="workout-timer-button ' + timerClass + '" type="button" data-timer="' + key + '">',
            '<span class="workout-timer-button__time">' + formatTime(exercise.timer) + '</span>',
            '<span class="workout-timer-button__label">' + (exercise.timed ? 'iniciar' : 'descanso') + '</span>',
          '</button>',
        '</div>',
        '<div class="workout-card__bottom">',
          '<div class="workout-sets">',
            '<span class="workout-sets__info">' + exercise.sets + 'x ' + exercise.reps + '</span>',
            sets,
          '</div>',
          badge,
        '</div>',
      '</article>'
    ].join('');
  }

  function getBadge(section, exercise, complete) {
    if (exercise.badge === 'explosivo') {
      return '<span class="workout-badge workout-badge--orange">Explosivo</span>';
    }
    if (section === 'core') {
      return '<span class="workout-badge workout-badge--blue">Preparação</span>';
    }
    if (complete) {
      return '<span class="workout-badge workout-badge--green">Concluído</span>';
    }
    if (exercise.badge === 'base') {
      return '<span class="workout-badge workout-badge--orange">Base</span>';
    }
    return '';
  }

  function countDone(dayId, section, index, total) {
    var done = 0;
    for (var i = 0; i < total; i++) {
      if (state.setsDone[dayId + '-' + section + '-' + index + '-' + i]) done++;
    }
    return done;
  }

  function updateProgress(day) {
    var total = 0;
    var done = 0;

    if (day.type === 'gym') {
      ['core', 'main'].forEach(function (section) {
        day[section].forEach(function (exercise, index) {
          total += exercise.sets;
          done += countDone(day.id, section, index, exercise.sets);
        });
      });
    }

    var percentage = total ? Math.round((done / total) * 100) : 0;
    progressValueEl.textContent = percentage + '%';
    progressFillEl.style.width = percentage + '%';
  }

  function toggleSet(key) {
    state.setsDone[key] = !state.setsDone[key];
    if (!state.setsDone[key]) delete state.setsDone[key];
    saveState();
    renderContent();
  }

  function resetDay() {
    var prefix = state.activeDay + '-';
    Object.keys(state.setsDone).forEach(function (key) {
      if (key.indexOf(prefix) === 0) delete state.setsDone[key];
    });
    saveState();
    renderContent();
  }

  function selectDay(dayId) {
    state.activeDay = dayId;
    saveState();
    stopTimer();
    renderTabs();
    renderContent();
  }

  function getExerciseByTimerKey(key) {
    var parts = key.split('-');
    var day = DAYS.find(function (item) { return item.id === parts[0]; });
    if (!day || !day[parts[1]]) return null;
    return day[parts[1]][Number(parts[2])] || null;
  }

  function startTimer(key) {
    var exercise = getExerciseByTimerKey(key);
    if (!exercise) return;

    if (activeTimerKey === key && timerInterval) {
      stopTimer();
      return;
    }

    stopTimer();
    activeTimerKey = key;
    timerRemaining = exercise.timer;
    timerTotal = exercise.timer;
    timerPaused = false;

    timerLabelEl.textContent = exercise.timed ? 'Exercício' : 'Descanso';
    timerNameEl.textContent = exercise.name;
    pauseButtonEl.textContent = 'Pausar';
    timerEl.classList.add('is-visible');
    timerEl.setAttribute('aria-hidden', 'false');

    requestWakeLock();
    updateTimerDisplay();
    timerInterval = setInterval(tick, 1000);
    renderContent();
  }

  function tick() {
    if (timerPaused) return;
    timerRemaining -= 1;

    if (timerRemaining <= 0) {
      timerRemaining = 0;
      updateTimerDisplay();
      clearInterval(timerInterval);
      timerInterval = null;
      vibrate();
      setTimeout(function () {
        closeTimer();
        renderContent();
      }, 1500);
      return;
    }

    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    var minutes = Math.floor(timerRemaining / 60);
    var seconds = timerRemaining % 60;
    var progress = timerTotal ? (timerRemaining / timerTotal) * 100 : 0;
    timerDisplayEl.textContent = minutes + ':' + String(seconds).padStart(2, '0');
    timerFillEl.style.width = progress + '%';
  }

  function togglePause() {
    timerPaused = !timerPaused;
    pauseButtonEl.textContent = timerPaused ? 'Retomar' : 'Pausar';
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    closeTimer();
    renderContent();
  }

  function closeTimer() {
    activeTimerKey = null;
    timerPaused = false;
    timerEl.classList.remove('is-visible');
    timerEl.setAttribute('aria-hidden', 'true');
    releaseWakeLock();
  }

  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var rest = seconds % 60;
    if (minutes > 0) return minutes + ':' + String(rest).padStart(2, '0');
    return seconds + 's';
  }

  function vibrate() {
    if (navigator.vibrate) navigator.vibrate([250, 120, 250, 120, 400]);
  }

  function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    navigator.wakeLock.request('screen').then(function (lock) {
      wakeLock = lock;
    }).catch(function () {});
  }

  function releaseWakeLock() {
    if (!wakeLock) return;
    wakeLock.release().catch(function () {}).finally(function () {
      wakeLock = null;
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && activeTimerKey) requestWakeLock();
  });

  tabsEl.addEventListener('click', function (event) {
    var button = event.target.closest('[data-day]');
    if (button) selectDay(button.getAttribute('data-day'));
  });

  contentEl.addEventListener('click', function (event) {
    var setButton = event.target.closest('[data-set]');
    var timerButton = event.target.closest('[data-timer]');

    if (setButton) {
      toggleSet(setButton.getAttribute('data-set'));
      return;
    }

    if (timerButton) {
      startTimer(timerButton.getAttribute('data-timer'));
    }
  });

  document.querySelector('[data-reset-day]').addEventListener('click', resetDay);
  document.querySelector('[data-stop-timer]').addEventListener('click', stopTimer);
  pauseButtonEl.addEventListener('click', togglePause);

  loadState();
  renderTabs();
  renderContent();
}());
