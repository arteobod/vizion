'use client'

import { useState, useRef, DragEvent } from 'react'

interface ImageUploaderProps {
  onUpload: (url: string) => void
  currentImage?: string
}

export default function ImageUploader({ onUpload, currentImage }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    setError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        onUpload(data.url)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      setError('Upload failed')
    }
    setUploading(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          dragging
            ? 'border-fv-orange bg-fv-orange/5'
            : 'border-fv-border hover:border-fv-border-light'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={handleChange}
        />
        <p className="font-mono text-xs text-fv-text-dim">
          {uploading ? 'Uploading...' : 'Drop image here or click to select'}
        </p>
        <p className="font-mono text-xs text-fv-text-muted mt-1">JPEG, PNG, WebP, AVIF (max 5MB)</p>
      </div>

      {error && (
        <p className="font-mono text-xs text-red-400 mt-2">{error}</p>
      )}

      {currentImage && (
        <div className="mt-3">
          <img src={currentImage} alt="Current" className="h-20 rounded border border-fv-border object-cover" />
        </div>
      )}
    </div>
  )
}
