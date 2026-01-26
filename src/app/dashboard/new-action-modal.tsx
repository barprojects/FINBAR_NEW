'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { X, Plus, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Portfolio {
  id: string
  name: string
  account_number: string
  fee: number
}

interface NewActionModalProps {
  isOpen: boolean
  onClose: () => void
  portfolios: Portfolio[]
}

type ActionType = 'buy' | 'sell' | 'convert' | 'deposit' | 'withdraw' | 'dividend' | ''

const ACTION_TYPES = [
  { value: 'buy', label: 'קנייה' },
  { value: 'sell', label: 'מכירה' },
  { value: 'convert', label: 'המרה' },
  { value: 'deposit', label: 'הפקדה' },
  { value: 'withdraw', label: 'משיכה' },
  { value: 'dividend', label: 'דיבידנד' },
]

const CURRENCIES = [
  { value: 'USD', label: 'דולר (USD)' },
  { value: 'ILS', label: 'שקל (ILS)' },
]

export function NewActionModal({ isOpen, onClose, portfolios }: NewActionModalProps) {
  // Form state
  const [selectedPortfolio, setSelectedPortfolio] = useState('')
  const [actionDate, setActionDate] = useState<Date | undefined>(undefined)
  const [actionType, setActionType] = useState<ActionType>('')
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  
  // Dynamic fields state
  const [symbol, setSymbol] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [sourceCurrency, setSourceCurrency] = useState('')
  const [targetCurrency, setTargetCurrency] = useState('')
  const [exchangeRate, setExchangeRate] = useState('')
  const [currency, setCurrency] = useState('')
  const [amount, setAmount] = useState('')
  
  // Error state
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setSelectedPortfolio('')
    setActionDate(undefined)
    setActionType('')
    setSymbol('')
    setQuantity('')
    setPrice('')
    setSourceCurrency('')
    setTargetCurrency('')
    setExchangeRate('')
    setCurrency('')
    setAmount('')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validateForm = (): boolean => {
    if (!selectedPortfolio) {
      setError('נא לבחור תיק')
      return false
    }
    if (!actionDate) {
      setError('נא לבחור תאריך')
      return false
    }
    if (!actionType) {
      setError('נא לבחור סוג פעולה')
      return false
    }

    // Validate based on action type
    if (actionType === 'buy' || actionType === 'sell') {
      if (!symbol.trim()) {
        setError('נא להזין סימול')
        return false
      }
      if (!quantity || parseFloat(quantity) <= 0) {
        setError('נא להזין כמות תקינה')
        return false
      }
      if (!price || parseFloat(price) <= 0) {
        setError('נא להזין מחיר תקין')
        return false
      }
    }

    if (actionType === 'convert') {
      if (!sourceCurrency) {
        setError('נא לבחור מטבע מקור')
        return false
      }
      if (!targetCurrency) {
        setError('נא לבחור מטבע יעד')
        return false
      }
      if (sourceCurrency === targetCurrency) {
        setError('מטבע מקור ויעד חייבים להיות שונים')
        return false
      }
      if (!exchangeRate || parseFloat(exchangeRate) <= 0) {
        setError('נא להזין שער המרה תקין')
        return false
      }
    }

    if (actionType === 'deposit' || actionType === 'withdraw') {
      if (!currency) {
        setError('נא לבחור מטבע')
        return false
      }
      if (!amount || parseFloat(amount) <= 0) {
        setError('נא להזין סכום תקין')
        return false
      }
    }

    if (actionType === 'dividend') {
      if (!symbol.trim()) {
        setError('נא להזין סימול')
        return false
      }
      if (!amount || parseFloat(amount) <= 0) {
        setError('נא להזין סכום תקין')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setSaving(true)

    // Build the action data (for future DB save)
    const actionData = {
      portfolio_id: selectedPortfolio,
      date: actionDate ? format(actionDate, 'yyyy-MM-dd') : null,
      type: actionType,
      ...(actionType === 'buy' || actionType === 'sell' ? {
        symbol,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
      } : {}),
      ...(actionType === 'convert' ? {
        source_currency: sourceCurrency,
        target_currency: targetCurrency,
        exchange_rate: parseFloat(exchangeRate),
      } : {}),
      ...(actionType === 'deposit' || actionType === 'withdraw' ? {
        currency,
        amount: parseFloat(amount),
      } : {}),
      ...(actionType === 'dividend' ? {
        symbol,
        amount: parseFloat(amount),
      } : {}),
    }

    console.log('Action data (visual only):', actionData)

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))

    setSaving(false)
    handleClose()
  }

  if (!isOpen) return null

  // No portfolios case
  if (portfolios.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="bg-background rounded-lg border border-border shadow-xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">פעולה חדשה</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="סגור"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              יש להוסיף תיק קודם בהגדרות
            </p>
            <Link href="/dashboard/settings">
              <Button variant="outline">
                עבור להגדרות
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-background rounded-lg border border-border shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="text-lg font-semibold">פעולה חדשה</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="סגור"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Base Fields */}
          <div className="space-y-4">
            {/* Portfolio Selection */}
            <div className="space-y-1.5">
              <Label className="text-right block">בחירת תיק</Label>
              <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תיק" />
                </SelectTrigger>
                <SelectContent side="bottom" align="start">
                  {portfolios.map((portfolio) => (
                    <SelectItem key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-1.5">
              <Label className="text-right block">תאריך</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right font-normal"
                  >
                    <CalendarIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                    {actionDate ? (
                      format(actionDate, 'dd/MM/yyyy')
                    ) : (
                      <span className="text-muted-foreground">בחר תאריך</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={actionDate}
                    onSelect={(date) => {
                      setActionDate(date)
                      setDatePickerOpen(false)
                    }}
                    locale={he}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Action Type */}
            <div className="space-y-1.5">
              <Label className="text-right block">סוג פעולה</Label>
              <Select value={actionType} onValueChange={(v) => setActionType(v as ActionType)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג פעולה" />
                </SelectTrigger>
                <SelectContent side="bottom" align="start">
                  {ACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dynamic Fields */}
          {actionType && (
            <div className="space-y-4 pt-4 border-t border-border">
              {/* Buy / Sell */}
              {(actionType === 'buy' || actionType === 'sell') && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-right block">סימול</Label>
                    <Input
                      type="text"
                      placeholder="AAPL"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-right block">כמות</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="10"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="text-left"
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-right block">מחיר</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="150.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Convert */}
              {actionType === 'convert' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-right block">מטבע מקור</Label>
                      <Select value={sourceCurrency} onValueChange={setSourceCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר" />
                        </SelectTrigger>
                        <SelectContent side="top" align="start">
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-right block">מטבע יעד</Label>
                      <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר" />
                        </SelectTrigger>
                        <SelectContent side="top" align="start">
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-right block">שער המרה</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      placeholder="3.65"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                </>
              )}

              {/* Deposit / Withdraw */}
              {(actionType === 'deposit' || actionType === 'withdraw') && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-right block">מטבע</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר מטבע" />
                      </SelectTrigger>
                      <SelectContent side="top" align="start">
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-right block">סכום</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="1000.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                </>
              )}

              {/* Dividend */}
              {actionType === 'dividend' && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-right block">סימול</Label>
                    <Input
                      type="text"
                      placeholder="AAPL"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-right block">סכום</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="25.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive text-right">{error}</p>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-border">
            <Button type="submit" className="w-full" disabled={saving}>
              <Plus className="h-4 w-4 ml-2" />
              {saving ? 'שומר...' : 'שמור פעולה'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
