# Student Wellness Check-In

A browser-based, front-end prototype for the HCIN6222 Student Wellness Check-In project. It follows the visual direction of the supplied Figma screens: warm off-white background, muted green accents, rounded cards and a calm, minimal layout.


## Features
- Home page and working navigation.
- Daily check-in form with required response validation and optional note.
- Review screen before saving.
- Save confirmation.
- Check-in history stored in browser local storage.
- Delete individual entries or clear all history.
- Support information and privacy/boundaries page.
- Responsive layout for desktop and mobile.
- Keyboard-visible focus indicators and reduced-motion preference support.


## Data and privacy limitations
This is an academic demonstration prototype. Check-ins are stored in `localStorage` in the current browser profile. They are not uploaded to a server or shared between devices. Anyone with access to the same browser profile may be able to view the entries. Clearing browser site data may remove them. Do not enter sensitive personal or medical information, and do not use this prototype as a real student counselling or emergency service.

A production service handling real student wellness information would need an appropriately secured backend, authentication, access controls, retention and deletion policies, privacy review, and applicable legal compliance. These are outside the scope of this front-end prototype.

## Accessibility note
The interface includes semantic headings, form labels, fieldsets, keyboard-operable controls, visible focus states, status announcements and responsive/reduced-motion styling. These design choices do not by themselves establish WCAG 2.0 conformance; formal testing with keyboard-only navigation, screen readers, contrast tools and representative users is still required.
