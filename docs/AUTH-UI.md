# Authentication UI Implementation Guide with shadcn/ui and Supabase

## Overview
This guide outlines the best practices for implementing authentication UI using shadcn/ui components integrated with Supabase authentication in our Next.js 14 application.

## Tech Stack
- Next.js 14 (App Router)
- Supabase (Authentication & Database)
- shadcn/ui (UI Components)
- TypeScript
- Tailwind CSS

## Required Components

### 1. Core shadcn/ui Components
Install these essential components for the authentication UI:

```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add label
npx shadcn-ui@latest add toast
```

### 2. Form Validation
We'll use these libraries for form validation:
- react-hook-form (included with shadcn/ui form component)
- zod (for schema validation)

## Authentication Components Structure

```
src/
  components/
    auth/
      login-form.tsx       # Login form component
      register-form.tsx    # Registration form component
      auth-card.tsx       # Wrapper card component for auth forms
      password-input.tsx  # Reusable password input with toggle
      oauth-buttons.tsx   # Social login buttons
  app/
    auth/
      login/
        page.tsx
      register/
        page.tsx
```

## Best Practices

### 1. Form Implementation
- Use shadcn/ui's Form component with react-hook-form for form state management <mcreference link="https://hackernoon.com/how-to-implement-authentication-in-nextjs-14-with-nextauthjs-shadcnui-react-hook-form-and-zod" index="1">1</mcreference>
- Implement proper form validation using zod schemas
- Show clear error messages using toast notifications
- Disable form submission while processing

### 2. UI/UX Guidelines
- Implement a responsive design that works well on all devices
- Use shadcn/ui's dark mode support for theme consistency
- Provide clear visual feedback for form validation and submission states
- Implement loading states for buttons during authentication

### 3. Security Best Practices
- Implement proper password requirements and validation
- Use secure session management with Supabase SSR <mcreference link="https://omarmokhfi.medium.com/building-a-full-stack-apps-with-nextjs-14-supabase-and-shadcnui-b3a66ae138af" index="2">2</mcreference>
- Implement proper error handling and user feedback
- Use environment variables for sensitive information

## Example Implementation

### Auth Card Component
```typescript
// components/auth/auth-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthCard({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
```

### Password Input Component
```typescript
// components/auth/password-input.tsx
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export function PasswordInput({ ...props }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOffIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
```

## Form Validation Schema
```typescript
// lib/validations/auth.ts
import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})
```

## Integration with Supabase

The authentication UI components will work seamlessly with our existing Supabase setup <mcreference link="https://supabase.com/blog/supabase-ui-library" index="3">3</mcreference>. The middleware and server-side authentication handling are already configured in our project.

## Next Steps
1. Implement the login and registration form components using the provided examples
2. Add toast notifications for success/error messages
3. Implement protected routes and authentication state management
4. Add social authentication providers if needed
5. Test the authentication flow thoroughly

## Resources
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)