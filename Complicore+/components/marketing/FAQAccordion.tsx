'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const panelId = `faq-panel-${i}`
        const headingId = `faq-heading-${i}`

        return (
          <div
            key={i}
            role="listitem"
            style={{
              backgroundColor: isOpen ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              transition: 'background-color var(--motion-standard)',
              overflow: 'hidden',
            }}
          >
            <h3 id={headingId} style={{ margin: 0 }}>
              <button
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: 'var(--space-3) var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '56px',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--font-size-16)',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {item.question}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    color: 'var(--color-text-secondary)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: `transform var(--motion-medium)`,
                  }}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              hidden={!isOpen}
              style={{
                padding: isOpen ? '0 var(--space-4) var(--space-3)' : '0',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--font-size-16)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {item.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
