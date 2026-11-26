import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from './primitives'

/* ------------------------------------------------------------------ */
/* Animated lesson labs. Each lab demonstrates one process: flow,      */
/* breathing, the cardiac cycle, or a surgical detour. Motion is the   */
/* teaching material here, never decoration.                           */
/* ------------------------------------------------------------------ */

function LabShell({
  diagram,
  panel,
  bare = false,
}: {
  diagram: ReactNode
  panel: ReactNode
  bare?: boolean
}) {
  return (
    <div
      className={
        bare
          ? ''
          : 'overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]'
      }
    >
      <div className="grid lg:grid-cols-[1.55fr_1fr]">
        <div className="relative min-w-0 bg-paper p-3 sm:p-5">{diagram}</div>
        <div className="min-w-0 border-t border-line p-6 sm:p-7 lg:border-l lg:border-t-0">{panel}</div>
      </div>
    </div>
  )
}

function Meter({ label, value, tone = 'bg-primary-600' }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs text-ink-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <span className="mt-1.5 block h-2 w-full overflow-hidden rounded-full bg-line" aria-hidden>
        <span className={`block h-full rounded-full transition-all duration-700 ${tone}`} style={{ width: `${value}%` }} />
      </span>
    </div>
  )
}

function Chip({ children, tone = 'sand' }: { children: ReactNode; tone?: 'sand' | 'open' | 'closed' }) {
  const cls =
    tone === 'open'
      ? 'bg-success-50 text-success-600 ring-success-500/25'
      : tone === 'closed'
        ? 'bg-arterial-50 text-arterial-600 ring-arterial-500/25'
        : 'bg-sand text-ink-700 ring-line'
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-xs font-medium ring-1 ring-inset ${cls}`}>
      {children}
    </span>
  )
}

/* ============================ Blood vessels ============================ */

type VesselId = 'artery' | 'capillary' | 'vein'

const VESSELS: Record<
  VesselId,
  { name: string; latin: string; wall: string; lumen: string; pressure: string; valves: string; blurb: string; wallMeter: number; pressureMeter: number }
> = {
  artery: {
    name: 'Artery',
    latin: 'arteria',
    wall: 'Thick — elastic fibres and smooth muscle',
    lumen: 'Relatively narrow',
    pressure: 'High, pulsing with each heartbeat',
    valves: 'None',
    blurb:
      'Arteries carry blood away from the heart. Their elastic walls stretch as a pulse wave arrives, then recoil to keep the blood moving between beats.',
    wallMeter: 95,
    pressureMeter: 90,
  },
  capillary: {
    name: 'Capillary',
    latin: 'vas capillare',
    wall: 'One cell thick — endothelium only',
    lumen: 'About one red blood cell wide',
    pressure: 'Low, and deliberately slow',
    valves: 'None',
    blurb:
      'Capillaries are where the actual exchange happens. Oxygen and nutrients leave, carbon dioxide and waste enter — the wall is thin because diffusion needs a short road.',
    wallMeter: 8,
    pressureMeter: 30,
  },
  vein: {
    name: 'Vein',
    latin: 'vena',
    wall: 'Thinner, less muscle than an artery',
    lumen: 'Wide — veins hold most of the blood volume',
    pressure: 'Low, no pulse',
    valves: 'Present in many limb veins',
    blurb:
      'Veins return blood to the heart at low pressure. Valves fold shut to stop it slipping backwards, and squeezing leg muscles help push it uphill.',
    wallMeter: 38,
    pressureMeter: 14,
  },
}

const VESSEL_ORDER: VesselId[] = ['artery', 'capillary', 'vein']

export function BloodVesselLab() {
  const [selected, setSelected] = useState<VesselId>('capillary')
  const [playing, setPlaying] = useState(true)
  const [pace, setPace] = useState<'rest' | 'active'>('rest')
  const info = VESSELS[selected]
  const dur = pace === 'rest' ? 7 : 3.8

  const zone = (id: VesselId, x: number, w: number) => (
    <rect
      x={x}
      y={70}
      width={w}
      height={390}
      rx={22}
      onClick={() => setSelected(id)}
      className="cursor-pointer"
      fill={selected === id ? '#0E7C86' : 'transparent'}
      opacity={selected === id ? 0.07 : 0}
      stroke={selected === id ? '#0E7C86' : 'transparent'}
      strokeWidth={2}
    />
  )

  const dot = (path: string, begin: number, fill: string, r = 9) => (
    <circle r={r} fill={fill} stroke="#fff" strokeWidth={2}>
      {playing && <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />}
    </circle>
  )

  return (
    <LabShell
      diagram={
        <svg viewBox="0 0 1000 540" className="w-full" role="img" aria-label="Animated diagram of blood flowing from an artery through capillaries into a vein">
          {zone('artery', 35, 305)}
          {zone('capillary', 340, 320)}
          {zone('vein', 660, 305)}

          <text x={185} y={118} textAnchor="middle" fontSize={24} fontWeight={800} fill="#16222E">Artery</text>
          <text x={500} y={118} textAnchor="middle" fontSize={24} fontWeight={800} fill="#16222E">Capillaries</text>
          <text x={815} y={118} textAnchor="middle" fontSize={24} fontWeight={800} fill="#16222E">Vein</text>
          <text x={185} y={146} textAnchor="middle" fontSize={15} fill="#6B7684">thick elastic wall</text>
          <text x={500} y={146} textAnchor="middle" fontSize={15} fill="#6B7684">exchange happens here</text>
          <text x={815} y={146} textAnchor="middle" fontSize={15} fill="#6B7684">thin wall · valves</text>

          {/* Artery */}
          <rect x={70} y={218} width={260} height={104} rx={52} fill="#8E2A25" />
          <rect x={70} y={247} width={260} height={46} rx={23} fill="#D64545" />
          {[105, 155, 205, 255, 300].map((x) => (
            <path key={x} d={`M${x} 224 v92`} stroke="#F0A49C" strokeWidth={5} opacity={0.55} />
          ))}

          {/* Capillary bed in tissue */}
          {[
            [405, 185], [480, 165], [565, 180], [430, 365], [515, 385], [600, 360],
          ].map(([cx, cy], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={34} ry={24} fill="#EFE9DC" stroke="#E0D9C6" />
          ))}
          <path d="M330 270 C420 195 520 205 650 270" fill="none" stroke="#C65D68" strokeWidth={17} strokeLinecap="round" />
          <path d="M330 270 C440 270 540 270 650 270" fill="none" stroke="#C65D68" strokeWidth={15} strokeLinecap="round" />
          <path d="M330 270 C420 345 520 335 650 270" fill="none" stroke="#C65D68" strokeWidth={17} strokeLinecap="round" />
          <g className="animate-pulse">
            <text x={492} y={222} textAnchor="middle" fontSize={19} fontWeight={700} fill="#B93327">O₂ out ↓</text>
            <text x={492} y={330} textAnchor="middle" fontSize={19} fontWeight={700} fill="#4D6EA3">CO₂ in ↑</text>
          </g>

          {/* Vein */}
          <rect x={670} y={205} width={260} height={130} rx={65} fill="#4D6EA3" />
          <rect x={670} y={238} width={260} height={64} rx={32} fill="#7FA0CF" />
          <path d="M795 238 l28 32 l-28 32 M851 238 l-28 32 l28 32" fill="none" stroke="#EAF0FA" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
          <text x={823} y={382} textAnchor="middle" fontSize={15} fill="#4D6EA3">valve — one way only</text>

          {/* Animated blood cells */}
          {dot('M88 270 H330', -0.2, '#FFD9D3', 10)}
          {dot('M88 270 H330', -2.4, '#FFD9D3', 10)}
          {dot('M88 270 H330', -4.8, '#FFD9D3', 10)}
          {dot('M330 270 C420 195 520 205 650 270', -1.2, '#E88A7B', 7)}
          {dot('M330 270 C440 270 540 270 650 270', -3.4, '#D97B8C', 7)}
          {dot('M330 270 C420 345 520 335 650 270', -5.4, '#B07BA6', 7)}
          {dot('M650 270 H918', -0.8, '#A9C3E8', 10)}
          {dot('M650 270 H918', -3.2, '#A9C3E8', 10)}
          {dot('M650 270 H918', -5.8, '#A9C3E8', 10)}

          <text x={500} y={505} textAnchor="middle" fontSize={16} fill="#6B7684">
            Watch the colour change: red in the artery → exchanging in the capillaries → blue in the vein
          </text>
        </svg>
      }
      panel={
        <div>
          <div className="grid grid-cols-3 gap-1 rounded-full bg-sand p-1" role="tablist" aria-label="Vessel type">
            {VESSEL_ORDER.map((id) => (
              <button
                key={id}
                onClick={() => setSelected(id)}
                aria-pressed={selected === id}
                className={`rounded-full px-2 py-2 font-display text-[0.82rem] font-bold transition-colors ${
                  selected === id ? 'bg-primary-600 text-white shadow-sm' : 'text-ink-700 hover:text-ink-950'
                }`}
              >
                {VESSELS[id].name}
              </button>
            ))}
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-primary-700">{info.latin}</p>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{info.name}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>

          <dl className="mt-5 space-y-2.5 text-sm">
            {[
              ['Wall', info.wall],
              ['Lumen', info.lumen],
              ['Pressure', info.pressure],
              ['Valves', info.valves],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-20 shrink-0 font-display font-bold text-ink-950">{k}</dt>
                <dd className="text-ink-700">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-4">
            <Meter label="Wall thickness" value={info.wallMeter} />
            <Meter label="Pressure" value={info.pressureMeter} tone="bg-arterial-500" />
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause flow' : '▶ Play flow'}
              </Button>
              <Button size="sm" variant={pace === 'rest' ? 'primary' : 'secondary'} onClick={() => setPace('rest')}>
                Resting
              </Button>
              <Button size="sm" variant={pace === 'active' ? 'primary' : 'secondary'} onClick={() => setPace('active')}>
                Exercising
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Exercising muscles demand more exchange, so the whole circuit speeds up — same vessels, faster traffic.
            </p>
          </div>
        </div>
      }
    />
  )
}

/* =============================== Lungs ================================ */

type LungStructureId = 'trachea' | 'bronchi' | 'lungs' | 'pleura' | 'diaphragm' | 'alveoli'

const LUNG_STRUCTURES: Record<LungStructureId, { name: string; latin: string; blurb: string; dot: { x: number; y: number } }> = {
  trachea: {
    name: 'Trachea',
    latin: 'trachea',
    blurb: 'The windpipe — a single tube held open by C-shaped cartilage rings, so air can always pass.',
    dot: { x: 500, y: 108 },
  },
  bronchi: {
    name: 'Bronchi',
    latin: 'bronchi principales',
    blurb: 'The trachea splits into two main bronchi, one per lung. The right bronchus is wider and steeper — which is why inhaled objects usually end up on the right.',
    dot: { x: 500, y: 228 },
  },
  lungs: {
    name: 'Lungs',
    latin: 'pulmones',
    blurb: 'Two spongy organs. The right lung has three lobes; the left has two, with a notch that makes room for the heart.',
    dot: { x: 285, y: 350 },
  },
  pleura: {
    name: 'Pleura',
    latin: 'pleura',
    blurb: 'A double membrane: the visceral layer wraps the lung, the parietal layer lines the chest. A film of fluid between them lets the lung slide — and glues it to the chest wall as it moves.',
    dot: { x: 168, y: 452 },
  },
  diaphragm: {
    name: 'Diaphragm',
    latin: 'diaphragma',
    blurb: 'The dome-shaped muscle under the lungs. When it contracts it flattens downward, expanding the chest — that is what pulls air in.',
    dot: { x: 500, y: 486 },
  },
  alveoli: {
    name: 'Alveoli',
    latin: 'alveoli pulmonis',
    blurb: 'Millions of tiny air sacs at the ends of the airways, wrapped in capillaries. Across their one-cell walls, oxygen and carbon dioxide trade places.',
    dot: { x: 655, y: 408 },
  },
}

const LUNG_ORDER: LungStructureId[] = ['trachea', 'bronchi', 'lungs', 'pleura', 'diaphragm', 'alveoli']

const RIGHT_LUNG =
  'M305 185 C195 205 150 315 172 425 C188 505 272 538 348 518 C405 502 424 432 408 332 C396 252 362 200 305 185 Z'
const LEFT_LUNG =
  'M695 185 C805 205 850 315 828 425 C812 505 728 538 652 518 C595 502 576 432 592 332 C604 252 638 200 695 185 Z'

export function LungsLab({ bare = false }: { bare?: boolean }) {
  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [rate, setRate] = useState(12)
  const [selected, setSelected] = useState<LungStructureId>('lungs')
  const info = LUNG_STRUCTURES[selected]
  const halfCycleMs = 30000 / rate

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setPhase((p) => (p === 'inhale' ? 'exhale' : 'inhale')), halfCycleMs)
    return () => clearInterval(t)
  }, [playing, halfCycleMs])

  const airDot = (path: string, begin: number) => (
    <circle r={8} fill="#0E7C86" stroke="#fff" strokeWidth={2} opacity={0.9}>
      {playing && (
        <animateMotion dur={`${halfCycleMs / 1000}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
      )}
    </circle>
  )
  const inhalePathR = 'M500 30 V180 C465 225 410 252 352 282'
  const inhalePathL = 'M500 30 V180 C535 225 590 252 648 282'
  const exhalePathR = 'M352 282 C410 252 465 225 500 180 V30'
  const exhalePathL = 'M648 282 C590 252 535 225 500 180 V30'

  return (
    <LabShell
      bare={bare}
      diagram={
        <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Animated diagram of the lungs breathing in and out">
          {/* Pleura outlines */}
          <path d={RIGHT_LUNG} transform="translate(287 350) scale(1.07) translate(-287 -350)" fill="none" stroke="#5F83C2" strokeWidth={3} strokeDasharray="9 8" opacity={0.75} />
          <path d={LEFT_LUNG} transform="translate(713 350) scale(1.07) translate(-713 -350)" fill="none" stroke="#5F83C2" strokeWidth={3} strokeDasharray="9 8" opacity={0.75} />

          {/* Trachea and bronchi */}
          <rect x={464} y={42} width={72} height={150} rx={30} fill="#B9D6D8" stroke="#0E7C86" strokeWidth={3} />
          {[72, 102, 132, 162].map((y) => (
            <path key={y} d={`M470 ${y} h60`} stroke="#0E7C86" strokeWidth={4} opacity={0.5} />
          ))}
          <path d="M500 185 C460 228 408 252 350 282" fill="none" stroke="#A9C7C9" strokeWidth={40} strokeLinecap="round" />
          <path d="M500 185 C540 228 592 252 650 282" fill="none" stroke="#A9C7C9" strokeWidth={40} strokeLinecap="round" />

          {/* Lungs — they scale with the breath */}
          <g className="svg-transition" style={{ transform: phase === 'inhale' ? 'scale(1.04)' : 'scale(0.982)' }}>
            <path d={RIGHT_LUNG} fill="#E58A7B" stroke="#B6544A" strokeWidth={4} />
          </g>
          <g className="svg-transition" style={{ transform: phase === 'inhale' ? 'scale(1.04)' : 'scale(0.982)' }}>
            <path d={LEFT_LUNG} fill="#E58A7B" stroke="#B6544A" strokeWidth={4} />
          </g>

          {/* Alveoli clusters */}
          {[
            [330, 395], [368, 425], [300, 448], [655, 408], [690, 438], [622, 452],
          ].map(([cx, cy], i) => (
            <g key={i} opacity={0.85}>
              <circle cx={cx} cy={cy} r={13} fill="#F6C6BB" stroke="#B6544A" strokeWidth={2} />
              <circle cx={cx + 15} cy={cy + 8} r={9} fill="#F6C6BB" stroke="#B6544A" strokeWidth={2} />
            </g>
          ))}

          {/* Airflow particles — direction follows the phase */}
          {airDot(phase === 'inhale' ? inhalePathR : exhalePathR, -0.3)}
          {airDot(phase === 'inhale' ? inhalePathL : exhalePathL, -1.1)}
          {airDot(phase === 'inhale' ? inhalePathR : exhalePathR, -1.9)}

          {/* Diaphragm — flattens down on inhale */}
          <g className="svg-transition" style={{ transform: `translateY(${phase === 'inhale' ? 13 : -3}px)` }}>
            <path d="M165 492 C340 430 660 430 835 492" fill="none" stroke="#43536A" strokeWidth={15} strokeLinecap="round" />
            <path d="M430 462 h140" stroke="#43536A" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
          </g>

          {/* Structure hotspots */}
          {LUNG_ORDER.map((id) => {
            const s = LUNG_STRUCTURES[id]
            const isActive = selected === id
            return (
              <g key={id} onClick={() => setSelected(id)} className="cursor-pointer">
                {isActive && <circle cx={s.dot.x} cy={s.dot.y} r={13} fill="none" stroke="#0E7C86" strokeWidth={2.5} className="ping-ring" />}
                <circle cx={s.dot.x} cy={s.dot.y} r={isActive ? 11 : 8} fill={isActive ? '#0E7C86' : '#16222E'} stroke="#fff" strokeWidth={2.5} />
              </g>
            )
          })}

        </svg>
      }
      panel={
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
                {playing ? 'Breathing' : 'Paused'}
              </p>
              <h3 className="mt-1 font-display text-3xl font-extrabold capitalize tracking-tight text-ink-950">{phase}</h3>
            </div>
            <span className={`font-display text-lg font-extrabold ${phase === 'inhale' ? 'text-primary-700' : 'text-venous-600'}`}>
              {phase === 'inhale' ? '▼ air in' : '▲ air out'}
            </span>
          </div>

          <div className="mt-4">
            <Meter label="Lung volume" value={phase === 'inhale' ? 88 : 46} tone={phase === 'inhale' ? 'bg-primary-600' : 'bg-venous-500'} />
          </div>

          <div className="mt-5">
            <label htmlFor="breath-rate" className="flex items-baseline justify-between font-mono text-xs text-ink-500">
              <span>Breathing rate</span>
              <span>{rate} breaths / min</span>
            </label>
            <input
              id="breath-rate"
              type="range"
              min={8}
              max={24}
              step={1}
              value={rate}
              onChange={(e) => setRate(e.currentTarget.valueAsNumber)}
              className="mt-2 w-full accent-[#0E7C86]"
            />
            <p className="mt-1.5 text-sm text-ink-500">Resting adults breathe about 12–20 times a minute. Try 20 and watch the pace.</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setPlaying((p) => !p)}>
              {playing ? '❚❚ Pause breath' : '▶ Play breath'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setPlaying(false)
                setPhase('inhale')
              }}
            >
              Hold inhale
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setPlaying(false)
                setPhase('exhale')
              }}
            >
              Hold exhale
            </Button>
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <div className="flex flex-wrap gap-1.5">
              {LUNG_ORDER.map((id) => (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  aria-pressed={selected === id}
                  className={`rounded-full px-3 py-1.5 font-display text-[0.8rem] font-bold ring-1 ring-inset transition-colors ${
                    selected === id ? 'bg-primary-600 text-white ring-primary-600' : 'bg-surface text-ink-700 ring-line hover:text-ink-950'
                  }`}
                >
                  {LUNG_STRUCTURES[id].name}
                </button>
              ))}
            </div>
            <p className="mt-3 font-serif text-sm italic text-ink-500">{info.latin}</p>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>
          </div>
        </div>
      }
    />
  )
}

/* ============================ Cardiac cycle =========================== */

type CyclePhase = {
  name: string
  short: string
  ecg: string
  sound: string
  av: 'Open' | 'Closed'
  semilunar: 'Open' | 'Closed'
  pressure: number
  volume: number
  squeeze: 'atria' | 'ventricles' | 'none'
  flow: 'fill' | 'eject' | 'none'
  text: string
}

const CYCLE_PHASES: CyclePhase[] = [
  {
    name: 'Atrial systole — the top-up',
    short: 'Atria squeeze',
    ecg: 'P wave',
    sound: '—',
    av: 'Open',
    semilunar: 'Closed',
    pressure: 12,
    volume: 96,
    squeeze: 'atria',
    flow: 'fill',
    text: 'The atria contract together and top the ventricles up with a final squeeze of blood. Most filling already happened passively — this is the finishing push.',
  },
  {
    name: 'Ventricular systole — ejection',
    short: 'Ventricles eject',
    ecg: 'QRS complex, then T wave begins',
    sound: 'S1 · “lub” — AV valves close',
    av: 'Closed',
    semilunar: 'Open',
    pressure: 92,
    volume: 38,
    squeeze: 'ventricles',
    flow: 'eject',
    text: 'The ventricles contract hard. Pressure slams the AV valves shut (that is the first heart sound) and forces the semilunar valves open, ejecting blood into the aorta and pulmonary artery.',
  },
  {
    name: 'Early diastole — relaxation',
    short: 'Everything relaxes',
    ecg: 'T wave ends',
    sound: 'S2 · “dub” — semilunar valves close',
    av: 'Closed',
    semilunar: 'Closed',
    pressure: 30,
    volume: 34,
    squeeze: 'none',
    flow: 'none',
    text: 'The ventricles relax and pressure falls. The semilunar valves snap shut to stop blood falling back — the second heart sound. For a brief moment, every valve is closed.',
  },
  {
    name: 'Filling — the quiet majority',
    short: 'Passive filling',
    ecg: 'Flat baseline, drifting to the next P wave',
    sound: '—',
    av: 'Open',
    semilunar: 'Closed',
    pressure: 10,
    volume: 82,
    squeeze: 'none',
    flow: 'fill',
    text: 'Ventricular pressure drops below atrial pressure, the AV valves open, and blood flows in on its own. Most of the filling happens here, with no contraction at all — then the cycle repeats.',
  },
]

export function CardiacCycleLab() {
  const [step, setStep] = useState(1)
  const [playing, setPlaying] = useState(true)
  const phase = CYCLE_PHASES[step]

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStep((s) => (s + 1) % CYCLE_PHASES.length), 2100)
    return () => clearInterval(t)
  }, [playing])

  const atriaScale = phase.squeeze === 'atria' ? 0.93 : 1
  const ventScale = phase.squeeze === 'ventricles' ? 0.92 : phase.flow === 'fill' ? 1.02 : 1

  return (
    <LabShell
      diagram={
        <div>
          <svg viewBox="0 0 1000 520" className="w-full" role="img" aria-label="Animated schematic of the cardiac cycle phases">
            {/* Outflow vessels */}
            <path d="M500 148 C500 96 545 66 600 70 C650 74 672 112 660 150" fill="none" stroke="#D64545" strokeWidth={40} strokeLinecap="round" />
            <path d="M500 148 C470 108 420 92 380 108" fill="none" stroke="#5F83C2" strokeWidth={34} strokeLinecap="round" />
            <text x={668} y={92} fontSize={17} fontWeight={700} fill="#B93327">Aorta</text>
            <text x={238} y={96} fontSize={17} fontWeight={700} fill="#4D6EA3">Pulmonary artery</text>

            {/* Atria */}
            <g className="svg-transition" style={{ transform: `scale(${atriaScale})` }}>
              <ellipse cx={352} cy={185} rx={108} ry={72} fill="#7E2A33" />
              <ellipse cx={648} cy={185} rx={108} ry={72} fill="#B03A2E" />
            </g>
            <text x={352} y={192} textAnchor="middle" fontSize={19} fontWeight={700} fill="#fff">Right atrium</text>
            <text x={648} y={192} textAnchor="middle" fontSize={19} fontWeight={700} fill="#fff">Left atrium</text>

            {/* Ventricles */}
            <g className="svg-transition" style={{ transform: `scale(${ventScale})` }}>
              <path d="M258 268 C250 360 320 438 420 462 C462 472 492 448 494 402 L494 268 Z" fill="#93322C" />
              <path d="M506 268 L506 402 C508 448 538 472 580 462 C680 438 750 360 742 268 Z" fill="#E2604F" />
            </g>
            <text x={372} y={372} textAnchor="middle" fontSize={19} fontWeight={700} fill="#fff">Right ventricle</text>
            <text x={628} y={372} textAnchor="middle" fontSize={19} fontWeight={700} fill="#fff">Left ventricle</text>

            {/* Valve indicators */}
            <circle cx={500} cy={262} r={15} fill={phase.av === 'Open' ? '#2F9E6E' : '#B93327'} stroke="#fff" strokeWidth={3} />
            <text x={500} y={300} textAnchor="middle" fontSize={15} fontWeight={700} fill="#43536A">AV valves {phase.av.toLowerCase()}</text>
            <circle cx={500} cy={150} r={15} fill={phase.semilunar === 'Open' ? '#2F9E6E' : '#B93327'} stroke="#fff" strokeWidth={3} />

            {/* Flow arrows */}
            {phase.flow === 'fill' && (
              <g stroke="#0E7C86" strokeWidth={7} strokeLinecap="round" fill="none" className="flow-line">
                <path d="M352 262 v52" />
                <path d="M648 262 v52" />
              </g>
            )}
            {phase.flow === 'eject' && (
              <g stroke="#D64545" strokeWidth={7} strokeLinecap="round" fill="none" className="flow-line">
                <path d="M500 132 V78" />
                <path d="M420 300 C460 240 480 210 492 168" />
                <path d="M580 300 C540 240 520 210 508 168" />
              </g>
            )}
            {phase.flow === 'none' && (
              <text x={500} y={352} textAnchor="middle" fontSize={20} fontWeight={800} fill="#43536A">all valves closed — a held breath</text>
            )}

            {/* ECG strip with the current segment highlighted */}
            <path
              d="M70 494 H210 l10 -4 l8 -14 l10 24 l8 -10 H420 l12 -6 l16 -34 l18 52 l14 -18 H640 l14 -4 c18 -22 42 -22 60 0 l10 4 H930"
              fill="none"
              stroke="#16222E"
              strokeWidth={3.5}
            />
            <rect
              x={[198, 420, 628, 742][step]}
              y={472}
              width={[76, 130, 128, 172][step]}
              height={42}
              rx={12}
              fill="none"
              stroke="#0E7C86"
              strokeWidth={3}
            />
            <text x={70} y={462} fontSize={15} fill="#6B7684">ECG — the highlighted segment is this phase</text>
          </svg>

          {/* Phase timeline */}
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CYCLE_PHASES.map((p, i) => (
              <button
                key={p.name}
                onClick={() => {
                  setStep(i)
                  setPlaying(false)
                }}
                aria-pressed={step === i}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  step === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="block font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">Phase {i + 1}</span>
                <span className="mt-0.5 block font-display text-[0.9rem] font-bold leading-tight text-ink-950">{p.short}</span>
              </button>
            ))}
          </div>
        </div>
      }
      panel={
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
            Phase {step + 1} of 4 · ECG: {phase.ecg}
          </p>
          <h3 className="mt-1.5 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink-950">{phase.name}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{phase.text}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip tone={phase.av === 'Open' ? 'open' : 'closed'}>AV valves · {phase.av}</Chip>
            <Chip tone={phase.semilunar === 'Open' ? 'open' : 'closed'}>Semilunar · {phase.semilunar}</Chip>
            <Chip>Sound · {phase.sound}</Chip>
          </div>

          <div className="mt-6 grid gap-4">
            <Meter label="Ventricular pressure" value={phase.pressure} tone="bg-arterial-500" />
            <Meter label="Ventricular volume" value={phase.volume} />
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <Button size="sm" onClick={() => setPlaying((p) => !p)}>
              {playing ? '❚❚ Pause cycle' : '▶ Play cycle'}
            </Button>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              One full cycle at rest takes about 0.8 seconds. Notice the valves never “decide” anything —
              pressure differences push them open and shut.
            </p>
          </div>
        </div>
      }
    />
  )
}

/* ================================ CABG ================================ */

const CABG_STEPS = [
  {
    title: 'Map the blockage',
    text: 'Imaging shows a coronary artery narrowed by plaque. Beyond the narrowing, heart muscle is starved of oxygen — that starved territory is what the operation must re-supply.',
  },
  {
    title: 'Prepare the graft',
    text: 'The surgeon takes a spare vessel — often the internal thoracic artery from inside the chest wall, or a vein from the leg — to serve as the new pipe.',
  },
  {
    title: 'Attach beyond the blockage',
    text: 'One end of the graft is sewn into the aorta (or left connected at its origin), the other end into the coronary artery past the narrowing. Blood now flows around the blockage — a detour, not a repair of the original road.',
  },
]

const GRAFT_PATH = 'M648 118 C795 158 828 302 705 388 C615 450 508 458 430 430'
const NATIVE_PATH = 'M520 205 C472 248 424 266 398 306'

export function CabgLab() {
  const [mode, setMode] = useState<'blocked' | 'bypass'>('bypass')
  const [step, setStep] = useState(2)
  const [playing, setPlaying] = useState(true)
  const bypass = mode === 'bypass'
  const flow = bypass ? 92 : 34

  const pickStep = (i: number) => {
    setStep(i)
    if (i === 0) setMode('blocked')
    if (i === 2) setMode('bypass')
  }

  const graftDot = (begin: number) => (
    <circle r={10} fill="#FFD9D3" stroke="#fff" strokeWidth={2}>
      {playing && <animateMotion dur="4.2s" begin={`${begin}s`} repeatCount="indefinite" path={GRAFT_PATH} />}
    </circle>
  )
  const nativeDot = (begin: number) => (
    <circle r={9} fill="#FFD9D3" stroke="#fff" strokeWidth={2}>
      {playing && <animateMotion dur="3s" begin={`${begin}s`} repeatCount="indefinite" path={NATIVE_PATH} />}
    </circle>
  )

  return (
    <LabShell
      diagram={
        <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Animated diagram of a coronary artery bypass graft routing blood around a blockage">
          {/* Aorta */}
          <path d="M520 178 C516 92 590 48 668 78 C730 102 738 168 692 206" fill="none" stroke="#D64545" strokeWidth={46} strokeLinecap="round" />
          <text x={742} y={86} fontSize={19} fontWeight={700} fill="#B93327">Aorta</text>

          {/* Heart */}
          <path
            d="M500 516 C362 434 288 334 300 228 C312 138 418 104 500 182 C582 104 688 138 700 228 C712 334 638 434 500 516 Z"
            fill="#C7433B"
          />
          <path d="M500 182 C440 140 350 150 322 225 C300 285 340 380 430 450 C380 350 372 250 430 190 C452 168 478 172 500 182 Z" fill="#B03A2E" opacity={0.65} />

          {/* Coronary artery across the front */}
          <path d={NATIVE_PATH} fill="none" stroke="#7E1F1A" strokeWidth={24} strokeLinecap="round" />
          <path d={NATIVE_PATH} fill="none" stroke="#E2604F" strokeWidth={13} strokeLinecap="round" />
          <path
            d="M398 306 C372 348 380 402 424 438 C452 460 492 462 520 446"
            fill="none"
            stroke="#7E1F1A"
            strokeWidth={24}
            strokeLinecap="round"
            opacity={bypass ? 1 : 0.45}
          />
          <path
            d="M398 306 C372 348 380 402 424 438 C452 460 492 462 520 446"
            fill="none"
            stroke="#E2604F"
            strokeWidth={13}
            strokeLinecap="round"
            opacity={bypass ? 1 : 0.45}
          />
          <path d="M520 205 C585 238 628 256 652 302" fill="none" stroke="#E2604F" strokeWidth={12} strokeLinecap="round" />

          {/* Plaque / blockage */}
          <g transform="rotate(-38 398 306)">
            <ellipse cx={398} cy={306} rx={34} ry={19} fill="#F2C14E" stroke="#B45309" strokeWidth={3} />
            <ellipse cx={398} cy={306} rx={13} ry={7} fill="#7E1F1A" />
          </g>
          {step === 0 && <circle cx={398} cy={306} r={16} fill="none" stroke="#B45309" strokeWidth={3} className="ping-ring" />}
          <text x={118} y={272} fontSize={18} fontWeight={700} fill="#B45309">Blockage (plaque)</text>
          <path d="M292 278 C330 288 362 296 384 302" stroke="#B45309" strokeWidth={2.5} fill="none" />

          {/* Bypass graft */}
          <g opacity={bypass ? 1 : step === 1 ? 0.55 : 0.12} style={{ transition: 'opacity 0.7s ease' }}>
            <path d={GRAFT_PATH} fill="none" stroke="#8E2A25" strokeWidth={31} strokeLinecap="round" strokeDasharray={bypass ? undefined : '14 10'} />
            <path d={GRAFT_PATH} fill="none" stroke="#E8A19A" strokeWidth={17} strokeLinecap="round" strokeDasharray={bypass ? undefined : '14 10'} />
            <circle cx={648} cy={118} r={13} fill="#8E2A25" stroke="#fff" strokeWidth={3} />
            <circle cx={430} cy={430} r={13} fill="#8E2A25" stroke="#fff" strokeWidth={3} />
          </g>
          {(bypass || step === 1) && (
            <>
              <text x={842} y={286} fontSize={18} fontWeight={700} fill="#8E2A25">Bypass graft</text>
              <path d="M838 292 C800 300 762 322 724 352" stroke="#8E2A25" strokeWidth={2.5} fill="none" />
            </>
          )}

          {/* Flow */}
          {nativeDot(-0.4)}
          {nativeDot(-1.8)}
          {bypass && graftDot(-0.5)}
          {bypass && graftDot(-2.1)}
          {bypass && graftDot(-3.6)}
          {!bypass && (
            <text x={520} y={540} textAnchor="middle" fontSize={16} fill="#B45309">
              Flow stalls at the plaque — the muscle beyond it runs on fumes
            </text>
          )}
          {bypass && (
            <text x={520} y={540} textAnchor="middle" fontSize={16} fill="#23805A">
              Blood takes the graft and re-enters the artery beyond the blockage
            </text>
          )}

          <text x={118} y={448} fontSize={18} fontWeight={700} fill="#7E1F1A">Coronary artery</text>
          <text x={742} y={470} fontSize={18} fontWeight={700} fill="#43536A">Heart muscle</text>
        </svg>
      }
      panel={
        <div>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-sand p-1" role="tablist" aria-label="Before or after bypass">
            <button
              onClick={() => setMode('blocked')}
              aria-pressed={!bypass}
              className={`rounded-full px-3 py-2 font-display text-[0.85rem] font-bold transition-colors ${
                !bypass ? 'bg-arterial-500 text-white shadow-sm' : 'text-ink-700 hover:text-ink-950'
              }`}
            >
              Blocked artery
            </button>
            <button
              onClick={() => setMode('bypass')}
              aria-pressed={bypass}
              className={`rounded-full px-3 py-2 font-display text-[0.85rem] font-bold transition-colors ${
                bypass ? 'bg-primary-600 text-white shadow-sm' : 'text-ink-700 hover:text-ink-950'
              }`}
            >
              After bypass
            </button>
          </div>

          <div className="mt-6">
            <Meter label="Blood flow to the muscle beyond the blockage" value={flow} tone={bypass ? 'bg-success-500' : 'bg-amber-500'} />
            <p className="mt-2 text-sm text-ink-500">
              {bypass
                ? 'The detour restores supply. The original blockage is still there — the graft routes around it.'
                : 'A severe narrowing can leave the downstream muscle short of oxygen, especially when demand rises.'}
            </p>
          </div>

          <div className="mt-6 grid gap-2">
            {CABG_STEPS.map((s, i) => (
              <button
                key={s.title}
                onClick={() => pickStep(i)}
                aria-pressed={step === i}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  step === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="font-display text-[0.95rem] font-bold text-ink-950">
                  <span className="mr-2 font-mono text-sm text-arterial-500">{i + 1}</span>
                  {s.title}
                </span>
                {step === i && <span className="mt-1 block text-sm leading-relaxed text-ink-700">{s.text}</span>}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <Button size="sm" variant="secondary" onClick={() => setPlaying((p) => !p)}>
              {playing ? '❚❚ Pause flow' : '▶ Play flow'}
            </Button>
          </div>
        </div>
      }
    />
  )
}

/* ====================== Operation case: appendicectomy ====================== */

type CaseStage = { time: string; title: string; text: string }

const CASE_STAGES: CaseStage[] = [
  {
    time: '02:10',
    title: 'The patient arrives',
    text: 'A 19-year-old student walks into the emergency department holding his right side. The pain began eight hours ago as a dull ache around his belly button, with nausea and one vomit. In the last two hours it has moved — and sharpened.',
  },
  {
    time: '02:40',
    title: 'Hands on the abdomen',
    text: 'The pain now sits in the right lower quadrant. Pressing at McBurney’s point — a third of the way from the hip bone to the umbilicus — makes him wince, and letting go suddenly hurts more (rebound tenderness). Pressing the left side makes the right side hurt: Rovsing’s sign. The abdominal wall guards itself rigid over the spot.',
  },
  {
    time: '03:30',
    title: 'Tests come back',
    text: 'Bloods show a white cell count of 14.2 and a CRP of 86 — an inflammatory response in full swing. Ultrasound finds a swollen, non-compressible tube 9 mm wide in the right lower quadrant with a small bright stone inside it: an appendicolith. Add the findings up and the Alvarado score is 8 of 10.',
  },
  {
    time: '04:00',
    title: 'The decision',
    text: 'An Alvarado score of 8 means appendicitis is probable, and an inflamed appendix does not get better on its own — left alone it can perforate and spill gut contents into the abdomen (peritonitis). The call is yours:',
  },
  {
    time: '05:15',
    title: 'In theatre: appendicectomy',
    text: 'Under general anaesthesia, the surgeon works through three small laparoscopic ports. Step through the operation:',
  },
  {
    time: 'Day 2',
    title: 'Recovery',
    text: 'He eats breakfast the next morning and goes home on day two with three small dressings. Pathology confirms acute appendicitis — the removed organ really was the culprit. Back at lectures within the week. This is why appendicectomy is the classic easy case: a clear story, a clear decision, and a short, standard operation — as long as it is caught before the appendix bursts.',
  },
]

const OP_STEPS: { title: string; text: string }[] = [
  { title: 'Ports in', text: 'Three small incisions: a camera port at the umbilicus and two working ports. The abdomen is gently inflated with CO₂ so the surgeon can see and move.' },
  { title: 'Find and lift the appendix', text: 'The caecum — the pouch where the large intestine begins — is found in the right lower quadrant, and the inflamed appendix is lifted clear of the surrounding bowel.' },
  { title: 'Divide the mesoappendix', text: 'The appendix hangs from a small fold, the mesoappendix, which carries the appendicular artery. It is sealed and divided first, so the appendix is free and its blood supply is controlled.' },
  { title: 'Tie the base, remove the appendix', text: 'The base of the appendix is ligated (tied off) where it meets the caecum, divided, and the appendix is taken out through a port in a retrieval bag. It goes to pathology as the specimen.' },
  { title: 'Wash, check, close', text: 'The area is washed, the stump and the divided vessels are checked for bleeding, the gas is released, and the small incisions are closed.' },
]

const DECISIONS: { label: string; ok: boolean; feedback: string }[] = [
  {
    label: 'Send him home with painkillers',
    ok: false,
    feedback: 'Dangerous. The story, the signs, and the bloods all point the same way. At home the appendix can perforate — turning a one-hour operation into peritonitis, an abscess, and a much sicker patient.',
  },
  {
    label: 'Antibiotics and wait until morning',
    ok: false,
    feedback: 'Antibiotics alone are sometimes studied for uncomplicated cases, but with an appendicolith on ultrasound and a score of 8, the standard, definitive treatment is surgery. Waiting raises the perforation risk with every hour.',
  },
  {
    label: 'Consent, theatre, appendicectomy',
    ok: true,
    feedback: 'Correct. IV fluids and antibiotics first, informed consent, then to theatre. Removing the appendix removes the problem — and the specimen goes to pathology to prove it.',
  },
]

export function AppendectomyCaseLab() {
  const [stage, setStage] = useState(0)
  const [opStep, setOpStep] = useState(0)
  const [decision, setDecision] = useState<number | null>(null)

  const inTheatre = stage === 4
  const removed = stage === 5 || (inTheatre && opStep >= 3)
  const lifted = inTheatre && opStep >= 1 && !removed
  const clipped = inTheatre && opStep >= 2 && !removed

  const appendixStroke = stage <= 0 ? '#E08A80' : stage === 1 ? '#D95F52' : '#C22F27'
  const appendixWidth = stage <= 1 ? 15 : 20

  const painAt = stage === 0 ? { x: 500, y: 262 } : { x: 415, y: 332 }

  return (
    <LabShell
      diagram={
        <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Case diagram of an abdomen with an inflamed appendix in the right lower quadrant">
          {/* Abdomen */}
          <path
            d="M500 40 C660 40 742 150 742 285 C742 420 652 522 500 522 C348 522 258 420 258 285 C258 150 340 40 500 40 Z"
            fill="#F3D9C8"
            stroke="#D9AE94"
            strokeWidth={3}
          />
          {/* Intestine hints */}
          <path d="M330 210 C400 180 470 214 540 190 C610 166 660 200 676 240" fill="none" stroke="#E3B7A6" strokeWidth={17} strokeLinecap="round" opacity={0.8} />
          <path d="M322 300 C390 276 470 306 545 284 C612 264 656 292 672 322" fill="none" stroke="#E3B7A6" strokeWidth={17} strokeLinecap="round" opacity={0.7} />
          <path d="M340 452 C420 428 520 452 600 430" fill="none" stroke="#E3B7A6" strokeWidth={17} strokeLinecap="round" opacity={0.6} />

          {/* Umbilicus */}
          <circle cx={500} cy={262} r={9} fill="#D9AE94" />
          <text x={524} y={256} fontSize={16} fontWeight={700} fill="#8A6A54">Umbilicus</text>

          {/* Caecum */}
          <ellipse cx={392} cy={398} rx={52} ry={42} fill="#DFA08F" stroke="#B0574F" strokeWidth={3} />
          <text x={238} y={368} fontSize={17} fontWeight={700} fill="#8A4A3D">Caecum</text>
          <path d="M300 376 C322 384 340 390 356 394" stroke="#8A4A3D" strokeWidth={2.5} fill="none" />

          {/* Mesoappendix + appendicular artery */}
          {!removed && (
            <g opacity={clipped ? 0.35 : 1} style={{ transition: 'opacity 0.6s ease' }}>
              <path d="M398 416 C424 430 436 452 440 480 L404 470 C398 450 396 432 398 416 Z" fill="#EFC3B4" stroke="#C08A76" strokeWidth={2} />
              <path d="M402 420 C420 436 430 456 434 478" fill="none" stroke="#C22F27" strokeWidth={4} strokeLinecap="round" strokeDasharray={clipped ? '3 7' : undefined} />
              {clipped && (
                <>
                  <rect x={410} y={438} width={16} height={8} rx={2} fill="#43536A" transform="rotate(58 418 442)" />
                  <rect x={420} y={456} width={16} height={8} rx={2} fill="#43536A" transform="rotate(58 428 460)" />
                </>
              )}
            </g>
          )}

          {/* Appendix */}
          {!removed && (
            <g transform={lifted ? 'translate(-14 -26) rotate(-7 400 420)' : undefined} style={{ transition: 'transform 0.7s ease' }}>
              <path
                d="M392 412 C382 448 398 480 428 496"
                fill="none"
                stroke={appendixStroke}
                strokeWidth={appendixWidth}
                strokeLinecap="round"
                style={{ transition: 'stroke 0.6s ease' }}
              />
              {stage >= 2 && <circle cx={404} cy={446} r={6.5} fill="#F6E3C5" stroke="#B45309" strokeWidth={2} />}
            </g>
          )}
          {removed && (
            <>
              {/* Stump with ligature */}
              <circle cx={392} cy={414} r={10} fill="#DFA08F" stroke="#43536A" strokeWidth={4} />
              <text x={238} y={452} fontSize={16} fontWeight={700} fill="#43536A">Base tied off</text>
              {/* Specimen tray */}
              <g>
                <rect x={676} y={420} width={236} height={96} rx={14} fill="#E8EDF2" stroke="#B9C4CF" strokeWidth={2.5} />
                <path d="M716 470 C760 448 812 486 862 458" fill="none" stroke="#C22F27" strokeWidth={15} strokeLinecap="round" />
                <text x={794} y={446} textAnchor="middle" fontSize={16} fontWeight={700} fill="#43536A">Specimen → pathology</text>
              </g>
            </>
          )}
          {!removed && (
            <>
              <text x={470} y={512} fontSize={17} fontWeight={700} fill="#8A4A3D">Appendix</text>
              <path d="M466 500 C452 496 442 494 432 494" stroke="#8A4A3D" strokeWidth={2.5} fill="none" />
            </>
          )}

          {/* Pain marker */}
          {stage <= 2 && (
            <g>
              <circle cx={painAt.x} cy={painAt.y} r={15} fill="none" stroke="#C22F27" strokeWidth={3} className="ping-ring" />
              <circle cx={painAt.x} cy={painAt.y} r={6} fill="#C22F27" />
              <text x={stage === 0 ? 560 : 452} y={stage === 0 ? 300 : 322} fontSize={16} fontWeight={700} fill="#C22F27">
                {stage === 0 ? 'Pain starts here…' : '…and settles here'}
              </text>
            </g>
          )}
          {stage === 1 && (
            <text x={330} y={300} fontSize={15} fontWeight={700} fill="#43536A">McBurney’s point</text>
          )}

          {/* Laparoscopic ports */}
          {inTheatre && (
            <g opacity={opStep >= 4 ? 0 : 1} style={{ transition: 'opacity 0.6s ease' }}>
              <circle cx={500} cy={262} r={11} fill="#43536A" stroke="#fff" strokeWidth={3} />
              <circle cx={512} cy={446} r={11} fill="#43536A" stroke="#fff" strokeWidth={3} />
              <circle cx={648} cy={352} r={11} fill="#43536A" stroke="#fff" strokeWidth={3} />
              <text x={676} y={330} fontSize={16} fontWeight={700} fill="#43536A">Ports</text>
            </g>
          )}
          {inTheatre && opStep >= 4 && (
            <g>
              <rect x={486} y={248} width={28} height={28} rx={6} fill="#FFF7E8" stroke="#D9AE94" strokeWidth={2} />
              <rect x={498} y={432} width={28} height={28} rx={6} fill="#FFF7E8" stroke="#D9AE94" strokeWidth={2} />
              <rect x={634} y={338} width={28} height={28} rx={6} fill="#FFF7E8" stroke="#D9AE94" strokeWidth={2} />
            </g>
          )}

          {/* Stage caption */}
          <text x={500} y={548} textAnchor="middle" fontSize={16} fill="#5A6B80">
            {stage === 0 && 'Dull, central pain — the appendix is stretching, but the brain cannot localise it yet'}
            {stage === 1 && 'Localised pain: the inflamed appendix now irritates the abdominal wall itself'}
            {stage === 2 && 'A swollen 9 mm appendix with an appendicolith — the lumen is blocked'}
            {stage === 3 && 'Alvarado 8 of 10: appendicitis is probable — delay raises the perforation risk'}
            {stage === 4 && OP_STEPS[opStep].title}
            {stage === 5 && 'Appendix removed, problem solved — home on day two'}
          </text>
        </svg>
      }
      panel={
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">
            Case 01 · Easy · Emergency department → theatre
          </p>

          <div className="mt-4 grid gap-2">
            {CASE_STAGES.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setStage(i)}
                aria-pressed={stage === i}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  stage === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="font-display text-[0.95rem] font-bold text-ink-950">
                  <span className="mr-2 font-mono text-sm text-arterial-500">{s.time}</span>
                  {s.title}
                </span>
                {stage === i && <span className="mt-1 block text-sm leading-relaxed text-ink-700">{s.text}</span>}
              </button>
            ))}
          </div>

          {stage === 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip>Temp 37.9 °C</Chip>
              <Chip>HR 104</Chip>
              <Chip>BP 118/72</Chip>
              <Chip>RR 16</Chip>
              <Chip>SpO₂ 99%</Chip>
            </div>
          )}

          {stage === 2 && (
            <div className="mt-5">
              <Meter label="Alvarado score" value={80} tone="bg-amber-500" />
              <p className="mt-2 text-sm text-ink-500">8 of 10 — at 7 or above, appendicitis is probable and surgery is the standard path.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip tone="closed">WBC 14.2 ↑</Chip>
                <Chip tone="closed">CRP 86 ↑</Chip>
                <Chip>US: 9 mm, appendicolith</Chip>
              </div>
            </div>
          )}

          {stage === 3 && (
            <div className="mt-5 grid gap-2">
              {DECISIONS.map((d, i) => (
                <button
                  key={d.label}
                  onClick={() => setDecision(i)}
                  aria-pressed={decision === i}
                  className={`rounded-xl border px-4 py-3 text-left font-display text-[0.92rem] font-bold transition-colors ${
                    decision === i
                      ? d.ok
                        ? 'border-success-500 bg-success-50 text-success-600'
                        : 'border-arterial-500 bg-arterial-50 text-arterial-600'
                      : 'border-line bg-surface text-ink-800 hover:border-primary-600/40'
                  }`}
                >
                  {d.label}
                </button>
              ))}
              {decision !== null && (
                <p className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${DECISIONS[decision].ok ? 'bg-success-50 text-ink-800' : 'bg-arterial-50 text-ink-800'}`}>
                  {DECISIONS[decision].feedback}
                </p>
              )}
            </div>
          )}

          {inTheatre && (
            <div className="mt-5 grid gap-2">
              {OP_STEPS.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setOpStep(i)}
                  aria-pressed={opStep === i}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    opStep === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                  }`}
                >
                  <span className="font-display text-[0.92rem] font-bold text-ink-950">
                    <span className="mr-2 font-mono text-sm text-arterial-500">{i + 1}</span>
                    {s.title}
                  </span>
                  {opStep === i && <span className="mt-1 block text-sm leading-relaxed text-ink-700">{s.text}</span>}
                </button>
              ))}
            </div>
          )}

          {stage === 5 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip tone="open">Eating: day 1</Chip>
              <Chip tone="open">Home: day 2</Chip>
              <Chip tone="open">Pathology: acute appendicitis ✓</Chip>
            </div>
          )}
        </div>
      }
    />
  )
}

/* ========================= Conduction system ========================= */

type ConductionStage = {
  name: string
  short: string
  ecg: string
  speed: number
  speedLabel: string
  text: string
}

const CONDUCTION_STAGES: ConductionStage[] = [
  {
    name: 'SA node fires — the spark',
    short: 'SA node fires',
    ecg: 'Just before the P wave',
    speed: 2,
    speedLabel: '≈ 0.05 m/s — the spark is born slow',
    text: 'The sinoatrial node, a cluster of pacemaker cells in the wall of the right atrium, fires on its own — about 60–100 times a minute at rest. No nerve tells it to start; the rhythm is built into the cells.',
  },
  {
    name: 'Atria depolarize — the P wave',
    short: 'Atria spread',
    ecg: 'P wave',
    speed: 25,
    speedLabel: '≈ 1 m/s across atrial muscle',
    text: 'The impulse spreads cell to cell across both atria, and they contract together, topping up the ventricles. On an ECG this spread is the P wave — small, because the atria are thin-walled.',
  },
  {
    name: 'AV node delay — the pause that fills',
    short: 'AV node holds',
    ecg: 'PR segment — a flat line',
    speed: 2,
    speedLabel: '≈ 0.05 m/s — the slowest stretch, on purpose',
    text: 'At the atrioventricular node the impulse is deliberately held for about 0.12–0.20 seconds. That pause is the whole point of the node: it gives the ventricles time to finish filling before they contract.',
  },
  {
    name: 'His–Purkinje expressway',
    short: 'Fast down the septum',
    ecg: 'Start of the QRS complex',
    speed: 88,
    speedLabel: '≈ 2–4 m/s — the fastest road in the heart',
    text: 'Past the node, the impulse races down the bundle of His and splits into the right and left bundle branches. Wide, fast-conducting fibres exist so the signal reaches both ventricles at nearly the same instant.',
  },
  {
    name: 'Ventricles contract — together',
    short: 'Ventricles squeeze',
    ecg: 'QRS complex',
    speed: 12,
    speedLabel: '≈ 0.5 m/s through ventricular muscle',
    text: 'The Purkinje network sprays the impulse through the ventricular walls, and both ventricles contract as one coordinated squeeze. On the ECG this is the tall, sharp QRS complex.',
  },
]

const ATRIAL_PATH = 'M385 130 C460 112 555 116 635 148 C665 160 682 172 692 188'
const HIS_PATH = 'M500 282 V356'
const BRANCH_R_PATH = 'M500 356 C472 380 452 400 436 424'
const BRANCH_L_PATH = 'M500 356 C528 380 548 400 564 424'
const PURKINJE_PATHS = [
  'M436 424 L388 462',
  'M436 424 L420 472',
  'M436 424 L462 478',
  'M564 424 L612 462',
  'M564 424 L580 472',
  'M564 424 L538 478',
]
const ECG_PATH =
  'M70 530 H186 q10 -16 26 0 H382 l6 8 l8 -44 l12 56 l10 -20 H470 q12 -14 28 0 H930'
const ECG_HIGHLIGHTS = [
  { x: 140, w: 46 },
  { x: 182, w: 34 },
  { x: 216, w: 166 },
  { x: 382, w: 40 },
  { x: 382, w: 118 },
]

export function ConductionLab() {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [pace, setPace] = useState<'rest' | 'exercise'>('rest')
  const [mode, setMode] = useState<'normal' | 'avblock'>('normal')
  const [escapeBeat, setEscapeBeat] = useState(false)
  const blocked = mode === 'avblock'
  const maxStage = blocked ? 2 : 4
  const info = CONDUCTION_STAGES[stage]
  const stepMs = pace === 'rest' ? 2000 : 1200
  const bpm = pace === 'rest' ? 60 : 110

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStage((s) => (s >= maxStage ? 0 : s + 1)), stepMs)
    return () => clearInterval(t)
  }, [playing, stepMs, maxStage])

  useEffect(() => {
    if (!blocked) return
    const t = setInterval(() => setEscapeBeat((b) => !b), 1200)
    return () => clearInterval(t)
  }, [blocked])

  const pickMode = (m: 'normal' | 'avblock') => {
    setMode(m)
    setStage(0)
  }

  const signalDot = (path: string, begin: number) => (
    <circle r={9} fill="#F2C14E" stroke="#fff" strokeWidth={2.5}>
      {playing && <animateMotion dur="1.6s" begin={`${begin}s`} repeatCount="indefinite" path={path} />}
    </circle>
  )

  const ventScale = stage === 4 || (blocked && escapeBeat) ? 0.94 : 1
  const lit = (on: boolean) => (on ? '#0E7C86' : '#C9C2AE')
  const progress = blocked ? Math.round((stage / 2) * 100) : Math.round((stage / 4) * 100)

  return (
    <LabShell
      diagram={
        <div>
          <svg viewBox="0 0 1000 600" className="w-full" role="img" aria-label="Animated diagram of the heart's electrical conduction system, from the SA node to the ventricles">
            {/* Superior vena cava entering the right atrium */}
            <rect x={288} y={28} width={64} height={96} rx={28} fill="#A9C3E8" stroke="#4D6EA3" strokeWidth={3} />
            <text x={320} y={18} textAnchor="middle" fontSize={16} fontWeight={700} fill="#4D6EA3">SVC</text>

            {/* Atria */}
            <ellipse cx={320} cy={185} rx={100} ry={66} fill="#7E2A33" />
            <ellipse cx={680} cy={185} rx={100} ry={66} fill="#B03A2E" />
            <text x={320} y={192} textAnchor="middle" fontSize={18} fontWeight={700} fill="#fff">Right atrium</text>
            <text x={680} y={192} textAnchor="middle" fontSize={18} fontWeight={700} fill="#fff">Left atrium</text>

            {/* Ventricles — they squeeze on the contraction stage */}
            <g className="svg-transition" style={{ transform: `scale(${ventScale})` }}>
              <path d="M250 280 C245 370 310 445 405 462 C445 470 478 448 480 405 L480 280 Z" fill="#93322C" />
              <path d="M520 280 L520 405 C522 448 555 470 595 462 C690 445 755 370 750 280 Z" fill="#E2604F" />
            </g>
            <text x={360} y={385} textAnchor="middle" fontSize={18} fontWeight={700} fill="#fff">Right ventricle</text>
            <text x={640} y={385} textAnchor="middle" fontSize={18} fontWeight={700} fill="#fff">Left ventricle</text>

            {/* Septum line between the ventricles */}
            <path d="M500 282 V488" stroke="#F7F4EE" strokeWidth={3} strokeDasharray="8 8" opacity={0.45} />

            {/* Conduction paths — lit as the signal reaches them */}
            <path d={ATRIAL_PATH} fill="none" stroke={lit(stage >= 1)} strokeWidth={stage >= 1 ? 7 : 4} strokeLinecap="round" className="svg-transition" />
            <path d={HIS_PATH} fill="none" stroke={lit(stage >= 3)} strokeWidth={stage >= 3 ? 7 : 4} strokeLinecap="round" className="svg-transition" />
            <path d={BRANCH_R_PATH} fill="none" stroke={lit(stage >= 3)} strokeWidth={stage >= 3 ? 6 : 4} strokeLinecap="round" className="svg-transition" />
            <path d={BRANCH_L_PATH} fill="none" stroke={lit(stage >= 3)} strokeWidth={stage >= 3 ? 6 : 4} strokeLinecap="round" className="svg-transition" />
            {PURKINJE_PATHS.map((p) => (
              <path key={p} d={p} fill="none" stroke={lit(stage >= 4)} strokeWidth={stage >= 4 ? 5 : 3} strokeLinecap="round" className="svg-transition" />
            ))}

            {/* Signal dots travelling along the active path */}
            {stage >= 1 && stage < 3 && signalDot(ATRIAL_PATH, -0.2)}
            {stage >= 1 && stage < 3 && signalDot(ATRIAL_PATH, -0.9)}
            {stage >= 3 && signalDot(HIS_PATH, -0.2)}
            {stage >= 3 && signalDot(BRANCH_R_PATH, -0.7)}
            {stage >= 3 && signalDot(BRANCH_L_PATH, -0.7)}

            {/* SA node */}
            <text x={385} y={92} textAnchor="middle" fontSize={17} fontWeight={700} fill="#B45309">SA node</text>
            <path d="M385 98 V112" stroke="#B45309" strokeWidth={2.5} />
            {stage === 0 && <circle cx={385} cy={130} r={12} fill="none" stroke="#B45309" strokeWidth={2.5} className="ping-ring" />}
            <circle cx={385} cy={130} r={stage === 0 ? 13 : 10} fill="#F2C14E" stroke="#B45309" strokeWidth={3} />

            {/* AV node */}
            <text x={560} y={266} fontSize={17} fontWeight={700} fill="#B45309">AV node</text>
            <path d="M556 262 C540 266 524 270 512 274" stroke="#B45309" strokeWidth={2.5} fill="none" />
            {stage === 2 && <circle cx={500} cy={282} r={12} fill="none" stroke="#B45309" strokeWidth={2.5} className="ping-ring" />}
            <circle cx={500} cy={282} r={stage === 2 ? 13 : 10} fill="#F2C14E" stroke="#B45309" strokeWidth={3} />
            {stage === 2 && (
              <text x={500} y={322} textAnchor="middle" fontSize={17} fontWeight={800} fill="#B45309">
                held ≈ 0.16 s
              </text>
            )}

            {/* AV-block mode: the signal stops here */}
            {blocked && (
              <g>
                <path d="M500 296 l14 14 M514 296 l-14 14" stroke="#B93327" strokeWidth={5} strokeLinecap="round" />
                <text x={500} y={352} textAnchor="middle" fontSize={16} fontWeight={700} fill="#B93327">
                  signal blocked
                </text>
              </g>
            )}

            {/* ECG strip with the current segment highlighted */}
            <path d={ECG_PATH} fill="none" stroke="#16222E" strokeWidth={3.5} />
            {!blocked && (
              <rect
                x={ECG_HIGHLIGHTS[stage].x}
                y={488}
                width={ECG_HIGHLIGHTS[stage].w}
                height={52}
                rx={12}
                fill="none"
                stroke="#0E7C86"
                strokeWidth={3}
              />
            )}
            {blocked && (
              <rect x={182} y={488} width={34} height={52} rx={12} fill="none" stroke="#0E7C86" strokeWidth={3} />
            )}
            <text x={70} y={478} fontSize={15} fill="#6B7684">
              ECG — {blocked ? 'P waves march on, but no QRS follows them' : 'the highlighted segment is this stage'}
            </text>

            <text x={500} y={590} textAnchor="middle" fontSize={16} fill="#6B7684">
              {blocked
                ? 'The atria keep their own rhythm — the ventricles fall back to a slow escape beat'
                : 'The glowing dot is the impulse. Real life is much faster — one beat takes under a second at rest'}
            </text>
          </svg>

          {/* Stage timeline */}
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {CONDUCTION_STAGES.slice(0, maxStage + 1).map((s, i) => (
              <button
                key={s.name}
                onClick={() => {
                  setStage(i)
                  setPlaying(false)
                }}
                aria-pressed={stage === i}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  stage === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="block font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">Step {i + 1}</span>
                <span className="mt-0.5 block font-display text-[0.9rem] font-bold leading-tight text-ink-950">{s.short}</span>
              </button>
            ))}
          </div>
        </div>
      }
      panel={
        <div>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-sand p-1" role="tablist" aria-label="Normal rhythm or AV block">
            <button
              onClick={() => pickMode('normal')}
              aria-pressed={!blocked}
              className={`rounded-full px-3 py-2 font-display text-[0.85rem] font-bold transition-colors ${
                !blocked ? 'bg-primary-600 text-white shadow-sm' : 'text-ink-700 hover:text-ink-950'
              }`}
            >
              Normal rhythm
            </button>
            <button
              onClick={() => pickMode('avblock')}
              aria-pressed={blocked}
              className={`rounded-full px-3 py-2 font-display text-[0.85rem] font-bold transition-colors ${
                blocked ? 'bg-arterial-500 text-white shadow-sm' : 'text-ink-700 hover:text-ink-950'
              }`}
            >
              AV block demo
            </button>
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
            Step {stage + 1} of {maxStage + 1} · ECG: {info.ecg}
          </p>
          <h3 className="mt-1.5 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink-950">{info.name}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.text}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>Atria · {bpm}/min</Chip>
            <Chip tone={blocked ? 'closed' : 'open'}>
              Ventricles · {blocked ? '≈ 35/min escape' : `${bpm}/min`}
            </Chip>
          </div>

          <div className="mt-6 grid gap-4">
            <Meter label="Conduction speed at this station" value={info.speed} tone="bg-amber-500" />
            <Meter label="Signal progress through the heart" value={progress} />
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause signal' : '▶ Play signal'}
              </Button>
              <Button size="sm" variant={pace === 'rest' ? 'primary' : 'secondary'} onClick={() => setPace('rest')}>
                Rest · 60/min
              </Button>
              <Button size="sm" variant={pace === 'exercise' ? 'primary' : 'secondary'} onClick={() => setPace('exercise')}>
                Exercise · 110/min
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              {blocked
                ? 'With the AV node blocked, the signal never reaches the ventricles. They fall back on their own slow escape rhythm — this is why a complete heart block needs a pacemaker.'
                : 'The pace buttons change the heart rate, but the order never changes: spark, spread, pause, sprint, squeeze. Try the AV block demo to see what happens when the pause becomes a wall.'}
            </p>
          </div>
        </div>
      }
    />
  )
}

/* ============================ The airway ============================ */

type AirwayStationId = 'nose' | 'pharynx' | 'larynx' | 'trachea' | 'bronchi' | 'alveoli'

const AIRWAY_STATIONS: Record<
  AirwayStationId,
  { name: string; latin: string; diameter: string; width: number; job: string; blurb: string; dot: { x: number; y: number } }
> = {
  nose: {
    name: 'Nose',
    latin: 'cavitas nasi',
    diameter: 'a few mm between the conchae',
    width: 100,
    job: 'Warm · moisten · filter',
    blurb:
      'Air enters through the nostrils into the nasal cavity, where three curved shelves of bone — the conchae — force it through narrow passages over warm, wet mucosa. Dust and microbes stick to the mucus; cilia sweep the loaded mucus toward the throat to be swallowed. By the time air leaves the nose it is close to body temperature and nearly saturated with water.',
    dot: { x: 500, y: 78 },
  },
  pharynx: {
    name: 'Pharynx',
    latin: 'pharynx',
    diameter: '≈ 12 cm long, 2–3 cm across',
    width: 85,
    job: 'The crossroads',
    blurb:
      'The throat is a muscular tube shared by air and food, in three parts: nasopharynx (behind the nose), oropharynx (behind the mouth), and laryngopharynx (down to the larynx). Air passes through all three on its way down — and food crosses the same space on its way to the esophagus, which is why swallowing and breathing must take turns.',
    dot: { x: 500, y: 148 },
  },
  larynx: {
    name: 'Larynx',
    latin: 'larynx',
    diameter: '≈ 4–5 cm long',
    width: 62,
    job: 'Voice + guard',
    blurb:
      'The voice box is a cartilaginous box between the pharynx and the trachea. Its vocal folds vibrate as air passes, making sound — and its epiglottis, a flap of elastic cartilage, folds down over the entrance whenever you swallow, steering food into the esophagus instead of the airway. The larynx is both an instrument and a gatekeeper.',
    dot: { x: 500, y: 206 },
  },
  trachea: {
    name: 'Trachea',
    latin: 'trachea',
    diameter: '≈ 18–20 mm across, 10–12 cm long',
    width: 55,
    job: 'Hold the road open',
    blurb:
      'The windpipe is held open by 16–20 C-shaped rings of hyaline cartilage, stacked like the ribs of a vacuum-cleaner hose. The open back of each C faces the esophagus, so food can still pass behind it. At its base the trachea splits at a ridge called the carina — touch it and you cough, hard: it is the airway’s last alarm.',
    dot: { x: 500, y: 290 },
  },
  bronchi: {
    name: 'Bronchi',
    latin: 'bronchi principales',
    diameter: '≈ 10–12 mm across',
    width: 30,
    job: 'Split the air in two',
    blurb:
      'At the carina the trachea divides into the right and left main bronchi, one per lung. The right bronchus is wider, shorter, and more vertical than the left — which is why an inhaled peanut or tooth almost always ends up in the right lung. Inside each lung the bronchi keep dividing, about 23 generations in total, each branch narrower than the last.',
    dot: { x: 596, y: 398 },
  },
  alveoli: {
    name: 'Alveoli',
    latin: 'alveoli pulmonis',
    diameter: '≈ 0.2–0.3 mm each',
    width: 4,
    job: 'Exchange gases',
    blurb:
      'At the end of the branching tree sit about 300 million alveoli — tiny grape-like sacs with walls one cell thick, wrapped in capillaries. Their combined surface is roughly 70 square metres, about half a badminton court. Oxygen crosses into the blood here and carbon dioxide crosses out. A film of surfactant keeps the sacs from collapsing at the end of each breath.',
    dot: { x: 712, y: 490 },
  },
}

const AIRWAY_ORDER: AirwayStationId[] = ['nose', 'pharynx', 'larynx', 'trachea', 'bronchi', 'alveoli']

const AIR_IN_R = 'M500 28 C500 70 500 100 500 130 V170 V230 V345 C480 385 420 410 360 435 C330 448 305 468 288 492'
const AIR_IN_L = 'M500 28 C500 70 500 100 500 130 V170 V230 V345 C520 385 580 410 640 435 C670 448 695 468 712 492'
const AIR_OUT_R = 'M288 492 C305 468 330 448 360 435 C420 410 480 385 500 345 V230 V170 V130 C500 100 500 70 500 28'
const AIR_OUT_L = 'M712 492 C695 468 670 448 640 435 C580 410 520 385 500 345 V230 V170 V130 C500 100 500 70 500 28'
const MOUTH_IN_R = 'M655 128 C600 140 550 155 500 170 V230 V345 C480 385 420 410 360 435 C330 448 305 468 288 492'
const MOUTH_IN_L = 'M655 128 C600 140 550 155 500 170 V230 V345 C520 385 580 410 640 435 C670 448 695 468 712 492'
const MOUTH_OUT_R = 'M288 492 C305 468 330 448 360 435 C420 410 480 385 500 345 V230 V170 C550 155 600 140 655 128'
const MOUTH_OUT_L = 'M712 492 C695 468 670 448 640 435 C580 410 520 385 500 345 V230 V170 C550 155 600 140 655 128'

export function AirwayLab({ bare = false }: { bare?: boolean }) {
  const [station, setStation] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [intake, setIntake] = useState<'nose' | 'mouth'>('nose')
  const info = AIRWAY_STATIONS[AIRWAY_ORDER[station]]
  const inhale = phase === 'inhale'

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStation((s) => (s + 1) % AIRWAY_ORDER.length), 2400)
    return () => clearInterval(t)
  }, [playing])

  const pathR =
    intake === 'nose' ? (inhale ? AIR_IN_R : AIR_OUT_R) : inhale ? MOUTH_IN_R : MOUTH_OUT_R
  const pathL =
    intake === 'nose' ? (inhale ? AIR_IN_L : AIR_OUT_L) : inhale ? MOUTH_IN_L : MOUTH_OUT_L

  const airDot = (path: string, begin: number) => (
    <circle r={8} fill="#0E7C86" stroke="#fff" strokeWidth={2} opacity={0.9}>
      {playing && <animateMotion dur="3.4s" begin={`${begin}s`} repeatCount="indefinite" path={path} />}
    </circle>
  )

  const alveoliCluster = (cx: number, cy: number) => (
    <g opacity={0.9}>
      <circle cx={cx} cy={cy} r={14} fill="#F6C6BB" stroke="#B6544A" strokeWidth={2.5} />
      <circle cx={cx + 17} cy={cy + 9} r={10} fill="#F6C6BB" stroke="#B6544A" strokeWidth={2.5} />
      <circle cx={cx - 15} cy={cy + 11} r={9} fill="#F6C6BB" stroke="#B6544A" strokeWidth={2.5} />
    </g>
  )

  return (
    <LabShell
      bare={bare}
      diagram={
        <div>
          <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Animated diagram of air travelling from the nose through the pharynx, larynx, trachea and bronchi to the alveoli">
            {/* Esophagus — the food road, behind the airway */}
            <path d="M538 168 C585 215 602 262 606 305" fill="none" stroke="#C9B79E" strokeWidth={14} strokeLinecap="round" strokeDasharray="10 9" opacity={0.8} />
            <text x={628} y={252} fontSize={16} fontWeight={700} fill="#8A6A54">Esophagus — food, not air</text>

            {/* Nasal cavity */}
            <g opacity={intake === 'nose' ? 1 : 0.35} style={{ transition: 'opacity 0.6s ease' }}>
              <path d="M430 58 C430 40 570 40 570 58 L570 92 C570 114 542 122 500 122 C458 122 430 114 430 92 Z" fill="#F3E3D3" stroke="#D9AE94" strokeWidth={3} />
              {[70, 88, 106].map((y) => (
                <path key={y} d={`M452 ${y} C478 ${y - 8} 522 ${y + 8} 548 ${y}`} fill="none" stroke="#C08A76" strokeWidth={4} strokeLinecap="round" />
              ))}
              <text x={500} y={22} textAnchor="middle" fontSize={16} fontWeight={700} fill="#8A6A54">Nostrils — air in</text>
              <path d="M500 30 L492 44 M500 30 L508 44" stroke="#8A6A54" strokeWidth={2.5} fill="none" />
            </g>

            {/* Mouth — the alternative entrance */}
            <g opacity={intake === 'mouth' ? 1 : 0.45} style={{ transition: 'opacity 0.6s ease' }}>
              <ellipse cx={655} cy={128} rx={44} ry={17} fill="#E8B4A0" stroke="#B0574F" strokeWidth={3} />
              <path d="M622 128 C640 136 670 136 688 128" fill="none" stroke="#8A4A3D" strokeWidth={3} strokeLinecap="round" />
              <text x={655} y={100} textAnchor="middle" fontSize={16} fontWeight={700} fill="#8A4A3D">Mouth</text>
              <path d="M620 136 C580 150 540 155 512 160" fill="none" stroke="#B0574F" strokeWidth={3} strokeDasharray="7 6" opacity={intake === 'mouth' ? 1 : 0} />
            </g>

            {/* Pharynx */}
            <rect x={468} y={118} width={64} height={58} rx={26} fill="#D8C9B8" stroke="#A98F74" strokeWidth={3} />
            <text x={415} y={152} textAnchor="end" fontSize={17} fontWeight={700} fill="#43536A">Pharynx</text>
            <path d="M420 148 C438 150 452 150 464 150" stroke="#43536A" strokeWidth={2} fill="none" />

            {/* Larynx with epiglottis flap */}
            <rect x={462} y={176} width={76} height={60} rx={16} fill="#B9D6D8" stroke="#0E7C86" strokeWidth={3} />
            <path d="M500 176 L484 152 L516 152 Z" fill="#E58A7B" stroke="#B6544A" strokeWidth={2.5} />
            <path d="M474 202 H526 M474 214 H526" stroke="#0E7C86" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
            <text x={415} y={212} textAnchor="end" fontSize={17} fontWeight={700} fill="#43536A">Larynx</text>
            <path d="M420 208 C434 210 448 210 458 210" stroke="#43536A" strokeWidth={2} fill="none" />
            <text x={585} y={212} fontSize={15} fill="#6B7684">vocal folds · epiglottis</text>

            {/* Trachea with C-rings */}
            <rect x={470} y={236} width={60} height={110} rx={26} fill="#B9D6D8" stroke="#0E7C86" strokeWidth={3} />
            {[256, 281, 306, 331].map((y) => (
              <path key={y} d={`M476 ${y} h48`} stroke="#0E7C86" strokeWidth={4} opacity={0.5} />
            ))}
            <text x={415} y={296} textAnchor="end" fontSize={17} fontWeight={700} fill="#43536A">Trachea</text>
            <path d="M420 292 C434 294 448 294 466 294" stroke="#43536A" strokeWidth={2} fill="none" />
            <text x={585} y={296} fontSize={15} fill="#6B7684">C-shaped cartilage rings</text>

            {/* Carina + bronchi */}
            <path d="M500 346 C470 385 415 408 360 432" fill="none" stroke="#A9C7C9" strokeWidth={34} strokeLinecap="round" />
            <path d="M500 346 C530 385 585 408 640 432" fill="none" stroke="#A9C7C9" strokeWidth={34} strokeLinecap="round" />
            <path d="M500 346 L488 368 M500 346 L512 368" stroke="#0E7C86" strokeWidth={4} strokeLinecap="round" />
            <text x={500} y={372} textAnchor="middle" fontSize={15} fontWeight={700} fill="#0E7C86">carina</text>

            {/* Bronchioles */}
            <path d="M360 432 C330 452 305 468 288 488 M360 432 C345 455 335 472 330 492 M360 432 C375 452 388 470 396 490" fill="none" stroke="#A9C7C9" strokeWidth={12} strokeLinecap="round" />
            <path d="M640 432 C670 452 695 468 712 488 M640 432 C655 455 665 472 670 492 M640 432 C625 452 612 470 604 490" fill="none" stroke="#A9C7C9" strokeWidth={12} strokeLinecap="round" />

            {/* Alveoli clusters */}
            {alveoliCluster(288, 500)}
            {alveoliCluster(330, 504)}
            {alveoliCluster(396, 500)}
            {alveoliCluster(712, 500)}
            {alveoliCluster(670, 504)}
            {alveoliCluster(604, 500)}

            {/* Airflow particles */}
            {airDot(pathR, -0.2)}
            {airDot(pathL, -1.1)}
            {airDot(pathR, -1.9)}
            {airDot(pathL, -2.7)}

            {/* Station hotspots */}
            {AIRWAY_ORDER.map((id, i) => {
              const s = AIRWAY_STATIONS[id]
              const isActive = station === i
              return (
                <g key={id} onClick={() => setStation(i)} className="cursor-pointer">
                  {isActive && <circle cx={s.dot.x} cy={s.dot.y} r={13} fill="none" stroke="#0E7C86" strokeWidth={2.5} className="ping-ring" />}
                  <circle cx={s.dot.x} cy={s.dot.y} r={isActive ? 11 : 8} fill={isActive ? '#0E7C86' : '#16222E'} stroke="#fff" strokeWidth={2.5} />
                </g>
              )
            })}

            <text x={500} y={548} textAnchor="middle" fontSize={16} fill="#6B7684">
              {intake === 'nose'
                ? inhale
                  ? 'Air in: nose → pharynx → larynx → trachea → bronchi → alveoli'
                  : 'Air out: the same road, in reverse — the airway is a two-way street'
                : inhale
                  ? 'Mouth breathing: air skips the nose — colder, drier, less filtered'
                  : 'Air out through the mouth — the nose’s conditioning is bypassed'}
            </text>
          </svg>

          {/* Station timeline */}
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {AIRWAY_ORDER.map((id, i) => (
              <button
                key={id}
                onClick={() => {
                  setStation(i)
                  setPlaying(false)
                }}
                aria-pressed={station === i}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  station === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="block font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">Stop {i + 1}</span>
                <span className="mt-0.5 block font-display text-[0.9rem] font-bold leading-tight text-ink-950">{AIRWAY_STATIONS[id].name}</span>
              </button>
            ))}
          </div>
        </div>
      }
      panel={
        <div>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-sand p-1" role="tablist" aria-label="Breathe through the nose or the mouth">
            <button
              onClick={() => setIntake('nose')}
              aria-pressed={intake === 'nose'}
              className={`rounded-full px-3 py-2 font-display text-[0.85rem] font-bold transition-colors ${
                intake === 'nose' ? 'bg-primary-600 text-white shadow-sm' : 'text-ink-700 hover:text-ink-950'
              }`}
            >
              Through the nose
            </button>
            <button
              onClick={() => setIntake('mouth')}
              aria-pressed={intake === 'mouth'}
              className={`rounded-full px-3 py-2 font-display text-[0.85rem] font-bold transition-colors ${
                intake === 'mouth' ? 'bg-arterial-500 text-white shadow-sm' : 'text-ink-700 hover:text-ink-950'
              }`}
            >
              Through the mouth
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
                Stop {station + 1} of 6 · {info.job}
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{info.name}</h3>
            </div>
            <span className={`font-display text-lg font-extrabold ${inhale ? 'text-primary-700' : 'text-venous-600'}`}>
              {inhale ? '▼ air in' : '▲ air out'}
            </span>
          </div>

          <p className="mt-1 font-serif text-sm italic text-ink-500">{info.latin}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>

          <div className="mt-6 grid gap-4">
            <Meter label="Airway width (relative)" value={info.width} />
            <p className="-mt-2 font-mono text-xs text-ink-500">Diameter: {info.diameter}</p>
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause journey' : '▶ Play journey'}
              </Button>
              <Button size="sm" variant={inhale ? 'primary' : 'secondary'} onClick={() => setPhase('inhale')}>
                Inhale
              </Button>
              <Button size="sm" variant={!inhale ? 'primary' : 'secondary'} onClick={() => setPhase('exhale')}>
                Exhale
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              {intake === 'nose'
                ? 'The nose is not just a hole: it is the airway’s air-conditioning unit. Watch the dots — every breath you take is warmed, moistened, and filtered before it reaches the lungs.'
                : 'Mouth breathing works, but it skips the conditioning. The air arrives colder, drier, and carrying more dust — one reason a cold makes your throat raw when your nose is blocked.'}
            </p>
          </div>
        </div>
      }
    />
  )
}

/* ======================= Surgical instruments ======================= */

type InstrumentId =
  | 'scalpel'
  | 'scissors'
  | 'hemostat'
  | 'needle-holder'
  | 'forceps'
  | 'allis'
  | 'retractor'
  | 'sponge'

const INSTRUMENTS: Record<
  InstrumentId,
  { name: string; category: string; job: string; held: string; blurb: string }
> = {
  scalpel: {
    name: 'Scalpel',
    category: 'Cutting',
    job: 'Makes the incision — the first cut through skin',
    held: 'Like a pen, or flat in the palm for long cuts',
    blurb:
      'A handle and a disposable blade. It cuts with the belly of the blade in one smooth stroke — never sawing, never with the tip. The No. 10 blade handles most skin incisions.',
  },
  scissors: {
    name: 'Mayo Scissors',
    category: 'Cutting',
    job: 'Cuts tissue, and (the heavy pair) sutures and dressings',
    held: 'Thumb and ring finger in the rings, index finger guiding',
    blurb:
      'Scissors come in families: stout Mayo scissors for tough tissue and cutting sutures, delicate Metzenbaum scissors for fine structures. Using the wrong pair dulls them — and dull scissors tear instead of cut.',
  },
  hemostat: {
    name: 'Haemostat',
    category: 'Clamping',
    job: 'Clamps blood vessels shut to stop bleeding',
    held: 'Like scissors — and it locks with a ratchet click',
    blurb:
      'Also called an artery forceps or Kelly clamp. Its ratchet locks the jaws so the grip holds without squeezing. It crushes whatever it holds, so it belongs on vessels, never on tissue that must survive.',
  },
  'needle-holder': {
    name: 'Needle Holder',
    category: 'Suturing',
    job: 'Grips the curved needle and drives it through tissue',
    held: 'Like scissors; the needle is held two-thirds along its curve',
    blurb:
      'Looks like a haemostat, but its jaws are short, blunt, and cross-hatched to stop the needle rotating. Driving a needle with a haemostat instead damages both tools — the classic beginner mix-up.',
  },
  forceps: {
    name: 'Tissue Forceps',
    category: 'Grasping',
    job: 'Picks up and steadies tissue while other tools work',
    held: 'Like a pen, between thumb and two fingers — no lock',
    blurb:
      'Adson forceps are tweezers with tiny teeth at the tip that grip skin securely with minimal crush. Because they never lock, the grip is exactly as gentle as the hand holding them.',
  },
  allis: {
    name: 'Allis Forceps',
    category: 'Grasping',
    job: 'Grips firm tissue that is being removed or held hard',
    held: 'Like scissors, locking with a ratchet',
    blurb:
      'A locking clamp whose wide jaws end in sharp little teeth. It holds bowel, fascia, or a lump being excised with a grip that never slips — and never lets go kindly, so it stays off anything delicate.',
  },
  retractor: {
    name: 'Retractor',
    category: 'Exposing',
    job: 'Holds the wound open so the surgeon can see and work',
    held: 'By the assistant, or self-retaining with a frame',
    blurb:
      'Surgery happens in a hole, and retractors hold the hole open. The handheld Richardson retractor has a right-angled blade that hooks tissue aside; larger operations use self-retaining frames.',
  },
  sponge: {
    name: 'Sponge Forceps',
    category: 'Exposing',
    job: 'Holds gauze sponges to mop blood and prep skin',
    held: 'Like scissors, long enough to keep hands out of the field',
    blurb:
      'Long forceps ending in oval loops that grip a folded gauze sponge. The sponge does the touching — mopping blood, dabbing antiseptic — while fingers stay well away from the sterile field.',
  },
}

const INSTRUMENT_ORDER: InstrumentId[] = [
  'scalpel',
  'scissors',
  'hemostat',
  'needle-holder',
  'forceps',
  'allis',
  'retractor',
  'sponge',
]

/** One instrument, drawn in local coords: handle left, tip right, ~200 x 90. */
function InstrumentArt({ id }: { id: InstrumentId }) {
  const steel = '#D9DEE4'
  const edge = '#5A6B7C'
  const sw = 6
  const ringPair = (jaw: ReactNode) => (
    <>
      <ellipse cx={-80} cy={-23} rx={17} ry={11} transform="rotate(-18 -80 -23)" fill="none" stroke={edge} strokeWidth={sw} />
      <ellipse cx={-80} cy={23} rx={17} ry={11} transform="rotate(18 -80 23)" fill="none" stroke={edge} strokeWidth={sw} />
      <path d="M-66 -15 L6 -1" stroke={edge} strokeWidth={sw} strokeLinecap="round" />
      <path d="M-66 15 L6 1" stroke={edge} strokeWidth={sw} strokeLinecap="round" />
      <circle cx={8} cy={0} r={5.5} fill={edge} />
      {jaw}
    </>
  )
  switch (id) {
    case 'scalpel':
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <rect x={-102} y={-8} width={120} height={16} rx={8} fill="#C3CAD1" stroke={edge} strokeWidth={4} />
          <path d="M-72 -6 v12 M-58 -6 v12 M-44 -6 v12" stroke={edge} strokeWidth={3.5} />
          <path d="M18 -6 L72 -14 C92 -7 92 7 72 14 L18 7 Z" fill="#EDF1F4" stroke={edge} strokeWidth={4} />
        </g>
      )
    case 'scissors':
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          {ringPair(
            <>
              <path d="M8 -1 L98 -9 L98 2 Z" fill={steel} stroke={edge} strokeWidth={4} />
              <path d="M8 1 L98 9 L98 -2 Z" fill={steel} stroke={edge} strokeWidth={4} />
            </>,
          )}
        </g>
      )
    case 'hemostat':
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          {ringPair(
            <>
              <path d="M8 -1 L102 -4 L102 2 Z" fill={steel} stroke={edge} strokeWidth={4} />
              <path d="M8 1 L102 4 L102 -2 Z" fill={steel} stroke={edge} strokeWidth={4} />
              <path d="M68 -4 v7 M80 -4 v7 M92 -3 v6" stroke={edge} strokeWidth={3} />
            </>,
          )}
          <path d="M-40 -9 l7 6 l-7 6 l7 6" fill="none" stroke={edge} strokeWidth={4} />
        </g>
      )
    case 'needle-holder':
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          {ringPair(
            <>
              <path d="M8 -2 L54 -6 L54 3 Z" fill={steel} stroke={edge} strokeWidth={4} />
              <path d="M8 2 L54 6 L54 -3 Z" fill={steel} stroke={edge} strokeWidth={4} />
              <path d="M24 -4 l10 7 M36 -5 l10 7" stroke={edge} strokeWidth={3} />
            </>,
          )}
          <path d="M54 -3 C78 -32 106 -28 114 0" fill="none" stroke="#8A94A0" strokeWidth={4.5} />
          <path d="M114 0 C126 18 118 27 100 27" fill="none" stroke="#0E7C86" strokeWidth={3} strokeDasharray="7 6" />
        </g>
      )
    case 'forceps':
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M-100 -15 L94 -3 L94 2 L-100 -4 Z" fill={steel} stroke={edge} strokeWidth={4} />
          <path d="M-100 15 L94 3 L94 -2 L-100 4 Z" fill={steel} stroke={edge} strokeWidth={4} />
          <path d="M94 -3 L108 0 L94 3 Z" fill={steel} stroke={edge} strokeWidth={4} />
          <path d="M-72 -11 v20 M-59 -10 v19 M-46 -9 v17" stroke={edge} strokeWidth={3.5} />
        </g>
      )
    case 'allis':
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          {ringPair(
            <>
              <path d="M8 -2 L66 -15 L100 -15 L100 -3 L66 3 Z" fill={steel} stroke={edge} strokeWidth={4} />
              <path d="M8 2 L66 15 L100 15 L100 3 L66 -3 Z" fill={steel} stroke={edge} strokeWidth={4} />
              <path d="M84 -15 v8 M93 -15 v8 M84 15 v-8 M93 15 v-8" stroke={edge} strokeWidth={3.5} />
            </>,
          )}
        </g>
      )
    case 'retractor':
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <rect x={-102} y={-11} width={124} height={22} rx={10} fill="#C3CAD1" stroke={edge} strokeWidth={4} />
          <path d="M-76 -6 v12 M-60 -6 v12 M-44 -6 v12" stroke={edge} strokeWidth={3.5} />
          <path d="M22 -11 L56 -11 L56 42 L38 42 L38 5 L22 5 Z" fill={steel} stroke={edge} strokeWidth={4} />
        </g>
      )
    case 'sponge':
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          {ringPair(
            <>
              <ellipse cx={98} cy={-8} rx={16} ry={7.5} transform="rotate(-8 98 -8)" fill="none" stroke={edge} strokeWidth={5} />
              <ellipse cx={98} cy={8} rx={16} ry={7.5} transform="rotate(8 98 8)" fill="none" stroke={edge} strokeWidth={5} />
              <path d="M8 -1 L84 -6 M8 1 L84 6" stroke={edge} strokeWidth={5} />
            </>,
          )}
        </g>
      )
  }
}

const SEQ_STEPS = [
  {
    title: 'Incise',
    tool: 'Scalpel',
    text: 'The operation opens with the scalpel: one smooth stroke with the belly of the blade, and the skin parts along a clean line.',
  },
  {
    title: 'Clamp',
    tool: 'Haemostat',
    text: 'Cut vessels bleed. The haemostat snaps onto each one and its ratchet clicks shut — the vessel is held closed until it can be tied off.',
  },
  {
    title: 'Retract',
    tool: 'Retractor',
    text: 'The wound is a hole that wants to close. The retractor hooks the edges apart and holds them, opening a window to work through.',
  },
  {
    title: 'Suture',
    tool: 'Needle holder',
    text: 'At the end, the needle holder drives a curved needle through the tissue edges in an arc, and stitch by stitch the wound is closed.',
  },
]

export function InstrumentsLab() {
  const [mode, setMode] = useState<'explore' | 'sequence'>('explore')
  const [selected, setSelected] = useState<InstrumentId>('scalpel')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (mode !== 'sequence' || !playing) return
    const t = setInterval(() => setStep((s) => (s + 1) % SEQ_STEPS.length), 2600)
    return () => clearInterval(t)
  }, [mode, playing])

  const inst = INSTRUMENTS[selected]

  const tray = (
    <svg viewBox="0 0 1000 640" className="w-full" role="img" aria-label="A surgical instrument tray with eight instruments laid out on a green cloth">
      <rect x={0} y={0} width={1000} height={640} rx={24} fill="#D8E4DA" />
      <rect x={38} y={34} width={924} height={572} rx={18} fill="#EDF0F2" stroke="#B9C0C7" strokeWidth={3} />
      <text x={500} y={78} textAnchor="middle" fontSize={19} fontWeight={700} fill="#6B7684" letterSpacing={3}>
        THE INSTRUMENT TRAY — TAP A TOOL
      </text>
      {INSTRUMENT_ORDER.map((id, i) => {
        const cx = 155 + (i % 4) * 230
        const cy = 218 + Math.floor(i / 4) * 252
        const isSel = selected === id
        return (
          <g key={id} onClick={() => setSelected(id)} className="cursor-pointer">
            <rect x={cx - 112} y={cy - 92} width={224} height={184} rx={16} fill="transparent" />
            {isSel && (
              <rect x={cx - 112} y={cy - 92} width={224} height={184} rx={16} fill="#0E7C86" opacity={0.1} stroke="#0E7C86" strokeWidth={2.5} />
            )}
            <g transform={`translate(${cx} ${cy - 16})`}>
              <g className="svg-transition" style={{ transform: `translateY(${isSel ? -7 : 0}px)` }}>
                <InstrumentArt id={id} />
              </g>
            </g>
            <text x={cx} y={cy + 62} textAnchor="middle" fontSize={21} fontWeight={700} fill={isSel ? '#0A5F66' : '#43536A'}>
              {INSTRUMENTS[id].name}
            </text>
          </g>
        )
      })}
    </svg>
  )

  const sequence = (
    <svg viewBox="0 0 1000 640" className="w-full" role="img" aria-label="Animated sequence of four instruments at work: scalpel incising, haemostat clamping, retractor holding the wound open, needle holder suturing">
      <rect x={0} y={0} width={1000} height={640} rx={24} fill="#F3EDE2" />
      {/* tissue block */}
      <g className="svg-transition" style={{ transform: `translateX(${step >= 2 ? -46 : 0}px)` }}>
        <rect x={130} y={252} width={360} height={150} rx={64} fill="#EFC39B" />
      </g>
      <g className="svg-transition" style={{ transform: `translateX(${step >= 2 ? 46 : 0}px)` }}>
        <rect x={510} y={252} width={360} height={150} rx={64} fill="#EFC39B" />
      </g>
      {step >= 2 && <rect x={452} y={268} width={96} height={118} rx={20} fill="#C4553B" />}
      {/* incision line */}
      {step === 0 ? (
        <path d="M215 327 H785" stroke="#B93327" strokeWidth={6} strokeLinecap="round" strokeDasharray="16 12" className="flow-line" fill="none" />
      ) : (
        <path d="M215 327 H785" stroke="#8F2B20" strokeWidth={6} strokeLinecap="round" fill="none" />
      )}
      {/* a vessel to clamp */}
      <circle cx={500} cy={327} r={17} fill="#D64545" stroke="#8F2B20" strokeWidth={4} />
      {/* stitches */}
      {step >= 3 && (
        <g stroke="#43536A" strokeWidth={5} strokeLinecap="round">
          <path d="M330 306 l26 42 M356 306 l-26 42" />
          <path d="M640 306 l26 42 M666 306 l-26 42" />
        </g>
      )}
      {/* the tool at work */}
      {step === 0 && (
        <g transform="translate(300 218) rotate(-16)">
          <InstrumentArt id="scalpel" />
        </g>
      )}
      {step === 1 && (
        <g transform="translate(500 205)">
          <g className="svg-transition" style={{ transform: 'rotate(-4deg)', transformOrigin: 'center' }}>
            <InstrumentArt id="hemostat" />
          </g>
        </g>
      )}
      {step === 2 && (
        <g transform="translate(742 218)">
          <InstrumentArt id="retractor" />
        </g>
      )}
      {step === 3 && (
        <g transform="translate(618 208) rotate(-8)">
          <InstrumentArt id="needle-holder" />
        </g>
      )}
      <text x={500} y={500} textAnchor="middle" fontSize={22} fontWeight={700} fill="#43536A">
        Step {step + 1} of 4 — {SEQ_STEPS[step].title}: the {SEQ_STEPS[step].tool.toLowerCase()} at work
      </text>
      <text x={500} y={540} textAnchor="middle" fontSize={17} fill="#6B7684">
        The same four verbs run almost every operation: cut, clamp, hold, sew.
      </text>
    </svg>
  )

  return (
    <LabShell
      diagram={mode === 'explore' ? tray : sequence}
      panel={
        <div>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-sand p-1" role="tablist" aria-label="Lab mode">
            {(
              [
                ['explore', 'Explore the tray'],
                ['sequence', 'Watch them work'],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`rounded-full px-3 py-2 font-display text-sm font-bold transition-colors ${
                  mode === m ? 'bg-primary-600 text-white shadow' : 'text-ink-700 hover:text-ink-950'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === 'explore' ? (
            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-700">{inst.category}</p>
              <h3 className="mt-1 font-display text-[1.65rem] font-extrabold tracking-tight text-ink-950">{inst.name}</h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-700">{inst.blurb}</p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="grid grid-cols-[86px_1fr] gap-3">
                  <dt className="font-display font-bold text-ink-950">Job</dt>
                  <dd className="text-ink-700">{inst.job}</dd>
                </div>
                <div className="grid grid-cols-[86px_1fr] gap-3">
                  <dt className="font-display font-bold text-ink-950">Held</dt>
                  <dd className="text-ink-700">{inst.held}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                {INSTRUMENT_ORDER.map((id) => (
                  <Chip key={id} tone={id === selected ? 'open' : 'sand'}>
                    {INSTRUMENTS[id].name}
                  </Chip>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-500">
                Eight instruments, four verbs: cutting, clamping, grasping, exposing — plus the
                one tool whose only job is sewing.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-700">
                Step {step + 1} of 4 · {SEQ_STEPS[step].tool}
              </p>
              <h3 className="mt-1 font-display text-[1.65rem] font-extrabold tracking-tight text-ink-950">{SEQ_STEPS[step].title}</h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-700">{SEQ_STEPS[step].text}</p>
              <div className="mt-5 grid gap-2">
                {SEQ_STEPS.map((s, i) => (
                  <button
                    key={s.title}
                    onClick={() => {
                      setStep(i)
                      setPlaying(false)
                    }}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      i === step ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/50'
                    }`}
                  >
                    <span className="font-display text-sm font-bold text-ink-950">
                      <span className="mr-2 font-mono text-xs text-arterial-500">{i + 1}</span>
                      {s.title}
                      <span className="ml-2 font-sans text-xs font-medium text-ink-500">{s.tool}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <Button variant="secondary" size="sm" onClick={() => setPlaying((p) => !p)}>
                  {playing ? '❚❚ Pause sequence' : '▶ Play sequence'}
                </Button>
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}

/* ============================ The GI tract ============================ */

type GiStationId = 'mouth' | 'esophagus' | 'stomach' | 'small-intestine' | 'large-intestine' | 'rectum'

const GI_STATIONS: Record<
  GiStationId,
  { name: string; latin: string; length: string; ph: string; transit: string; timeShare: number; job: string; blurb: string; note: string; dot: { x: number; y: number } }
> = {
  mouth: {
    name: 'Mouth',
    latin: 'cavitas oris',
    length: '—',
    ph: 'pH ≈ 6.7–7.3',
    transit: 'Seconds',
    timeShare: 1,
    job: 'Chew + start starch digestion',
    blurb:
      'Digestion starts before you swallow. Teeth cut and grind food into a soft ball — the bolus — while saliva wets it and the enzyme amylase begins breaking starch into sugars. Chewing is the only part of digestion you control consciously, and it matters: the smaller the pieces, the more surface the stomach’s acid and enzymes have to work on.',
    note: 'Swallowing is a reflex: once the bolus reaches the back of the tongue, the epiglottis seals the airway and the throat takes over — you cannot breathe and swallow at the same time.',
    dot: { x: 190, y: 62 },
  },
  esophagus: {
    name: 'Esophagus',
    latin: 'oesophagus',
    length: '≈ 25 cm',
    ph: 'pH ≈ 7',
    transit: '8–10 seconds',
    timeShare: 1,
    job: 'Peristalsis — the squeeze that carries food down',
    blurb:
      'The esophagus is a muscular tube with one job: move the bolus from throat to stomach. It does it with peristalsis — a wave of contraction behind the bolus and relaxation ahead of it, squeezing the food downward like toothpaste from a tube. The wave works even upside down, which is why you can swallow while lying flat. At the bottom, the lower esophageal sphincter opens to let food in, then closes so stomach acid cannot splash back up.',
    note: 'Watch the rings travel down the tube: that moving squeeze is peristalsis, and the same wave runs the whole length of the gut.',
    dot: { x: 190, y: 165 },
  },
  stomach: {
    name: 'Stomach',
    latin: 'ventriculus · gaster',
    length: '≈ 25–30 cm, holds 1–1.5 L',
    ph: 'pH ≈ 1.5–2',
    transit: '2–4 hours',
    timeShare: 14,
    job: 'Churn + acid — turn food into chyme',
    blurb:
      'The stomach is a muscular bag and a chemical reactor at once. Its walls churn — waves of contraction knead the food, mixing it with gastric juice: hydrochloric acid strong enough to kill most microbes, and the enzyme pepsin, which starts cutting proteins into pieces. A thick mucus layer protects the stomach’s own lining from its acid. After two to four hours the food has become chyme, a creamy soup that the stomach squirts into the small intestine a little at a time.',
    note: 'The stomach churns in the diagram whenever this stop is active — that rhythmic squeeze is what mixes acid into every bite.',
    dot: { x: 215, y: 300 },
  },
  'small-intestine': {
    name: 'Small Intestine',
    latin: 'intestinum tenue',
    length: '≈ 6–7 m',
    ph: 'pH ≈ 6–7.4',
    transit: '3–5 hours',
    timeShare: 30,
    job: 'Absorb almost everything',
    blurb:
      'This is where digestion pays off. Bile from the liver emulsifies fats into droplets, pancreatic enzymes finish breaking down proteins, starches, and fats, and then the wall absorbs the results: sugars, amino acids, fatty acids, vitamins, and minerals pass into the blood. The secret is surface area — the lining is folded, then covered in villi, then each villus cell is covered in microvilli, turning six metres of tube into roughly 30 square metres of absorbing surface. Watch the dots: nutrients crossing the wall, one by one.',
    note: 'Duodenum, jejunum, ileum — three parts, one job: the duodenum receives the chemical helpers, the jejunum does most of the absorbing, the ileum finishes the job.',
    dot: { x: 535, y: 437 },
  },
  'large-intestine': {
    name: 'Large Intestine',
    latin: 'intestinum crassum',
    length: '≈ 1.5 m',
    ph: 'pH ≈ 5.5–7',
    transit: '12–48 hours',
    timeShare: 52,
    job: 'Reclaim water, host the microbes',
    blurb:
      'What arrives here is mostly water, fibre, and bacteria — the indigestible remainder. The colon’s job is recovery: it absorbs water and salts back into the blood, which is why its contents slowly firm up into stool. It is also home to trillions of gut bacteria, the microbiome, which ferment fibre into short-chain fatty acids, make some vitamins, and crowd out harmful microbes. Food spends longer here than anywhere else in the tract.',
    note: 'Watch the droplets leave the colon wall: water being reclaimed into the blood. Lose too much water here — in diarrhoea, for example — and dehydration follows fast.',
    dot: { x: 690, y: 340 },
  },
  rectum: {
    name: 'Rectum',
    latin: 'rectum',
    length: '≈ 12–15 cm',
    ph: 'pH ≈ 7',
    transit: 'Stored until release',
    timeShare: 2,
    job: 'Store, then release',
    blurb:
      'The last stretch is a short, straight tube that stores stool until you are ready. When it fills, stretch receptors trigger the urge to go; two sphincters — one involuntary, one under your control — decide the moment. Defecation is the one step of the whole journey you can consciously delay, which is exactly why the rectum exists: a waiting room at the end of a nine-metre tube.',
    note: 'The rectum is the only part of the tract whose emptying you can choose to postpone — every earlier step runs on reflex alone.',
    dot: { x: 298, y: 540 },
  },
}

const GI_ORDER: GiStationId[] = ['mouth', 'esophagus', 'stomach', 'small-intestine', 'large-intestine', 'rectum']

/* One continuous bolus path: mouth → esophagus → stomach → duodenum →
 * small-intestine coils → ascending → transverse → descending colon →
 * sigmoid → rectum. The drawn tubes follow the same geometry. */
/* One continuous bolus path: mouth → esophagus → stomach → duodenum →
 * small-intestine coils → ascending → transverse → descending colon →
 * sigmoid → rectum. The drawn tubes follow the same geometry. */
const BOLUS_PATH =
  'M 190 62 V 238 C 230 255 270 275 292 305 C 320 330 360 340 375 375 C 385 395 400 405 445 405 H 618 A 15 15 0 0 1 618 436 H 452 A 15 15 0 0 0 452 468 H 618 A 15 15 0 0 1 618 500 H 652 C 672 500 688 504 690 514 V 198 A 16 16 0 0 0 674 182 H 362 A 16 16 0 0 0 346 198 V 452 C 346 496 318 512 302 530 L 298 548'

/* ============================ Liver & gallbladder ============================ */

type LiverStageId = 'portal' | 'lobule' | 'bile' | 'release'

const LIVER_STAGES: Record<
  LiverStageId,
  { name: string; latin: string; job: string; blurb: string; note: string; dot: { x: number; y: number } }
> = {
  portal: {
    name: 'Portal Blood Arrives',
    latin: 'vena portae hepatis',
    job: 'Two blood supplies, one organ',
    blurb:
      'The liver is the only organ with two blood supplies, and the odd one is the bigger: the portal vein brings about three quarters of its blood, straight from the gut — rich in the nutrients of your last meal, but also carrying anything the gut absorbed that should not reach the rest of the body. The hepatic artery brings the other quarter, oxygen-rich, straight from the aorta. Watch the blue dots: nutrient-loaded blood arriving to be sorted before it is allowed anywhere near the heart.',
    note: 'Everything absorbed from the gut passes through the liver first — the first-pass effect. It is why some medicines are swallowed and some must bypass the gut entirely.',
    dot: { x: 310, y: 470 },
  },
  lobule: {
    name: 'Hepatocytes at Work',
    latin: 'lobulus hepatis',
    job: 'The lobule — the liver’s working unit',
    blurb:
      'Zoom in and the liver is not a solid mass but a honeycomb of tiny hexagonal units — lobules, about a millimetre across. At each corner sits a portal triad: a branch of the portal vein, a branch of the hepatic artery, and a bile duct. Blood flows inward through sieve-like sinusoids, past rows of hepatocytes, to the central vein. The hepatocytes take what the body needs — glucose to store as glycogen, amino acids to rebuild — and neutralise what it does not: ammonia becomes urea, alcohol and drugs are broken down. Watch the dots stream to the centre: blood being cleaned, one lobule at a time.',
    note: 'Blood and bile flow in opposite directions through the lobule: blood runs in from the triads to the central vein, while bile drains out the other way, into the ducts at the corners.',
    dot: { x: 160, y: 460 },
  },
  bile: {
    name: 'Bile Is Made',
    latin: 'bilis · fel',
    job: '800–1,000 mL a day, made on the spot',
    blurb:
      'The same hepatocytes that clean the blood also manufacture bile — a green-yellow fluid built from cholesterol, bile salts, and bilirubin, the breakdown product of old red blood cells. Bile drains into tiny canaliculi between the liver cells, then into larger ducts, and down the common hepatic duct. When there is no meal to digest, it is diverted into the gallbladder, where water is drawn out until it is up to ten times more concentrated. Watch the green dots: bile on its way to storage.',
    note: 'Bilirubin is what makes bile — and bruises — yellow-green, and what turns the skin yellow in jaundice when bile cannot drain.',
    dot: { x: 445, y: 360 },
  },
  release: {
    name: 'Stored, Then Released',
    latin: 'vesica biliaris',
    job: 'The gallbladder — a squeeze pouch, not a factory',
    blurb:
      'The gallbladder makes nothing; it stores and concentrates. A pear-shaped pouch of about 30–50 millilitres, tucked into a fossa on the liver’s underside. When fatty food reaches the small intestine, the gut releases the hormone cholecystokinin, the gallbladder contracts, and concentrated bile shoots down the common bile duct into the duodenum — where bile salts break fat into droplets small enough for enzymes to attack. Press “Send a fatty meal” and watch it happen: the pouch squeezes, the duct flashes green, and the stored bile meter drops.',
    note: 'Gallstones form when bile sits too long and its cholesterol crystallises — which is why the gallbladder, not the liver, is the organ surgeons most often remove.',
    dot: { x: 505, y: 345 },
  },
}

const LIVER_ORDER: LiverStageId[] = ['portal', 'lobule', 'bile', 'release']

/* Bile duct route: hepatic duct → junction with the cystic duct → common
 * bile duct → duodenum. The drawn ducts follow the same geometry. */
const BILE_PATH =
  'M 430 312 C 440 350 455 385 470 420 C 545 426 665 412 790 400'
const CYSTIC_PATH = 'M 505 388 C 500 400 488 410 470 420'
const PORTAL_PATH = 'M 300 560 C 300 470 320 400 360 350 C 380 325 400 315 420 308'
const ARTERY_PATH = 'M 350 560 C 350 480 365 400 395 330'
const HEPATIC_VEIN_PATH = 'M 300 140 C 300 100 300 70 300 45'

const LOBULE_CENTRE = { x: 160, y: 460 }
const LOBULE_R = 68
const lobuleCorner = (i: number) => ({
  x: LOBULE_CENTRE.x + LOBULE_R * Math.cos((Math.PI / 3) * i),
  y: LOBULE_CENTRE.y + LOBULE_R * Math.sin((Math.PI / 3) * i),
})

export function LiverLab({ bare = false }: { bare?: boolean }) {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [bileStored, setBileStored] = useState(18)
  const [mealFlash, setMealFlash] = useState(false)
  const [processed, setProcessed] = useState(0)
  const info = LIVER_STAGES[LIVER_ORDER[stage]]
  const id = LIVER_ORDER[stage]

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStage((s) => (s + 1) % LIVER_ORDER.length), 4200)
    return () => clearInterval(t)
  }, [playing])

  /* While the lab runs, blood keeps being processed and bile keeps filling
   * the gallbladder (faster once bile production is the active stage). */
  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setProcessed((p) => Math.min(100, p + 1))
      setBileStored((b) => Math.min(96, b + (id === 'bile' || id === 'release' ? 2 : 1)))
    }, 900)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, id])

  const sendMeal = () => {
    setMealFlash(true)
    setBileStored((b) => Math.max(8, b - 55))
    window.setTimeout(() => setMealFlash(false), 2600)
  }

  const seg = (active: boolean) => ({ opacity: active ? 1 : 0.3, transition: 'opacity 0.6s ease' })

  return (
    <LabShell
      bare={bare}
      diagram={
        <div>
          <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Animated diagram of the liver and gallbladder: portal blood arriving, hepatocytes working in a lobule, bile being made and stored, then released into the duodenum">
            {/* Inferior vena cava — blood leaving the liver for the heart */}
            <g style={seg(id === 'portal')}>
              <path d="M 286 140 V 40" stroke="#5F83C2" strokeWidth={26} strokeLinecap="round" />
              <path d="M 314 140 V 40" stroke="#5F83C2" strokeWidth={26} strokeLinecap="round" opacity={0.0} />
              <rect x={282} y={28} width={36} height={112} rx={16} fill="#5F83C2" opacity={0.85} />
              <text x={330} y={70} fontSize={14} fontWeight={700} fill="#4D6EA3">Inferior vena cava → heart</text>
              {id === 'portal' && playing && (
                <circle r={5} fill="#2B4A7A">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path={HEPATIC_VEIN_PATH} />
                </circle>
              )}
            </g>

            {/* Liver silhouette — right lobe big on the left, left lobe tapering right */}
            <g style={seg(true)}>
              <path
                d="M 168 318 C 148 215 190 138 292 116 C 395 96 520 102 625 122 C 725 141 812 178 850 210 C 864 222 854 240 826 248 C 752 268 662 280 582 288 C 482 297 382 301 302 308 C 242 314 188 330 168 318 Z"
                fill="#B4663F"
                stroke="#8A4A2E"
                strokeWidth={3}
              />
              {/* Falciform ligament — the seam between the two lobes */}
              <path d="M 605 128 C 598 180 585 240 570 292" fill="none" stroke="#8A4A2E" strokeWidth={2.5} opacity={0.55} />
              <text x={618} y={158} fontSize={13} fontWeight={700} fill="#8A4A2E">Falciform ligament</text>
              <text x={295} y={195} fontSize={15} fontWeight={700} fill="#5E2F1A">Right lobe</text>
              <text x={705} y={200} fontSize={14} fontWeight={700} fill="#5E2F1A">Left lobe</text>
            </g>

            {/* Portal vein + hepatic artery — the two supplies entering the hilum */}
            <g style={seg(id === 'portal')}>
              <path d={PORTAL_PATH} fill="none" stroke="#5F83C2" strokeWidth={16} strokeLinecap="round" />
              <path d={ARTERY_PATH} fill="none" stroke="#D64545" strokeWidth={9} strokeLinecap="round" />
              <text x={60} y={552} fontSize={13} fontWeight={700} fill="#4D6EA3">Portal vein — from the gut</text>
              <path d="M 242 548 H 292" stroke="#4D6EA3" strokeWidth={2} fill="none" />
              <text x={358} y={520} fontSize={13} fontWeight={700} fill="#B93327">Hepatic artery</text>
              {id === 'portal' && playing && (
                <>
                  <circle r={5} fill="#2B4A7A">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path={PORTAL_PATH} />
                  </circle>
                  <circle r={5} fill="#2B4A7A">
                    <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path={PORTAL_PATH} />
                  </circle>
                  <circle r={5} fill="#2B4A7A">
                    <animateMotion dur="2.4s" begin="1.6s" repeatCount="indefinite" path={PORTAL_PATH} />
                  </circle>
                  <circle r={4} fill="#D64545">
                    <animateMotion dur="2.4s" begin="0.4s" repeatCount="indefinite" path={ARTERY_PATH} />
                  </circle>
                  <circle r={4} fill="#D64545">
                    <animateMotion dur="2.4s" begin="1.4s" repeatCount="indefinite" path={ARTERY_PATH} />
                  </circle>
                </>
              )}
            </g>

            {/* Gallbladder — pear-shaped, tucked under the liver */}
            <g style={seg(id === 'bile' || id === 'release')}>
              <g
                style={{
                  transform: mealFlash ? 'scale(0.9)' : 'scale(1)',
                  transformOrigin: '505px 345px',
                  transition: 'transform 0.5s ease',
                }}
              >
                <path
                  d="M 505 300 C 530 300 543 322 541 348 C 539 372 524 392 505 392 C 486 392 471 372 469 348 C 467 322 480 300 505 300 Z"
                  fill={mealFlash ? '#7FB069' : '#5F8F5A'}
                  stroke="#3F6B3A"
                  strokeWidth={2.5}
                />
              </g>
              <text x={552} y={352} fontSize={14} fontWeight={700} fill="#3F6B3A">Gallbladder</text>
              <path d="M548 348 C542 348 536 349 532 350" stroke="#3F6B3A" strokeWidth={2} fill="none" />
            </g>

            {/* Bile ducts: hepatic → cystic → common bile duct → duodenum */}
            <g style={seg(id === 'bile' || id === 'release')}>
              <path d={BILE_PATH} fill="none" stroke="#5F8F5A" strokeWidth={7} strokeLinecap="round" />
              <path d={CYSTIC_PATH} fill="none" stroke="#5F8F5A" strokeWidth={6} strokeLinecap="round" />
              <text x={560} y={470} fontSize={13} fontWeight={700} fill="#3F6B3A">Common bile duct</text>
              {id === 'bile' && playing && (
                <>
                  <circle r={5} fill="#2F7A3D">
                    <animateMotion dur="2.6s" repeatCount="indefinite" path={BILE_PATH} />
                  </circle>
                  <circle r={5} fill="#2F7A3D">
                    <animateMotion dur="2.6s" begin="0.9s" repeatCount="indefinite" path={BILE_PATH} />
                  </circle>
                  <circle r={5} fill="#2F7A3D">
                    <animateMotion dur="2.6s" begin="1.8s" repeatCount="indefinite" path={BILE_PATH} />
                  </circle>
                </>
              )}
              {mealFlash && (
                <>
                  <circle r={7} fill="#2F7A3D">
                    <animateMotion dur="2.2s" repeatCount="indefinite" path={BILE_PATH} />
                  </circle>
                  <circle r={7} fill="#2F7A3D">
                    <animateMotion dur="2.2s" begin="0.7s" repeatCount="indefinite" path={BILE_PATH} />
                  </circle>
                  <circle r={7} fill="#2F7A3D">
                    <animateMotion dur="2.2s" begin="1.4s" repeatCount="indefinite" path={BILE_PATH} />
                  </circle>
                </>
              )}
            </g>

            {/* Duodenum — where bile meets the meal */}
            <g style={seg(id === 'release')}>
              <path d="M 730 300 C 795 318 815 375 795 440 C 775 495 730 505 708 482" fill="none" stroke="#F2B8A0" strokeWidth={26} strokeLinecap="round" />
              <text x={800} y={410} fontSize={14} fontWeight={700} fill="#B6544A">Duodenum</text>
              {mealFlash && (
                <circle r={6} fill="#2F7A3D" opacity={0.9}>
                  <animate attributeName="r" values="6;10;6" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.2s" repeatCount="indefinite" />
                  <animateMotion dur="2.2s" begin="1.9s" repeatCount="indefinite" path="M 790 400 C 800 410 805 425 800 445" />
                </circle>
              )}
            </g>

            {/* Lobule inset — one hexagonal working unit, blood streaming to the central vein */}
            <g style={seg(id === 'lobule')}>
              <polygon
                points={[0, 1, 2, 3, 4, 5].map((i) => `${lobuleCorner(i).x},${lobuleCorner(i).y}`).join(' ')}
                fill="#F6E8D8"
                stroke="#B89A4A"
                strokeWidth={2.5}
              />
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const c = lobuleCorner(i)
                return <circle key={i} cx={c.x} cy={c.y} r={7} fill="#8A6A2E" />
              })}
              <circle cx={LOBULE_CENTRE.x} cy={LOBULE_CENTRE.y} r={15} fill="#5F83C2" stroke="#4D6EA3" strokeWidth={2.5} />
              <text x={LOBULE_CENTRE.x} y={LOBULE_CENTRE.y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">vein</text>
              {id === 'lobule' && playing &&
                [0, 1, 2, 3, 4, 5].map((i) => {
                  const c = lobuleCorner(i)
                  return (
                    <circle key={i} r={4.5} fill="#2B4A7A">
                      <animateMotion
                        dur="2.2s"
                        begin={`${i * 0.35}s`}
                        repeatCount="indefinite"
                        path={`M ${c.x} ${c.y} L ${LOBULE_CENTRE.x} ${LOBULE_CENTRE.y}`}
                      />
                      <animate attributeName="opacity" values="1;1;0" dur="2.2s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                    </circle>
                  )
                })}
              <text x={60} y={382} fontSize={12} fontWeight={700} fill="#8A6A2E">One lobule — portal triads at the corners</text>
            </g>

            {/* Stage hotspots */}
            {LIVER_ORDER.map((sid, i) => {
              const s = LIVER_STAGES[sid]
              const isActive = stage === i
              return (
                <g key={sid} onClick={() => { setStage(i); setPlaying(false) }} className="cursor-pointer">
                  {isActive && <circle cx={s.dot.x} cy={s.dot.y} r={13} fill="none" stroke="#0E7C86" strokeWidth={2.5} className="ping-ring" />}
                  <circle cx={s.dot.x} cy={s.dot.y} r={isActive ? 11 : 8} fill={isActive ? '#0E7C86' : '#16222E'} stroke="#fff" strokeWidth={2.5} />
                </g>
              )
            })}
          </svg>

          {/* Stage timeline */}
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {LIVER_ORDER.map((sid, i) => (
              <button
                key={sid}
                onClick={() => {
                  setStage(i)
                  setPlaying(false)
                }}
                aria-pressed={stage === i}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  stage === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="block font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">Stage {i + 1}</span>
                <span className="mt-0.5 block font-display text-[0.9rem] font-bold leading-tight text-ink-950">{LIVER_STAGES[sid].name}</span>
              </button>
            ))}
          </div>
        </div>
      }
      panel={
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
            Stage {stage + 1} of 4 · {info.job}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{info.name}</h3>
          <p className="mt-1 font-serif text-sm italic text-ink-500">{info.latin}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>≈ 1.5 kg — the largest internal organ</Chip>
            <Chip>Bile ≈ 800–1,000 mL/day</Chip>
            <Chip>Blood flow ≈ 1.5 L/min</Chip>
          </div>

          <div className="mt-6 grid gap-4">
            <Meter label="Bile stored in the gallbladder" value={bileStored} tone="bg-success-500" />
            <Meter label="Portal blood processed since you opened the lab" value={processed} tone="bg-venous-500" />
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause' : '▶ Play'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStage((s) => (s + LIVER_ORDER.length - 1) % LIVER_ORDER.length); setPlaying(false) }}>
                ← Prev stage
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStage((s) => (s + 1) % LIVER_ORDER.length); setPlaying(false) }}>
                Next stage →
              </Button>
              <Button size="sm" variant="accent" onClick={sendMeal}>
                Send a fatty meal
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{info.note}</p>
          </div>
        </div>
      }
    />
  )
}

/* ========================== Blood pressure =========================== */

/*
 * BloodPressureLab — pressure is the product of flow and resistance.
 * An arteriole narrows or widens under its smooth muscle (radius slider),
 * blood cells stream through it, a gauge reads mean arterial pressure, and
 * a sweeping dot traces the arterial pressure wave. The numbers follow one
 * equation, MAP = cardiac output × total peripheral resistance, with
 * resistance ∝ 1/r⁴ — so a small change in radius moves pressure a lot.
 * Rest: HR 70, stroke volume 70 mL → CO 4.9 L/min → MAP ≈ 93 mmHg (120/80).
 * Exercise: HR 150, SV 110 mL → CO 16.5 L/min, but the muscle vessels
 * dilate (radius 1.3×), so resistance falls and MAP rises only modestly —
 * that is why systolic climbs in exercise while diastolic barely moves.
 */

const BP_WAVE =
  'M400 445 C415 445 425 440 432 410 C438 385 445 362 455 360 C465 358 472 385 478 408 C482 420 488 412 494 416 C510 428 540 445 570 445 L640 445 C655 445 665 440 672 410 C678 385 685 362 695 360 C705 358 712 385 718 408 C722 420 728 412 734 416 C750 428 780 445 810 445 L940 445'

export function BloodPressureLab({ bare = false }: { bare?: boolean }) {
  const [playing, setPlaying] = useState(true)
  const [activity, setActivity] = useState<'rest' | 'exercise'>('rest')
  const [radius, setRadius] = useState(1)

  const hr = activity === 'rest' ? 70 : 150
  const sv = activity === 'rest' ? 70 : 110 // mL per beat
  const co = (hr * sv) / 1000 // L/min
  const tpr = Math.pow(1 / radius, 4) // relative resistance, 1.0 at rest radius
  const map = Math.round(co * tpr * 19) // calibrated: rest → 93 mmHg
  const pp = 40 * (sv / 70) // pulse pressure grows with stroke volume
  const sbp = Math.round(map + (2 * pp) / 3)
  const dbp = Math.round(map - pp / 3)
  const beatDur = 60 / hr // seconds per heartbeat
  const flowDur = Math.max(1.4, 5.5 * (4.9 / co)) // cells speed up with flow

  const halfH = 72 * radius // vessel half-height in the diagram
  const muscleT = Math.max(5, (1.45 - radius) * 26) // smooth-muscle band thickness
  const needleAngle = -120 + (Math.min(map, 200) / 200) * 240
  const status =
    map < 70
      ? { label: 'Too low — organs under-perfused', tone: 'closed' as const }
      : map <= 100
        ? { label: 'Normal mean pressure', tone: 'open' as const }
        : map <= 120
          ? { label: 'Elevated — watch this range', tone: 'sand' as const }
          : { label: 'High — hypertensive range', tone: 'closed' as const }

  const dot = (begin: number, r = 9) => (
    <circle r={r} fill="#FFD9D3" stroke="#fff" strokeWidth={2}>
      {playing && <animateMotion dur={`${flowDur}s`} begin={`${begin}s`} repeatCount="indefinite" path="M80 185 H920" />}
    </circle>
  )

  const setActivityAndRadius = (a: 'rest' | 'exercise') => {
    setActivity(a)
    setRadius(a === 'rest' ? 1 : 1.3)
  }

  return (
    <LabShell
      bare={bare}
      diagram={
        <svg viewBox="0 0 1000 540" className="w-full" role="img" aria-label="Animated diagram of an arteriole: blood cells flow through a vessel whose radius changes, a gauge reads mean arterial pressure, and a dot traces the pressure wave">
          <text x={500} y={40} textAnchor="middle" fontSize={24} fontWeight={800} fill="#16222E">
            One arteriole, under pressure
          </text>
          <text x={500} y={66} textAnchor="middle" fontSize={15} fill="#6B7684">
            the smooth muscle in its wall decides the radius — and the radius decides the pressure
          </text>

          {/* Smooth-muscle bands above and below the vessel */}
          <rect x={60} y={185 - halfH - muscleT - 8} width={880} height={muscleT} rx={muscleT / 2} fill="#B45309" opacity={0.75} />
          <rect x={60} y={185 + halfH + 8} width={880} height={muscleT} rx={muscleT / 2} fill="#B45309" opacity={0.75} />

          {/* Vessel wall and lumen, radius follows the slider */}
          <rect x={60} y={185 - halfH} width={880} height={halfH * 2} rx={halfH} fill="#8E2A25" />
          <rect x={60} y={185 - halfH * 0.62} width={880} height={halfH * 1.24} rx={halfH * 0.62} fill="#D64545" />

          {/* Blood cells streaming through */}
          {dot(-0.2)}
          {dot(-1.4)}
          {dot(-2.6)}
          {dot(-3.8)}
          {dot(-5.0, 8)}
          {dot(-0.8, 8)}

          <text x={500} y={185 + halfH + muscleT + 34} textAnchor="middle" fontSize={16} fill="#6B7684">
            resistance ∝ 1 / r⁴ — now {tpr.toFixed(2)}× its resting value · flow {co.toFixed(1)} L/min
          </text>

          {/* MAP gauge */}
          <g>
            <circle cx={200} cy={430} r={88} fill="#FFFFFF" stroke="#E0D9C6" strokeWidth={2} />
            <path d="M128 480 A88 88 0 0 1 272 480" fill="none" stroke="#E0D9C6" strokeWidth={10} strokeLinecap="round" />
            <path d="M146 398 A88 88 0 0 1 254 398" fill="none" stroke="#2F9E6E" strokeWidth={10} strokeLinecap="round" />
            {[0, 50, 100, 150, 200].map((v) => {
              const a = ((-120 + (v / 200) * 240) * Math.PI) / 180
              const x1 = 200 + 74 * Math.sin(a)
              const y1 = 430 - 74 * Math.cos(a)
              const x2 = 200 + 84 * Math.sin(a)
              const y2 = 430 - 84 * Math.cos(a)
              return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#16222E" strokeWidth={2} />
            })}
            <g transform={`rotate(${needleAngle} 200 430)`}>
              <line x1={200} y1={430} x2={200} y2={362} stroke="#B93327" strokeWidth={4} strokeLinecap="round" />
            </g>
            <circle cx={200} cy={430} r={7} fill="#16222E" />
            <text x={200} y={478} textAnchor="middle" fontSize={26} fontWeight={800} fill="#16222E">
              {map}
            </text>
            <text x={200} y={500} textAnchor="middle" fontSize={13} fill="#6B7684">
              MAP · mmHg
            </text>
          </g>

          {/* Arterial pressure wave */}
          <text x={670} y={330} textAnchor="middle" fontSize={16} fontWeight={700} fill="#16222E">
            The pressure wave of each heartbeat
          </text>
          <text x={670} y={352} textAnchor="middle" fontSize={14} fill="#6B7684">
            steep rise = systole · dip = dicrotic notch · trough = diastole
          </text>
          <path d={BP_WAVE} fill="none" stroke="#D64545" strokeWidth={3.5} strokeLinecap="round" />
          <circle r={8} fill="#B93327" stroke="#fff" strokeWidth={2}>
            {playing && <animateMotion dur={`${(beatDur * 2).toFixed(2)}s`} repeatCount="indefinite" path={BP_WAVE} />}
          </circle>
        </svg>
      }
      panel={
        <div>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-sand p-1" role="tablist" aria-label="Activity level">
            {(
              [
                ['rest', 'Resting'],
                ['exercise', 'Exercising'],
              ] as const
            ).map(([a, label]) => (
              <button
                key={a}
                onClick={() => setActivityAndRadius(a)}
                aria-pressed={activity === a}
                className={`rounded-full px-2 py-2 font-display text-[0.9rem] font-bold transition-colors ${
                  activity === a ? 'bg-primary-600 text-white shadow-sm' : 'text-ink-700 hover:text-ink-950'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between font-mono text-xs text-ink-500">
              <span>Arteriole radius (smooth muscle)</span>
              <span className="font-bold text-ink-950">{Math.round(radius * 100)}%</span>
            </div>
            <input
              type="range"
              min={70}
              max={140}
              step={5}
              value={Math.round(radius * 100)}
              onChange={(e) => setRadius(Number(e.target.value) / 100)}
              className="mt-2 w-full accent-primary-600"
              aria-label="Arteriole radius as a percentage of resting radius"
            />
            <div className="flex justify-between font-mono text-[0.68rem] text-ink-400">
              <span>70% · constricted</span>
              <span>140% · dilated</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <p className="text-center font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-400">
              Blood pressure
            </p>
            <p className="mt-1 text-center font-display text-4xl font-extrabold tracking-tight text-ink-950">
              {sbp}
              <span className="text-2xl text-ink-400"> / </span>
              {dbp}
              <span className="ml-2 text-base font-bold text-ink-500">mmHg</span>
            </p>
            <p className="mt-1 text-center text-sm text-ink-700">
              systolic / diastolic · mean arterial pressure {map} mmHg
            </p>
            <div className="mt-3 flex justify-center">
              <Chip tone={status.tone}>{status.label}</Chip>
            </div>
          </div>

          <dl className="mt-5 space-y-2.5 text-sm">
            {[
              ['Heart rate', `${hr} beats/min`],
              ['Stroke volume', `${sv} mL per beat`],
              ['Cardiac output', `${co.toFixed(1)} L/min`],
              ['Resistance (TPR)', `${tpr.toFixed(2)}× resting`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-36 shrink-0 font-display font-bold text-ink-950">{k}</dt>
                <dd className="font-mono text-ink-700">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-4">
            <Meter label="Mean arterial pressure" value={Math.round((Math.min(map, 200) / 200) * 100)} tone="bg-arterial-500" />
            <Meter label="Blood flow (cardiac output)" value={Math.round((co / 17) * 100)} />
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause pulse' : '▶ Play pulse'}
              </Button>
            </div>
            <p className="mt-3 font-mono text-sm leading-relaxed text-ink-800">
              MAP = CO × TPR = {co.toFixed(1)} × {tpr.toFixed(2)} × 19 ≈ {map} mmHg
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              The orange bands are the smooth muscle in the arteriole wall — when it contracts,
              the lumen narrows. Narrow the vessel by a third and resistance rises five-fold —
              that is why the arterioles, not the heart, are the body&rsquo;s main pressure
              control. Exercise raises output four-fold, yet pressure climbs only a little: the
              muscle vessels dilate and let the extra flow through.
            </p>
          </div>
        </div>
      }
    />
  )
}

/* ===================== Muscles: how movement is made ===================== */

type MuscleStepId = 0 | 1 | 2 | 3

const MUSCLE_STEPS: {
  name: string
  latin: string
  job: string
  blurb: string
  note: string
  flex: number
  headAngle: number
}[] = [
  {
    name: 'Cocked and ready',
    latin: 'caput myosini paratum',
    job: 'the head waits, loaded',
    blurb:
      'A myosin head, loaded with ADP and phosphate from the last ATP it split, sits cocked back like a loaded spring. Calcium — released from the sarcoplasmic reticulum when the nerve fired — has pulled tropomyosin off the actin binding sites, so the road is open.',
    note: 'No calcium, no contraction: at rest, tropomyosin blocks every binding site, and the heads wait.',
    flex: 0.15,
    headAngle: -35,
  },
  {
    name: 'Bind — the cross-bridge forms',
    latin: 'pons transversus',
    job: 'myosin grips actin',
    blurb:
      'The cocked myosin head reaches out and locks onto an actin filament. This grip is called a cross-bridge — thousands of them form at once along every myofibril, each one a tiny hand grabbing the rope it is about to pull.',
    note: 'One head pulls almost nothing. A single muscle fibre has billions of heads pulling in step — that is where force comes from.',
    flex: 0.45,
    headAngle: -10,
  },
  {
    name: 'Power stroke — the pull',
    latin: 'ictus potens',
    job: 'actin slides inward',
    blurb:
      'The head pivots, dragging the actin filament toward the centre of the sarcomere, and lets go of its ADP and phosphate. The filaments do not shorten themselves — they slide past each other, and the Z-discs are pulled together. This is the step that actually shortens the muscle.',
    note: 'Watch the Z-discs: the sarcomere narrows from about 2.2 µm at rest to about 1.6 µm fully contracted.',
    flex: 0.9,
    headAngle: 25,
  },
  {
    name: 'Detach and re-cock',
    latin: 'dimitte et recollige',
    job: 'ATP resets the head',
    blurb:
      'A fresh ATP molecule binds to the head, and the head lets go of actin. Splitting that ATP re-cocks the head, ready to grab a new site further along the filament — and the cycle repeats, about five times a second per head, for as long as calcium stays high.',
    note: 'Without ATP the heads cannot let go — they stay locked to actin. That is rigor mortis: the muscle stiffens because the reset step never comes.',
    flex: 0.3,
    headAngle: -35,
  },
]

type MuscleId = 'biceps' | 'triceps' | 'quadriceps' | 'gastrocnemius'

const MUSCLES: Record<
  MuscleId,
  { name: string; latin: string; origin: string; insertion: string; action: string; line: string }
> = {
  biceps: {
    name: 'Biceps brachii',
    latin: 'musculus biceps brachii',
    origin: 'Scapula — coracoid process & above the shoulder socket',
    insertion: 'Radial tuberosity, just below the elbow',
    action: 'Flexes the elbow · supinates the forearm (turns the palm up)',
    line: 'The show muscle of the arm — two heads, one tendon — and the flexor in the curl above. It pulls the forearm up because it crosses the elbow on the front side.',
  },
  triceps: {
    name: 'Triceps brachii',
    latin: 'musculus triceps brachii',
    origin: 'Scapula & the back of the humerus',
    insertion: 'Olecranon — the point of the elbow',
    action: 'Extends the elbow · the antagonist of the biceps',
    line: 'Three heads, one tendon, and the muscle that straightens the arm again. When the biceps shortens to lift, the triceps must lengthen and let go — muscles only pull, never push.',
  },
  quadriceps: {
    name: 'Quadriceps femoris',
    latin: 'musculus quadriceps femoris',
    origin: 'Pelvis & the front of the femur',
    insertion: 'Tibial tuberosity, via the patellar tendon',
    action: 'Extends the knee · the engine of standing up, climbing, kicking',
    line: 'Four muscles in one sleeve — the largest muscle group in the body. The patella sits inside its tendon like a pulley, giving the quadriceps a better lever arm over the knee.',
  },
  gastrocnemius: {
    name: 'Gastrocnemius',
    latin: 'musculus gastrocnemius',
    origin: 'The two condyles of the femur, behind the knee',
    insertion: 'Heel bone (calcaneus), via the Achilles tendon',
    action: 'Plantarflexes the foot · pushes you off the ground with every step',
    line: 'The calf muscle you can see — two heads forming the bulge of the calf. It crosses both the knee and the ankle, so it flexes the knee a little while it points the foot down.',
  },
}

const MUSCLE_ORDER: MuscleId[] = ['biceps', 'triceps', 'quadriceps', 'gastrocnemius']

export function MuscleLab({ bare = false }: { bare?: boolean }) {
  const [step, setStep] = useState<MuscleStepId>(0)
  const [playing, setPlaying] = useState(true)
  const [pace, setPace] = useState<'slow' | 'fast'>('slow')
  const [muscle, setMuscle] = useState<MuscleId>('biceps')
  const [flex, setFlex] = useState(0.15)

  const info = MUSCLE_STEPS[step]
  const muscleInfo = MUSCLES[muscle]

  useEffect(() => {
    if (!playing) return
    const duration = pace === 'slow' ? 4200 : 1800
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const cycle = ((now - start) / duration) % 1
      setFlex(0.5 - 0.5 * Math.cos(cycle * Math.PI * 2))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, pace])

  useEffect(() => {
    if (!playing) setFlex(info.flex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, playing])

  const headAngle = playing
    ? -35 + 55 * (0.5 + 0.5 * Math.sin(performance.now() / 300))
    : info.headAngle
  const armAngle = 8 + 118 * flex
  const sarcoHalf = 150 - 45 * flex
  const zLeft = 320 - sarcoHalf
  const zRight = 320 + sarcoHalf
  const headXs = [288, 310, 332, 354]

  const goStep = (s: MuscleStepId) => {
    setStep(s)
    setPlaying(false)
  }

  return (
    <LabShell
      bare={bare}
      diagram={
        <div>
          <svg viewBox="0 0 640 590" className="mx-auto w-full max-w-[560px]" role="img" aria-label="Animated diagram: a biceps curl flexes the elbow while a sarcomere below shortens as myosin heads row along actin">
            {/* ---- the curl: arm in side view, anterior to the left ---- */}
            <text x="20" y="28" className="fill-ink-500 font-mono" fontSize="11" letterSpacing="2">THE CURL — ONE REPETITION</text>
            {/* upper arm */}
            <path d="M138 62 Q138 52 150 52 L196 52 Q208 52 208 62 L208 178 Q208 192 194 192 L152 192 Q138 192 138 178 Z" fill="#e9dcc3" stroke="#d8c9a8" strokeWidth="1.5" />
            {/* triceps (posterior, right side) — lengthens as the elbow flexes */}
            <ellipse cx="197" cy={130 + 8 * flex} rx={19 - 4 * flex} ry={52 + 12 * flex} fill="#c96a4e" opacity="0.9" />
            {/* biceps (anterior, left side) — shortens and bulges as it contracts */}
            <ellipse cx="150" cy={122 - 6 * flex} rx={24 + 13 * flex} ry={52 - 14 * flex} fill="#d64545" />
            <path d="M150 84 L150 66" stroke="#b93327" strokeWidth="4" strokeLinecap="round" />
            <path d="M150 174 L158 186" stroke="#b93327" strokeWidth="4" strokeLinecap="round" />
            {/* shoulder + elbow joints */}
            <circle cx="173" cy="58" r="10" fill="#f7f4ee" stroke="#d8c9a8" strokeWidth="1.5" />
            <text x="118" y="62" className="fill-ink-500" fontSize="11" textAnchor="end">Shoulder</text>
            <circle cx="173" cy="190" r="8" fill="#f7f4ee" stroke="#d8c9a8" strokeWidth="1.5" />
            <text x="232" y="194" className="fill-ink-500" fontSize="11">Elbow</text>
            {/* forearm + hand + dumbbell, rotating about the elbow */}
            <g transform={`rotate(${armAngle} 173 190)`}>
              <path d="M150 190 L196 190 L192 272 Q191 284 177 284 L169 284 Q155 284 154 272 Z" fill="#e9dcc3" stroke="#d8c9a8" strokeWidth="1.5" />
              <path d="M158 202 L188 202 L186 258 L160 258 Z" fill="#f3e9d2" opacity="0.7" />
              <circle cx="173" cy="296" r="14" fill="#e9dcc3" stroke="#d8c9a8" strokeWidth="1.5" />
              <rect x="132" y="290" width="82" height="11" rx="5.5" fill="#5f6b7a" />
              <circle cx="130" cy="295" r="11" fill="#3d4756" />
              <circle cx="216" cy="295" r="11" fill="#3d4756" />
            </g>
            <text x="320" y="62" className="fill-ink-700" fontSize="13" fontWeight="600" textAnchor="middle">
              Elbow angle: {Math.round(172 - 118 * flex)}°
            </text>
            <text x="320" y="80" className="fill-ink-500 font-serif" fontSize="12" fontStyle="italic" textAnchor="middle">
              biceps shortens → forearm rises · triceps yields
            </text>

            {/* ---- the sarcomere: the unit that shortens ---- */}
            <text x="20" y="356" className="fill-ink-500 font-mono" fontSize="11" letterSpacing="2">ONE SARCOMERE — THE UNIT THAT SHORTENS</text>
            <text x="620" y="356" className="fill-ink-500 font-mono" fontSize="11" textAnchor="end">≈ 2.2 µm → ≈ 1.6 µm</text>
            {/* actin filaments, anchored to the Z-discs */}
            {[438, 464, 490].map((y) => (
              <g key={y}>
                <line x1={zLeft + 3} y1={y} x2={zLeft + 108} y2={y} stroke="#d64545" strokeWidth="3" strokeLinecap="round" />
                <line x1={zRight - 3} y1={y} x2={zRight - 108} y2={y} stroke="#d64545" strokeWidth="3" strokeLinecap="round" />
              </g>
            ))}
            {/* myosin thick filament */}
            <rect x="272" y="450" width="96" height="34" rx="12" fill="#5f83c2" />
            <text x="320" y="471" className="fill-white" fontSize="11" fontWeight="700" textAnchor="middle">MYOSIN</text>
            {/* myosin heads rowing along actin */}
            {headXs.map((x) => (
              <g key={x}>
                <line
                  x1={x}
                  y1="450"
                  x2={x + 16 * Math.sin((headAngle * Math.PI) / 180)}
                  y2={450 - 20 * Math.cos((headAngle * Math.PI) / 180)}
                  stroke="#4d6ea3"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx={x + 16 * Math.sin((headAngle * Math.PI) / 180)} cy={450 - 20 * Math.cos((headAngle * Math.PI) / 180)} r="4" fill="#4d6ea3" />
                <line
                  x1={x}
                  y1="484"
                  x2={x + 16 * Math.sin((headAngle * Math.PI) / 180)}
                  y2={484 + 20 * Math.cos((headAngle * Math.PI) / 180)}
                  stroke="#4d6ea3"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx={x + 16 * Math.sin((headAngle * Math.PI) / 180)} cy={484 + 20 * Math.cos((headAngle * Math.PI) / 180)} r="4" fill="#4d6ea3" />
              </g>
            ))}
            {/* Z-discs */}
            <rect x={zLeft - 3} y="420" width="6" height="92" rx="3" fill="#16222e" />
            <rect x={zRight - 3} y="420" width="6" height="92" rx="3" fill="#16222e" />
            <text x={zLeft} y="534" className="fill-ink-700" fontSize="12" fontWeight="600" textAnchor="middle">Z-disc</text>
            <text x={zRight} y="534" className="fill-ink-700" fontSize="12" fontWeight="600" textAnchor="middle">Z-disc</text>
            <text x={zLeft + 60} y="412" className="fill-arterial-600" fontSize="11" fontWeight="600">Actin (thin)</text>
            <text x={zRight - 60} y="412" className="fill-arterial-600" fontSize="11" fontWeight="600" textAnchor="end">Actin (thin)</text>
            <text x="320" y="560" className="fill-ink-500 font-serif" fontSize="12.5" fontStyle="italic" textAnchor="middle">
              Myosin heads row along actin — the Z-discs are pulled together, and the sarcomere shortens.
            </text>
            <text x="320" y="580" className="fill-ink-500 font-serif" fontSize="12.5" fontStyle="italic" textAnchor="middle">
              Stack a million sarcomeres end to end, and a whole muscle shortens.
            </text>
          </svg>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip>≈ 600 skeletal muscles</Chip>
            <Chip>≈ 40% of body mass is muscle</Chip>
            <Chip>Sarcomere: the contractile unit</Chip>
            <Chip>Biceps (red) shortens · triceps (terracotta) yields</Chip>
          </div>
        </div>
      }
      panel={
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
            Cross-bridge cycle · Step {step + 1} of 4 · {info.job}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{info.name}</h3>
          <p className="mt-1 font-serif text-sm italic text-ink-500">{info.latin}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>

          <div className="mt-5 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">
              Muscle under the cursor — {muscleInfo.name}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-800">
              <strong className="font-semibold">{muscleInfo.name}</strong>{' '}
              <span className="font-serif italic text-ink-500">({muscleInfo.latin})</span> — {muscleInfo.line}
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-wide text-ink-400">Origin</dt>
                <dd className="text-ink-800">{muscleInfo.origin}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-wide text-ink-400">Insertion</dt>
                <dd className="text-ink-800">{muscleInfo.insertion}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-wide text-ink-400">Action</dt>
                <dd className="text-ink-800">{muscleInfo.action}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-5 grid gap-4">
            <Meter label="Contraction right now — biceps shortening" value={Math.round(flex * 100)} tone="bg-arterial-500" />
            <Meter label="Skeletal muscle — share of body mass" value={40} tone="bg-primary-600" />
            <Meter label="Smooth + cardiac muscle — share of body mass" value={10} tone="bg-venous-500" />
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause curl' : '▶ Play curl'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => goStep(((step + MUSCLE_STEPS.length - 1) % MUSCLE_STEPS.length) as MuscleStepId)}>
                ← Prev step
              </Button>
              <Button size="sm" variant="secondary" onClick={() => goStep(((step + 1) % MUSCLE_STEPS.length) as MuscleStepId)}>
                Next step →
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Curl pace">
              {(
                [
                  ['slow', 'Slow curl'],
                  ['fast', 'Fast reps'],
                ] as const
              ).map(([p, label]) => (
                <Button key={p} size="sm" variant={pace === p ? 'primary' : 'secondary'} onClick={() => { setPace(p); setPlaying(true) }}>
                  {label}
                </Button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Pick a muscle">
              {MUSCLE_ORDER.map((m) => (
                <Button key={m} size="sm" variant={muscle === m ? 'primary' : 'secondary'} onClick={() => setMuscle(m)}>
                  {MUSCLES[m].name}
                </Button>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{info.note}</p>
          </div>
        </div>
      }
    />
  )
}

export function GiTractLab() {
  const [station, setStation] = useState(0)
  const [playing, setPlaying] = useState(true)
  const info = GI_STATIONS[GI_ORDER[station]]
  const id = GI_ORDER[station]

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStation((s) => (s + 1) % GI_ORDER.length), 3400)
    return () => clearInterval(t)
  }, [playing])

  const seg = (active: boolean) => ({ opacity: active ? 1 : 0.32, transition: 'opacity 0.6s ease' })

  return (
    <LabShell
      diagram={
        <div>
          <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Animated diagram of a meal travelling through the digestive tract: mouth, esophagus, stomach, small intestine, large intestine, and rectum">
            {/* Liver + gallbladder — helper organs, always shown */}
            <g>
              <path d="M 350 212 C 420 196 500 200 545 224 C 560 234 556 252 536 258 C 480 268 400 266 360 252 C 344 244 342 222 350 212 Z" fill="#B4663F" stroke="#8A4A2E" strokeWidth={3} />
              <ellipse cx={428} cy={262} rx={17} ry={10} fill="#5F8F5A" stroke="#3F6B3A" strokeWidth={2.5} transform="rotate(-18 428 262)" />
              <text x={566} y={222} fontSize={15} fontWeight={700} fill="#8A4A2E">Liver</text>
              <path d="M560 218 C552 220 546 222 540 226" stroke="#8A4A2E" strokeWidth={2} fill="none" />
              <text x={452} y={290} fontSize={13} fontWeight={700} fill="#3F6B3A">Gallbladder</text>
              <path d="M448 282 C444 276 438 270 434 266" stroke="#3F6B3A" strokeWidth={2} fill="none" />
            </g>

            {/* Pancreas — behind the duodenum */}
            <g>
              <rect x={330} y={302} width={118} height={17} rx={8.5} fill="#E8C87A" stroke="#B89A4A" strokeWidth={2.5} transform="rotate(-7 389 310)" />
              <text x={458} y={316} fontSize={13} fontWeight={700} fill="#8A6A2E">Pancreas</text>
            </g>

            {/* Large intestine frame — green, drawn first so the coils sit inside it */}
            <g style={seg(id === 'large-intestine')}>
              <path d="M 690 514 V 198 A 16 16 0 0 0 674 182 H 362 A 16 16 0 0 0 346 198 V 452 C 346 496 318 512 302 530 L 298 548" fill="none" stroke="#7A9B5A" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 690 522 C 680 536 672 542 664 540" fill="none" stroke="#7A9B5A" strokeWidth={8} strokeLinecap="round" />
              <text x={716} y={336} fontSize={15} fontWeight={700} fill="#4E6B38">Large intestine</text>
              <text x={700} y={548} fontSize={13} fontWeight={700} fill="#4E6B38">Appendix</text>
              <text x={252} y={548} textAnchor="end" fontSize={15} fontWeight={700} fill="#43536A">Rectum</text>
              <path d="M256 544 C270 544 282 544 292 542" stroke="#43536A" strokeWidth={2} fill="none" />
            </g>

            {/* Small intestine coils */}
            <g style={seg(id === 'small-intestine')}>
              <path d="M 360 412 C 395 408 415 404 445 405 H 618 A 15 15 0 0 1 618 436 H 452 A 15 15 0 0 0 452 468 H 618 A 15 15 0 0 1 618 500 H 652 C 672 500 688 504 690 514" fill="none" stroke="#F2B8A0" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
              <text x={535} y={545} textAnchor="middle" fontSize={15} fontWeight={700} fill="#B6544A">Small intestine</text>
            </g>

            {/* Duodenum — the C-loop from stomach to coils */}
            <g style={seg(id === 'stomach' || id === 'small-intestine')}>
              <path d="M 295 326 C 340 330 375 345 385 375 C 390 395 380 408 360 412" fill="none" stroke="#F2B8A0" strokeWidth={26} strokeLinecap="round" />
            </g>

            {/* Stomach — churns when its stop is active */}
            <g style={seg(id === 'stomach')}>
              <g className={id === 'stomach' ? 'churn' : ''}>
                <path d="M 190 238 C 150 240 122 268 126 300 C 130 332 158 352 195 356 C 235 360 275 350 295 326 C 310 306 308 282 292 264 C 282 252 268 244 252 240 L 212 238 Z" fill="#F6C6BB" stroke="#B6544A" strokeWidth={3} />
                <path d="M 150 290 C 170 310 200 322 235 318" fill="none" stroke="#B6544A" strokeWidth={3} strokeLinecap="round" opacity={0.45} />
              </g>
              <text x={215} y={392} textAnchor="middle" fontSize={15} fontWeight={700} fill="#B6544A">Stomach</text>
            </g>

            {/* Esophagus */}
            <g style={seg(id === 'esophagus')}>
              <rect x={168} y={88} width={44} height={150} rx={20} fill="#F3E3D3" stroke="#D9AE94" strokeWidth={3} />
              <text x={140} y={170} textAnchor="end" fontSize={15} fontWeight={700} fill="#8A6A54">Esophagus</text>
              <path d="M144 166 C154 166 160 166 164 166" stroke="#8A6A54" strokeWidth={2} fill="none" />
              {/* peristalsis rings travelling down while the esophagus stop is active */}
              {id === 'esophagus' && playing && (
                <>
                  <ellipse rx={24} ry={6} fill="none" stroke="#B6544A" strokeWidth={3} opacity={0.85}>
                    <animateMotion dur="1.6s" repeatCount="indefinite" path="M 190 96 V 230" />
                  </ellipse>
                  <ellipse rx={24} ry={6} fill="none" stroke="#B6544A" strokeWidth={3} opacity={0.85}>
                    <animateMotion dur="1.6s" begin="0.8s" repeatCount="indefinite" path="M 190 96 V 230" />
                  </ellipse>
                </>
              )}
            </g>

            {/* Mouth */}
            <g style={seg(id === 'mouth')}>
              <ellipse cx={190} cy={62} rx={58} ry={26} fill="#E8B4A0" stroke="#B0574F" strokeWidth={3} />
              <ellipse cx={190} cy={70} rx={34} ry={10} fill="#D97B6C" />
              <path d="M 152 58 H 228" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
              <text x={190} y={20} textAnchor="middle" fontSize={15} fontWeight={700} fill="#8A4A3D">Mouth</text>
            </g>

            {/* Nutrient absorption dots in the small intestine */}
            {id === 'small-intestine' && playing && (
              <g fill="#0E7C86">
                {[
                  [480, 405, 0], [560, 437, 0.5], [500, 469, 1], [600, 500, 1.5], [520, 405, 2], [580, 469, 2.5],
                ].map(([cx, cy, begin], i) => (
                  <circle key={i} cx={cx} cy={cy} r={4.5} opacity={0}>
                    <animate attributeName="opacity" values="0;1;0" dur="3s" begin={`${begin}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" values={`${cy};${(cy as number) + 14}`} dur="3s" begin={`${begin}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </g>
            )}

            {/* Water reclamation droplets leaving the colon wall */}
            {id === 'large-intestine' && playing && (
              <g fill="#5F83C2">
                <circle r={4.5}>
                  <animateMotion dur="2.2s" repeatCount="indefinite" path="M 706 260 H 736" />
                  <animate attributeName="opacity" values="1;0.2" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle r={4.5}>
                  <animateMotion dur="2.2s" begin="0.7s" repeatCount="indefinite" path="M 706 380 H 736" />
                  <animate attributeName="opacity" values="1;0.2" dur="2.2s" begin="0.7s" repeatCount="indefinite" />
                </circle>
                <circle r={4.5}>
                  <animateMotion dur="2.2s" begin="1.4s" repeatCount="indefinite" path="M 520 166 V 140" />
                  <animate attributeName="opacity" values="1;0.2" dur="2.2s" begin="1.4s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* The travelling bolus */}
            <circle cx={190} cy={62} r={8} fill="#D64545" stroke="#fff" strokeWidth={2} opacity={0.9}>
              {playing && <animateMotion dur="9s" repeatCount="indefinite" path={BOLUS_PATH} />}
            </circle>

            {/* Station hotspots */}
            {GI_ORDER.map((sid, i) => {
              const s = GI_STATIONS[sid]
              const isActive = station === i
              return (
                <g key={sid} onClick={() => { setStation(i); setPlaying(false) }} className="cursor-pointer">
                  {isActive && <circle cx={s.dot.x} cy={s.dot.y} r={13} fill="none" stroke="#0E7C86" strokeWidth={2.5} className="ping-ring" />}
                  <circle cx={s.dot.x} cy={s.dot.y} r={isActive ? 11 : 8} fill={isActive ? '#0E7C86' : '#16222E'} stroke="#fff" strokeWidth={2.5} />
                </g>
              )
            })}

          </svg>

          {/* Station timeline */}
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {GI_ORDER.map((sid, i) => (
              <button
                key={sid}
                onClick={() => {
                  setStation(i)
                  setPlaying(false)
                }}
                aria-pressed={station === i}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  station === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="block font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">Stop {i + 1}</span>
                <span className="mt-0.5 block font-display text-[0.9rem] font-bold leading-tight text-ink-950">{GI_STATIONS[sid].name}</span>
              </button>
            ))}
          </div>
        </div>
      }
      panel={
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
            Stop {station + 1} of 6 · {info.job}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{info.name}</h3>
          <p className="mt-1 font-serif text-sm italic text-ink-500">{info.latin}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>{info.ph}</Chip>
            <Chip>Length {info.length}</Chip>
            <Chip>Stays {info.transit}</Chip>
          </div>

          <div className="mt-6 grid gap-4">
            <Meter label="Share of the whole journey's time" value={info.timeShare} tone="bg-amber-500" />
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause journey' : '▶ Play journey'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStation((s) => (s + GI_ORDER.length - 1) % GI_ORDER.length); setPlaying(false) }}>
                ← Prev stop
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStation((s) => (s + 1) % GI_ORDER.length); setPlaying(false) }}>
                Next stop →
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{info.note}</p>
          </div>
        </div>
      }
    />
  )
}

/* ============================ Brain: lobes & landmarks ============================ */

type BrainStepId = 'touch' | 'relay' | 'feel' | 'move'

const BRAIN_STEPS: Record<
  BrainStepId,
  { name: string; latin: string; job: string; blurb: string; note: string; dot: { x: number; y: number } }
> = {
  touch: {
    name: 'Touch',
    latin: 'tactus',
    job: 'Receptors fire in the fingertip',
    blurb:
      'Touch a hot cup and the story starts far from the brain: pressure and temperature receptors in the fingertip fire, and the signal races up a sensory nerve into the spinal cord. Watch the dots climb the cord — a single touch becomes an electrical message travelling at up to 120 metres per second, on its way to a brain that has not felt anything yet.',
    note: 'Different receptors report different things — light touch, pressure, heat, pain — and each kind travels on its own kind of fibre, at its own speed.',
    dot: { x: 118, y: 500 },
  },
  relay: {
    name: 'Relay',
    latin: 'thalamus',
    job: 'The thalamus routes the signal',
    blurb:
      'Almost every sense passes through one small egg-shaped station deep in the middle of the brain: the thalamus. It is not a dead end but a switchboard — it sorts the incoming signal, sharpens it, and sends it on to exactly the patch of cortex that knows what to do with it. The dashed oval is the thalamus: you cannot see it from the outside, because it sits buried under the cortex.',
    note: 'Smell is the exception — it bypasses the thalamus and goes straight to the cortex. Everything else knocks on the thalamus first.',
    dot: { x: 540, y: 255 },
  },
  feel: {
    name: 'Feel',
    latin: 'cortex somatosensorius',
    job: 'The parietal lobe registers it',
    blurb:
      'The signal lands in a narrow strip of the parietal lobe just behind the central sulcus — the primary somatosensory cortex. This is where touch becomes feeling: the strip is a map of the body, and the fingertip has its own small patch on it. Neighbouring patches belong to the hand, the arm, the face — the map is distorted, with huge areas for the fingers and lips, because that is where the receptors are densest.',
    note: 'The strip is called the postcentral gyrus. Stroke it with a fingertip and the map lights up — that is why a neurosurgeon can wake a patient and ask what they feel.',
    dot: { x: 512, y: 175 },
  },
  move: {
    name: 'Move',
    latin: 'cortex motorius',
    job: 'The frontal lobe answers',
    blurb:
      'Feeling it is only half the job. A matching strip on the frontal side of the central sulcus — the primary motor cortex — fires, and the command races back down: through the brainstem, down the spinal cord, out to the muscles of the hand. The hand pulls away from the cup. Touch in, movement out — the whole loop, fingertip to cortex and back, in a fraction of a second.',
    note: 'The motor strip is the mirror of the sensory strip: a body map again, with the same oversized hands and face. Damage here paralyses the matching body part.',
    dot: { x: 488, y: 172 },
  },
}

const BRAIN_ORDER: BrainStepId[] = ['touch', 'relay', 'feel', 'move']

/* Signal routes: fingertip → cord → brainstem → thalamus → sensory cortex →
 * motor cortex → back down to the hand. The drawn cord and brainstem follow
 * the same geometry. */
const CORD_PATH = 'M 118 500 C 220 522 380 528 470 520 C 500 516 516 515 528 514'
const STEM_PATH = 'M 528 460 C 530 410 532 355 534 300'
const THALAMUS_TO_SENSORY = 'M 566 240 C 590 215 575 185 540 172 C 530 168 520 168 512 172'
const MOTOR_TO_HAND = 'M 490 168 C 510 250 528 360 526 470 C 524 505 400 525 250 520 C 190 518 140 510 118 500'

type BrainLobeId = 'frontal' | 'parietal' | 'temporal' | 'occipital' | 'cerebellum' | 'brainstem'

const BRAIN_LOBES: Record<
  BrainLobeId,
  { name: string; latin: string; job: string; line: string }
> = {
  frontal: {
    name: 'Frontal lobe',
    latin: 'lobus frontalis',
    job: 'Planning, deciding, moving',
    line: 'The biggest lobe: the motor strip that moves the body, Broca’s area for speech, and the prefrontal cortex — the part that plans, judges, and holds back.',
  },
  parietal: {
    name: 'Parietal lobe',
    latin: 'lobus parietalis',
    job: 'Feeling where things are',
    line: 'The sensory strip that feels touch, temperature, and pain — plus the maps that tell you where your limbs are without looking.',
  },
  temporal: {
    name: 'Temporal lobe',
    latin: 'lobus temporalis',
    job: 'Hearing and remembering',
    line: 'The auditory cortex that hears, Wernicke’s area that understands words — and, buried deep inside, the hippocampus that lays down new memories.',
  },
  occipital: {
    name: 'Occipital lobe',
    latin: 'lobus occipitalis',
    job: 'Seeing',
    line: 'The smallest lobe, and almost entirely visual: the primary visual cortex at the very back turns the retina’s signals into the world you see.',
  },
  cerebellum: {
    name: 'Cerebellum',
    latin: 'cerebellum',
    job: 'Smooth, coordinated movement',
    line: 'The “little brain” tucked under the occipital lobe: it does not start movements, it polishes them — timing, balance, and the smoothness you only notice when it is gone.',
  },
  brainstem: {
    name: 'Brainstem',
    latin: 'truncus encephali',
    job: 'The vital switchboard',
    line: 'Midbrain, pons, and medulla: every signal between brain and body passes through here, and it runs the jobs you cannot stop — breathing, heartbeat, swallowing.',
  },
}

const BRAIN_LOBE_ORDER: BrainLobeId[] = ['frontal', 'parietal', 'temporal', 'occipital', 'cerebellum', 'brainstem']

/* Lobe regions, drawn in a lateral view of the left hemisphere — face to
 * the left, occipital pole to the right. Clipped to the cerebrum outline. */
const CEREBRUM_PATH =
  'M 210 335 C 185 260 205 170 280 130 C 370 85 520 78 620 105 C 710 130 765 190 758 260 C 752 315 720 345 660 358 C 540 378 340 380 250 360 C 225 354 215 348 210 335 Z'

const BRAIN_LOBE_PATHS: Record<BrainLobeId, { d: string; fill: string }> = {
  frontal: {
    d: 'M 190 80 L 528 80 C 512 170 492 250 462 308 L 205 308 C 190 240 188 160 190 80 Z',
    fill: '#F0D3C2',
  },
  parietal: {
    d: 'M 528 80 L 652 85 C 662 150 668 230 660 308 L 462 308 C 492 250 512 170 528 80 Z',
    fill: '#EADFC6',
  },
  occipital: {
    d: 'M 652 85 L 775 125 C 785 200 770 280 725 335 L 660 308 C 668 230 662 150 652 85 Z',
    fill: '#E2D2DD',
  },
  temporal: {
    d: 'M 205 308 L 690 308 C 685 340 640 362 540 370 C 420 378 300 372 250 360 C 225 354 212 335 205 308 Z',
    fill: '#D5DFCE',
  },
  cerebellum: {
    d: 'M 630 388 C 630 368 660 356 695 358 C 735 360 760 378 758 403 C 756 428 730 446 690 446 C 655 446 632 428 630 388 Z',
    fill: '#DCC9B4',
  },
  brainstem: {
    d: 'M 498 370 C 490 402 496 428 510 444 C 512 468 513 492 514 514 L 542 514 C 543 490 544 466 544 450 C 554 442 556 424 550 404 C 544 386 538 374 532 368 Z',
    fill: '#CDBB9E',
  },
}

export function BrainLab({ bare = false }: { bare?: boolean }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [lobe, setLobe] = useState<BrainLobeId>('frontal')
  const info = BRAIN_STEPS[BRAIN_ORDER[step]]
  const id = BRAIN_ORDER[step]
  const lobeInfo = BRAIN_LOBES[lobe]

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStep((s) => (s + 1) % BRAIN_ORDER.length), 4200)
    return () => clearInterval(t)
  }, [playing])

  const seg = (active: boolean) => ({ opacity: active ? 1 : 0.32, transition: 'opacity 0.6s ease' })

  const dots = (path: string, color: string, n = 3) =>
    Array.from({ length: n }, (_, i) => (
      <circle key={i} r={5} fill={color}>
        <animateMotion dur="2.2s" begin={`${i * 0.7}s`} repeatCount="indefinite" path={path} />
      </circle>
    ))

  return (
    <LabShell
      bare={bare}
      diagram={
        <div>
          <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Animated diagram of the brain in lateral view: four lobes, cerebellum and brainstem, with a touch signal travelling from the fingertip to the cortex and back">
            <defs>
              <clipPath id="brain-clip">
                <path d={CEREBRUM_PATH} />
              </clipPath>
            </defs>

            {/* Cerebrum — the four lobes, clickable */}
            <g clipPath="url(#brain-clip)">
              {(Object.keys(BRAIN_LOBE_PATHS) as BrainLobeId[])
                .filter((lid) => lid !== 'cerebellum' && lid !== 'brainstem')
                .map((lid) => (
                  <path
                    key={lid}
                    d={BRAIN_LOBE_PATHS[lid].d}
                    fill={BRAIN_LOBE_PATHS[lid].fill}
                    stroke={lobe === lid ? '#0E7C86' : '#16222E'}
                    strokeWidth={lobe === lid ? 3.5 : 1.5}
                    strokeOpacity={lobe === lid ? 1 : 0.22}
                    className="cursor-pointer"
                    onClick={() => setLobe(lid)}
                  >
                    <title>{BRAIN_LOBES[lid].name}</title>
                  </path>
                ))}
              {/* Gyri — a few folds sketched inside each lobe */}
              <g fill="none" stroke="#16222E" strokeWidth={2} opacity={0.28} strokeLinecap="round">
                <path d="M 260 150 C 300 170 330 160 360 180" />
                <path d="M 250 220 C 290 240 330 225 365 245" />
                <path d="M 400 130 C 430 155 450 140 470 165" />
                <path d="M 545 140 C 575 165 600 150 625 175" />
                <path d="M 560 230 C 590 250 615 235 640 255" />
                <path d="M 680 160 C 700 185 715 170 730 195" />
                <path d="M 300 330 C 340 345 380 332 420 345" />
                <path d="M 480 335 C 520 348 560 335 600 348" />
              </g>
              {/* Thalamus — deep inside, shown dashed because it is buried */}
              <g style={seg(id === 'relay')}>
                <ellipse cx={540} cy={255} rx={52} ry={34} fill="#5F83C2" fillOpacity={0.25} stroke="#4D6EA3" strokeWidth={2.5} strokeDasharray="7 5" />
              </g>
              {/* Sensory strip (postcentral gyrus) — lights up on the Feel step */}
              <path
                d="M 522 100 C 512 170 500 250 486 302 L 510 304 C 524 250 534 170 544 100 Z"
                fill="#0E7C86"
                opacity={id === 'feel' ? 0.55 : 0}
                style={{ transition: 'opacity 0.6s ease' }}
              />
              {/* Motor strip (precentral gyrus) — lights up on the Move step */}
              <path
                d="M 500 100 C 488 170 478 250 462 300 L 486 302 C 500 250 512 170 522 100 Z"
                fill="#B93327"
                opacity={id === 'move' ? 0.55 : 0}
                style={{ transition: 'opacity 0.6s ease' }}
              />
            </g>
            <path d={CEREBRUM_PATH} fill="none" stroke="#16222E" strokeWidth={3} />

            {/* Sulci — the landmarks that draw the lobe borders */}
            <g fill="none" stroke="#16222E" strokeWidth={2.5} opacity={0.6} strokeLinecap="round">
              <path d="M 520 92 C 505 170 488 250 468 305" />
              <path d="M 212 300 C 320 292 420 296 470 302 C 540 308 620 306 688 302" />
              <path d="M 652 88 C 660 150 664 200 662 240" />
            </g>

            {/* Cerebellum + brainstem — clickable, below the cerebrum */}
            {(['cerebellum', 'brainstem'] as const).map((lid) => (
              <path
                key={lid}
                d={BRAIN_LOBE_PATHS[lid].d}
                fill={BRAIN_LOBE_PATHS[lid].fill}
                stroke={lobe === lid ? '#0E7C86' : '#16222E'}
                strokeWidth={lobe === lid ? 3.5 : 2.5}
                strokeOpacity={lobe === lid ? 1 : 0.5}
                className="cursor-pointer"
                onClick={() => setLobe(lid)}
              >
                <title>{BRAIN_LOBES[lid].name}</title>
              </path>
            ))}
            {/* Cerebellar folia — the fine parallel stripes */}
            <g fill="none" stroke="#8A6A4A" strokeWidth={2} opacity={0.55} strokeLinecap="round">
              <path d="M 645 380 C 680 372 720 374 748 384" />
              <path d="M 638 398 C 675 390 720 392 752 400" />
              <path d="M 640 416 C 678 408 718 410 748 418" />
              <path d="M 650 433 C 682 426 714 428 738 434" />
            </g>

            {/* Spinal cord — the signal's road in and out */}
            <path d={CORD_PATH} fill="none" stroke="#5F83C2" strokeWidth={14} strokeLinecap="round" opacity={0.85} />
            <path d={CORD_PATH} fill="none" stroke="#4D6EA3" strokeWidth={2} strokeDasharray="4 8" opacity={0.7} />

            {/* Fingertip — where the journey starts and ends */}
            <g style={seg(id === 'touch' || id === 'move')}>
              <circle cx={118} cy={500} r={17} fill="#F2B8A0" stroke="#B6544A" strokeWidth={2.5} />
              {(id === 'move' || id === 'touch') && playing && (
                <circle cx={118} cy={500} r={17} fill="none" stroke="#B6544A" strokeWidth={2} className="ping-ring" />
              )}
              <text x={118} y={545} textAnchor="middle" fontSize={13} fontWeight={700} fill="#B6544A">Fingertip</text>
            </g>

            {/* Signal dots — only the active leg of the journey moves */}
            {id === 'touch' && playing && dots(CORD_PATH, '#2B4A7A')}
            {id === 'relay' && playing && dots(STEM_PATH, '#2B4A7A')}
            {id === 'feel' && playing && dots(THALAMUS_TO_SENSORY, '#0E7C86')}
            {id === 'move' && playing && dots(MOTOR_TO_HAND, '#B93327')}

            {/* Lobe labels */}
            <g fontWeight={700} fill="#3D2E22" pointerEvents="none">
              <text x={330} y={180} fontSize={14}>Frontal lobe</text>
              <text x={575} y={180} fontSize={14}>Parietal lobe</text>
              <text x={400} y={345} fontSize={14}>Temporal lobe</text>
              <text x={700} y={200} fontSize={13}>Occipital</text>
              <text x={700} y={216} fontSize={13}>lobe</text>
            </g>
            <g fontSize={11} fontWeight={700} fill="#5E4A33" pointerEvents="none">
              <text x={648} y={468}>Cerebellum</text>
              <text x={560} y={480}>Brainstem</text>
              <text x={545} y={122}>Central sulcus</text>
              <text x={270} y={288}>Lateral sulcus</text>
            </g>
            <g style={seg(id === 'relay')}>
              <text x={600} y={252} fontSize={12} fontWeight={700} fill="#4D6EA3">Thalamus</text>
              <path d="M 596 250 L 590 252" stroke="#4D6EA3" strokeWidth={1.5} />
            </g>

            {/* Step hotspots */}
            {BRAIN_ORDER.map((sid, i) => {
              const s = BRAIN_STEPS[sid]
              const isActive = step === i
              return (
                <g key={sid} onClick={() => { setStep(i); setPlaying(false) }} className="cursor-pointer">
                  {isActive && <circle cx={s.dot.x} cy={s.dot.y} r={14} fill="none" stroke="#0E7C86" strokeWidth={2.5} className="ping-ring" />}
                  <circle cx={s.dot.x} cy={s.dot.y} r={isActive ? 11 : 8} fill={isActive ? '#0E7C86' : '#16222E'} stroke="#fff" strokeWidth={2.5} />
                </g>
              )
            })}
          </svg>

          {/* Lobe picker */}
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BRAIN_LOBE_ORDER.map((lid) => (
              <button
                key={lid}
                onClick={() => setLobe(lid)}
                aria-pressed={lobe === lid}
                className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                  lobe === lid ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="block font-display text-[0.9rem] font-bold leading-tight text-ink-950">{BRAIN_LOBES[lid].name}</span>
                <span className="mt-0.5 block font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">{BRAIN_LOBES[lid].job}</span>
              </button>
            ))}
          </div>
        </div>
      }
      panel={
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
            Step {step + 1} of 4 · {info.job}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{info.name}</h3>
          <p className="mt-1 font-serif text-sm italic text-ink-500">{info.latin}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>

          <div className="mt-5 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">
              Landmark under the cursor — {lobeInfo.name}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-800">
              <strong className="font-semibold">{lobeInfo.name}</strong>{' '}
              <span className="font-serif italic text-ink-500">({lobeInfo.latin})</span> — {lobeInfo.line}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>≈ 86 billion neurons</Chip>
            <Chip>≈ 1.4 kg — about 2% of body mass</Chip>
            <Chip>≈ 20% of the body’s energy</Chip>
          </div>

          <div className="mt-6 grid gap-4">
            <Meter label="Share of the body’s energy the brain uses" value={20} tone="bg-primary-600" />
            <Meter label="Brain mass that is cortex" value={80} tone="bg-venous-500" />
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause signal' : '▶ Play signal'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStep((s) => (s + BRAIN_ORDER.length - 1) % BRAIN_ORDER.length); setPlaying(false) }}>
                ← Prev step
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStep((s) => (s + 1) % BRAIN_ORDER.length); setPlaying(false) }}>
                Next step →
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{info.note}</p>
          </div>
        </div>
      }
    />
  )
}

/* ===================== Operation case: cholecystectomy ===================== */

const CHOL_STAGES: CaseStage[] = [
  {
    time: '14:20',
    title: 'The pain that would not stop',
    text: 'A 46-year-old woman arrives at the emergency department. For months she has had attacks of pain under her right ribs after fatty meals — gripping and miserable, but always gone within the hour: biliary colic. This time the pain started 18 hours ago and never left. It is constant now, she has a fever of 38.4 °C, and she has vomited twice.',
  },
  {
    time: '14:50',
    title: 'Hands on the right upper quadrant',
    text: 'Her right upper quadrant is tender under the ribs. The examiner slides a hand under the right costal margin and asks her to breathe in deeply: as the liver and gallbladder descend onto the hand, she catches her breath and stops mid-breath — Murphy’s sign. An inflamed gallbladder announces itself the moment it is touched.',
  },
  {
    time: '16:05',
    title: 'Scans and bloods',
    text: 'Bloods: white cell count 13.6, CRP 118 — systemic inflammation in full swing. Ultrasound: multiple gallstones, the gallbladder wall thickened to 5 mm, a rim of fluid around the gallbladder, and pressing the probe over it reproduces her pain (sonographic Murphy positive). Local signs, systemic signs, imaging — the Tokyo Guidelines criteria for acute cholecystitis are met in all three groups.',
  },
  {
    time: '17:30',
    title: 'The decision',
    text: 'This is no longer simple colic: a stone is impacted in the cystic duct and the gallbladder wall is inflamed. She is 46 and otherwise fit. The call is yours:',
  },
  {
    time: '19:10',
    title: 'In theatre: cholecystectomy',
    text: 'Under general anaesthesia, laparoscopically — camera and instruments through small ports. In this operation the danger is not the clock but identity: the anatomy around the gallbladder can deceive, and clipping the wrong duct is the classic catastrophe. Step through it:',
  },
  {
    time: 'Day 2',
    title: 'Recovery',
    text: 'She eats the next morning and goes home on day two with four small dressings. Pathology: gallstones with acute-on-chronic cholecystitis — today’s flare on top of months of irritation. The medium case is won by identification, not speed: everything that was divided had first been proven to be what it claimed to be.',
  },
]

const CHOL_OP_STEPS: { title: string; text: string }[] = [
  { title: 'Ports in, fundus lifted', text: 'Four small ports: a camera at the umbilicus and working ports under the right ribs. The fundus — the rounded bottom of the gallbladder — is grasped and lifted up over the liver, opening the view of everything underneath it.' },
  { title: 'Retract and open Calot’s triangle', text: 'The neck of the gallbladder is pulled down and out, and the peritoneum over Calot’s triangle (the hepatocystic triangle) is opened. Inside and around the triangle run the cystic duct and the cystic artery — and, dangerously nearby, the common bile duct, which must not be touched.' },
  { title: 'Achieve the Critical View of Safety', text: 'The safety ritual, completed before anything is clipped: the triangle is cleared of fat and fibrous tissue, the lower part of the gallbladder is separated from the liver bed, and the surgeon must see exactly two structures entering the gallbladder — the cystic duct and the cystic artery. If that view cannot be achieved, the safe move is to stop, convert, or drain. Never to guess.' },
  { title: 'Clip and divide the cystic duct and artery', text: 'Only now: clips are placed across the cystic duct and the cystic artery, and both are divided between clips. What is clipped has been proven — by the Critical View — to belong to the gallbladder alone.' },
  { title: 'Off the liver bed, out in a bag', text: 'The gallbladder is dissected off its bed on the liver, placed in a retrieval bag so no stones can spill, and removed through a port. The bed and the clips are checked: no bile leak, no bleeding.' },
]

const CHOL_DECISIONS: { label: string; ok: boolean; feedback: string }[] = [
  {
    label: 'Send her home with antispasmodics',
    ok: false,
    feedback: 'That was the right answer for her old attacks — it is the wrong one now. Colic settles within hours and leaves no inflammation behind; this pain has lasted 18 hours with fever and a CRP of 118. The gallbladder is inflamed, not merely squeezing, and sending her home risks it perforating or turning gangrenous.',
  },
  {
    label: 'Antibiotics alone, book elective surgery in six weeks',
    ok: false,
    feedback: 'Understandable, but not the standard for a fit patient. Antibiotics will probably calm this episode — yet the stone that caused it stays in place, attacks recur, and the delayed operation is often harder, dissected through scarred and inflamed tissue. The guidelines favour early laparoscopic cholecystectomy during this same admission.',
  },
  {
    label: 'IV antibiotics, consent, early laparoscopic cholecystectomy',
    ok: true,
    feedback: 'Correct. IV fluids and antibiotics now, consent that names the specific risk of this operation — injury to the bile duct — and the definitive operation during this admission, while the anatomy is still readable.',
  },
]

export function CholecystectomyCaseLab() {
  const [stage, setStage] = useState(0)
  const [opStep, setOpStep] = useState(0)
  const [decision, setDecision] = useState<number | null>(null)

  const inTheatre = stage === 4
  const removed = stage === 5 || (inTheatre && opStep >= 4)
  const lifted = inTheatre && opStep >= 1 && !removed
  const clipsShown = inTheatre && opStep >= 3 && !removed

  const gbFill = stage <= 0 ? '#7FA85C' : stage === 1 ? '#5E8F43' : '#B84A3E'
  const gbWall = stage >= 2 ? 6 : 3

  return (
    <LabShell
      diagram={
        <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Case diagram of an abdomen with the liver and an inflamed gallbladder tucked under its right lobe">
          {/* Abdomen */}
          <path
            d="M500 40 C660 40 742 150 742 285 C742 420 652 522 500 522 C348 522 258 420 258 285 C258 150 340 40 500 40 Z"
            fill="#F3D9C8"
            stroke="#D9AE94"
            strokeWidth={3}
          />
          {/* Intestine hint */}
          <path d="M340 452 C420 428 520 452 600 430" fill="none" stroke="#E3B7A6" strokeWidth={17} strokeLinecap="round" opacity={0.6} />

          {/* Umbilicus */}
          <circle cx={500} cy={300} r={9} fill="#D9AE94" />
          <text x={478} y={294} textAnchor="end" fontSize={16} fontWeight={700} fill="#8A6A54">Umbilicus</text>

          {/* Liver — patient's right lobe is on the viewer's left */}
          <path
            d="M302 208 C298 148 362 112 468 106 C584 100 692 128 701 182 C706 214 688 240 632 250 C548 264 396 262 338 242 C314 234 303 224 302 208 Z"
            fill="#9C4A3C"
            stroke="#7C3628"
            strokeWidth={3}
          />
          <text x={500} y={178} textAnchor="middle" fontSize={19} fontWeight={700} fill="#F3D9C8">Liver</text>

          {/* Bile ducts — cystic duct joins the common bile duct toward the midline */}
          {!removed && (
            <g>
              <path d="M470 205 C475 232 470 250 462 262 C472 284 480 306 486 330" fill="none" stroke="#C9A86A" strokeWidth={8} strokeLinecap="round" />
              <path d="M400 240 C420 247 442 254 462 262" fill="none" stroke="#C9A86A" strokeWidth={7} strokeLinecap="round" />
            </g>
          )}
          {removed && (
            <path d="M470 205 C475 232 470 250 462 262 C472 284 480 306 486 330" fill="none" stroke="#C9A86A" strokeWidth={8} strokeLinecap="round" />
          )}
          <text x={610} y={240} fontSize={17} fontWeight={700} fill="#8A6D2F">Cystic duct</text>
          <path d="M606 244 C556 250 502 254 468 260" stroke="#8A6D2F" strokeWidth={2.5} fill="none" />
          <text x={610} y={302} fontSize={17} fontWeight={700} fill="#8A6D2F">Common bile duct</text>
          <path d="M606 298 C560 294 520 292 492 294" stroke="#8A6D2F" strokeWidth={2.5} fill="none" />

          {/* Cystic artery — theatre view only */}
          {inTheatre && !removed && (
            <path d="M404 248 C424 254 440 259 456 265" fill="none" stroke="#C22F27" strokeWidth={3.5} strokeLinecap="round" />
          )}

          {/* Clips — placed only after the Critical View of Safety */}
          {clipsShown && (
            <g>
              <rect x={412} y={238} width={16} height={8} rx={2} fill="#43536A" transform="rotate(24 420 242)" />
              <rect x={427} y={245} width={16} height={8} rx={2} fill="#43536A" transform="rotate(24 435 249)" />
              <rect x={419} y={253} width={14} height={7} rx={2} fill="#43536A" transform="rotate(24 426 256)" />
              <text x={452} y={226} fontSize={15} fontWeight={700} fill="#43536A">Clips</text>
            </g>
          )}

          {/* Gallbladder — pear tucked under the liver's right lobe (viewer's left) */}
          {!removed && (
            <g transform={lifted ? 'translate(-6 -12) rotate(-16 400 250)' : undefined} style={{ transition: 'transform 0.7s ease' }}>
              <path
                d="M400 236 C384 240 372 256 372 278 C372 300 384 316 400 316 C416 316 428 300 428 278 C428 256 416 240 400 236 Z"
                fill={gbFill}
                stroke="#5E4A2A"
                strokeWidth={gbWall}
                style={{ transition: 'fill 0.6s ease, stroke-width 0.6s ease' }}
              />
              <circle cx={392} cy={292} r={6} fill="#E9DB9E" stroke="#B49B4A" strokeWidth={1.5} />
              <circle cx={408} cy={298} r={5} fill="#E9DB9E" stroke="#B49B4A" strokeWidth={1.5} />
              <circle cx={400} cy={280} r={4.5} fill="#E9DB9E" stroke="#B49B4A" strokeWidth={1.5} />
            </g>
          )}
          {removed && (
            <>
              {/* Empty gallbladder fossa */}
              <ellipse cx={400} cy={272} rx={34} ry={14} fill="#E8C8B4" stroke="#C08A76" strokeWidth={2.5} strokeDasharray="5 4" />
              {/* Specimen in its retrieval bag */}
              <g>
                <rect x={648} y={396} width={264} height={112} rx={14} fill="#E8EDF2" stroke="#B9C4CF" strokeWidth={2.5} />
                <path d="M780 430 C768 434 760 446 760 460 C760 476 768 486 780 486 C792 486 800 476 800 460 C800 446 792 434 780 430 Z" fill="#B84A3E" stroke="#8C352A" strokeWidth={3} />
                <circle cx={774} cy={464} r={4.5} fill="#E9DB9E" stroke="#B49B4A" strokeWidth={1.2} />
                <circle cx={788} cy={470} r={3.8} fill="#E9DB9E" stroke="#B49B4A" strokeWidth={1.2} />
                <text x={780} y={420} textAnchor="middle" fontSize={16} fontWeight={700} fill="#43536A">Specimen → pathology</text>
              </g>
            </>
          )}
          <text x={212} y={292} fontSize={17} fontWeight={700} fill="#5E7A3A">{removed ? 'Gallbladder fossa' : 'Gallbladder'}</text>
          <path d="M292 288 C320 286 348 284 368 282" stroke="#5E7A3A" strokeWidth={2.5} fill="none" />

          {/* Pain marker */}
          {stage <= 1 && (
            <g>
              <circle cx={400} cy={285} r={15} fill="none" stroke="#C22F27" strokeWidth={3} className="ping-ring" />
              <circle cx={400} cy={285} r={6} fill="#C22F27" />
              <text x={560} y={356} textAnchor="middle" fontSize={16} fontWeight={700} fill="#C22F27">
                {stage === 0 ? 'Pain under the right ribs' : 'Murphy’s sign — the breath catches'}
              </text>
            </g>
          )}

          {/* Laparoscopic ports */}
          {inTheatre && (
            <g opacity={opStep >= 4 ? 0 : 1} style={{ transition: 'opacity 0.6s ease' }}>
              <circle cx={500} cy={300} r={11} fill="#43536A" stroke="#fff" strokeWidth={3} />
              <circle cx={352} cy={330} r={11} fill="#43536A" stroke="#fff" strokeWidth={3} />
              <circle cx={322} cy={405} r={11} fill="#43536A" stroke="#fff" strokeWidth={3} />
              <text x={258} y={452} fontSize={16} fontWeight={700} fill="#43536A">Ports</text>
            </g>
          )}
          {inTheatre && opStep >= 4 && (
            <g>
              <rect x={486} y={286} width={28} height={28} rx={6} fill="#FFF7E8" stroke="#D9AE94" strokeWidth={2} />
              <rect x={338} y={316} width={28} height={28} rx={6} fill="#FFF7E8" stroke="#D9AE94" strokeWidth={2} />
              <rect x={308} y={391} width={28} height={28} rx={6} fill="#FFF7E8" stroke="#D9AE94" strokeWidth={2} />
            </g>
          )}

          {/* Stage caption */}
          <text x={500} y={548} textAnchor="middle" fontSize={16} fill="#5A6B80">
            {stage === 0 && 'Biliary colic for months — but this attack has lasted 18 hours and brought fever'}
            {stage === 1 && 'Murphy’s sign: the descending gallbladder meets the examiner’s hand, and the breath stops'}
            {stage === 2 && 'Stones, a 5 mm wall, fluid around the gallbladder — acute cholecystitis'}
            {stage === 3 && 'Tokyo criteria met in all three groups — for a fit patient, early surgery is the standard'}
            {stage === 4 && CHOL_OP_STEPS[opStep].title}
            {stage === 5 && 'Gallbladder removed, bile duct untouched — home on day two'}
          </text>
        </svg>
      }
      panel={
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">
            Case 02 · Medium · Emergency department → theatre
          </p>

          <div className="mt-4 grid gap-2">
            {CHOL_STAGES.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setStage(i)}
                aria-pressed={stage === i}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  stage === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="font-display text-[0.95rem] font-bold text-ink-950">
                  <span className="mr-2 font-mono text-sm text-arterial-500">{s.time}</span>
                  {s.title}
                </span>
                {stage === i && <span className="mt-1 block text-sm leading-relaxed text-ink-700">{s.text}</span>}
              </button>
            ))}
          </div>

          {stage === 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip>Temp 38.4 °C</Chip>
              <Chip>HR 108</Chip>
              <Chip>BP 124/76</Chip>
              <Chip>RR 18</Chip>
              <Chip>SpO₂ 98%</Chip>
            </div>
          )}

          {stage === 2 && (
            <div className="mt-5">
              <Meter label="Tokyo criteria" value={100} tone="bg-amber-500" />
              <p className="mt-2 text-sm text-ink-500">3 of 3 groups — local signs, systemic inflammation, and imaging are all positive: definite acute cholecystitis.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip tone="closed">WBC 13.6 ↑</Chip>
                <Chip tone="closed">CRP 118 ↑</Chip>
                <Chip>US: stones, wall 5 mm, fluid</Chip>
              </div>
            </div>
          )}

          {stage === 3 && (
            <div className="mt-5 grid gap-2">
              {CHOL_DECISIONS.map((d, i) => (
                <button
                  key={d.label}
                  onClick={() => setDecision(i)}
                  aria-pressed={decision === i}
                  className={`rounded-xl border px-4 py-3 text-left font-display text-[0.92rem] font-bold transition-colors ${
                    decision === i
                      ? d.ok
                        ? 'border-success-500 bg-success-50 text-success-600'
                        : 'border-arterial-500 bg-arterial-50 text-arterial-600'
                      : 'border-line bg-surface text-ink-800 hover:border-primary-600/40'
                  }`}
                >
                  {d.label}
                </button>
              ))}
              {decision !== null && (
                <p className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${CHOL_DECISIONS[decision].ok ? 'bg-success-50 text-ink-800' : 'bg-arterial-50 text-ink-800'}`}>
                  {CHOL_DECISIONS[decision].feedback}
                </p>
              )}
            </div>
          )}

          {inTheatre && (
            <div className="mt-5 grid gap-2">
              {CHOL_OP_STEPS.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setOpStep(i)}
                  aria-pressed={opStep === i}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    opStep === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                  }`}
                >
                  <span className="font-display text-[0.92rem] font-bold text-ink-950">
                    <span className="mr-2 font-mono text-sm text-arterial-500">{i + 1}</span>
                    {s.title}
                  </span>
                  {opStep === i && <span className="mt-1 block text-sm leading-relaxed text-ink-700">{s.text}</span>}
                </button>
              ))}
            </div>
          )}

          {stage === 5 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip tone="open">Eating: day 1</Chip>
              <Chip tone="open">Home: day 2</Chip>
              <Chip tone="open">Pathology: acute-on-chronic cholecystitis ✓</Chip>
            </div>
          )}
        </div>
      }
    />
  )
}

/* ===================== Neurons and the synapse ===================== */

type NeuronPartId = 'dendrites' | 'soma' | 'nucleus' | 'hillock' | 'myelin' | 'node' | 'synapse'

const NEURON_PARTS: Record<
  NeuronPartId,
  { name: string; latin: string; line: string; dot: { x: number; y: number } }
> = {
  dendrites: {
    name: 'Dendrites',
    latin: 'dendritae',
    line: 'The listening branches. Each one collects small graded signals from the synapses of other neurons and carries them toward the soma — the more branches, the more conversations this neuron can join.',
    dot: { x: 185, y: 150 },
  },
  soma: {
    name: 'Soma (cell body)',
    latin: 'soma',
    line: 'The neuron’s home base. It holds the nucleus, makes the proteins, and adds up every signal the dendrites deliver — excitation minus inhibition — to decide whether to fire.',
    dot: { x: 320, y: 280 },
  },
  nucleus: {
    name: 'Nucleus',
    latin: 'nucleus',
    line: 'The control room inside the soma: the neuron’s DNA lives here, and it issues the instructions for the proteins that keep the cell signalling — including the ion channels that make the spike possible.',
    dot: { x: 320, y: 280 },
  },
  hillock: {
    name: 'Axon hillock',
    latin: 'colliculus axonis',
    line: 'The trigger zone. The summed signal reaches here, and if it crosses about −55 mV, the hillock fires an action potential — all or nothing. Below threshold, nothing happens at all.',
    dot: { x: 415, y: 280 },
  },
  myelin: {
    name: 'Myelin sheath',
    latin: 'vagina myelinica',
    line: 'Fatty insulation wrapped around the axon by Schwann cells (in the peripheral nervous system) or oligodendrocytes (in the brain and cord). It stops the signal leaking out, so the spike jumps — fast.',
    dot: { x: 610, y: 250 },
  },
  node: {
    name: 'Node of Ranvier',
    latin: 'nodus Ranvieri',
    line: 'The bare gap between two myelin segments, packed with voltage-gated sodium channels. The action potential is reborn here, node after node — saltatory conduction, the fastest way to send a signal.',
    dot: { x: 668, y: 280 },
  },
  synapse: {
    name: 'Synapse',
    latin: 'synapsis',
    line: 'The hand-off. When the spike reaches the terminal bouton, vesicles fuse and spill neurotransmitter into the cleft — a chemical message that opens channels on the next neuron. Neurons never touch; they whisper across a gap.',
    dot: { x: 930, y: 280 },
  },
}

const NEURON_ORDER: NeuronPartId[] = ['dendrites', 'soma', 'nucleus', 'hillock', 'myelin', 'node', 'synapse']

type NeuronStepId = 'receive' | 'sum' | 'fire' | 'travel' | 'release'

const NEURON_STEPS: Record<
  NeuronStepId,
  { name: string; job: string; latin: string; blurb: string; note: string; voltage: number; dot: { x: number; y: number } }
> = {
  receive: {
    name: 'Dendrites listen',
    job: 'Input',
    latin: 'dendritae audiunt',
    blurb:
      'Signals arrive from other neurons as tiny graded potentials — small rises and falls in voltage at the synapses on the dendrites. Each one alone is far too weak to fire the cell; they drift toward the soma, fading as they go.',
    note: 'Watch the dots: each one is a small graded potential travelling in from a dendrite tip. On their own they are whispers — the soma has to hear enough of them at once.',
    voltage: -66,
    dot: { x: 185, y: 150 },
  },
  sum: {
    name: 'The soma adds it up',
    job: 'Summation',
    latin: 'summatio',
    blurb:
      'In the soma, excitation and inhibition are summed. Signals arriving close together in time and space add up — this is temporal and spatial summation. The membrane voltage climbs toward the threshold of about −55 mV.',
    note: 'The voltage meter is climbing. If enough excitatory signals arrive together, the hillock will cross threshold — if they don’t, the potentials simply fade away and nothing happens.',
    voltage: -56,
    dot: { x: 320, y: 280 },
  },
  fire: {
    name: 'The spike fires',
    job: 'Action potential',
    latin: 'potentia actionis',
    blurb:
      'Threshold crossed. Voltage-gated sodium channels at the axon hillock fly open, sodium rushes in, and the membrane voltage shoots from −55 mV up to about +30 mV in a millisecond — an all-or-none spike, always the same size.',
    note: 'A bigger stimulus does not make a bigger spike — it makes more spikes, faster. The action potential is the neuron’s unit of currency, and it never changes value.',
    voltage: 30,
    dot: { x: 415, y: 280 },
  },
  travel: {
    name: 'Down the axon',
    job: 'Saltatory conduction',
    latin: 'conductio saltatoria',
    blurb:
      'The spike races down the axon. Where myelin insulates it, the signal cannot leak out — so it jumps from one node of Ranvier to the next, up to 100 metres per second. Strip the myelin away and the same spike crawls at about 1 m/s.',
    note: 'Toggle the myelin off and watch the dots crawl: without insulation the spike has to be rebuilt at every point along the axon. That is why demyelinating diseases slow everything down.',
    voltage: 30,
    dot: { x: 610, y: 280 },
  },
  release: {
    name: 'The synapse speaks',
    job: 'Chemical hand-off',
    latin: 'transmissio synaptica',
    blurb:
      'The spike reaches the terminal boutons, calcium rushes in, and vesicles fuse with the membrane, spilling neurotransmitter into the synaptic cleft. The chemical crosses the gap and opens channels on the next neuron — the signal is electrical again.',
    note: 'Neurons never touch. Every thought you have is a chain of these hand-offs: electricity, then chemistry, then electricity again, across a gap about 20 nanometres wide.',
    voltage: -70,
    dot: { x: 930, y: 280 },
  },
}

const NEURON_STEP_ORDER: NeuronStepId[] = ['receive', 'sum', 'fire', 'travel', 'release']

/* Dendrite branches (from the soma's left edge out to the tips) */
const DENDRITE_PATHS = [
  'M272 258 C230 220 205 185 185 150',
  'M268 280 C220 275 175 260 140 235',
  'M272 302 C235 335 205 360 178 395',
  'M268 318 C230 350 200 395 185 440',
  'M285 240 C260 195 240 150 228 105',
  'M288 325 C265 370 250 420 242 470',
]
const DENDRITE_TIPS = [
  [185, 150],
  [140, 235],
  [178, 395],
  [185, 440],
  [228, 105],
  [242, 470],
]
const RECEIVE_PATH = 'M185 150 C230 220 260 250 320 280'
const AXON_PATH = 'M430 280 H840'
const RELEASE_PATHS = ['M922 222 C945 228 960 240 972 252', 'M940 280 H972', 'M922 338 C945 332 960 320 972 308']
const NODE_X = [548, 668, 788]
const MYELIN_SEGMENTS: [number, number][] = [
  [438, 540],
  [556, 660],
  [676, 780],
  [796, 838],
]

export function NeuronLab({ bare = false }: { bare?: boolean }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [myelin, setMyelin] = useState(true)
  const [part, setPart] = useState<NeuronPartId>('dendrites')
  const id = NEURON_STEP_ORDER[step]
  const info = NEURON_STEPS[id]
  const partInfo = NEURON_PARTS[part]
  const voltagePct = Math.round(((info.voltage + 70) / 110) * 100)
  const travelDur = myelin ? 1.1 : 4.5

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStep((s) => (s + 1) % NEURON_STEP_ORDER.length), 4600)
    return () => clearInterval(t)
  }, [playing])

  const dots = (path: string, color: string, n = 3, dur = 2.4) =>
    Array.from({ length: n }, (_, i) => (
      <circle key={i} r={6} fill={color} stroke="#fff" strokeWidth={2}>
        <animateMotion dur={`${dur}s`} begin={`${i * (dur / n)}s`} repeatCount="indefinite" path={path} />
      </circle>
    ))

  const seg = (active: boolean) => ({ opacity: active ? 1 : 0.3, transition: 'opacity 0.6s ease' })

  return (
    <LabShell
      bare={bare}
      diagram={
        <div>
          <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Animated diagram of a neuron: a signal arrives at the dendrites, is summed in the soma, fires as an action potential at the axon hillock, jumps down the myelinated axon, and is released at the synapse">
            {/* Dendrites */}
            <g fill="none" stroke="#B6544A" strokeWidth={9} strokeLinecap="round" style={seg(id === 'receive' || part === 'dendrites')}>
              {DENDRITE_PATHS.map((d, i) => (
                <path key={i} d={d} strokeWidth={i < 2 ? 9 : 7} />
              ))}
            </g>
            <g fill="#B6544A" opacity={0.9} style={seg(id === 'receive')}>
              {DENDRITE_TIPS.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={5} />
              ))}
            </g>

            {/* Axon — the tube, drawn under the myelin */}
            <rect x={425} y={268} width={420} height={24} rx={12} fill="#F6D9B8" stroke="#B6544A" strokeWidth={3} />
            {/* Axon hillock — the taper from soma to axon */}
            <path d="M388 252 L432 268 L432 292 L388 308 Z" fill="#E9A98F" stroke="#B6544A" strokeWidth={3} />

            {/* Myelin sheath segments (or bare axon when toggled off) */}
            {myelin ? (
              <g style={seg(part === 'myelin' || id === 'travel')}>
                {MYELIN_SEGMENTS.map(([x0, x1], i) => (
                  <g key={i}>
                    <rect x={x0} y={256} width={x1 - x0} height={48} rx={22} fill="#B9D6D8" stroke="#0E7C86" strokeWidth={3} />
                    <path d={`M${x0 + 14} 262 v36 M${x0 + 30} 260 v40`} stroke="#0E7C86" strokeWidth={3} opacity={0.45} />
                  </g>
                ))}
              </g>
            ) : (
              <g style={seg(id === 'travel')}>
                <rect x={438} y={256} width={400} height={48} rx={22} fill="none" stroke="#B6544A" strokeWidth={2.5} strokeDasharray="10 8" opacity={0.7} />
                <text x={638} y={245} textAnchor="middle" fontSize={13} fontWeight={700} fill="#B6544A">bare axon — no insulation</text>
              </g>
            )}

            {/* Nodes of Ranvier — the gaps, glowing on the travel step */}
            {NODE_X.map((x) => (
              <g key={x} style={seg(id === 'travel' || part === 'node')}>
                <circle cx={x} cy={280} r={id === 'travel' && playing ? 13 : 9} fill="#0E7C86" stroke="#fff" strokeWidth={2.5} />
                {id === 'travel' && playing && <circle cx={x} cy={280} r={13} fill="none" stroke="#0E7C86" strokeWidth={2} className="ping-ring" />}
              </g>
            ))}

            {/* Soma */}
            <g style={seg(id === 'sum' || id === 'fire' || part === 'soma' || part === 'nucleus')}>
              <ellipse cx={320} cy={280} rx={76} ry={63} fill="#E9A98F" stroke="#B6544A" strokeWidth={3.5} />
              {id === 'fire' && playing && (
                <ellipse cx={320} cy={280} rx={76} ry={63} fill="none" stroke="#B93327" strokeWidth={3} className="ping-ring" />
              )}
              {/* Nucleus */}
              <circle cx={320} cy={280} r={23} fill="#8A6FB8" stroke="#5E4A8A" strokeWidth={2.5} />
              <circle cx={313} cy={274} r={7} fill="#5E4A8A" opacity={0.7} />
            </g>

            {/* Terminal arbor + boutons */}
            <g fill="none" stroke="#B6544A" strokeWidth={7} strokeLinecap="round" style={seg(id === 'release' || part === 'synapse')}>
              <path d="M840 280 C870 250 895 235 918 222" />
              <path d="M840 280 H918" />
              <path d="M840 280 C870 310 895 325 918 338" />
            </g>
            <g style={seg(id === 'release' || part === 'synapse')}>
              {[
                [922, 222],
                [940, 280],
                [922, 338],
              ].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={13} fill="#E9A98F" stroke="#B6544A" strokeWidth={2.5} />
                  <circle cx={x - 4} cy={y - 4} r={3.5} fill="#8A6FB8" />
                  <circle cx={x + 4} cy={y + 3} r={3.5} fill="#8A6FB8" />
                </g>
              ))}
            </g>

            {/* The next neuron — a dendrite fragment across the cleft */}
            <g style={seg(id === 'release')}>
              <path d="M985 215 C972 245 968 260 968 280" fill="none" stroke="#5F83C2" strokeWidth={8} strokeLinecap="round" />
              <path d="M985 345 C972 315 968 300 968 280" fill="none" stroke="#5F83C2" strokeWidth={8} strokeLinecap="round" />
              <circle cx={968} cy={280} r={7} fill="#5F83C2" />
              <text x={965} y={392} textAnchor="middle" fontSize={12} fontWeight={700} fill="#4D6EA3">next neuron</text>
            </g>

            {/* Signal dots — only the active leg moves */}
            {id === 'receive' && playing && dots(RECEIVE_PATH, '#2B4A7A', 3, 2.4)}
            {id === 'sum' && playing && (
              <circle r={5} fill="#8A6FB8" stroke="#fff" strokeWidth={2}>
                <animateMotion dur="1.6s" repeatCount="indefinite" path="M320 250 A30 30 0 1 1 319.9 250" />
              </circle>
            )}
            {id === 'fire' && playing && dots('M415 280 H548', '#B93327', 2, 0.9)}
            {id === 'travel' && playing && dots(AXON_PATH, '#B93327', 3, travelDur)}
            {id === 'release' && playing && (
              <>
                {RELEASE_PATHS.map((p, i) => (
                  <circle key={i} r={4.5} fill="#8A6FB8" stroke="#fff" strokeWidth={1.5}>
                    <animateMotion dur="1.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={p} />
                  </circle>
                ))}
              </>
            )}

            {/* Labels */}
            <g fontWeight={700} fill="#3D2E22" pointerEvents="none">
              <text x={120} y={85} fontSize={14}>Dendrites</text>
              <text x={285} y={365} fontSize={14}>Soma</text>
              <text x={300} y={255} fontSize={12}>Nucleus</text>
              <text x={392} y={240} fontSize={13}>Axon hillock</text>
              <text x={600} y={235} fontSize={13}>Myelin sheath</text>
              <text x={648} y={325} fontSize={12}>Node of Ranvier</text>
              <text x={845} y={195} fontSize={13}>Synaptic terminals</text>
              <text x={470} y={325} fontSize={12}>Axon</text>
            </g>

            {/* Step + structure hotspots */}
            {NEURON_STEP_ORDER.map((sid, i) => {
              const s = NEURON_STEPS[sid]
              const isActive = step === i
              return (
                <g key={sid} onClick={() => { setStep(i); setPlaying(false) }} className="cursor-pointer">
                  {isActive && <circle cx={s.dot.x} cy={s.dot.y} r={14} fill="none" stroke="#0E7C86" strokeWidth={2.5} className="ping-ring" />}
                  <circle cx={s.dot.x} cy={s.dot.y} r={isActive ? 11 : 8} fill={isActive ? '#0E7C86' : '#16222E'} stroke="#fff" strokeWidth={2.5} />
                </g>
              )
            })}
          </svg>

          {/* Structure picker */}
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {NEURON_ORDER.map((pid) => (
              <button
                key={pid}
                onClick={() => setPart(pid)}
                aria-pressed={part === pid}
                className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                  part === pid ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="block font-display text-[0.9rem] font-bold leading-tight text-ink-950">{NEURON_PARTS[pid].name}</span>
                <span className="mt-0.5 block font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">{NEURON_PARTS[pid].latin}</span>
              </button>
            ))}
          </div>
        </div>
      }
      panel={
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
            Step {step + 1} of 5 · {info.job}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{info.name}</h3>
          <p className="mt-1 font-serif text-sm italic text-ink-500">{info.latin}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>

          <div className="mt-5 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">
              Structure under the cursor — {partInfo.name}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-800">
              <strong className="font-semibold">{partInfo.name}</strong>{' '}
              <span className="font-serif italic text-ink-500">({partInfo.latin})</span> — {partInfo.line}
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            <div>
              <div className="flex items-baseline justify-between font-mono text-xs text-ink-500">
                <span>Membrane voltage at the hillock</span>
                <span>{info.voltage > 0 ? '+' : ''}{info.voltage} mV</span>
              </div>
              <span className="mt-1.5 block h-2 w-full overflow-hidden rounded-full bg-line" aria-hidden>
                <span
                  className={`block h-full rounded-full transition-all duration-700 ${info.voltage > 0 ? 'bg-arterial-500' : 'bg-primary-600'}`}
                  style={{ width: `${voltagePct}%` }}
                />
              </span>
              <p className="mt-1 font-mono text-[0.68rem] text-ink-400">resting −70 mV · threshold ≈ −55 mV · peak ≈ +30 mV</p>
            </div>
            <Meter label="Conduction speed — myelinated axon" value={myelin ? 100 : 1} tone="bg-primary-600" />
            <p className="-mt-2 font-mono text-[0.68rem] text-ink-400">
              {myelin ? '≈ 100 m/s — the spike jumps node to node' : '≈ 1 m/s — the spike is rebuilt at every point'}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>≈ 86 billion neurons</Chip>
            <Chip>≈ 100 trillion synapses</Chip>
            <Chip>signal ≈ 1 ms per spike</Chip>
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause signal' : '▶ Play signal'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStep((s) => (s + NEURON_STEP_ORDER.length - 1) % NEURON_STEP_ORDER.length); setPlaying(false) }}>
                ← Prev step
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStep((s) => (s + 1) % NEURON_STEP_ORDER.length); setPlaying(false) }}>
                Next step →
              </Button>
              <Button size="sm" variant={myelin ? 'primary' : 'secondary'} onClick={() => setMyelin((m) => !m)}>
                Myelin {myelin ? 'on' : 'off'}
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{info.note}</p>
          </div>
        </div>
      }
    />
  )
}

/* ===================== The skeleton: 206 bones ===================== */

type SkeletonPartId =
  | 'skull'
  | 'spine'
  | 'ribs'
  | 'shoulder'
  | 'pelvis'
  | 'arm'
  | 'leg'
  | 'hand'
  | 'foot'

const SKELETON_PARTS: Record<
  SkeletonPartId,
  { name: string; latin: string; bones: number; axial: boolean; line: string; dot: { x: number; y: number } }
> = {
  skull: {
    name: 'Skull',
    latin: 'cranium',
    bones: 22,
    axial: true,
    line: '22 bones — 8 cranial bones form the braincase around the brain, 14 facial bones shape the face and jaw. In adults they are fused into one rigid helmet with a single moving part: the mandible.',
    dot: { x: 320, y: 72 },
  },
  spine: {
    name: 'Spine',
    latin: 'columna vertebralis',
    bones: 26,
    axial: true,
    line: '26 bones — 24 vertebrae (7 cervical, 12 thoracic, 5 lumbar) plus the sacrum and the coccyx. The vertebrae stack into a flexible column; the discs between them are the shock absorbers.',
    dot: { x: 320, y: 280 },
  },
  ribs: {
    name: 'Rib cage',
    latin: 'costae',
    bones: 25,
    axial: true,
    line: '25 bones — 24 ribs (12 pairs) plus the sternum. The ribs hinge on the spine and the sternum, so the whole cage can swing open a little with every breath while shielding the heart and lungs.',
    dot: { x: 252, y: 240 },
  },
  shoulder: {
    name: 'Shoulder girdle',
    latin: 'cingulum pectorale',
    bones: 4,
    axial: false,
    line: '4 bones — 2 clavicles and 2 scapulae. The girdle hangs the arms off the rib cage with almost no bony joint to the trunk: that is why the shoulder is the most mobile — and the most dislocatable — joint in the body.',
    dot: { x: 224, y: 178 },
  },
  pelvis: {
    name: 'Pelvis',
    latin: 'pelvis',
    bones: 2,
    axial: false,
    line: '2 hip bones — each one a fusion of ilium, ischium, and pubis. The pelvis is the keystone of the skeleton: it takes the whole weight of the trunk from the spine and hands it to the legs.',
    dot: { x: 320, y: 415 },
  },
  arm: {
    name: 'Arm',
    latin: 'brachium',
    bones: 30,
    axial: false,
    line: '30 bones per side — humerus, radius, and ulna, then 8 carpals, 5 metacarpals, and 14 phalanges in the hand. The arm trades strength for reach: it can lift, throw, and write, but it carries no body weight.',
    dot: { x: 212, y: 240 },
  },
  leg: {
    name: 'Leg',
    latin: 'crus',
    bones: 30,
    axial: false,
    line: '30 bones per side — femur, patella, tibia, and fibula, then 7 tarsals, 5 metatarsals, and 14 phalanges in the foot. The femur is the longest and strongest bone in the body: it has to be, it carries you.',
    dot: { x: 278, y: 510 },
  },
  hand: {
    name: 'Hand',
    latin: 'manus',
    bones: 27,
    axial: false,
    line: '27 bones per hand — 8 carpals in the wrist, 5 metacarpals in the palm, 14 phalanges in the fingers. More than a quarter of all your bones live in your hands and feet, because fine movement needs many small joints.',
    dot: { x: 193, y: 435 },
  },
  foot: {
    name: 'Foot',
    latin: 'pes',
    bones: 26,
    axial: false,
    line: '26 bones per foot — 7 tarsals, 5 metatarsals, and 14 phalanges. The tarsals form two arches that flatten a little with every step, spreading the impact before it reaches the leg.',
    dot: { x: 283, y: 706 },
  },
}

const SKELETON_ORDER: SkeletonPartId[] = [
  'skull',
  'spine',
  'ribs',
  'shoulder',
  'pelvis',
  'arm',
  'leg',
  'hand',
  'foot',
]

const SKELETON_STEPS: {
  id: string
  name: string
  latin: string
  job: string
  blurb: string
  note: string
  parts: SkeletonPartId[]
  dot: { x: number; y: number }
  paths: string[]
}[] = [
  {
    id: 'feet',
    name: 'Feet — the landing pad',
    latin: 'pedes',
    job: 'the load lands',
    blurb:
      'Every step starts here. When a foot strikes the ground, the two arches of the foot flatten a fraction and spread the impact across 26 small bones — the first shock absorber in the chain.',
    note: 'The heel takes the hit first; the arch springs back and hands the load up to the ankle.',
    parts: ['foot'],
    dot: { x: 283, y: 706 },
    paths: ['M283 724 L283 694'],
  },
  {
    id: 'legs',
    name: 'Legs — the pillars',
    latin: 'crura',
    job: 'the load climbs',
    blurb:
      'The load runs up the tibia and femur, the two longest levers in the body. The femur angles slightly inward as it rises, so the weight of the trunk lands dead centre over the knee — an engineering trick called the carrying angle.',
    note: 'The patella is a sesamoid bone — it grows inside a tendon, and it works like a pulley for the quadriceps.',
    parts: ['leg'],
    dot: { x: 278, y: 510 },
    paths: ['M283 700 L276 575 L282 445', 'M357 700 L364 575 L358 445'],
  },
  {
    id: 'pelvis',
    name: 'Pelvis — the keystone',
    latin: 'pelvis',
    job: 'the load transfers',
    blurb:
      'At the top of the legs the load reaches the pelvis, the bowl that joins the two sides of the body. The sacrum wedges between the two hip bones like the keystone of an arch — the harder the weight pushes down, the tighter the joint locks.',
    note: 'The hip socket is a ball-and-socket joint: the deepest, most stable joint in the body.',
    parts: ['pelvis'],
    dot: { x: 320, y: 415 },
    paths: ['M288 436 Q320 398 352 436'],
  },
  {
    id: 'spine',
    name: 'Spine — the flexible column',
    latin: 'columna vertebralis',
    job: 'the load rises',
    blurb:
      'The spine carries the load up 24 vertebrae, each pair separated by a disc of cartilage that squashes a fraction of a millimetre with every step — which is why you are about a centimetre taller in the morning than at night.',
    note: 'The spine is not straight: its four curves (neck, chest, lower back, sacrum) act like a spring.',
    parts: ['spine'],
    dot: { x: 320, y: 280 },
    paths: ['M320 398 L320 158'],
  },
  {
    id: 'skull',
    name: 'Skull — the protected cargo',
    latin: 'cranium',
    job: 'the load arrives',
    blurb:
      'At the top of the column sits the skull: 22 fused bones forming a helmet around the brain, balanced on the first vertebra so the head can turn, nod, and stay level while the body moves underneath it.',
    note: 'The skull is the only part of the skeleton that takes almost no load — its job is protection, not support.',
    parts: ['skull'],
    dot: { x: 320, y: 72 },
    paths: ['M320 18 A54 58 0 1 1 319 18'],
  },
]

const RIB_Y = [194, 210, 226, 242, 258, 274, 290]

export function SkeletonLab({ bare = false }: { bare?: boolean }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [part, setPart] = useState<SkeletonPartId>('skull')
  const [mode, setMode] = useState<'all' | 'axial' | 'appendicular'>('all')
  const info = SKELETON_STEPS[step]
  const partInfo = SKELETON_PARTS[part]
  const sharePct = Math.round((partInfo.bones / 206) * 100)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStep((s) => (s + 1) % SKELETON_STEPS.length), 4600)
    return () => clearInterval(t)
  }, [playing])

  const opacityFor = (pid: SkeletonPartId) => {
    const p = SKELETON_PARTS[pid]
    if (mode !== 'all' && p.axial !== (mode === 'axial')) return 0.15
    if (info.parts.includes(pid) || part === pid) return 1
    return 0.35
  }
  const seg = (pid: SkeletonPartId) => ({
    opacity: opacityFor(pid),
    transition: 'opacity 0.6s ease',
  })

  const dots = (path: string, n = 3, dur = 2.2) =>
    Array.from({ length: n }, (_, i) => (
      <circle key={i} r={6} fill="#B93327" stroke="#fff" strokeWidth={2}>
        <animateMotion dur={`${dur}s`} begin={`${i * (dur / n)}s`} repeatCount="indefinite" path={path} />
      </circle>
    ))

  const boneFill = '#EFE7D3'
  const boneStroke = '#A89B7E'
  const boneLight = '#E3DAC4'

  return (
    <LabShell
      bare={bare}
      diagram={
        <div>
          <svg viewBox="0 0 640 780" className="mx-auto w-full max-w-[520px]" role="img" aria-label="Animated diagram of the human skeleton: the load of a step travels from the feet up the legs, through the pelvis and spine, to the skull">
            {/* ---------- Skull ---------- */}
            <g style={seg('skull')} stroke={boneStroke} strokeWidth={2.5} fill={boneFill}>
              <ellipse cx={320} cy={72} rx={54} ry={58} />
              <path d="M288 100 L288 126 Q288 148 320 148 Q352 148 352 126 L352 100" />
              <line x1={296} y1={132} x2={344} y2={132} strokeWidth={1.5} />
              <circle cx={299} cy={70} r={9} fill="#16222E" stroke="none" />
              <circle cx={341} cy={70} r={9} fill="#16222E" stroke="none" />
              <path d="M320 84 L314 98 L326 98 Z" fill="#16222E" stroke="none" opacity={0.75} />
            </g>

            {/* ---------- Cervical vertebrae ---------- */}
            <g style={seg('spine')} fill={boneFill} stroke={boneStroke} strokeWidth={2}>
              {Array.from({ length: 7 }, (_, i) => (
                <rect key={i} x={311} y={154 + i * 4.2} width={18} height={3.4} rx={1.5} />
              ))}
            </g>

            {/* ---------- Clavicles + scapulae ---------- */}
            <g style={seg('shoulder')} stroke={boneStroke} strokeWidth={2} fill={boneFill}>
              <line x1={298} y1={186} x2={226} y2={172} strokeWidth={7} strokeLinecap="round" />
              <line x1={342} y1={186} x2={414} y2={172} strokeWidth={7} strokeLinecap="round" />
              <path d="M232 180 L262 180 L258 232 L234 222 Z" fill={boneLight} />
              <path d="M408 180 L378 180 L382 232 L406 222 Z" fill={boneLight} />
            </g>

            {/* ---------- Sternum ---------- */}
            <g style={seg('ribs')} fill={boneFill} stroke={boneStroke} strokeWidth={2.5}>
              <rect x={314} y={184} width={12} height={116} rx={6} />
            </g>

            {/* ---------- Ribs ---------- */}
            <g style={seg('ribs')} fill="none" stroke={boneStroke} strokeWidth={6} strokeLinecap="round">
              {RIB_Y.map((y) => (
                <path key={y} d={`M316 ${y} C 288 ${y - 6} 260 ${y} 248 ${y + 14}`} />
              ))}
            </g>
            <g style={seg('ribs')} fill="none" stroke={boneStroke} strokeWidth={6} strokeLinecap="round">
              <g transform="translate(640,0) scale(-1,1)">
                {RIB_Y.map((y) => (
                  <path key={y} d={`M316 ${y} C 288 ${y - 6} 260 ${y} 248 ${y + 14}`} />
                ))}
              </g>
            </g>

            {/* ---------- Thoracic + lumbar vertebrae, sacrum, coccyx ---------- */}
            <g style={seg('spine')} fill={boneFill} stroke={boneStroke} strokeWidth={2}>
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x={310} y={186 + i * 9.8} width={20} height={8} rx={2} />
              ))}
              {Array.from({ length: 5 }, (_, i) => (
                <rect key={i} x={307} y={306 + i * 12.5} width={26} height={10} rx={2} />
              ))}
              <path d="M307 370 L333 370 L327 400 L313 400 Z" />
              <path d="M316 402 L324 402 L320 414 Z" />
            </g>

            {/* ---------- Pelvis ---------- */}
            <g style={seg('pelvis')} fill={boneFill} stroke={boneStroke} strokeWidth={2.5}>
              <path d="M306 396 C 282 390 254 396 242 414 C 238 428 250 440 272 440 L300 434 Z" />
              <path d="M334 396 C 358 390 386 396 398 414 C 402 428 390 440 368 440 L340 434 Z" />
              <circle cx={284} cy={432} r={10} fill={boneLight} />
              <circle cx={356} cy={432} r={10} fill={boneLight} />
              <rect x={314} y={436} width={12} height={10} rx={3} />
            </g>

            {/* ---------- Arms ---------- */}
            <g style={seg('arm')} stroke={boneStroke} strokeWidth={2.5} fill={boneFill}>
              <line x1={224} y1={184} x2={202} y2={298} strokeWidth={14} strokeLinecap="round" />
              <circle cx={224} cy={184} r={8} />
              <circle cx={202} cy={300} r={7} />
              <line x1={198} y1={306} x2={190} y2={392} strokeWidth={6} strokeLinecap="round" />
              <line x1={208} y1={306} x2={198} y2={392} strokeWidth={6} strokeLinecap="round" />
              <circle cx={193} cy={398} r={6} />
              <rect x={180} y={402} width={26} height={32} rx={9} />
              <line x1={184} y1={434} x2={182} y2={466} strokeWidth={4} strokeLinecap="round" />
              <line x1={190} y1={436} x2={189} y2={470} strokeWidth={4} strokeLinecap="round" />
              <line x1={196} y1={436} x2={196} y2={470} strokeWidth={4} strokeLinecap="round" />
              <line x1={202} y1={434} x2={204} y2={466} strokeWidth={4} strokeLinecap="round" />
              <line x1={206} y1={412} x2={216} y2={428} strokeWidth={5} strokeLinecap="round" />
            </g>
            <g style={seg('arm')} stroke={boneStroke} strokeWidth={2.5} fill={boneFill}>
              <g transform="translate(640,0) scale(-1,1)">
                <line x1={224} y1={184} x2={202} y2={298} strokeWidth={14} strokeLinecap="round" />
                <circle cx={224} cy={184} r={8} />
                <circle cx={202} cy={300} r={7} />
                <line x1={198} y1={306} x2={190} y2={392} strokeWidth={6} strokeLinecap="round" />
                <line x1={208} y1={306} x2={198} y2={392} strokeWidth={6} strokeLinecap="round" />
                <circle cx={193} cy={398} r={6} />
                <rect x={180} y={402} width={26} height={32} rx={9} />
                <line x1={184} y1={434} x2={182} y2={466} strokeWidth={4} strokeLinecap="round" />
                <line x1={190} y1={436} x2={189} y2={470} strokeWidth={4} strokeLinecap="round" />
                <line x1={196} y1={436} x2={196} y2={470} strokeWidth={4} strokeLinecap="round" />
                <line x1={202} y1={434} x2={204} y2={466} strokeWidth={4} strokeLinecap="round" />
                <line x1={206} y1={412} x2={216} y2={428} strokeWidth={5} strokeLinecap="round" />
              </g>
            </g>

            {/* ---------- Legs ---------- */}
            <g style={seg('leg')} stroke={boneStroke} strokeWidth={2.5} fill={boneFill}>
              <line x1={284} y1={442} x2={272} y2={566} strokeWidth={15} strokeLinecap="round" />
              <circle cx={284} cy={442} r={8} />
              <circle cx={272} cy={572} r={9} />
              <line x1={270} y1={582} x2={266} y2={686} strokeWidth={12} strokeLinecap="round" />
              <line x1={280} y1={582} x2={276} y2={682} strokeWidth={5} strokeLinecap="round" />
              <circle cx={268} cy={690} r={7} />
            </g>
            <g style={seg('leg')} stroke={boneStroke} strokeWidth={2.5} fill={boneFill}>
              <g transform="translate(640,0) scale(-1,1)">
                <line x1={284} y1={442} x2={272} y2={566} strokeWidth={15} strokeLinecap="round" />
                <circle cx={284} cy={442} r={8} />
                <circle cx={272} cy={572} r={9} />
                <line x1={270} y1={582} x2={266} y2={686} strokeWidth={12} strokeLinecap="round" />
                <line x1={280} y1={582} x2={276} y2={682} strokeWidth={5} strokeLinecap="round" />
                <circle cx={268} cy={690} r={7} />
              </g>
            </g>

            {/* ---------- Feet ---------- */}
            <g style={seg('foot')} fill={boneFill} stroke={boneStroke} strokeWidth={2.5}>
              <rect x={254} y={692} width={58} height={28} rx={12} />
              <line x1={260} y1={720} x2={260} y2={728} strokeWidth={3} strokeLinecap="round" />
              <line x1={270} y1={720} x2={270} y2={729} strokeWidth={3} strokeLinecap="round" />
              <line x1={280} y1={720} x2={280} y2={729} strokeWidth={3} strokeLinecap="round" />
              <line x1={290} y1={720} x2={290} y2={728} strokeWidth={3} strokeLinecap="round" />
              <line x1={300} y1={720} x2={300} y2={726} strokeWidth={3} strokeLinecap="round" />
            </g>
            <g style={seg('foot')} fill={boneFill} stroke={boneStroke} strokeWidth={2.5}>
              <g transform="translate(640,0) scale(-1,1)">
                <rect x={254} y={692} width={58} height={28} rx={12} />
                <line x1={260} y1={720} x2={260} y2={728} strokeWidth={3} strokeLinecap="round" />
                <line x1={270} y1={720} x2={270} y2={729} strokeWidth={3} strokeLinecap="round" />
                <line x1={280} y1={720} x2={280} y2={729} strokeWidth={3} strokeLinecap="round" />
                <line x1={290} y1={720} x2={290} y2={728} strokeWidth={3} strokeLinecap="round" />
                <line x1={300} y1={720} x2={300} y2={726} strokeWidth={3} strokeLinecap="round" />
              </g>
            </g>

            {/* ---------- Load dots — only the active leg moves ---------- */}
            {playing && info.paths.map((p) => dots(p))}

            {/* ---------- Labels ---------- */}
            <g fontWeight={700} fill="#3D2E22" pointerEvents="none">
              <text x={398} y={60} fontSize={14}>Skull · 22</text>
              <text x={96} y={166} fontSize={13}>Clavicle</text>
              <text x={452} y={222} fontSize={13}>Rib cage · 25</text>
              <text x={398} y={320} fontSize={13}>Spine · 26</text>
              <text x={428} y={420} fontSize={13}>Pelvis · 2</text>
              <text x={104} y={240} fontSize={13}>Humerus</text>
              <text x={156} y={512} fontSize={13}>Femur</text>
              <text x={330} y={576} fontSize={12}>Patella</text>
              <text x={156} y={636} fontSize={13}>Tibia</text>
              <text x={392} y={712} fontSize={13}>Foot · 26</text>
            </g>

            {/* ---------- Step hotspots ---------- */}
            {SKELETON_STEPS.map((s, i) => (
              <g key={s.id} onClick={() => { setStep(i); setPlaying(false) }} className="cursor-pointer">
                {step === i && <circle cx={s.dot.x} cy={s.dot.y} r={14} fill="none" stroke="#0E7C86" strokeWidth={2.5} className="ping-ring" />}
                <circle cx={s.dot.x} cy={s.dot.y} r={step === i ? 11 : 8} fill={step === i ? '#0E7C86' : '#16222E'} stroke="#fff" strokeWidth={2.5} />
              </g>
            ))}
          </svg>

          {/* Structure picker */}
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SKELETON_ORDER.map((pid) => (
              <button
                key={pid}
                onClick={() => setPart(pid)}
                aria-pressed={part === pid}
                className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                  part === pid ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="block font-display text-[0.9rem] font-bold leading-tight text-ink-950">{SKELETON_PARTS[pid].name}</span>
                <span className="mt-0.5 block font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">
                  {SKELETON_PARTS[pid].latin} · {SKELETON_PARTS[pid].bones} bones
                </span>
              </button>
            ))}
          </div>
        </div>
      }
      panel={
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
            Step {step + 1} of 5 · {info.job}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{info.name}</h3>
          <p className="mt-1 font-serif text-sm italic text-ink-500">{info.latin}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>

          <div className="mt-5 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">
              Structure under the cursor — {partInfo.name}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-800">
              <strong className="font-semibold">{partInfo.name}</strong>{' '}
              <span className="font-serif italic text-ink-500">({partInfo.latin})</span> — {partInfo.line}
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            <Meter label={`Share of the 206 bones — ${partInfo.name} (${partInfo.bones})`} value={sharePct} tone="bg-primary-600" />
            <Meter label="Axial skeleton — 80 bones" value={Math.round((80 / 206) * 100)} tone="bg-venous-500" />
            <Meter label="Appendicular skeleton — 126 bones" value={Math.round((126 / 206) * 100)} tone="bg-arterial-500" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>206 bones in the adult skeleton</Chip>
            <Chip>≈ 300 at birth — they fuse as you grow</Chip>
            <Chip>longest: femur · smallest: stapes</Chip>
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause load' : '▶ Play load'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStep((s) => (s + SKELETON_STEPS.length - 1) % SKELETON_STEPS.length); setPlaying(false) }}>
                ← Prev step
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setStep((s) => (s + 1) % SKELETON_STEPS.length); setPlaying(false) }}>
                Next step →
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Highlight one division of the skeleton">
              {(
                [
                  ['all', 'Whole skeleton'],
                  ['axial', 'Axial · 80'],
                  ['appendicular', 'Appendicular · 126'],
                ] as const
              ).map(([m, label]) => (
                <Button key={m} size="sm" variant={mode === m ? 'primary' : 'secondary'} onClick={() => setMode(m)}>
                  {label}
                </Button>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{info.note}</p>
          </div>
        </div>
      }
    />
  )
}

/* ============================ Reading an ECG ============================ */

/*
 * EcgLab — a live ECG monitor. A glowing dot travels a schematic Lead II
 * trace on pink grid paper, drawing the trace as it goes; the wave under
 * the dot is named and explained in the panel, and the wave stepper lets
 * you jump straight to any part of the beat. The rate control changes how
 * fast the sweep travels — on real ECG paper (25 mm/s) the beats would
 * squeeze together instead, which the note under the controls says.
 */

const ECG_BASE_Y = 180
const ECG_BEAT = 400
const ECG_START_X = 50
const ECG_END_X = 950

type EcgWaveId = 'P' | 'PR' | 'QRS' | 'ST' | 'T' | 'rest'

const ECG_WAVES: Record<
  EcgWaveId,
  { name: string; short: string; mid: number; dur: string; doing: string; text: string }
> = {
  P: {
    name: 'P wave',
    short: 'P wave',
    mid: 0.215,
    dur: '≈ 0.08 s',
    doing: 'Atria contracting',
    text: 'The atria depolarize: the spark from the SA node spreads across both atria and they contract, topping up the ventricles. The wave is small and rounded because the atrial walls are thin — a little muscle makes a little signal.',
  },
  PR: {
    name: 'PR segment',
    short: 'PR segment',
    mid: 0.34,
    dur: 'PR interval 0.12–0.20 s',
    doing: 'Ventricles filling',
    text: 'A flat line — the impulse is being held at the AV node. The PR interval, from the start of P to the start of QRS, is normally 0.12–0.20 seconds: the deliberate pause that lets the ventricles finish filling before they contract.',
  },
  QRS: {
    name: 'QRS complex',
    short: 'QRS complex',
    mid: 0.47,
    dur: '< 0.12 s',
    doing: 'Ventricles contracting',
    text: 'The ventricles depolarize — the tall, sharp spike. Q is the first small dip down, R the tall peak, S the dip after it. The ventricles begin to contract as the R wave peaks. It is tall because the ventricles are the thickest muscle in the heart.',
  },
  ST: {
    name: 'ST segment',
    short: 'ST segment',
    mid: 0.5825,
    dur: 'flat on the baseline',
    doing: 'Ventricles ejecting',
    text: 'Another flat line — the ventricles are fully depolarized and squeezing blood out. It should sit on the baseline: a raised or lowered ST segment is one of the classic warning signs clinicians look for.',
  },
  T: {
    name: 'T wave',
    short: 'T wave',
    mid: 0.705,
    dur: '≈ 0.16 s',
    doing: 'Ventricles resetting',
    text: 'The ventricles repolarize — resetting their electrical state so they can fire again. It is broad and rounded, and points the same way as the R wave. (The atria repolarize too, but their signal hides inside the much bigger QRS.)',
  },
  rest: {
    name: 'Between beats',
    short: 'Diastole',
    mid: 0.9,
    dur: 'the heart rests',
    doing: 'Heart resting · refilling',
    text: 'Diastole — the flat line between one T wave and the next P wave. The chambers are quiet and refilling, and the next spark is already building at the SA node.',
  },
}

const ECG_WAVE_ORDER: EcgWaveId[] = ['P', 'PR', 'QRS', 'ST', 'T']

function waveFor(local: number): EcgWaveId {
  if (local < 0.15 || local >= 0.785) return 'rest'
  if (local < 0.28) return 'P'
  if (local < 0.4) return 'PR'
  if (local < 0.54) return 'QRS'
  if (local < 0.625) return 'ST'
  return 'T'
}

/* One beat, drawn from x0 to x0 + 400. P and T are smooth bumps; the QRS
 * is sharp corners — a small q dip, a tall R spike, a deep S dip. */
function beatSeg(x0: number) {
  return (
    `L ${x0 + 60} ${ECG_BASE_Y} ` +
    `C ${x0 + 70} ${ECG_BASE_Y} ${x0 + 74} 156 ${x0 + 86} 156 ` +
    `C ${x0 + 98} 156 ${x0 + 102} ${ECG_BASE_Y} ${x0 + 112} ${ECG_BASE_Y} ` +
    `L ${x0 + 160} ${ECG_BASE_Y} ` +
    `L ${x0 + 168} 192 L ${x0 + 176} 192 ` +
    `L ${x0 + 184} 62 L ${x0 + 192} 62 ` +
    `L ${x0 + 200} 206 L ${x0 + 208} 206 ` +
    `L ${x0 + 216} ${ECG_BASE_Y} ` +
    `L ${x0 + 250} ${ECG_BASE_Y} ` +
    `C ${x0 + 262} ${ECG_BASE_Y} ${x0 + 268} 148 ${x0 + 282} 148 ` +
    `C ${x0 + 296} 148 ${x0 + 302} ${ECG_BASE_Y} ${x0 + 314} ${ECG_BASE_Y} ` +
    `L ${x0 + 400} ${ECG_BASE_Y}`
  )
}

function segD(x0: number, id: EcgWaveId) {
  switch (id) {
    case 'P':
      return `M ${x0 + 60} ${ECG_BASE_Y} C ${x0 + 70} ${ECG_BASE_Y} ${x0 + 74} 156 ${x0 + 86} 156 C ${x0 + 98} 156 ${x0 + 102} ${ECG_BASE_Y} ${x0 + 112} ${ECG_BASE_Y}`
    case 'PR':
      return `M ${x0 + 112} ${ECG_BASE_Y} L ${x0 + 160} ${ECG_BASE_Y}`
    case 'QRS':
      return `M ${x0 + 160} ${ECG_BASE_Y} L ${x0 + 168} 192 L ${x0 + 176} 192 L ${x0 + 184} 62 L ${x0 + 192} 62 L ${x0 + 200} 206 L ${x0 + 208} 206 L ${x0 + 216} ${ECG_BASE_Y}`
    case 'ST':
      return `M ${x0 + 216} ${ECG_BASE_Y} L ${x0 + 250} ${ECG_BASE_Y}`
    case 'T':
      return `M ${x0 + 250} ${ECG_BASE_Y} C ${x0 + 262} ${ECG_BASE_Y} ${x0 + 268} 148 ${x0 + 282} 148 C ${x0 + 296} 148 ${x0 + 302} ${ECG_BASE_Y} ${x0 + 314} ${ECG_BASE_Y}`
    default:
      return ''
  }
}

const ECG_TRACE_D = `M ${ECG_START_X} ${ECG_BASE_Y} ${beatSeg(ECG_START_X)} ${beatSeg(ECG_START_X + ECG_BEAT)} L ${ECG_END_X} ${ECG_BASE_Y}`

export function EcgLab({ bare = false }: { bare?: boolean }) {
  const [playing, setPlaying] = useState(
    () =>
      typeof window === 'undefined' ||
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [bpm, setBpm] = useState(72)
  const [wave, setWave] = useState<EcgWaveId>('rest')
  const [beat, setBeat] = useState(0)
  const traceRef = useRef<SVGPathElement>(null)
  const sweepRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)
  const cursorRef = useRef<SVGLineElement>(null)
  const t0Ref = useRef(0)
  const totalLenRef = useRef(0)
  const bpmRef = useRef(bpm)

  const info = ECG_WAVES[wave]
  const beatDur = 60 / bpm
  const cycle = 2.25 * beatDur
  const rr = 60 / bpm

  /* Paint one frame of the sweep: dot + cursor on the trace, the trace
   * drawn up to the dot, and the wave under the dot named. Positions are
   * written straight to the DOM so the animation never re-renders React. */
  const paint = (frac: number) => {
    const path = traceRef.current
    const sweep = sweepRef.current
    const dot = dotRef.current
    const glow = glowRef.current
    const cursor = cursorRef.current
    if (!path || !sweep || !dot || !glow || !cursor) return
    const len = totalLenRef.current || (totalLenRef.current = path.getTotalLength())
    const pt = path.getPointAtLength(frac * len)
    dot.setAttribute('cx', String(pt.x))
    dot.setAttribute('cy', String(pt.y))
    glow.setAttribute('cx', String(pt.x))
    glow.setAttribute('cy', String(pt.y))
    cursor.setAttribute('x1', String(pt.x))
    cursor.setAttribute('x2', String(pt.x))
    sweep.style.strokeDashoffset = String(len * (1 - frac))
    const local = (((pt.x - ECG_START_X) % ECG_BEAT) + ECG_BEAT) % ECG_BEAT / ECG_BEAT
    setWave((prev) => {
      const w = waveFor(local)
      return prev === w ? prev : w
    })
    const b = Math.min(1, Math.floor((pt.x - ECG_START_X) / ECG_BEAT))
    setBeat((prev) => (prev === b ? prev : b))
  }

  useEffect(() => {
    bpmRef.current = bpm
  }, [bpm])

  useEffect(() => {
    const path = traceRef.current
    const sweep = sweepRef.current
    if (!path || !sweep) return
    const len = path.getTotalLength()
    totalLenRef.current = len
    sweep.style.strokeDasharray = String(len)
    sweep.style.strokeDashoffset = String(len)
    t0Ref.current = performance.now()
    paint(0.07)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = (now: number) => {
      const c = 2.25 * (60 / bpmRef.current)
      const elapsed = (now - t0Ref.current) / 1000
      paint((elapsed % c) / c)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  const setRate = (v: number) => {
    setBpm(v)
    t0Ref.current = performance.now()
  }

  const jumpTo = (id: EcgWaveId) => {
    const w = ECG_WAVES[id]
    const targetX = ECG_START_X + w.mid * ECG_BEAT
    const frac = (targetX - ECG_START_X) / (ECG_END_X - ECG_START_X)
    t0Ref.current = performance.now() - frac * cycle * 1000
    setPlaying(false)
    paint(frac)
  }

  return (
    <LabShell
      diagram={
        <div>
          <svg viewBox="0 0 1000 300" className="w-full" role="img" aria-label="Animated ECG trace: a glowing dot travels the P wave, QRS complex and T wave of a heartbeat">
            <defs>
              <pattern id="ecgMinor" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0H0V10" fill="none" stroke="#f2d8d3" strokeWidth="1" />
              </pattern>
              <pattern id="ecgMajor" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M50 0H0V50" fill="none" stroke="#eec4bb" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="1000" height="300" fill="#fdf6f3" />
            <rect x="0" y="0" width="1000" height="300" fill="url(#ecgMinor)" />
            <rect x="0" y="0" width="1000" height="300" fill="url(#ecgMajor)" />

            {/* Faint full trace, always visible */}
            <path ref={traceRef} d={ECG_TRACE_D} fill="none" stroke="#16222E" strokeWidth={3} opacity={0.22} strokeLinecap="round" strokeLinejoin="round" />
            {/* Bright sweep, drawn up to the dot */}
            <path ref={sweepRef} d={ECG_TRACE_D} fill="none" stroke="#D64545" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
            {/* The wave under the dot, highlighted */}
            {wave !== 'rest' && (
              <path d={segD(ECG_START_X + beat * ECG_BEAT, wave)} fill="none" stroke="#0E7C86" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            )}
            <line ref={cursorRef} x1={ECG_START_X} x2={ECG_START_X} y1={8} y2={292} stroke="#0E7C86" strokeWidth={1.5} opacity={0.35} />
            <circle ref={glowRef} r={15} fill="#F2C14E" opacity={0.25} />
            <circle ref={dotRef} r={7} fill="#F2C14E" stroke="#fff" strokeWidth={2.5} />

            {/* Wave labels on the first beat */}
            <text x={136} y={138} textAnchor="middle" fontSize={17} fontWeight={700} fill="#43536A">P</text>
            <text x={218} y={212} textAnchor="middle" fontSize={17} fontWeight={700} fill="#43536A">Q</text>
            <text x={234} y={48} textAnchor="middle" fontSize={17} fontWeight={700} fill="#43536A">R</text>
            <text x={254} y={224} textAnchor="middle" fontSize={17} fontWeight={700} fill="#43536A">S</text>
            <text x={332} y={130} textAnchor="middle" fontSize={17} fontWeight={700} fill="#43536A">T</text>
            <text x={70} y={30} fontSize={15} fill="#6B7684">Lead II · schematic trace on ECG grid paper</text>
          </svg>

          {/* Wave stepper */}
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {ECG_WAVE_ORDER.map((id) => (
              <button
                key={id}
                onClick={() => jumpTo(id)}
                aria-pressed={wave === id}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  wave === id ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface hover:border-primary-600/40'
                }`}
              >
                <span className="block font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">{ECG_WAVES[id].dur}</span>
                <span className="mt-0.5 block font-display text-[0.9rem] font-bold leading-tight text-ink-950">{ECG_WAVES[id].short}</span>
              </button>
            ))}
          </div>
        </div>
      }
      panel={
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
            {wave === 'rest' ? 'Between beats · diastole' : `${info.short} · ${info.dur}`}
          </p>
          <h3 className="mt-1.5 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink-950">{info.name}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{info.text}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>{info.doing}</Chip>
            <Chip>Lead II · the classic teaching lead</Chip>
          </div>

          <div className="mt-6 grid gap-4">
            <Meter label={`Heart rate · ${bpm} beats/min`} value={Math.round((bpm / 160) * 100)} tone="bg-arterial-500" />
            <Meter label={`R–R interval · ${rr.toFixed(2)} s between beats`} value={Math.min(100, Math.round((rr / 1.5) * 100))} />
          </div>

          <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? '❚❚ Pause trace' : '▶ Play trace'}
              </Button>
              {(
                [
                  [60, 'Rest · 60'],
                  [100, 'Brisk walk · 100'],
                  [140, 'Running · 140'],
                ] as const
              ).map(([v, label]) => (
                <Button key={v} size="sm" variant={bpm === v ? 'primary' : 'secondary'} onClick={() => setRate(v)}>
                  {label}
                </Button>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="font-mono text-xs text-ink-500">Heart rate — {bpm} beats per minute</span>
              <input
                type="range"
                min={40}
                max={160}
                step={1}
                value={bpm}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-1.5 w-full accent-[#0E7C86]"
                aria-label="Heart rate in beats per minute"
              />
            </label>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              The trace is drawn to a fixed width so the waves stay readable — changing the rate
              changes how fast the sweep travels. On real ECG paper (25 mm/s) the beats would
              squeeze together instead, and one small square would be 0.04 seconds.
            </p>
          </div>
        </div>
      }
      bare={bare}
    />
  )
}

/* ====================== Breathing & gas exchange ====================== */

type GasStructureId = 'alveolus' | 'barrier' | 'capillary' | 'rbc' | 'surfactant'

const GAS_STRUCTURES: Record<
  GasStructureId,
  { name: string; latin: string; blurb: string; dot: { x: number; y: number } }
> = {
  alveolus: {
    name: 'Alveolus',
    latin: 'alveolus pulmonis',
    blurb:
      'One air sac, about 0.2 mm across. You have roughly 300 million of them, and together they offer about 70 m² of surface for gas to cross — the whole trade happens here, not in the big airways.',
    dot: { x: 215, y: 380 },
  },
  barrier: {
    name: 'Blood–air barrier',
    latin: 'membrana alveolocapillaris',
    blurb:
      'The thinnest wall in the body — about 0.3 µm. Three layers fused into one: the flat type I pneumocyte, a shared basal lamina, and the capillary endothelium. Oxygen and carbon dioxide cross it by diffusion alone.',
    dot: { x: 508, y: 250 },
  },
  capillary: {
    name: 'Pulmonary capillary',
    latin: 'vas capillare pulmonale',
    blurb:
      'A tube barely wider than a red blood cell, wrapped around the alveolus like a net. Blood spends about 0.75 seconds inside it at rest — and that is already three times longer than diffusion needs.',
    dot: { x: 640, y: 120 },
  },
  rbc: {
    name: 'Red blood cell',
    latin: 'erythrocytus',
    blurb:
      'Each cell carries about 270 million haemoglobin molecules, and each haemoglobin binds four oxygen molecules. Watch the cells change colour as they pass the alveolus: blue in, red out — oxygen loaded, carbon dioxide dropped off.',
    dot: { x: 655, y: 445 },
  },
  surfactant: {
    name: 'Surfactant',
    latin: 'surfactans',
    blurb:
      'A soapy film made by type II pneumocytes that lines the inside of the alveolus and lowers surface tension. Without it the smallest sacs would collapse shut — the problem behind respiratory distress in premature babies.',
    dot: { x: 235, y: 165 },
  },
}

const GAS_ORDER: GasStructureId[] = ['alveolus', 'barrier', 'capillary', 'rbc', 'surfactant']

/* The capillary hugs the right side of the alveolus: blood enters blue at
 * the top, leaves red at the bottom. The two halves are separate paths so
 * the cells can change colour at the midpoint, where the oxygen loads. */
const CAP_ENTRY = 'M 720 30 C 600 110, 545 190, 545 280'
const CAP_EXIT = 'M 545 280 C 545 370, 600 450, 720 530'

/* Oxygen crosses from air to blood; carbon dioxide crosses back. */
const O2_PATHS = [
  'M 400 195 C 470 205, 512 225, 546 242',
  'M 412 280 C 480 280, 516 280, 548 280',
  'M 400 362 C 470 352, 512 332, 546 316',
]
const CO2_PATHS = [
  'M 546 232 C 500 218, 458 204, 398 188',
  'M 548 292 C 490 302, 448 312, 400 322',
  'M 546 338 C 500 352, 458 364, 408 376',
]

const BREATH_IN = 'M 205 78 C 235 120, 255 165, 268 210'
const BREATH_OUT = 'M 268 210 C 255 165, 235 120, 205 78'

export function GasExchangeLab({ bare = false }: { bare?: boolean }) {
  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [rate, setRate] = useState(12)
  const [selected, setSelected] = useState<GasStructureId>('barrier')
  const info = GAS_STRUCTURES[selected]
  const halfCycleMs = 30000 / rate
  /* Blood rushes faster when you breathe faster: one pass through the
   * capillary takes ~7.5 s at rest, ~3 s while running. Diffusion is
   * quicker still — about 2 s and 1 s on the same scale — so the blood
   * always leaves fully loaded. */
  const flowDur = 90 / rate
  const diffuseDur = flowDur / 3.2
  const transit = (0.75 * 12) / rate

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setPhase((p) => (p === 'inhale' ? 'exhale' : 'inhale')), halfCycleMs)
    return () => clearInterval(t)
  }, [playing, halfCycleMs])

  const gasDot = (path: string, begin: number, fill: string, dur: number) => (
    <circle r={7} fill={fill} stroke="#fff" strokeWidth={2} opacity={0.95}>
      {playing && (
        <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
      )}
    </circle>
  )
  const rbc = (path: string, begin: number, fill: string) => (
    <ellipse rx={19} ry={12} fill={fill} stroke="#fff" strokeWidth={2} opacity={0.95}>
      {playing && (
        <animateMotion dur={`${flowDur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} rotate="auto" />
      )}
    </ellipse>
  )

  return (
    <LabShell
      bare={bare}
      diagram={
        <svg viewBox="0 0 1000 560" className="w-full" role="img" aria-label="Animated diagram of gas exchange: oxygen diffuses from an alveolus into a capillary while carbon dioxide diffuses out">
          {/* Bronchiole stub feeding the alveolus */}
          <path d="M150 30 C170 55, 190 75, 205 78 L 268 210" fill="none" stroke="#B9D6D8" strokeWidth={34} strokeLinecap="round" />
          <path d="M150 30 C170 55, 190 75, 205 78 L 268 210" fill="none" stroke="#0E7C86" strokeWidth={3} opacity={0.45} />

          {/* The alveolus — a cluster of sacs that swells with each breath */}
          <g className="svg-transition" style={{ transform: phase === 'inhale' ? 'scale(1.03)' : 'scale(0.985)', transformOrigin: '300px 290px' }}>
            <circle cx={150} cy={185} r={72} fill="#F6D9CF" stroke="#B6544A" strokeWidth={3} />
            <circle cx={185} cy={405} r={76} fill="#F6D9CF" stroke="#B6544A" strokeWidth={3} />
            <circle cx={425} cy={150} r={62} fill="#F6D9CF" stroke="#B6544A" strokeWidth={3} />
            <ellipse cx={300} cy={290} rx={210} ry={185} fill="#FBE7DF" stroke="#B6544A" strokeWidth={4} />
            {/* Surfactant film shimmering on the inner wall */}
            <ellipse cx={300} cy={290} rx={196} ry={171} fill="none" stroke="#0E7C86" strokeWidth={2} strokeDasharray="3 14" strokeLinecap="round" opacity={0.55} />
          </g>

          {/* The blood–air barrier: the thin line the gases must cross */}
          <path d="M 505 108 C 540 170, 552 225, 552 290 C 552 355, 540 415, 505 472" fill="none" stroke="#43536A" strokeWidth={3} strokeDasharray="10 6" opacity={0.8} />

          {/* The capillary, wrapped around the alveolus */}
          <path d={`${CAP_ENTRY} ${CAP_EXIT}`} fill="none" stroke="#C98A7E" strokeWidth={80} strokeLinecap="round" />
          <path d={`${CAP_ENTRY} ${CAP_EXIT}`} fill="none" stroke="#F2C9C0" strokeWidth={70} strokeLinecap="round" />

          {/* Air moving in and out of the bronchiole */}
          {gasDot(phase === 'inhale' ? BREATH_IN : BREATH_OUT, -0.2, '#0E7C86', halfCycleMs / 1000)}
          {gasDot(phase === 'inhale' ? BREATH_IN : BREATH_OUT, -1.4, '#0E7C86', halfCycleMs / 1000)}

          {/* Oxygen crossing into the blood */}
          {O2_PATHS.map((p, i) => gasDot(p, -i * 0.7, '#D64545', diffuseDur))}
          {O2_PATHS.map((p, i) => gasDot(p, -i * 0.7 - 1.1, '#D64545', diffuseDur))}
          {/* Carbon dioxide crossing back into the air */}
          {CO2_PATHS.map((p, i) => gasDot(p, -i * 0.8, '#5F83C2', diffuseDur))}
          {CO2_PATHS.map((p, i) => gasDot(p, -i * 0.8 - 1.2, '#5F83C2', diffuseDur))}

          {/* Red blood cells: blue in, red out */}
          {rbc(CAP_ENTRY, -0.5, '#5F83C2')}
          {rbc(CAP_ENTRY, -2.6, '#5F83C2')}
          {rbc(CAP_ENTRY, -4.7, '#5F83C2')}
          {rbc(CAP_EXIT, -0.5, '#D64545')}
          {rbc(CAP_EXIT, -2.6, '#D64545')}
          {rbc(CAP_EXIT, -4.7, '#D64545')}

          {/* Labels */}
          <text x={300} y={285} textAnchor="middle" fontSize={19} fontWeight={700} fill="#7A4A40">Alveolar air</text>
          <text x={300} y={308} textAnchor="middle" fontSize={15} fill="#7A4A40">PO₂ 104 · PCO₂ 40 mmHg</text>
          <text x={845} y={52} textAnchor="middle" fontSize={15} fontWeight={700} fill="#43536A">Blood in · PO₂ 40</text>
          <text x={845} y={525} textAnchor="middle" fontSize={15} fontWeight={700} fill="#8C2B23">Blood out · PO₂ ~100</text>
          <text x={572} y={200} textAnchor="middle" fontSize={15} fontWeight={700} fill="#D64545" style={{ paintOrder: 'stroke', stroke: '#F7F4EE', strokeWidth: 5 }}>O₂ →</text>
          <text x={572} y={380} textAnchor="middle" fontSize={15} fontWeight={700} fill="#5F83C2" style={{ paintOrder: 'stroke', stroke: '#F7F4EE', strokeWidth: 5 }}>← CO₂</text>

          {/* Structure hotspots */}
          {GAS_ORDER.map((id) => {
            const s = GAS_STRUCTURES[id]
            const isActive = selected === id
            return (
              <g key={id} onClick={() => setSelected(id)} className="cursor-pointer">
                {isActive && <circle cx={s.dot.x} cy={s.dot.y} r={13} fill="none" stroke="#0E7C86" strokeWidth={2.5} className="ping-ring" />}
                <circle cx={s.dot.x} cy={s.dot.y} r={isActive ? 11 : 8} fill={isActive ? '#0E7C86' : '#16222E'} stroke="#fff" strokeWidth={2.5} />
              </g>
            )
          })}
        </svg>
      }
      panel={
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
                {playing ? 'Exchanging' : 'Paused'}
              </p>
              <h3 className="mt-1 font-display text-3xl font-extrabold capitalize tracking-tight text-ink-950">{phase}</h3>
            </div>
            <span className={`font-display text-lg font-extrabold ${phase === 'inhale' ? 'text-primary-700' : 'text-venous-600'}`}>
              {phase === 'inhale' ? '▼ fresh air in' : '▲ CO₂ out'}
            </span>
          </div>

          <div className="mt-4 grid gap-4">
            <Meter label="O₂ in alveolar air · 104 mmHg" value={65} tone="bg-arterial-500" />
            <Meter label="O₂ in blood leaving · ~100 mmHg" value={62} tone="bg-arterial-500" />
            <Meter label="O₂ saturation · 98% of haemoglobin loaded" value={98} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip tone="open">PO₂ gradient 104 → 40 mmHg</Chip>
            <Chip>Wall only 0.3 µm thick</Chip>
            <Chip>Transit {transit.toFixed(2)} s · equilibrates in ~0.25 s</Chip>
          </div>

          <div className="mt-5">
            <label htmlFor="gas-rate" className="flex items-baseline justify-between font-mono text-xs text-ink-500">
              <span>Breathing rate</span>
              <span>{rate} breaths / min</span>
            </label>
            <input
              id="gas-rate"
              type="range"
              min={8}
              max={32}
              step={1}
              value={rate}
              onChange={(e) => setRate(e.currentTarget.valueAsNumber)}
              className="mt-2 w-full accent-[#0E7C86]"
            />
            <p className="mt-1.5 text-sm text-ink-500">
              At rest you move about 6 litres of air a minute; running, ten times that. Drag the
              slider up and watch the blood rush faster — the cells still leave fully loaded.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setPlaying((p) => !p)}>
              {playing ? '❚❚ Pause exchange' : '▶ Play exchange'}
            </Button>
            {(
              [
                [12, 'Rest · 12'],
                [20, 'Brisk walk · 20'],
                [30, 'Running · 30'],
              ] as const
            ).map(([v, label]) => (
              <Button key={v} size="sm" variant={rate === v ? 'primary' : 'secondary'} onClick={() => setRate(v)}>
                {label}
              </Button>
            ))}
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <div className="flex flex-wrap gap-1.5">
              {GAS_ORDER.map((id) => (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  aria-pressed={selected === id}
                  className={`rounded-full px-3 py-1.5 font-display text-[0.8rem] font-bold ring-1 ring-inset transition-colors ${
                    selected === id ? 'bg-primary-600 text-white ring-primary-600' : 'bg-surface text-ink-700 ring-line hover:text-ink-950'
                  }`}
                >
                  {GAS_STRUCTURES[id].name}
                </button>
              ))}
            </div>
            <p className="mt-3 font-serif text-sm italic text-ink-500">{info.latin}</p>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-700">{info.blurb}</p>
          </div>
        </div>
      }
    />
  )
}
