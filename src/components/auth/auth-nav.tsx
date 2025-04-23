'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/app/utils/supabase/client'

export function AuthNav() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Link
      href={isAuthenticated ? '/auth/login' : '/auth/register'}
      className="text-[#F3F4F6] hover:text-white transition"
    >
      {isAuthenticated ? 'Sign Out' : 'Sign In'}
    </Link>
  )
}