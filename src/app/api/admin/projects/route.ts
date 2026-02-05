import { NextRequest, NextResponse } from 'next/server'
import { getProjects, addProject } from '@/lib/data'

export async function GET() {
  const projects = await getProjects()
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const projects = await getProjects()
    const maxNum = projects.reduce((max, p) => {
      const num = parseInt(p.id.replace('PRJ-', ''), 10)
      return isNaN(num) ? max : Math.max(max, num)
    }, 0)
    const newId = `PRJ-${String(maxNum + 1).padStart(3, '0')}`
    const project = { ...body, id: newId }
    await addProject(project)
    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
