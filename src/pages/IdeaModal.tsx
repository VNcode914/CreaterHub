import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useStore } from '../context/store/StoreProvider'
import type { Channel, IdeaItem, IdeaStatus } from '../data/studio'
import { useStudio } from '../context/studio-context'

type Props = {
    idea: IdeaItem | null
    onClose: () => void
}

const channels: Channel[] = ['YouTube', 'Instagram', 'X', 'LinkedIn', 'Blogs', 'TikTok', 'Other']
const statuses: IdeaStatus[] = ['Inbox', 'In Progress', 'Ready', 'Published']

const channelFormats: Record<Channel, string[]> = {
    YouTube: ['Video', 'Short', 'Tutorial'],
    Instagram: ['Reel', 'Carousel', 'Story'],
    X: ['Post', 'Thread'],
    LinkedIn: ['Professional post'],
    Blogs: ['Article', 'Guide'],
    TikTok: ['Short video'],
    Other: ['Other']
}

export function IdeaModal({ idea, onClose }: Props) {
    const { addIdea, updateIdea } = useStore()
    const { setNotice } = useStudio()

    const [title, setTitle] = useState(idea?.title ?? '')
    const [description, setDescription] = useState(idea?.description ?? '')
    const [channel, setChannel] = useState<Channel>(idea?.channel ?? 'YouTube')
    const [status, setStatus] = useState<IdeaStatus>(idea?.status ?? 'Inbox')
    const [format, setFormat] = useState(idea?.format ?? channelFormats['YouTube'][0])
    const [topic, setTopic] = useState(idea?.topic ?? '')
    const [tags, setTags] = useState(idea?.tags.join(', ') ?? '')

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()

        const parsedTags = tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)

        if (idea) {
            updateIdea(idea.id, {
                title,
                description,
                channel,
                status,
                format,
                topic,
                tags: parsedTags,
            })
            setNotice('Idea updated.')
        } else {
            addIdea({
                title,
                description,
                channel,
                status,
                format,
                topic,
                tags: parsedTags,
            })
            setNotice('Idea saved.')
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <div
                className="mobile-overlay"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div className="relative enter z-50 w-full max-w-[520px] rounded-[24px] bg-ivory p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4">
                    <h2 className="font-display text-xl font-semibold">
                        {idea ? 'Edit Idea' : 'Capture Idea'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[10px] p-2 text-muted hover:bg-ink/5 hover:text-ink"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-ink/70">Title</label>
                        <input
                            required
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 w-full rounded-[10px] border border-ink/10 bg-transparent px-3 py-2 text-ink shadow-sm outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                            placeholder="e.g. My new setup..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-ink/70">Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 w-full resize-none rounded-[10px] border border-ink/10 bg-transparent px-3 py-2 text-ink shadow-sm outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                            placeholder="Jot down the angle, outline, or key points..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-ink/70">Channel</label>
                            <select
                                value={channel}
                                onChange={(e) => {
                                    const newChannel = e.target.value as Channel
                                    setChannel(newChannel)
                                    setFormat(channelFormats[newChannel][0])
                                }}
                                className="mt-1 w-full rounded-[10px] border border-ink/10 bg-transparent px-3 py-2 text-ink outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                            >
                                {channels.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ink/70">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                                className="mt-1 w-full rounded-[10px] border border-ink/10 bg-transparent px-3 py-2 text-ink outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                            >
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-ink/70">Format</label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="mt-1 w-full rounded-[10px] border border-ink/10 bg-transparent px-3 py-2 text-ink outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                            >
                                {channelFormats[channel].map((f) => (
                                    <option key={f} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ink/70">Topic</label>
                            <input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="mt-1 w-full rounded-[10px] border border-ink/10 bg-transparent px-3 py-2 text-ink shadow-sm outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                                placeholder="e.g. Design"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-ink/70">Tags</label>
                        <input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="mt-1 w-full rounded-[10px] border border-ink/10 bg-transparent px-3 py-2 text-ink shadow-sm outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                            placeholder="gear, tips (comma separated)"
                        />
                    </div>

                    <div className="mt-4 flex justify-end gap-3 border-t border-ink/10 pt-4">
                        <Button variant="quiet" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {idea ? 'Save changes' : 'Save idea'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
