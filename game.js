(() => {
  "use strict";

  const BUILD = "2026.10.26-tap-kitchen-v4";
  const pathCode = window.BB_PATH === "game-1" ? "game-1" : "game-2";
  const storyMode = window.BB_STORY === true;
  const screen = document.querySelector("#screen");
  const levelStat = document.querySelector("#levelStat");
  const scoreStat = document.querySelector("#scoreStat");
  const storageKey = `burger-borough-${BUILD}-${pathCode}`;

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
    icecream: {
      name: "The Ice Cream",
      short: "Ice cream",
      icon: "🍦",
      fields: { flavor: ["Vanilla cup", "Chocolate cup", "Swirl cone", "Strawberry cup"] }
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

  const COMBOS = {
    1: [
      ["burger"], ["burger"], ["burger"], ["burger"]
    ],
    2: [
      ["burger", "fries"], ["burger"], ["fries"],
      ["burger", "fries"], ["burger"], ["burger", "fries"]
    ],
    3: [
      ["burger", "fries"], ["shake"], ["burger", "shake"], ["fries"],
      ["burger", "fries", "shake"], ["burger"], ["fries", "shake"], ["burger", "shake"]
    ],
    4: [
      ["burger", "fries"], ["chicken"], ["shake"], ["burger", "chicken"],
      ["fries", "shake"], ["chicken", "fries"], ["burger", "fries", "shake"],
      ["chicken", "shake"], ["burger"], ["burger", "chicken", "fries"]
    ],
    5: [
      ["burger", "fries"], ["chicken", "shake"], ["icecream"], ["burger", "shake"],
      ["fries", "icecream"], ["chicken", "fries", "shake"], ["burger", "icecream"],
      ["chicken"], ["burger", "fries", "shake"], ["icecream", "shake"],
      ["chicken", "fries"], ["burger", "chicken", "icecream"]
    ],
    6: [
      ["pizza"], ["burger", "fries"], ["pizza", "shake"], ["chicken"],
      ["burger", "icecream"], ["pizza", "fries"], ["shake"], ["chicken", "fries"],
      ["pizza", "icecream"], ["burger", "shake"], ["pizza", "chicken"],
      ["burger", "fries", "shake"], ["pizza", "fries", "icecream"], ["burger", "pizza", "chicken"]
    ]
  };

  const LEVEL_STORIES = [
    {
      title: "Bring Back the Lunch Crowd",
      challenge: "Pizza Pleasure Palace opened across the street and pulled away Burger Borough’s lunch traffic.",
      newFood: "burger",
      candidates: [
        { id: "mateo", name: "Mateo Ruiz", icon: "🧑🏽", bio: "A neighborhood photographer who knows the regular customers.", idea: "Feature real customer photos beside the burger.", fit: true },
        { id: "nia", name: "Nia Johnson", icon: "👩🏾", bio: "A quick-thinking student with a talent for short videos.", idea: "Post a timed speed challenge featuring the burger.", fit: false }
      ],
      win: "The neighborhood-photo campaign feels personal. Burger Borough’s lunch line grows longer than the Palace’s opening-day line.",
      mixed: "The speed video attracts attention, but the Palace answers with its own stunt. Burger Borough gains customers without pulling clearly ahead."
    },
    {
      title: "Make Fries Worth the Trip",
      challenge: "The Palace advertises a cheap side. Bea needs the fries to stand out without starting a price war.",
      newFood: "fries",
      candidates: [
        { id: "carmen", name: "Carmen Lee", icon: "👩🏻", bio: "A campus-event planner who studies sampling campaigns.", idea: "Offer tiny seasoning samples and let customers vote.", fit: true },
        { id: "dev", name: "Dev Patel", icon: "🧑🏾", bio: "A spreadsheet expert who focuses on discounts.", idea: "Match every Palace price for one week.", fit: false }
      ],
      win: "The seasoning vote creates repeat visits without cutting the menu price. Burger Borough beats the Palace on side-item interest.",
      mixed: "Price matching fills the counter, but margins tighten and the Palace lowers its price again. Traffic improves without a durable advantage."
    },
    {
      title: "Stop the Broken-Machine Rumor",
      challenge: "A rumor claims Burger Borough’s shake machine is broken. Bea needs visible proof that milkshakes are being served.",
      newFood: "shake",
      candidates: [
        { id: "maya", name: "Maya Torres", icon: "👩🏽", bio: "A local food creator known for live demonstrations.", idea: "Stream the first milkshake orders as they are made.", fit: true },
        { id: "eli", name: "Eli Brooks", icon: "🧑🏻", bio: "A copywriter who favors clever mystery campaigns.", idea: "Post a teaser that says something cold is coming.", fit: false }
      ],
      win: "The live orders disprove the rumor immediately. Shake mentions for Burger Borough pass those for Pizza Pleasure Palace.",
      mixed: "The teaser earns curiosity but does not fully answer the rumor. Shake orders rise after customers see drinks leaving the counter."
    },
    {
      title: "Turn Up the Heat",
      challenge: "The Palace calls Bea’s new spicy-chicken sandwich ‘too hot to handle.’ Bea needs a campaign that reduces uncertainty.",
      newFood: "chicken",
      candidates: [
        { id: "theo", name: "Theo Grant", icon: "🧔🏽", bio: "A pop-up host who makes comparison menus easy to understand.", idea: "Show mild, hot, and extra-hot choices clearly.", fit: true },
        { id: "zoe", name: "Zoe Kim", icon: "👩🏻", bio: "A designer who likes bold competitive messages.", idea: "Call the Palace afraid of real spice.", fit: false }
      ],
      win: "Clear heat choices turn concern into confidence. Spicy-chicken orders outpace the Palace’s featured slice.",
      mixed: "The competitive message draws clicks but also arguments. Customers still try the sandwich after staff explain the heat levels."
    },
    {
      title: "Win Back an Angry Customer",
      challenge: "A rush-order mistake reaches an upset customer. Bea must recover trust without giving away an unlimited replacement.",
      newFood: "icecream",
      candidates: [
        { id: "imani", name: "Imani Wells", icon: "👩🏿", bio: "A service coach who tracks recovery costs.", idea: "Promote a capped complimentary ice-cream recovery.", fit: true },
        { id: "owen", name: "Owen Price", icon: "🧔🏻", bio: "A loyalty promoter who favors broad guarantees.", idea: "Promise any menu item whenever a customer complains.", fit: false }
      ],
      win: "The specific recovery promise rebuilds trust and limits the loss. Burger Borough’s service rating moves ahead of the Palace.",
      mixed: "The broad promise sounds generous, but customers select the most expensive eligible items. Trust improves while costs climb."
    },
    {
      title: "Take Back the Block",
      challenge: "Burger Borough is stable again. Bea adds pizza so the restaurant can compete directly without copying the Palace.",
      newFood: "pizza",
      candidates: [
        { id: "lena", name: "Lena Okafor", icon: "👩🏾", bio: "A community organizer who builds collaborative launches.", idea: "Let neighbors name the first Borough pizza.", fit: true },
        { id: "sam", name: "Sam Rivera", icon: "🧑🏼", bio: "An ad buyer who favors head-to-head comparisons.", idea: "Run an attack ad against the Palace’s pizza.", fit: false }
      ],
      win: "The neighborhood names the pizza and claims the launch as its own. Burger Borough wins the block’s final service challenge.",
      mixed: "The attack ad creates attention, but the community launch does the real work. Burger Borough finishes the rush with a narrow lead."
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
    restarts: Array(6).fill(0),
    ordersServed: 0,
    scheduledOrdersCompleted: 0,
    ordersAttempted: 0,
    incorrectSubmissions: 0,
    timerExpirations: 0,
    complaintRemakes: 0,
    complaintTriggered: false,
    complaintRemake: false,
    totalOrderSeconds: 0,
    correctOrders: 0,
    streak: 0,
    bestStreak: 0,
    storyChoices: Array(6).fill(""),
    campaignResults: Array(6).fill(""),
    recoveryChoice: "",
    rewardChoice: "",
    endedEarly: false,
    exitReason: "",
    resumeScreen: "intro",
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

  function getOrder(levelNumber, orderIndex) {
    const kinds = COMBOS[levelNumber][orderIndex];
    const items = kinds.map((kind, kindIndex) => {
      const definition = FOOD_DEFS[kind];
      const choices = {};
      Object.entries(definition.fields).forEach(([field, options], fieldIndex) => {
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

  function timeLimitFor(order = currentOrder()) {
    return Math.max(34, 28 + countRequiredChoices(order) * 5 - Math.min(4, state.level - 1));
  }

  function rewardForLevel(level = state.completedLevel) {
    if (level >= 5) return { id: "combo", name: "Discount toward a burger, fries, and a milkshake or ice cream" };
    if (level >= 4) return { id: "burger-fries", name: "Discount toward a burger and fries" };
    if (level >= 3) return { id: "fries", name: "Discount toward fries" };
    return { id: "none", name: "No food discount unlocked" };
  }

  function visibleScore() {
    const activeLevelScore = state.screen === "play" || state.screen === "complaint"
      || (state.screen === "exit-confirm" && state.resumeScreen === "play");
    return state.totalScore + (activeLevelScore ? state.levelScore : 0);
  }

  function updateHeader() {
    levelStat.textContent = String(Math.min(state.level, 6));
    scoreStat.textContent = visibleScore().toLocaleString();
  }

  function formatTime(seconds) {
    const rounded = Math.max(0, Math.round(seconds));
    return `${String(Math.floor(rounded / 60)).padStart(2, "0")}:${String(rounded % 60).padStart(2, "0")}`;
  }

  function compact(values) { return values.map(value => Math.round(value)).join(","); }

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
    if (timerText) timerText.textContent = remaining > 0 ? `${Math.ceil(remaining)} sec` : "Late";
    if (timerFill) {
      const percent = state.orderLimit ? Math.max(0, Math.min(100, (remaining / state.orderLimit) * 100)) : 0;
      timerFill.style.width = `${percent}%`;
      timerFill.classList.toggle("late", remaining <= 0);
    }
    if (remaining <= 0 && !state.orderTimedOut) {
      state.orderTimedOut = true;
      state.orderDeadline = 0;
      state.orderRemaining = 0;
      state.timerExpirations += 1;
      state.levelTimeouts[state.level - 1] += 1;
      state.streak = 0;
      state.status = "The rush timer expired. You can still finish this order, but the speed bonus is gone.";
      state.statusType = "error";
      const status = document.querySelector("#playStatus");
      if (status) {
        status.className = "status error";
        status.textContent = state.status;
      }
      save();
    }
  }

  function exitButton() {
    return `<button class="quiet" data-action="request-exit">I've played enough of Burger Borough to complete the survey</button>`;
  }

  function renderIntro() {
    pauseActiveClocks();
    state.screen = "intro";
    const hero = storyMode
      ? `<div class="hero story-hero"><div class="hero-character">👩🏽‍🍳</div><div><p class="eyebrow light">Chef Bea needs your help</p><h1>Can Burger Borough survive?</h1><p>Pizza Pleasure Palace opened across the street. Help Bea serve the neighborhood, choose new team members, and build Burger Borough’s comeback.</p></div></div>`
      : `<div class="hero"><p class="eyebrow light">Burger Borough</p><h1>Run the restaurant rush.</h1><p>Read each ticket, prepare the requested meal, and serve the order before the rush timer runs out.</p></div>`;
    screen.innerHTML = `${hero}
      <div class="how-to"><h2>How to play</h2><ol>
        <li>Read the customer’s order ticket.</li>
        <li>Tap one option in every required food category. Options move around between orders.</li>
        <li>Check your tray, then tap <strong>Serve Order</strong>. Incorrect meals cost time and points.</li>
      </ol></div>
      <div class="possibilities"><strong>Possible fictional study rewards</strong><span>Food discount</span><span>Multi-item discount</span><span>In-store reward pass</span></div>
      <div class="notice"><strong>Study notice:</strong> Burger Borough, its competitor, Borough Bucks, and all food discounts are fictional. Rewards have no cash value and cannot actually be redeemed. Game progress, choices, actions, and time may be recorded. You may stop and continue to the survey at any time.</div>
      <button class="primary" data-action="begin">Open Burger Borough</button>`;
    save();
    updateHeader();
  }

  function selectedCandidate() {
    const id = state.storyChoices[state.level - 1];
    return currentStory().candidates.find(candidate => candidate.id === id) || null;
  }

  function renderBrief() {
    pauseActiveClocks();
    state.screen = "brief";
    const story = currentStory();
    const food = FOOD_DEFS[story.newFood];
    const candidate = selectedCandidate();
    if (storyMode && !candidate) {
      screen.innerHTML = `<div class="scene-card"><div class="scene-characters"><span>👩🏽‍🍳</span><span>🏪</span></div><p class="eyebrow">Chapter ${state.level}</p><h1>${esc(story.title)}</h1><p>${esc(story.challenge)}</p></div>
        <div class="unlock-card"><span>${food.icon}</span><div><small>New food for this chapter</small><strong>${esc(food.name)}</strong></div></div>
        <h2>Who should Bea hire?</h2><p>Choose the candidate whose marketing idea best addresses this chapter’s problem. Your choice will shape the campaign outcome.</p>
        <div class="candidate-grid">${story.candidates.map(person => `<button class="candidate" data-hire="${esc(person.id)}"><span class="avatar">${person.icon}</span><strong>${esc(person.name)}</strong><small>${esc(person.bio)}</small><span class="idea"><b>Marketing idea:</b> ${esc(person.idea)}</span></button>`).join("")}</div>
        ${exitButton()}`;
    } else {
      const content = storyMode
        ? `<div class="scene-card"><div class="scene-characters"><span>👩🏽‍🍳</span><span>${candidate.icon}</span></div><p class="eyebrow">Chapter ${state.level}</p><h1>${esc(story.title)}</h1><p><strong>${esc(candidate.name)}</strong> joins Bea’s team. The campaign will use this idea: ${esc(candidate.idea)}</p></div>`
        : `<div class="level-card"><p class="eyebrow">Restaurant Level ${state.level}</p><h1>${levelCombos().length} customer orders</h1><p>A new food station is available. Orders use the same ticket-and-tray controls while the menu becomes more complex.</p></div>`;
      screen.innerHTML = `${content}
        <div class="unlock-card"><span>${food.icon}</span><div><small>Food station available</small><strong>${esc(food.name)}</strong></div></div>
        <div class="metrics"><div><small>Customers</small><strong>${levelCombos().length}</strong></div><div><small>New station</small><strong>${food.icon}</strong></div><div><small>Level</small><strong>${state.level}/6</strong></div></div>
        <button class="primary" data-action="start-level">Start Level ${state.level}</button>${exitButton()}`;
    }
    save();
    updateHeader();
  }

  function beginOrder() {
    state.selections = {};
    state.status = state.complaintRemake
      ? "Rebuild the corrected order and serve it again."
      : "Select every item shown on the ticket, then serve the order.";
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
    state.orderIndex = 0;
    state.levelScore = 0;
    state.complaintTriggered = false;
    state.complaintRemake = false;
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
    const correction = state.complaintRemake ? `<span class="complaint-badge">CORRECTED ORDER</span>` : "";
    const lines = order.items.map(item => {
      const details = Object.values(item.choices).join(" · ");
      return `<li><span>${FOOD_DEFS[item.kind].icon} ${esc(FOOD_DEFS[item.kind].name)}</span><span>${esc(details)}</span></li>`;
    }).join("");
    return `<div class="ticket ${state.complaintRemake ? "complaint" : ""}">${correction}<div class="ticket-head"><span>${esc(label)}</span><span>${esc(order.id)}</span></div><ul class="ticket-items">${lines}</ul></div>`;
  }

  function optionsFor(kind, field, options) {
    const key = selectedKey(kind, field);
    const selected = state.selections[key] || "";
    const mixed = shuffled(options, `${BUILD}-${state.level}-${state.orderIndex}-${kind}-${field}-${state.complaintRemake ? "r" : "n"}`);
    return `<div class="option-group"><span class="option-label">${esc(FIELD_LABELS[field] || field)}</span><div class="options">${mixed.map(option => `<button class="option ${selected === option ? "selected" : ""}" data-kind="${esc(kind)}" data-field="${esc(field)}" data-value="${esc(option)}" aria-pressed="${selected === option ? "true" : "false"}">${esc(option)}</button>`).join("")}</div></div>`;
  }

  function stationMarkup(item) {
    const definition = FOOD_DEFS[item.kind];
    return `<section class="station"><div class="station-title"><h3>${esc(definition.name)} Station</h3><span>${definition.icon}</span></div>${Object.entries(definition.fields).map(([field, options]) => optionsFor(item.kind, field, options)).join("")}</section>`;
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

  function renderPlay() {
    state.screen = "play";
    resumeActiveClocks();
    const order = currentOrder();
    const total = levelCombos().length;
    const progress = Math.round((state.orderIndex / total) * 100);
    const customer = customerFor(state.level, state.orderIndex);
    const characterStrip = storyMode
      ? `<div class="character-strip"><span>👩🏽‍🍳</span><div><strong>Chef Bea</strong><small>${state.complaintRemake ? `Let’s correct ${esc(customer.name)}’s order carefully.` : `Read ${esc(customer.name)}’s ticket before building the meal.`}</small></div></div>`
      : "";
    const remaining = currentRemaining();
    screen.innerHTML = `<p class="eyebrow">Level ${state.level} · ${state.complaintRemake ? "Correction" : `Order ${state.orderIndex + 1} of ${total}`}</p>
      <div class="play-summary"><div><small>Served this level</small><strong>${state.orderIndex}/${total}</strong></div><div><small>Level score</small><strong>${state.levelScore}</strong></div><div><small>Rush timer</small><strong id="timerText">${remaining > 0 ? `${Math.ceil(remaining)} sec` : "Late"}</strong></div></div>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      <div class="rush-track" aria-label="Time remaining"><div id="timerFill" class="rush-fill ${remaining <= 0 ? "late" : ""}" style="width:${state.orderLimit ? Math.max(0, Math.min(100, (remaining / state.orderLimit) * 100)) : 0}%"></div></div>
      ${characterStrip}
      <div class="counter-scene"><div class="queue-label">Customer counter · ${total - state.orderIndex} waiting</div><div class="customer-queue">${queueMarkup()}</div></div>
      ${ticketMarkup(order)}
      <div class="kitchen-heading"><h2>Kitchen stations</h2><span>Options are mixed for every order</span></div>
      ${order.items.map(stationMarkup).join("")}
      ${trayMarkup(order)}
      <div id="playStatus" class="status ${esc(state.statusType)}">${esc(state.status)}</div>
      <button class="primary" data-action="serve-order">Serve Order</button>
      <div class="button-row"><button class="secondary" data-action="clear-tray">Clear tray</button><button class="secondary" data-action="restart-level">Restart level</button></div>
      ${exitButton()}`;
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
    state.streak = 0;
    state.levelScore = Math.max(0, state.levelScore - 20);
    if (!state.orderTimedOut && state.orderDeadline) state.orderDeadline -= 5000;
    state.status = validation.correct === 0
      ? "The tray does not match the ticket yet. Nothing was served. Review every category."
      : `${validation.wrong} ticket selection${validation.wrong === 1 ? "" : "s"} still do not match. The customer is waiting and 5 seconds were deducted.`;
    state.statusType = "error";
    save();
    renderPlay();
  }

  function triggerComplaint() {
    pauseActiveClocks();
    state.complaintTriggered = true;
    state.complaintRemake = true;
    state.screen = "complaint";
    save();
    renderComplaint();
  }

  function advanceAfterServe() {
    if (state.complaintRemake) {
      state.complaintRemake = false;
      state.complaintRemakes += 1;
      state.orderIndex += 1;
      state.scheduledOrdersCompleted += 1;
    } else if (state.level === 5 && state.orderIndex === 5 && !state.complaintTriggered) {
      triggerComplaint();
      return;
    } else {
      state.orderIndex += 1;
      state.scheduledOrdersCompleted += 1;
    }

    if (state.orderIndex >= levelCombos().length) {
      completeLevel();
      return;
    }
    beginOrder();
    save();
    renderPlay();
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
    state.status = `Order served correctly: +${base}${speedBonus ? ` and +${speedBonus} speed bonus` : ""}.`;
    state.statusType = "success";
    advanceAfterServe();
  }

  function renderComplaint() {
    pauseActiveClocks();
    state.screen = "complaint";
    const customer = customerFor(5, 5);
    if (storyMode && !state.recoveryChoice) {
      screen.innerHTML = `<div class="scene-card complaint"><div class="scene-characters"><span>${customer.icon}</span><span>👩🏽‍🍳</span></div><p class="eyebrow">Customer recovery</p><h1>${esc(customer.name)}’s order needs to be remade.</h1><p>The meal must be prepared again either way. Bea also needs a recovery policy that protects trust and controls the restaurant’s cost.</p></div>
        <h2>Which policy should Bea use?</h2>
        <div class="choice-list">
          <button class="choice" data-recovery="promise"><strong>Neighbor Promise</strong><small>Let the customer choose any menu item as compensation. Eligible items cost Burger Borough as much as 9 Borough Bucks.</small></button>
          <button class="choice" data-recovery="icecream"><strong>Complimentary Ice Cream</strong><small>Offer one cone or cup. The profit loss is capped at 2 Borough Bucks.</small></button>
        </div>${exitButton()}`;
    } else {
      const narrative = storyMode
        ? `<div class="scene-card complaint"><div class="scene-characters"><span>${customer.icon}</span><span>👩🏽‍🍳</span></div><p class="eyebrow">Customer recovery</p><h1>Remake the original order.</h1><p>Bea records your recovery-policy decision. First, the kitchen must prepare the same ticket correctly.</p></div>`
        : `<div class="level-card complaint"><span class="complaint-badge">ORDER CORRECTION</span><h1>Remake the original order.</h1><p>A customer reported a problem. Complete the same ticket again as an additional restaurant service task.</p></div>`;
      screen.innerHTML = `${narrative}<button class="primary" data-action="start-remake">Open Correction Ticket</button>${exitButton()}`;
    }
    save();
    updateHeader();
  }

  function startRemake() {
    state.levelActiveSince = Date.now();
    beginOrder();
    renderPlay();
  }

  function restartLevel() {
    pauseActiveClocks();
    state.restarts[state.level - 1] += 1;
    state.scheduledOrdersCompleted = Math.max(0, state.scheduledOrdersCompleted - state.orderIndex);
    setupLevel();
    state.status = "Level restarted. Earlier actions remain in the study log, but this level’s score and progress were reset.";
    state.statusType = "info";
    renderPlay();
  }

  function campaignResult() {
    if (!storyMode) return "none";
    const candidate = selectedCandidate();
    const result = candidate && candidate.fit ? "strong-fit" : "mixed-fit";
    state.campaignResults[state.level - 1] = result;
    return result;
  }

  function completeLevel() {
    pauseActiveClocks();
    const index = state.level - 1;
    state.levelScores[index] = state.levelScore;
    state.completedLevel = state.level;
    state.totalScore = state.levelScores.reduce((sum, value) => sum + value, 0);
    campaignResult();
    state.screen = "complete";
    save();
    postProgress();
    renderComplete();
  }

  function recoveryOutcomeMarkup() {
    if (!storyMode || state.level !== 5) return "";
    if (state.recoveryChoice === "promise") {
      return `<div class="panel complaint"><p class="eyebrow">Recovery-policy result</p><h2>The unlimited promise cost more.</h2><p>Customers consistently selected the highest-priced eligible item. The typical loss reached <strong>9 Borough Bucks</strong>, compared with the capped ice-cream loss.</p><div class="cost-compare"><div><small>Neighbor Promise</small><strong>9 BB</strong></div><div><small>Ice-cream cap</small><strong>2 BB</strong></div></div></div>`;
    }
    return `<div class="panel"><p class="eyebrow">Recovery-policy result</p><h2>The specific recovery protected the margin.</h2><p>The complimentary cone or cup rebuilt trust while limiting the profit loss to <strong>2 Borough Bucks</strong>.</p><div class="cost-compare"><div><small>Ice-cream cap</small><strong>2 BB</strong></div><div><small>Any-item maximum</small><strong>9 BB</strong></div></div></div>`;
  }

  function renderComplete() {
    pauseActiveClocks();
    state.screen = "complete";
    const story = currentStory();
    const candidate = selectedCandidate();
    const reward = rewardForLevel();
    const priorReward = rewardForLevel(state.level - 1);
    const rewardMarkup = reward.id !== priorReward.id
      ? `<div class="unlock-card"><span>🎟️</span><div><small>Fictional study reward unlocked</small><strong>${esc(reward.name)}</strong></div></div>`
      : "";
    const result = state.campaignResults[state.level - 1];
    const content = storyMode
      ? `<div class="scene-card"><div class="scene-characters"><span>👩🏽‍🍳</span><span>${candidate.icon}</span></div><p class="eyebrow">Chapter ${state.level} complete</p><h1>${state.level === 6 ? "Burger Borough wins the block’s final rush." : "The comeback continues."}</h1><p>${esc(result === "strong-fit" ? story.win : story.mixed)}</p></div>
         <div class="campaign-card"><span>${result === "strong-fit" ? "📈" : "↗️"}</span><div><strong>${result === "strong-fit" ? "Campaign outperformed Pizza Pleasure Palace" : "Campaign gained ground on Pizza Pleasure Palace"}</strong><small>${esc(candidate.name)}’s marketing idea shaped this result. Food-game points were based only on order accuracy and speed.</small></div></div>`
      : `<div class="level-card"><p class="eyebrow">Level ${state.level} complete</p><h1>${levelCombos().length} customer orders completed</h1><p>The restaurant recorded your order accuracy, service time, and level score. The next level expands the menu.</p></div>`;
    const next = state.level < 6
      ? `<button class="primary" data-action="next-level">Continue</button>`
      : `<button class="primary" data-action="finish-game">View Game Results</button>`;
    screen.innerHTML = `${content}${recoveryOutcomeMarkup()}${rewardMarkup}
      <div class="metrics"><div><small>Level score</small><strong>${state.levelScores[state.level - 1]}</strong></div><div><small>Errors</small><strong>${state.levelErrors[state.level - 1]}</strong></div><div><small>Late orders</small><strong>${state.levelTimeouts[state.level - 1]}</strong></div><div><small>Active time</small><strong>${formatTime(state.levelTimes[state.level - 1])}</strong></div></div>
      ${next}${exitButton()}`;
    save();
    updateHeader();
  }

  function renderExitConfirm() {
    pauseActiveClocks();
    state.screen = "exit-confirm";
    screen.innerHTML = `<p class="eyebrow">End gameplay?</p><h1>You can return to the survey now.</h1><p>Your completed levels, current progress, score, order accuracy, errors, choices, and gameplay time will be included in the result.</p><div class="button-row"><button class="secondary" data-action="resume">Keep Playing</button><button class="primary" data-action="confirm-exit">End Gameplay</button></div>`;
    save();
  }

  function totalActiveSeconds() { return state.levelTimes.reduce((sum, value) => sum + value, 0); }

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
    const storyResult = storyMode
      ? `<div class="results-hero"><span>👩🏽‍🍳</span><div><small>Chef Bea’s progress</small><strong>${state.completedLevel >= 6 ? "Burger Borough completed its comeback." : state.completedLevel >= 5 ? "Burger Borough is stable again." : "Burger Borough’s comeback has begun."}</strong></div></div>`
      : "";
    screen.innerHTML = `<p class="eyebrow">${state.endedEarly ? "Gameplay ended" : "Restaurant run complete"}</p><h1>Your Burger Borough Results</h1>${storyResult}
      <div class="results-grid"><div><small>Levels completed</small><strong>${state.completedLevel}/6</strong></div><div><small>Scheduled orders</small><strong>${state.scheduledOrdersCompleted}/54</strong></div><div><small>Total score</small><strong>${state.totalScore}</strong></div><div><small>Order accuracy</small><strong>${accuracyPercent()}%</strong></div><div><small>Best correct streak</small><strong>${state.bestStreak}</strong></div><div><small>Late orders</small><strong>${state.timerExpirations}</strong></div><div><small>Average order time</small><strong>${formatTime(average)}</strong></div><div><small>Active gameplay</small><strong>${formatTime(totalActiveSeconds())}</strong></div><div><small>Correction remakes</small><strong>${state.complaintRemakes}</strong></div><div><small>Level restarts</small><strong>${totalRestarts}</strong></div></div>
      <button class="primary" data-action="view-reward">View Earned Reward</button>`;
    updateHeader();
  }

  function rewardPass(reward) {
    if (reward.id === "none") return `<div class="reward-pass locked"><h2>No food discount unlocked</h2><p>Additional gameplay would be required to unlock a fictional study reward.</p></div>`;
    return `<div class="reward-pass"><div class="pass-top"><span>BURGER BOROUGH</span><b>IN-STORE REWARD PASS</b></div><div class="pass-body"><small>STUDY OFFER</small><h2>${esc(reward.name)}</h2><p>In-store redemption would be required.</p></div><div class="barcode" aria-hidden="true"></div><div class="pass-code">BB-${reward.id.toUpperCase()}-${String(state.totalScore).padStart(5, "0")}</div><div class="pass-terms">FICTIONAL · RESEARCH ONLY · NO CASH VALUE · NOT REDEEMABLE</div></div>`;
  }

  function renderReward() {
    state.screen = "reward";
    const reward = rewardForLevel();
    screen.innerHTML = `<p class="eyebrow">Earned reward</p><h1>${reward.id === "none" ? "No reward was unlocked." : "Your Fictional Reward Pass"}</h1>${rewardPass(reward)}
      ${reward.id === "none" ? `<button class="primary" data-reward="none">Continue</button>` : `<h2>What would you do with this fictional reward?</h2><div class="choice-list"><button class="choice" data-reward="redeem"><strong>Redeem it</strong><small>Use it during an in-person Burger Borough visit.</small></button><button class="choice" data-reward="save"><strong>Save it</strong><small>Keep it for a future in-person visit.</small></button><button class="choice" data-reward="decline"><strong>Do not use it</strong><small>Continue without redeeming the reward.</small></button></div>`}
      <div class="notice">Burger Borough, Pizza Pleasure Palace, Borough Bucks, and all displayed rewards are fictional and were created only for this research experience.</div>`;
    save();
  }

  function connectedToSurvey() { return window.parent !== window; }

  function renderContinue() {
    state.screen = "continue";
    const connected = connectedToSurvey();
    screen.innerHTML = `<p class="eyebrow">${connected ? "Ready to continue" : "Preview mode"}</p><h1>${connected ? "Return to the Survey" : "Preview Complete"}</h1><p>${connected ? "Your gameplay summary is ready to be transferred to the survey." : "This standalone preview is not connected to a Qualtrics response, so no study data has been sent."}</p><button class="primary" data-action="return-survey">${connected ? "Send Results and Continue to Survey" : "Finish Preview"}</button><div id="returnMessage"></div>`;
    save();
  }

  function resultPayload() {
    return {
      bb_condition: pathCode,
      bb_game_version: BUILD,
      bb_completed_level: String(state.completedLevel),
      bb_current_level: String(state.level),
      bb_current_order: String(Math.min(state.orderIndex + 1, levelCombos().length)),
      bb_total_score: String(state.totalScore),
      bb_reward_tier: rewardForLevel().id,
      bb_reward_choice: state.rewardChoice || "none",
      bb_ended_early: String(state.endedEarly),
      bb_exit_reason: state.exitReason || "completed",
      bb_total_seconds: String(Math.round((Date.now() - state.startedAt) / 1000)),
      bb_active_seconds: String(Math.round(totalActiveSeconds())),
      bb_level_times: compact(state.levelTimes),
      bb_level_scores: compact(state.levelScores),
      bb_level_errors: compact(state.levelErrors),
      bb_level_timeouts: compact(state.levelTimeouts),
      bb_restarts: compact(state.restarts),
      bb_orders_served: String(state.ordersServed),
      bb_scheduled_orders_completed: String(state.scheduledOrdersCompleted),
      bb_orders_attempted: String(state.ordersAttempted),
      bb_incorrect_submissions: String(state.incorrectSubmissions),
      bb_timer_expirations: String(state.timerExpirations),
      bb_accuracy_percent: String(accuracyPercent()),
      bb_average_order_seconds: String(state.correctOrders ? Math.round(state.totalOrderSeconds / state.correctOrders) : 0),
      bb_best_streak: String(state.bestStreak),
      bb_complaint_remakes: String(state.complaintRemakes),
      bb_story_choices: storyMode ? state.storyChoices.map(value => value || "none").join("|") : "not-applicable",
      bb_campaign_results: storyMode ? state.campaignResults.map(value => value || "none").join("|") : "not-applicable",
      bb_recovery_choice: storyMode ? (state.recoveryChoice || "none") : "not-applicable"
    };
  }

  function postProgress() {
    if (window.parent !== window) window.parent.postMessage({ type: "burger-borough-progress", payload: resultPayload() }, "*");
  }

  function returnToSurvey() {
    const payload = resultPayload();
    const embedded = connectedToSurvey();
    if (embedded) window.parent.postMessage({ type: "burger-borough-complete", payload }, "*");
    const message = document.querySelector("#returnMessage");
    if (message) message.innerHTML = embedded
      ? `<div class="notice info"><strong>Sending results…</strong> Please keep this page open while Burger Borough returns you to the survey.</div>`
      : `<div class="notice success"><strong>Preview finished.</strong> No data was sent to Qualtrics.</div>`;
  }

  function restoreScreen() {
    if (state.screen === "brief") renderBrief();
    else if (state.screen === "play") renderPlay();
    else if (state.screen === "complaint") renderComplaint();
    else if (state.screen === "complete") renderComplete();
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
    } else if (button.dataset.hire) {
      state.storyChoices[state.level - 1] = button.dataset.hire;
      save();
      renderBrief();
    } else if (action === "start-level") {
      setupLevel();
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
    } else if (button.dataset.recovery) {
      state.recoveryChoice = button.dataset.recovery;
      save();
      renderComplaint();
    } else if (action === "start-remake") {
      startRemake();
    } else if (action === "restart-level") {
      restartLevel();
    } else if (action === "next-level") {
      state.level += 1;
      state.screen = "brief";
      renderBrief();
    } else if (action === "finish-game") {
      renderResults();
    } else if (action === "request-exit") {
      state.resumeScreen = state.screen;
      renderExitConfirm();
    } else if (action === "resume") {
      const resume = state.resumeScreen || "brief";
      state.screen = resume;
      if (resume === "play") resumeActiveClocks();
      restoreScreen();
    } else if (action === "confirm-exit") {
      state.endedEarly = true;
      state.exitReason = `voluntary_level_${state.level}_order_${Math.min(state.orderIndex + 1, levelCombos().length)}`;
      renderResults();
    } else if (action === "view-reward") {
      renderReward();
    } else if (button.dataset.reward) {
      state.rewardChoice = button.dataset.reward;
      renderContinue();
    } else if (action === "return-survey") {
      returnToSurvey();
    }
    updateHeader();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseActiveClocks();
    else resumeActiveClocks();
    save();
  });

  window.addEventListener("pagehide", () => { pauseActiveClocks(); save(); });

  window.addEventListener("message", event => {
    if (event.source !== window.parent || !event.data) return;
    if (event.data.type === "burger-borough-received") {
      state.finalized = true;
      save();
      const message = document.querySelector("#returnMessage");
      if (message) message.innerHTML = `<div class="notice success"><strong>Results received.</strong> Returning to the survey…</div>`;
    } else if (event.data.type === "burger-borough-error") {
      const message = document.querySelector("#returnMessage");
      if (message) message.innerHTML = `<div class="notice error"><strong>The survey did not accept the game results.</strong> Please notify the study team instead of closing this page.</div>`;
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
    resultPayload,
    getState: () => JSON.parse(JSON.stringify(state))
  };

  restoreScreen();
})();
