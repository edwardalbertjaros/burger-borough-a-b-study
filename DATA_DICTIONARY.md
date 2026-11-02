# Burger Borough Version 9 compact data dictionary

Version 9.1 uses five predeclared Qualtrics Embedded Data fields instead of 51 separate fields. Four fields support assignment and routing. One JSON field preserves the complete 50-metric gameplay record.

## Fields to predeclare in Survey Flow

| Survey Flow field | Purpose |
|---|---|
| `game_file` | Assigned GitHub page: `game-1.html` or `game-2.html` |
| `__js_bb_access_status` | Integration state: `ready` or `technical_failure` |
| `__js_bb_exposure_level` | `not_started`, `minimal_exposure`, `exposed`, or `completed` |
| `__js_bb_condition` | Internal condition: `game-1` or `game-2` |
| `__js_bb_payload_json` | JSON string containing the full gameplay record |

The listener calls `setJSEmbeddedData()` with the names `bb_access_status`, `bb_exposure_level`, `bb_condition`, and `bb_payload_json`. Qualtrics automatically applies the `__js_` prefix.

## Keys inside `bb_payload_json`

| JSON key | Meaning |
|---|---|
| `bb_condition` | Neutral internal path: `game-1` or `game-2` |
| `bb_game_version` | Exact deployed build identifier |
| `bb_completed_level` | Highest fully completed level, 0–6 |
| `bb_current_level` | Level active when gameplay ended |
| `bb_current_order` | Scheduled order active when gameplay ended |
| `bb_total_score` | Internal score from fully completed levels |
| `bb_bucks_earned` | Final BB$ after deductions, from 0 to 900 |
| `bb_gross_bucks` | BB$ earned before deductions |
| `bb_late_penalty` | Total BB$ deducted for late orders |
| `bb_incorrect_penalty` | Total BB$ deducted for incorrect complete trays |
| `bb_progress_stage` | Shared displayed progression stage, 0–10 |
| `bb_reward_offer` | Constant identifier `fixed-burger-fries-20` |
| `bb_exposure_level` | Exposure classification |
| `bb_ended_early` | Whether gameplay was finalized before six-level completion |
| `bb_exit_reason` | `in_progress`, `completed`, voluntary exit, level failure, or technical failure |
| `bb_exit_attempts` | Initiated voluntary or failure-related exits |
| `bb_resumed_after_exit` | Whether gameplay resumed after exit review |
| `bb_resume_count` | Returns to gameplay after exit review |
| `bb_first_exit_level` | Level active at first exit attempt |
| `bb_first_exit_order` | Order active at first exit attempt |
| `bb_first_exit_active_seconds` | Active seconds accumulated at first exit attempt |
| `bb_total_seconds` | Total elapsed browser-session time |
| `bb_active_seconds` | Time actively preparing orders |
| `bb_experience_seconds` | Foreground time on gameplay-experience screens |
| `bb_progression_screen_seconds` | Foreground time on progression screens |
| `bb_paused_seconds` | Protected pause time |
| `bb_pause_count` | Participant-initiated pauses |
| `bb_automatic_pause_count` | Tab-hide pauses |
| `bb_level_times` | Comma-separated active seconds for Levels 1–6 |
| `bb_level_scores` | Comma-separated completed-level internal scores |
| `bb_level_errors` | Comma-separated incorrect submissions by level |
| `bb_level_timeouts` | Comma-separated timer expirations by level |
| `bb_level_failures` | Comma-separated Rush Failed counts by level |
| `bb_total_level_failures` | Total Rush Failed sequences |
| `bb_restarts` | Comma-separated level restarts |
| `bb_orders_served` | All correct serves, including repeated serves after restart |
| `bb_scheduled_orders_completed` | Net progress through the 27 scheduled orders |
| `bb_orders_attempted` | Complete trays submitted, correct or incorrect |
| `bb_incorrect_submissions` | Complete trays that did not match the ticket |
| `bb_timer_expirations` | Orders completed after timer expiration |
| `bb_accuracy_percent` | Correct serves divided by all submissions |
| `bb_average_order_seconds` | Mean active seconds for correct serves |
| `bb_best_streak` | Longest correct-serving streak |
| `bb_level1_choice` | Level 1 employee ID or neutral plan ID |
| `bb_level2_choice` | Level 2 employee ID or neutral plan ID |
| `bb_level3_choice` | Level 3 employee ID or neutral plan ID |
| `bb_level4_choice` | Level 4 employee ID or neutral plan ID |
| `bb_level5_choice` | Level 5 employee ID or neutral plan ID |
| `bb_level6_choice` | Level 6 employee ID or neutral plan ID |
| `bb_story_choices` | Employee IDs in `game-1`; `not-applicable` in `game-2` |

## Why JSON is used

Qualtrics' New Survey Taking Experience does not make undeclared JavaScript fields reliably available in recorded exports. The former `setEmbeddedData()` method is deprecated and unavailable. `setJSEmbeddedData()` is supported, but Qualtrics requires fields that must appear in response data to be declared in Survey Flow.

The previous 51-field schema created one export column for every metric plus `bb_access_status`. That was convenient for immediate analysis but unnecessary for transfer and burdensome to configure. The compact schema stores all metrics in one declared JSON column while keeping condition, exposure, and access status separately available for Survey Flow logic.

Qualtrics documents a 20 KB limit for each Embedded Data value. The listener rejects JSON above 19,000 bytes as a safety margin. The Version 9 gameplay payload is substantially below that limit.

## Expanding JSON after export

In Python with pandas:

```python
import json
import pandas as pd

responses = pd.read_csv("qualtrics_export.csv")
payload = responses["__js_bb_payload_json"].fillna("{}").map(json.loads)
gameplay = pd.json_normalize(payload)
analysis = pd.concat([responses.drop(columns=["__js_bb_payload_json"]), gameplay], axis=1)
analysis.to_csv("qualtrics_export_expanded.csv", index=False)
```

Keep the original JSON column with the archived raw data. Use the expanded columns for statistical analysis.

## Eligibility

Only `exposed` and `completed` participants should enter Consumer Engagement, Narrative Progression, and Reward Redemption Intentions. Technical failures, `not_started`, `minimal_exposure`, blank, and unexpected states must branch to a termination element.

Every eligible participant sees the same fictional offer: **20% off one burger-and-fries order during a hypothetical in-person Burger Borough visit**.
