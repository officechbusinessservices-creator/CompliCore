import { TimelineItem, type TimelineItemProps } from './TimelineItem'

interface TimelineProps {
  items: Omit<TimelineItemProps, 'isLast'>[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div
      role="list"
      aria-label="Workflow execution timeline"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {items.map((item, i) => (
        <div key={i} role="listitem">
          <TimelineItem {...item} isLast={i === items.length - 1} />
        </div>
      ))}
    </div>
  )
}
