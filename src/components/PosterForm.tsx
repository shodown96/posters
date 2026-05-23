import { useState } from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { PhotoUploader } from './PhotoUploader'

interface PosterFormProps {
  type: 'individual' | 'group'
  initialName?: string
  initialTitle?: string
  initialPhoto?: string | null
  onSubmit: (data: { name: string; title: string; photo: string | null }) => void
  onBack: () => void
}

export function PosterForm({
  type,
  initialName = '',
  initialTitle = '',
  initialPhoto = null,
  onSubmit,
  onBack,
}: PosterFormProps) {
  const [name, setName] = useState(initialName)
  const [title, setTitle] = useState(initialTitle)
  const [photo, setPhoto] = useState<string | null>(initialPhoto)

  const canSubmit = photo !== null && name.trim() !== '' && title.trim() !== ''

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Heading */}
      <div className="text-center">
        <h2 className="font-black text-[clamp(20px,5vw,26px)] text-green m-0">
          {type === 'individual' ? "I'll be attending" : 'We will be attending'}
        </h2>
        <p className="font-light text-sm text-gray-500 mt-1.5">
          Fill in your details and upload your photo
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl p-[clamp(20px,5vw,32px)] w-full max-w-120 shadow-sm flex flex-col gap-5">
        {/* Photo uploader */}
        <div>
          <label className="block font-bold text-sm text-gray-700 mb-1.5">
            {type === 'individual' ? 'Your Photo' : 'Group Photo'}
          </label>
          <PhotoUploader value={photo} onChange={setPhoto} />
        </div>

        {/* Full Name */}
        <div>
          <label className="block font-bold text-sm text-gray-700 mb-1.5">
            {type === 'individual' ? 'Full Name' : 'Group / Company Name'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'individual' ? 'e.g. Jane Doe' : 'e.g. Acme Corp'}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm text-gray-900 outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
          />
        </div>

        {/* Title / Role */}
        <div>
          <label className="block font-bold text-sm text-gray-700 mb-1.5">
            {type === 'individual' ? 'Title / Role' : 'Tagline / Role'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'individual' ? 'e.g. Founder, Electro Co.' : 'e.g. Innovators & Builders'}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm text-gray-900 outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button
            onClick={() => onSubmit({ name, title, photo })}
            disabled={!canSubmit}
            className="flex-2"
          >
            Preview Poster →
          </Button>
        </div>
      </div>
    </div>
  )
}
