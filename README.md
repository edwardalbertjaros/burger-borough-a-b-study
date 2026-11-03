# Burger Borough Version 9 study instrument

This repository is the GitHub Pages source for the final Burger Borough experimental stimulus.

## Published paths

- `game-1.html`: narrative-progression experience
- `game-2.html`: gameplay-only comparison experience
- `index.html`: neutral landing page with no condition selector

Qualtrics assigns the page. Participant-facing screens never display Version A, Version B, narrative, non-narrative, treatment, or control.

## Shared gameplay

Both paths contain:

- Six cumulative restaurant levels
- Customer counts of 3, 4, 4, 5, 5, and 6
- The same 27 scheduled tickets
- The same burger, fries, milkshake, spicy-chicken, bakery, and pizza stations
- Cumulative tickets containing every station introduced through the current level
- The same recipes, shuffled options, timers, penalties, scoring, BB$, progress thresholds, pause behavior, failure behavior, stopping controls, fixed reward, and Qualtrics schema
- Timers of 10, 12, 14, 16, 18, and 20 seconds
- A shared `Progress 0/10` through `Progress 10/10` system
- One matched two-option selection before each level
- A four-error Rush Failed threshold

The six levels introduce burger; fries; milkshake; spicy chicken; bakery; and pizza. Level 6 expands the bakery from four dessert types to eight varieties.

## Planned condition difference

`game-1.html` contains Chef, named customers, named employee choices, Pizza Pleasure Palace, connected chapter events, callbacks, and a beginning-to-end comeback storyline. Both employee options at each level are reasonable and produce equally positive progress. The selected employee changes only the narrative flavor of the callback.

`game-2.html` contains no named characters, rival, campaign story, promotional outcome, emotional callback, or narrative ending. Its matched choices use neutral New-station focus and Full-menu focus language, and completion feedback records only the selection and performance.

Both paths use identical progress numbers. The narrative path adds connected milestone text; the gameplay-only path displays `Progress threshold reached.`

## Experimental-design boundaries

- Choices never change tickets, timers, scoring, BB$, progress, difficulty, fixed reward, or the final endpoint.
- Both choices reconverge before the same level gameplay.
- No choice is framed as better or worse.
- Chef is fixed and gender-neutral; there is no customization.
- BB$ is never spent on payroll, rent, ingredients, or other management systems.
- Sound is omitted to avoid inconsistent exposure caused by device volume, autoplay policies, headphones, or hearing differences.
- The Level 5 correction-remake and customer-recovery mechanics are removed.

## Fixed fictional reward

Every eligible participant sees exactly the same fictional offer:

> **20% off one burger-and-fries order during a hypothetical in-person Burger Borough visit.**

BB$, errors, lateness, progress, stopping point, and completion never change the offer. The reward display uses the constant code `BB-STUDY-20` and never inserts the participant's score.

## Exposure and early stopping

Serve Order remains disabled until the participant selects every required category. Therefore, an incorrect Serve Order submission still represents a complete tray and meaningful interaction.

Exposure is classified as:

- `not_started`: gameplay never began
- `minimal_exposure`: a level began but no complete tray was submitted
- `exposed`: at least one complete tray was submitted, but all levels were not completed
- `completed`: all six levels were completed

The in-game stopping option appears only after the first complete tray submission, correct or incorrect. Exposed early stoppers remain eligible for the post-game measures, and their stopping behavior is retained. Participants may withdraw from the study at any time by closing the survey.

## Rush Failed

Four incorrect Serve Order submissions within one level trigger the same neutral Rush Failed screen in both paths. Participants may:

- Retry only the current level, preserving earlier completed levels and the BB$ earned from those levels
- Finish gameplay, review results and the fixed offer, and continue to the survey

Failure counts, retries, stopping level, and exit reason are exported. Earlier progress is not erased.

## BB$ and progress

- Correct scheduled order: 20 gross BB$
- Completed level: 60 gross BB$
- Late order: minus 5 BB$
- Incorrect complete tray: minus 2 BB$
- Maximum: 900 BB$
- Progress thresholds: 50, 100, 200, 300, 400, 500, 600, 700, 800, and 890 BB$

The results screen separates gross BB$, late deductions, incorrect deductions, final BB$, and Progress X/10.

## Interaction and layout

- The sticky header shows Level, Progress, BB$, and Pause during active gameplay.
- The order ticket remains visible beneath the header and can be minimized.
- The serving bar keeps tray completion, remaining time, and Serve Order available while leaving ingredient options visible.
- Clear Tray and Restart Level remain inside the collapsed More order options section.
- Both paths include matched order-guidance strips and matched results-summary cards to limit layout-driven exposure differences.
- Switching tabs automatically invokes protected pause.
- The game supports mouse, touch, and keyboard interaction.

## Qualtrics integration

The game stays inside a Qualtrics iframe. It never receives a Qualtrics Response ID or survey return URL.

The integration uses:

1. A two-way `burger-borough-ping` and `burger-borough-ready` handshake
2. Periodic and event-based progress payloads
3. A validated 50-metric gameplay payload serialized into one JSON field
4. Five predeclared fields total: `game_file`, three routing fields, and `bb_payload_json`
5. Exact GitHub origin and iframe-window verification
6. Qualtrics Next-button gating
7. A technical-failure route that bypasses post-game measures
8. Final acknowledgement and retry behavior

The compact schema avoids manually creating 51 Embedded Data fields. Qualtrics still requires the JSON container field to be declared if the payload must appear in recorded exports. See `QUALTRICS_SETUP.md` and `DATA_DICTIONARY.md`.

The production iframe must not contain `?reset=1`, a visible raw URL, a new-tab link, a `returnUrl`, or a response identifier.

## Technical contents

The project uses only HTML, CSS, vanilla JavaScript, Markdown, and one optional Qualtrics Advanced TXT import file. It contains no executables, installers, external libraries, trackers, downloaded assets, service worker, or backend database.

## Required validation

Follow `TESTING_CHECKLIST.md` and `QUALTRICS_SETUP.md`. Automated tests do not replace a complete run through the published anonymous Qualtrics survey on desktop and mobile. Recruitment must wait until both assigned paths produce complete, correctly routed exported response rows.
 
