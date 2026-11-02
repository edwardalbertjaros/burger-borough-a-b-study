# Burger Borough Version 9 compact Qualtrics setup

## Why the schema changed

Qualtrics' New Survey Taking Experience does not support the older `setEmbeddedData()` method. Its supported replacement, `setJSEmbeddedData()`, can set values during the response, but fields that must appear in recorded data still need to exist in Survey Flow.

Version 9.1 therefore uses five declared fields instead of 51. Four fields support assignment and eligibility routing. One JSON field contains the complete 50-metric gameplay record.

Official references:

- [Qualtrics JavaScript Question API](https://developer-docs.qualtrics.com/docs/public-api/instructions/javascript-question-api/)
- [Qualtrics Embedded Data](https://www.qualtrics.com/support/survey-platform/survey-module/survey-flow/standard-elements/embedded-data/)

## 1. Publish the GitHub Pages files

Upload every file in this package to the top level of the public `burger-borough-a-b-study` repository. Keep GitHub Pages set to the `main` branch and `/ (root)`.

Use these URLs only for clean standalone testing:

```text
https://edwardalbertjaros.github.io/burger-borough-a-b-study/game-1.html?reset=1
https://edwardalbertjaros.github.io/burger-borough-a-b-study/game-2.html?reset=1
```

Do not include `?reset=1` in the production Qualtrics iframe. Do not show participants a raw GitHub URL or open the game in another tab.

## 2. Declare only five Embedded Data fields

At the beginning of Survey Flow, create one Embedded Data element with these blank fields:

```text
game_file
__js_bb_access_status
__js_bb_exposure_level
__js_bb_condition
__js_bb_payload_json
```

The fifth field is necessary. Without one declared container field, Qualtrics cannot reliably include the other gameplay metrics in the recorded response. The JSON value remains below Qualtrics' 20 KB per-field limit.

## 3. Randomize the condition

Create a Randomizer that evenly presents one of two branches:

- Branch 1 sets `game_file` to `game-1.html`.
- Branch 2 sets `game_file` to `game-2.html`.

Place one common game block after the Randomizer, outside both branches. Do not duplicate the game question inside the branches. Do not show `game_file` or internal condition labels to participants.

## 4. Embed the assigned game

Add one Descriptive Text question to the common game block. Open its HTML source editor and insert:

```html
<div id="bbGameContainer">
  <p><strong>Burger Borough Restaurant Activity</strong></p>
  <p>Complete the activity below. After submitting at least one complete serving tray, you may finish all six levels or use the in-game stopping option. The survey will continue after gameplay ends.</p>

  <iframe
    id="burgerBoroughGame"
    title="Burger Borough restaurant game"
    src="https://edwardalbertjaros.github.io/burger-borough-a-b-study/${e://Field/game_file}"
    style="width:100%;height:clamp(680px,90vh,900px);border:0;border-radius:16px;"
    scrolling="auto"
    allow="fullscreen">
  </iframe>

  <div id="bbGameLoadFailure" role="alert" hidden style="margin-top:16px;padding:16px;border:2px solid #9f281a;border-radius:12px;background:#fff5ef;">
    <p data-bb-load-message>Burger Borough has not loaded.</p>
    <button id="bbTechnicalFailure" type="button" style="padding:12px 18px;font-weight:700;cursor:pointer;">
      I am unable to access the activity
    </button>
  </div>
</div>
```

The game contains its own participant-facing Open Burger Borough control. Do not add a separate link or new-tab button.

If `${e://Field/game_file}` does not resolve inside iframe HTML in this account, place two fixed iframe questions inside the Randomizer branches instead. Use `game-1.html` in one and `game-2.html` in the other, with the same participant-facing wording and listener.

## 5. Install the listener

Open the same question's Question Behavior → JavaScript editor and paste the complete contents of `qualtrics-listener.js`.

The listener:

1. Hides the normal Qualtrics Next button.
2. Verifies the GitHub Pages origin, iframe window, assigned condition, and Version 9.1 build.
3. Uses a two-way ping/ready handshake.
4. Stores `bb_access_status`, `bb_exposure_level`, and `bb_condition` as routing fields.
5. Serializes the complete 50-metric gameplay record into `bb_payload_json`.
6. Rejects incomplete, inconsistent, oversized, stale, or mismatched final payloads.
7. Advances only after valid data storage or a recorded technical failure.
8. Acknowledges receipt before navigation and suppresses rapid duplicate advancement.

Do not replace `setJSEmbeddedData()` with `setEmbeddedData()`. The latter is deprecated and unavailable in the New Survey Taking Experience.

## 6. Gate the post-game measures

Immediately after the common game block, add branches in this order:

1. If `__js_bb_access_status` equals `technical_failure`, go to a technical-problem End of Survey element.
2. If `__js_bb_exposure_level` equals `not_started` or `minimal_exposure`, go to a noneligible-exposure End of Survey element.
3. If `__js_bb_exposure_level` equals `exposed` or `completed`, continue to the post-game measures.
4. Treat blank or unexpected fields as a technical problem.

Suggested technical ending:

> Thank you for your time. Because the Burger Borough activity could not be completed on this device, the post-game questions will not be presented. No additional action is required.

## 7. Keep reward wording consistent

Every exposed participant sees the same offer:

> **20% off one burger-and-fries order during a hypothetical in-person Burger Borough visit.**

Reward Redemption Intentions items should name this exact offer or call it the `fictional reward offer`.

## 8. Bulk-import alternatives

`QUALTRICS_COMPACT_SCHEMA_IMPORT.txt` uses Qualtrics' documented Advanced TXT `[[ED:field]]` tags to create the five fields automatically. Importing it creates a new survey; it does not merge a Survey Flow block into the existing thesis survey. It is useful only when starting a new project or rebuilding from a copy.

Qualtrics also supports importing a complete QSF, but QSF import creates a new survey. Qualtrics warns against manually editing QSF files, so this package does not include a fabricated partial QSF. Browser automation that clicks Survey Flow controls is similarly fragile and is not recommended for the thesis instrument.

For the existing survey, manually creating five fields is the safest and fastest approach.

## 9. Expand the JSON after export

Export the survey as CSV. Parse `__js_bb_payload_json` into analysis columns using the example in `DATA_DICTIONARY.md`. Preserve the original JSON column in the archived raw dataset.

## 10. Published-survey validation

Use the published anonymous survey link, not only Preview. Test:

1. Full completion in both conditions.
2. Correct-order and incorrect-order early stops.
3. Exit review followed by resume.
4. Rush Failed with retry and with finish.
5. Late and incorrect BB$ deductions.
6. Manual and tab-hide pause.
7. Load failure and technical termination.
8. Rejected stale, incomplete, and mismatched payloads.
9. Successful delayed transfer retry without double advancement.
10. Exported `__js_bb_payload_json` parses successfully and contains all 50 documented keys for valid gameplay records.

Do not recruit participants until both conditions generate correctly routed and parseable rows through the published survey.
