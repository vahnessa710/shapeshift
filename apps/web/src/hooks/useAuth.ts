import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from '@firebase/auth'
import { doc, getDoc } from '@firebase/firestore'
import { useQuery } from '@tanstack/react-query'
import { auth, db } from '../lib/firebase'
import { User as ShapeshiftUser } from '@shapeshift/shared'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
      setIsAuthLoading(false)
    })
  }, [])

  // Use TanStack Query to fetch the Firestore document
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    queryKey: ['user-profile', user?.uid],
    queryFn: async () => {
      if (!user) return null
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? (docSnap.data() as ShapeshiftUser) : null
    },
    enabled: !!user, // Only run if we have a logged-in user
  })

  return {
    user,
    profile,
    isLoading: isAuthLoading || (!!user && isProfileLoading),
    needsOnboarding: !!user && !isProfileLoading && !profile,
    refetchProfile: refetch,
  }
}
