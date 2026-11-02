# Burger Borough Version 9.1 automated test results

Build tested: `2026.11.02-thesis-instrument-v9-1-json`

## Passed automated checks

- JavaScript syntax validation for `game.js` and `qualtrics-listener.js`
- Twelve-file release structure with no external libraries, analytics, trackers, service worker, or backend
- Six levels and exactly 27 scheduled orders with counts of 3, 4, 4, 5, 5, and 6
- Cumulative tickets through burger, fries, milkshake, spicy chicken, bakery, and pizza
- Timer schedule of 10, 12, 14, 16, 18, and 20 seconds
- Perfect-run economy of 900 BB$: 20 BB$ per correct scheduled order plus 60 BB$ per completed level
- Late-order deduction of 5 BB$ and incorrect complete-tray deduction of 2 BB$
- Shared `Progress 0/10` through `Progress 10/10` system with no star-rating field or display
- Identical 50-key gameplay payload schema in both conditions
- Exact agreement between the game payload and listener allowlist
- Five-field Qualtrics schema: `game_file`, three routing/status fields, and one JSON payload field
- Listener writes no individual gameplay metric fields to Qualtrics
- JSON payload contains only the 50 allowlisted gameplay keys
- JSON payload byte-size validation with a 19,000-byte safety ceiling
- Fixed reward identifier `fixed-burger-fries-20`, display code `BB-STUDY-20`, and identical offer wording across conditions and stopping points
- `not_started`, `minimal_exposure`, `exposed`, and `completed` exposure classifications
- Exposure after one complete tray submission, including an incorrect submission
- Stopping control hidden before exposure and available after exposure
- Voluntary early-stop results, fixed-offer review, stop-level metadata, and survey-continuation path
- Fourth incorrect submission triggers Rush Failed
- Current-level retry resets current progress while preserving historical errors, failures, penalties, and restart counts
- Finish-after-failure records `level_failure_level_N`, displays results and the fixed offer, and remains survey-eligible
- Manual pause, resume, and protected tab-hide pause counters
- Both narrative choices at every level reconverge on identical mechanics, BB$, progress, reward, and endpoint
- Game 2 rendered-screen checks reject narrative names, rival language, campaign language, emotional callbacks, and narrative endings
- Matched action lists and structural cards across both conditions
- Two-way iframe ping/ready handshake with assigned-condition and build validation
- Exact GitHub origin and iframe-window checks
- Complete 50-key final-payload validation before survey advancement
- Progress storage without advancement and blocking of incomplete, stale, mismatched, or ineligible final payloads
- Receipt acknowledgement before navigation, rapid duplicate suppression, and delayed transfer-retry support
- Fifteen-second no-ready fallback and technical-failure routing
- Last known exposure preserved during post-load technical failures; true no-load cases remain `not_started`
- Embedded Data write failures remain gated instead of advancing an invalid response
- Event-listener and timer cleanup on survey-page unload

## Automated test output

```text
Gameplay/instrument suite: PASS
Listener/integration suite: PASS
Release files: 12
Scheduled orders: 27
Gameplay JSON keys: 50
Predeclared Qualtrics fields: 5
Perfect-run BB$: 900
Progress endpoint: 10/10
```

## Required published-survey checks before recruitment

Automated checks cannot prove that a specific Qualtrics account, published survey theme, browser, or GitHub Pages deployment is configured correctly. After uploading this release, use the published anonymous survey link, not only Qualtrics Preview, and complete these checks:

1. Complete both assigned conditions on a laptop and phone.
2. Confirm the game stays inside the iframe and that the normal Qualtrics Next button remains unavailable during gameplay.
3. Confirm the iframe height, sticky ticket, ingredient options, and serving controls remain usable at 100% browser zoom.
4. Test full completion, correct-order early stop, incorrect-order early stop, exit-review-resume, a late order, a manual restart, both Rush Failed choices, manual pause, and tab-hide pause.
5. Simulate a load failure and confirm it reaches the technical-problem ending rather than the post-game measures.
6. Confirm exposed and completed responses reach Consumer Engagement, Narrative Progression, and Reward Redemption Intentions.
7. Confirm `not_started`, `minimal_exposure`, technical-failure, blank, and unexpected states do not reach those measures.
8. Export test responses and confirm the five declared fields appear, `__js_bb_payload_json` parses successfully, and valid gameplay rows contain all 50 documented keys.
9. Confirm the fixed offer is worded exactly as `20% off one burger-and-fries order during a hypothetical in-person Burger Borough visit` in both the game and survey questions.
10. Confirm both conditions report build `2026.11.02-thesis-instrument-v9-1-json` and clear any stale GitHub Pages cache before the final pilot.

Do not begin recruitment until the published-survey checks pass for both conditions.
