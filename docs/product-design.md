# Product Design Document: Shapeshift

**Project:** Collaborative SaaS Fitness Platform

**Architecture:** Monorepo (Shared Types, API/Functions, Trainee App, Trainer Dashboard)

**Stack:** Firebase (Auth, Firestore, Hosting, Functions)

**Model:** Freemium SaaS

---

## 1. Product Overview

**Shapeshift** is a collaborative fitness tracking ecosystem designed to connect casual trainees with professional trainers. Unlike standalone trackers, Shapeshift uses **real-time data synchronization** to allow trainers to monitor workouts, muscle fatigue, and nutrition as they happen. By integrating wearable data (Apple Watch), the platform provides a holistic view of a user's health, ensuring data-driven coaching and improved accountability.

---

## 2. Target Audience

| Persona         | Role                     | Primary Need                                                                                     |
| --------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| **The Trainee** | Casual/Intermediate user | Wants guided progress and a way to share workout/diet data with their trainer effortlessly.      |
| **The Trainer** | Fitness Professional     | Wants to scale their business by managing multiple clients through a single real-time dashboard. |

---

## 3. Epics & User Stories

### Epic 1: Unified Workout & Muscle Tracking

- **User Story 1:** As a trainee, I want to log my daily workouts (sets, reps, weight) so I can track my volume over time.
- **User Story 2:** As a trainee, I want to tag specific muscle groups per exercise so I can visualize my weekly body workload.
- **User Story 3:** As a trainee, I want to log rest days and mid-workout break durations to ensure I am recovering between sets.
- **User Story 4:** As a trainee, I want to see a muscle "heat map" to identify under-trained areas.

### Epic 2: The "Trainer Connect" Portal (Real-time)

- **User Story 5:** As a trainer, I want to invite clients via a unique link so I can quickly onboard them to my dashboard.
- **User Story 6:** As a trainer, I want my dashboard to update automatically when a client finishes a workout (via Firestore Listeners).
- **User Story 7:** As a trainee, I want to manage data-sharing permissions so I can control exactly what my trainer sees.
- **User Story 8:** As a trainer, I want to leave feedback/comments on a client’s workout log that they see instantly.

### Epic 3: Nutritional Logging & Habits

- **User Story 9:** As a trainee, I want to log daily meals and macros so my trainer can correlate my diet with my performance.
- **User Story 10:** As a trainee, I want to track daily habits (e.g., water intake) to build a holistic health profile.

### Epic 4: Wearable Integration & Analytics

- **User Story 11:** As a user, I want to sync Apple Watch data (heart rate/calories) into my logs automatically.
- **User Story 12:** As a trainee, I want an analytics dashboard to see how my heart rate correlates with workout intensity.

### Epic 5: SaaS Monetization

- **User Story 13:** As a free user, I want to use basic tracking, but I understand I must upgrade to link more than one trainer.
- **User Story 14:** As a trainer, I want to pay a subscription to manage more than 3 clients.

---

## 4. Technical Architecture (Firebase & Monorepo)

Since this is a monorepo using Firebase, the architecture focuses on **Shared Logic** and **Serverless Events**:

1. **`packages/shared`**: Contains TypeScript interfaces for `User`, `Workout`, and `Meal`. Both the Trainee mobile app and Trainer web dashboard import these to ensure data consistency.
2. **Firebase Firestore**: Acts as the real-time database.

- Trainee App writes to a `workouts` collection.
- Trainer Dashboard uses `onSnapshot()` to listen for changes to that collection.

3. **Firebase Auth**: Manages user roles via **Custom Claims** (e.g., `role: 'trainer'`).
4. **Firebase Cloud Functions**: Handles heavy lifting like processing analytics or checking subscription status for the SaaS "Freemium" logic.

---

## 5. Database Schema (Firestore NoSQL)

### Collection: `users`

```typescript
{
  uid: "string",
  name: "string",
  role: "trainee" | "trainer",
  isPremium: boolean,
  wearableId: "string" // e.g., Apple Watch ID
}

```

### Collection: `workouts`

```typescript
{
  traineeId: "string", // Foreign Key to users
  timestamp: Timestamp,
  exercises: [
    { name: "Bench Press", sets: 3, reps: 10, weight: 135, muscleGroup: "Chest" }
  ],
  breakDurationTotal: number, // in seconds
  trainerFeedback: "string"
}

```

### Collection: `connections`

```typescript
{
  trainerId: "string",
  traineeId: "string",
  status: "pending" | "active",
  connectedAt: Timestamp
}

```

---

## 6. Success Metrics (KPIs)

- **Engagement:** Percentage of trainees logging 3+ workouts per week.
- **Collaboration:** Average number of trainer comments per client workout.
- **Revenue:** Conversion rate of Trainers from "Free" (3 clients) to "Pro" (Unlimited).
- **Sync Rate:** Percentage of users who successfully link an Apple Watch.

---

## 7. Security & Constraints

- **Firestore Security Rules:** Must be configured so that a Trainer can _only_ read data for Trainees listed in their `connections` collection.
- **Offline Persistence:** Use Firebase's local cache so trainees can log workouts in gyms with no cellular service; data will sync once back online.

---
