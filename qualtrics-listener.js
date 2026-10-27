Qualtrics.SurveyEngine.addOnReady(function () {
  "use strict";

  var question = this;
  var ALLOWED_GAME_ORIGIN = "https://edwardalbertjaros.github.io";
  var completed = false;
  var gameFrame = document.getElementById("burgerBoroughGame");
  var allowedFields = [
    "bb_condition", "bb_game_version", "bb_completed_level", "bb_current_level",
    "bb_current_order", "bb_total_score", "bb_bucks_earned", "bb_progress_stage",
    "bb_star_rating", "bb_reward_tier", "bb_ended_early",
    "bb_exit_reason", "bb_exit_attempts", "bb_resumed_after_exit", "bb_resume_count",
    "bb_first_exit_level", "bb_first_exit_order", "bb_first_exit_active_seconds",
    "bb_total_seconds", "bb_active_seconds", "bb_level_times", "bb_level_scores",
    "bb_level_errors", "bb_level_timeouts", "bb_level_failures",
    "bb_total_level_failures", "bb_restarts", "bb_orders_served",
    "bb_scheduled_orders_completed", "bb_orders_attempted", "bb_incorrect_submissions",
    "bb_timer_expirations", "bb_accuracy_percent", "bb_average_order_seconds",
    "bb_best_streak", "bb_complaint_remakes", "bb_story_choices",
    "bb_campaign_results", "bb_recovery_choice"
  ];

  question.hideNextButton();

  function receiveGameResults(event) {
    if (event.origin !== ALLOWED_GAME_ORIGIN) return;
    if (!gameFrame || event.source !== gameFrame.contentWindow) return;
    if (!event.data || !event.data.payload || completed) return;
    if (event.data.type !== "burger-borough-progress" && event.data.type !== "burger-borough-complete") return;

    try {
      Object.keys(event.data.payload).forEach(function (fieldName) {
        if (allowedFields.indexOf(fieldName) !== -1) {
          Qualtrics.SurveyEngine.setJSEmbeddedData(fieldName, String(event.data.payload[fieldName]));
        }
      });
    } catch (error) {
      event.source.postMessage({ type: "burger-borough-error" }, event.origin);
      question.showNextButton();
      return;
    }

    if (event.data.type !== "burger-borough-complete") return;
    completed = true;
    event.source.postMessage({ type: "burger-borough-received" }, event.origin);
    window.removeEventListener("message", receiveGameResults);
    window.setTimeout(function () { question.clickNextButton(); }, 100);
  }

  window.addEventListener("message", receiveGameResults);
});
