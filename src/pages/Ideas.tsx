import { useMemo, useState } from 'react'
import { Plus, Search, Lightbulb, Trash2, Edit2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ChannelDot } from '../components/ui/ChannelDot'
import { IdeaModal } from './IdeaModal'
import { cn } from '../lib/cn'
import type { Channel, IdeaItem, IdeaStatus } from '../data/studio'

const channels: Channel[] = ['YouTube', 'Instagram', 'X', 'LinkedIn', 'Blogs', 'TikTok', 'Other']
const statuses: IdeaStatus[] = ['Inbox', 'In Progress', 'Ready', 'Published']

export function Ideas() {
    const { ideas, deleteIdea } = useStore()
    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | IdeaStatus>('all')
    const [channelFilter, setChannelFilter] = useState<'all' | Channel>('all')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingIdea, setEditingIdea] = useState<IdeaItem | null>(null)

    const visibleIdeas = useMemo(() => {
        const needle = query.trim().toLowerCase()
        return ideas.filter((idea) => {
            const matchStatus = statusFilter === 'all' || idea.status === statusFilter
            const matchChannel = channelFilter === 'all' || idea.channel === channelFilter
            const matchQuery =
                needle.length === 0 ||
                `${idea.title} ${idea.description} ${idea.topic} ${idea.format} ${idea.tags.join(' ')}`
                    .toLowerCase()
                    .includes(needle)
            return matchStatus && matchChannel && matchQuery
        })
    }, [ideas, query, statusFilter, channelFilter])

    return (
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 pb-10">
            <header className="enter flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="font-display text-[clamp(2rem,4vw,3.15rem)] font-semibold leading-[1.05] tracking-tight text-ink">
                        Ideas
                    </h1>
                    <p className="mt-2 text-[15px] text-muted">
                        The scratchpad for your content studio.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={() => {
                            setEditingIdea(null)
                            setModalOpen(true)
                        }}
                    >
                        <Plus className="size-4" />
                        New idea
                    </Button>
                </div>
            </header>

            <section className="enter enter-delay-1 flex flex-col gap-4 rounded-[20px] bg-ivory p-4 shadow-[var(--shadow-board)] sm:p-6">
                {/* Filters and search */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] bg-ink/[0.04] px-3 py-2 sm:max-w-xs">
                        <Search className="size-4 shrink-0 text-muted" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search ideas..."
                            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="rounded-[10px] border border-ink/10 bg-transparent px-3 py-1.5 text-sm text-ink outline-none"
                        >
                            <option value="all">All statuses</option>
                            {statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Platforms Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:pb-0">
                    <button
                        onClick={() => setChannelFilter('all')}
                        className={`whitespace-nowrap rounded-[10px] px-3 py-1.5 text-sm font-medium transition-colors ${channelFilter === 'all'
                            ? 'bg-ink text-ivory'
                            : 'bg-ink/5 hover:bg-ink/10'
                            }`}
                    >
                        All Ideas
                        <span className="ml-2 text-xs opacity-60 px-1.5 py-0.5 rounded-full bg-black/20">{ideas.length}</span>
                    </button>
                    {channels.map((c) => {
                        const count = ideas.filter(i => i.channel === c).length
                        return (
                            <button
                                key={c}
                                onClick={() => setChannelFilter(c)}
                                className={`whitespace-nowrap rounded-[10px] px-3 py-1.5 text-sm font-medium transition-colors ${channelFilter === c
                                    ? 'bg-ink text-ivory'
                                    : 'bg-ink/5 hover:bg-ink/10'
                                    }`}
                            >
                                {c}
                                <span className={cn("ml-2 text-xs opacity-60 px-1.5 py-0.5 rounded-full", channelFilter === c ? "bg-white/20" : "bg-black/10 text-ink/70")}>{count}</span>
                            </button>
                        )
                    })}
                </div>
                {/* Ideas Grid */}
                {
                    ideas.length === 0 ? (
                        <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-ink/15 px-5 py-16 text-center text-muted">
                            <Lightbulb className="size-8 text-ink/30" />
                            <p className="font-display text-lg text-ink">No ideas yet</p>
                            <p className="text-sm">Click "New idea" to start capturing inspiration.</p>
                        </div>
                    ) : visibleIdeas.length === 0 ? (
                        <div className="mt-4 rounded-[14px] border border-dashed border-ink/15 px-5 py-10 text-center">
                            <p className="font-display text-lg">Nothing matches your search.</p>
                        </div>
                    ) : (
                        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleIdeas.map((idea) => (
                                <li
                                    key={idea.id}
                                    className="group relative flex flex-col gap-3 rounded-[16px] border border-ink/6 bg-paper/30 p-5 transition-colors hover:bg-paper/70"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-semibold leading-snug">{idea.title}</h3>
                                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button
                                                onClick={() => {
                                                    setEditingIdea(idea)
                                                    setModalOpen(true)
                                                }}
                                                className="rounded p-1 text-muted hover:bg-ink/10 hover:text-ink"
                                            >
                                                <Edit2 className="size-3.5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Delete this idea?')) {
                                                        deleteIdea(idea.id)
                                                    }
                                                }}
                                                className="rounded p-1 text-muted hover:bg-red-500/10 hover:text-red-600"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                                        <ChannelDot channel={idea.channel} />
                                        <span>{idea.channel}</span>
                                        {idea.format && (
                                            <>
                                                <span>·</span>
                                                <span>{idea.format}</span>
                                            </>
                                        )}
                                        <span>·</span>
                                        <span>{idea.status}</span>
                                    </div>
                                    {idea.description && (
                                        <p className="line-clamp-3 text-sm text-ink/75">
                                            {idea.description}
                                        </p>
                                    )}
                                    {(idea.topic || idea.tags.length > 0) && (
                                        <div className="mt-auto pt-2 flex flex-wrap gap-1.5">
                                            {idea.topic && (
                                                <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-ink/70">
                                                    {idea.topic}
                                                </span>
                                            )}
                                            {idea.tags.map(tag => (
                                                <span key={tag} className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-ink/70">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )
                }
            </section >

            {modalOpen && (
                <IdeaModal
                    idea={editingIdea}
                    onClose={() => {
                        setModalOpen(false)
                        setEditingIdea(null)
                    }}
                />
            )
            }
        </div >
    )
}
