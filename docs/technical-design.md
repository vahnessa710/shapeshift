# Technical Design Document: Shapeshift (Hytel Stack)

## 1. System Architecture

Shapeshift utilizes a monorepo managed by **Turborepo** and **pnpm**.

- **Frontend (`apps/web`):** A Vite-powered React SPA. It uses **TanStack Query** to fetch data via the **tRPC** client.
- **Backend (`apps/functions`):** A tRPC server hosted as a Firebase Cloud Function. It handles business logic, database interaction, and third-party integrations.
- **Shared Logic (`packages/shared`):** The "Source of Truth" containing **Zod schemas** that validate data on both the frontend (forms) and backend (API).
- **UI System (`packages/ui`):** A dedicated design system using **Shadcn UI** and **Tailwind CSS**.

---

## 2. Core Data Model (Firestore)

We will follow a document-based NoSQL structure. Validation is enforced by `packages/shared/src/schemas`.

### Collections & Schemas

| Collection    | Zod Schema         | Description                                              |
| ------------- | ------------------ | -------------------------------------------------------- |
| `users`       | `UserSchema`       | Profiles, roles (`trainee` vs `trainer`), and SaaS tier. |
| `workouts`    | `WorkoutSchema`    | Logged exercises, muscle groups, and duration.           |
| `meals`       | `MealSchema`       | Nutritional tracking (calories, macros).                 |
| `connections` | `ConnectionSchema` | Mapping of `trainerId` to `traineeId` with status.       |

---

## 3. tRPC API Strategy

Since we aren't using the client-side Firebase SDK for data, we define **Procedures** in `apps/functions/src/trpc/`.

### Example Procedure: Logging a Workout

1. **Input:** `CreateWorkoutSchema` (from `@repo/shared`).
2. **Logic:** \* Verify the user is authenticated.

- Calculate muscle fatigue based on the exercises provided.
- Write to Firestore.

3. **Output:** The created workout object.

### Example Procedure: Trainer Dashboard

1. **Input:** `TraineeId`.
2. **Logic:** \* Check `connections` collection to ensure the requester is actually the trainer for this user.

- Fetch last 7 days of workouts.

---

## 4. Third-Party Integrations

For a professional PDD, we must link to our primary sources of truth for integrations.

### A. Health & Wearables (Apple Watch)

We will use a bridge to bring HealthKit data into our web environment.

- **Primary Tool:** [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API) or a companion mobile wrapper.
- **Integration Point:** Data is normalized in `@repo/shared` and sent to the `healthSync` tRPC procedure.

### B. Payment & SaaS (Stripe)

- **Tool:** [Stripe Node SDK](https://github.com/stripe/stripe-node).
- **Logic:** A Cloud Function webhook listens for `invoice.paid` events and updates the `isPremium` flag in the Firestore `users` document.

### C. UI Components

- **Library:** [Shadcn UI](https://ui.shadcn.com/).
- **Customization:** All brand colors for "Shapeshift" (e.g., Electric Lime/Dark Slate) are defined in `packages/ui/tailwind.config.ts`.

---

## 5. Security & Infrastructure

### RBAC (Role-Based Access Control)

We utilize **tRPC Middlewares** to protect routes.

- `protectedProcedure`: Ensures the user is logged in.
- `trainerProcedure`: Ensures `ctx.user.role === 'trainer'`.

### CI/CD Pipeline

- **Linter:** `pnpm lint` (Shared config in `packages/eslint-config`).
- **Tests:** `pnpm test` (Vitest).
- **Deployment:** Automated via GitHub Actions using **Workload Identity Federation (WIF)** to Firebase.

---

## 6. Development Workflow

1. **Define Schema:** Add a new Zod schema in `packages/shared/src/schemas/workout.ts`.
2. **Create Procedure:** Add a tRPC query/mutation in `apps/functions/src/trpc/routers/`.
3. **Build UI:** Create a component in `packages/ui/components/`.
4. **Connect:** Use `trpc.workout.create.useMutation()` in `apps/web/src/App.tsx`.

---
