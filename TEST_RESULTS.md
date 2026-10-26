# Automated test results

Build tested: `2026.10.26-tap-kitchen-v4`

## Passed

- JavaScript syntax validation for the game and Qualtrics listener
- Separate internal condition values: `game-1` and `game-2`
- Exact parity of all 54 scheduled food tickets across both paths
- Correct level counts: 4, 6, 8, 10, 12, and 14 orders
- Complete six-level simulation through each path
- 54 scheduled orders completed in each path
- One identical Level 5 complaint remake in each path
- Correct total of 55 successful serves when the remake is included
- Fictional reward progression through the combo tier
- Incorrect-order detection and recording
- Timer-expiration recording while still permitting late completion
- Voluntary early exit and early-exit payload
- Identical 29-field payload schema across both paths
- Story fields populated only in `game-1` and explicitly marked `not-applicable` in `game-2`
- Qualtrics listener rejection of an unapproved origin
- Qualtrics progress storage without premature survey advancement
- Final Qualtrics acknowledgement and survey advancement
- Exact agreement between the 29 payload fields and the 29 Survey Flow fields in `QUALTRICS_SETUP.md`

## Required live checks before recruitment

Automated logic tests cannot replace a human visual/usability pilot. After the files are published, complete both direct GitHub Pages links on a laptop and phone, then run both paths through a published anonymous Qualtrics link. Confirm layout, perceived difficulty, completion time, and exported response fields before recruiting participants.
