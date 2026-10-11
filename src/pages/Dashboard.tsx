import { useMemo, useState } from 'react'
import { ArrowUpRight, Check, FileText, Radio, Send, Clock, Lightbulb, Calendar, Bot } from 'lucide-react'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ChannelDot } from '../components/ui/ChannelDot'
import { useStudio } from '../context/studio-context'
import { useStore } from '../context/store/StoreProvider'
import {
  activity,
  creator,
  projects,
  statusCopy,
  type ContentStatus,
} from '../data/studio'
import { cn } from '../lib/cn'

const filters: Array<{ id: 'all' | ContentStatus; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'review', label: 'In review' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'published', label: 'Published' },
]

export function Dashboard() {
  const { query, setNotice } = useStudio()
  const { ideas, board, tasks, updateBoardItem, updateTask } = useStore()
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all')

  const nextDrop = board.find((item) => item.status === 'scheduled') ?? board[0]

  const visibleBoard = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return board.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesQuery =
        needle.length === 0 ||
        `${item.title} ${item.channel} ${item.format} ${item.notes}`
          .toLowerCase()
          .includes(needle)
      return matchesStatus && matchesQuery
    })
  }, [board, query, statusFilter])

  const openTasks = tasks.filter((task) => !task.done).length

  // Compute stats from board
  const stats = useMemo(() => {
    const total = board.length
    const scheduled = board.filter((i) => i.status === 'scheduled').length
    const inReview = board.filter((i) => i.status === 'review').length
    const published = board.filter((i) => i.status === 'published').length
    return [
      { label: 'Total active', value: total, icon: FileText },
      { label: 'Posts planned', value: scheduled, icon: Clock },
      { label: 'In review', value: inReview, icon: Radio },
      { label: 'Published', value: published, icon: Send },
    ]
  }, [board])

  function toggleTask(id: string) {
    const task = tasks.find(t => t.id === id)
    if (task) {
      updateTask(id, { done: !task.done })
    }
  }

  function advancePiece(id: string) {
    const order: ContentStatus[] = ['draft', 'review', 'scheduled', 'published']
    const current = board.find((item) => item.id === id)
    if (!current) return
    const next = order[Math.min(order.indexOf(current.status) + 1, order.length - 1)]
    if (next === current.status) return

    updateBoardItem(id, {
      status: next,
      dueLabel:
        next === 'review'
          ? 'In review'
          : next === 'scheduled'
            ? 'Ready to schedule'
            : next === 'published'
              ? 'Published · just now'
              : current.dueLabel,
    })
    setNotice(`${current.title} moved to ${statusCopy[next]}.`)
  }

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6 pb-10">
      {/* Hero header */}
      <header className="enter grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-end">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted">
            {creator.handle} · {openTasks} open tasks
          </p>
          <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3.15rem)] font-semibold leading-[1.05] tracking-tight text-ink">
            {greeting()}, {creator.name.split(' ')[0]}.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
            Welcome back! Here's a quick overview of your saved ideas, upcoming posts, and tasks.
          </p>
        </div>

        {nextDrop ? (
          <article className="enter enter-delay-1 relative overflow-hidden rounded-[18px] bg-ink px-5 py-5 text-cream shadow-[var(--shadow-board)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-copper-soft">
              Next post
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold leading-tight text-ivory">
              {nextDrop.title}
            </h2>
            <p className="mt-2 text-sm text-cream/65">
              {nextDrop.channel} · {nextDrop.format}
            </p>
            <p className="mt-4 text-sm text-cream/80">{nextDrop.dueLabel}</p>
          </article>
        ) : null}
      </header>

      {/* Stats strip */}
      <section className="enter enter-delay-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center gap-2">
              <stat.icon className="size-4 text-copper" />
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {stat.label}
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Board & sidebar */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Content board */}
        <section className="enter enter-delay-2 rounded-[20px] bg-ivory p-4 shadow-[var(--shadow-board)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Upcoming Content
              </h2>
              <p className="mt-1 text-sm text-muted">
                Draft → Review → Planned → Published
              </p>
            </div>
            <div
              className="flex flex-wrap gap-1.5"
              role="tablist"
              aria-label="Filter by status"
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === filter.id}
                  onClick={() => setStatusFilter(filter.id)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200',
                    statusFilter === filter.id
                      ? 'bg-ink text-ivory'
                      : 'bg-paper text-muted hover:text-ink',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {visibleBoard.length === 0 ? (
            <div className="mt-8 rounded-[14px] border border-dashed border-ink/15 px-5 py-10 text-center">
              <p className="font-display text-lg">Nothing matches that search.</p>
              <p className="mt-2 text-sm text-muted">
                Try a title, channel, or clear the filter.
              </p>
            </div>
          ) : (
            <ol className="mt-6">
              {visibleBoard.map((item, index) => (
                <li
                  key={item.id}
                  className={cn(
                    'board-row grid gap-3 px-2 py-4 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:items-start',
                    index !== 0 && 'border-t border-ink/8',
                  )}
                >
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      <ChannelDot channel={item.channel} />
                      {item.channel}
                    </p>
                    <p className="mt-1 text-sm text-ink/70">{item.format}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] font-semibold leading-snug">
                        {item.title}
                      </h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">
                      {item.notes}
                    </p>
                    <p className="mt-2 text-xs text-ink/55">{item.dueLabel}</p>
                  </div>
                  <div className="sm:pt-0.5">
                    {item.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-pine">
                        Live
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    ) : (
                      <Button
                        variant="quiet"
                        className="text-xs"
                        onClick={() => advancePiece(item.id)}
                      >
                        Move to {statusCopy[nextStatus(item.status)]}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Right sidebar */}
        <aside className="enter enter-delay-3 flex flex-col gap-6">
          {/* Quick Actions */}
          <section className="rounded-[20px] bg-ivory p-5 shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-xl font-semibold mb-4">Quick actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => window.location.href = '/ideas'} variant="quiet" className="flex-col !items-start gap-1 p-3 h-auto">
                <Lightbulb className="size-4 text-copper" />
                <span className="text-sm">Add Idea</span>
              </Button>
              <Button onClick={() => window.location.href = '/calendar'} variant="quiet" className="flex-col !items-start gap-1 p-3 h-auto">
                <Calendar className="size-4 text-pine" />
                <span className="text-sm">Plan Post</span>
              </Button>
              <Button onClick={() => window.location.href = '/tasks'} variant="quiet" className="flex-col !items-start gap-1 p-3 h-auto">
                <Check className="size-4 text-blue-500" />
                <span className="text-sm">Create Task</span>
              </Button>
              <Button onClick={() => window.location.href = '/ai'} variant="quiet" className="flex-col !items-start gap-1 p-3 h-auto bg-copper/5 hover:bg-copper/10">
                <Bot className="size-4 text-copper-deep" />
                <span className="text-sm">Chat with AI</span>
              </Button>
            </div>
          </section>

          {/* Today's tasks */}
          <section className="rounded-[20px] bg-ivory p-5 shadow-[var(--shadow-lift)]">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">Tasks to do</h2>
              <p className="text-xs text-muted">{openTasks} remaining</p>
            </div>
            <ul className="mt-4 space-y-1">
              {tasks.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-start gap-3 rounded-[12px] px-2 py-2.5 text-left transition-colors duration-200 hover:bg-paper"
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
                        task.done
                          ? 'border-pine bg-pine text-ivory'
                          : 'border-ink/20 text-transparent',
                      )}
                    >
                      {task.done ? <Check className="size-3" /> : null}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          'block text-sm leading-snug transition-colors duration-200',
                          task.done && 'text-muted line-through',
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {task.due} · {task.related}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Ideas */}
          {ideas.length > 0 && (
            <section className="rounded-[20px] bg-ivory p-5 shadow-[var(--shadow-lift)]">
              <h2 className="font-display text-xl font-semibold mb-4">Recent ideas</h2>
              <ul className="space-y-3">
                {ideas.slice(0, 3).map((idea) => (
                  <li key={idea.id} className="flex flex-col gap-1 rounded-[12px] p-3 text-left transition-colors duration-200 hover:bg-paper">
                    <span className="block text-sm font-semibold leading-snug">{idea.title}</span>
                    <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-muted">
                      <ChannelDot channel={idea.channel} className="size-1.5" />
                      {idea.channel} · {idea.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Studio log */}
          <section className="rounded-[20px] border border-ink/8 bg-canvas/70 p-5">
            <h2 className="font-display text-xl font-semibold">Studio log</h2>
            <ol className="mt-4 space-y-3">
              {activity.map((item) => (
                <li key={item.id} className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 text-sm">
                  <time className="font-medium text-muted">{item.time}</time>
                  <p className="leading-snug text-ink/80">{item.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      {/* Projects table */}
      <section className="enter enter-delay-4 overflow-hidden rounded-[20px] bg-ivory shadow-[var(--shadow-lift)]">
        <div className="flex items-end justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-display text-xl font-semibold">Active projects</h2>
            <p className="mt-1 text-sm text-muted">
              Same pieces as the board — kept in one place for later calendar and insights screens.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-y border-ink/8 bg-paper/80 text-[11px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Channel</th>
                <th className="px-4 py-3 font-medium">Next piece</th>
                <th className="px-4 py-3 font-medium">Pieces</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-ink/6 transition-colors duration-200 last:border-0 hover:bg-paper/60">
                  <td className="px-6 py-4 font-medium">{project.name}</td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-2 text-muted">
                      <ChannelDot channel={project.channel} />
                      {project.channel}
                    </span>
                  </td>
                  <td className="px-4 py-4">{project.next}</td>
                  <td className="px-4 py-4 tabular-nums text-muted">{project.pieces}</td>
                  <td className="px-6 py-4 text-muted">{project.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function nextStatus(status: ContentStatus): ContentStatus {
  if (status === 'draft') return 'review'
  if (status === 'review') return 'scheduled'
  return 'published'
}
