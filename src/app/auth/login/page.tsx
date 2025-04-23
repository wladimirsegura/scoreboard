import Link from 'next/link'
import { AuthCard } from '@/components/auth/auth-card'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <AuthCard title="Sign in to your account">
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </div>
      </AuthCard>
    </div>
  )
}