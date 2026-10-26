# Burger Borough gameplay data dictionary

In Qualtrics' New Survey Taking Experience, declare each game field in Survey Flow with `__js_` before the name. For example, the JavaScript field `bb_total_score` is declared as `__js_bb_total_score`.

| Field | Meaning |
|---|---|
| `bb_condition` | Neutral internal path: `game-1` or `game-2` |
| `bb_game_version` | Exact deployed build identifier |
| `ResponseId` | Qualtrics' built-in response identifier; never passed to GitHub Pages |
| `bb_completed_level` | Highest fully completed level, 0–6 |
| `bb_current_level` | Level active when gameplay ended |
| `bb_current_order` | Scheduled order active when gameplay ended |
| `bb_total_score` | Sum of scores from fully completed levels |
| `bb_reward_tier` | `none`, `fries`, `burger-fries`, or `combo` |
| `bb_reward_choice` | `redeem`, `save`, `decline`, or `none` |
| `bb_ended_early` | Whether the participant voluntarily stopped |
| `bb_exit_reason` | `completed` or voluntary exit level/order |
| `bb_total_seconds` | Total elapsed browser-session time |
| `bb_active_seconds` | Time spent actively preparing orders |
| `bb_level_times` | Comma-separated active seconds for Levels 1–6 |
| `bb_level_scores` | Comma-separated completed-level scores |
| `bb_level_errors` | Comma-separated incorrect submissions by level |
| `bb_level_timeouts` | Comma-separated timer expirations by level |
| `bb_restarts` | Comma-separated level restarts |
| `bb_orders_served` | All correct serves, including the complaint remake |
| `bb_scheduled_orders_completed` | Progress through the 54 scheduled customer orders |
| `bb_orders_attempted` | All Serve Order submissions |
| `bb_incorrect_submissions` | Submissions that did not match the ticket |
| `bb_timer_expirations` | Orders completed after the rush timer expired |
| `bb_accuracy_percent` | Correct serves divided by all serve attempts |
| `bb_average_order_seconds` | Mean active seconds for correct serves |
| `bb_best_streak` | Longest run of correct serves without an error or timeout |
| `bb_complaint_remakes` | Completed Level 5 correction remakes |
| `bb_story_choices` | Pipe-separated hire choices in `game-1`; `not-applicable` in `game-2` |
| `bb_campaign_results` | Pipe-separated campaign outcomes in `game-1`; `not-applicable` in `game-2` |
| `bb_recovery_choice` | Level 5 recovery policy in `game-1`; `not-applicable` in `game-2` |

Both assigned paths export the same field names and formats. Story-only fields use `not-applicable` in the gameplay-only path rather than disappearing from the row.
