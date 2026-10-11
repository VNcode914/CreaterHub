export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published'
export type Channel = 'YouTube' | 'Instagram' | 'X' | 'LinkedIn' | 'Blogs' | 'TikTok' | 'Other'

export type ContentItem = {
  id: string
  title: string
  format: string
  channel: Channel
  status: ContentStatus
  dueLabel: string
  dueDate: string
  projectId: string
  notes: string
}

export type IdeaStatus = 'Inbox' | 'In Progress' | 'Ready' | 'Published'

export type IdeaItem = {
  id: string
  title: string
  description: string
  channel: Channel
  format: string
  topic: string
  tags: string[]
  status: IdeaStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string
  isDeleted?: boolean
}

export type TaskItem = {
  id: string
  title: string
  related: string
  due: string
  done: boolean
}

export const initialIdeas: IdeaItem[] = [
  {
    id: 'i1',
    title: 'Camera Setup Walkthrough',
    description: 'A quick tour of my lighting and lens choices for 2026.',
    channel: 'YouTube',
    format: 'Video',
    topic: 'Behind the Scenes',
    tags: ['gear', 'tutorial'],
    status: 'In Progress',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'i2',
    title: 'Top 5 Notion Templates',
    description: 'Share the templates I use daily for studies.',
    channel: 'Instagram',
    format: 'Carousel',
    topic: 'Productivity',
    tags: ['notion', 'student'],
    status: 'Inbox',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export type ProjectItem = {
  id: string
  name: string
  channel: Channel
  next: string
  pieces: number
  status: string
}

export type ActivityItem = {
  id: string
  time: string
  text: string
}

export const creator = {
  name: 'Avery Sen',
  role: 'Student creator',
  handle: '@averysen',
  studio: 'Evening studio',
}

export const contentBoard: ContentItem[] = [
  {
    id: 'c1',
    title: 'Building my first SaaS',
    format: 'Long-form video',
    channel: 'YouTube',
    status: 'scheduled',
    dueLabel: 'Tue 14 Oct · 12:00',
    dueDate: '2026-10-14',
    projectId: 'p1',
    notes: 'A-roll recorded. Thumbnail still needs a quieter type lockup.',
  },
  {
    id: 'c2',
    title: '5 lessons from my first internship',
    format: 'Carousel',
    channel: 'Instagram',
    status: 'review',
    dueLabel: 'In review · frames 1–5',
    dueDate: '2026-10-12',
    projectId: 'p2',
    notes: 'Waiting on caption pass and alt text for each slide.',
  },
  {
    id: 'c3',
    title: 'The tools I actually use',
    format: 'Issue 18',
    channel: 'Blogs',
    status: 'draft',
    dueLabel: 'Draft · send window Thu',
    dueDate: '2026-10-16',
    projectId: 'p3',
    notes: 'Intro is done. Still listing three tools worth keeping.',
  },
  {
    id: 'c4',
    title: 'Why I switched to a content calendar',
    format: 'Vertical',
    channel: 'TikTok',
    status: 'published',
    dueLabel: 'Published · 7 Oct',
    dueDate: '2026-10-07',
    projectId: 'p1',
    notes: 'Held well in the first 48 hours. Pin a comment with the SaaS video date.',
  },
  {
    id: 'c5',
    title: 'What I learned shipping in public',
    format: 'Thread',
    channel: 'X',
    status: 'scheduled',
    dueLabel: 'Sat 18 Oct · 09:00',
    dueDate: '2026-10-18',
    projectId: 'p3',
    notes: 'Companion piece to the SaaS video, not a recap.',
  },
]

export const initialTasks: TaskItem[] = [
  {
    id: 't1',
    title: 'Record remaining A-roll for the SaaS video',
    related: 'Building my first SaaS',
    due: 'Today',
    done: false,
  },
  {
    id: 't2',
    title: 'Write alt text for internship carousel',
    related: '5 lessons from my first internship',
    due: 'Today',
    done: false,
  },
  {
    id: 't3',
    title: 'Finish tools newsletter intro',
    related: 'The tools I actually use',
    due: 'Tomorrow',
    done: true,
  },
  {
    id: 't4',
    title: 'Pin comment on last Short with 14 Oct date',
    related: 'Why I switched to a content calendar',
    due: 'Today',
    done: false,
  },
]

export const projects: ProjectItem[] = [
  {
    id: 'p1',
    name: 'First SaaS series',
    channel: 'YouTube',
    next: 'Building my first SaaS · 14 Oct',
    pieces: 4,
    status: 'In production',
  },
  {
    id: 'p2',
    name: 'Internship lessons',
    channel: 'Instagram',
    next: 'Carousel in review',
    pieces: 5,
    status: 'In review',
  },
  {
    id: 'p3',
    name: 'Weekly tools letter',
    channel: 'Blogs',
    next: 'Issue 18 draft',
    pieces: 18,
    status: 'Writing',
  },
]

export const activity: ActivityItem[] = [
  {
    id: 'a1',
    time: '16:40',
    text: 'Thumbnail variant B saved on “Building my first SaaS”.',
  },
  {
    id: 'a2',
    time: '14:12',
    text: 'Carousel moved to In review.',
  },
  {
    id: 'a3',
    time: '11:05',
    text: 'Short published: “Why I switched to a content calendar”.',
  },
]

export const statusCopy: Record<ContentStatus, string> = {
  draft: 'Draft',
  review: 'In review',
  scheduled: 'Scheduled',
  published: 'Published',
}

export const navItems = [
  { id: 'studio', label: 'Home', to: '/', ready: true },
  { id: 'ideas', label: 'Ideas', to: '/ideas', ready: true },
  { id: 'calendar', label: 'Calendar', to: '/calendar', ready: true },
  { id: 'tasks', label: 'Tasks', to: '/tasks', ready: true },
  { id: 'analytics', label: 'Insights', to: '/insights', ready: true },
  { id: 'ai', label: 'AI Companion', to: '/ai', ready: true },
  { id: 'bin', label: 'Recently Deleted', to: '/bin', ready: true },
  { id: 'settings', label: 'Settings', to: '/settings', ready: true },
] as const
