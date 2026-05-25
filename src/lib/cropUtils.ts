import type { Area } from 'react-easy-crop'

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.src = url
  })
}

export async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // Output at 800×800 for a high-quality circle crop
  const outputSize = 800
  canvas.width = outputSize
  canvas.height = outputSize

  // Clip to a circle
  ctx.beginPath()
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
  ctx.clip()

  // Draw the cropped region scaled to fill the output canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize,
  )

  return canvas.toDataURL('image/jpeg', 0.92)
}

/** Rectangular crop — no circular clipping, output matches the crop's aspect ratio */
export async function getCroppedImgRect(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // Preserve the exact crop dimensions (scaled up if needed for quality)
  const scale = Math.max(1, 800 / Math.max(pixelCrop.width, pixelCrop.height))
  canvas.width = Math.round(pixelCrop.width * scale)
  canvas.height = Math.round(pixelCrop.height * scale)

  // Draw the cropped region — no clipping path, pure rectangle
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  return canvas.toDataURL('image/jpeg', 0.92)
}
