# Automated test results

Build tested: `2026.10.27-resume-v5`

## Passed

- JavaScript syntax validation for the game and Qualtrics listener
- Separate internal condition values: `game-1` and `game-2`
- Exactly 54 scheduled orders with counts of 4, 6, 8, 10, 12, and 14
- Every ticket is cumulative: Level 2 always includes burger and fries; Level 3 adds milkshake; Levels 4–6 add spicy chicken, ice cream, and pizza
- Complete six-level logic simulation through both assigned paths
- 54 scheduled orders and one matched complaint remake completed in each path
- Correct total of 55 successful serves when the remake is included
- Shortened timer schedule of 33, 35, 37, 42, 44, and 50 seconds for Levels 1–6
- Shared maximum of 900 Burger Borough Bucks
- Shared 10-stage progression, displayed as 5.0 stars in the narrative path and neutral progress in the gameplay-only path
- Linear automatic employee and campaign sequence in `game-1`
- No employee-selection, recovery-policy, customization, or reward-redemption choice added to the core gameplay
- Exact ticket selection preserved after exit review and gameplay resume
- Separate exit-attempt, resume, first-exit, and final early-exit measures
- Five-error Rush Failed trigger and current-level retry while preserving prior progress
- Identical 39-field payload schema across both paths
- Exact agreement among the 39 payload fields, Qualtrics listener allowlist, and Survey Flow field list
- Story-only fields populated in `game-1` and explicitly marked `not-applicable` in `game-2`
- Qualtrics listener rejection of an unapproved origin and unexpected field
- Qualtrics progress storage without premature survey advancement
- Final Qualtrics acknowledgement and survey advancement
- Static check showing no external scripts, fonts, images, analytics, or participant-facing condition labels

## Required live checks before recruitment

The packaging environment did not contain a compatible browser binary, so no claim is made that visual animations were browser-verified here. After publication:

1. Complete both direct GitHub Pages paths on a laptop.
2. Complete both paths on a phone.
3. Verify the final-five-second danger state, red error feedback, Rush Failed screen, ticket-review control, scrolling, and resume behavior.
4. Run full-completion and early-exit cases through a published anonymous Qualtrics link.
5. Export responses and confirm all 39 gameplay fields are populated as documented.

Do not recruit participants until these live checks pass.
