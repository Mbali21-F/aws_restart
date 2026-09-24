# Steering: Symptom Tracker

## Goal
Build a production-ready personal health tracking app where patients can log gastrointestinal symptoms, manage emergency contacts, and generate a summary report to share with doctors.

## Context
This was prototyped in PartyRock. The `src/` folder contains reference code from that prototype — use it to understand intended behavior, NOT as production code to copy. The user is handing off a product idea, not a codebase.

## Instructions

1. Read `Requirements.md` for the full product specification.
2. Reference the code in `src/` to understand:
   - How components interact (patient list → detail → tabs → forms)
   - The intended user flow and interactions (create patient → edit profile → log symptoms → view summary)
   - What state is managed and where (patient CRUD, contact CRUD, symptom logging)
3. The reference code is a PROTOTYPE with sandbox constraints (no localStorage, no forms, shared JS runtime). Your implementation should use proper architecture (a real database, authentication if needed, proper state management).

## Guidance

- **Simplify jargon.** The user likely does NOT have a technical background. Explain choices in plain language.
- **Ask clarifying questions.** The user has NOT specified a tech stack, target users, deployment environment, or scale. Before architecting, ask:
  - Who are the end users? (e.g., patients in a specific country or clinic?)
  - Where will this run? (web browser, mobile app, both?)
  - How many patients per user? (personal tracking vs. clinic-wide tool?)
  - Does data need to be backed up? Shared with healthcare providers? (affects sync strategy)
- **Recommend a simple tech stack first.** Suggest a default (e.g., React + TypeScript + Supabase) and explain why, then offer alternatives if the user prefers.
- **Prioritize speed to working demo.** Get a basic version (patient profile + symptom log + history) running in front of the user quickly; add polish and features later.
- **Flag missing features.** The prototype does not persist data. Ask: Should this sync to the cloud? Export as PDF? Send alerts?

## Key Prototype Behaviors to Preserve

- Multi-tab interface (Profile, Log, History, Summary)
- Color-coded severity badges
- Emergency contact management with inline edit/delete
- Doctor summary with patient info and date range
- Mobile-first responsive design
- Form validation and save confirmation feedback