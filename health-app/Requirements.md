# Requirements: Symptom Tracker

## Overview
Symptom Tracker is a personal health logging app that allows patients to record gastrointestinal symptoms, manage emergency contacts, and generate a summary report to share with healthcare providers. It serves patients who need to track recurring symptoms for medical appointments.

## Functional Requirements

### Patient Management

| ID | Requirement |
|----|-------------|
| REQ-001 | WHEN the user taps "New Patient", THE SYSTEM SHALL display a form to create a new patient profile |
| REQ-002 | WHEN the user enters a patient name and taps "Save Profile", THE SYSTEM SHALL store the patient and display a confirmation message |
| REQ-003 | WHEN the user is on the patient list, THE SYSTEM SHALL display all saved patients with their name, gender, age, date of birth, and symptom count |
| REQ-004 | WHEN the user taps a patient name, THE SYSTEM SHALL load that patient's profile and symptom history |
| REQ-005 | WHEN the user updates a patient's profile fields (name, gender, age, DOB) and taps "Save Profile", THE SYSTEM SHALL persist the changes |
| REQ-006 | WHEN no patients exist, THE SYSTEM SHALL display "No patients saved yet." on the patient list |

### Profile Management

| ID | Requirement |
|----|-------------|
| REQ-010 | WHEN the user is in the Profile tab, THE SYSTEM SHALL display editable fields for full name, gender, age, and date of birth |
| REQ-011 | WHEN the user leaves the "Save Profile" button disabled and attempts to save, THE SYSTEM SHALL prevent submission if the name field is empty |
| REQ-012 | WHEN the user saves a profile, THE SYSTEM SHALL display "Saved ✓" in green text for 1.5 seconds |

### Emergency Contacts

| ID | Requirement |
|----|-------------|
| REQ-020 | WHEN the user enters a contact name, relationship, and phone number and taps "+ Add Contact", THE SYSTEM SHALL save the contact to the patient record |
| REQ-021 | WHEN the user taps the edit button (✏️) on a contact, THE SYSTEM SHALL populate the contact fields for editing |
| REQ-022 | WHEN the user edits a contact's fields and taps "Save Changes", THE SYSTEM SHALL update the contact in the patient record |
| REQ-023 | WHEN the user taps the delete button (✕) on a contact, THE SYSTEM SHALL display a confirmation dialog with "Yes, remove" and "Cancel" options |
| REQ-024 | WHEN the user confirms deletion of a contact, THE SYSTEM SHALL remove the contact from the patient record |
| REQ-025 | WHEN the user cancels the add/edit form by tapping "Cancel", THE SYSTEM SHALL clear all contact input fields and exit edit mode |
| REQ-026 | WHEN the add contact form is incomplete (missing name or phone), THE SYSTEM SHALL disable the "+ Add Contact" button |
| REQ-027 | WHEN a patient has no emergency contacts, THE SYSTEM SHALL display "No emergency contacts" state with only the input form visible |

### Symptom Logging

| ID | Requirement |
|----|-------------|
| REQ-030 | WHEN the user is in the Log tab, THE SYSTEM SHALL display a form with symptom type, severity slider, time picker, and optional notes field |
| REQ-031 | WHEN the user selects a symptom type from the dropdown, THE SYSTEM SHALL offer options: "Vomiting", "Running stomach", "Nausea", "Stomach pain", "Other" |
| REQ-032 | WHEN the user adjusts the severity slider (1–5), THE SYSTEM SHALL display the corresponding label: "Mild" (1–2), "Moderate" (3), or "Severe" (4–5) |
| REQ-033 | WHEN the user leaves the time field blank, THE SYSTEM SHALL default to the current date and time |
| REQ-034 | WHEN the user enters optional notes and taps "Log Symptom", THE SYSTEM SHALL save the symptom with all fields |
| REQ-035 | WHEN the user taps "Log Symptom", THE SYSTEM SHALL add the symptom to the symptom history and navigate to the History tab |
| REQ-036 | WHEN a symptom is logged, THE SYSTEM SHALL associate it with the current patient and persist the data |

### Symptom History

| ID | Requirement |
|----|-------------|
| REQ-040 | WHEN the user is in the History tab, THE SYSTEM SHALL display all logged symptoms in reverse chronological order (newest first) |
| REQ-041 | WHEN a symptom is displayed, THE SYSTEM SHALL show its type, severity badge (color-coded), date and time, and notes (if present) |
| REQ-042 | WHEN a severity level is "Mild" or lower, THE SYSTEM SHALL display the badge with yellow background and text |
| REQ-043 | WHEN a severity level is "Moderate", THE SYSTEM SHALL display the badge with orange background and text |
| REQ-044 | WHEN a severity level is "Severe" or higher, THE SYSTEM SHALL display the badge with red background and text |
| REQ-045 | WHEN no symptoms are logged, THE SYSTEM SHALL display "No symptoms logged yet." on the History tab |

### Doctor Summary

| ID | Requirement |
|----|-------------|
| REQ-050 | WHEN the user is in the Summary tab, THE SYSTEM SHALL display the patient's profile information (name, gender, age, DOB) |
| REQ-051 | WHEN the user is in the Summary tab, THE SYSTEM SHALL display all emergency contacts with name, relationship, and phone number on a red-tinted background |
| REQ-052 | WHEN the user is in the Summary tab, THE SYSTEM SHALL display a complete chronological list of all logged symptoms with type, severity, time, and notes |
| REQ-053 | WHEN symptoms exist, THE SYSTEM SHALL display the total count and the date/time range (earliest to latest) |
| REQ-054 | WHEN the user is in the Summary tab, THE SYSTEM SHALL display a disclaimer: "⚠️ This is a personal symptom log, not a medical diagnosis." |
| REQ-055 | WHEN no symptoms are logged, THE SYSTEM SHALL display "No symptoms logged yet." on the Summary tab |
| REQ-056 | WHEN the user is on the Summary tab, THE SYSTEM SHALL be suitable for printing or sharing with a healthcare provider |

### Navigation

| ID | Requirement |
|----|-------------|
| REQ-060 | WHEN the user is viewing a patient detail, THE SYSTEM SHALL display four tabs: Profile, Log, History, Summary |
| REQ-061 | WHEN the user taps a tab, THE SYSTEM SHALL switch to that view |
| REQ-062 | WHEN the user taps "← Patients", THE SYSTEM SHALL return to the patient list |
| REQ-063 | WHEN the user is on the patient list, THE SYSTEM SHALL display the app title "Symptom Tracker" and subtitle "Select a patient or create a new one" |

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-001 | THE SYSTEM SHALL persist all patient data (profiles, symptoms, contacts) between sessions |
| NFR-002 | THE SYSTEM SHALL be responsive and function on mobile devices (iPhone, Android) with a max-width layout of 448px |
| NFR-003 | THE SYSTEM SHALL display a clean, accessible interface with readable typography, sufficient color contrast, and intuitive spacing |
| NFR-004 | THE SYSTEM SHALL use a professional blue color scheme (#2563EB) for primary actions and neutral grays for backgrounds |
| NFR-005 | THE SYSTEM SHALL provide visual feedback (hover states, disabled states, save confirmation) for all interactive elements |
| NFR-006 | THE SYSTEM SHALL load and respond to user input within 300ms on typical mobile hardware |

## Design Notes

**Layout & Structure:**
- Single-column mobile-first layout with max-width container
- Tab-based navigation to organize four distinct views (Profile, Log, History, Summary)
- Consistent card-based design for patient list and symptom cards
- Safe spacing at top and bottom to avoid notches/home indicators

**Color Scheme:**
- Primary action: Blue (#2563EB) for buttons, active tabs, links
- Severity badges: Yellow (mild), Orange (moderate), Red (severe)
- Backgrounds: Light gray (#F3F4F6) for page, white for cards/forms
- Emergency contact background: Light red tint (#FEF2F2) to denote importance

**Interactive States:**
- Buttons show hover/active feedback and disabled states when form is incomplete
- Tabs highlight active state with blue background and white text
- Contact cards highlight in blue when being edited
- Confirmation dialogs require explicit user action before deletion

**Empty/Loading/Error States:**
- Empty patient list: "No patients saved yet."
- Empty symptom history: "No symptoms logged yet."
- Empty contacts: Contact list hidden; only input form shown
- Save confirmation: "Saved ✓" flash in green for 1.5 seconds
- Form validation: Disabled submit buttons until required fields are complete

**Responsive Behavior:**
- Input fields and buttons scale full-width on mobile
- Symptom severity slider uses device accent color (blue)
- Timestamps format to readable locale-specific strings (e.g., "Jan 15, 2024, 2:30 PM")
- Patient list cards stack vertically with shadow and hover lift effect