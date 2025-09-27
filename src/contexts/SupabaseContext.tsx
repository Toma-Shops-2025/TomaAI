import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, GeneratedImage } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: string
  subscription_status: string
  trial_ends_at?: string
  email_collected: boolean
  created_at: string
  updated_at: string
}

interface SupabaseContextType {
  user: User | null
  session: Session | null
  loading: boolean
  userProfile: UserProfile | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  saveGeneratedImage: (imageData: Omit<GeneratedImage, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  getGeneratedImages: () => Promise<GeneratedImage[]>
  deleteGeneratedImage: (imageId: string) => Promise<void>
  getUserProfile: () => Promise<UserProfile | null>
  updateEmailCollected: (emailCollected: boolean) => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load user profile when user changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        const profile = await getUserProfile()
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }
    }
    loadUserProfile()
  }, [user])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      toast({
        title: 'Success',
        description: 'Signed in successfully!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      toast({
        title: 'Success',
        description: 'Check your email for verification link!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast({
        title: 'Success',
        description: 'Signed out successfully!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const saveGeneratedImage = async (imageData: Omit<GeneratedImage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .insert([imageData])
      
      if (error) throw error
      
      toast({
        title: 'Success',
        description: 'Image saved to your gallery!',
      })
    } catch (error: any) {
      console.error('Error saving image:', error)
      toast({
        title: 'Error',
        description: 'Failed to save image',
        variant: 'destructive',
      })
    }
  }

  const getGeneratedImages = async (): Promise<GeneratedImage[]> => {
    try {
      // Only get images for the current user
      if (!user) return []
      
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      console.log(`📥 Fetched ${data?.length || 0} images for user ${user.id}`)
      return data || []
    } catch (error: any) {
      console.error('Error fetching images:', error)
      return []
    }
  }

  const deleteGeneratedImage = async (imageId: string): Promise<void> => {
    try {
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId)
        .eq('user_id', user.id)
      
      if (error) throw error
      console.log('🗑️ Image deleted successfully')
    } catch (error: any) {
      console.error('Error deleting image:', error)
      throw error
    }
  }

  const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
      if (!user) return null
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const updateEmailCollected = async (emailCollected: boolean): Promise<void> => {
    try {
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from('users')
        .update({ email_collected: emailCollected })
        .eq('id', user.id)
      
      if (error) throw error
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, email_collected: emailCollected } : null)
      
      console.log('📧 Email collected status updated:', emailCollected)
    } catch (error: any) {
      console.error('Error updating email collected status:', error)
      throw error
    }
  }


  const value = {
    user,
    session,
    loading,
    userProfile,
    signIn,
    signUp,
    signOut,
    saveGeneratedImage,
    getGeneratedImages,
    deleteGeneratedImage,
    getUserProfile,
    updateEmailCollected,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}
