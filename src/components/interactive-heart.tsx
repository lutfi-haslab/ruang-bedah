import { useEffect, useMemo, useState } from 'react'
import { Button } from './primitives'

/* ------------------------------------------------------------------ */
/* InteractiveHeart — the wiki's signature interactive diagram.        */
/* Click or hover any labeled structure to explore it, play the        */
/* heartbeat (systole/diastole + EKG + flow), or follow the blood     */
/* through its circuit step by step.                                   */
/* ------------------------------------------------------------------ */

type Structure = {
  id: string
  name: string
  latin: string
  blurb: string
  dot: { x: number; y: number }
  label: { x: number; y: number; anchor: 'start' | 'end' }
  leader: { x1: number; y1: number; x2: number; y2: number }
}

const STRUCTURES: Structure[] = [
  {
    id: 'pulmonary-artery',
    name: 'Pulmonary artery',
    latin: 'arteria pulmonalis',
    blurb:
      'The exception among arteries: it carries oxygen-poor blood — from the right ventricle to the lungs, where the blood reloads with oxygen.',
    dot: { x: 335, y: 212 },
    label: { x: 60, y: 212, anchor: 'start' },
    leader: { x1: 238, y1: 210, x2: 328, y2: 211 },
  },
  {
    id: 'svc',
    name: 'Superior vena cava',
    latin: 'vena cava superior',
    blurb:
      'The great vein of the upper body. It collects oxygen-poor blood from the head, arms, and chest and delivers it to the right atrium.',
    dot: { x: 520, y: 248 },
    label: { x: 60, y: 325, anchor: 'start' },
    leader: { x1: 252, y1: 328, x2: 510, y2: 252 },
  },
  {
    id: 'right-atrium',
    name: 'Right atrium',
    latin: 'atrium dextrum',
    blurb:
      'The receiving hall for all the blood returning from the body. It passes everything down through the tricuspid valve to the right ventricle.',
    dot: { x: 395, y: 435 },
    label: { x: 60, y: 440, anchor: 'start' },
    leader: { x1: 198, y1: 442, x2: 388, y2: 436 },
  },
  {
    id: 'right-ventricle',
    name: 'Right ventricle',
    latin: 'ventriculus dexter',
    blurb:
      'Pumps oxygen-poor blood to the lungs. Its wall is relatively thin — the lungs are a short, low-pressure trip compared with the whole body.',
    dot: { x: 432, y: 588 },
    label: { x: 60, y: 585, anchor: 'start' },
    leader: { x1: 222, y1: 590, x2: 425, y2: 589 },
  },
  {
    id: 'ivc',
    name: 'Inferior vena cava',
    latin: 'vena cava inferior',
    blurb:
      'The great vein of the lower body. It collects oxygen-poor blood from the legs and abdomen and delivers it to the right atrium from below.',
    dot: { x: 495, y: 712 },
    label: { x: 60, y: 738, anchor: 'start' },
    leader: { x1: 248, y1: 745, x2: 488, y2: 714 },
  },
  {
    id: 'aorta',
    name: 'Aorta',
    latin: 'aorta',
    blurb:
      "The body's main highway. Every drop of oxygen-rich blood the left ventricle ejects leaves through the aorta and its branches — to the brain, the organs, and the limbs.",
    dot: { x: 838, y: 152 },
    label: { x: 952, y: 142, anchor: 'start' },
    leader: { x1: 948, y1: 148, x2: 844, y2: 153 },
  },
  {
    id: 'pulmonary-veins',
    name: 'Pulmonary veins',
    latin: 'venae pulmonales',
    blurb:
      'The exception among veins: they carry oxygen-rich blood, fresh from the lungs, into the left atrium. Usually four of them — two from each lung.',
    dot: { x: 918, y: 378 },
    label: { x: 952, y: 385, anchor: 'start' },
    leader: { x1: 948, y1: 388, x2: 924, y2: 380 },
  },
  {
    id: 'left-atrium',
    name: 'Left atrium',
    latin: 'atrium sinistrum',
    blurb:
      'Receives oxygen-rich blood from the lungs and passes it through the mitral valve to the left ventricle.',
    dot: { x: 820, y: 432 },
    label: { x: 952, y: 460, anchor: 'start' },
    leader: { x1: 948, y1: 462, x2: 827, y2: 434 },
  },
  {
    id: 'left-ventricle',
    name: 'Left ventricle',
    latin: 'ventriculus sinister',
    blurb:
      'The strongest chamber. Its wall is three times thicker than the right ventricle’s, because it generates the pressure that drives blood around the entire body.',
    dot: { x: 802, y: 598 },
    label: { x: 952, y: 600, anchor: 'start' },
    leader: { x1: 948, y1: 602, x2: 809, y2: 599 },
  },
  {
    id: 'apex',
    name: 'Apex',
    latin: 'apex cordis',
    blurb:
      'The heart’s pointed tip, formed by the left ventricle. It points down and to the left — press two fingers below your left nipple and you can feel it beat.',
    dot: { x: 712, y: 802 },
    label: { x: 952, y: 735, anchor: 'start' },
    leader: { x1: 948, y1: 738, x2: 719, y2: 797 },
  },
]

const VESSEL_PATHS: Record<string, { d: string; color: string; width: number }> = {
  'pulmonary-artery': {
    d: 'M592,302 C480,240 400,225 332,215',
    color: '#5F83C2',
    width: 58,
  },
  svc: { d: 'M520,208 L520,308', color: '#5F83C2', width: 68 },
  ivc: { d: 'M495,640 L495,745', color: '#5F83C2', width: 64 },
  aorta: {
    d: 'M755,300 C750,200 720,150 660,135 C600,120 545,155 525,230 C515,270 512,300 512,318',
    color: '#D64545',
    width: 62,
  },
  'pulmonary-veins': {
    d: 'M845,390 L928,377 M850,455 L932,460',
    color: '#D64545',
    width: 34,
  },
}

const CHAMBER_PATHS: Record<string, { d: string; fill: string; base: number }> = {
  'right-atrium': {
    d: 'M470,290 C390,300 355,370 350,445 C430,430 500,425 565,428 C560,380 562,330 568,300 C535,292 500,288 470,290 Z',
    fill: 'url(#raGrad)',
    base: 0.38,
  },
  'right-ventricle': {
    d: 'M350,445 C355,560 430,650 520,720 C560,750 610,775 655,788 C620,700 590,560 578,428 C500,425 430,430 350,445 Z',
    fill: 'url(#rvGrad)',
    base: 0.38,
  },
  'left-atrium': {
    d: 'M568,300 C650,290 760,300 810,360 C830,385 842,415 848,450 C760,440 660,432 578,428 C575,385 572,340 568,300 Z',
    fill: 'url(#laGrad)',
    base: 0.3,
  },
  'left-ventricle': {
    d: 'M640,465 C720,450 790,445 848,450 C845,560 800,650 770,730 C755,775 720,800 690,790 C700,690 680,560 640,465 Z',
    fill: 'url(#lvGrad)',
    base: 0.5,
  },
}

const BODY_D =
  'M470,290 C560,282 700,300 780,345 C860,390 878,480 862,580 C845,680 795,760 748,800 C720,822 690,812 655,788 C560,725 440,640 385,545 C338,465 340,375 390,330 C415,305 440,293 470,290 Z'

const JOURNEY: { title: string; ids: string[]; text: string }[] = [
  {
    title: 'From the body',
    ids: ['svc', 'ivc'],
    text: 'Oxygen-poor blood returns from the whole body through the two great veins — the superior vena cava from above, the inferior vena cava from below.',
  },
  {
    title: 'Right atrium',
    ids: ['right-atrium'],
    text: 'Both veins empty into the right atrium, the heart’s first receiving chamber.',
  },
  {
    title: 'Right ventricle',
    ids: ['right-ventricle'],
    text: 'The blood drops through the tricuspid valve into the right ventricle.',
  },
  {
    title: 'To the lungs',
    ids: ['pulmonary-artery'],
    text: 'The right ventricle pumps it through the pulmonary artery — the one artery that carries oxygen-poor blood — out to the lungs.',
  },
  {
    title: 'Back from the lungs',
    ids: ['pulmonary-veins'],
    text: 'Now loaded with oxygen, the blood returns through the pulmonary veins — the only veins that carry oxygen-rich blood.',
  },
  {
    title: 'Left atrium',
    ids: ['left-atrium'],
    text: 'It collects briefly in the left atrium, the second receiving chamber.',
  },
  {
    title: 'Left ventricle',
    ids: ['left-ventricle'],
    text: 'Through the mitral valve into the left ventricle — the thickest, strongest wall in the heart.',
  },
  {
    title: 'Out to the body',
    ids: ['aorta'],
    text: 'One powerful contraction sends the blood out through the aorta to the entire body. The full circuit takes about a minute.',
  },
]

const FLOW_BLUE =
  'M520,120 L520,300 C520,350 500,370 480,400 C460,450 470,520 490,570 C500,500 530,400 565,335 C505,268 425,228 332,215 L245,215'
const FLOW_RED =
  'M1015,382 L880,388 C815,393 762,408 738,448 C716,495 718,580 730,650 C700,540 655,420 648,320 C645,230 650,160 655,98'

const ekgSegment = (x: number) => `H${x + 105} l9 -3 l7 -15 l9 27 l7 -13 l3 5`
const EKG_D = `M0 26 ${[0, 300, 600, 900].map(ekgSegment).join(' ')} H1200`

export default function InteractiveHeart({ bare = false }: { bare?: boolean }) {
  const [mode, setMode] = useState<'explore' | 'journey'>('explore')
  const [selected, setSelected] = useState('left-ventricle')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [phase, setPhase] = useState<'systole' | 'diastole'>('diastole')
  const [flowOn, setFlowOn] = useState(true)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setPhase((p) => (p === 'systole' ? 'diastole' : 'systole')), 850)
    return () => clearInterval(t)
  }, [playing])

  const activeIds = useMemo(
    () => (mode === 'explore' ? [selected] : JOURNEY[step].ids),
    [mode, selected, step],
  )
  const active = (id: string) => activeIds.includes(id)
  const selectedInfo = STRUCTURES.find((s) => s.id === selected) ?? STRUCTURES[0]

  const pick = (id: string) => {
    if (mode === 'explore') setSelected(id)
  }

  return (
    <div
      className={
        bare
          ? ''
          : 'overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]'
      }
    >
      <div className="grid lg:grid-cols-[1.55fr_1fr]">
        {/* ------------------------------ Diagram ------------------------------ */}
        <div
          className="min-w-0 p-3 sm:p-5"
          style={{
            background:
              'radial-gradient(ellipse 105% 90% at 50% 30%, #FBF8F2 0%, #F5EFE3 55%, #EDE3D0 100%)',
          }}
        >
          <svg viewBox="0 0 1200 900" className="h-auto w-full select-none" role="img" aria-label="Interactive diagram of the human heart — select a label to explore that structure">
            <defs>
              <radialGradient id="bodyGrad" cx="38%" cy="28%" r="85%">
                <stop offset="0%" stopColor="#E8705C" />
                <stop offset="55%" stopColor="#CE4238" />
                <stop offset="100%" stopColor="#A02B24" />
              </radialGradient>
              <linearGradient id="raGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#97363F" />
                <stop offset="100%" stopColor="#6E242E" />
              </linearGradient>
              <linearGradient id="rvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8D323C" />
                <stop offset="100%" stopColor="#66222B" />
              </linearGradient>
              <linearGradient id="laGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C24839" />
                <stop offset="100%" stopColor="#97322A" />
              </linearGradient>
              <linearGradient id="lvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F07E65" />
                <stop offset="100%" stopColor="#D5503C" />
              </linearGradient>
              <radialGradient id="sheenGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
              <clipPath id="heartClip">
                <path d={BODY_D} />
              </clipPath>
              <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#7A1F1A" floodOpacity="0.35" />
              </filter>
            </defs>
            <ellipse cx="600" cy="852" rx="320" ry="22" fill="#16222E" opacity="0.05" />
            <ellipse cx="600" cy="850" rx="280" ry="18" fill="#16222E" opacity="0.09" />

            {/* vessels behind the heart body */}
            <path d="M560,245 C700,215 800,215 832,222" fill="none" stroke="#5F83C2" strokeWidth="50" strokeLinecap="round" />

            {/* heartbeat group: vessels + body scale together */}
            <g
              className="svg-origin"
              filter="url(#heartShadow)"
              style={{
                transform: playing && phase === 'systole' ? 'scale(1.025)' : 'scale(1)',
                transition: 'transform 320ms ease',
              }}
            >
              {/* vessel halos + shapes + sheen + click targets */}
              {Object.entries(VESSEL_PATHS).map(([id, v]) => (
                <g key={id}>
                  {active(id) && (
                    <path d={v.d} fill="none" stroke={v.color} strokeWidth={v.width + 22} strokeLinecap="round" opacity="0.3" pointerEvents="none" />
                  )}
                  <path d={v.d} fill="none" stroke={v.color} strokeWidth={v.width} strokeLinecap="round" />
                  <path
                    d={v.d}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={Math.max(8, v.width * 0.34)}
                    strokeLinecap="round"
                    opacity="0.16"
                    transform="translate(-7 -9)"
                    pointerEvents="none"
                  />
                  <path
                    d={v.d}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={v.width + 30}
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() => pick(id)}
                    onMouseEnter={() => pick(id)}
                  />
                </g>
              ))}
              {/* SVC opening + aorta branches */}
              <ellipse cx="520" cy="206" rx="38" ry="13" fill="#4D6EA3" />
              <ellipse cx="508" cy="202" rx="16" ry="5" fill="#8FB0DC" opacity="0.7" />
              <g stroke="#D64545" strokeWidth="20" strokeLinecap="round">
                <path d="M655,128 L655,92" />
                <path d="M608,133 L599,96" />
                <path d="M702,140 L713,103" />
              </g>

              {/* heart body */}
              <path d={BODY_D} fill="url(#bodyGrad)" stroke="#8E2A24" strokeWidth="3" />
              {/* chamber overlays (clickable) */}
              {Object.entries(CHAMBER_PATHS).map(([id, c]) => (
                <path
                  key={id}
                  d={c.d}
                  fill={c.fill}
                  opacity={active(id) ? 0.85 : activeIds.length && !active(id) ? Math.min(c.base, 0.14) : c.base}
                  className="cursor-pointer transition-opacity duration-300"
                  onClick={() => pick(id)}
                  onMouseEnter={() => pick(id)}
                />
              ))}
              <path d="M352,462 C480,432 700,428 858,448" fill="none" stroke="#8E2A24" strokeWidth="3" opacity="0.5" />
              <path d="M600,440 C615,560 650,690 700,792" fill="none" stroke="#8E2A24" strokeWidth="4" opacity="0.55" />
              <path d="M612,470 C625,575 655,690 695,780" fill="none" stroke="#F08374" strokeWidth="5" opacity="0.5" />
              {/* surface detail: coronary curves + a soft sheen, clipped to the body */}
              <g clipPath="url(#heartClip)" pointerEvents="none">
                <path d="M648,468 C640,560 656,662 692,762" fill="none" stroke="#7E211B" strokeWidth="7" opacity="0.28" strokeLinecap="round" />
                <path d="M650,545 C612,578 578,602 546,618" fill="none" stroke="#7E211B" strokeWidth="5" opacity="0.22" strokeLinecap="round" />
                <path d="M470,470 C500,540 520,620 522,700" fill="none" stroke="#7E211B" strokeWidth="5" opacity="0.18" strokeLinecap="round" />
                <ellipse cx="520" cy="385" rx="250" ry="155" fill="url(#sheenGrad)" opacity="0.5" />
                <ellipse cx="745" cy="690" rx="180" ry="150" fill="#7E211B" opacity="0.10" />
              </g>
              {/* apex click target */}
              <circle cx="712" cy="802" r="32" fill="transparent" className="cursor-pointer" onClick={() => pick('apex')} onMouseEnter={() => pick('apex')} />
            </g>

            {/* blood flow dots */}
            {flowOn && (
              <g pointerEvents="none">
                {[0, -2, -4].map((begin) => (
                  <circle key={`b${begin}`} r="10" fill="#3D639E" stroke="#F7F4EE" strokeWidth="2.5">
                    <animateMotion dur="6s" begin={`${begin}s`} repeatCount="indefinite" path={FLOW_BLUE} />
                  </circle>
                ))}
                {[0, -2, -4].map((begin) => (
                  <circle key={`r${begin}`} r="10" fill="#D64545" stroke="#F7F4EE" strokeWidth="2.5">
                    <animateMotion dur="6s" begin={`${begin}s`} repeatCount="indefinite" path={FLOW_RED} />
                  </circle>
                ))}
              </g>
            )}

            {/* leaders, dots, labels */}
            {STRUCTURES.map((s) => (
              <g key={s.id}>
                <line
                  x1={s.leader.x1}
                  y1={s.leader.y1}
                  x2={s.leader.x2}
                  y2={s.leader.y2}
                  stroke={active(s.id) ? '#0E7C86' : '#8494A7'}
                  strokeWidth={active(s.id) ? 3 : 2}
                />
                {active(s.id) && <circle cx={s.dot.x} cy={s.dot.y} r="10" fill="none" stroke="#0E7C86" strokeWidth="2.5" className="ping-ring" />}
                <circle cx={s.dot.x} cy={s.dot.y} r="16" fill={active(s.id) ? '#0E7C86' : '#16222E'} opacity="0.12" pointerEvents="none" />
                <circle
                  cx={s.dot.x}
                  cy={s.dot.y}
                  r={active(s.id) ? 11 : 9}
                  fill={active(s.id) ? '#0E7C86' : '#16222E'}
                  stroke="#F7F4EE"
                  strokeWidth="3"
                  className="cursor-pointer"
                  onClick={() => pick(s.id)}
                  onMouseEnter={() => pick(s.id)}
                />
                <text
                  x={s.label.x}
                  y={s.label.y}
                  textAnchor={s.label.anchor}
                  fontFamily="Archivo, sans-serif"
                  fontSize="22"
                  fontWeight={active(s.id) ? 800 : 600}
                  fill={active(s.id) ? '#0A5F66' : '#33475B'}
                  paintOrder="stroke"
                  stroke="#F7F4EE"
                  strokeWidth="4"
                  className="cursor-pointer"
                  onClick={() => pick(s.id)}
                  onMouseEnter={() => pick(s.id)}
                >
                  {s.name}
                </text>
              </g>
            ))}
          </svg>

          {/* EKG strip */}
          <div className="mt-2 flex items-center gap-3 px-1">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">ECG · lead II</span>
            <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="h-9 min-w-0 flex-1" aria-hidden>
              <path d={EKG_D} fill="none" stroke="#D7DEE8" strokeWidth="2.5" />
              {playing && <path d={EKG_D} fill="none" stroke="#0E7C86" strokeWidth="8" opacity="0.15" className="ekg-anim" />}
              {playing && <path d={EKG_D} fill="none" stroke="#0E7C86" strokeWidth="3" className="ekg-anim" />}
            </svg>
            <span className="font-mono text-[0.68rem] text-ink-400">{playing ? '±70 bpm' : 'paused'}</span>
          </div>
        </div>

        {/* ------------------------------- Panel ------------------------------- */}
        <div className="flex min-w-0 flex-col border-t border-line p-5 sm:p-6 lg:border-l lg:border-t-0">
          <div className="flex rounded-full border border-line bg-paper p-1" role="tablist" aria-label="Diagram mode">
            {(
              [
                ['explore', 'Explore'],
                ['journey', 'Follow the blood'],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full px-3 py-2 font-display text-sm font-bold transition-colors ${
                  mode === m ? 'bg-primary-600 text-white' : 'text-ink-700 hover:text-ink-950'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === 'explore' ? (
            <div className="mt-5">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary-700">{selectedInfo.latin}</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{selectedInfo.name}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{selectedInfo.blurb}</p>
              <p className="mt-4 text-sm text-ink-500">Tip: hover or tap any label on the diagram — vessels and chambers are all live.</p>
            </div>
          ) : (
            <div className="mt-5">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary-700">
                Step {step + 1} of {JOURNEY.length}
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">{JOURNEY[step].title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{JOURNEY[step].text}</p>
              <div className="mt-4 flex items-center gap-1.5" aria-hidden>
                {JOURNEY.map((_, i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary-600' : 'bg-line'}`} />
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                  ← Back
                </Button>
                <Button size="sm" onClick={() => setStep((s) => Math.min(JOURNEY.length - 1, s + 1))}>
                  Next step →
                </Button>
              </div>
            </div>
          )}

          <div className="mt-auto pt-6">
            <div className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant={playing ? 'accent' : 'primary'} onClick={() => setPlaying((p) => !p)}>
                  {playing ? '❚❚ Pause heartbeat' : '▶ Play heartbeat'}
                </Button>
                <button
                  onClick={() => setFlowOn((f) => !f)}
                  aria-pressed={flowOn}
                  className={`rounded-full border px-3.5 py-2 font-display text-sm font-bold transition-colors ${
                    flowOn ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-line bg-surface text-ink-500'
                  }`}
                >
                  Blood flow {flowOn ? 'on' : 'off'}
                </button>
              </div>
              {playing ? (
                <div className="mt-3">
                  <p className="font-display text-lg font-extrabold tracking-tight text-ink-950">
                    {phase === 'systole' ? 'Systole — squeeze' : 'Diastole — refill'}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-700">
                    {phase === 'systole'
                      ? 'The ventricles contract and eject blood. You hear the “lub”.'
                      : 'The chambers relax and refill with blood. You hear the “dub”.'}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5 font-mono text-[0.68rem]">
                    <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-line">
                      AV valves: {phase === 'systole' ? 'CLOSED' : 'OPEN'}
                    </span>
                    <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-line">
                      Semilunar valves: {phase === 'systole' ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  Press play to run the cycle at a resting pace — watch the chambers squeeze, the valves
                  swap, and the ECG trace sweep.
                </p>
              )}
            </div>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-arterial-500" /> Oxygen-rich blood
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-venous-500" /> Oxygen-poor blood
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
