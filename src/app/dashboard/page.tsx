import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  // Fallback to user metadata if profile doesn't exist
  const userName = profile?.name || user.user_metadata?.name || 'משתמש'

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold tracking-tight">FINBAR</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              שלום, {userName}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            ברוך הבא ל-FINBAR
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            מערכת ניהול תיקי ההשקעות שלך
          </p>
          <div className="mt-8 rounded-lg border border-dashed border-border p-12">
            <p className="text-muted-foreground">
              תיקי ההשקעות שלך יופיעו כאן
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
