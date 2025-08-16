import { useEffect, useRef } from 'react'

function RouletteWheel({ numbers, rotation, isSpinning }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = canvas.width
    const center = size / 2
    ctx.clearRect(0, 0, size, size)

    const segmentAngle = (2 * Math.PI) / numbers.length
    const colors = ['#fde68a', '#a5f3fc', '#fca5a5', '#bbf7d0']

    numbers.forEach((num, i) => {
      const start = i * segmentAngle
      const end = start + segmentAngle
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, center, start, end)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(start + segmentAngle / 2)
      ctx.textAlign = 'center'
      ctx.fillStyle = '#1f2937'
      const fontSize = Math.max(12, center / 6)
      ctx.font = `${fontSize}px sans-serif`
      ctx.fillText(num, center * 0.65, 0)
      ctx.restore()
    })
  }, [numbers])

  const duration = isSpinning ? 8 : 0

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{
        transition: `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1)`,
        transform: `rotate(${rotation}deg)`
      }}
      className="rounded-full roulette-shadow"
    />
  )
}

export default RouletteWheel

