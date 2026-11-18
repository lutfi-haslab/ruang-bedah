import { useEffect, useState } from 'react'
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
const BOLUS_PATH =
  'M 190 62 V 238 C 230 255 270 275 292 305 C 320 330 360 340 375 375 C 385 395 400 405 445 405 H 618 A 15 15 0 0 1 618 436 H 452 A 15 15 0 0 0 452 468 H 618 A 15 15 0 0 1 618 500 H 652 C 672 500 688 504 690 514 V 198 A 16 16 0 0 0 674 182 H 362 A 16 16 0 0 0 346 198 V 452 C 346 496 318 512 302 530 L 298 548'

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
