'use client'

import { useState } from 'react'
import { Play, AlertCircle } from 'lucide-react'

interface DemoStep {
  timestamp: number
  step: number
  title: string
  description: string
  status: 'pending' | 'active' | 'completed'
}

interface DemoPageClientProps {
  subscription: {
    id: string
    workspace_id: string
    plan_name: 'launch' | 'growth' | 'ops_stack'
    status: 'active' | 'past_due' | 'canceled'
  }
}

const DEMO_NARRATIVE: DemoStep[] = [
  {
    timestamp: 0,
    step: 1,
    title: 'Account inactive',
    description: 'System is ready but workflows are locked pending activation.',
    status: 'completed'
  },
  {
    timestamp: 100,
    step: 2,
    title: 'New inquiry arrives',
    description: 'Simulated lead from prospect inquiring about availability.',
    status: 'pending'
  },
  {
    timestamp: 200,
    step: 3,
    title: 'Workflow would trigger',
    description: 'Lead Response workflow checks lead data and prepares response.',
    status: 'pending'
  },
  {
    timestamp: 300,
    step: 4,
    title: 'Response queued',
    description: 'Auto-generated response is queued, waiting for activation.',
    status: 'pending'
  },
  {
    timestamp: 400,
    step: 5,
    title: 'Locked state',
    description: 'Workflow cannot execute. Activation required to proceed.',
    status: 'pending'
  },
  {
    timestamp: 500,
    step: 6,
    title: 'Stripe activation',
    description: 'Activation flow completes. System is now live.',
    status: 'pending'
  },
  {
    timestamp: 600,
    step: 7,
    title: 'Response executes',
    description: 'Auto-response is sent to prospect in under 60 seconds.',
    status: 'pending'
  },
  {
    timestamp: 700,
    step: 8,
    title: 'Follow-up scheduled',
    description: 'Follow-up reminder scheduled for 48 hours if no reply.',
    status: 'pending'
  },
  {
    timestamp: 800,
    step: 9,
    title: 'Admin routing queued',
    description: 'Lead is routed to leasing team dashboard for handoff.',
    status: 'pending'
  },
  {
    timestamp: 900,
    step: 10,
    title: 'KPI recorded',
    description: 'Response time (47s) recorded. Expansion option appears.',
    status: 'pending'
  }
]

export default function DemoPageClient({ subscription }: DemoPageClientProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>(DEMO_NARRATIVE)

  const handleRunDemo = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setDemoSteps(DEMO_NARRATIVE.map((s) => ({ ...s, status: 'pending' })))

    // Animate through steps
    let step = 0
    const interval = setInterval(() => {
      if (step <= DEMO_NARRATIVE.length - 1) {
        setCurrentStep(step)
        setDemoSteps((prev) =>
          prev.map((s, i) => ({
            ...s,
            status: i < step ? 'completed' : i === step ? 'active' : 'pending'
          }))
        )
        step++
      } else {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 500)
  }

  const isSubscriptionActive = subscription.status === 'active'

  return (
    <>
      {/* Page header */}
      <div className="border-b border-line px-6 py-5">
        <h1 className="text-20 font-bold text-tp">Demo Console</h1>
        <p className="text-14 text-ts mt-0.5">
          Run a simulated workflow to see how activation works.
        </p>
      </div>

      {/* Demo content */}
      <div className="px-6 py-5">
        <div className="max-w-3xl">
          {/* Intro card */}
          <div className="card rounded-lg border border-line bg-canvas p-6 mb-6">
            <h2 className="text-16 font-semibold text-tp">See the workflow execute</h2>
            <p className="text-14 text-ts mt-3">
              Run a simulated inquiry to watch the lead response workflow timeline. This shows what would happen when a prospect submits an inquiry after activation.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleRunDemo}
                disabled={isRunning}
                className={`flex items-center gap-2 px-4 py-2 text-14 font-medium rounded-lg transition-colors ${
                  isRunning
                    ? 'bg-surface-elevated text-ts cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run Simulation'}
              </button>
            </div>
          </div>

          {/* Demo narrative timeline */}
          <div className="space-y-4">
            {demoSteps.map((step, index) => (
              <div
                key={step.step}
                className={`card rounded-lg border transition-all ${
                  step.status === 'completed'
                    ? 'border-success bg-success/5'
                    : step.status === 'active'
                      ? 'border-primary bg-primary/5'
                      : 'border-line bg-canvas'
                }`}
              >
                <div className="p-4 flex gap-4 items-start">
                  {/* Step indicator */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-12 font-bold ${
                      step.status === 'completed'
                        ? 'bg-success text-white'
                        : step.status === 'active'
                          ? 'bg-primary text-white'
                          : 'bg-surface-elevated text-ts'
                    }`}
                  >
                    {step.status === 'completed' ? '✓' : step.step}
                  </div>

                  {/* Step content */}
                  <div className="flex-1">
                    <h3 className="text-14 font-semibold text-tp">
                      {step.step}. {step.title}
                    </h3>
                    <p className="text-13 text-ts mt-1">{step.description}</p>
                  </div>

                  {/* Step number for reference */}
                  <div className="text-12 text-ts flex-shrink-0">
                    {step.step < 10 ? `Step ${step.step}` : 'Complete'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activation status card */}
          <div className="card rounded-lg border border-line bg-canvas p-6 mt-6">
            <h3 className="text-16 font-semibold text-tp mb-4">After Activation</h3>
            {isSubscriptionActive ? (
              <div className="space-y-3">
                <p className="text-14 text-ts">
                  Your workspace is active. The workflow above is now live and responds to real inquiries.
                </p>
                <a
                  href="/dashboard/flows"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-14 font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Your Workflows →
                </a>
              </div>
            ) : (
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-14 font-medium text-tp">Activation Required</p>
                  <p className="text-13 text-ts mt-1">
                    Workflows are locked until you activate through Stripe. The simulation above shows what happens after activation.
                  </p>
                  <a
                    href="/pricing"
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-14 font-medium rounded-lg hover:bg-primary/90 transition-colors mt-4"
                  >
                    Activate Now →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
