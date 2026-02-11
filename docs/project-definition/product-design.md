# Product Design Document: Shapeshift

**Project:** Collaborative SaaS Fitness Platform
**Architecture:** Monorepo (Shared Types, API/Functions, Trainee App, Trainer Dashboard)
**Stack:** Firebase (Auth, Firestore, Hosting, Functions)
**Model:** Freemium SaaS

---

## 1. Product Overview

**Shapeshift** is a streamlined fitness ecosystem that bridges the gap between logging and coaching. It allows trainees to track their weight and workouts while granting trainers real-time, read-only access to their progress. The platform focuses on accountability through a secure "Invite Code" handshake, ensuring that data sharing is always user-consented and easy to manage.

---

## 2. Target Audience

| Persona         | Role                 | Primary Need                                                                      |
| --------------- | -------------------- | --------------------------------------------------------------------------------- |
| **The Trainee** | Fitness Enthusiast   | Wants to track weight loss and gym progress while getting professional oversight. |
| **The Trainer** | Fitness Professional | Wants a centralized hub to monitor client progress without manual data exports.   |

---

## 3. Epics & User Stories (Finalized)

### Epic 1: Identity & Access Management

- **Authentication:** As a user (Trainee or Trainer), I want to authenticate via Google or Email so that my personal fitness data remains secure and accessible only to me.
- **Onboarding/Role Selection:** As a first-time user, I want to select my role (Trainee or Trainer) during onboarding so that the application presents the correct dashboard and permissions.

### Epic 2: Workout & Weight Tracking (Trainee)

- **Weight Logging:** As a trainee, I want to log my body weight daily so I can see a progress chart of my weight loss.
- **Workout Logs:** As a trainee, I want to select a workout type (e.g., "Full Body") and log the sets, reps, and weight for exercises.
- **Progress Visualization:** As a trainee, I want a calendar view to see which days I worked out and which days were rest days.

### Epic 3: Collaborative Coaching (Trainer RBAC)

- **Invite System:** As a trainer, I want to generate a unique "Invite Code" so that I can securely link my account to specific trainees without manual email management.
- **Granular Permissions:** As a trainee, I want to input a trainer's code to grant them **read-only** access to my logs, maintaining control over my health data.
- **Trainer Dashboard:** As a trainer, I want a real-time dashboard of my connected trainees to monitor their recent weight entries and workout logs.

---

## 4. Technical Architecture

1. **Firebase Auth:** Handles the "Email/Google" authentication. Upon role selection, a **Custom Claim** (e.g., `{ role: 'trainer' }`) is added to the user’s token to gate specific dashboard features.
2. **Invite Logic:** A Cloud Function generates a short-lived, unique alphanumeric string stored in a `codes` collection, mapped to a `trainerId`.
3. **Real-time Sync:** The Trainer Dashboard uses Firestore `onSnapshot()` listeners on the `workouts` and `weight_entries` collections of their linked trainees.

---

## 5. Database Schema (Firestore)

### Collection: `users`

```typescript
{
  uid: "string",
  email: "string",
  role: "trainee" | "trainer", // Defined during onboarding
  trainerCode: "string",       // Only for Trainers
  connectedTrainerId: "string" // Only for Trainees
}

```

### Collection: `weight_entries`

```typescript
{
  traineeId: "string",
  weight: number,
  unit: "kg" | "lbs",
  timestamp: Timestamp
}

```

### Collection: `workouts`

```typescript
{
  traineeId: "string",
  workoutType: "Full Body" | "Push" | "Pull" | "Legs",
  exercises: [
    { name: "Squat", sets: 3, reps: 10, weight: 100 }
  ],
  timestamp: Timestamp
}

```

---

## 6. Security & Constraints

- **Read-Only RBAC:** Firestore Security Rules ensure that while a Trainer can _read_ a trainee's data (if the `trainee.connectedTrainerId` matches the `trainer.uid`), they are strictly forbidden from _writing_ or _editing_ the trainee's logs.
- **Data Isolation:** Trainees cannot see other trainees' data, even if they share the same trainer.

---

## 7. Success Metrics (KPIs)

- **Onboarding Completion:** Percentage of users who successfully select a role and complete their first log.
- **Connection Rate:** Average time it takes for a trainee to link to a trainer after account creation.
- **Retention:** Weekly active users (WAU) logging either weight or a workout.

---
