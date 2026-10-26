Qualtrics.SurveyEngine.addOnReady(function () {
  "use strict";

  var question = this;
  var ALLOWED_GAME_ORIGIN = "https://edwardalbertjaros.github.io";
  var completed = false;
  var gameFrame = document.getElementById("burgerBoroughGame");

  question.hideNextButton();

  function receiveGameResults(event) {
    if (event.origin !== ALLOWED_GAME_ORIGIN) return;
    if (!gameFrame || event.source !== gameFrame.contentWindow) return;
    if (!event.data || !event.data.payload || completed) return;
    if (event.data.type !== "burger-borough-progress" && event.data.type !== "burger-borough-complete") return;

    try {
      Object.keys(event.data.payload).forEach(function (fieldName) {
        Qualtrics.SurveyEngine.setJSEmbeddedData(fieldName, String(event.data.payload[fieldName]));
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
