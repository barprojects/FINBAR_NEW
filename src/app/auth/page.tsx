'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Signup state
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupError, setSignupError] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)

  // Validation helpers
  const validateEmail = (email: string) => email.includes('@')
  const validatePassword = (password: string) => password.length >= 6
  const validateName = (name: string) => name.length >= 2

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    // Validation
    if (!loginEmail || !validateEmail(loginEmail)) {
      setLoginError('נא להזין כתובת אימייל תקינה')
      return
    }
    if (!loginPassword || !validatePassword(loginPassword)) {
      setLoginError('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }

    setLoginLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (error) {
      setLoginError('אימייל או סיסמה שגויים')
      setLoginLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError('')

    // Validation
    if (!signupName || !validateName(signupName)) {
      setSignupError('השם חייב להכיל לפחות 2 תווים')
      return
    }
    if (!signupEmail || !validateEmail(signupEmail)) {
      setSignupError('נא להזין כתובת אימייל תקינה')
      return
    }
    if (!signupPassword || !validatePassword(signupPassword)) {
      setSignupError('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }

    setSignupLoading(true)

    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          name: signupName,
        },
      },
    })

    if (error) {
      setSignupError('שגיאה ביצירת החשבון. נסה שוב.')
      setSignupLoading(false)
      return
    }

    // Profile is created automatically by database trigger (handle_new_user)
    // No need to create it manually here

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            FINBAR
          </h1>
          <p className="mt-2 text-muted-foreground">
            ניהול תיקי השקעות
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">כניסה</TabsTrigger>
            <TabsTrigger value="signup">הרשמה</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>כניסה לחשבון</CardTitle>
                <CardDescription>
                  הזן את פרטי ההתחברות שלך
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">אימייל</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      dir="ltr"
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">סיסמה</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      dir="ltr"
                      className="text-right"
                    />
                  </div>
                  {loginError && (
                    <p className="text-sm text-destructive">{loginError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'מתחבר...' : 'התחבר'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>יצירת חשבון חדש</CardTitle>
                <CardDescription>
                  הזן את הפרטים שלך להרשמה
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">שם מלא</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="ישראל ישראלי"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">אימייל</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      dir="ltr"
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">סיסמה</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="לפחות 6 תווים"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      dir="ltr"
                      className="text-right"
                    />
                  </div>
                  {signupError && (
                    <p className="text-sm text-destructive">{signupError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={signupLoading}
                  >
                    {signupLoading ? 'נרשם...' : 'הרשם'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
