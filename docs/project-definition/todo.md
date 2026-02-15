# 📝 Shapeshift Project Task List

## 🏗️ Phase 1: Foundation & Monorepo Setup

- [x] Initialize Monorepo structure (Shared Types, API/Functions, Apps).
- [x] Initialize Firebase project (Auth, Firestore, Hosting, Functions).
- [x] Define shared TypeScript interfaces based on PDD schema (`User`, `WeightLog`, `Workout`).
- [x] Configure Firestore Security Rules (Basic ownership rules).

## 🔐 Phase 2: Identity & Access Management (Epic 1)

- [x] Implement Firebase Auth (Google & Email/Password) in the Shared layer.
- [x] **Onboarding Flow:** Create role selection screen (Trainee vs. Trainer).
- [x] Create `users` collection entry on first sign-in.

## ⚖️ Phase 3: Trainee Core Features (Epic 2)

- [ ] **Weight Logging:**
- [x] Build weight input form (Value + Unit toggle).
- [x] Create weight history list/chart view.

- [ ] **Workout Logging:**
- [x] Build workout logger (Select type -> Add exercises -> Input Sets/Reps/Weight).
- [x] Implement Firestore write logic for `workoutsLogs` collection.

- [ ] **Dashboard:**
- [x] Implement Calendar view to visualize activity streaks (Workout vs. Rest days).

## 🤝 Phase 4: Collaborative Logic (Epic 3 Part A)

- [ ] **Invite System:**
- [x] Logic for Trainers to generate/refresh a unique 6-digit Invite Code.
- [x] Function to map `inviteCode` to `trainerId` in a `users` collection.

- [ ] **Handshake Logic:**
- [x] Trainee "Join Trainer" input field.
- [x] Backend validation: Match code -> Update `user.TrainerId` user.role = 'trainee' and `user.inviteCode` user.role = 'trainer'.

## 📊 Phase 5: Trainer Experience (Epic 3 Part B)

- [ ] **Trainer Dashboard:**
- [ ] Implement `onSnapshot()` listener to fetch all connected trainees.
- [ ] Create "Client Overview" list showing latest weight/workout activity.

- [ ] **Client Detail View:**
- [x] Build **Read-Only** view for a specific trainee's weight charts and workout logs.

- [ ] **Security Hardening:**
- [ ] Finalize Firestore Rules: Allow read access to trainers only if `trainee.trainerId == trainer.inviteCode`.

## 🚀 Phase 6: Polish & Launch

- [ ] **UX/UI:** Add loading states and empty state illustrations.
- [ ] **KPI Tracking:** Integrate basic analytics for onboarding completion and connection rates.
- [ ] **Deployment:** Deploy Firebase Functions and Hosting for both Trainee and Trainer apps.

---
