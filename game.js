(() => {
  "use strict";

  const BUILD = "2026.11.02-thesis-instrument-v9-1-json";
  const pathCode = window.BB_PATH === "game-1" ? "game-1" : "game-2";
  const storyMode = window.BB_STORY === true;
  const screen = document.querySelector("#screen");
  const serveDock = document.querySelector("#serveDock");
  const embedded = window.parent !== window;
  if (embedded && document.body && document.body.classList) document.body.classList.add("embedded");
  const levelStat = document.querySelector("#levelStat");
  const progressLabel = document.querySelector("#progressLabel");
  const progressStat = document.querySelector("#progressStat");
  const bucksStat = document.querySelector("#bucksStat");
  const storageKey = `burger-borough-${BUILD}-${pathCode}`;
  const MAX_BOROUGH_BUCKS = 900;
  const BB_PER_SCHEDULED_ORDER = 20;
  const BB_PER_COMPLETED_LEVEL = 60;
  const BB_LATE_PENALTY = 5;
  const BB_INCORRECT_PENALTY = 2;
  const MAX_LEVEL_ERRORS = 4;
  const OWNER_ICON = "🧑‍🍳";
  const FIXED_REWARD = {
    id: "fixed-burger-fries-20",
    name: "20% off one burger-and-fries order",
    detail: "during a hypothetical in-person Burger Borough visit"
  };
  const TIMER_LIMITS = [10, 12, 14, 16, 18, 20];
  const PROGRESS_THRESHOLDS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 890];
  const EXPERIENCE_SCREENS = ["intro", "brief", "play", "complete", "level-failed"];
  const PROGRESSION_SCREENS = ["intro", "brief", "complete"];
  const PROGRESS_HEARTBEAT_MS = 10000;
  const CHAPTER_ENDINGS = [
    "The neighborhood takes notice.",
    "The lunch line begins to grow.",
    "The rumor loses its grip.",
    "Burger Borough earns local attention.",
    "The bakery becomes a neighborhood draw.",
    "Burger Borough completes its comeback."
  ];
  const NARRATIVE_MILESTONES = [
    "The first neighbors give Burger Borough another chance.",
    "Chef notices more customers visiting.",
    "Positive word of mouth begins spreading.",
    "The restaurant begins gaining local attention.",
    "Regular customers start returning.",
    "A busy lunch rush tests the kitchen.",
    "Burger Borough becomes a neighborhood contender.",
    "A local food critic plans a visit.",
    "The dining room stays busy through the afternoon.",
    "Burger Borough becomes a community favorite."
  ];

  const FOOD_DEFS = {
    burger: {
      name: "The Burger",
      short: "Burger",
      icon: "🍔",
      fields: {
        bun: ["Sesame bun", "Brioche bun", "Pretzel bun"],
        topping: ["Lettuce + tomato", "Pickles + onion", "Jalapeño slaw", "Crispy onions"],
        sauce: ["Borough sauce", "Smoky barbecue", "Garlic aioli", "Hot honey"]
      }
    },
    fries: {
      name: "The Fries",
      short: "Fries",
      icon: "🍟",
      fields: { style: ["Classic salted", "Cajun seasoned", "Garlic herb", "No-salt"] }
    },
    shake: {
      name: "The Milkshake",
      short: "Milkshake",
      icon: "🥤",
      fields: { flavor: ["Chocolate", "Vanilla", "Strawberry", "Cookies + cream"] }
    },
    chicken: {
      name: "The Spicy-Chicken Sandwich",
      short: "Spicy chicken",
      icon: "🥪",
      fields: {
        heat: ["Mild", "Hot", "Extra hot"],
        topping: ["Pickles", "Jalapeño slaw", "Lettuce + tomato"]
      }
    },
    bakery: {
      name: "Bakery",
      short: "Bakery item",
      icon: "🧁",
      fields: { item: ["Brownie", "Cake slice", "Pie slice", "Cheesecake slice"] },
      expandedFields: {
        item: [
          "Fudge brownie", "Salted-caramel brownie",
          "Vanilla cake slice", "Chocolate cake slice",
          "Apple pie slice", "Cherry pie slice",
          "Classic cheesecake slice", "Strawberry cheesecake slice"
        ]
      }
    },
    pizza: {
      name: "The Pizza",
      short: "Pizza",
      icon: "🍕",
      fields: {
        crust: ["Thin crust", "Hand-tossed", "Pan crust"],
        topping: ["Cheese", "Pepperoni", "Peppers + onion", "Spicy chicken"]
      }
    }
  };

  const FIELD_LABELS = {
    bun: "Bun",
    topping: "Topping",
    sauce: "Sauce",
    style: "Style",
    flavor: "Flavor",
    item: "Bakery item",
    heat: "Heat",
    crust: "Crust"
  };

  const CUSTOMERS = [
    { name: "Mateo", icon: "🧑🏽" }, { name: "Nia", icon: "👩🏾" },
    { name: "Avery", icon: "🧑🏻" }, { name: "Maya", icon: "👩🏻" },
    { name: "Theo", icon: "🧔🏽" }, { name: "Lena", icon: "👩🏾" },
    { name: "Sam", icon: "🧑🏼" }, { name: "Imani", icon: "👩🏿" },
    { name: "Luis", icon: "🧑🏽" }, { name: "Grace", icon: "👩🏼" },
    { name: "Noah", icon: "🧑🏿" }, { name: "Rina", icon: "👩🏽" },
    { name: "Owen", icon: "🧔🏻" }, { name: "June", icon: "👵🏽" }
  ];

  const repeatedOrders = (count, foods) => Array.from({ length: count }, () => foods.slice());
  const COMBOS = {
    1: repeatedOrders(3, ["burger"]),
    2: repeatedOrders(4, ["burger", "fries"]),
    3: repeatedOrders(4, ["burger", "fries", "shake"]),
    4: repeatedOrders(5, ["burger", "fries", "shake", "chicken"]),
    5: repeatedOrders(5, ["burger", "fries", "shake", "chicken", "bakery"]),
    6: repeatedOrders(6, ["burger", "fries", "shake", "chicken", "bakery", "pizza"])
  };

  const LEVEL_STORIES = [
    {
      title: "Bring Back the Lunch Crowd",
      challenge: "Pizza Pleasure Palace opened across the street and pulled away Burger Borough’s lunch traffic.",
      newFood: "burger",
      candidates: [
        { id: "mateo", name: "Mateo Ruiz", icon: "🧑🏽", bio: "A neighborhood photographer who knows the regular customers.", idea: "Feature real customer photos beside the burger.", callback: "Mateo’s customer-photo display gives the campaign a familiar neighborhood face." },
        { id: "nia", name: "Nia Johnson", icon: "👩🏾", bio: "A quick-thinking student with a talent for short videos.", idea: "Create a short video introducing the burger and lunch service.", callback: "Nia’s short video gives the campaign an energetic neighborhood introduction." }
      ],
      outcome: "More neighbors visit Burger Borough, and the lunch crowd begins to return."
    },
    {
      title: "Make Fries Worth the Trip",
      challenge: "The Palace advertises a cheap side. Chef needs the fries to stand out without starting a price war.",
      newFood: "fries",
      candidates: [
        { id: "carmen", name: "Carmen Lee", icon: "👩🏻", bio: "A campus-event planner who studies sampling campaigns.", idea: "Offer small seasoning samples and let customers vote.", callback: "Carmen’s seasoning vote invites customers to compare the new fry choices." },
        { id: "dev", name: "Dev Patel", icon: "🧑🏾", bio: "A menu planner who makes food combinations easy to understand.", idea: "Create a simple guide pairing each fry style with a burger.", callback: "Dev’s pairing guide helps customers choose a fry style with their burger." }
      ],
      outcome: "The new fry choices give customers another reason to visit Burger Borough."
    },
    {
      title: "Stop the Broken-Machine Rumor",
      challenge: "A rumor claims Burger Borough’s shake machine is broken. Chef needs visible proof that milkshakes are being served.",
      newFood: "shake",
      candidates: [
        { id: "maya", name: "Maya Torres", icon: "👩🏽", bio: "A local food creator known for live demonstrations.", idea: "Stream the first milkshake orders as they are made.", callback: "Maya’s live demonstration shows milkshakes leaving the counter." },
        { id: "eli", name: "Eli Brooks", icon: "🧑🏻", bio: "A menu writer who makes product details easy to recognize.", idea: "Publish a flavor spotlight showing the available milkshakes.", callback: "Eli’s flavor spotlight shows customers the available milkshake choices." }
      ],
      outcome: "The visible milkshake service answers the rumor and restores customer confidence."
    },
    {
      title: "Turn Up the Heat",
      challenge: "The Palace calls Chef’s new spicy-chicken sandwich ‘too hot to handle.’ Chef needs a campaign that reduces uncertainty.",
      newFood: "chicken",
      candidates: [
        { id: "theo", name: "Theo Grant", icon: "🧔🏽", bio: "A pop-up host who makes comparison menus easy to understand.", idea: "Show mild, hot, and extra-hot choices clearly.", callback: "Theo’s heat guide makes the three spice levels easy to compare." },
        { id: "zoe", name: "Zoe Kim", icon: "👩🏻", bio: "A designer who creates clear visual menu displays.", idea: "Create a tasting board explaining each heat level.", callback: "Zoe’s tasting board helps customers understand each heat level." }
      ],
      outcome: "Clear heat information turns uncertainty into confidence in the new sandwich."
    },
    {
      title: "Bring Back the Dessert Crowd",
      challenge: "Pizza Pleasure Palace launches a dessert promotion. Chef adds a bakery menu and needs a campaign that gives neighbors a reason to try it.",
      newFood: "bakery",
      candidates: [
        { id: "imani", name: "Imani Wells", icon: "👩🏿", bio: "A community-event planner who knows how to introduce new menu items.", idea: "Offer bakery samples and let neighbors vote for a favorite.", callback: "Imani’s bakery vote lets neighbors compare the new desserts." },
        { id: "owen", name: "Owen Price", icon: "🧔🏻", bio: "A food photographer who creates detailed menu displays.", idea: "Create a photo menu featuring every bakery choice.", callback: "Owen’s photo menu gives every bakery choice a clear introduction." }
      ],
      outcome: "The bakery introduction draws dessert customers back to Burger Borough."
    },
    {
      title: "Take Back the Block",
      challenge: "Burger Borough is stable again. Chef adds pizza so the restaurant can compete directly without copying the Palace.",
      newFood: "pizza",
      candidates: [
        { id: "lena", name: "Lena Okafor", icon: "👩🏾", bio: "A community organizer who builds collaborative launches.", idea: "Let neighbors name the first Borough pizza.", callback: "Lena’s naming activity makes the pizza launch feel community-built." },
        { id: "sam", name: "Sam Rivera", icon: "🧑🏼", bio: "A launch planner who creates clear product introductions.", idea: "Create a launch-day display featuring the pizza choices.", callback: "Sam’s launch display gives the pizza choices a clear neighborhood introduction." }
      ],
      outcome: "The pizza launch completes Burger Borough’s comeback and brings the neighborhood together."
    }
  ];

  const defaultState = () => ({
    level: 1,
    completedLevel: 0,
    screen: "intro",
    orderIndex: 0,
    selections: {},
    status: "",
    statusType: "info",
    levelScore: 0,
    totalScore: 0,
    startedAt: Date.now(),
    levelActiveSince: 0,
    orderActiveSince: 0,
    orderActiveSeconds: 0,
    orderDeadline: 0,
    orderRemaining: 0,
    orderLimit: 0,
    orderTimedOut: false,
    levelTimes: Array(6).fill(0),
    levelScores: Array(6).fill(0),
    levelErrors: Array(6).fill(0),
    levelTimeouts: Array(6).fill(0),
    levelFailures: Array(6).fill(0),
    restarts: Array(6).fill(0),
    currentRunErrors: 0,
    ordersServed: 0,
    scheduledOrdersCompleted: 0,
    ordersAttempted: 0,
    incorrectSubmissions: 0,
    timerExpirations: 0,
    totalOrderSeconds: 0,
    correctOrders: 0,
    streak: 0,
    bestStreak: 0,
    storyChoices: Array(6).fill(""),
    gameplayStarted: false,
    levelStartProgressStage: 0,
    pauseResumeScreen: "play",
    pauseStartedAt: 0,
    pausedSeconds: 0,
    pauseCount: 0,
    automaticPauseCount: 0,
    experienceSeconds: 0,
    progressionScreenSeconds: 0,
    trackedScreen: "intro",
    screenActiveSince: Date.now(),
    ticketCollapsed: false,
    endedEarly: false,
    exitReason: "",
    resumeScreen: "intro",
    exitReview: false,
    exitAttempts: 0,
    resumedAfterExit: false,
    resumeCount: 0,
    firstExitLevel: 0,
    firstExitOrder: 0,
    firstExitActiveSeconds: 0,
    finalized: false
  });

  function loadState() {
    if (new URLSearchParams(window.location.search).get("reset") === "1") {
      try { sessionStorage.removeItem(storageKey); } catch (_error) {}
    }
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey));
      if (saved && saved.pathCode === pathCode && !saved.finalized) {
        return { ...defaultState(), ...saved, pathCode };
      }
    } catch (_error) {}
    return { ...defaultState(), pathCode };
  }

  let state = loadState();
  let timerId = 0;
  let lastProgressPostAt = 0;
  let returnRetryTimer = 0;
  let readyRetryTimer = 0;
  let readyAttempts = 0;

  function sendReady() {
    if (!embedded) return;
    window.parent.postMessage({
      type: "burger-borough-ready",
      condition: pathCode,
      version: BUILD
    }, "*");
  }

  function stopReadyHandshake() {
    if (readyRetryTimer && typeof window.clearInterval === "function") window.clearInterval(readyRetryTimer);
    readyRetryTimer = 0;
  }

  function beginReadyHandshake() {
    if (!embedded) return;
    sendReady();
    readyRetryTimer = window.setInterval(() => {
      readyAttempts += 1;
      if (readyAttempts >= 15) {
        stopReadyHandshake();
        return;
      }
      sendReady();
    }, 1000);
  }

  function save() {
    try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch (_error) {}
  }

  function esc(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function hashText(text) {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function shuffled(values, seedText) {
    const result = values.slice();
    let seed = hashText(seedText) || 1;
    for (let index = result.length - 1; index > 0; index -= 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const swapIndex = seed % (index + 1);
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function currentStory() { return LEVEL_STORIES[state.level - 1]; }
  function levelCombos(level = state.level) { return COMBOS[level]; }

  function fieldsForFood(kind, levelNumber = state.level) {
    const definition = FOOD_DEFS[kind];
    if (kind === "bakery" && levelNumber >= 6) return definition.expandedFields;
    return definition.fields;
  }

  function getOrder(levelNumber, orderIndex) {
    const kinds = COMBOS[levelNumber][orderIndex];
    const items = kinds.map((kind, kindIndex) => {
      const definition = FOOD_DEFS[kind];
      const choices = {};
      Object.entries(fieldsForFood(kind, levelNumber)).forEach(([field, options], fieldIndex) => {
        const seed = hashText(`${BUILD}-${levelNumber}-${orderIndex}-${kind}-${kindIndex}-${field}-${fieldIndex}`);
        choices[field] = options[seed % options.length];
      });
      return { kind, choices };
    });
    return { id: `L${levelNumber}-O${orderIndex + 1}`, items };
  }

  function currentOrder() { return getOrder(state.level, state.orderIndex); }

  function customerFor(levelNumber, orderIndex) {
    return CUSTOMERS[((levelNumber - 1) * 5 + orderIndex) % CUSTOMERS.length];
  }

  function countRequiredChoices(order = currentOrder()) {
    return order.items.reduce((sum, item) => sum + Object.keys(item.choices).length, 0);
  }

  function timeLimitFor(order = currentOrder(), levelNumber = state.level) {
    return TIMER_LIMITS[Math.max(0, Math.min(5, levelNumber - 1))];
  }

  function grossBoroughBucks() {
    return Math.min(MAX_BOROUGH_BUCKS,
      state.scheduledOrdersCompleted * BB_PER_SCHEDULED_ORDER
      + state.completedLevel * BB_PER_COMPLETED_LEVEL);
  }

  function latePenalty() { return state.timerExpirations * BB_LATE_PENALTY; }
  function incorrectPenalty() { return state.incorrectSubmissions * BB_INCORRECT_PENALTY; }
  function totalBucksPenalty() { return latePenalty() + incorrectPenalty(); }

  function boroughBucks() {
    return Math.max(0, grossBoroughBucks() - totalBucksPenalty());
  }

  function progressStage() {
    const bucks = boroughBucks();
    return PROGRESS_THRESHOLDS.reduce((stage, threshold) => stage + (bucks >= threshold ? 1 : 0), 0);
  }

  function exposureLevel() {
    if (state.completedLevel >= 6) return "completed";
    if (state.ordersAttempted >= 1) return "exposed";
    if (state.gameplayStarted) return "minimal_exposure";
    return "not_started";
  }

  function trackedElapsed(now = Date.now()) {
    return state.screenActiveSince ? Math.max(0, (now - state.screenActiveSince) / 1000) : 0;
  }

  function commitTrackedScreenTime(now = Date.now()) {
    if (!state.screenActiveSince) return;
    const elapsed = trackedElapsed(now);
    if (EXPERIENCE_SCREENS.includes(state.trackedScreen)) state.experienceSeconds += elapsed;
    if (PROGRESSION_SCREENS.includes(state.trackedScreen)) state.progressionScreenSeconds += elapsed;
    state.screenActiveSince = 0;
  }

  function syncScreenTime() {
    const now = Date.now();
    if (state.trackedScreen !== state.screen) {
      commitTrackedScreenTime(now);
      state.trackedScreen = state.screen;
    }
    if (!document.hidden && EXPERIENCE_SCREENS.includes(state.screen) && !state.screenActiveSince) {
      state.screenActiveSince = now;
    }
  }

  function currentExperienceSeconds() {
    const live = !document.hidden && EXPERIENCE_SCREENS.includes(state.trackedScreen) ? trackedElapsed() : 0;
    return state.experienceSeconds + live;
  }

  function currentProgressionScreenSeconds() {
    const live = !document.hidden && PROGRESSION_SCREENS.includes(state.trackedScreen) ? trackedElapsed() : 0;
    return state.progressionScreenSeconds + live;
  }

  function updateHeader() {
    syncScreenTime();
    levelStat.textContent = String(Math.min(state.level, 6));
    progressLabel.textContent = "Progress";
    progressStat.textContent = `${progressStage()}/10`;
    bucksStat.textContent = boroughBucks().toLocaleString();
    const pauseButton = document.querySelector("#pauseButton");
    if (pauseButton) pauseButton.hidden = state.screen !== "play";
    if (serveDock && serveDock.dataset.screen !== state.screen) serveDock.hidden = true;
  }

  function formatTime(seconds) {
    const rounded = Math.max(0, Math.round(seconds));
    return `${String(Math.floor(rounded / 60)).padStart(2, "0")}:${String(rounded % 60).padStart(2, "0")}`;
  }

  function compact(values) { return values.map(value => Math.round(value)).join(","); }

  function totalPausedSeconds() {
    return state.pausedSeconds + (state.pauseStartedAt ? Math.max(0, (Date.now() - state.pauseStartedAt) / 1000) : 0);
  }

  function finishPauseTracking() {
    if (!state.pauseStartedAt) return;
    state.pausedSeconds += Math.max(0, (Date.now() - state.pauseStartedAt) / 1000);
    state.pauseStartedAt = 0;
  }

  function selectedKey(kind, field) { return `${kind}:${field}`; }

  function pauseActiveClocks() {
    const now = Date.now();
    if (state.levelActiveSince) {
      state.levelTimes[state.level - 1] += Math.max(0, (now - state.levelActiveSince) / 1000);
      state.levelActiveSince = 0;
    }
    if (state.orderActiveSince) {
      state.orderActiveSeconds += Math.max(0, (now - state.orderActiveSince) / 1000);
      state.orderActiveSince = 0;
    }
    if (state.orderDeadline) {
      state.orderRemaining = Math.max(0, (state.orderDeadline - now) / 1000);
      state.orderDeadline = 0;
    }
    clearInterval(timerId);
    timerId = 0;
    const shell = document.querySelector(".app-shell");
    if (shell) shell.classList.remove("timer-danger");
  }

  function beginPause(automatic = false) {
    if (state.screen !== "play") return;
    state.pauseResumeScreen = "play";
    pauseActiveClocks();
    state.pauseStartedAt = Date.now();
    if (automatic) state.automaticPauseCount += 1;
    else state.pauseCount += 1;
    state.screen = "paused";
    save();
    renderPause();
    postProgress();
  }

  function renderPause() {
    pauseActiveClocks();
    state.screen = "paused";
    screen.innerHTML = `<div class="pause-panel"><span class="pause-icon">⏸</span><p class="eyebrow">Gameplay paused</p><h1>Your order is safely paused.</h1><p>The customer ticket, kitchen options, and serving tray are hidden while the timer is stopped.</p><button class="primary" data-action="resume-pause">Resume Game</button>${exitButton()}</div>`;
    save();
    updateHeader();
  }

  function resumeFromPause() {
    finishPauseTracking();
    state.screen = state.pauseResumeScreen || "play";
    save();
    restoreScreen();
  }

  function resumeActiveClocks() {
    if (state.screen !== "play") return;
    const now = Date.now();
    if (!state.levelActiveSince) state.levelActiveSince = now;
    if (!state.orderActiveSince) state.orderActiveSince = now;
    if (!state.orderTimedOut && !state.orderDeadline && state.orderRemaining > 0) {
      state.orderDeadline = now + state.orderRemaining * 1000;
    }
    startTimerLoop();
  }

  function currentRemaining() {
    if (state.orderTimedOut) return 0;
    if (state.orderDeadline) return Math.max(0, (state.orderDeadline - Date.now()) / 1000);
    return Math.max(0, state.orderRemaining);
  }

  function startTimerLoop() {
    clearInterval(timerId);
    timerId = window.setInterval(updateTimerDisplay, 250);
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    if (state.screen !== "play") return;
    const remaining = currentRemaining();
    const timerText = document.querySelector("#timerText");
    const timerFill = document.querySelector("#timerFill");
    const dockTimer = document.querySelector("#dockTimer");
    const urgent = remaining > 0 && remaining <= 5;
    const shell = document.querySelector(".app-shell");
    if (shell) shell.classList.toggle("timer-danger", urgent);
    if (timerText) {
      timerText.textContent = remaining > 0 ? (urgent ? `⚠ ${Math.ceil(remaining)} sec` : `${Math.ceil(remaining)} sec`) : "Late";
      timerText.classList.toggle("timer-urgent", urgent);
    }
    if (dockTimer) {
      dockTimer.textContent = remaining > 0 ? `${Math.ceil(remaining)} sec` : "Late";
      dockTimer.classList.toggle("timer-urgent", urgent);
    }
    if (timerFill) {
      const percent = state.orderLimit ? Math.max(0, Math.min(100, (remaining / state.orderLimit) * 100)) : 0;
      timerFill.style.width = `${percent}%`;
      timerFill.classList.toggle("urgent", urgent);
      timerFill.classList.toggle("late", remaining <= 0);
    }
    if (remaining <= 0 && !state.orderTimedOut) {
      state.orderTimedOut = true;
      state.orderDeadline = 0;
      state.orderRemaining = 0;
      state.timerExpirations += 1;
      state.levelTimeouts[state.level - 1] += 1;
      state.streak = 0;
      state.status = `⚠️ The rush timer expired. You can still finish this order, but the late order costs ${BB_LATE_PENALTY} BB$.`;
      state.statusType = "error";
      const status = document.querySelector("#playStatus");
      if (status) {
        status.className = "status error";
        status.textContent = state.status;
      }
      const dockCopy = document.querySelector("#serveDockCopy");
      if (dockCopy) {
        dockCopy.className = "serve-dock-copy error";
        dockCopy.innerHTML = `<strong>Order is late · −${BB_LATE_PENALTY} BB$</strong><small>Finish and serve when ready.</small>`;
      }
      save();
      postProgress();
    }
    postProgress(false);
  }

  function exitButton() {
    if (state.completedLevel >= 6 || state.ordersAttempted < 1) return "";
    return `<button class="quiet" data-action="request-exit">I've played enough of Burger Borough to complete the survey</button>`;
  }

  function renderIntro() {
    pauseActiveClocks();
    state.screen = "intro";
    const hero = storyMode
      ? `<div class="hero story-hero"><div class="hero-character">${OWNER_ICON}</div><div><p class="eyebrow light">Chef needs your help</p><h1>Can Burger Borough survive?</h1><p>Pizza Pleasure Palace opened across the street. Help Chef serve the neighborhood and build Burger Borough’s comeback.</p></div></div>`
      : `<div class="hero story-hero"><div class="hero-character">📋</div><div><p class="eyebrow light">Restaurant activity</p><h1>Run the restaurant rush.</h1><p>Read each ticket, prepare the requested meal, and complete the restaurant levels while performance is recorded.</p></div></div>`;
    const studyNotice = "Burger Borough, Borough Bucks, and the reward offer are fictional.";
    screen.innerHTML = `${hero}
      <div class="how-to"><h2>How to play</h2><ol>
        <li>Read the customer’s order ticket.</li>
        <li>Tap one option in every required food category. Options move around between orders.</li>
        <li>Check your tray, then tap <strong>Serve Order</strong>. Incorrect submissions cost time and ${BB_INCORRECT_PENALTY} BB$; late orders cost ${BB_LATE_PENALTY} BB$.</li>
      </ol></div>
      <div class="possibilities"><strong>Fixed fictional study reward offer</strong><span>${esc(FIXED_REWARD.name)}</span><span>${esc(FIXED_REWARD.detail)}</span></div>
      <div class="notice"><strong>Study notice:</strong> ${studyNotice} The offer has no cash value and cannot actually be redeemed. Game progress, choices, actions, and time may be recorded. After submitting one complete tray, you may use the in-game stopping option and continue to the survey. You may withdraw from the study at any time by closing the survey.</div>
      <button class="primary" data-action="begin">Open Burger Borough</button>`;
    save();
    updateHeader();
  }

  function selectedCandidate() {
    const id = state.storyChoices[state.level - 1];
    return currentStory().candidates.find(person => person.id === id) || null;
  }

  function choiceMarkup(candidate, index, selected) {
    if (storyMode) {
      return `<button class="candidate ${selected ? "selected" : ""}" data-action="choose-plan" data-choice="${esc(candidate.id)}" aria-pressed="${selected ? "true" : "false"}"><span class="avatar">${candidate.icon}</span><strong>${esc(candidate.name)}</strong><small>${esc(candidate.bio)}</small><span class="idea"><b>Campaign idea:</b> ${esc(candidate.idea)}</span></button>`;
    }
    const newStation = FOOD_DEFS[currentStory().newFood].short;
    const planTitle = index === 0 ? "New-station focus" : "Full-menu focus";
    const planCopy = index === 0
      ? `Review the ${newStation} station before service begins.`
      : "Review all available food stations before service begins.";
    return `<button class="candidate neutral-plan ${selected ? "selected" : ""}" data-action="choose-plan" data-choice="${esc(candidate.id)}" aria-pressed="${selected ? "true" : "false"}"><span class="plan-number">Plan ${index + 1}</span><strong>${esc(planTitle)}</strong><small>${esc(planCopy)}</small><span class="idea">Select this option to continue.</span></button>`;
  }

  function renderBrief() {
    pauseActiveClocks();
    state.screen = "brief";
    const story = currentStory();
    const food = FOOD_DEFS[story.newFood];
    const candidate = selectedCandidate();
    const content = storyMode
      ? `<div class="scene-card brief-story"><div class="scene-characters"><span>${OWNER_ICON}</span>${candidate ? `<span>${candidate.icon}</span>` : ""}</div><div class="brief-story-copy"><p class="eyebrow">Chapter ${state.level}</p><h1>${esc(story.title)}</h1><p>${esc(story.challenge)}</p></div></div>`
      : `<div class="scene-card brief-story brief-story-neutral"><div class="scene-characters"><span>📋</span></div><div class="brief-story-copy"><p class="eyebrow">Restaurant Level ${state.level}</p><h1>Prepare the next set of orders.</h1><p>A new food station is available. Select one operational plan, then complete the level.</p></div></div>`;
    const choicePrompt = storyMode ? "Choose an employee" : "Select an operational plan";
    const menuExpansion = state.level === 6
      ? `<div class="unlock-card"><span>${FOOD_DEFS.bakery.icon}</span><div><small>Bakery menu expanded</small><strong>Eight dessert varieties now available</strong></div></div>`
      : "";
    screen.innerHTML = `<div class="brief-layout">${content}
      <div class="choice-heading"><h2>${choicePrompt}</h2></div>
      <div class="candidate-grid">${story.candidates.map((option, index) => choiceMarkup(option, index, candidate && candidate.id === option.id)).join("")}</div>
      <div class="unlock-card brief-unlock"><span>${food.icon}</span><div><small>New food station</small><strong>${esc(food.name)}</strong></div></div>
      ${menuExpansion}
      <button class="primary brief-start" data-action="start-level" ${candidate ? "" : "disabled"}>${candidate ? `Start Level ${state.level}` : storyMode ? "Choose an employee to continue" : "Choose a plan to continue"}</button>${exitButton()}</div>`;
    save();
    updateHeader();
  }

  function beginOrder() {
    state.selections = {};
    state.ticketCollapsed = false;
    state.status = "Select every item shown on the ticket, then serve the order.";
    state.statusType = "info";
    state.orderLimit = timeLimitFor();
    state.orderRemaining = state.orderLimit;
    state.orderDeadline = Date.now() + state.orderLimit * 1000;
    state.orderTimedOut = false;
    state.orderActiveSeconds = 0;
    state.orderActiveSince = Date.now();
    state.screen = "play";
  }

  function setupLevel() {
    state.levelStartProgressStage = progressStage();
    state.orderIndex = 0;
    state.levelScore = 0;
    state.currentRunErrors = 0;
    state.levelActiveSince = Date.now();
    beginOrder();
    save();
  }

  function queueMarkup() {
    const total = levelCombos().length;
    const visibleStart = Math.max(0, Math.min(state.orderIndex - 1, total - 6));
    const visibleEnd = Math.min(total, visibleStart + 6);
    const people = [];
    for (let index = visibleStart; index < visibleEnd; index += 1) {
      const current = index === state.orderIndex;
      const done = index < state.orderIndex;
      const customer = customerFor(state.level, index);
      const icon = storyMode ? customer.icon : "👤";
      const label = storyMode ? customer.name : `Order ${index + 1}`;
      people.push(`<span class="queue-person ${current ? "current" : ""} ${done ? "done" : ""}">${icon}<small>${esc(label)}</small></span>`);
    }
    return people.join("");
  }

  function ticketMarkup(order) {
    const customer = customerFor(state.level, state.orderIndex);
    const label = storyMode ? customer.name : `Customer order ${state.orderIndex + 1}`;
    const lines = order.items.map(item => {
      const details = Object.values(item.choices).join(" · ");
      return `<li><span>${FOOD_DEFS[item.kind].icon} ${esc(FOOD_DEFS[item.kind].name)}</span><span>${esc(details)}</span></li>`;
    }).join("");
    const collapsed = state.ticketCollapsed;
    return `<div id="currentTicket" tabindex="-1" class="ticket ${collapsed ? "collapsed" : ""} ${state.statusType === "error" ? "ticket-error" : ""}"><div class="ticket-head"><span>${esc(label)}</span><span class="ticket-meta"><span>${esc(order.id)}</span><button class="ticket-toggle" data-action="toggle-ticket" type="button" aria-expanded="${collapsed ? "false" : "true"}">${collapsed ? `Show ${order.items.length}-item order` : "Minimize order"}</button></span></div><ul class="ticket-items" ${collapsed ? "hidden" : ""}>${lines}</ul></div>`;
  }

  function optionsFor(kind, field, options) {
    const key = selectedKey(kind, field);
    const selected = state.selections[key] || "";
    const mixed = shuffled(options, `${BUILD}-${state.level}-${state.orderIndex}-${kind}-${field}`);
    return `<div class="option-group"><span class="option-label">${esc(FIELD_LABELS[field] || field)}</span><div class="options">${mixed.map(option => `<button class="option ${selected === option ? "selected" : ""}" data-kind="${esc(kind)}" data-field="${esc(field)}" data-value="${esc(option)}" aria-pressed="${selected === option ? "true" : "false"}">${esc(option)}</button>`).join("")}</div></div>`;
  }

  function stationMarkup(item) {
    const definition = FOOD_DEFS[item.kind];
    return `<section class="station"><div class="station-title"><h3>${esc(definition.name)} Station</h3><span>${definition.icon}</span></div>${Object.entries(fieldsForFood(item.kind)).map(([field, options]) => optionsFor(item.kind, field, options)).join("")}</section>`;
  }

  function trayMarkup(order) {
    const entries = [];
    order.items.forEach(item => {
      Object.keys(item.choices).forEach(field => {
        const value = state.selections[selectedKey(item.kind, field)];
        if (value) entries.push(`<span class="tray-item">${FOOD_DEFS[item.kind].icon} ${esc(FIELD_LABELS[field] || field)}: ${esc(value)}</span>`);
      });
    });
    return `<div class="tray"><h3>Your serving tray</h3><div class="tray-items">${entries.length ? entries.join("") : `<span class="tray-empty">Nothing selected yet.</span>`}</div></div>`;
  }

  function selectedChoiceCount(order) {
    return order.items.reduce((count, item) => count + Object.keys(item.choices).filter(field => state.selections[selectedKey(item.kind, field)]).length, 0);
  }

  function setActionDock(title, detail, buttonMarkup, screenName = state.screen, extraMarkup = "") {
    if (!serveDock) return;
    serveDock.dataset.screen = screenName;
    serveDock.innerHTML = `<div id="serveDockCopy" class="serve-dock-copy"><strong>${title}</strong><small>${detail}</small></div>${buttonMarkup}${extraMarkup ? `<div class="serve-dock-extra">${extraMarkup}</div>` : ""}`;
    serveDock.hidden = false;
  }

  function renderServeDock(order, remaining) {
    const selected = selectedChoiceCount(order);
    const required = countRequiredChoices(order);
    const ready = selected >= required;
    const hasError = state.statusType === "error";
    const title = hasError ? "Check the order" : `Tray ${selected}/${required}`;
    const detail = hasError
      ? `Review ticket · <span id="dockTimer" class="dock-timer">${remaining > 0 ? `${Math.ceil(remaining)} sec` : "Late"}</span>`
      : `<span id="dockTimer" class="dock-timer">${remaining > 0 ? `${Math.ceil(remaining)} sec` : "Late"}</span> remaining`;
    setActionDock(title, detail, `<button class="primary" data-action="serve-order" type="button" ${ready ? "" : "disabled"}>${ready ? "Serve Order" : `Select ${required - selected} More`}</button>`, "play");
    const dockCopy = document.querySelector("#serveDockCopy");
    if (dockCopy) dockCopy.classList.toggle("error", hasError);
  }

  function renderPlay() {
    state.screen = "play";
    resumeActiveClocks();
    const order = currentOrder();
    const total = levelCombos().length;
    const progress = Math.round((state.orderIndex / total) * 100);
    const customer = customerFor(state.level, state.orderIndex);
    const characterStrip = storyMode
      ? `<div class="character-strip"><span>${OWNER_ICON}</span><div><strong>Chef</strong><small>Read ${esc(customer.name)}’s ticket before building the meal.</small></div></div>`
      : `<div class="character-strip neutral"><span>📋</span><div><strong>Order preparation</strong><small>Read the ticket before building the meal.</small></div></div>`;
    const remaining = currentRemaining();
    screen.innerHTML = `<p class="eyebrow">Level ${state.level} · Order ${state.orderIndex + 1} of ${total}</p>
      <div class="play-summary"><div><small>Served this level</small><strong>${state.orderIndex}/${total}</strong></div><div><small>Borough Bucks</small><strong>BB$ ${boroughBucks()}</strong></div><div><small>Rush timer</small><strong id="timerText">${remaining > 0 ? `${Math.ceil(remaining)} sec` : "Late"}</strong></div><div><small>Mistakes this level</small><strong>${state.currentRunErrors}/${MAX_LEVEL_ERRORS}</strong></div></div>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      <div class="rush-track" aria-label="Time remaining"><div id="timerFill" class="rush-fill ${remaining <= 0 ? "late" : ""}" style="width:${state.orderLimit ? Math.max(0, Math.min(100, (remaining / state.orderLimit) * 100)) : 0}%"></div></div>
      ${characterStrip}
      <div class="counter-scene"><div class="queue-label">Customer counter · ${total - state.orderIndex} waiting</div><div class="customer-queue">${queueMarkup()}</div></div>
      ${ticketMarkup(order)}
      <div class="kitchen-heading"><h2>Kitchen stations</h2><span>Options are mixed for every order</span></div>
      ${order.items.map(stationMarkup).join("")}
      ${trayMarkup(order)}
      <div id="playStatus" class="status ${esc(state.statusType)}">${esc(state.status)}</div>
      <div class="play-secondary-controls"><details class="order-tools"><summary>More order options</summary><p>Use these only if you want to change your current progress. Restarting resets the current level and records a restart.</p><div class="button-row"><button class="secondary" data-action="clear-tray">Clear current tray</button><button class="secondary warning-action" data-action="restart-level">Restart current level</button></div></details>${exitButton()}</div>`;
    renderServeDock(order, remaining);
    startTimerLoop();
    save();
    updateHeader();
  }

  function validateSelections(order = currentOrder()) {
    let required = 0;
    let correct = 0;
    order.items.forEach(item => {
      Object.entries(item.choices).forEach(([field, expected]) => {
        required += 1;
        if (state.selections[selectedKey(item.kind, field)] === expected) correct += 1;
      });
    });
    return { required, correct, wrong: required - correct };
  }

  function recordOrderTime() {
    const now = Date.now();
    if (state.orderActiveSince) {
      state.orderActiveSeconds += Math.max(0, (now - state.orderActiveSince) / 1000);
      state.orderActiveSince = 0;
    }
    state.totalOrderSeconds += state.orderActiveSeconds;
  }

  function selectOption(kind, field, value) {
    state.selections[selectedKey(kind, field)] = value;
    state.status = "Tray updated. Compare every selection with the ticket before serving.";
    state.statusType = "info";
    save();
    renderPlay();
  }

  function wrongSubmission(validation) {
    state.incorrectSubmissions += 1;
    state.levelErrors[state.level - 1] += 1;
    state.currentRunErrors += 1;
    state.streak = 0;
    state.levelScore = Math.max(0, state.levelScore - 20);
    if (!state.orderTimedOut && state.orderDeadline) state.orderDeadline -= 5000;
    state.status = validation.correct === 0
      ? `❌ The tray does not match the ticket. Nothing was served. Five seconds and ${BB_INCORRECT_PENALTY} BB$ were deducted.`
      : `❌ ${validation.wrong} ticket selection${validation.wrong === 1 ? "" : "s"} still do not match. Five seconds and ${BB_INCORRECT_PENALTY} BB$ were deducted.`;
    state.statusType = "error";
    if (state.currentRunErrors >= MAX_LEVEL_ERRORS) {
      pauseActiveClocks();
      state.levelFailures[state.level - 1] += 1;
      state.screen = "level-failed";
      save();
      renderLevelFailed();
      return;
    }
    save();
    renderPlay();
    showErrorFeedback();
    postProgress();
  }

  function showErrorFeedback() {
    const shell = document.querySelector(".app-shell");
    const ticket = document.querySelector(".ticket");
    if (shell) shell.classList.add("error-flash");
    if (ticket) ticket.classList.add("error-shake");
    if (typeof window.setTimeout === "function") {
      window.setTimeout(() => {
        if (shell) shell.classList.remove("error-flash");
        if (ticket) ticket.classList.remove("error-shake");
      }, 650);
    }
  }

  function renderLevelFailed() {
    pauseActiveClocks();
    state.screen = "level-failed";
    const failures = state.levelFailures[state.level - 1];
    screen.innerHTML = `<div class="failure-hero" role="alert"><span class="failure-icon">🍔💥</span><p class="eyebrow light">Rush failed</p><h1>The kitchen was overwhelmed.</h1><p>This level reached ${MAX_LEVEL_ERRORS} incorrect serving attempts. Earlier completed levels, their Burger Borough Bucks, and the recorded study history remain saved.</p></div>
      <div class="metrics"><div><small>Current level</small><strong>${state.level}</strong></div><div><small>Orders completed</small><strong>${state.orderIndex}/${levelCombos().length}</strong></div><div><small>Level failures</small><strong>${failures}</strong></div></div>
      <div class="exit-decision-grid"><button class="exit-decision" data-action="retry-failed-level">Retry This Level</button><button class="exit-decision" data-action="finish-after-failure">Finish Gameplay and Continue to Survey</button></div>`;
    save();
    updateHeader();
    postProgress();
  }

  function advanceAfterServe() {
    state.orderIndex += 1;
    state.scheduledOrdersCompleted += 1;

    if (state.orderIndex >= levelCombos().length) {
      completeLevel();
      return;
    }
    beginOrder();
    save();
    renderPlay();
    postProgress();
  }

  function serveOrder() {
    const validation = validateSelections();
    state.ordersAttempted += 1;
    if (validation.wrong > 0) {
      wrongSubmission(validation);
      return;
    }
    const remaining = Math.floor(currentRemaining());
    recordOrderTime();
    state.ordersServed += 1;
    state.correctOrders += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const base = 100 + validation.required * 15;
    const speedBonus = state.orderTimedOut ? 0 : Math.max(0, remaining * 2);
    state.levelScore += base + speedBonus;
    state.status = speedBonus ? "Order served correctly. Fast service recorded." : "Order served correctly.";
    state.statusType = "success";
    advanceAfterServe();
  }

  function restartLevel() {
    pauseActiveClocks();
    state.restarts[state.level - 1] += 1;
    state.scheduledOrdersCompleted = Math.max(0, state.scheduledOrdersCompleted - state.orderIndex);
    setupLevel();
    state.status = "Level restarted. Earlier actions remain in the study log, but this level’s current progress was reset.";
    state.statusType = "info";
    renderPlay();
    postProgress();
  }

  function completeLevel() {
    pauseActiveClocks();
    const index = state.level - 1;
    state.levelScores[index] = state.levelScore;
    state.completedLevel = state.level;
    state.totalScore = state.levelScores.reduce((sum, value) => sum + value, 0);
    state.screen = "complete";
    save();
    postProgress();
    renderComplete();
  }

  function milestoneMarkup() {
    const start = Math.max(0, Number(state.levelStartProgressStage) || 0);
    const end = progressStage();
    if (end <= start) return "";
    const milestones = [];
    for (let stage = start + 1; stage <= end; stage += 1) {
      milestones.push(`<li><strong>Progress ${stage}/10</strong><span>${storyMode ? esc(NARRATIVE_MILESTONES[stage - 1]) : "Progress threshold reached."}</span></li>`);
    }
    return `<div class="milestone-card"><p class="eyebrow">Progress update</p><ul>${milestones.join("")}</ul></div>`;
  }

  function renderComplete() {
    pauseActiveClocks();
    state.screen = "complete";
    const story = currentStory();
    const candidate = selectedCandidate();
    const content = storyMode
      ? `<div class="scene-card"><div class="scene-characters"><span>${OWNER_ICON}</span><span>${candidate.icon}</span></div><p class="eyebrow">Chapter ${state.level} complete</p><h1>${esc(CHAPTER_ENDINGS[state.level - 1])}</h1><p>${esc(story.outcome)}</p></div>
         <div class="outcome-card"><span>📈</span><div><strong>Campaign update</strong><small>${esc(candidate.callback)}</small></div></div>`
      : `<div class="scene-card"><div class="scene-characters"><span>📋</span></div><p class="eyebrow">Level ${state.level} complete</p><h1>${levelCombos().length} customer orders completed</h1><p>Accuracy, service time, and Burger Borough Bucks have been recorded.</p></div>
         <div class="outcome-card neutral"><span>📈</span><div><strong>Plan selection recorded.</strong><small>Level performance and progress have been updated.</small></div></div>`;
    const nextAction = state.level < 6 ? "next-level" : "finish-game";
    const nextLabel = state.level < 6 ? `Continue to Level ${state.level + 1}` : "View Game Results";
    screen.innerHTML = `${content}${milestoneMarkup()}
      <div class="metrics"><div><small>Scheduled orders</small><strong>${levelCombos().length}</strong></div><div><small>Errors</small><strong>${state.levelErrors[state.level - 1]}</strong></div><div><small>Late orders</small><strong>${state.levelTimeouts[state.level - 1]}</strong></div><div><small>Active time</small><strong>${formatTime(state.levelTimes[state.level - 1])}</strong></div><div><small>Gross Borough Bucks</small><strong>BB$ ${grossBoroughBucks()}</strong></div><div><small>BB$ deductions</small><strong>−${totalBucksPenalty()}</strong></div><div><small>Final Borough Bucks</small><strong>BB$ ${boroughBucks()}</strong></div><div><small>Progress stage</small><strong>${progressStage()}/10</strong></div></div>
      ${exitButton()}`;
    setActionDock(`Level ${state.level} complete`, `Progress ${progressStage()}/10`, `<button class="primary" data-action="${nextAction}">${nextLabel}</button>`, "complete");
    save();
    updateHeader();
  }

  function renderExitConfirm() {
    pauseActiveClocks();
    state.screen = "exit-confirm";
    screen.innerHTML = `<p class="eyebrow">Gameplay paused</p><h1>Would you like to review your progress?</h1><p>Your exact game position has been saved. You can review your current results and reward status, then continue from where you stopped or finish gameplay and return to the survey.</p><div class="exit-decision-grid"><button class="exit-decision" data-action="resume">Keep Playing</button><button class="exit-decision" data-action="review-exit">Review Progress and Reward</button></div>`;
    save();
    updateHeader();
  }

  function totalActiveSeconds() { return state.levelTimes.reduce((sum, value) => sum + value, 0); }

  function beginExitAttempt() {
    if (state.ordersAttempted < 1) return;
    if (state.screen === "paused") {
      state.resumeScreen = state.pauseResumeScreen || "play";
      finishPauseTracking();
    } else {
      state.resumeScreen = state.screen;
    }
    pauseActiveClocks();
    state.exitAttempts += 1;
    if (state.firstExitLevel === 0) {
      state.firstExitLevel = state.level;
      state.firstExitOrder = Math.min(state.orderIndex + 1, levelCombos().length);
      state.firstExitActiveSeconds = Math.round(totalActiveSeconds());
    }
    state.exitReview = false;
    state.endedEarly = false;
    state.exitReason = "";
    renderExitConfirm();
    postProgress();
  }

  function resumeAfterExit() {
    const resume = state.resumeScreen || "brief";
    state.resumedAfterExit = true;
    state.resumeCount += 1;
    state.exitReview = false;
    state.endedEarly = false;
    state.exitReason = "";
    state.screen = resume;
    save();
    restoreScreen();
  }

  function beginExitReview() {
    state.exitReview = true;
    state.endedEarly = false;
    state.exitReason = "";
    save();
    renderResults();
  }

  function finishGameplayEarly() {
    state.exitReview = false;
    state.endedEarly = true;
    state.exitReason = `voluntary_level_${state.level}_order_${Math.min(state.orderIndex + 1, levelCombos().length)}`;
    save();
    renderContinue();
  }

  function finishAfterFailure() {
    pauseActiveClocks();
    state.exitAttempts += 1;
    if (state.firstExitLevel === 0) {
      state.firstExitLevel = state.level;
      state.firstExitOrder = Math.min(state.orderIndex + 1, levelCombos().length);
      state.firstExitActiveSeconds = Math.round(totalActiveSeconds());
    }
    state.exitReview = false;
    state.endedEarly = true;
    state.exitReason = `level_failure_level_${state.level}`;
    save();
    renderResults();
  }

  function accuracyPercent() {
    if (!state.ordersAttempted) return 0;
    return Math.round((state.correctOrders / state.ordersAttempted) * 100);
  }

  function renderResults() {
    pauseActiveClocks();
    state.screen = "results";
    save();
    postProgress();
    const totalRestarts = state.restarts.reduce((sum, value) => sum + value, 0);
    const average = state.correctOrders ? state.totalOrderSeconds / state.correctOrders : 0;
    const totalErrors = state.levelErrors.reduce((sum, value) => sum + value, 0);
    const storyResult = storyMode
      ? `<div class="results-hero"><span>${OWNER_ICON}</span><div><small>Chef’s restaurant progress</small><strong>${state.completedLevel >= 6 ? "Burger Borough completed its comeback." : state.completedLevel >= 5 ? "Burger Borough is stable again." : "Burger Borough’s comeback has begun."}</strong></div></div>`
      : `<div class="results-hero neutral"><span>📋</span><div><small>Restaurant activity summary</small><strong>Performance metrics were recorded across the completed gameplay.</strong></div></div>`;
    const statusLabel = state.exitReview ? "Gameplay paused" : state.endedEarly ? "Gameplay ended" : "Restaurant run complete";
    const resultsHeading = state.exitReview ? "Your Current Burger Borough Results" : "Your Burger Borough Results";
    const rewardButton = "View Fictional Reward Offer";
    screen.innerHTML = `<p class="eyebrow">${statusLabel}</p><h1>${resultsHeading}</h1>${storyResult}
      <div class="results-grid"><div><small>Levels completed</small><strong>${state.completedLevel}/6</strong></div><div><small>Scheduled orders</small><strong>${state.scheduledOrdersCompleted}/27</strong></div><div><small>Gross Borough Bucks</small><strong>BB$ ${grossBoroughBucks()}</strong></div><div><small>Late-order deductions</small><strong>−${latePenalty()} BB$</strong></div><div><small>Incorrect-order deductions</small><strong>−${incorrectPenalty()} BB$</strong></div><div><small>Final Borough Bucks</small><strong>BB$ ${boroughBucks()}</strong></div><div><small>Progress stage</small><strong>${progressStage()}/10</strong></div><div><small>Order accuracy</small><strong>${accuracyPercent()}%</strong></div><div><small>Incorrect serves</small><strong>${totalErrors}</strong></div><div><small>Best correct streak</small><strong>${state.bestStreak}</strong></div><div><small>Late orders</small><strong>${state.timerExpirations}</strong></div><div><small>Average order time</small><strong>${formatTime(average)}</strong></div><div><small>Active gameplay</small><strong>${formatTime(totalActiveSeconds())}</strong></div><div><small>Level restarts</small><strong>${totalRestarts}</strong></div></div>
      `;
    setActionDock(`${state.completedLevel}/6 levels completed`, `BB$ ${boroughBucks()} earned`, `<button class="primary" data-action="view-reward">${rewardButton}</button>`, "results");
    updateHeader();
  }

  function rewardPass() {
    return `<div class="reward-pass"><div class="pass-top"><span>BURGER BOROUGH</span><b>IN-STORE REWARD PASS</b></div><div class="pass-body"><small>FIXED FICTIONAL STUDY OFFER</small><h2>${esc(FIXED_REWARD.name)}</h2><p>${esc(FIXED_REWARD.detail)}. In-store redemption would be required.</p></div><div class="barcode" aria-hidden="true"></div><div class="pass-code">BB-STUDY-20</div><div class="pass-terms">FICTIONAL · RESEARCH ONLY · NO CASH VALUE · NOT REDEEMABLE</div></div>`;
  }

  function renderReward() {
    state.screen = "reward";
    const reviewingExit = state.exitReview && state.completedLevel < 6;
    const heading = "Your Fictional Reward Offer";
    const nextAction = reviewingExit
      ? `<h2>What would you like to do?</h2><div class="exit-decision-grid"><button class="exit-decision" data-action="resume-after-review">Keep Playing From Where I Stopped</button><button class="exit-decision" data-action="finish-early">Finish Gameplay and Continue to Survey</button></div><p class="decision-note">Gameplay data will not be finalized until you choose to continue to the survey.</p>`
      : "";
    screen.innerHTML = `<p class="eyebrow">Fixed study offer</p><h1>${heading}</h1>${rewardPass()}
      ${nextAction}
      <div class="notice">Burger Borough, Borough Bucks, and the displayed reward offer are fictional and were created only for this research experience.</div>`;
    if (!reviewingExit) setActionDock("Reward reviewed", "Continue when ready.", `<button class="primary" data-action="finish-reward">Continue to Survey</button>`, "reward");
    save();
    updateHeader();
  }

  function connectedToSurvey() { return window.parent !== window; }

  function renderContinue() {
    state.screen = "continue";
    const connected = connectedToSurvey();
    screen.innerHTML = `<p class="eyebrow">${connected ? "Ready to continue" : "Preview mode"}</p><h1>${connected ? "Return to the Survey" : "Preview Complete"}</h1><p>${connected ? "Your gameplay summary is ready to be transferred to the survey." : "This standalone preview is not connected to a Qualtrics response, so no study data has been sent."}</p><div id="returnMessage"></div>`;
    setActionDock(connected ? "Gameplay complete" : "Preview complete", connected ? "Your results are ready." : "No study data will be sent.", `<button class="primary" data-action="return-survey">${connected ? "Send Results and Continue to Survey" : "Finish Preview"}</button>`, "continue");
    updateHeader();
    save();
  }

  function resultPayload() {
    const choiceForExport = levelIndex => {
      const selected = state.storyChoices[levelIndex] || "";
      if (!selected) return "none";
      if (storyMode) return selected;
      const optionIndex = LEVEL_STORIES[levelIndex].candidates.findIndex(candidate => candidate.id === selected);
      return optionIndex >= 0 ? `plan-${optionIndex + 1}` : "none";
    };
    return {
      bb_condition: pathCode,
      bb_game_version: BUILD,
      bb_completed_level: String(state.completedLevel),
      bb_current_level: String(state.level),
      bb_current_order: String(Math.min(state.orderIndex + 1, levelCombos().length)),
      bb_total_score: String(state.totalScore),
      bb_bucks_earned: String(boroughBucks()),
      bb_gross_bucks: String(grossBoroughBucks()),
      bb_late_penalty: String(latePenalty()),
      bb_incorrect_penalty: String(incorrectPenalty()),
      bb_progress_stage: String(progressStage()),
      bb_reward_offer: FIXED_REWARD.id,
      bb_exposure_level: exposureLevel(),
      bb_ended_early: String(state.endedEarly),
      bb_exit_reason: state.exitReason || (state.completedLevel >= 6 ? "completed" : "in_progress"),
      bb_exit_attempts: String(state.exitAttempts),
      bb_resumed_after_exit: String(state.resumedAfterExit),
      bb_resume_count: String(state.resumeCount),
      bb_first_exit_level: String(state.firstExitLevel),
      bb_first_exit_order: String(state.firstExitOrder),
      bb_first_exit_active_seconds: String(state.firstExitActiveSeconds),
      bb_total_seconds: String(Math.round((Date.now() - state.startedAt) / 1000)),
      bb_active_seconds: String(Math.round(totalActiveSeconds())),
      bb_experience_seconds: String(Math.round(currentExperienceSeconds())),
      bb_progression_screen_seconds: String(Math.round(currentProgressionScreenSeconds())),
      bb_paused_seconds: String(Math.round(totalPausedSeconds())),
      bb_pause_count: String(state.pauseCount),
      bb_automatic_pause_count: String(state.automaticPauseCount),
      bb_level_times: compact(state.levelTimes),
      bb_level_scores: compact(state.levelScores),
      bb_level_errors: compact(state.levelErrors),
      bb_level_timeouts: compact(state.levelTimeouts),
      bb_level_failures: compact(state.levelFailures),
      bb_total_level_failures: String(state.levelFailures.reduce((sum, value) => sum + value, 0)),
      bb_restarts: compact(state.restarts),
      bb_orders_served: String(state.ordersServed),
      bb_scheduled_orders_completed: String(state.scheduledOrdersCompleted),
      bb_orders_attempted: String(state.ordersAttempted),
      bb_incorrect_submissions: String(state.incorrectSubmissions),
      bb_timer_expirations: String(state.timerExpirations),
      bb_accuracy_percent: String(accuracyPercent()),
      bb_average_order_seconds: String(state.correctOrders ? Math.round(state.totalOrderSeconds / state.correctOrders) : 0),
      bb_best_streak: String(state.bestStreak),
      bb_level1_choice: choiceForExport(0),
      bb_level2_choice: choiceForExport(1),
      bb_level3_choice: choiceForExport(2),
      bb_level4_choice: choiceForExport(3),
      bb_level5_choice: choiceForExport(4),
      bb_level6_choice: choiceForExport(5),
      bb_story_choices: storyMode ? state.storyChoices.map(value => value || "none").join("|") : "not-applicable"
    };
  }

  function postProgress(force = true) {
    if (window.parent === window) return;
    const now = Date.now();
    if (!force && now - lastProgressPostAt < PROGRESS_HEARTBEAT_MS) return;
    lastProgressPostAt = now;
    window.parent.postMessage({ type: "burger-borough-progress", payload: resultPayload() }, "*");
  }

  function sendCompleteResults() {
    if (window.parent === window) return false;
    window.parent.postMessage({ type: "burger-borough-complete", payload: resultPayload() }, "*");
    return true;
  }

  function showReturnRetry() {
    if (state.finalized) return;
    const message = document.querySelector("#returnMessage");
    if (message) message.innerHTML = `<div class="notice error"><strong>The survey has not confirmed receipt yet.</strong> Keep this page open and try the transfer again.</div><button class="primary return-retry" data-action="retry-return" type="button">Try Returning to the Survey Again</button>`;
  }

  function returnToSurvey() {
    const embedded = connectedToSurvey();
    state.finalized = false;
    save();
    if (embedded) sendCompleteResults();
    const message = document.querySelector("#returnMessage");
    if (message) message.innerHTML = embedded
      ? `<div class="notice info"><strong>Sending results…</strong> Please keep this page open while Burger Borough returns you to the survey.</div>`
      : `<div class="notice success"><strong>Preview finished.</strong> No data was sent to Qualtrics.</div>`;
    if (returnRetryTimer && typeof window.clearTimeout === "function") window.clearTimeout(returnRetryTimer);
    if (embedded) returnRetryTimer = window.setTimeout(showReturnRetry, 4000);
  }

  function restoreScreen() {
    if (state.screen === "brief") renderBrief();
    else if (state.screen === "play") renderPlay();
    else if (state.screen === "paused") renderPause();
    else if (state.screen === "complete") renderComplete();
    else if (state.screen === "level-failed") renderLevelFailed();
    else if (state.screen === "results") renderResults();
    else if (state.screen === "reward") renderReward();
    else if (state.screen === "continue") renderContinue();
    else renderIntro();
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "begin") {
      renderBrief();
    } else if (action === "choose-plan") {
      const choice = button.dataset.choice || "";
      if (currentStory().candidates.some(candidate => candidate.id === choice)) {
        state.storyChoices[state.level - 1] = choice;
        save();
        renderBrief();
      }
    } else if (action === "start-level") {
      if (selectedCandidate()) {
        state.gameplayStarted = true;
        setupLevel();
        renderPlay();
      }
    } else if (action === "pause") {
      beginPause(false);
    } else if (action === "resume-pause") {
      resumeFromPause();
    } else if (action === "toggle-ticket") {
      state.ticketCollapsed = !state.ticketCollapsed;
      save();
      renderPlay();
    } else if (button.dataset.kind && button.dataset.field && button.dataset.value) {
      selectOption(button.dataset.kind, button.dataset.field, button.dataset.value);
    } else if (action === "clear-tray") {
      state.selections = {};
      state.status = "Tray cleared. Rebuild it from the ticket.";
      state.statusType = "info";
      renderPlay();
    } else if (action === "serve-order") {
      serveOrder();
    } else if (action === "restart-level") {
      restartLevel();
    } else if (action === "retry-failed-level") {
      restartLevel();
    } else if (action === "finish-after-failure") {
      finishAfterFailure();
    } else if (action === "next-level") {
      state.level += 1;
      state.orderIndex = 0;
      state.selections = {};
      state.screen = "brief";
      renderBrief();
    } else if (action === "finish-game") {
      state.exitReview = false;
      state.endedEarly = false;
      state.exitReason = "completed";
      renderResults();
    } else if (action === "request-exit") {
      beginExitAttempt();
    } else if (action === "resume") {
      resumeAfterExit();
    } else if (action === "review-exit") {
      beginExitReview();
    } else if (action === "resume-after-review") {
      resumeAfterExit();
    } else if (action === "finish-early") {
      finishGameplayEarly();
    } else if (action === "view-reward") {
      renderReward();
    } else if (action === "finish-reward") {
      renderContinue();
    } else if (action === "return-survey") {
      returnToSurvey();
    } else if (action === "retry-return") {
      returnToSurvey();
    }
    updateHeader();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      commitTrackedScreenTime();
      if (state.screen === "play") beginPause(true);
    } else {
      syncScreenTime();
    }
    save();
  });

  window.addEventListener("pagehide", () => {
    stopReadyHandshake();
    commitTrackedScreenTime();
    pauseActiveClocks();
    save();
  });

  window.addEventListener("message", event => {
    if (event.source !== window.parent || !event.data) return;
    if (event.data.type === "burger-borough-ping") {
      sendReady();
    } else if (event.data.type === "burger-borough-parent-ready") {
      stopReadyHandshake();
    } else if (event.data.type === "burger-borough-received") {
      state.finalized = true;
      if (returnRetryTimer && typeof window.clearTimeout === "function") window.clearTimeout(returnRetryTimer);
      returnRetryTimer = 0;
      save();
      const message = document.querySelector("#returnMessage");
      if (message) message.innerHTML = `<div class="notice success"><strong>Results received.</strong> Returning to the survey… If the survey does not advance, use Continue to Survey below.</div><button class="primary return-retry" data-action="retry-return" type="button">Continue to Survey</button>`;
    } else if (event.data.type === "burger-borough-error") {
      state.finalized = false;
      if (returnRetryTimer && typeof window.clearTimeout === "function") window.clearTimeout(returnRetryTimer);
      returnRetryTimer = 0;
      save();
      showReturnRetry();
    }
  });

  window.__BB_TEST__ = {
    BUILD,
    pathCode,
    storyMode,
    COMBOS,
    FOOD_DEFS,
    getOrder,
    timeLimitFor,
    validateSelections,
    grossBoroughBucks,
    latePenalty,
    incorrectPenalty,
    boroughBucks,
    progressStage,
    exposureLevel,
    resultPayload,
    getState: () => JSON.parse(JSON.stringify(state))
  };

  restoreScreen();
  beginReadyHandshake();
})();
