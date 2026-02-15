import { z } from 'zod'

// 1. Define the roles as a reusable Enum
export const UserRoleEnum = z.enum(['TRAINEE', 'TRAINER'])
export type UserRole = z.infer<typeof UserRoleEnum>

// 2. The standard User profile (what lives in Firestore)
export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(2, 'Name is required'),
  role: UserRoleEnum.nullable(),
  trainerId: z.string().optional(), // Used by Trainees
  inviteCode: z.string().optional(), // Used by Trainers
})

// 3. The Onboarding / Creation Schema
// This is what the UI form will use.
export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: UserRoleEnum,
})

export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
