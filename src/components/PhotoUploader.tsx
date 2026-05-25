import { useState, useCallback, useRef } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { getCroppedImgRect } from '@/lib/cropUtils'
import { Upload, ZoomIn, ZoomOut, Check, X, ImageIcon } from 'lucide-react'
import { Button } from './ui/button'

interface PhotoUploaderProps {
  value: string | null
  onChange: (photo: string | null) => void
}

export function PhotoUploader({ value, onChange }: PhotoUploaderProps) {
  const [rawImage, setRawImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [applying, setApplying] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setRawImage(e.target?.result as string)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) loadFile(file)
    },
    [loadFile],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
    e.target.value = ''
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleApply = async () => {
    if (!rawImage || !croppedAreaPixels) return
    setApplying(true)
    try {
      const cropped = await getCroppedImgRect(rawImage, croppedAreaPixels)
      onChange(cropped)
      setRawImage(null)
    } finally {
      setApplying(false)
    }
  }

  const handleCancel = () => setRawImage(null)
  const openFilePicker = () => fileInputRef.current?.click()

  // Drop zone classes — border/bg depend on dragging/value state
  const dropZoneClass = [
    'flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200',
    value ? 'border-2 border-dashed p-2' : 'border-2 border-dashed p-8 min-h-[160px] gap-3',
    dragging
      ? 'border-orange bg-orange/5'
      : value
        ? 'border-green bg-green/[0.03]'
        : 'border-gray-300 bg-gray-50',
  ].join(' ')

  return (
    <>
      {/* Drop zone / preview */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={dropZoneClass}
      >
        {value ? (
          <div className="flex items-center gap-4 px-2 py-1 w-full">
            <div className="w-20 h-20 rounded-full- overflow-hidden shrink-0 border-[3px] border-green">
              <img src={value} alt="cropped" className="w-full h-full object-cover block" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[13px] text-gray-900 m-0">Photo selected</p>
              {/* <p className="font-light text-xs text-gray-500 mt-0.5 mb-0">Circular crop applied</p> */}
              <button
                onClick={(e) => { e.stopPropagation(); openFilePicker() }}
                className="mt-2 flex items-center gap-1 font-semibold text-xs text-green border border-green rounded-md px-2.5 py-0.5 bg-transparent cursor-pointer hover:bg-green/5 transition-colors"
              >
                <ImageIcon size={12} />
                Change photo
              </button>
            </div>
          </div>
        ) : (
          <>
            <Upload size={32} className="text-gray-400" />
            <div className="text-center">
              <p className="font-semibold text-sm text-gray-700 m-0">Drop your photo here</p>
              <p className="font-light text-[13px] text-gray-400 mt-1 m-0">
                or click to browse · JPG, PNG, WEBP
              </p>
            </div>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Crop modal */}
      {rawImage && (
        <div
          className="fixed inset-0 z-1000 flex flex-col bg-black/82"
          onClick={(e) => { if (e.target === e.currentTarget) handleCancel() }}
        >
          <div className="flex flex-col h-full max-w-130 w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0">
              <div>
                <p className="font-black text-[17px] text-white m-0">Crop your photo</p>
                <p className="font-light text-xs text-white/60 mt-0.5 m-0">
                  Drag to reposition · pinch or scroll to zoom
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/12 border-none text-white cursor-pointer shrink-0 hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Crop area */}
            <div className="flex-1 relative overflow-hidden">
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: { background: 'transparent' },
                  cropAreaStyle: {
                    border: '3px solid #F5A623',
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                  },
                }}
              />
            </div>

            {/* Zoom controls + apply */}
            <div className="px-6 pt-4 pb-7 shrink-0 flex flex-col gap-4 bg-black/40">
              {/* Zoom slider */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                  className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center"
                >
                  <ZoomOut size={20} />
                </button>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.02}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1 cursor-pointer"
                  style={{ accentColor: '#F5A623' }}
                />
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                  className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center"
                >
                  <ZoomIn size={20} />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={handleCancel}
                  className="flex-1 h-11 rounded-lg border border-white/25 bg-white/8 text-white font-semibold text-sm cursor-pointer flex items-center justify-center gap-1.5 hover:bg-white/[0.14] transition-colors"
                >
                  <X size={15} /> Cancel
                </button>
                <Button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-2 h-11 text-sm gap-1.5"
                >
                  <Check size={15} />
                  {applying ? 'Applying…' : 'Apply crop'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
