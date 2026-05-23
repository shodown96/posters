import { POSTER_H, POSTER_W } from '@/lib/constants'
import { Poster } from './Poster'

interface PosterTypeSelectorProps {
  onSelect: (type: 'individual' | 'group') => void
}

function PosterThumb({
  label,
  description,
  children,
  onClick,
}: {
  label: string
  description: string
  children: React.ReactNode
  onClick: () => void
}) {
  const maxThumbW = Math.min((window.innerWidth - 40) * 0.85, 260) + 60
  const scale = maxThumbW / POSTER_W
  const thumbW = POSTER_W * scale
  const thumbH = POSTER_H * scale

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3.5 bg-transparent border-none p-0 cursor-pointer"
    >
      <div
        style={{ width: thumbW, height: thumbH }}
        className="overflow-hidden rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.12)] shrink-0 transition-all duration-200 outline-2 outline-transparent outline-offset-[3px] group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:outline-orange"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            lineHeight: 0,
          }}
        >
          {children}
        </div>
      </div>
      <div className="text-center">
        <p className="font-black text-[clamp(15px,4vw,18px)] text-gray-900 m-0">{label}</p>
        <p className="font-light text-[clamp(12px,3vw,13px)] text-gray-500 mt-1">{description}</p>
      </div>
    </button>
  )
}

export function PosterTypeSelector({ onSelect }: PosterTypeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center px-2">
        <h1 className="font-black text-[clamp(22px,6vw,32px)] text-green m-0">
          CAIF 2026 Poster Maker
        </h1>
        <p className="font-light text-[clamp(13px,3.5vw,16px)] text-gray-500 mt-2">
          Choose a poster style to get started
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 w-full">
        <PosterThumb
          label="I'll be attending"
          description="Individual Poster"
          onClick={() => onSelect('individual')}
        >
          <Poster photo={null} name="Your Name" title="Your Title" />
        </PosterThumb>

        <PosterThumb
          label="We will be attending"
          description="Group / company poster"
          onClick={() => onSelect('group')}
        >
          <Poster photo={null} name="Group Name" title="Group Title" type="group" />
        </PosterThumb>
      </div>
    </div>
  )
}
