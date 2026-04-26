# MCQ Quality Upgrade Guide

## Difficulty policy
- Easy: max 10%
- Medium: min 50%
- Hard: min 40%
- No one-line trivial recall unless it supports a multi-step set.

## Formatting policy
- Question stem must be complete and specific.
- Options must be balanced in length and plausibility.
- Use one correct answer only.
- Avoid repeated template wording across image-type questions.
- Prefer numeric distractors close to the correct value (for calculation questions).

## Image-type policy
- Use image metadata in stem as: `[Image Prompt] ...`
- Cover varied image tasks:
  - charts (bar, line, pie)
  - geometric figures
  - coordinate plots
  - visual patterns

## File added
- `mcq_medium_hard_bank.json` (20 curated medium/hard questions)

## Integration note
Current frontend fetches quiz content from backend endpoint:
- `/api/learners/{learnerId}/quiz/{assessmentId}`

So backend question source must be updated for live quiz quality to change.
