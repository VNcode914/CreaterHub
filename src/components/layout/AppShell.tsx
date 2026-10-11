import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Plus,
  Search,
  Settings,
  X,
  Trash2,
  Bot
} from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { creator, navItems } from '../../data/studio'
import { useStudio } from '../../context/studio-context'
import { cn } from '../../lib/cn'
import { Mark } from '../ui/Mark'

const icons: Record<string, typeof LayoutDashboard> = {
  studio: LayoutDashboard,
  ideas: Lightbulb,
  calendar: CalendarDays,
  tasks: CheckSquare,
  analytics: BarChart3,
  ai: Bot,
  bin: Trash2,
  settings: Settings,
}

function formatHeaderDate() {
  const now = new Date()
  return now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function AppShell() {
  const { query, setQuery, notice, setNotice } = useStudio()
  const [menuOpen, setMenuOpen] = useState(false)
  const [toastExiting, setToastExiting] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const searchId = useId()

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === '/' && event.target === document.body) {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Toast auto-dismiss with exit animation
  useEffect(() => {
    if (!notice) return
    setToastExiting(false)
    const exitTimer = window.setTimeout(() => setToastExiting(true), 2600)
    const removeTimer = window.setTimeout(() => {
      setNotice(null)
      setToastExiting(false)
    }, 3000)
    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(removeTimer)
    }
  }, [notice, setNotice])

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <div className="min-h-svh bg-ink text-cream">
      <a
        href="#studio-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ivory focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to studio
      </a>

      <div className="flex min-h-svh">
        {/* Desktop sidebar */}
        <aside className="hidden w-[232px] shrink-0 flex-col border-r border-white/8 bg-ink lg:flex">
          <SidebarBrand />
          <SidebarNav onNavigate={closeMenu} />
          <SidebarUser />
        </aside>

        {/* Main content area */}
        <div className="studio-atmosphere flex min-w-0 flex-1 flex-col text-ink">
          {/* Top bar */}
          <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5">
            <div className="glass-chrome flex items-center gap-3 rounded-[14px] px-3 py-2.5">
              {/* Mobile menu toggle */}
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-[10px] transition-colors duration-200 hover:bg-ink/5 lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                <span className="sr-only">Toggle navigation</span>
              </button>

              {/* Search */}
              <label htmlFor={searchId} className="sr-only">
                Search the board
              </label>
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] bg-ink/[0.04] px-3 py-2">
                <Search className="size-4 shrink-0 text-muted" />
                <input
                  ref={searchRef}
                  id={searchId}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search drafts, projects, tasks"
                  className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
                <kbd className="hidden rounded-md border border-ink/10 bg-ivory px-1.5 py-0.5 text-[10px] font-medium text-muted sm:inline">
                  /
                </kbd>
              </div>

              {/* New piece button */}
              <button
                type="button"
                className="hidden items-center gap-1.5 rounded-[10px] bg-copper px-3 py-2 text-sm font-medium text-ivory shadow-[var(--shadow-lift)] transition-colors duration-200 hover:bg-copper-deep sm:inline-flex"
                onClick={() => setNotice('New piece: coming soon in Stage 2.')}
              >
                <Plus className="size-4" />
                <span className="hidden md:inline">New piece</span>
              </button>

              {/* Live date */}
              <p className="hidden text-right text-xs text-muted md:block">
                {formatHeaderDate()}
                <span className="mt-0.5 block font-medium text-ink">
                  {creator.studio}
                </span>
              </p>
            </div>
          </header>

          {/* Mobile nav overlay + panel */}
          {menuOpen ? (
            <>
              <div
                className="mobile-overlay lg:hidden"
                onClick={closeMenu}
                aria-hidden="true"
              />
              <div
                id="mobile-nav"
                className="mobile-panel fixed left-0 top-0 z-40 flex h-svh w-[280px] flex-col border-r border-white/8 bg-ink text-cream lg:hidden"
              >
                <SidebarBrand />
                <SidebarNav onNavigate={closeMenu} />
                <SidebarUser />
              </div>
            </>
          ) : null}

          {/* Page content */}
          <main id="studio-main" className="flex-1 px-3 py-5 sm:px-5 lg:px-7">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Toast notification */}
      {notice ? (
        <div
          role="status"
          className={cn(
            'glass-chrome fixed bottom-5 right-5 z-40 max-w-sm rounded-[12px] px-4 py-3 text-sm text-ink shadow-[var(--shadow-board)]',
            toastExiting ? 'toast-exit' : 'toast',
          )}
        >
          {notice}
        </div>
      ) : null}
    </div>
  )
}

function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 px-5 py-6">
      <Mark />
      <div>
        <p className="font-display text-[17px] font-semibold tracking-tight text-ivory">
          CreatorHub
        </p>
        <p className="text-[11px] uppercase tracking-[0.16em] text-cream/45">
          Private studio
        </p>
      </div>
    </div>
  )
}

function SidebarNav({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Studio">
      {navItems.map((item) => {
        const Icon = icons[item.id]
        if (!item.ready) {
          return (
            <span
              key={item.id}
              className="flex items-center justify-between rounded-[10px] px-3 py-2 text-sm text-cream/35"
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4" />
                {item.label}
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em]">
                Next
              </span>
            </span>
          )
        }

        return (
          <NavLink
            key={item.id}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm transition-colors duration-200',
                isActive
                  ? 'sidebar-active-bar bg-white/8 text-ivory'
                  : 'text-cream/70 hover:bg-white/5 hover:text-ivory',
              )
            }
          >
            <Icon className="size-4" />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

function SidebarUser() {
  return (
    <div className="mx-3 mb-4 mt-6 flex items-center gap-3 rounded-[12px] border border-white/8 px-3 py-3">
      <div
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-full bg-copper font-display text-sm font-semibold text-ivory"
      >
        AS
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ivory">{creator.name}</p>
        <p className="truncate text-xs text-cream/45">{creator.role}</p>
      </div>
    </div>
  )
}
