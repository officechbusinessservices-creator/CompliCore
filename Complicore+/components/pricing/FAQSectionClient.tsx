'use client'

import { FAQAccordion } from '@/components/marketing/FAQAccordion'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionClientProps {
  items: FAQItem[]
}

export function FAQSectionClient({ items }: FAQSectionClientProps) {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          Frequently Asked Questions
        </h2>
      </div>
      <FAQAccordion items={items} />
    </div>
  )
}
