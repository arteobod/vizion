'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  connections: number[]
}

export default function GenerativeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let time = 0

    const CONNECTION_DIST = 180
    const NODE_COUNT_FACTOR = 0.00004 // nodes per pixel area
    const GRID_SPACING = 80

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width * window.devicePixelRatio
      canvas!.height = height * window.devicePixelRatio
      canvas!.style.width = width + 'px'
      canvas!.style.height = height + 'px'
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)
      initNodes()
    }

    function initNodes() {
      const count = Math.max(30, Math.floor(width * height * NODE_COUNT_FACTOR))
      nodes = []
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          connections: [],
        })
      }
    }

    function drawGrid() {
      // Subtle mathematical grid
      ctx!.strokeStyle = 'rgba(51, 51, 51, 0.15)'
      ctx!.lineWidth = 0.5

      // Vertical lines
      for (let x = 0; x < width; x += GRID_SPACING) {
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, height)
        ctx!.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < height; y += GRID_SPACING) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(width, y)
        ctx!.stroke()
      }

      // Intersection dots
      ctx!.fillStyle = 'rgba(51, 51, 51, 0.25)'
      for (let x = 0; x < width; x += GRID_SPACING) {
        for (let y = 0; y < height; y += GRID_SPACING) {
          ctx!.beginPath()
          ctx!.arc(x, y, 1, 0, Math.PI * 2)
          ctx!.fill()
        }
      }
    }

    function drawDataStreams() {
      // Vertical "data streams" — thin lines flowing down
      const streamCount = 5
      ctx!.lineWidth = 0.5

      for (let i = 0; i < streamCount; i++) {
        const x = ((i + 1) / (streamCount + 1)) * width
        const offset = (time * 30 + i * 200) % height
        const streamLength = 120

        const gradient = ctx!.createLinearGradient(x, offset - streamLength, x, offset)
        gradient.addColorStop(0, 'rgba(255, 69, 0, 0)')
        gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.06)')
        gradient.addColorStop(1, 'rgba(255, 69, 0, 0)')

        ctx!.strokeStyle = gradient
        ctx!.beginPath()
        ctx!.moveTo(x, offset - streamLength)
        ctx!.lineTo(x, offset)
        ctx!.stroke()
      }
    }

    function updateNodes() {
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy

        // Wrap around edges
        if (node.x < 0) node.x = width
        if (node.x > width) node.x = 0
        if (node.y < 0) node.y = height
        if (node.y > height) node.y = 0
      }
    }

    function drawNodes() {
      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12
            ctx!.strokeStyle = `rgba(224, 224, 224, ${alpha})`
            ctx!.lineWidth = 0.5
            ctx!.beginPath()
            ctx!.moveTo(nodes[i].x, nodes[i].y)
            ctx!.lineTo(nodes[j].x, nodes[j].y)
            ctx!.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx!.fillStyle = `rgba(224, 224, 224, 0.3)`
        ctx!.beginPath()
        ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx!.fill()
      }

      // A few orange accent nodes
      for (let i = 0; i < Math.min(3, nodes.length); i++) {
        const pulse = Math.sin(time * 2 + i * 2) * 0.5 + 0.5
        ctx!.fillStyle = `rgba(255, 69, 0, ${0.15 + pulse * 0.2})`
        ctx!.beginPath()
        ctx!.arc(nodes[i].x, nodes[i].y, nodes[i].radius + 1 + pulse, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function drawScanline() {
      // Horizontal scanline sweep
      const scanY = (time * 20) % height
      const gradient = ctx!.createLinearGradient(0, scanY - 2, 0, scanY + 2)
      gradient.addColorStop(0, 'rgba(255, 69, 0, 0)')
      gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.02)')
      gradient.addColorStop(1, 'rgba(255, 69, 0, 0)')
      ctx!.fillStyle = gradient
      ctx!.fillRect(0, scanY - 30, width, 60)
    }

    function animate() {
      time += 0.016
      ctx!.clearRect(0, 0, width, height)

      drawGrid()
      drawDataStreams()
      updateNodes()
      drawNodes()
      drawScanline()

      animRef.current = requestAnimationFrame(animate)
    }

    resize()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  )
}
