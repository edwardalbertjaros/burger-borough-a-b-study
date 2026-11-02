Qualtrics.SurveyEngine.addOnReady(function () {
  "use strict";

  var question = this;
  var ALLOWED_GAME_ORIGIN = "https://edwardalbertjaros.github.io";
  var EXPECTED_GAME_VERSION = "2026.11.02-thesis-instrument-v9-1-json";
  var FIXED_REWARD_OFFER = "fixed-burger-fries-20";
  var MAX_EMBEDDED_DATA_BYTES = 19000;
  var completed = false;
  var terminated = false;
  var gameReady = false;
  var lastExposure = "not_started";
  var lastCondition = "";
  var lastPayload = null;
  var advanceInFlight = false;
  var advanceReleaseTimer = 0;
  var gameFrame = document.getElementById("burgerBoroughGame");
  var loadFailure = document.getElementById("bbGameLoadFailure");
  var technicalButton = document.getElementById("bbTechnicalFailure");
  var loadTimer = 0;
  var pingTimer = 0;
  var allowedFields = [
    "bb_condition", "bb_game_version", "bb_completed_level", "bb_current_level",
    "bb_current_order", "bb_total_score", "bb_bucks_earned", "bb_gross_bucks",
    "bb_late_penalty", "bb_incorrect_penalty", "bb_progress_stage",
    "bb_reward_offer", "bb_exposure_level", "bb_ended_early",
    "bb_exit_reason", "bb_exit_attempts", "bb_resumed_after_exit", "bb_resume_count",
    "bb_first_exit_level", "bb_first_exit_order", "bb_first_exit_active_seconds",
    "bb_total_seconds", "bb_active_seconds", "bb_experience_seconds",
    "bb_progression_screen_seconds", "bb_paused_seconds", "bb_pause_count",
    "bb_automatic_pause_count", "bb_level_times", "bb_level_scores",
    "bb_level_errors", "bb_level_timeouts", "bb_level_failures",
    "bb_total_level_failures", "bb_restarts", "bb_orders_served",
    "bb_scheduled_orders_completed", "bb_orders_attempted", "bb_incorrect_submissions",
    "bb_timer_expirations", "bb_accuracy_percent", "bb_average_order_seconds",
    "bb_best_streak", "bb_level1_choice", "bb_level2_choice",
    "bb_level3_choice", "bb_level4_choice", "bb_level5_choice", "bb_level6_choice",
    "bb_story_choices"
  ];
  question.hideNextButton();

  function setField(name, value) {
    Qualtrics.SurveyEngine.setJSEmbeddedData(name, String(value));
  }

  function byteLength(value) {
    try { return new TextEncoder().encode(value).length; }
    catch (_error) { return unescape(encodeURIComponent(value)).length; }
  }

  function clearIntegrationTimers() {
    if (loadTimer) window.clearTimeout(loadTimer);
    if (pingTimer) window.clearInterval(pingTimer);
    if (advanceReleaseTimer) window.clearTimeout(advanceReleaseTimer);
    loadTimer = 0;
    pingTimer = 0;
    advanceReleaseTimer = 0;
    advanceInFlight = false;
  }

  function hideLoadFailure() {
    if (loadFailure) loadFailure.hidden = true;
  }

  function showLoadFailure(message) {
    if (!loadFailure) return;
    var copy = loadFailure.querySelector("[data-bb-load-message]");
    if (copy && message) copy.textContent = message;
    loadFailure.hidden = false;
  }

  function pingGame() {
    if (!gameFrame || !gameFrame.contentWindow || gameReady || terminated) return;
    gameFrame.contentWindow.postMessage({ type: "burger-borough-ping" }, ALLOWED_GAME_ORIGIN);
  }

  function advanceSurvey() {
    window.setTimeout(function () {
      question.showNextButton();
      question.clickNextButton();
    }, 250);
  }

  function recordTechnicalFailure() {
    if (terminated || completed) return;
    try {
      setField("bb_access_status", "technical_failure");
      setField("bb_exposure_level", lastExposure);
      setField("bb_condition", lastCondition || assignedCondition() || "unknown");
      var technicalPayload = lastPayload ? Object.assign({}, lastPayload) : {
        bb_condition: lastCondition || assignedCondition() || "unknown",
        bb_game_version: EXPECTED_GAME_VERSION,
        bb_exposure_level: lastExposure
      };
      technicalPayload.bb_exit_reason = "technical_failure";
      technicalPayload.bb_exposure_level = lastExposure;
      setField("bb_payload_json", JSON.stringify(technicalPayload));
    } catch (_error) {
      showLoadFailure("The survey could not record the technical problem. Please try again before closing this page.");
      return;
    }
    terminated = true;
    clearIntegrationTimers();
    advanceSurvey();
  }

  function storePayload(payload) {
    var compactPayload = {};
    allowedFields.forEach(function (fieldName) {
      if (Object.prototype.hasOwnProperty.call(payload, fieldName)) {
        compactPayload[fieldName] = String(payload[fieldName]);
      }
    });
    var payloadJson = JSON.stringify(compactPayload);
    if (byteLength(payloadJson) > MAX_EMBEDDED_DATA_BYTES) {
      throw new Error("Gameplay payload exceeds the Embedded Data size limit");
    }
    setField("bb_condition", compactPayload.bb_condition || assignedCondition() || "unknown");
    setField("bb_exposure_level", compactPayload.bb_exposure_level || lastExposure);
    setField("bb_payload_json", payloadJson);
    lastCondition = compactPayload.bb_condition || lastCondition;
    lastPayload = compactPayload;
    if (["not_started", "minimal_exposure", "exposed", "completed"].indexOf(payload.bb_exposure_level) !== -1) {
      lastExposure = payload.bb_exposure_level;
    }
  }

  function assignedCondition() {
    if (!gameFrame) return "";
    var source = "";
    try { source = String(gameFrame.src || gameFrame.getAttribute("src") || ""); } catch (_error) {}
    if (/game-1\.html(?:[?#]|$)/.test(source)) return "game-1";
    if (/game-2\.html(?:[?#]|$)/.test(source)) return "game-2";
    return "";
  }

  function validGameIdentity(condition, version) {
    var expectedCondition = assignedCondition();
    if (["game-1", "game-2"].indexOf(condition) === -1) return false;
    if (expectedCondition && condition !== expectedCondition) return false;
    return version === EXPECTED_GAME_VERSION;
  }

  function validFinalPayload(payload) {
    var completeSchema = allowedFields.every(function (fieldName) {
      return Object.prototype.hasOwnProperty.call(payload, fieldName) && String(payload[fieldName]).length > 0;
    });
    if (!completeSchema) return false;
    if (!validGameIdentity(String(payload.bb_condition), String(payload.bb_game_version))) return false;
    if (String(payload.bb_reward_offer) !== FIXED_REWARD_OFFER) return false;
    if (["exposed", "completed"].indexOf(String(payload.bb_exposure_level)) === -1) return false;
    var attempts = Number(payload.bb_orders_attempted);
    var completedLevel = Number(payload.bb_completed_level);
    if (!Number.isFinite(attempts) || attempts < 1) return false;
    if (!Number.isFinite(completedLevel) || completedLevel < 0 || completedLevel > 6) return false;
    var exposure = String(payload.bb_exposure_level);
    var endedEarly = String(payload.bb_ended_early);
    var exitReason = String(payload.bb_exit_reason);
    if (exposure === "completed") {
      if (completedLevel !== 6 || endedEarly !== "false" || exitReason !== "completed") return false;
    }
    if (exposure === "exposed") {
      if (completedLevel >= 6 || endedEarly !== "true") return false;
      if (!/^voluntary_level_\d+_order_\d+$/.test(exitReason) && !/^level_failure_level_\d+$/.test(exitReason)) return false;
    }
    return true;
  }

  function scheduleFinalAdvance(event) {
    if (advanceInFlight) return;
    advanceInFlight = true;
    event.source.postMessage({ type: "burger-borough-received" }, event.origin);
    window.setTimeout(function () {
      try {
        question.showNextButton();
        question.clickNextButton();
        advanceReleaseTimer = window.setTimeout(function () {
          advanceInFlight = false;
          advanceReleaseTimer = 0;
        }, 1500);
      } catch (_error) {
        advanceInFlight = false;
        completed = false;
        question.showNextButton();
        event.source.postMessage({ type: "burger-borough-error" }, event.origin);
      }
    }, 250);
  }

  function receiveGameMessage(event) {
    if (event.origin !== ALLOWED_GAME_ORIGIN) return;
    if (!gameFrame || event.source !== gameFrame.contentWindow) return;
    if (!event.data || !event.data.type) return;

    if (event.data.type === "burger-borough-ready") {
      if (terminated) return;
      if (!validGameIdentity(String(event.data.condition || ""), String(event.data.version || ""))) {
        showLoadFailure("Burger Borough did not load the assigned Version 9 activity. Refresh the survey or report the technical problem below.");
        return;
      }
      try {
        setField("bb_access_status", "ready");
        setField("bb_condition", String(event.data.condition));
        setField("bb_exposure_level", "not_started");
      } catch (_error) {
        showLoadFailure("Burger Borough loaded, but the survey could not initialize its data record. Report the technical problem below.");
        return;
      }
      gameReady = true;
      lastCondition = String(event.data.condition);
      clearIntegrationTimers();
      hideLoadFailure();
      event.source.postMessage({ type: "burger-borough-parent-ready" }, event.origin);
      return;
    }

    if (terminated) return;
    if (event.data.type !== "burger-borough-progress" && event.data.type !== "burger-borough-complete") return;
    if (!event.data.payload || typeof event.data.payload !== "object") return;
    if (completed && event.data.type === "burger-borough-progress") return;
    if (!validGameIdentity(String(event.data.payload.bb_condition || ""), String(event.data.payload.bb_game_version || ""))) {
      showLoadFailure("Burger Borough sent data from an unexpected activity build. Refresh the survey or report the technical problem below.");
      event.source.postMessage({ type: "burger-borough-error" }, event.origin);
      return;
    }

    if (event.data.type === "burger-borough-complete" && !validFinalPayload(event.data.payload)) {
      showLoadFailure("Burger Borough could not verify the complete gameplay record. Try sending the results again.");
      event.source.postMessage({ type: "burger-borough-error" }, event.origin);
      return;
    }

    if (completed && event.data.type === "burger-borough-complete") {
      scheduleFinalAdvance(event);
      return;
    }

    try {
      setField("bb_access_status", "ready");
      storePayload(event.data.payload);
    } catch (_error) {
      showLoadFailure("The gameplay results could not be stored. Try sending the results again or report the technical problem below.");
      event.source.postMessage({ type: "burger-borough-error" }, event.origin);
      return;
    }

    if (event.data.type !== "burger-borough-complete") return;
    completed = true;
    scheduleFinalAdvance(event);
  }

  window.addEventListener("message", receiveGameMessage);
  if (technicalButton) technicalButton.addEventListener("click", recordTechnicalFailure);
  if (gameFrame) gameFrame.addEventListener("load", pingGame);

  pingGame();
  pingTimer = window.setInterval(pingGame, 1000);
  loadTimer = window.setTimeout(function () {
    if (!gameReady && !terminated) {
      showLoadFailure("Burger Borough has not loaded. You may wait a little longer or report that you cannot access the activity.");
    }
  }, 15000);

  if (typeof Qualtrics.SurveyEngine.addOnUnload === "function") {
    Qualtrics.SurveyEngine.addOnUnload(function () {
      clearIntegrationTimers();
      window.removeEventListener("message", receiveGameMessage);
      if (technicalButton) technicalButton.removeEventListener("click", recordTechnicalFailure);
      if (gameFrame) gameFrame.removeEventListener("load", pingGame);
    });
  }
});
