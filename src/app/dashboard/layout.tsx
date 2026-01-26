import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from './dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  // Fetch user portfolios
  const { data: portfolios } = await supabase
    .from('portfolios')
    .select('id, name, account_number, fee')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  // Fallback to user metadata if profile doesn't exist
  const userName = profile?.name || user.user_metadata?.name || 'משתמש'

  return (
    <DashboardShell userName={userName} portfolios={portfolios || []}>
      {children}
    </DashboardShell>
  )
}
