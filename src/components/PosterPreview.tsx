import { POSTER_H, POSTER_W } from '@/lib/constants'
import { toPng } from 'html-to-image'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Poster } from './Poster'
import { Button } from './ui/button'
interface PosterPreviewProps {
  type: 'individual' | 'group'
  photo: string | null
  name: string
  title: string
  onBack: () => void
}

// Poster renders at 540px wide internally.
// We display it scaled down to fit mobile screens.
// The download capture uses a separate off-screen full-size render so
// html2canvas never has to deal with CSS transforms or clipped containers.

export function PosterPreview({ type, photo, name, title, onBack }: PosterPreviewProps) {
  const downloadRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!downloadRef.current) return
    setDownloading(true)
    try {
      await document.fonts.ready
      const dataUrl = await toPng(downloadRef.current, {
        skipAutoScale: true,
        pixelRatio: 2,
      })
      const link = document.createElement('a')
      link.download = `caif2026-${type === 'individual' ? 'attending' : 'group'}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  // Scale the visible preview to fit the viewport — JS-computed, must stay inline
  const displayScale = Math.min(0.65, (window.innerWidth - 40) / POSTER_W)
  const displayW = POSTER_W * displayScale
  const displayH = POSTER_H * displayScale

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="font-black text-[clamp(20px,5vw,26px)] text-green m-0">
          Your poster is ready!
        </h2>
        <p className="font-light text-sm text-gray-500 mt-1.5">
          Perfect for sharing on social media
        </p>
      </div>

      {/* Visible scaled preview — no height restriction, no overflow clip */}
      <div
        style={{ width: displayW, height: displayH }}
        className="rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.1)] shrink-0 overflow-hidden"
      >
        <div style={{ transform: `scale(${displayScale})`, transformOrigin: 'top left', lineHeight: 0 }}>
          <Poster photo={photo} name={name} title={title} type={type} />
        </div>
      </div>

      {/* Off-screen full-size poster used only for html2canvas capture */}
      <div
        style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none', fontFamily: "Raleway" }}
        aria-hidden
      >
        <Poster ref={downloadRef} photo={photo} name={name} title={title} type={type} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-90">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft size={16} />
          Edit
        </Button>
        <Button onClick={handleDownload} disabled={downloading} className="flex-2">
          {downloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Preparing…
            </>
          ) : (
            <>
              <Download size={16} />
              Download PNG
            </>
          )}
        </Button>
      </div>

      <p className="font-light text-xs text-gray-400 m-0 text-center">
        Downloads at full resolution, perfect for sharing
      </p>
    </div>
  )
}
