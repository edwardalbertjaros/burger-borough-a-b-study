# Burger Borough study game

This folder is the GitHub Pages source for the Burger Borough experimental stimulus.

## Published paths

- `game-1.html`: story-enabled restaurant experience
- `game-2.html`: gameplay-only restaurant experience
- `index.html`: neutral landing page with no condition selector

The participant-facing pages never display “Version A,” “Version B,” “narrative condition,” or “non-narrative condition.” Qualtrics assigns the page.

## What both game paths share

- Six cumulative restaurant levels
- Customer counts of 4, 6, 8, 10, 12, and 14
- The same 54 scheduled order tickets
- Every ticket contains all food stations introduced through that level: burger; burger and fries; burger, fries, and milkshake; then spicy chicken, ice cream, and pizza cumulatively
- The same burger, fries, milkshake, spicy-chicken, ice-cream, and pizza options
- The same order timers, scoring, penalties, complaint-remake task, reward thresholds, early-exit control, and result metrics
- The same Burger Borough Bucks total and 10 underlying progress thresholds
- The same mobile-responsive tap-to-assemble controls
- The same Qualtrics result schema

## What differs

`game-1.html` includes the gender-neutral owner B, named customers, automatically introduced employees and campaigns, continuing competition with Pizza Pleasure Palace, connected campaign consequences, a linear customer-recovery event, and a 0.5-to-5.0 restaurant rating that frames the shared progress thresholds as visible restaurant improvement.

`game-2.html` presents the same food preparation, Burger Borough Bucks, progress thresholds, and complaint-remake gameplay without named characters, continuing story, rival restaurant, employee events, emotional resolution, or narrative callbacks. It labels the shared thresholds as neutral progress rather than a restaurant storyline.

## Experimental-design boundaries

- Owner B is a fixed, gender-neutral narrative character; there is no character customization.
- Employee arrivals, marketing campaigns, and the Level 5 recovery event follow one linear sequence rather than branching from participant choices.
- The game displays any earned fictional reward but does not ask whether the participant would redeem it. Reward-redemption intentions are measured afterward in Qualtrics.
- Burger Borough Bucks accumulate identically in both paths and are never spent on payroll, rent, supplies, or other management systems.
- Sound is omitted so device volume, browser policies, headphones, and hearing differences do not create inconsistent exposure.

## Voluntary stopping and resuming

Selecting the in-game stopping option pauses the active timer and saves the exact level, order, ticket selections, and progress. Participants may review their current results and reward status, then either return to the saved game or finalize gameplay and continue to Qualtrics. Gameplay results are not finalized merely by viewing the progress or reward screens.

Incorrect serves produce matched visual feedback in both paths. Five incorrect serve attempts within one level trigger a neutral `Rush Failed` screen. Participants may retry only that level or review their saved progress and decide whether to stop. Earlier completed levels are never erased by a level failure.

Order timers use real seconds and are shorter than in the prior build while still increasing with ticket complexity. The limits are 33, 35, 37, 42, 44, and 50 seconds for the cumulative ticket structures in Levels 1–6. During the final five seconds, the timer, progress bar, and game frame enter the same visible danger state in both paths. A sticky Review Customer Ticket control supports long cumulative orders on smaller screens.

## Technical contents

The project uses only HTML, CSS, vanilla JavaScript, and Markdown. It has no executables, installers, external libraries, trackers, downloaded assets, service worker, or backend database.

The browser game sends a structured result object to its parent Qualtrics page with `window.postMessage`. GitHub Pages does not receive a Qualtrics Response ID. Qualtrics retains its own built-in `ResponseId` and stores the gameplay fields through `qualtrics-listener.js`.

## Local preview

Open either `game-1.html` or `game-2.html` in a browser. Add `?reset=1` to the URL when a clean test session is needed.

Standalone previews deliberately report that no data was sent. Data transfer occurs only when the game is embedded in the configured Qualtrics iframe.

## Required testing

Follow `TESTING_CHECKLIST.md`. Do not recruit participants until both assigned paths have produced complete rows in an exported Qualtrics response file.
