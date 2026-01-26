'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pencil, Trash2, Plus, X, Briefcase, LogOut } from 'lucide-react'

interface Portfolio {
  id: string
  name: string
  account_number: string
  fee: number
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formAccountNumber, setFormAccountNumber] = useState('')
  const [formFee, setFormFee] = useState('')

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
    router.refresh()
  }

  // Fetch portfolios on mount
  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      setError('שגיאה בטעינת התיקים')
      console.error(error)
    } else {
      setPortfolios(data || [])
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormName('')
    setFormAccountNumber('')
    setFormFee('')
    setIsEditing(false)
    setEditingId(null)
    setError('')
  }

  const handleEdit = (portfolio: Portfolio) => {
    setFormName(portfolio.name)
    setFormAccountNumber(portfolio.account_number)
    setFormFee(portfolio.fee.toString())
    setIsEditing(true)
    setEditingId(portfolio.id)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formName.trim()) {
      setError('נא להזין שם תיק')
      return
    }
    if (!formAccountNumber.trim()) {
      setError('נא להזין מספר חשבון')
      return
    }
    const feeValue = parseFloat(formFee)
    if (isNaN(feeValue) || feeValue < 0) {
      setError('נא להזין עמלה תקינה (מספר חיובי)')
      return
    }

    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('משתמש לא מחובר')
      setSaving(false)
      return
    }

    if (editingId) {
      // Update existing portfolio
      const { error } = await supabase
        .from('portfolios')
        .update({
          name: formName.trim(),
          account_number: formAccountNumber.trim(),
          fee: feeValue,
        })
        .eq('id', editingId)
        .eq('user_id', user.id)

      if (error) {
        setError('שגיאה בעדכון התיק')
        console.error(error)
      } else {
        resetForm()
        await fetchPortfolios()
        router.refresh()
      }
    } else {
      // Insert new portfolio
      const { error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          name: formName.trim(),
          account_number: formAccountNumber.trim(),
          fee: feeValue,
        })

      if (error) {
        setError('שגיאה בהוספת התיק')
        console.error(error)
      } else {
        resetForm()
        await fetchPortfolios()
        router.refresh()
      }
    }

    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      setError('שגיאה במחיקת התיק')
      console.error(error)
    } else {
      setDeleteConfirmId(null)
      await fetchPortfolios()
      router.refresh()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center">
        הגדרות
      </h1>

      <div className="flex justify-center">
        <Card className="w-full max-w-md aspect-auto">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Briefcase className="h-5 w-5" style={{ color: '#F7931A' }} />
              <span>ניהול תיקים</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-right block">שם התיק</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="תיק ראשי"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accountNumber" className="text-right block">מספר חשבון</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="123456"
                    value={formAccountNumber}
                    onChange={(e) => setFormAccountNumber(e.target.value)}
                    className="text-right"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fee" className="text-right block">עמלה ($)</Label>
                  <Input
                    id="fee"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1.00"
                    value={formFee}
                    onChange={(e) => setFormFee(e.target.value)}
                    className="text-right"
                    dir="ltr"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive text-right">{error}</p>
              )}

              <div className="flex gap-2 justify-end">
                {isEditing && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    ביטול
                  </Button>
                )}
                <Button type="submit" disabled={saving} className="min-w-[120px]">
                  {!isEditing && <Plus className="h-4 w-4 ml-2" />}
                  {saving ? 'שומר...' : isEditing ? 'עדכן תיק' : 'הוסף תיק'}
                </Button>
              </div>
            </form>

            {/* Portfolios List */}
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-right">
                התיקים שלך
              </h3>
              
              {loading ? (
                <p className="text-muted-foreground text-center py-4">טוען...</p>
              ) : portfolios.length === 0 ? (
                <div className="text-center py-6 bg-muted/20 rounded-lg border border-dashed border-border">
                  <Briefcase className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground text-sm">
                    אין תיקים עדיין
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-1">
                    הוסף את התיק הראשון שלך למעלה
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {portfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        {deleteConfirmId === portfolio.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirmId(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(portfolio.id)}
                            >
                              אישור מחיקה
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeleteConfirmId(portfolio.id)}
                              title="מחק"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(portfolio)}
                              title="ערוך"
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <p className="font-medium truncate">{portfolio.name}</p>
                        <p className="text-xs text-muted-foreground">
                          חשבון: {portfolio.account_number} | עמלה: ${portfolio.fee}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Section */}
            <div className="border-t border-border pt-4">
              <Button
                variant="outline"
                className="w-full text-muted-foreground hover:text-destructive hover:border-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 ml-2" />
                התנתק
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
