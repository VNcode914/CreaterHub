import type { ContentStatus } from '../../data/studio'
import { statusCopy } from '../../data/studio'
import { cn } from '../../lib/cn'

const styles: Record<ContentStatus, string> = {
  draft: 'bg-sand/70 text-ink',
  review: 'bg-copper-soft text-copper-deep',
  scheduled: 'bg-pine-soft text-pine',
  published: 'bg-ink text-cream',
}

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
        styles[status],
      )}
    >
      {statusCopy[status]}
    </span>
  )
}
