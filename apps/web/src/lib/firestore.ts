import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { User } from '@shapeshift/shared'

// Weight Log Type
export interface WeightLog {
  id?: string
  userId: string
  weight: number
  date: Date
  createdAt: Date
}

// Workout Log Type
export interface WorkoutLog {
  id?: string
  userId: string
  workoutType: string
  exercises: Array<{
    name: string
    sets: number
    reps: number
    weight: number
  }>
  date: Date
  createdAt: Date
}

export const addWeightLog = async (userId: string, weight: number, date: Date = new Date()) => {
  return await addDoc(collection(db, 'weightLogs'), {
    userId,
    weight,
    date: Timestamp.fromDate(date),
    createdAt: Timestamp.fromDate(new Date()),
  })
}

export const getWeightLogs = async (userId: string) => {
  const q = query(collection(db, 'weightLogs'), where('userId', '==', userId))

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
    createdAt: doc.data().createdAt.toDate(),
  })) as WeightLog[]
}

export const addWorkoutLog = async (
  userId: string,
  workoutData: Omit<WorkoutLog, 'id' | 'userId' | 'createdAt'>
) => {
  return await addDoc(collection(db, 'workoutLogs'), {
    userId,
    ...workoutData,
    date: Timestamp.fromDate(workoutData.date),
    createdAt: Timestamp.fromDate(new Date()),
  })
}

export const getWorkoutLogs = async (userId: string) => {
  const q = query(collection(db, 'workoutLogs'), where('userId', '==', userId))

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
    createdAt: doc.data().createdAt.toDate(),
  })) as WorkoutLog[]
}

// Get trainees for a trainer
export const getTraineesForTrainer = async (inviteCode: string) => {
  const q = query(collection(db, 'users'), where('trainerId', '==', inviteCode))

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const deleteWorkoutLog = async (workoutId: string) => {
  await deleteDoc(doc(db, 'workoutLogs', workoutId))
}

export const deleteWeightLog = async (weightId: string) => {
  await deleteDoc(doc(db, 'weightLogs', weightId))
}

// Verify if trainer code exists and get trainer info
export const verifyTrainerCode = async (inviteCode: string): Promise<User | null> => {
  const q = query(
    collection(db, 'users'),
    where('inviteCode', '==', inviteCode),
    where('role', '==', 'TRAINER')
  )

  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return null
  }

  const trainerDoc = snapshot.docs[0]
  return {
    id: trainerDoc.id,
    ...trainerDoc.data(),
  } as User
}

// Connect trainee to trainer
export const connectToTrainer = async (traineeId: string, trainerCode: string): Promise<User> => {
  // First verify the trainer code exists
  const trainer = await verifyTrainerCode(trainerCode)

  if (!trainer) {
    throw new Error('Invalid trainer code')
  }

  // Update trainee's trainerId
  await updateDoc(doc(db, 'users', traineeId), {
    trainerId: trainerCode,
  })

  return trainer
}

// Disconnect from trainer
export const disconnectFromTrainer = async (traineeId: string) => {
  await updateDoc(doc(db, 'users', traineeId), {
    trainerId: null,
  })
}
