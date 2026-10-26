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
- The same burger, fries, milkshake, spicy-chicken, ice-cream, and pizza options
- The same order timers, scoring, penalties, complaint-remake task, reward thresholds, early-exit control, and result metrics
- The same mobile-responsive tap-to-assemble controls
- The same Qualtrics result schema

## What differs

`game-1.html` includes Chef Bea, named customers, employee/marketing choices, continuing competition with Pizza Pleasure Palace, campaign consequences, and a customer-recovery policy decision.

`game-2.html` presents the same food preparation and complaint-remake gameplay without named characters, continuing story, rival restaurant, employee choices, emotional resolution, or narrative callbacks.

## Technical contents

The project uses only HTML, CSS, vanilla JavaScript, and Markdown. It has no executables, installers, external libraries, trackers, downloaded assets, service worker, or backend database.

The browser game sends a structured result object to its parent Qualtrics page with `window.postMessage`. GitHub Pages does not receive a Qualtrics Response ID. Qualtrics retains its own built-in `ResponseId` and stores the gameplay fields through `qualtrics-listener.js`.

## Local preview

Open either `game-1.html` or `game-2.html` in a browser. Add `?reset=1` to the URL when a clean test session is needed.

Standalone previews deliberately report that no data was sent. Data transfer occurs only when the game is embedded in the configured Qualtrics iframe.

## Required testing

Follow `TESTING_CHECKLIST.md`. Do not recruit participants until both assigned paths have produced complete rows in an exported Qualtrics response file.
