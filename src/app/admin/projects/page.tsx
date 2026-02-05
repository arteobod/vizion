'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Project } from '@/types'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchProjects = async () => {
    const res = await fetch('/api/admin/projects')
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/admin/projects/${deleteId}`, { method: 'DELETE' })
    setDeleteId(null)
    fetchProjects()
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
        <h1 className="font-mono text-xl font-bold text-fv-text tracking-wider">PROJECTS</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-fv-orange text-white font-mono text-xs font-medium rounded-lg hover:bg-fv-orange-dim transition tracking-wider"
        >
          + ADD PROJECT
        </Link>
      </div>

      <div className="bg-fv-surface border border-fv-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-fv-border">
              <th className="text-left px-6 py-3 font-mono text-xs text-fv-text-muted tracking-wider">ID</th>
              <th className="text-left px-6 py-3 font-mono text-xs text-fv-text-muted tracking-wider">TITLE</th>
              <th className="text-left px-6 py-3 font-mono text-xs text-fv-text-muted tracking-wider hidden md:table-cell">CLIENT</th>
              <th className="text-left px-6 py-3 font-mono text-xs text-fv-text-muted tracking-wider hidden lg:table-cell">TYPE</th>
              <th className="text-left px-6 py-3 font-mono text-xs text-fv-text-muted tracking-wider hidden sm:table-cell">YEAR</th>
              <th className="text-right px-6 py-3 font-mono text-xs text-fv-text-muted tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-fv-border/50 hover:bg-fv-dark/50 transition">
                <td className="px-6 py-4 font-mono text-xs text-fv-text-muted">{project.id}</td>
                <td className="px-6 py-4 font-mono text-sm text-fv-text font-medium">{project.title}</td>
                <td className="px-6 py-4 font-mono text-xs text-fv-text-dim hidden md:table-cell">{project.client}</td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="font-mono text-xs px-2 py-0.5 border border-fv-border text-fv-text-muted rounded">
                    {project.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-fv-text-dim hidden sm:table-cell">{project.year}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="px-3 py-1 font-mono text-xs text-fv-orange border border-fv-orange/30 rounded hover:bg-fv-orange/10 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(project.id)}
                      className="px-3 py-1 font-mono text-xs text-red-500 border border-red-500/30 rounded hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center font-mono text-xs text-fv-text-muted">
                  No projects yet. Add your first project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
