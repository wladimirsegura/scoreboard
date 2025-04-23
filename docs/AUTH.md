# Authentication Implementation Guide for Scoreboard App

## Overview

This document outlines the authentication implementation for the Scoreboard app using Next.js and Supabase, following the latest best practices for server-side authentication <mcreference link="https://supabase.com/docs/guides/auth/server-side/nextjs" index="1">1</mcreference>.

## Tech Stack

- Next.js 15.3.0 with App Router
- Supabase Auth (@supabase/ssr)
- Server Components for secure data fetching

## Implementation Steps

### 1. Package Installation

Required packages are already installed in our project:
- @supabase/ssr: ^0.6.1 (for server-side auth)
- @supabase/supabase-js: ^2.49.4

### 2. Environment Setup

Create `.env.local` with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Client Setup

Create two utility files for Supabase clients <mcreference link="https://supabase.com/docs/guides/auth/server-side/nextjs" index="1">1</mcreference>:

#### `utils/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### `utils/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

### 4. Middleware Implementation

Create `middleware.ts` at the project root <mcreference link="https://supabase.com/docs/guides/auth/server-side/nextjs" index="1">1</mcreference> <mcreference link="https://supalaunch.com/blog/nextjs-middleware-supabase-auth" index="4">4</mcreference>:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 5. Protected Routes

Implement route protection using Server Components <mcreference link="https://supabase.com/docs/guides/auth/server-side/nextjs" index="1">1</mcreference>:

```typescript
// app/protected/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Protected content for {user.email}</div>
}
```

### 6. Authentication Components

Create authentication components in the `app/auth` directory:

- Login form
- Sign-up form
- Password reset
- Email verification

### 7. Security Best Practices

1. **Token Refresh**: Middleware handles token refresh automatically <mcreference link="https://supalaunch.com/blog/nextjs-middleware-supabase-auth" index="4">4</mcreference>
2. **Server Validation**: Always verify sessions server-side
3. **Cookie Security**: Use HTTP-only cookies (handled by @supabase/ssr)
4. **Error Handling**: Implement proper error handling for auth flows

### 8. Next Steps

1. Implement authentication UI components
2. Set up protected routes for scoreboard management
3. Add user profile management
4. Implement role-based access control
5. Add session persistence

## References

- [Supabase Auth with Next.js App Router](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js Server-Side Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)