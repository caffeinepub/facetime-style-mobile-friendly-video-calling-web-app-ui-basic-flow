# Specification

## Summary
**Goal:** Build a mobile-first, FaceTime-inspired video calling web app with core UI screens, Internet Identity sign-in, per-user contacts, and a prototype call-session flow backed by a Motoko canister.

**Planned changes:**
- Create responsive routes/pages for Sign in, Contacts, Start/Join Call, In Call, and Call Ended with client-side navigation.
- Integrate Internet Identity authentication; gate contacts/call routes behind sign-in and display the signed-in principal with sign-out.
- Implement Motoko backend methods to add/list/delete contacts scoped to the caller principal; build a contacts UI using React Query for fetching/caching.
- Add a call session canister flow: create session (join code), join/leave by code, and poll session state to show participant/status updates.
- Build an in-call UI with local camera preview via `getUserMedia`, call controls (mute, camera toggle, speaker placeholder, end call), and ensure ending a call stops local media tracks.
- Apply a cohesive non-blue/non-purple visual theme across all screens with accessible control styling and focus states.
- Add and reference generated static assets (app icon + subtle background/hero) from `frontend/public/assets/generated` and render them in the UI.

**User-visible outcome:** Users can sign in with Internet Identity, manage a personal contacts list, create or join a prototype call session via a shareable code/link, see participant status updates via polling, and interact with a FaceTime-like in-call screen including a local camera preview and call controls.
