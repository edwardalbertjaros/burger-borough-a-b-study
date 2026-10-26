# GitHub Pages and Qualtrics setup

## 1. Publish these files

Upload every file in this folder to the top level of the public GitHub repository `burger-borough-study`. Keep GitHub Pages set to `main` and `/ (root)`.

Confirm these paths open after deployment:

```text
https://edwardalbertjaros.github.io/burger-borough-study/game-1.html?reset=1
https://edwardalbertjaros.github.io/burger-borough-study/game-2.html?reset=1
```

Do not direct participants to the repository root. The root intentionally has no condition chooser.

## 2. Declare Embedded Data

These instructions target Qualtrics' New Survey Taking Experience. At the beginning of Survey Flow, add one Embedded Data element containing these blank fields exactly as written:

```text
__js_bb_condition
__js_bb_game_version
__js_bb_completed_level
__js_bb_current_level
__js_bb_current_order
__js_bb_total_score
__js_bb_reward_tier
__js_bb_reward_choice
__js_bb_ended_early
__js_bb_exit_reason
__js_bb_total_seconds
__js_bb_active_seconds
__js_bb_level_times
__js_bb_level_scores
__js_bb_level_errors
__js_bb_level_timeouts
__js_bb_restarts
__js_bb_orders_served
__js_bb_scheduled_orders_completed
__js_bb_orders_attempted
__js_bb_incorrect_submissions
__js_bb_timer_expirations
__js_bb_accuracy_percent
__js_bb_average_order_seconds
__js_bb_best_streak
__js_bb_complaint_remakes
__js_bb_story_choices
__js_bb_campaign_results
__js_bb_recovery_choice
```

Also declare `game_file` without the `__js_` prefix. Qualtrics automatically supplies its own `ResponseId`; do not add a Response ID to the GitHub URL.

## 3. Randomize the assigned page

In Survey Flow, create a Randomizer that evenly presents one of two branches:

- Branch 1 sets `game_file` to `game-1.html`.
- Branch 2 sets `game_file` to `game-2.html`.

Never display `game_file` to participants.

## 4. Embed the assigned game

Place a Descriptive Text question in the game block. In its HTML source editor, insert:

```html
<iframe
  id="burgerBoroughGame"
  title="Burger Borough restaurant game"
  src="https://edwardalbertjaros.github.io/burger-borough-study/${e://Field/game_file}"
  style="width:100%;height:820px;border:0;border-radius:16px"
  allow="fullscreen">
</iframe>
```

If the account does not pipe `game_file` into question HTML, place a separate game question inside each randomized branch and use the corresponding fixed URL.

## 5. Add the result listener

Open the game question's Question Behavior → JavaScript editor and paste the complete contents of `qualtrics-listener.js`. It is already restricted to the exact GitHub Pages origin:

```text
https://edwardalbertjaros.github.io
```

The listener verifies both the origin and the exact iframe window. It hides the Qualtrics Next button, stores progress after each completed level, acknowledges the final payload, and advances only after the participant selects Send Results and Continue to Survey.

## 6. Run a published-survey test

Use the published anonymous survey link rather than relying only on Preview. Complete and export at least these cases:

1. Full completion through `game-1.html`.
2. Full completion through `game-2.html`.
3. Early exit from each path.
4. At least one incorrect order and one timer expiration.
5. The Level 5 complaint remake.
6. A level restart.
7. Each final reward-response option.

Recruitment must wait until both paths generate complete Qualtrics rows and the only condition-specific differences are the planned story fields.
