import { useEffect, useRef } from "react"

export function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let width = 0
        let height = 0
        let points: Point[] = []

        const spacing = 40
        const radius = 2 // Increased radius
        const influenceRadius = 200 // Increased influence
        const color = "rgba(120, 113, 108, 0.4)" // Darker stone (Stone-500) and higher opacity

        class Point {
            x: number
            y: number
            originX: number
            originY: number
            vx: number
            vy: number
            size: number

            constructor(x: number, y: number) {
                this.x = x
                this.y = y
                this.originX = x
                this.originY = y
                this.vx = 0
                this.vy = 0
                this.size = radius
            }

            update(mouseX: number, mouseY: number) {
                const dx = mouseX - this.x
                const dy = mouseY - this.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const force = (influenceRadius - distance) / influenceRadius

                if (distance < influenceRadius) {
                    const angle = Math.atan2(dy, dx)
                    const pushX = Math.cos(angle) * force * 5
                    const pushY = Math.sin(angle) * force * 5

                    this.vx -= pushX
                    this.vy -= pushY
                }

                const springX = (this.originX - this.x) * 0.1
                const springY = (this.originY - this.y) * 0.1

                this.vx += springX
                this.vy += springY

                this.vx *= 0.8
                this.vy *= 0.8

                this.x += this.vx
                this.y += this.vy
            }

            draw(context: CanvasRenderingContext2D) {
                context.beginPath()
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                context.fillStyle = color
                context.fill()
            }
        }

        const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
            initPoints()
        }

        const initPoints = () => {
            points = []
            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    points.push(new Point(x + spacing / 2, y + spacing / 2))
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            points.forEach(point => {
                point.update(mouseRef.current.x, mouseRef.current.y)
                point.draw(ctx)
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        window.addEventListener("resize", resize)
        window.addEventListener("mousemove", (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        })

        resize()
        animate()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    )
}
