'use client'

import { useEffect, useState, useRef } from 'react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface ImageFile {
  filename: string
  url: string
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteFile, setDeleteFile] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchImages = async () => {
    const res = await fetch('/api/ctrl-8b2f/upload')
    const data: ImageFile[] = await res.json()
    setImages(data)
    setLoading(false)
  }

  useEffect(() => { fetchImages() }, [])

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      await fetch('/api/ctrl-8b2f/upload', { method: 'POST', body: formData })
    }
    setUploading(false)
    fetchImages()
  }

  const handleDelete = async () => {
    if (!deleteFile) return
    await fetch('/api/ctrl-8b2f/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: deleteFile }),
    })
    setDeleteFile(null)
    fetchImages()
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 1500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-fv-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mono text-xl font-bold text-fv-text tracking-wider">IMAGES</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-fv-orange text-white font-mono text-xs font-medium rounded-lg hover:bg-fv-orange-dim transition disabled:opacity-50 tracking-wider"
        >
          {uploading ? 'UPLOADING...' : '+ UPLOAD'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {images.length === 0 ? (
        <div className="bg-fv-surface border border-fv-border rounded-xl p-12 text-center">
          <p className="font-mono text-xs text-fv-text-muted">No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.filename}
              className="bg-fv-surface border border-fv-border rounded-xl overflow-hidden group relative"
            >
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(image.url)}
                  className="px-3 py-1 font-mono text-xs text-fv-text bg-fv-surface border border-fv-border rounded hover:bg-fv-dark transition"
                >
                  {copiedUrl === image.url ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  onClick={() => setDeleteFile(image.filename)}
                  className="px-3 py-1 font-mono text-xs text-red-400 bg-fv-surface border border-red-500/30 rounded hover:bg-red-500/10 transition"
                >
                  Delete
                </button>
              </div>

              <div className="px-2 py-2">
                <p className="font-mono text-xs text-fv-text-muted truncate">{image.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteFile !== null}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteFile(null)}
      />
    </div>
  )
}
