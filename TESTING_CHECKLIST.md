# Burger Borough Version 9 testing checklist

## Static and privacy

- [ ] Repository contains only HTML, CSS, JavaScript, and Markdown.
- [ ] Root page has no condition selector.
- [ ] Participant pages do not display experimental condition labels.
- [ ] No external scripts, fonts, images, analytics, trackers, or downloaded assets load.
- [ ] No Qualtrics Response ID, survey URL, or participant identifier is sent to GitHub Pages.
- [ ] Production iframe contains no `?reset=1`, raw URL, new-tab link, or `returnUrl`.

## Mechanical parity

- [ ] Both paths contain six levels and 27 scheduled tickets.
- [ ] Level order counts are 3, 4, 4, 5, 5, and 6.
- [ ] Both paths use identical recipes, option sets, shuffling, timers, scoring, penalties, progress thresholds, fixed reward, and controls.
- [ ] Every Level 2 ticket contains burger and fries.
- [ ] Every Level 3 ticket adds milkshake.
- [ ] Every Level 4 ticket adds spicy chicken.
- [ ] Every Level 5 ticket adds bakery.
- [ ] Every Level 6 ticket adds pizza.
- [ ] Level 5 bakery contains brownie, cake, pie, and cheesecake.
- [ ] Level 6 bakery contains eight expanded dessert varieties.
- [ ] Timers are 10, 12, 14, 16, 18, and 20 seconds.
- [ ] Both paths show `Progress 0/10` through `Progress 10/10`; no stars or ratings appear.
- [ ] Thresholds are 50, 100, 200, 300, 400, 500, 600, 700, 800, and 890 BB$.
- [ ] Correct orders earn 20 gross BB$ and completed levels earn 60 gross BB$.
- [ ] Late orders deduct 5 BB$ and incorrect complete trays deduct 2 BB$.
- [ ] Perfect maximum is 900 BB$ and BB$ never falls below zero.

## Fixed reward

- [ ] Every exposed and completed participant sees `20% off one burger-and-fries order`.
- [ ] Reward wording specifies a hypothetical in-person Burger Borough visit.
- [ ] Offer identifier is always `fixed-burger-fries-20`.
- [ ] Displayed pass code is always `BB-STUDY-20`.
- [ ] BB$, progress, completion, errors, lateness, and condition do not alter the reward.
- [ ] No level displays a tiered reward unlock.
- [ ] Qualtrics redemption-intention items reference the same fixed fictional offer.

## Narrative manipulation and screen parity

- [ ] Game 1 contains Chef, named customers, named employees, Pizza Pleasure Palace, connected chapters, callbacks, and a final resolution.
- [ ] Both employee options at every level are reasonable and equally positive.
- [ ] No `fit`, strong/mixed, better/worse, outperformed, or gained-ground logic remains.
- [ ] Employee choices change only the surface callback and reconverge before identical gameplay.
- [ ] Game 2 contains no named characters, rival, campaign story, promotional outcome, emotional callback, or narrative ending.
- [ ] Game 2 plan cards use neutral New-station focus and Full-menu focus language.
- [ ] Game 2 completion feedback says only that plan selection, level performance, and progress were recorded.
- [ ] Narrative and neutral milestone cards use the same `Progress X/10` label and heading.
- [ ] Intro, choice, order, completion, results, reward, failure, and transfer screen sequences match.
- [ ] Both paths include equal-size order-guidance and results-summary cards.
- [ ] Matched screens have the same actions, comparable heights, and no avoidable layout-driven scrolling difference.

## Exposure and stopping

- [ ] Before any complete tray submission, the in-game stopping option is absent.
- [ ] After the first correct or incorrect complete-tray submission, the stopping option appears.
- [ ] Exposure exports `not_started` before gameplay begins.
- [ ] Exposure exports `minimal_exposure` after a level starts but before a tray is submitted.
- [ ] Exposure exports `exposed` after at least one tray submission and before six-level completion.
- [ ] Exposure exports `completed` after all six levels.
- [ ] Early-stop participants review results and the same fixed reward before transfer.
- [ ] Exit review does not finalize gameplay until the participant chooses to finish.
- [ ] Resume restores the exact level, order, timer, and tray selections.
- [ ] Exit attempts, resumes, first-exit position, final status, and failure-related exits export correctly.

## Rush Failed

- [ ] Fourth incorrect submission within one level triggers Rush Failed in both paths.
- [ ] Retry resets only the current level and preserves earlier completed levels and BB$.
- [ ] Retry resets the current-run error counter while retaining historical error and failure metrics.
- [ ] Finish Gameplay records `level_failure_level_N`, preserves results, shows the fixed reward, and permits valid survey continuation.
- [ ] Repeated failures and retries remain measurable.

## Interaction and accessibility

- [ ] Serve Order is disabled until every required category has a selection.
- [ ] Complete but incorrect trays can be submitted and recorded.
- [ ] Incorrect feedback uses text, icon, motion, and color rather than color alone.
- [ ] Final five seconds trigger the matched visible danger state.
- [ ] Pause freezes the timer and hides the ticket, stations, and tray.
- [ ] Tab hiding triggers protected automatic pause.
- [ ] Ticket rows align on desktop and stack correctly on narrow screens.
- [ ] Ticket minimize/show works in both paths.
- [ ] Sticky order ticket and serving bar leave ingredient controls usable at 100% zoom.
- [ ] Clear Tray and Restart Level remain inside collapsed secondary controls.
- [ ] Mouse, touch, and keyboard operation work on desktop and mobile.

## Qualtrics handshake and gating

- [ ] Game sends ready on load and responds to a parent ping.
- [ ] Listener acknowledges ready and stores access, condition, and initial exposure routing fields.
- [ ] Listener rejects messages from the wrong origin or wrong window.
- [ ] Next remains hidden during active gameplay and progress messages.
- [ ] Progress payloads update the routing fields and `bb_payload_json` without advancing.
- [ ] Incomplete final payloads are rejected and produce a retry message.
- [ ] Valid exposed/completed final payload stores all 50 gameplay metrics inside `bb_payload_json` and advances.
- [ ] Duplicate final submission remains recoverable.
- [ ] No-ready timeout reveals the technical-failure option after 15 seconds.
- [ ] Technical-failure selection stores `technical_failure`, the last known exposure state, and `technical_failure` exit reason; a true no-load case stores `not_started`.
- [ ] Technical failures and ineligible exposure states branch to an End of Survey element.
- [ ] Only `exposed` and `completed` states reach post-game measures.
- [ ] Survey Flow contains only `game_file` and four `__js_` fields.
- [ ] Export contains the four `__js_` fields, `game_file`, and built-in `ResponseId`.
- [ ] Every valid gameplay JSON value parses and contains all 50 documented keys.
- [ ] Both conditions pass through the published anonymous link, not only Preview.

## Recruitment gate

- [ ] Both direct GitHub Pages paths pass laptop and phone testing.
- [ ] Both embedded conditions pass published-survey testing.
- [ ] Exported rows match `DATA_DICTIONARY.md`.
- [ ] IRB protocol, participant instructions, survey appendix, and Chapter 3 match Version 9.
- [ ] No recruitment begins before all applicable checks pass.
