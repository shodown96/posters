import { useState } from 'react'
import { PosterTypeSelector } from './components/PosterTypeSelector'
import { PosterForm } from './components/PosterForm'
import { PosterPreview } from './components/PosterPreview'

type Step = 'select' | 'form' | 'preview'
type PosterType = 'individual' | 'group'

interface PosterState {
  type: PosterType
  name: string
  title: string
  photo: string | null
}

const STEPS: { id: Step; label: string }[] = [
  { id: 'select', label: 'Choose style' },
  { id: 'form', label: 'Your details' },
  { id: 'preview', label: 'Download' },
]

export default function App() {
  const [step, setStep] = useState<Step>('select')
  const [poster, setPoster] = useState<PosterState>({ type: 'individual', name: '', title: '', photo: null })

  const stepIndex = STEPS.findIndex((s) => s.id === step)

  const handleTypeSelect = (type: PosterType) => {
    setPoster((p) => ({ ...p, type }))
    setStep('form')
  }

  const handleFormSubmit = (data: { name: string; title: string; photo: string | null }) => {
    setPoster((p) => ({ ...p, ...data }))
    setStep('preview')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center gap-2.5">
        {/* <div className="w-2.5 h-2.5 rounded-full bg-orange shrink-0" /> */}
        <img src="/logo.webp" alt="" className='size-8' />
        <span className="font-black text-base text-green tracking-wide">CAIF 2026</span>
        <span className="font-light text-sm text-gray-400">Poster Maker</span>
      </header>

      {/* Step indicator */}
      <div className="flex justify-center items-start pt-4 px-4 overflow-x-auto">
        <div className="flex items-start gap-0 min-w-max">
          {STEPS.map((s, i) => {
            const active = step === s.id
            const done = stepIndex > i
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1 min-w-16">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                      active ? 'bg-green text-white' : done ? 'bg-orange text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  <span
                    className={`text-[clamp(10px,2.5vw,12px)] whitespace-nowrap text-center transition-all ${
                      active ? 'font-bold text-green' : 'font-light text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 mb-4.5 shrink-0 transition-colors w-[clamp(24px,8vw,48px)] ${
                      done ? 'bg-orange' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex justify-center px-4 py-8 box-border">
        <div className="w-full max-w-225">
          {step === 'select' && <PosterTypeSelector onSelect={handleTypeSelect} />}
          {step === 'form' && (
            <PosterForm
              type={poster.type}
              initialName={poster.name}
              initialTitle={poster.title}
              initialPhoto={poster.photo}
              onSubmit={handleFormSubmit}
              onBack={() => setStep('select')}
            />
          )}
          {step === 'preview' && (
            <PosterPreview
              type={poster.type}
              photo={poster.photo}
              name={poster.name}
              title={poster.title}
              onBack={() => setStep('form')}
            />
          )}
        </div>
      </main>
    </div>
  )
}
