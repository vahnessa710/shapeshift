import { describe, it, expect } from 'vitest'
import { UserSchema, CreateUserSchema, UserRoleEnum } from './user'

describe('UserRoleEnum', () => {
  it('should accept valid roles', () => {
    expect(UserRoleEnum.parse('TRAINEE')).toBe('TRAINEE')
    expect(UserRoleEnum.parse('TRAINER')).toBe('TRAINER')
  })

  it('should reject invalid roles', () => {
    expect(() => UserRoleEnum.parse('ADMIN')).toThrow()
    expect(() => UserRoleEnum.parse('admin')).toThrow()
    expect(() => UserRoleEnum.parse('')).toThrow()
  })
})

describe('UserSchema', () => {
  const validUser = {
    id: 'user123',
    email: 'test@example.com',
    name: 'John Doe',
    role: 'TRAINEE' as const,
  }

  describe('Valid User Data', () => {
    it('should validate a complete trainee user', () => {
      const trainee = {
        ...validUser,
        role: 'TRAINEE' as const,
        trainerId: 'ABC123',
      }
      expect(() => UserSchema.parse(trainee)).not.toThrow()
    })

    it('should validate a complete trainer user', () => {
      const trainer = {
        ...validUser,
        role: 'TRAINER' as const,
        inviteCode: 'XYZ789',
      }
      expect(() => UserSchema.parse(trainer)).not.toThrow()
    })

    it('should validate user with null role', () => {
      const userWithNullRole = {
        ...validUser,
        role: null,
      }
      expect(() => UserSchema.parse(userWithNullRole)).not.toThrow()
    })

    it('should validate user without optional fields', () => {
      expect(() => UserSchema.parse(validUser)).not.toThrow()
    })
  })

  describe('Invalid User Data', () => {
    it('should reject empty id', () => {
      const invalidUser = { ...validUser, id: '' }
      expect(() => UserSchema.parse(invalidUser)).toThrow()
    })

    it('should reject invalid email', () => {
      const invalidUser = { ...validUser, email: 'not-an-email' }
      expect(() => UserSchema.parse(invalidUser)).toThrow()
    })

    it('should reject short name (less than 2 characters)', () => {
      const invalidUser = { ...validUser, name: 'J' }
      expect(() => UserSchema.parse(invalidUser)).toThrow('Name is required')
    })

    it('should reject empty name', () => {
      const invalidUser = { ...validUser, name: '' }
      expect(() => UserSchema.parse(invalidUser)).toThrow()
    })

    it('should reject invalid role', () => {
      const invalidUser = { ...validUser, role: 'ADMIN' }
      expect(() => UserSchema.parse(invalidUser)).toThrow()
    })

    it('should reject missing required fields', () => {
      expect(() => UserSchema.parse({})).toThrow()
      expect(() => UserSchema.parse({ id: 'test' })).toThrow()
      expect(() => UserSchema.parse({ id: 'test', email: 'test@test.com' })).toThrow()
    })
  })

  describe('Optional Fields', () => {
    it('should allow trainerId for trainees', () => {
      const trainee = {
        ...validUser,
        role: 'TRAINEE' as const,
        trainerId: 'TRAIN123',
      }
      const parsed = UserSchema.parse(trainee)
      expect(parsed.trainerId).toBe('TRAIN123')
    })

    it('should allow inviteCode for trainers', () => {
      const trainer = {
        ...validUser,
        role: 'TRAINER' as const,
        inviteCode: 'ABC123',
      }
      const parsed = UserSchema.parse(trainer)
      expect(parsed.inviteCode).toBe('ABC123')
    })

    it('should work without trainerId', () => {
      const parsed = UserSchema.parse(validUser)
      expect(parsed.trainerId).toBeUndefined()
    })

    it('should work without inviteCode', () => {
      const parsed = UserSchema.parse(validUser)
      expect(parsed.inviteCode).toBeUndefined()
    })
  })
})

describe('CreateUserSchema', () => {
  const validCreateUser = {
    email: 'newuser@example.com',
    name: 'Jane Doe',
    role: 'TRAINEE' as const,
  }

  describe('Valid Creation Data', () => {
    it('should validate trainee creation', () => {
      const trainee = { ...validCreateUser, role: 'TRAINEE' as const }
      expect(() => CreateUserSchema.parse(trainee)).not.toThrow()
    })

    it('should validate trainer creation', () => {
      const trainer = { ...validCreateUser, role: 'TRAINER' as const }
      expect(() => CreateUserSchema.parse(trainer)).not.toThrow()
    })
  })

  describe('Invalid Creation Data', () => {
    it('should reject invalid email', () => {
      const invalid = { ...validCreateUser, email: 'invalid-email' }
      expect(() => CreateUserSchema.parse(invalid)).toThrow()
    })

    it('should reject short name', () => {
      const invalid = { ...validCreateUser, name: 'X' }
      expect(() => CreateUserSchema.parse(invalid)).toThrow('Name must be at least 2 characters')
    })

    it('should reject invalid role', () => {
      const invalid = { ...validCreateUser, role: 'GUEST' }
      expect(() => CreateUserSchema.parse(invalid)).toThrow()
    })

    it('should reject missing required fields', () => {
      expect(() => CreateUserSchema.parse({})).toThrow()
      expect(() => CreateUserSchema.parse({ email: 'test@test.com' })).toThrow()
      expect(() => CreateUserSchema.parse({ email: 'test@test.com', name: 'John' })).toThrow()
    })
  })

  describe('Field Constraints', () => {
    it('should enforce minimum name length of 2', () => {
      const shortName = { ...validCreateUser, name: 'AB' }
      expect(() => CreateUserSchema.parse(shortName)).not.toThrow()

      const tooShort = { ...validCreateUser, name: 'A' }
      expect(() => CreateUserSchema.parse(tooShort)).toThrow()
    })

    it('should validate email format', () => {
      const validEmails = ['user@example.com', 'test.user@example.co.uk', 'user+tag@example.com']

      validEmails.forEach(email => {
        const user = { ...validCreateUser, email }
        expect(() => CreateUserSchema.parse(user)).not.toThrow()
      })

      const invalidEmails = ['notanemail', '@example.com', 'user@', 'user @example.com']

      invalidEmails.forEach(email => {
        const user = { ...validCreateUser, email }
        expect(() => CreateUserSchema.parse(user)).toThrow()
      })
    })
  })
})

describe('Schema Type Safety', () => {
  it('should infer correct User type', () => {
    const user = {
      id: 'test',
      email: 'test@test.com',
      name: 'Test User',
      role: 'TRAINEE' as const,
      trainerId: 'ABC123',
    }

    const parsed = UserSchema.parse(user)

    // TypeScript should know these properties exist
    expect(parsed.id).toBeDefined()
    expect(parsed.email).toBeDefined()
    expect(parsed.name).toBeDefined()
    expect(parsed.role).toBeDefined()
  })

  it('should infer correct CreateUser type', () => {
    const createUser = {
      email: 'test@test.com',
      name: 'Test User',
      role: 'TRAINEE' as const,
    }

    const parsed = CreateUserSchema.parse(createUser)

    expect(parsed.email).toBeDefined()
    expect(parsed.name).toBeDefined()
    expect(parsed.role).toBeDefined()
  })
})
