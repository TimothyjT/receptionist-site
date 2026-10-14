# Sample-call audio — how it was made

Four sample calls for the "Hear her work" demo section on receptionist.northbeambuilds.com.
The shop (Bluebonnet Plumbing, Austin), its callers, and all names/numbers are fictional.
No real person's name, number, or address appears in the scripts, audio, or metadata.

- Engine: Kokoro-82M (quantized ONNX build, run locally) — five voices:
  Willa = af_heart; callers = am_michael, af_bella, af_nicole, am_adam.
- Scripts: written from four of the nine scenarios in the receptionist QA suite
  (RECEPTIONIST-PLAN.md §5 / delivery checklist Phase 3): booking + spell-back,
  unavailable slot + interruption, urgent keyword (burst pipe), not-in-KB question.
  The page transcripts match the spoken scripts.
- Regenerate: synthesize each turn at 24 kHz, join turns with 0.38 s of silence,
  encode MP3 (libmp3lame q:a 3), tag title/artist/comment as demo samples.
- Honest limits: these are scripted samples with synthesized voices, labeled as
  such on the page. They are NOT recordings of the live phone platform. A live
  call-in demo needs the Retell platform account approved plus a demo number
  (~$2/mo per RECEPTIONIST-PLAN.md §2); until then the section copy says so.
