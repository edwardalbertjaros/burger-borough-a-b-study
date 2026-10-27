# Burger Borough testing checklist

## Static and privacy checks

- [ ] The repository contains only HTML, CSS, JavaScript, and Markdown.
- [ ] The root page has no condition selector.
- [ ] Neither assigned page displays Version A, Version B, narrative, non-narrative, treatment, or control.
- [ ] Neither path offers character customization or a spendable restaurant-management economy.
- [ ] No Qualtrics Response ID appears in a GitHub Pages URL.
- [ ] No external script, font, image, analytics service, or downloaded asset loads.

## Gameplay parity

- [ ] Both paths contain 6 levels and exactly 54 scheduled orders.
- [ ] Both paths use the same ticket answers, shuffled option order, timers, score rules, penalties, rewards, and complaint remake.
- [ ] Customer counts are 4, 6, 8, 10, 12, and 14.
- [ ] Every Level 2 ticket contains burger and fries.
- [ ] Every Level 3 ticket contains burger, fries, and milkshake.
- [ ] Every Level 4 ticket adds spicy chicken to all prior items.
- [ ] Every Level 5 ticket adds ice cream to all prior items.
- [ ] Every Level 6 ticket adds pizza to all prior items.
- [ ] Both paths calculate the same Burger Borough Bucks and 10 progress stages.
- [ ] `game-1` displays the stage as a 0.5-to-5.0 restaurant rating; `game-2` uses neutral kitchen-progress framing.
- [ ] Level 3 unlocks the fries reward tier; Level 4 the burger-and-fries tier; Level 5 the combo tier.
- [ ] Level 6 introduces pizza without changing the earned food-reward tier.
- [ ] The early-exit statement is available throughout gameplay.
- [ ] Selecting the stopping option pauses active gameplay and preserves the exact order and tray selections.
- [ ] Reviewing results or reward status does not finalize an early exit.
- [ ] “Keep Playing From Where I Stopped” restores the saved game without restarting the level.
- [ ] The final early-exit flag remains false when a participant resumes and completes all levels.
- [ ] Exit attempts, resume behavior, and first-exit timing are recorded separately from final early exit.

## Condition checks

- [ ] `game-1.html` includes owner B, named customers, automatic employee and campaign events, Pizza Pleasure Palace, connected consequences, and emotional resolution.
- [ ] `game-2.html` has no named characters, rival, employee event, connected story, emotional callback, or narrative ending.
- [ ] Narrative events do not alter the underlying food tickets, timers, point formula, or reward threshold.
- [ ] The Level 5 narrative compares the capped 2-BB ice-cream recovery with the 9-BB open-ended maximum without adding a player-choice mechanic.
- [ ] `game-2.html` expresses the same complaint as a neutral extra remake task.

## Interaction and accessibility

- [ ] Ticket text is readable on desktop and mobile.
- [ ] Every choice works with mouse, touch, and keyboard.
- [ ] Options are mixed rather than appearing in the same recipe order.
- [ ] An incomplete or incorrect tray cannot be served as correct.
- [ ] A wrong submission deducts time and points without trapping the player.
- [ ] Every wrong submission produces visible red, shake, icon/text feedback without relying on sound or color alone.
- [ ] The fifth wrong submission in a level pauses gameplay and opens the same Rush Failed screen in both paths.
- [ ] Retrying after Rush Failed restarts only the current level and preserves earlier completed levels.
- [ ] Level-failure counts and retries appear in the exported gameplay data.
- [ ] Timer expiration removes the speed bonus but still permits completion.
- [ ] Timer limits are 33, 35, 37, 42, 44, and 50 seconds for the cumulative Level 1–6 ticket structures.
- [ ] The final five seconds visibly change the timer text, bar, and game-frame state in both paths.
- [ ] The Review Customer Ticket control returns keyboard, mouse, and touch users to the current ticket.
- [ ] Hiding the browser tab pauses active time and the rush timer.
- [ ] Reloading during a session resumes the assigned path only.

## Qualtrics end-to-end

- [ ] Progress payload is received after each completed level.
- [ ] Final payload is received after full completion.
- [ ] Final payload is received after voluntary early exit.
- [ ] No final payload is sent when a participant only reviews progress and returns to gameplay.
- [ ] A resumed participant can later exit and generate one final payload with the updated metrics.
- [ ] Qualtrics advances only after acknowledging the final payload.
- [ ] Exported rows contain every field in `DATA_DICTIONARY.md`.
- [ ] Qualtrics' built-in `ResponseId` is present in the export.
- [ ] Standalone GitHub preview correctly reports that it did not send study data.
- [ ] The game shows the fictional reward without asking redeem, save, or decline before the Qualtrics intention scale.
