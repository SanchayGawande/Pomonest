import { SignInButton } from '@/components/auth/SignInButton'

// Force dynamic rendering to avoid static generation issues with useAuth
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <SignInButton />
    </div>
  )
}