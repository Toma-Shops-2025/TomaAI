import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, GeneratedImage } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

interface SupabaseContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  saveGeneratedImage: (imageData: Omit<GeneratedImage, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  getGeneratedImages: () => Promise<GeneratedImage[]>
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
      // Add cache busting to prevent stale data
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false })
        .abortSignal(AbortSignal.timeout(5000)) // 5 second timeout
      
      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error('Error fetching images:', error)
      return []
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    saveGeneratedImage,
    getGeneratedImages,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}
