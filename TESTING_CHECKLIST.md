# Burger Borough testing checklist

## Static and privacy checks

- [ ] The repository contains only HTML, CSS, JavaScript, and Markdown.
- [ ] The root page has no condition selector.
- [ ] Neither assigned page displays Version A, Version B, narrative, non-narrative, treatment, or control.
- [ ] No Qualtrics Response ID appears in a GitHub Pages URL.
- [ ] No external script, font, image, analytics service, or downloaded asset loads.

## Gameplay parity

- [ ] Both paths contain 6 levels and exactly 54 scheduled orders.
- [ ] Both paths use the same ticket answers, shuffled option order, timers, score rules, penalties, rewards, and complaint remake.
- [ ] Customer counts are 4, 6, 8, 10, 12, and 14.
- [ ] Level 3 unlocks the fries reward tier; Level 4 the burger-and-fries tier; Level 5 the combo tier.
- [ ] Level 6 introduces pizza without changing the earned food-reward tier.
- [ ] The early-exit statement is available throughout gameplay.

## Condition checks

- [ ] `game-1.html` includes Chef Bea, named customers, employee choices, marketing consequences, Pizza Pleasure Palace, and emotional resolution.
- [ ] `game-2.html` has no named characters, rival, employee choice, connected story, emotional callback, or narrative ending.
- [ ] Marketing choices do not alter the underlying food tickets, timers, point formula, or reward threshold.
- [ ] The Level 5 recovery-policy choice produces the stated 9-vs-2 Borough Bucks consequence in `game-1.html`.
- [ ] `game-2.html` expresses the same complaint as a neutral extra remake task.

## Interaction and accessibility

- [ ] Ticket text is readable on desktop and mobile.
- [ ] Every choice works with mouse, touch, and keyboard.
- [ ] Options are mixed rather than appearing in the same recipe order.
- [ ] An incomplete or incorrect tray cannot be served as correct.
- [ ] A wrong submission deducts time and points without trapping the player.
- [ ] Timer expiration removes the speed bonus but still permits completion.
- [ ] Hiding the browser tab pauses active time and the rush timer.
- [ ] Reloading during a session resumes the assigned path only.

## Qualtrics end-to-end

- [ ] Progress payload is received after each completed level.
- [ ] Final payload is received after full completion.
- [ ] Final payload is received after voluntary early exit.
- [ ] Qualtrics advances only after acknowledging the final payload.
- [ ] Exported rows contain every field in `DATA_DICTIONARY.md`.
- [ ] Qualtrics' built-in `ResponseId` is present in the export.
- [ ] Standalone GitHub preview correctly reports that it did not send study data.
