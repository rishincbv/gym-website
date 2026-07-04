import { useEffect, useRef } from 'react'

const VERTEX_SHADER = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAGMENT_SHADER = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;
void main() {
    vec2 uv = v_texCoord;
    float time = u_time * 0.2;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;
    for(float i = 1.0; i < 4.0; i++) {
        p.x += 0.3 / i * sin(i * 3.0 * p.y + time);
        p.y += 0.3 / i * cos(i * 3.0 * p.x + time);
    }
    vec3 color1 = vec3(0.145, 0.388, 0.921);
    vec3 color2 = vec3(0.043, 0.043, 0.043);
    float mask = smoothstep(0.4, 0.8, length(p) * 0.5);
    vec3 finalColor = mix(color1 * 0.4, color2, mask);
    float glint = pow(1.0 - length(p), 10.0) * 0.5;
    finalColor += color1 * glint;
    gl_FragColor = vec4(finalColor, 1.0);
}`

interface ShaderCanvasProps {
  className?: string
}

export function ShaderCanvas({ className = 'absolute inset-0 h-full w-full' }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const glContext = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')
    if (!glContext || !(glContext instanceof WebGLRenderingContext)) return
    const gl: WebGLRenderingContext = glContext

    function compileShader(type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }

    const program = gl.createProgram()
    if (!program) return

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const pos = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, 'u_time')
    const uRes = gl.getUniformLocation(program, 'u_resolution')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 }

    function syncSize(): void {
      const el = canvasRef.current
      if (!el) return
      const w = el.clientWidth || 1280
      const h = el.clientHeight || 720
      if (el.width !== w || el.height !== h) {
        el.width = w
        el.height = h
      }
    }

    const resizeObserver = new ResizeObserver(syncSize)
    resizeObserver.observe(canvas)
    syncSize()

    const onMouseMove = (event: MouseEvent): void => {
      const el = canvasRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const nx = (event.clientX - rect.left) / rect.width
      const ny = 1.0 - (event.clientY - rect.top) / rect.height
      mouse = { x: nx * el.width, y: ny * el.height }
    }

    window.addEventListener('mousemove', onMouseMove)

    let frameId = 0
    const render = (t: number): void => {
      const el = canvasRef.current
      if (!el) return
      syncSize()
      gl.viewport(0, 0, el.width, el.height)
      if (uTime) gl.uniform1f(uTime, t * 0.001)
      if (uRes) gl.uniform2f(uRes, el.width, el.height)
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      frameId = requestAnimationFrame(render)
    }

    frameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
