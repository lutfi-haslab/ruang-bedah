import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

/*
 * HeartModel3D — a real anatomical heart mesh (CC BY 4.0, see credit line)
 * rendered with Three.js: drag to rotate, scroll to zoom, optional heartbeat
 * pulse and floating structure labels projected from 3D anchor points.
 * Loaded lazily (React.lazy) so the three.js bundle only ships to this lesson.
 */

const LABELS: { name: string; pos: [number, number, number] }[] = [
  { name: 'Aorta', pos: [0.08, 0.84, 0.08] },
  { name: 'Pulmonary artery', pos: [0.3, 0.42, 0.42] },
  { name: 'Superior vena cava', pos: [-0.47, 0.74, 0.16] },
  { name: 'Right atrium', pos: [-0.55, 0.02, 0.2] },
  { name: 'Right ventricle', pos: [-0.05, -0.2, 0.52] },
  { name: 'Left atrium', pos: [0.28, 0.52, -0.34] },
  { name: 'Left ventricle', pos: [0.38, -0.44, 0.2] },
  { name: 'Apex', pos: [0.03, -0.95, 0.14] },
]

function Toggle({
  on,
  onClick,
  dark = false,
  children,
}: {
  on: boolean
  onClick: () => void
  dark?: boolean
  children: React.ReactNode
}) {
  const cls = dark
    ? on
      ? 'border-transparent bg-white/90 text-ink-900'
      : 'border-white/25 bg-black/45 text-[#f5e9e2] backdrop-blur-sm hover:border-white/60'
    : on
      ? 'border-primary-600 bg-primary-600 text-white'
      : 'border-line bg-surface text-ink-500 hover:border-primary-600 hover:text-primary-600'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition ${cls}`}
    >
      {children}
    </button>
  )
}

export default function HeartModel3D({ bare = false }: { bare?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const labelLayerRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef({ beat: true, spin: true, labels: true })
  const controlsRef = useRef<OrbitControls | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const [beat, setBeat] = useState(true)
  const [spin, setSpin] = useState(true)
  const [labels, setLabels] = useState(true)

  useEffect(() => {
    settingsRef.current = { beat, spin, labels }
    if (controlsRef.current) controlsRef.current.autoRotate = spin
  }, [beat, spin, labels])

  useEffect(() => {
    const mount = mountRef.current
    const labelLayer = labelLayerRef.current
    if (!mount || !labelLayer) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setStatus('failed')
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.06
    mount.appendChild(renderer.domElement)
    const canvas = renderer.domElement
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.touchAction = 'none'
    canvas.style.cursor = 'grab'

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.5

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    const HOME = new THREE.Vector3(2.15, 0.85, 3.35)
    camera.position.copy(HOME)

    const key = new THREE.DirectionalLight(0xfff2e6, 2.4)
    key.position.set(3, 4, 2.5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xff9a7a, 1.1)
    rim.position.set(-4, 1.5, -3)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0x402a24, 0.7))

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.enablePan = false
    controls.minDistance = 2.7
    controls.maxDistance = 7
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.1
    controlsRef.current = controls

    const group = new THREE.Group()
    group.rotation.y = 0.55
    scene.add(group)

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x9e2b25,
      roughness: 0.34,
      clearcoat: 0.65,
      clearcoatRoughness: 0.45,
      sheen: 0.5,
      sheenColor: new THREE.Color(0xe08a7d),
      emissive: 0x300605,
      emissiveIntensity: 0.25,
    })

    let disposed = false
    new GLTFLoader().load(
      '/assets/models/heart.glb',
      (gltf) => {
        if (disposed) return
        gltf.scene.traverse((o) => {
          if (o instanceof THREE.Mesh) o.material = material
        })
        group.add(gltf.scene)
        setStatus('ready')
      },
      undefined,
      () => setStatus('failed'),
    )

    // Label chips: one absolutely-positioned div per anchor, projected per frame.
    const chips = LABELS.map((l) => {
      const el = document.createElement('div')
      el.textContent = l.name
      el.className =
        'pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full bg-black/55 px-2 py-0.5 font-mono text-[10px] tracking-wide text-[#f5e9e2] backdrop-blur-sm'
      el.style.opacity = '0'
      labelLayer.appendChild(el)
      return { el, anchor: new THREE.Vector3(...l.pos) }
    })

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.05,
    })
    io.observe(mount)

    const clock = new THREE.Clock()
    const tmp = new THREE.Vector3()
    const center = new THREE.Vector3()
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      const t = clock.getElapsedTime()
      const s = settingsRef.current
      if (s.beat) {
        // ~70 bpm: a strong "lub" at phase 0, a softer "dub" at phase 0.3.
        const p = (t % 0.857) / 0.857
        const pulse =
          Math.exp(-Math.pow((p - 0.02) / 0.055, 2)) +
          0.55 * Math.exp(-Math.pow((p - 0.32) / 0.05, 2))
        group.scale.set(1 + 0.045 * pulse, 1 + 0.028 * pulse, 1 + 0.045 * pulse)
        material.emissiveIntensity = 0.25 + 0.35 * pulse
      } else {
        group.scale.set(1, 1, 1)
        material.emissiveIntensity = 0.25
      }
      controls.update()
      group.updateMatrixWorld()
      center.setFromMatrixPosition(group.matrixWorld)
      const w = mount.clientWidth
      const h = mount.clientHeight
      for (const chip of chips) {
        if (!s.labels) {
          chip.el.style.opacity = '0'
          continue
        }
        tmp.copy(chip.anchor).applyMatrix4(group.matrixWorld)
        const facing = tmp
          .clone()
          .sub(center)
          .normalize()
          .dot(camera.position.clone().sub(tmp).normalize())
        const projected = tmp.clone().project(camera)
        const x = (projected.x * 0.5 + 0.5) * w
        const y = (-projected.y * 0.5 + 0.5) * h
        chip.el.style.transform = `translate(-50%, -140%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
        chip.el.style.opacity = String(
          THREE.MathUtils.clamp((facing + 0.05) / 0.4, 0, 1) * 0.95,
        )
      }
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      controls.dispose()
      controlsRef.current = null
      pmrem.dispose()
      material.dispose()
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose()
      })
      renderer.dispose()
      canvas.remove()
      chips.forEach((c) => c.el.remove())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetView = () => {
    const controls = controlsRef.current
    if (!controls) return
    controls.object.position.set(2.15, 0.85, 3.35)
    controls.target.set(0, 0, 0)
    controls.update()
  }

  const controlsRow = (dark: boolean) => (
    <>
      <Toggle dark={dark} on={beat} onClick={() => setBeat((v) => !v)}>
        Heartbeat {beat ? 'on' : 'off'}
      </Toggle>
      <Toggle dark={dark} on={spin} onClick={() => setSpin((v) => !v)}>
        Auto-rotate {spin ? 'on' : 'off'}
      </Toggle>
      <Toggle dark={dark} on={labels} onClick={() => setLabels((v) => !v)}>
        Labels {labels ? 'on' : 'off'}
      </Toggle>
      <button
        type="button"
        onClick={resetView}
        className={
          dark
            ? 'rounded-full border border-white/25 bg-black/45 px-3.5 py-1.5 font-mono text-xs text-[#f5e9e2] backdrop-blur-sm transition hover:border-white/60'
            : 'rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-ink-500 transition hover:border-primary-600 hover:text-primary-600'
        }
      >
        Reset view
      </button>
    </>
  )

  return (
    <figure
      className={
        bare
          ? ''
          : 'overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]'
      }
    >
      {!bare && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3.5">
          <p className="mr-auto font-mono text-xs tracking-widest text-ink-400">
            3D EXPLORER · THREE.JS · DRAG TO ROTATE
          </p>
          {controlsRow(false)}
        </div>
      )}
      <div
        className="relative h-[340px] sm:h-[460px]"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 38%, #33201b 0%, #1c110d 55%, #100a08 100%)',
        }}
      >
        {bare && (
          <div className="absolute right-3 top-3 z-10 flex max-w-[85%] flex-wrap justify-end gap-1.5">
            {controlsRow(true)}
          </div>
        )}
        <div ref={mountRef} className="absolute inset-0" />
        <div ref={labelLayerRef} className="pointer-events-none absolute inset-0 overflow-hidden" />
        {status === 'loading' && (
          <div className="absolute inset-0 grid place-items-center">
            <p className="animate-pulse font-mono text-xs tracking-widest text-[#cdb9ae]">
              LOADING 3D MODEL…
            </p>
          </div>
        )}
        {status === 'failed' && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <p className="max-w-sm text-sm leading-relaxed text-[#cdb9ae]">
              The 3D viewer could not start on this device (WebGL unavailable). The labelled
              diagram and the Gray&rsquo;s Anatomy reference below show the same structures.
            </p>
          </div>
        )}
      </div>
      <figcaption className="border-t border-line px-5 py-3.5">
        <p className="text-sm leading-relaxed text-ink-700">
          The same heart as the 2D diagram — now as a real anatomical mesh you can hold:
          turn it over, find the arch of the aorta, and watch it beat. Labels fade as their
          structure turns away.
        </p>
        <p className="mt-1 font-mono text-xs text-ink-400">
          3D model: &ldquo;Realistic Human Heart&rdquo; by neshallads · CC BY 4.0 · via
          Wikimedia Commons · smoothed &amp; optimised for the web
        </p>
      </figcaption>
    </figure>
  )
}
