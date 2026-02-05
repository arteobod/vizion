'use client'

import { useEffect, useState } from 'react'
import { ContactSubmission } from '@/types'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchContacts = async () => {
    const res = await fetch('/api/admin/contacts')
    const data = await res.json()
    setContacts(data)
    setLoading(false)
  }

  useEffect(() => { fetchContacts() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch('/api/admin/contacts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteId }),
    })
    setDeleteId(null)
    fetchContacts()
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
      <h1 className="font-mono text-xl font-bold text-fv-text mb-6 tracking-wider">CONTACT SUBMISSIONS</h1>

      {contacts.length === 0 ? (
        <div className="bg-fv-surface border border-fv-border rounded-xl p-12 text-center">
          <p className="font-mono text-xs text-fv-text-muted">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-fv-surface border border-fv-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-mono text-sm font-bold text-fv-text">{contact.name}</h3>
                  <p className="font-mono text-xs text-fv-orange mt-1">{contact.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-fv-text-muted">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setDeleteId(contact.id)}
                    className="font-mono text-xs text-red-500 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {contact.projectType && (
                <span className="inline-block font-mono text-xs px-2 py-0.5 border border-fv-border text-fv-text-muted rounded mb-3">
                  {contact.projectType}
                </span>
              )}

              <p className="font-mono text-xs text-fv-text-dim leading-relaxed">{contact.message}</p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Submission"
        message="Are you sure you want to delete this contact submission?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
