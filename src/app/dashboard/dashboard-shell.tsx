'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Menu, Plus, Home, Settings, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewActionModal } from './new-action-modal'

interface Portfolio {
  id: string
  name: string
  account_number: string
  fee: number
}

interface DashboardShellProps {
  userName: string
  portfolios: Portfolio[]
  children: React.ReactNode
}

export function DashboardShell({ userName, portfolios, children }: DashboardShellProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  // Close modal on ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && modalOpen) {
      setModalOpen(false)
    }
  }, [modalOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar - Always visible, expands/collapses */}
      <aside
        className={`sticky top-0 h-screen border-l border-border bg-background flex flex-col transition-all duration-300 ease-in-out ${
          sidebarExpanded ? 'w-60' : 'w-16'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-center border-b border-border px-3">
          {sidebarExpanded ? (
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: '#F7931A' }}
            >
              FINBAR
            </h1>
          ) : (
            <span
              className="text-xl font-bold"
              style={{ color: '#F7931A' }}
            >
              F
            </span>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <Link
            href="/dashboard"
            className={`flex items-center rounded-lg px-3 py-2 text-foreground hover:bg-accent transition-colors ${
              sidebarExpanded ? 'gap-3' : 'justify-center'
            }`}
            title="דאשבורד"
          >
            <Home className="h-5 w-5 shrink-0" />
            {sidebarExpanded && <span>דאשבורד</span>}
          </Link>

          {/* My Portfolios Section */}
          <div className="mt-4">
            {sidebarExpanded && (
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                התיקים שלי
              </h3>
            )}
            {portfolios.length === 0 ? (
              sidebarExpanded && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  אין תיקים עדיין
                </p>
              )
            ) : (
              portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className={`flex items-center rounded-lg px-3 py-2 text-foreground hover:bg-accent transition-colors cursor-pointer ${
                    sidebarExpanded ? 'gap-3' : 'justify-center'
                  }`}
                  title={portfolio.name}
                >
                  <Briefcase className="h-5 w-5 shrink-0" />
                  {sidebarExpanded && (
                    <span className="truncate">{portfolio.name}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </nav>

        {/* Sidebar Footer - Settings */}
        <div className="p-2 border-t border-border">
          <Link
            href="/dashboard/settings"
            className={`flex items-center rounded-lg px-3 py-2 text-foreground hover:bg-accent transition-colors ${
              sidebarExpanded ? 'gap-3' : 'justify-center'
            }`}
            title="הגדרות"
          >
            <Settings className="h-5 w-5 shrink-0" />
            {sidebarExpanded && <span>הגדרות</span>}
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background">
          <div className="flex h-14 items-center justify-between px-4" dir="ltr">
            {/* Physical left - Plus button */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModalOpen(true)}
                aria-label="יצירה חדשה"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Physical right - Menu toggle */}
            <div className="flex items-center" dir="rtl">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                aria-label={sidebarExpanded ? 'כווץ תפריט' : 'הרחב תפריט'}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* New Action Modal */}
        <NewActionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          portfolios={portfolios}
        />

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
