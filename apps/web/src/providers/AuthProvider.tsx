import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@firebase/auth'
import { doc, getDoc, setDoc } from '@firebase/firestore'
import { auth, googleProvider, db } from '../lib/firebase'
import { User } from '@shapeshift/shared'

interface AuthContextType {
  currentUser: FirebaseUser | null
  userProfile: User | null
  loading: boolean
  signInWithGoogle: (mode: 'signin' | 'signup') => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user)

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as User)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async (mode: 'signin' | 'signup') => {
    const result = await signInWithPopup(auth, googleProvider)

    // Check if user document exists in Firestore
    const userDocRef = doc(db, 'users', result.user.uid)
    const userDoc = await getDoc(userDocRef)

    if (mode === 'signin') {
      // Sign-in mode: User MUST already exist
      if (!userDoc.exists()) {
        // Sign out the Firebase user since they're not registered in our system
        await firebaseSignOut(auth)
        throw new Error('No account found with this Google account. Please sign up first.')
      }
      // User exists, profile will be loaded by onAuthStateChanged
    } else {
      // Sign-up mode: User must NOT already exist
      if (userDoc.exists()) {
        // Sign out the Firebase user to prevent auto-login
        await firebaseSignOut(auth)
        throw new Error(
          'An account with this Google account already exists. Please sign in instead.'
        )
      }
      // Create new user document
      const newUserData = {
        id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || result.user.email?.split('@')[0] || 'User',
        role: null, // Will be set during onboarding
      }
      await setDoc(userDocRef, newUserData)
      // Immediately set the user profile to avoid race condition with onAuthStateChanged
      setUserProfile(newUserData as User)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Note: User profile will be created during onboarding
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      name,
      role: null, // Set during onboarding
    })
  }

  const refreshUserProfile = async () => {
    if (!currentUser) return
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
    if (userDoc.exists()) {
      setUserProfile(userDoc.data() as User)
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
