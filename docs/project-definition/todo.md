# ⚡ Shapeshift Development Backlog

## 🟢 Phase 1: Foundation & Shared Logic

_Focus: Setting up the "Script" (Schemas) and "Stage" (UI Theme)_

- [ ] **Infrastructure Setup**
  - [ ] Initialize Firebase Project (Auth & Firestore)
  - [ ] Configure Environment Variables (`apps/web/.env` and `apps/functions/.env`)
  - [ ] Run `pnpm install` and verify `pnpm precheck` passes
- [ ] **Shared Schemas (`packages/shared`)**
  - [ ] Define `UserSchema` (id, role: trainee/trainer, isPremium)
  - [ ] Define `WorkoutSchema` (traineeId, exercises, muscleGroups, timestamp)
  - [ ] Define `ConnectionSchema` (trainerId, traineeId, status)
- [ ] **Design System (`packages/ui`)**
  - [ ] Customize `tailwind.config.ts` with Shapeshift brand colors
  - [ ] Initialize Shadcn components: `Button`, `Card`, `Input`, `Badge`, `Tabs`

## 🟡 Phase 2: Auth & API Gateway

_Focus: Connecting the Messenger (tRPC) and checking IDs (Zod)_

- [ ] **tRPC Backend (`apps/functions`)**
  - [ ] Create `authRouter`: Handle user onboarding and role assignment
  - [ ] Implement `context.ts`: Extract Firebase Auth token from headers
  - [ ] Create `protectedProcedure` middleware for authenticated routes
- [ ] **Frontend Auth (`apps/web`)**
  - [ ] Implement Login/Sign-up pages using Firebase Auth
  - [ ] Create `RoleGate` component to redirect users based on `trainee` or `trainer` role

## 🟠 Phase 3: Trainee Core (Epic 1)

_Focus: The workout logging engine_

- [ ] **Workout API**
  - [ ] `workout.create` mutation: Save workout data to Firestore
  - [ ] `workout.getHistory` query: Fetch previous logs for the trainee
- [ ] **Trainee UI**
  - [ ] Build "Log Workout" form using `react-hook-form` + `@repo/shared` schemas
  - [ ] Implement muscle group selector (Multi-select)
  - [ ] Create "Muscle Heat Map" visualization component

## 🔵 Phase 4: Trainer Portal & Connections (Epic 2)

_Focus: Real-time collaboration_

- [ ] **Connection Logic**
  - [ ] `connection.invite`: Generate unique link/code for trainees
  - [ ] `connection.getClients`: Query to list all active trainees for a trainer
- [ ] **Trainer Dashboard**
  - [ ] Build "Client Overview" grid using `@repo/ui/Card`
  - [ ] Implement real-time "Activity Feed" using TanStack Query's subscription/refetch logic
  - [ ] Add "Feedback" mutation to allow trainers to comment on workouts

## 🔴 Phase 5: SaaS & Analytics (Epics 4 & 5)

_Focus: Monetization and data optimization_

- [ ] **SaaS Logic**
  - [ ] Create `premiumMiddleware` in tRPC to check connection limits (Max 3 for free)
  - [ ] Integration: Set up Stripe webhook listener in Cloud Functions
- [ ] **Wearable Sync**
  - [ ] Research and implement Apple HealthKit bridge for data normalization

---

## ✅ Completed Tasks

- [x] Finalize Product Design Document (`docs/product-design.md`)
- [x] Finalize Technical Design Document (`docs/technical-design.md`)
- [x] Choose Monorepo Naming Conventions
