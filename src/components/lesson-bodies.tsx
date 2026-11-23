import type { ReactNode } from 'react'
import { AnatomyFigure, Callout, DefinitionBox, SpecTable } from './wiki'
import { EkgDivider, FlashCards, Quiz } from './study-tools'
import type { FlashCardData, QuizQuestion } from './study-tools'
import { AppendectomyCaseLab, BloodVesselLab, BrainLab, CabgLab, CardiacCycleLab, CholecystectomyCaseLab, ConductionLab, GiTractLab, InstrumentsLab } from './lesson-labs'
import AirwayLabCard from './AirwayLabCard'
import BrainLabCard from './BrainLabCard'
import LiverLabCard from './LiverLabCard'
import LungsLabCard from './LungsLabCard'
import MuscleLabCard from './MuscleLabCard'
import NeuronLabCard from './NeuronLabCard'
import SkeletonLabCard from './SkeletonLabCard'

/* ------------------------------------------------------------------ */
/* Complete lesson bodies: Lab → Reading chapter → Check yourself.     */
/* Every available lesson follows this exact anatomy.                  */
/* ------------------------------------------------------------------ */

function BodyShell({
  lab,
  chapterTitle,
  chapter,
  cards,
  questions,
  closing,
}: {
  lab: ReactNode
  chapterTitle: string
  chapter: ReactNode
  cards: FlashCardData[]
  questions: QuizQuestion[]
  closing: ReactNode
}) {
  return (
    <>
      <section aria-label="Interactive lab">
        <h2 className="mb-4 flex items-baseline gap-3 font-display text-[1.4rem] font-extrabold tracking-tight text-ink-950">
          <span className="font-mono text-sm font-normal text-arterial-500">A</span> The lab
        </h2>
        {lab}
      </section>

      <EkgDivider />

      <section aria-label="Reading chapter">
        <h2 className="mb-4 flex items-baseline gap-3 font-display text-[1.4rem] font-extrabold tracking-tight text-ink-950">
          <span className="font-mono text-sm font-normal text-arterial-500">B</span> The reading chapter
        </h2>
        <article className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
          <h3 className="max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-950">
            {chapterTitle}
          </h3>
          {chapter}
        </article>
      </section>

      <EkgDivider />

      <section aria-label="Exercises">
        <h2 className="mb-4 flex items-baseline gap-3 font-display text-[1.4rem] font-extrabold tracking-tight text-ink-950">
          <span className="font-mono text-sm font-normal text-arterial-500">C</span> Check yourself
        </h2>
        <h3 className="mb-4 font-display text-lg font-bold tracking-tight text-ink-950">Flashcards — tap to flip</h3>
        <FlashCards cards={cards} />
        <h3 className="mb-4 mt-10 font-display text-lg font-bold tracking-tight text-ink-950">Quick quiz — three questions</h3>
        <Quiz questions={questions} />
      </section>

      <div className="mt-8">{closing}</div>
    </>
  )
}

/* ------------------------- Arteries, veins, capillaries ------------------------- */

export function VesselsLessonBody() {
  return (
    <BodyShell
      lab={<BloodVesselLab />}
      chapterTitle="Three Kinds of Pipe, Three Different Jobs"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              Every blood vessel is a tube, but the three kinds are built for opposite problems.{' '}
              <strong>Arteries</strong> have a pressure problem: blood arrives from the heart in
              pulses, so their walls are thick, elastic, and muscular. They stretch as each pulse
              arrives and recoil between beats, smoothing the flow. Their smaller branches, the{' '}
              <strong>arterioles</strong>, act as taps — by narrowing or widening, they decide how
              much blood each tissue receives and set much of the body&rsquo;s blood pressure.
            </p>
            <p>
              <strong>Capillaries</strong> have a distance problem. Exchange — oxygen out, carbon
              dioxide in, nutrients delivered, waste collected — happens by diffusion, and diffusion
              only works over tiny distances. So the capillary wall is a single layer of cells, the
              vessel is barely wider than a red blood cell, and because there are billions of them,
              their combined width is enormous. Blood slows down inside capillaries precisely
              because the road suddenly becomes very wide in total — and that slowness is the point:
              it buys time for exchange.
            </p>
            <p>
              <strong>Veins</strong> have a gravity problem. By the time blood reaches them, the
              heart&rsquo;s push is mostly spent, yet blood in the legs must climb back uphill. Veins
              answer with wide, thin-walled tubes that hold most of the blood volume, one-way{' '}
              <strong>valves</strong> that stop backflow, and help from the muscles around them —
              every step you take squeezes the deep veins and milks blood toward the heart.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Vessel', 'Wall', 'Defining job']}
              rows={[
                ['Artery', 'Thick, elastic, muscular', 'Carries blood away from the heart under pressure'],
                ['Capillary', 'One cell thick', 'Exchange between blood and tissue'],
                ['Vein', 'Thin, wide lumen, often valved', 'Returns blood to the heart at low pressure'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Endothelium" latin="endothelium">
              The single layer of flat cells lining every blood vessel — and the entire wall of a
              capillary. It is not a passive coating: it controls clotting, vessel tone, and what
              may pass between blood and tissue.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-vessels-gray448.png"
              alt="Gray's Anatomy plate 448: transverse section through a small artery and vein under magnification"
              caption="Real anatomy reference — a small artery and vein cut across and magnified ×350. The artery (left) is almost all wall; the vein is thin-walled with a wide, collapsing lumen — the same contrast the lab above draws as a diagram."
              credit="Gray's Anatomy (1918), plate 448 · Public domain · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Endothelium', latin: 'endothelium', back: 'The one-cell lining of all blood vessels. In capillaries it is the whole wall — the surface across which exchange happens.' },
        { term: 'Arteriole', latin: 'arteriola', back: 'A small muscular artery branch that works like a tap: narrowing raises resistance, widening lets more blood into a tissue.' },
        { term: 'Venous valve', latin: 'valva venosa', back: 'A pair of flaps inside many veins that let blood pass toward the heart and fold shut against backflow.' },
        { term: 'Vasoconstriction', latin: 'vasoconstrictio', back: 'Narrowing of a vessel by contraction of its smooth-muscle wall. The opposite, widening, is vasodilation.' },
      ]}
      questions={[
        {
          q: 'Which vessel has a wall only one cell thick?',
          options: ['Artery', 'Capillary', 'Vein', 'Arteriole'],
          answer: 1,
          why: 'The capillary — its wall is just endothelium, because diffusion across it is the whole job.',
        },
        {
          q: 'Why do veins in the legs need valves?',
          options: [
            'To speed the pulse up',
            'Because pressure is low and blood must not slip back down',
            'To filter the blood',
            'To make the blood blue',
          ],
          answer: 1,
          why: 'Venous pressure is too low to guarantee one-way flow against gravity, so valves block the backflow.',
        },
        {
          q: 'Which vessels act as the taps that control blood distribution and pressure?',
          options: ['Capillaries', 'Venous valves', 'Arterioles', 'The aorta alone'],
          answer: 2,
          why: 'Arterioles — their muscular walls narrow or widen to steer flow and set peripheral resistance.',
        },
      ]}
      closing={
        <Callout kind="key">
          Blood slows down in the capillaries even though each one is tiny — because their combined
          cross-section is the widest part of the whole circuit. Wide total road, slow traffic, time
          to trade.
        </Callout>
      }
    />
  )
}

/* ------------------------------ Lungs and pleura ------------------------------ */

export function LungsLessonBody() {
  return (
    <BodyShell
      lab={<LungsLabCard />}
      chapterTitle="Two Lungs, One Air Supply"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              The lungs sit on either side of the heart, and they are not twins. The{' '}
              <strong>right lung</strong> is wider and has <strong>three lobes</strong>; the{' '}
              <strong>left lung</strong> has <strong>two lobes</strong> and a{' '}
              <strong>cardiac notch</strong> — a bite taken out of its front edge where the heart
              sits. Air reaches them through one shared road: the <strong>trachea</strong> splits at
              its base into two <strong>bronchi</strong>, one entering each lung at the{' '}
              <strong>hilum</strong>, the doorway where bronchi, vessels, and nerves all pass.
            </p>
            <p>
              Each lung is wrapped in the <strong>pleura</strong>, a double membrane with a division
              of labour. The <strong>visceral pleura</strong> clings to the lung surface itself; the{' '}
              <strong>parietal pleura</strong> lines the chest wall and diaphragm. Between them lies
              the <strong>pleural cavity</strong> — not an open space, but a potential one, holding
              only a thin film of fluid. That film does two jobs at once: it lets the lung slide
              frictionlessly as it moves, and it couples the lung to the chest wall, so when the
              chest expands, the lung is pulled open with it.
            </p>
            <p>
              The pulling is done by muscle. The <strong>diaphragm</strong> domes up under the lungs
              at rest; when it contracts, it flattens downward, the chest cavity grows, pressure
              inside falls — and air flows in down the gradient. Relax it, and the elastic lungs
              recoil, pushing air back out. Breathing, mechanically, is just changing the size of a
              box and letting physics move the air — exactly what the lab above lets you play with.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Feature', 'Right lung', 'Left lung']}
              rows={[
                ['Lobes', 'Three (upper, middle, lower)', 'Two (upper, lower)'],
                ['Main bronchus', 'Wider, shorter, steeper', 'Narrower, longer, more angled'],
                ['Landmark', 'Horizontal + oblique fissures', 'Cardiac notch for the heart'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Pleural cavity" latin="cavitas pleuralis">
              The thin, fluid-filled potential space between the visceral and parietal pleura. Its
              fluid film makes the lung follow the chest wall — if air enters this space, the lung
              can peel away and collapse.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-lungs-gray962.png"
              alt="Gray's Anatomy plate 962: the lungs separated and cut away to expose the bronchi and bronchioles"
              caption="Real anatomy reference — the lungs pulled apart and cut to expose the bronchi and bronchioles inside: the branching air-tubes the breathing lab animates, drawn from a real dissection."
              credit="Gray's Anatomy (1918), plate 962 · Public domain · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Pleura', latin: 'pleura', back: 'The double membrane around each lung: visceral layer on the lung, parietal layer on the chest wall, fluid film between them.' },
        { term: 'Hilum', latin: 'hilum pulmonis', back: 'The doorway on the inner side of each lung where the bronchus, pulmonary vessels, and nerves enter and leave.' },
        { term: 'Lobe', latin: 'lobus', back: 'A major division of a lung, separated by fissures: three on the right, two on the left. Each lobe has its own bronchus and blood supply.' },
        { term: 'Diaphragm', latin: 'diaphragma', back: 'The dome-shaped muscle floor of the chest. It contracts and flattens to draw air in, and relaxes into its dome to let air out.' },
      ]}
      questions={[
        {
          q: 'How many lobes does the right lung have?',
          options: ['One', 'Two', 'Three', 'Four'],
          answer: 2,
          why: 'Three — upper, middle, and lower. The left lung has two, plus the cardiac notch.',
        },
        {
          q: 'Which pleural layer lies directly on the lung surface?',
          options: ['Parietal pleura', 'Visceral pleura', 'Pericardium', 'Peritoneum'],
          answer: 1,
          why: 'Visceral = on the organ itself. Parietal = on the surrounding wall.',
        },
        {
          q: 'When the diaphragm contracts, what happens?',
          options: [
            'It domes upward and pushes air out',
            'It flattens downward, the chest expands, and air flows in',
            'It closes the trachea',
            'Nothing — breathing is driven by the lungs themselves',
          ],
          answer: 1,
          why: 'Contraction flattens the dome, enlarging the chest cavity. Pressure falls and air follows the gradient in.',
        },
      ]}
      closing={
        <Callout kind="key">
          The lung has no muscle of its own for breathing in. It inflates because the pleural fluid
          film glues it to the moving chest wall and diaphragm — break that coupling with air in the
          pleural space (a pneumothorax) and the lung collapses away from the wall.
        </Callout>
      }
    />
  )
}

/* ------------------------------- Cardiac cycle ------------------------------- */

export function CardiacCycleLessonBody() {
  return (
    <BodyShell
      lab={<CardiacCycleLab />}
      chapterTitle="One Beat, Four Movements"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              One heartbeat — one <strong>cardiac cycle</strong> — takes about 0.8 seconds at rest,
              and everything in it is driven by pressure. Heart muscle contracts (
              <strong>systole</strong>) or relaxes (<strong>diastole</strong>); pressure rises and
              falls; and the valves, which have no muscles and make no decisions, are simply pushed
              open or shut by whichever side has the higher pressure. Learn the pressures and the
              valves explain themselves.
            </p>
            <p>
              The sequence runs: atria contract to top up the ventricles; the ventricles contract,
              closing the AV valves — that closure is the first heart sound, <strong>S1</strong>, the
              “lub” — and eject blood into the great arteries; the ventricles relax, the semilunar
              valves close to stop the blood falling back — <strong>S2</strong>, the “dub” — and
              finally the AV valves reopen and the ventricles refill, mostly passively, before the
              next beat. Two sounds, four movements, one pressure story.
            </p>
            <p>
              Diastole is not downtime. The left ventricle receives most of its own blood supply{' '}
              <em>during</em> diastole, because during systole its contracting wall squeezes its own
              coronary vessels shut. This is one reason a very fast heart rate is costly: the faster
              the beat, the shorter the diastole — and the less time the heart has to feed itself.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Phase', 'AV valves', 'Semilunar valves']}
              rows={[
                ['Atrial systole', 'Open — topping up', 'Closed'],
                ['Ventricular ejection', 'Closed (S1)', 'Open — blood leaves'],
                ['Early diastole', 'Closed', 'Closed (S2)'],
                ['Filling', 'Open — passive inflow', 'Closed'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Stroke volume" latin="volumen systolicum">
              The amount of blood one ventricle ejects in a single beat — roughly 70 mL at rest.
              Multiply it by heart rate and you get cardiac output, the heart&rsquo;s delivery rate
              per minute.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-cardiac-cycle-openstax.jpg"
              alt="OpenStax diagram of the phases of the cardiac cycle, showing the heart in atrial systole, ventricular systole, and diastole"
              caption="Real anatomy reference — the cardiac cycle as drawn in a standard anatomy textbook: the same phases you stepped through in the lab, shown as one continuous loop with valve states and pressures."
              credit="OpenStax Anatomy & Physiology, fig. 2027 · CC BY 3.0 · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'S1 — “lub”', latin: 'sonus primus', back: 'The first heart sound: the tricuspid and mitral (AV) valves closing as the ventricles begin to contract.' },
        { term: 'S2 — “dub”', latin: 'sonus secundus', back: 'The second heart sound: the aortic and pulmonary (semilunar) valves closing as the ventricles relax.' },
        { term: 'Stroke volume', latin: 'volumen systolicum', back: 'Blood ejected by one ventricle per beat — about 70 mL at rest. Stroke volume × heart rate = cardiac output.' },
        { term: 'Diastole', latin: 'diastole', back: 'The relaxation phase of the cycle. Chambers refill — and the left ventricle’s own coronary supply flows mainly during this phase.' },
      ]}
      questions={[
        {
          q: 'The first heart sound (S1) is the sound of…',
          options: [
            'The semilunar valves opening',
            'The AV valves closing',
            'Blood hitting the aorta wall',
            'The atria contracting',
          ],
          answer: 1,
          why: 'S1 = AV (tricuspid and mitral) valves closing at the start of ventricular systole.',
        },
        {
          q: 'During ventricular ejection, the valves are…',
          options: [
            'AV open, semilunar closed',
            'Both open',
            'AV closed, semilunar open',
            'Both closed',
          ],
          answer: 2,
          why: 'Pressure shuts the AV valves (preventing backflow into the atria) and forces the semilunar valves open.',
        },
        {
          q: 'Why does the left ventricle get much of its own blood flow during diastole?',
          options: [
            'The aorta is closed during systole',
            'Its contracting wall squeezes its own coronary vessels during systole',
            'Coronary arteries only exist on the left',
            'Blood flows backwards in diastole',
          ],
          answer: 1,
          why: 'Systole compresses the vessels inside the left ventricular wall; when the muscle relaxes in diastole, flow resumes.',
        },
      ]}
      closing={
        <Callout kind="key">
          Valves are passive doors. Every opening and closing in this lesson is a pressure
          difference doing the work — the heart&rsquo;s real skill is not moving its valves, but
          timing its pressures.
        </Callout>
      }
    />
  )
}

/* ---------------------------------- CABG ---------------------------------- */

export function CabgLessonBody() {
  return (
    <BodyShell
      lab={<CabgLab />}
      chapterTitle="A Detour for a Blocked Highway"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              A coronary bypass — <strong>CABG</strong>, pronounced “cabbage” — does not remove the
              blockage in a coronary artery. It builds a road around it. A spare vessel, the{' '}
              <strong>graft</strong>, is connected so that blood enters the coronary artery{' '}
              <em>beyond</em> the narrowed segment, re-supplying the heart muscle downstream. The
              plaque stays exactly where it was; the traffic simply stops needing that stretch of
              road.
            </p>
            <p>
              The graft material comes from the patient&rsquo;s own body. The{' '}
              <strong>internal thoracic artery</strong>, running inside the chest wall, can often be
              left attached at its origin and swung down to the heart. The{' '}
              <strong>saphenous vein</strong> from the leg is the classic alternative — it is sewn in
              reversed, so its own one-way valves do not block the new flow. The{' '}
              <strong>radial artery</strong> from the forearm is a third option. The far end of the
              graft is joined to the coronary artery with stitches finer than hair — that join is
              the <strong>anastomosis</strong>, and its quality decides much of the result.
            </p>
            <p>
              Operations vary: many are done with a heart-lung machine while the heart is still
              (“on-pump”), others on the beating heart (“off-pump”); some patients need one graft,
              others three or four in the same operation. What does not vary is the logic you played
              with above — find the starved territory, and give it a new supply line. A bypass
              treats the consequences of narrowed arteries, not the underlying disease, which is
              why medication and risk-factor control remain part of the treatment afterwards.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Graft source', 'Where it comes from', 'Notes']}
              rows={[
                ['Internal thoracic artery', 'Inside the chest wall', 'Often left attached at its origin; known for durability'],
                ['Saphenous vein', 'The leg', 'Sewn in reversed so its valves cannot block the new flow'],
                ['Radial artery', 'The forearm', 'A muscular artery; handled carefully to prevent spasm'],
              ]}
            />
          </div>
          <div className="mt-6">
            <Callout kind="warning" title="Scope of this lesson">
              This lesson explains how a bypass works as a concept. Whether any person needs one —
              or a stent, or medication alone — depends on their arteries, symptoms, and overall
              condition, and belongs to a cardiology and cardiac-surgery team, not a wiki.
            </Callout>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-cabg-grafts.jpg"
              alt="Medical illustration of a heart with three coronary bypass grafts in place: an internal mammary artery graft and two saphenous vein grafts"
              caption="Real anatomy reference — a heart carrying three bypass grafts: the internal mammary artery swung down from the chest wall, and saphenous vein grafts from the aorta, each sewn in beyond a blockage. This is the detour from the lab, drawn from real surgical anatomy."
              credit="Patrick J. Lynch, medical illustrator · CC BY 2.5 · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Anastomosis', latin: 'anastomosis', back: 'A surgical join between two vessels — here, the connection between the graft and the coronary artery beyond the blockage.' },
        { term: 'Graft', latin: 'insitio vascularis', back: 'A vessel used as a replacement pipe. In CABG it is the patient’s own artery or vein, rerouted to carry blood around a blockage.' },
        { term: 'Stenosis', latin: 'stenosis', back: 'An abnormal narrowing of a passage — in a coronary artery, usually caused by atherosclerotic plaque in the wall.' },
        { term: 'Ischemia', latin: 'ischaemia', back: 'Insufficient blood supply to a tissue. Heart muscle downstream of a severe stenosis becomes ischemic, especially when demand rises.' },
      ]}
      questions={[
        {
          q: 'Where is the far end of a bypass graft attached?',
          options: [
            'Into the blockage itself',
            'To the coronary artery beyond the blockage',
            'To the left atrium',
            'Around the aorta, as a band',
          ],
          answer: 1,
          why: 'Beyond (distal to) the narrowing — that is what lets blood re-enter and feed the starved muscle.',
        },
        {
          q: 'What does CABG do to the original plaque?',
          options: [
            'Dissolves it',
            'Removes it with the graft',
            'Leaves it in place and routes blood around it',
            'Crushes it flat, like a stent',
          ],
          answer: 2,
          why: 'A bypass is a detour, not a repair. Crushing plaque flat with a scaffold describes a stent — a different procedure.',
        },
        {
          q: 'Which graft is an artery taken from inside the chest wall?',
          options: ['Saphenous vein', 'Internal thoracic artery', 'Radial artery', 'Jugular vein'],
          answer: 1,
          why: 'The internal thoracic (mammary) artery — it can often stay attached at its origin and be swung down to the heart.',
        },
      ]}
      closing={
        <Callout kind="key">
          The whole operation is one sentence long: find the muscle that is starving, and sew it a
          new supply line past the blockage. Everything else — graft choice, pump or no pump, one
          graft or four — is engineering in service of that sentence.
        </Callout>
      }
    />
  )
}

/* ------------------- Operation case 1: appendicectomy ------------------- */

export function AppendectomyCaseBody() {
  return (
    <BodyShell
      lab={<AppendectomyCaseLab />}
      chapterTitle="The Pain That Moved"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              Every operation begins as a story, and appendicitis tells one of the most reliable
              stories in surgery. It usually starts with a blockage: a small hardened lump of faeces
              (an <strong>appendicolith</strong>) or swollen lymphoid tissue plugs the narrow lumen
              of the appendix. Bacteria multiply behind the blockage, the wall swells, and the organ
              begins to starve and inflame — <strong>acute appendicitis</strong>.
            </p>
            <p>
              The famous moving pain is physiology, not drama. Early on, the stretching appendix is
              served by <em>visceral</em> nerves that report vaguely to the midline — so the patient
              points at the umbilicus. Hours later the inflammation reaches the{' '}
              <em>parietal peritoneum</em>, the lining of the abdominal wall, which has precise
              localising nerves. Now the pain is sharp, and it sits exactly over the appendix, most
              often at <strong>McBurney’s point</strong>. When a patient describes pain that started
              in the middle and moved to the right lower quadrant, surgeons listen very carefully.
            </p>
            <p>
              The <strong>Alvarado score</strong> turns the story into arithmetic: points for
              migrating pain, nausea, tenderness, rebound, fever, and raised white cells. A score of
              7 or more makes appendicitis probable. The operation that answers it —{' '}
              <strong>appendicectomy</strong> (appendectomy in American spelling) — is usually
              laparoscopic: control the mesoappendix and its artery, tie the base, remove the organ,
              and send it to pathology. It is classified as an easy case not because it is trivial,
              but because the decision is clear and the steps are standard. The danger is never the
              operation; it is delay. A perforated appendix turns this tidy case into peritonitis —
              the same operation, a much sicker patient, and a far longer recovery.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Alvarado feature', 'Finding in this case', 'Points']}
              rows={[
                ['Migration of pain', 'Umbilicus → right lower quadrant', '1'],
                ['Anorexia / nausea', 'Nausea, one vomit, no appetite', '1'],
                ['Tenderness (right lower quadrant)', 'Present, with guarding', '2'],
                ['Rebound tenderness', 'Present', '1'],
                ['Fever', '37.9 °C', '1'],
                ['Raised white cells', 'WBC 14.2 with neutrophilia', '2'],
                ['Total', 'Probable appendicitis → theatre', '8 / 10'],
              ]}
            />
          </div>
          <div className="mt-6">
            <Callout kind="warning" title="Scope of this case">
              This is a teaching case with a fictional patient, written to explain how surgeons
              reason and operate. Real abdominal pain has many causes and always needs assessment
              by a clinician in person — a wiki score is never a diagnosis.
            </Callout>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <AnatomyFigure
              src="/assets/refs/ref-appendix-gray536.png"
              alt="Gray's Anatomy plate 536: the caecum and vermiform appendix with their arteries, the appendicular artery labelled"
              caption="Real anatomy reference — the caecum and vermiform process (appendix) with their blood supply. Trace the appendicular artery into the mesoappendix: that is the vessel the surgeon seals and divides in step 3 of the operation."
              credit="Gray's Anatomy (1918), plate 536 · Public domain · via Wikimedia Commons"
            />
            <AnatomyFigure
              src="/assets/refs/ref-mcburney.jpg"
              alt="Photograph of a real abdomen marking McBurney's point between the umbilicus and the anterior superior iliac spine"
              caption="Real anatomy reference — McBurney's point (1) on a real abdomen: one third of the way from the anterior superior iliac spine (3) toward the umbilicus (2). This is the spot the examining hand presses in stage 2 of the case."
              credit="Photo: Steven Fruitsmaak · CC BY-SA 3.0 · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'McBurney’s point', latin: 'punctum McBurney', back: 'The surface landmark of the appendix base: one third of the way from the anterior superior iliac spine to the umbilicus. Maximal tenderness here is a classic sign of appendicitis.' },
        { term: 'Appendicolith', latin: 'appendicolithus', back: 'A small hardened stone of faecal material lodged in the appendix lumen. It blocks drainage, drives the inflammation, and predicts a higher risk of perforation.' },
        { term: 'Mesoappendix', latin: 'mesoappendix', back: 'The small fold of peritoneum that suspends the appendix and carries the appendicular artery. In the operation it is sealed and divided before the appendix base is tied.' },
        { term: 'Peritonitis', latin: 'peritonitis', back: 'Inflammation of the peritoneum, the lining of the abdominal cavity — what happens if an inflamed appendix perforates and spills its contents. The complication this case was raced against.' },
      ]}
      questions={[
        {
          q: 'Why does appendicitis pain move from the umbilicus to the right lower quadrant?',
          options: [
            'The appendix physically slides across the abdomen',
            'Early visceral pain is vague and midline; later the inflamed organ irritates the parietal peritoneum, which localises precisely',
            'Gas builds up and pushes the pain downward',
            'The patient only notices the real pain later',
          ],
          answer: 1,
          why: 'Two different nerve systems report in sequence: visceral afferents first (dull, central), then the parietal peritoneum (sharp, localised over the appendix).',
        },
        {
          q: 'An Alvarado score of 8 means…',
          options: [
            'Appendicitis is ruled out',
            'Observe for a week and rescan',
            'Appendicitis is probable — proceed toward surgery',
            'The appendix has already perforated',
          ],
          answer: 2,
          why: 'Scores of 7–10 are the “probable” band. Perforation is a separate finding (imaging, theatre, pathology) — the score itself never states it.',
        },
        {
          q: 'In the operation, why is the mesoappendix divided before the appendix base is tied?',
          options: [
            'It is only a ritual step',
            'It carries the appendicular artery — controlling it first frees the appendix and prevents bleeding',
            'It makes the specimen smaller',
            'It is where the appendicolith sits',
          ],
          answer: 1,
          why: 'The mesoappendix is the appendix’s supply line. Seal and divide it, and the organ is mobile with its blood supply already controlled.',
        },
      ]}
      closing={
        <Callout kind="key">
          The whole case is one chain: blockage → inflammation → a pain that moves → a score that
          convinces → a short operation that removes the problem. Learn to hear the story early,
          because in appendicitis the clock — not the surgery — is the dangerous part.
        </Callout>
      }
    />
  )
}

/* --------------------------- Conduction system --------------------------- */

export function ConductionLessonBody() {
  return (
    <BodyShell
      lab={<ConductionLab />}
      chapterTitle="A Heart That Beats Itself"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              The heart does not wait for orders from the brain. Scattered through it are{' '}
              <strong>pacemaker cells</strong> — muscle cells that have traded contraction for
              rhythm and generate their own electrical impulse, over and over, for a lifetime. The
              fastest of them, the <strong>sinoatrial (SA) node</strong>, sits in the wall of the{' '}
              <strong>right atrium</strong> near the entrance of the superior vena cava and fires
              about 60–100 times a minute at rest. It is the heart&rsquo;s natural pacemaker: every
              normal heartbeat begins there, as a spark that then has to travel.
            </p>
            <p>
              The route matters as much as the spark. The impulse spreads across both atria — the{' '}
              <strong>P wave</strong> on an ECG — and then reaches the{' '}
              <strong>atrioventricular (AV) node</strong>, where it is deliberately held for about{' '}
              <strong>0.12–0.20 seconds</strong>. That pause, the <strong>PR interval</strong>, is
              the key piece of engineering in the whole system: it lets the atria finish emptying
              into the ventricles before the ventricles contract. Without it, atria and ventricles
              would squeeze at the same moment and the top-up would be wasted. Past the node, the
              impulse sprints down the <strong>bundle of His</strong> and its branches and sprays
              out through the <strong>Purkinje fibers</strong>, so both ventricles depolarize — the{' '}
              <strong>QRS complex</strong> — and contract as one.
            </p>
            <p>
              Notice the wiring is tuned, not just connected. The AV node is slow because a pause
              is needed there; the His–Purkinje system is fast because synchrony is needed there.
              And the system has backups: if the SA node fails, the AV node can take over at about
              40–60 beats a minute, and if the AV node fails too, the ventricles fall back on their
              own escape rhythm of roughly 20–40. The brain does not keep the beat — the{' '}
              <strong>autonomic nervous system</strong> only adjusts the tempo, sympathetic speeding
              the SA node up, parasympathetic (vagus) slowing it down.
            </p>
            <p>
              When the wiring breaks, the ECG shows it. In <strong>heart block</strong>, the signal
              is delayed or stopped at the AV node: a first-degree block stretches the PR interval,
              while a complete (third-degree) block disconnects the two halves of the heart entirely
              — the atria keep their own rhythm and the ventricles escape slowly on their own. That
              is the failure the AV block demo in the lab above lets you play with.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Station', 'Where it sits', 'Speed / job']}
              rows={[
                ['SA node', 'Right atrium, near the SVC', '≈ 60–100/min — sets the pace'],
                ['Atrial muscle', 'Both atria', '≈ 1 m/s — spreads the spark (P wave)'],
                ['AV node', 'Floor of the right atrium, by the septum', '≈ 0.05 m/s — the deliberate delay'],
                ['Bundle of His', 'Down the septum', '≈ 2–4 m/s — the expressway'],
                ['Purkinje fibers', 'Through both ventricles', '≈ 2–4 m/s — both ventricles at once'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="PR interval" latin="intervallum PR">
              The time from the start of the P wave to the start of the QRS complex on an ECG —
              normally 0.12–0.20 seconds. It measures the AV nodal delay: the pause that lets the
              ventricles finish filling before they contract.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <Callout kind="warning" title="Scope of this lesson">
              This lesson describes normal conduction and one common failure pattern as concepts. A
              real ECG — its intervals, blocks, and what to do about them — is read by clinicians,
              not by a wiki.
            </Callout>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-conduction-openstax.jpg"
              alt="OpenStax illustration of the heart's conduction system: SA node, AV node, bundle of His, bundle branches, and Purkinje fibres"
              caption="Real anatomy reference — the conduction system drawn on the heart itself: SA node, AV node, the bundle of His, both bundle branches, and the Purkinje network — the wiring the lab traces signal by signal."
              credit="OpenStax Anatomy & Physiology, fig. 2018 · CC BY 3.0 · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'SA node', latin: 'nodus sinuatrialis', back: 'The heart’s natural pacemaker: a cluster of cells in the right atrium that fires on its own, 60–100 times a minute at rest.' },
        { term: 'AV node', latin: 'nodus atrioventricularis', back: 'The gatekeeper between atria and ventricles. It delays the impulse by about 0.12–0.20 seconds so the ventricles finish filling first.' },
        { term: 'Bundle of His', latin: 'fasciculus atrioventricularis', back: 'The fast conducting bundle that carries the impulse from the AV node down the septum, then splits into right and left branches.' },
        { term: 'Purkinje fibers', latin: 'fibrae Purkinje', back: 'The fast distribution network that sprays the impulse through both ventricles, so they contract together in one coordinated squeeze.' },
      ]}
      questions={[
        {
          q: 'Where does a normal heartbeat begin?',
          options: [
            'The AV node',
            'The SA node in the right atrium',
            'The bundle of His',
            'The left ventricle',
          ],
          answer: 1,
          why: 'The sinoatrial node fires on its own, 60–100 times a minute at rest — it is the heart’s natural pacemaker.',
        },
        {
          q: 'Why does the AV node delay the impulse?',
          options: [
            'To let the ventricles finish filling before they contract',
            'To save energy between beats',
            'To let the SA node rest',
            'To slow the blood down',
          ],
          answer: 0,
          why: 'The ~0.12–0.20 s delay (the PR interval) lets the atria finish their top-up. Without it, atria and ventricles would squeeze at once.',
        },
        {
          q: 'Which part of the conduction system carries the impulse fastest?',
          options: [
            'Atrial muscle',
            'The AV node',
            'The bundle of His and the Purkinje fibers',
            'Ventricular muscle',
          ],
          answer: 2,
          why: 'The His–Purkinje system conducts at 2–4 m/s — the expressway that lets both ventricles fire together.',
        },
      ]}
      closing={
        <Callout kind="key">
          The heart&rsquo;s wiring is tuned, not just connected: slow where a pause is needed (the
          AV node), fast where synchrony matters (the His–Purkinje system). Rhythm is not speed —
          it is timing.
        </Callout>
      }
    />
  )
}

/* ----------------------- The airway: nose to alveoli ----------------------- */

export function AirwayLessonBody() {
  return (
    <BodyShell
      lab={<AirwayLabCard />}
      chapterTitle="One Road In, Millions of Roads Out"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              Before a single molecule of oxygen reaches your blood, the air you breathe travels
              through about <strong>23 generations of branching tubes</strong> — from one nose to
              roughly 300 million alveoli. Almost all of that journey is preparation, not exchange:
              everything from the nose to the terminal bronchioles is the{' '}
              <strong>conducting zone</strong>, a road whose job is to deliver air in the right
              condition. Only the last stretch, the <strong>respiratory zone</strong>, actually
              trades gases with the blood.
            </p>
            <p>
              The nose does the conditioning. Its <strong>conchae</strong> — three scroll-shaped
              shelves of bone on each side — force incoming air through narrow, winding passages
              lined with warm, wet mucosa, so the air is heated to near body temperature and
              humidified on the way in. The same mucosa is sticky with mucus, which traps dust,
              pollen, and microbes; <strong>cilia</strong>, tiny beating hairs, then sweep the loaded
              mucus steadily toward the pharynx to be swallowed — the{' '}
              <strong>mucociliary escalator</strong>. Breathe through your mouth and all of this is
              skipped: the air arrives colder, drier, and dirtier, which is why a blocked nose
              leaves your throat raw by morning.
            </p>
            <p>
              The <strong>pharynx</strong> is the crossroads where air and food share one tube, and
              the <strong>larynx</strong> is the guard posted at the fork. When you swallow, the{' '}
              <strong>epiglottis</strong> — a flap of elastic cartilage — folds down over the larynx
              and the vocal folds close, so food is steered into the esophagus instead of the
              airway. The larynx earns its other name, the voice box, because those same folds
              vibrate as air passes, turning breath into sound. Below it, the{' '}
              <strong>trachea</strong> keeps the road open with its C-shaped cartilage rings, and at
              the <strong>carina</strong> the road forks into the two main bronchi — the right one
              wider, shorter, and steeper, which is why inhaled objects almost always land on the
              right.
            </p>
            <p>
              Then the tree takes over. Each bronchus divides again and again, the tubes getting
              narrower while their <em>total</em> cross-section grows — so the air slows down, the
              way a river slows as it spreads into a delta. That slowness matters: by the time air
              reaches the alveoli it is barely moving, which gives diffusion time to work. The
              alveoli themselves are the payoff — about 300 million sacs, each about 0.2–0.3 mm
              across, with a combined surface of roughly 70 square metres, wrapped in capillaries.
              Across walls one cell thick, oxygen slips into the blood and carbon dioxide slips out.
              A film of <strong>surfactant</strong> keeps the sacs from sticking shut at the end of
              each breath out.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Station', 'Size', 'Job']}
              rows={[
                ['Nasal cavity', 'a few mm between the conchae', 'Warm, moisten, and filter the air'],
                ['Pharynx', '≈ 12 cm long', 'Shared passage — route air down, food across'],
                ['Larynx', '≈ 4–5 cm long', 'Make sound; guard the airway when swallowing'],
                ['Trachea', '≈ 18–20 mm across', 'Hold the airway open with cartilage rings'],
                ['Main bronchi', '≈ 10–12 mm across', 'Split the air, right and left'],
                ['Bronchioles → alveoli', '≤ 1 mm → ≈ 0.2 mm', 'Deliver air slowly; exchange gases'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Mucociliary escalator" latin="scala mucociliaris">
              The conveyor belt of the airways: a layer of sticky mucus that traps dust and microbes,
              carried steadily upward by millions of beating cilia toward the pharynx, where it is
              swallowed. It is the airway’s self-cleaning system — and the reason a smoker’s morning
              cough exists: smoke paralyses the cilia, so the mucus has to be coughed out instead.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-airway-gray994.png"
              alt="Gray's Anatomy plate 994: a sagittal section through the nose, mouth, pharynx, and larynx, with the conchae, epiglottis, vocal folds, and trachea labelled"
              caption="Real anatomy reference — a sagittal section through the nose, mouth, pharynx, and larynx: the upper airway the lab traces, with the conchae, the epiglottis, the vocal folds, and the top of the trachea all labelled from a real dissection."
              credit="Gray's Anatomy (1918), plate 994 · Public domain · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Carina', latin: 'carina tracheae', back: 'The keel-shaped ridge at the base of the trachea where it splits into the two main bronchi. Touching it triggers a violent cough — the airway’s last alarm.' },
        { term: 'Epiglottis', latin: 'epiglottis', back: 'A flap of elastic cartilage that folds down over the larynx when you swallow, steering food into the esophagus instead of the airway.' },
        { term: 'Conchae', latin: 'conchae nasales', back: 'Curved shelves of bone inside the nasal cavity. They force incoming air through narrow, warm, moist passages so it is conditioned before it reaches the lungs.' },
        { term: 'Surfactant', latin: 'surfactans', back: 'A soap-like film of lipids and proteins coating the alveoli. It lowers surface tension so the tiny sacs do not collapse at the end of each breath out.' },
      ]}
      questions={[
        {
          q: 'What do the nasal conchae do to incoming air?',
          options: [
            'They close the airway when you swallow',
            'They force it through narrow, warm, moist passages so it is conditioned',
            'They produce the voice',
            'They filter blood before it reaches the lungs',
          ],
          answer: 1,
          why: 'The conchae turn the nasal cavity into a winding, warm, wet corridor — air leaves it near body temperature, humidified, and with dust trapped in mucus.',
        },
        {
          q: 'Why do inhaled objects usually end up in the right lung?',
          options: [
            'The left bronchus is blocked by the heart',
            'The right main bronchus is wider, shorter, and more vertical',
            'Air only flows to the right side',
            'The right lung has more lobes',
          ],
          answer: 1,
          why: 'The right main bronchus is the straighter continuation of the trachea — an object falling down the airway follows the wider, steeper path.',
        },
        {
          q: 'What keeps the trachea from collapsing when you breathe in?',
          options: [
            'The pleura pulling it open',
            'Muscles squeezing it from outside',
            'C-shaped rings of hyaline cartilage in its wall',
            'Air pressure from the lungs alone',
          ],
          answer: 2,
          why: 'Sixteen to twenty C-shaped cartilage rings act like the ribs of a hose, holding the windpipe open while the esophagus expands behind the open back of each C.',
        },
      ]}
      closing={
        <Callout kind="key">
          The airway is a filter, a heater, and a humidifier before it is a pipe — and a branching
          tree before it is a destination. Only at the very end, in the alveoli, does the air
          finally meet the blood.
        </Callout>
      }
    />
  )
}

/* ------------------- Surgical instruments ------------------- */

export function InstrumentsLessonBody() {
  return (
    <BodyShell
      lab={<InstrumentsLab />}
      chapterTitle="Eight Tools That Do Almost Everything"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              Walk into any operating room in the world and the scene on the tray is recognisable:
              a few dozen steel instruments, laid out in order on a green cloth. There are thousands
              of specialised instruments in the catalogues, but almost every operation is performed
              with a small cast of generalists — and they sort neatly by verb. Some{' '}
              <strong>cut</strong>, some <strong>clamp</strong>, some <strong>grasp</strong>, some{' '}
              <strong>hold the wound open</strong>, and one exists purely to <strong>sew</strong>.
              Learn the verbs and the tray stops being a pile of metal and becomes a sentence you
              can read.
            </p>
            <p>
              The cutting pair is the <strong>scalpel</strong> and the <strong>scissors</strong>. The
              scalpel — a handle with a disposable blade — makes the incision, cutting with the
              belly of the blade in a single stroke. Scissors continue the work inside: stout{' '}
              <strong>Mayo scissors</strong> for tough tissue, fine <strong>Metzenbaum scissors</strong>{' '}
              for delicate structures. Every cut creates the next problem, though: cut vessels
              bleed, and the wound keeps trying to close.
            </p>
            <p>
              Bleeding is answered by the <strong>haemostat</strong>, a clamp whose jaws lock with a
              ratchet — click, and the vessel stays shut without anyone squeezing. Holding tissue is
              the forceps family&rsquo;s work, and the family splits by temperament.{' '}
              <strong>Tissue forceps</strong> are tweezers held like a pen: no lock, no crush, just
              the surgeon&rsquo;s own pressure. The <strong>Allis forceps</strong> is the opposite —
              a locking clamp with teeth, built for a grip that never slips on tissue that is being
              removed anyway. Between them sits the golden rule of grasping: the gentler the tissue&rsquo;s
              future, the gentler the tool allowed to touch it.
            </p>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-instruments-tray.jpg"
              alt="A real set of surgical instruments — scalpel, scissors, forceps, clamps, and a probe — laid out on green surgical cloth in a steel tray"
              caption="Real instruments reference — a basic surgical set laid out on the green cloth, exactly as the scrub nurse arranges it: scalpel, scissors, forceps, and clamps in working order (a circumcision set — the same general instruments used across surgery)."
              credit="Photo by Dan Bollinger · CC BY-SA 4.0 · via Wikimedia Commons"
            />
          </div>
          <div className="prose-wiki mt-6 max-w-3xl">
            <p>
              Seeing is the <strong>retractor</strong>&rsquo;s department: its right-angled blade
              hooks the wound edges apart and holds them, turning a slit into a workspace. Beside
              it, <strong>sponge forceps</strong> grip folded gauze so the sponge — never a finger —
              mops blood and paints antiseptic inside the sterile field. And when the work is done,
              the <strong>needle holder</strong> closes the story: short, cross-hatched jaws built
              to drive a curved needle through tissue in an arc, stitch by stitch.
            </p>
            <p>
              One ritual guards the whole cast: <strong>the count</strong>. Before the operation,
              before closing, and at the end, the scrub nurse and circulating nurse count
              instruments, sponges, and sharps aloud, together, against the number recorded at the
              start. If the count is wrong, the wound is not closed until the missing item is
              found. Steel is easy to leave behind in a body cavity, and a retained sponge or
              instrument is one of surgery&rsquo;s classic never-events — prevented not by memory,
              but by arithmetic spoken out loud.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Instrument', 'Family', 'Defining job']}
              rows={[
                ['Scalpel', 'Cutting', 'Makes the incision with the belly of the blade'],
                ['Mayo scissors', 'Cutting', 'Cuts tough tissue, sutures, and dressings'],
                ['Haemostat', 'Clamping', 'Locks onto vessels to stop bleeding'],
                ['Tissue forceps', 'Grasping', 'Steadies tissue gently, held like a pen'],
                ['Allis forceps', 'Grasping', 'Toothed locking grip on tissue being removed'],
                ['Retractor', 'Exposing', 'Holds the wound open to create a workspace'],
                ['Sponge forceps', 'Exposing', 'Grips gauze to mop and prep inside the field'],
                ['Needle holder', 'Suturing', 'Drives the curved needle, stitch by stitch'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Mayo stand">
              The height-adjustable tray table that stands over the patient, holding the
              instruments currently in use within the surgeon&rsquo;s reach. Everything on it is
              inside the sterile field — one touch from unsterile hands and the field is broken.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <Callout kind="info">
              Many instruments carry the names of the surgeons who designed them — Kelly, Mayo,
              Allis, Adson. In theatre, tools are asked for by name, often by a silent open hand
              alone: the scrub nurse reads the hand, and the right instrument lands in it, handle
              first, ready to use.
            </Callout>
          </div>
        </>
      }
      cards={[
        { term: 'Scalpel', latin: 'scalpellum', back: 'The cutting tool: a handle plus a disposable blade. It cuts with the belly of the blade in one smooth stroke — the No. 10 blade makes most skin incisions.' },
        { term: 'Haemostat', latin: 'forceps haemostatica', back: 'A locking clamp for blood vessels. Its ratchet clicks shut and holds without squeezing. It crushes what it grips, so it never holds a needle and never clamps tissue that must survive.' },
        { term: 'Needle holder', latin: 'porta acus', back: 'Short, blunt, cross-hatched jaws made to grip a curved suture needle without it rotating. Driving a needle with a haemostat instead is the classic beginner mix-up — it damages both instruments.' },
        { term: 'The count', latin: 'numeratio instrumentorum', back: 'Instruments, sponges, and sharps are counted aloud before the operation, before closing, and at the end. A wrong count stops the closing until the missing item is found.' },
      ]}
      questions={[
        {
          q: 'A small vessel starts bleeding in the wound. Which instrument stops it precisely?',
          options: [
            'The Allis forceps',
            'The haemostat',
            'The sponge forceps',
            'The retractor',
          ],
          answer: 1,
          why: 'The haemostat is the locking clamp: it snaps onto the vessel and its ratchet holds it shut until the vessel can be tied off. The Allis would shred it, and the sponge forceps only mops.',
        },
        {
          q: 'Why must a suture needle be driven with a needle holder rather than a haemostat?',
          options: [
            'The needle holder is longer, so it reaches deeper',
            'Its short, cross-hatched jaws grip the needle without rotating or damaging it',
            'Haemostats are never sterile enough for sutures',
            'The needle holder cuts the thread afterwards',
          ],
          answer: 1,
          why: 'A needle holder is built for exactly one grip: short blunt jaws with a cross-hatched face that stop the curved needle twisting mid-stitch. A haemostat\'s fine jaws and ratchet are damaged by the needle — and the needle by them.',
        },
        {
          q: 'During the closing count, one sponge is missing. What happens next?',
          options: [
            'The wound is closed anyway; sponges dissolve',
            'It is noted in the chart and the operation continues',
            'The wound stays open while the team recounts and searches the field',
            'The anaesthetist is asked to check the chart',
          ],
          answer: 2,
          why: 'A retained sponge is a never-event. The count is repeated and the field, drapes, and floor are searched; the wound is not closed until the sponge is found or imaging proves it is not inside the patient.',
        },
      ]}
      closing={
        <Callout kind="key">
          The tray looks like a hundred tools, but it speaks four verbs — cut, clamp, hold, sew.
          Master those, plus the arithmetic of the count, and you can follow almost any operation
          ever performed.
        </Callout>
      }
    />
  )
}

/* ------------------------- The GI tract, end to end ------------------------- */

/* Note: this lesson has no 3D explorer. A search of Wikimedia Commons
 * (2026-11-18) found no openly licensed 3D model of the human digestive
 * tract — the Visible Human STL series covers liver, lung, heart, larynx,
 * kidney, eye, knee, and bronchi, but no stomach or intestine — so the
 * lesson ships with its animated 2D lab only. */

export function GiTractLessonBody() {
  return (
    <BodyShell
      lab={<GiTractLab />}
      chapterTitle="Nine Metres of Tube, One Long Job"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              The digestive tract is, at its simplest, one continuous tube about{' '}
              <strong>nine metres long</strong>, running from mouth to anus. Food enters at one
              end, and what the body cannot use leaves at the other — but between those two ends
              the tube changes character completely, station by station. The mouth chews, the
              esophagus carries, the stomach churns and acidifies, the small intestine absorbs,
              the large intestine reclaims water, and the rectum waits. Same tube, six different
              jobs.
            </p>
            <p>
              Underneath the variety, the wall is built the same way everywhere, in four layers.
              The <strong>mucosa</strong> lines the inside and does the secreting and absorbing;
              the <strong>submucosa</strong> beneath it carries blood vessels and nerves; the{' '}
              <strong>muscularis</strong> — two sheets of smooth muscle, one circular, one
              lengthwise — squeezes the tube in the waves of <strong>peristalsis</strong>; and
              the <strong>serosa</strong> wraps the outside. Each station specialises the same
              four-layer plan: the stomach adds a third muscle layer for churning, the small
              intestine folds its mucosa into millions of villi for absorption, the colon grows
              a huge bacterial population.
            </p>
            <p>
              Two controls run the whole journey. The first is peristalsis itself — a wave of
              contraction behind the food and relaxation ahead of it, so the bolus is always
              being handed forward, from the esophagus all the way to the rectum. The second is
              a series of <strong>sphincters</strong>, rings of muscle that act as gates: the
              lower esophageal sphincter keeps acid in the stomach, the pyloric sphincter
              meters chyme into the small intestine a squirt at a time, the ileocecal valve
              stops colonic bacteria washing back upstream, and the anal sphincters guard the
              exit. When a sphincter fails, the symptom names the gate — heartburn is a lower
              esophageal sphincter that will not stay shut.
            </p>
            <p>
              The tract does not work alone. Three helper organs feed into it: the{' '}
              <strong>liver</strong> makes bile, which the <strong>gallbladder</strong> stores and
              releases to emulsify fats into droplets small enough for enzymes to attack; and
              the <strong>pancreas</strong> pours in enzymes that finish digesting proteins,
              starches, and fats, plus bicarbonate to neutralise the stomach acid arriving from
              above. Without them, the small intestine could not do its job — which is why
              gallstones and pancreatitis are digestive diseases, even though neither organ is
              part of the tube itself.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Station', 'Length', 'Main job']}
              rows={[
                ['Mouth', '—', 'Chew food; saliva starts starch digestion'],
                ['Esophagus', '≈ 25 cm', 'Carry the bolus down by peristalsis'],
                ['Stomach', '≈ 25–30 cm', 'Churn with acid and pepsin; make chyme'],
                ['Small intestine', '≈ 6–7 m', 'Digest and absorb almost all nutrients'],
                ['Large intestine', '≈ 1.5 m', 'Reclaim water and salts; host the microbiome'],
                ['Rectum', '≈ 12–15 cm', 'Store stool until defecation'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Peristalsis" latin="peristalsis">
              The wave of coordinated muscle contraction that moves food along the gut: the
              circular muscle squeezes shut behind the bolus while the muscle ahead of it
              relaxes, so the food is handed forward one segment at a time. It is a reflex —
              you cannot start or stop it by will — and it runs the whole nine metres, from the
              esophagus to the rectum.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-gi-tract-ruiz.png"
              alt="A labelled diagram of the whole human digestive system: mouth, salivary glands, pharynx, esophagus, liver, gallbladder, stomach, pancreas, small intestine, large intestine, appendix, and anus"
              caption="Real anatomy reference — the whole digestive system, labelled from mouth to anus, with the helper organs in place: liver and gallbladder above the stomach, pancreas tucked behind it, and the appendix hanging from the caecum. Compare it with the lab above — the same road, drawn as a map instead of a journey."
              credit="Mariana Ruiz (LadyofHats) · Public domain · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Peristalsis', latin: 'peristalsis', back: 'A wave of muscle contraction behind the food and relaxation ahead of it, handing the bolus forward segment by segment. It is a reflex — you cannot will it to start or stop.' },
        { term: 'Chyme', latin: 'chymus', back: 'The creamy, acidic soup the stomach produces after two to four hours of churning food with gastric juice. It is squirted into the small intestine a little at a time.' },
        { term: 'Villi', latin: 'villi intestinales', back: 'Millions of tiny finger-like projections lining the small intestine. Together with the folds beneath them and the microvilli on each cell, they expand the absorbing surface to roughly 30 square metres.' },
        { term: 'Sphincter', latin: 'sphincter', back: 'A ring of muscle that acts as a gate between two parts of the tract — opening to let food pass, closing to stop it flowing back. The lower esophageal sphincter guards the stomach; heartburn is its failure.' },
      ]}
      questions={[
        {
          q: 'Where is almost all nutrient absorption done?',
          options: [
            'The stomach',
            'The small intestine',
            'The large intestine',
            'The esophagus',
          ],
          answer: 1,
          why: 'The small intestine — its villi give it roughly 30 square metres of absorbing surface, and it receives bile and pancreatic enzymes to finish digestion first.',
        },
        {
          q: 'What is the pH inside a working stomach?',
          options: [
            'About 7, neutral',
            'About 5, mildly acidic',
            'About 1.5–2, strongly acidic',
            'About 9, alkaline',
          ],
          answer: 2,
          why: 'Gastric juice is hydrochloric acid at about pH 1.5–2 — strong enough to kill most microbes and activate pepsin, which is why the stomach lining needs its protective mucus coat.',
        },
        {
          q: 'What does the large intestine mainly take back from the gut contents?',
          options: [
            'Glucose and amino acids',
            'Water and salts',
            'Bile and pancreatic enzymes',
            'Oxygen',
          ],
          answer: 1,
          why: 'Water and salts. By the time food reaches the colon, the nutrients are already absorbed; the colon’s job is recovery — which is why losing its water in diarrhoea causes dehydration so fast.',
        },
      ]}
      closing={
        <Callout kind="key">
          Digestion is mostly plumbing with chemistry: one tube, four layers, a wave that
          never stops, gates that open one at a time, and helpers standing outside the tube
          feeding in bile and enzymes. Follow the bolus and you have followed the whole story.
        </Callout>
      }
    />
  )
}

/* ------------------------- The Liver and Gallbladder ------------------------- */

export function LiverLessonBody() {
  return (
    <BodyShell
      lab={<LiverLabCard />}
      chapterTitle="The Body's Chemical Factory"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              The liver is the largest internal organ in the body — about{' '}
              <strong>1.5 kilograms</strong> in an adult, tucked under the diaphragm in the
              right upper corner of the abdomen, mostly hidden behind the ribs. It is a
              wedge: the <strong>right lobe</strong> is the big one, roughly five sixths of
              the mass, and the <strong>left lobe</strong> tapers to a thin point toward the
              midline. The seam between them, the <strong>falciform ligament</strong>, is
              visible on the front of the organ — a fold of peritoneum that once carried the
              umbilical vein, and whose lower edge survives as the round ligament. Most of
              the liver is wrapped in peritoneum, but one patch on its back — the{' '}
              <strong>bare area</strong> — presses directly against the diaphragm, with no
              covering at all.
            </p>
            <p>
              What makes the liver strange is its plumbing. It has <strong>two</strong> blood
              supplies: the <strong>hepatic artery</strong>, bringing oxygen-rich blood from
              the aorta, and the <strong>portal vein</strong>, bringing about three quarters
              of the total — blood that has just drained from the gut, loaded with the
              nutrients of your last meal and anything else the intestine absorbed. That
              blood does not go to the heart first. It goes through the liver first, and the
              liver decides what the rest of the body is allowed to see. Inside, the organ
              is a honeycomb of <strong>lobules</strong>, hexagonal units about a millimetre
              across: at each corner a portal triad (a branch of the portal vein, a branch
              of the hepatic artery, and a bile duct), and in the centre a vein that collects
              the blood after it has flowed past the hepatocytes through sieve-like{' '}
              <strong>sinusoids</strong>. Blood that leaves the lobules drains through the{' '}
              <strong>hepatic veins</strong> into the inferior vena cava, and only then to
              the heart.
            </p>
            <p>
              The work the hepatocytes do with that blood is the liver's whole reason for
              existing. They store glucose as <strong>glycogen</strong> after a meal and
              release it between meals, keeping blood sugar steady. They build the plasma
              proteins — <strong>albumin</strong>, which holds fluid in the bloodstream, and
              most of the <strong>clotting factors</strong>. They detoxify: ammonia from
              protein breakdown is converted to <strong>urea</strong> for the kidneys to
              excrete, and drugs and alcohol are broken down. They store{' '}
              <strong>vitamin B12</strong>, iron, and vitamins A and D. And they make{' '}
              <strong>bile</strong> — roughly 800 to 1,000 millilitres a day — which flows
              the opposite way through the lobule, out through the ducts, to the gallbladder
              and the gut.
            </p>
            <p>
              The <strong>gallbladder</strong> is not a factory but a warehouse: a
              pear-shaped pouch holding 30 to 50 millilitres, tucked into a fossa on the
              liver's underside. Between meals it fills with bile, drawing water out until
              the bile is up to ten times more concentrated. When fatty food reaches the
              small intestine, the gut releases the hormone cholecystokinin, the gallbladder
              contracts, and bile shoots down the common bile duct into the duodenum, where
              its salts break fat into droplets small enough for enzymes to attack. And the
              liver has one more trick no other internal organ shares: cut away part of it,
              and the remainder <strong>regrows</strong> to full size — which is why a
              healthy person can donate part of their liver to someone else and both end up
              with a whole one.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Structure', 'Where it is', 'What it does']}
              rows={[
                ['Right lobe', 'Under the right ribs', 'About five sixths of the liver’s mass'],
                ['Left lobe', 'Toward the midline', 'Smaller; tapers to a point'],
                ['Falciform ligament', 'Front of the liver, between the lobes', 'The seam between them; remnant of the umbilical vein'],
                ['Porta hepatis', 'On the liver’s underside', 'The gateway — portal vein and hepatic artery in, common hepatic duct out'],
                ['Hepatic lobule', 'Everywhere — the liver is built of them', 'The functional unit: hepatocytes around sinusoids, central vein in the middle'],
                ['Gallbladder', 'In a fossa on the liver’s underside', 'Stores and concentrates bile; releases it when fat arrives'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Hepatocyte" latin="hepatocytus">
              The liver cell — and the cell that does nearly all of the liver’s work. A
              hepatocyte takes up nutrients and toxins from the blood flowing past it in the
              sinusoids, stores glucose as glycogen, builds plasma proteins, converts ammonia
              to urea, breaks down drugs and alcohol, and secretes bile into the canaliculi
              between neighbouring cells. About 80% of the liver’s mass is hepatocytes.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-liver-gray1086.png"
              alt="Gray's Anatomy plate 1086: the inferior (visceral) surface of the liver, labelled — left and right lobes, gallbladder, quadrate and caudate lobes, portal vein, hepatic artery, and common bile duct"
              caption="Real anatomy reference — the liver from underneath, its visceral surface: the gallbladder (green) sitting in its fossa, the porta hepatis with the hepatic artery, portal vein, and common bile duct, and the quadrate and caudate lobes between them. Compare it with the lab above — the same organ, drawn as a map instead of a factory."
              credit="Gray's Anatomy (1918), plate 1086 · Public domain · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Hepatocyte', latin: 'hepatocytus', back: 'The liver cell. It takes up nutrients and toxins from the blood in the sinusoids, stores glucose as glycogen, builds plasma proteins, converts ammonia to urea, breaks down drugs and alcohol, and secretes bile.' },
        { term: 'Portal vein', latin: 'vena portae hepatis', back: 'The vein that carries nutrient-rich blood from the gut to the liver — about 75% of the liver’s blood supply. Everything absorbed from the intestine passes through the liver before it can reach the rest of the body.' },
        { term: 'Bile', latin: 'bilis', back: 'A green-yellow fluid made by hepatocytes from cholesterol, bile salts, and bilirubin. Stored and concentrated in the gallbladder, it is released into the duodenum to emulsify fats into droplets enzymes can attack.' },
        { term: 'Gallbladder', latin: 'vesica biliaris', back: 'A pear-shaped pouch holding 30–50 mL, tucked into a fossa on the liver’s underside. It makes nothing — it stores bile, concentrates it up to ten times, and squeezes it out when fatty food arrives in the gut.' },
      ]}
      questions={[
        {
          q: 'Which vessel brings most of the liver’s blood?',
          options: [
            'The hepatic artery',
            'The hepatic vein',
            'The portal vein',
            'The inferior vena cava',
          ],
          answer: 2,
          why: 'The portal vein — about 75% of the liver’s blood. It carries nutrient-rich blood straight from the gut, so the liver can sort it before it reaches the rest of the body.',
        },
        {
          q: 'What does the gallbladder actually do?',
          options: [
            'It makes bile',
            'It stores and concentrates bile',
            'It filters the blood',
            'It makes digestive enzymes',
          ],
          answer: 1,
          why: 'It stores and concentrates bile — the liver makes the bile. The gallbladder draws water out until the bile is up to ten times more concentrated, then squeezes it out when fat arrives in the duodenum.',
        },
        {
          q: 'After blood has passed through a liver lobule, where does it go next?',
          options: [
            'Back into the portal vein',
            'Into the central vein, then the hepatic veins and the inferior vena cava',
            'Into the bile ducts',
            'Into the gallbladder',
          ],
          answer: 1,
          why: 'Blood flows from the portal triads at the lobule’s corners, through the sinusoids past the hepatocytes, to the central vein — then out via the hepatic veins into the inferior vena cava and on to the heart.',
        },
      ]}
      closing={
        <Callout kind="key">
          The liver is the body’s checkpoint: everything absorbed from the gut passes
          through it before it is allowed into the general circulation. Two blood supplies
          in, one cleaned stream out — and a side product, bile, that the gallbladder
          stores until the next fatty meal calls for it.
        </Callout>
      }
    />
  )
}

/* ------------------------- The Brain: Lobes and Landmarks ------------------------- */

export function BrainLessonBody() {
  return (
    <BodyShell
      lab={<BrainLabCard />}
      chapterTitle="Four Lobes, One Map, and a Switchboard Inside"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              The brain weighs about <strong>1.4 kilograms</strong> — roughly 2% of body mass —
              yet burns about <strong>20% of the body&rsquo;s energy</strong>, and it does so
              with about <strong>86 billion neurons</strong> wired together by something like
              100 trillion connections. Most of that mass is the <strong>cerebrum</strong>, the
              big folded dome: two hemispheres, split by the longitudinal fissure, joined
              underneath by the <strong>corpus callosum</strong>, a thick band of fibres that
              lets the halves talk. The outside of each hemisphere is the{' '}
              <strong>cerebral cortex</strong>, a sheet of grey matter only 2–4 millimetres
              thick — folded into ridges (<strong>gyri</strong>) and grooves (
              <strong>sulci</strong>) so that a sheet the size of a newspaper page fits inside
              the skull. The folding is the point: more cortex in the same skull.
            </p>
            <p>
              The cortex is not one uniform sheet but a map, divided into{' '}
              <strong>four lobes</strong> by the sulci that cross it. The{' '}
              <strong>frontal lobe</strong> sits at the front, behind the forehead: it plans,
              decides, holds back — and along its back edge runs the strip that moves the body,
              the primary motor cortex. The <strong>parietal lobe</strong> sits behind the
              central sulcus: its front strip feels touch, temperature, and pain, and the rest
              of it maps where your limbs are without you looking. The{' '}
              <strong>temporal lobe</strong> sits below the lateral sulcus: it hears, it
              understands words, and buried deep inside it the hippocampus lays down new
              memories. The <strong>occipital lobe</strong>, the smallest, sits at the back
              and does almost nothing but see — the primary visual cortex turns the retina&rsquo;s
              signals into the world you look at. The borders are real landmarks you can
              find on any brain: the <strong>central sulcus</strong> between frontal and
              parietal, the <strong>lateral sulcus</strong> above the temporal lobe.
            </p>
            <p>
              Under the cerebrum, the rest of the brain does the jobs the lobes cannot. The{' '}
              <strong>cerebellum</strong> — the &ldquo;little brain&rdquo; tucked under the
              occipital lobe — never starts a movement, but it polishes every one: timing,
              balance, and the smoothness you only notice when it is gone. The{' '}
              <strong>brainstem</strong> — midbrain, pons, and medulla — is the stalk the
              whole brain sits on: every signal between brain and body passes through it, and
              it runs the jobs you cannot stop, breathing and heartbeat among them. And deep
              in the middle sits the <strong>thalamus</strong>, the switchboard: almost every
              sense knocks on it first, and it routes each signal to exactly the patch of
              cortex that knows what to do with it. Smell is the only sense that skips the
              queue.
            </p>
            <p>
              The lab above follows one signal through the whole map: a touch on the fingertip
              climbs the spinal cord, passes the brainstem, is relayed by the thalamus, and
              lands on the sensory strip of the parietal lobe — where it becomes a feeling.
              The frontal lobe answers on the motor strip, and the command races back down
              to pull the hand away. Both strips are body maps, and both are distorted the
              same way: the fingers and lips take up far more cortex than the back or the
              legs, because that is where the receptors — and the dexterity — are densest.
              Damage a patch of the map and you lose exactly that patch&rsquo;s job, which is
              why neurologists read symptoms the way you would read a map: find the missing
              function, find the lobe.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Structure', 'Landmark that bounds it', 'What it does']}
              rows={[
                ['Frontal lobe', 'Central sulcus behind it', 'Plans, decides, holds back; the motor strip moves the body; Broca’s area speaks'],
                ['Parietal lobe', 'Central sulcus in front, lateral sulcus below', 'The sensory strip feels touch and pain; maps where the limbs are'],
                ['Temporal lobe', 'Lateral sulcus above it', 'Hears; Wernicke’s area understands words; the hippocampus makes memories'],
                ['Occipital lobe', 'Parieto-occipital sulcus in front', 'Sees — the primary visual cortex at the very back of the brain'],
                ['Cerebellum', 'Under the occipital lobe', 'Polishes movement: timing, coordination, balance'],
                ['Brainstem', 'The stalk under the cerebrum', 'All traffic between brain and body; breathing and heartbeat run here'],
                ['Thalamus', 'Deep in the middle, under the cortex', 'The switchboard — relays almost every sense to the right patch of cortex'],
                ['Corpus callosum', 'Between the two hemispheres', 'The fibre bridge that lets the left and right halves talk to each other'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Cerebral cortex" latin="cortex cerebri">
              The outer sheet of the cerebrum — grey matter, 2–4 millimetres thick, folded
              into gyri and sulci so that roughly a newspaper page of it fits inside the
              skull. It is where sensation becomes perception, where decisions are made, and
              where movement is commanded. Everything under it — thalamus, brainstem,
              cerebellum — exists to feed it signals and carry out its orders.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-brain-openstax-lobes.jpg"
              alt="OpenStax figure of the lobes of the cerebral cortex: a lateral view of the brain with the frontal, parietal, temporal, and occipital lobes coloured and labelled, with the central sulcus, precentral and postcentral gyri, and lateral sulcus marked"
              caption="Real anatomy reference — the four lobes as a map, coloured and labelled: frontal in front, parietal behind the central sulcus, temporal below the lateral sulcus, occipital at the back — with the precentral gyrus (movement) and postcentral gyrus (feeling) straddling the central sulcus, exactly as the lab above shows them. Compare it with the lab — the same landmarks, drawn as a map instead of a journey."
              credit="OpenStax, Anatomy and Physiology 2e, Figure 13.7 “Lobes of the Cerebral Cortex” · CC BY 4.0 · via openstax.org"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Neuron', latin: 'neuron', back: 'The brain’s signalling cell: about 86 billion of them, each with branches (dendrites) that listen and one long fibre (the axon) that talks. Neurons do not touch — they pass signals across tiny gaps called synapses.' },
        { term: 'Sulcus', latin: 'sulcus', back: 'A groove in the folded cortex — the valleys between the ridges (gyri). The big sulci are landmarks: the central sulcus divides frontal from parietal lobe, the lateral sulcus marks the top of the temporal lobe.' },
        { term: 'Thalamus', latin: 'thalamus', back: 'The egg-shaped relay station deep in the middle of the brain. Almost every sense passes through it on the way to the cortex, which routes each signal to exactly the patch that knows what to do with it. Smell is the only exception.' },
        { term: 'Corpus callosum', latin: 'corpus callosum', back: 'The thick band of about 200 million fibres joining the two cerebral hemispheres, so the halves can share what each one knows. Cut it, and the two halves start working — and answering — on their own.' },
      ]}
      questions={[
        {
          q: 'Which sulcus separates the frontal lobe from the parietal lobe?',
          options: [
            'The lateral sulcus',
            'The central sulcus',
            'The longitudinal fissure',
            'The parieto-occipital sulcus',
          ],
          answer: 1,
          why: 'The central sulcus — it runs diagonally across the top of the hemisphere. The motor strip sits just in front of it (frontal side), the sensory strip just behind it (parietal side).',
        },
        {
          q: 'Which structure relays almost all sensory signals to the cortex?',
          options: [
            'The cerebellum',
            'The corpus callosum',
            'The thalamus',
            'The medulla',
          ],
          answer: 2,
          why: 'The thalamus — the brain’s switchboard, buried deep under the cortex. Every sense except smell passes through it before reaching the patch of cortex that handles it.',
        },
        {
          q: 'Which lobe holds the primary visual cortex?',
          options: [
            'The frontal lobe',
            'The parietal lobe',
            'The temporal lobe',
            'The occipital lobe',
          ],
          answer: 3,
          why: 'The occipital lobe, at the very back of the brain — the smallest lobe, and almost entirely devoted to turning the retina’s signals into sight.',
        },
      ]}
      closing={
        <Callout kind="key">
          The brain is a map, and the sulci are its borders: every patch of cortex has one
          job, and the landmarks tell you which patch you are looking at. Follow a signal
          from fingertip to thalamus to cortex and back, and you have followed the whole
          story — sensation in, decision made, movement out.
        </Callout>
      }
    />
  )
}

/* ------------------- Operation case 2: cholecystectomy ------------------- */

export function CholecystectomyCaseBody() {
  return (
    <BodyShell
      lab={<CholecystectomyCaseLab />}
      chapterTitle="The Pain That Kept Coming Back"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              This patient’s story has two chapters, and telling them apart is the whole diagnosis.
              For months she had <strong>biliary colic</strong>: a gallstone would drift into the
              neck of the gallbladder and briefly block the cystic duct, the gallbladder would
              squeeze against the blockage — pain — and then the stone would fall back, the duct
              would drain, and within the hour everything settled. Colic is a plumbing spasm: severe,
              but it leaves no inflammation behind, no fever, and normal blood tests. This time the
              stone did not fall back. Impacted in the cystic duct, it trapped bile inside; the wall
              swelled, its blood supply suffered, bacteria joined in — and colic became{' '}
              <strong>acute cholecystitis</strong>, an inflamed organ that will not settle on its own.
            </p>
            <p>
              <strong>Murphy’s sign</strong> is that inflammation made palpable. The gallbladder hangs
              from the underside of the liver, just below the right ribs. When the patient breathes
              in deeply, the diaphragm pushes the liver — and the gallbladder riding on it — downward,
              straight onto the examiner’s waiting hand. A healthy gallbladder slides past without
              complaint; an inflamed one collides, hurts sharply, and the patient catches her breath
              and stops inspiring. The sign is the organ reporting its own tenderness.
            </p>
            <p>
              The <strong>Tokyo Guidelines</strong> turn the diagnosis into three groups of evidence:
              local signs (Murphy’s sign, right-upper-quadrant pain, tenderness or a palpable mass),
              systemic inflammation (fever, raised CRP, raised white cell count), and imaging
              (gallstones with a thickened wall, pericholecystic fluid, a positive sonographic
              Murphy). One finding from each group makes the diagnosis definite — and this case has
              findings in all three, several times over.
            </p>
            <p>
              Why not simply cool it down with antibiotics and operate later, at leisure? Because
              antibiotics treat the flare, not the stone. The impacted stone stays, attacks recur —
              often within weeks — and the delayed operation is frequently the harder one, dissected
              through tissue scarred by repeated inflammation. For a patient fit for anaesthesia, the
              Tokyo Guidelines favour <strong>early laparoscopic cholecystectomy</strong> during the
              same admission: remove the gallbladder while the anatomy is still readable.
            </p>
            <p>
              The operation’s danger zone is <strong>Calot’s triangle</strong> (the hepatocystic
              triangle), bordered by the cystic duct, the common hepatic duct, and the edge of the
              liver. Through or near it pass the cystic artery and, in a significant minority of
              people, variant bile ducts and arteries that do not read the textbook. The defence is
              the <strong>Critical View of Safety</strong>, Strasberg’s discipline from 1995: before
              anything is clipped, the triangle is cleared of fat and fibrous tissue, the lower
              gallbladder is lifted off the liver bed, and the surgeon must see{' '}
              <em>exactly two</em> structures entering the gallbladder — the cystic duct and the
              cystic artery. Nothing else may be divided, because nothing else has been proven.
            </p>
            <p>
              The feared complication explains the ritual. <strong>Bile duct injury</strong> —
              clipping or dividing the common bile duct after mistaking it for the cystic duct — is
              rarely a slip of the hand; it is almost always an error of identification, the duct
              looking exactly like what the surgeon expected to see. Its consequences are severe:
              leaking bile, strictures, repeated procedures, sometimes major reconstructive surgery.
              The Critical View exists to make identity a demonstrated fact rather than an
              assumption — and when the view cannot be achieved, the professional move is to bail
              out: drain the gallbladder, remove only part of it, or convert to open surgery. Pride
              is not a structure in Calot’s triangle.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Tokyo Guidelines group', 'Criterion', 'Finding in this case']}
              rows={[
                ['Local signs', 'Murphy’s sign', 'Positive — the breath catches on deep inspiration'],
                ['Local signs', 'RUQ pain / tenderness / mass', '18 hours of constant right-upper-quadrant pain, tender'],
                ['Systemic signs', 'Fever', '38.4 °C'],
                ['Systemic signs', 'Raised inflammatory markers', 'WBC 13.6, CRP 118'],
                ['Imaging', 'Gallstones, thickened wall (≥ 4 mm)', 'Multiple stones, wall 5 mm'],
                ['Imaging', 'Pericholecystic fluid / sonographic Murphy', 'Rim of fluid present; probe tenderness positive'],
                ['Verdict', 'One finding from each group', 'Definite acute cholecystitis'],
              ]}
            />
          </div>
          <div className="mt-6">
            <Callout kind="warning" title="Scope of this case">
              This is a teaching case with a fictional patient, written to explain how surgeons
              reason and operate. Real right-upper-abdominal pain has many causes and always needs
              assessment by a clinician in person — a wiki score is never a diagnosis.
            </Callout>
          </div>
          <div className="prose-wiki mt-6 max-w-3xl">
            <p>
              Ultrasound was this case’s first-line scan — fast, free of radiation, and superb at
              finding stones and a thickened wall. But medicine owns several ways of seeing inside
              the body, and each one sees a different truth. This gallery of real body scans —
              a chest radiograph first, with CT and MRI examples being added — shows what each
              method would, and would not, tell the team looking after this patient.
            </p>
          </div>
          <div className="mt-6 max-w-xl">
            <AnatomyFigure
              src="/assets/refs/scan-xray-chest.png"
              alt="Chest X-ray (radiograph) of the thorax"
              caption="Body scan — a plain X-ray is a single projection shadow: excellent for chest and bone, but almost blind to the gallbladder. Most gallstones share the density of the soft tissue around them — only the calcified minority show up — which is why this is not the gallbladder test. (CT and MRI examples join this gallery in a follow-up update.)"
              credit="Radiograph: Cecco · Public domain · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Murphy’s sign', latin: 'signum Murphy', back: 'Inspiratory arrest when the examiner’s hand, pressed under the right costal margin, meets the descending inflamed gallbladder as the patient breathes in. A positive sign points to gallbladder inflammation.' },
        { term: 'Calot’s triangle', latin: 'trigonum cystohepaticum', back: 'The hepatocystic triangle, bordered by the cystic duct, the common hepatic duct, and the edge of the liver. The cystic artery runs inside it — and variant ducts and arteries hide there too. It is the dissection field of cholecystectomy, and the place where misidentification happens.' },
        { term: 'Critical View of Safety', latin: 'visus criticus securitatis', back: 'Strasberg’s safety standard, proven before anything is clipped: (1) Calot’s triangle cleared of fat and fibrous tissue, (2) the lower gallbladder separated from the liver bed, (3) exactly two structures seen entering the gallbladder — the cystic duct and the cystic artery.' },
        { term: 'Biliary colic', latin: 'colica biliaris', back: 'Pain from a gallstone temporarily obstructing the cystic duct: severe right-upper-quadrant pain, often after fatty meals, that settles completely within about six hours — no fever, no inflammation. Pain that persists with fever is no longer colic; it is cholecystitis.' },
      ]}
      questions={[
        {
          q: 'What separates this attack from her months of biliary colic?',
          options: [
            'The pain is under the right ribs instead of the left',
            'Colic settles within hours and leaves no inflammation; this pain persisted 18 hours with fever and raised inflammatory markers — the gallbladder wall itself is now inflamed',
            'Colic is caused by gallstones, cholecystitis is not',
            'She vomited during this attack',
          ],
          answer: 1,
          why: 'A stone briefly stuck is colic; a stone impacted in the cystic duct with an inflamed wall is acute cholecystitis. Duration plus systemic inflammation is the dividing line.',
        },
        {
          q: 'Why must the Critical View of Safety be achieved before anything is clipped?',
          options: [
            'It makes the operation faster',
            'It is a traditional pause with no practical purpose',
            'It proves the structures about to be divided enter the gallbladder — the catastrophic error in this operation is mistaking the common bile duct for the cystic duct and dividing it',
            'The clips only grip properly after the view is achieved',
          ],
          answer: 2,
          why: 'Bile duct injury is almost always an identification error, not a slip of the hand. The Critical View makes identity a demonstrated fact — and if it cannot be achieved, the safe move is to bail out, never to guess.',
        },
        {
          q: 'A stone is now suspected inside the common bile duct. Which scan maps the bile ducts?',
          options: [
            'A plain abdominal X-ray',
            'MRCP — the MRI variant that images the bile and pancreatic ducts',
            'A chest X-ray',
            'A CT scan of the chest',
          ],
          answer: 1,
          why: 'MRCP uses MRI sequences that make static fluid — bile — glow, drawing a map of the whole duct system with no incision and no injected dye. Plain X-rays barely show gallstones at all, and only the calcified minority.',
        },
      ]}
      closing={
        <Callout kind="key">
          Appendicitis is a race against the clock; cholecystectomy is a test of identification.
          The medium case in one line: the operation is safe when the surgeon proves what each
          structure is before dividing anything.
        </Callout>
      }
    />
  )
}

/* ------------------------- Neurons and the Synapse ------------------------- */

export function NeuronLessonBody() {
  return (
    <BodyShell
      lab={<NeuronLabCard />}
      chapterTitle="One Cell, One Spark — and 86 Billion of Them"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              Every thought you have ever had, every memory, every flinch from a hot stove, is
              a chain of sparks jumping between cells. The cell that carries the spark is the{' '}
              <strong>neuron</strong> — and the whole nervous system, all 86 billion of them, is
              built from variations on one shape: branches that listen, a body that decides, one
              long fibre that talks, and a hand-off at the end. Learn this one cell and you have
              the alphabet of the entire brain.
            </p>
            <p>
              The listening branches are the <strong>dendrites</strong>. They bristle with
              synapses from other neurons, and each incoming signal arrives as a small{' '}
              <strong>graded potential</strong> — a slight rise or fall in voltage that fades as
              it travels. The <strong>soma</strong>, the cell body, adds them all up: excitation
              against inhibition, signals close together in time and space reinforcing each
              other. This is <strong>summation</strong>, and it happens at the{' '}
              <strong>axon hillock</strong>, the trigger zone where the axon leaves the soma.
            </p>
            <p>
              If the summed voltage crosses about <strong>−55 mV</strong>, the hillock fires an{' '}
              <strong>action potential</strong>: voltage-gated sodium channels fly open, sodium
              rushes in, and the membrane voltage shoots to about <strong>+30 mV</strong> in
              roughly a millisecond, then potassium channels open and drag it back down — with a
              brief overshoot below resting level, the refractory period, during which the cell
              cannot fire again. The spike is <strong>all or nothing</strong>: a stronger
              stimulus never makes a bigger spike, only more spikes, more often. That is why
              the code of the nervous system is written in frequency, not amplitude.
            </p>
            <p>
              The spike then travels the <strong>axon</strong>, and how fast it travels depends
              on insulation. Most long axons are wrapped in <strong>myelin</strong> — fatty
              segments laid down by Schwann cells outside the brain and cord, and by
              oligodendrocytes inside it. Myelin stops the current leaking out through the
              membrane, so the spike is reborn only at the bare gaps between segments, the{' '}
              <strong>nodes of Ranvier</strong>, jumping from node to node in what is called{' '}
              <strong>saltatory conduction</strong> — up to 100 metres per second. Strip the
              myelin away, as multiple sclerosis does, and the same spike crawls at about 1 m/s,
              rebuilt at every point along the fibre. Speed, in the nervous system, is mostly
              insulation.
            </p>
            <p>
              At the end of the axon, the spike reaches the <strong>synaptic terminals</strong>,
              the boutons. Calcium rushes in, vesicles full of{' '}
              <strong>neurotransmitter</strong> fuse with the membrane and spill their contents
              into the <strong>synaptic cleft</strong> — a gap about 20 nanometres wide. The
              chemical drifts across, binds receptors on the next neuron, and opens its channels:
              the signal is electrical again. Neurons never touch each other. Everything you
              experience is a chain of these hand-offs — electricity, chemistry, electricity —
              repeated across some 100 trillion synapses.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Structure', 'What it is', 'What it does']}
              rows={[
                ['Dendrites', 'Branching processes off the soma', 'Listen — collect graded potentials from other neurons’ synapses'],
                ['Soma', 'The cell body, with the nucleus', 'Adds the signals up; makes the proteins the cell runs on'],
                ['Axon hillock', 'The trigger zone where the axon starts', 'Decides: cross −55 mV and the cell fires, or it stays silent'],
                ['Axon', 'One long fibre, up to a metre in places', 'Carries the action potential away from the soma'],
                ['Myelin sheath', 'Fatty insulation in segments', 'Stops the signal leaking; makes conduction up to 100× faster'],
                ['Node of Ranvier', 'Bare gap between myelin segments', 'Rebuilds the spike, node after node — saltatory conduction'],
                ['Synaptic terminal', 'Bouton at the axon’s end', 'Releases neurotransmitter into the cleft when the spike arrives'],
                ['Synaptic cleft', 'The ~20 nm gap between neurons', 'Where the chemical message crosses from one cell to the next'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Action potential" latin="potentia actionis">
              A brief, all-or-none reversal of the membrane voltage — from the resting
              potential of about −70 mV up to about +30 mV and back, in roughly a millisecond.
              It is triggered at the axon hillock when summation crosses threshold, travels
              unchanged down the axon, and ends by releasing neurotransmitter at the synapse.
              Every signal in the nervous system is a train of these identical spikes; what
              varies is how often they come.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-neuron-openstax.jpg"
              alt="OpenStax figure of a neuron: an irregular cell body with a purple nucleus, branching dendrites on the left, a long axon to the right wrapped in segments of myelin sheath with nodes of Ranvier between them, and branched synaptic terminals at the end"
              caption="Real anatomy reference — the neuron as a textbook draws it: dendrites listening on the left, the soma with its nucleus in the middle, the long axon wrapped in myelin segments with bare nodes of Ranvier between them, and the branched terminals at the end. The lab above follows exactly this shape — and the 3D explorer shows the same cell as it really looks, mapped from electron-microscope slices."
              credit="OpenStax, Anatomy and Physiology 2e, Figure 12.8 “The Neuron” · CC BY 4.0 · via openstax.org"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Neuron', latin: 'neuron', back: 'The signalling cell of the nervous system: about 86 billion of them. Dendrites listen, the soma adds the signals up, the axon carries the spike, and the synapse hands it on — chemically — to the next cell.' },
        { term: 'Action potential', latin: 'potentia actionis', back: 'The all-or-none spike: membrane voltage shooting from −70 mV to about +30 mV in a millisecond when the axon hillock crosses threshold. Always the same size — stronger stimuli make more spikes, not bigger ones.' },
        { term: 'Myelin sheath', latin: 'vagina myelinica', back: 'Fatty insulation wrapped around the axon in segments. It stops the signal leaking out, so the spike jumps from node to node — up to 100 m/s instead of about 1 m/s. Made by Schwann cells outside the brain and cord, oligodendrocytes inside it.' },
        { term: 'Synapse', latin: 'synapsis', back: 'The hand-off between two neurons: the spike triggers vesicles to spill neurotransmitter into a ~20 nm cleft, and the chemical opens channels on the next cell. Neurons never touch — every signal crosses this gap.' },
      ]}
      questions={[
        {
          q: 'What happens at the axon hillock when the summed signal crosses about −55 mV?',
          options: [
            'The neuron releases neurotransmitter',
            'An action potential fires — all or nothing',
            'The myelin sheath is rebuilt',
            'The dendrites grow new branches',
          ],
          answer: 1,
          why: 'The hillock is the trigger zone. Cross threshold and voltage-gated sodium channels open, firing a full action potential; stay below it and nothing happens at all. The spike is always the same size.',
        },
        {
          q: 'Why does myelin make conduction so much faster?',
          options: [
            'It makes the axon thicker, so more current fits',
            'It stops the signal leaking out, so the spike jumps node to node',
            'It adds extra sodium channels along the axon',
            'It shortens the axon',
          ],
          answer: 1,
          why: 'Myelin insulates the axon, so the current cannot leak out through the membrane — the spike is reborn only at the nodes of Ranvier. That saltatory conduction reaches ~100 m/s, against ~1 m/s in a bare axon.',
        },
        {
          q: 'What crosses the synaptic cleft?',
          options: [
            'An action potential, travelling directly',
            'Sodium ions through a gap junction',
            'Neurotransmitter, released from vesicles',
            'The axon itself, reaching across',
          ],
          answer: 2,
          why: 'The cleft is a ~20 nm gap the spike cannot cross electrically. The spike triggers vesicles to spill neurotransmitter, the chemical drifts across, and it opens channels on the next neuron — electricity, then chemistry, then electricity again.',
        },
      ]}
      closing={
        <Callout kind="key">
          One cell, one rule: listen on the dendrites, add it up in the soma, fire at the
          hillock if the sum crosses threshold, jump the myelinated axon node to node, and hand
          the message on chemically at the synapse. Everything the brain does — every memory,
          every movement, every word — is this five-step journey, repeated 86 billion times.
        </Callout>
      }
    />
  )
}

/* ------------------------- The skeleton: 206 bones ------------------------- */

export function SkeletonLessonBody() {
  return (
    <BodyShell
      lab={<SkeletonLabCard />}
      chapterTitle="206 Bones, One Frame — and Every One Earns Its Place"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              Count the bones in an adult and you get <strong>206</strong> — no more, no less,
              in almost every healthy adult. But the number is not the point. The point is the
              division of labour: the skeleton is two skeletons in one. The{' '}
              <strong>axial skeleton</strong> — skull, spine, and rib cage, 80 bones — is the
              central pillar: it protects the brain, the spinal cord, the heart, and the lungs,
              and it carries the weight. The <strong>appendicular skeleton</strong> — shoulders,
              arms, pelvis, and legs, 126 bones — is the machinery bolted onto the pillar: it
              moves you, lifts things, and walks you around.
            </p>
            <p>
              Bone looks dead — dry, white, still — but living bone is anything but. It is a
              tissue that rebuilds itself constantly: <strong>osteoclasts</strong> dissolve old
              bone and <strong>osteoblasts</strong> lay down new bone, so your whole skeleton is
              replaced roughly once a decade. That is why a broken bone can heal, why astronauts
              lose bone in weightlessness, and why the load in the lab above matters: bone
              grows stronger exactly where it is loaded, and weaker where it is not.
            </p>
            <p>
              The spine is the most honest example. Twenty-four vertebrae stack into a column
              that is strong enough to carry the trunk and flexible enough to bend, twist, and
              absorb a landing — because the vertebrae are separated by{' '}
              <strong>intervertebral discs</strong>, pads of cartilage with a jelly centre that
              squash a fraction of a millimetre with every step. The discs are also why you are
              about a centimetre taller in the morning than at night: they rehydrate while you
              sleep and compress again during the day.
            </p>
            <p>
              The skeleton has two jobs nobody sees. Inside many bones,{' '}
              <strong>red bone marrow</strong> makes your blood — about 100 billion new blood
              cells every day, red cells, white cells, and platelets, all born in the marrow of
              the pelvis, the spine, the ribs, and the ends of the long bones. And the bones are
              the body&apos;s calcium bank: 99% of your calcium sits in bone, lent out to the
              blood whenever nerves and muscles need it, paid back with every meal.
            </p>
            <p>
              You were not born with 206 bones. A newborn has around{' '}
              <strong>300 bones</strong>, many of them separate pieces of cartilage that slowly
              ossify and fuse as you grow — the skull of a baby has soft spots, the fontanelles,
              where the plates have not yet met. By your mid-twenties the fusing is mostly done
              and the count settles at 206. The smallest bone in the body, the{' '}
              <strong>stapes</strong> in the middle ear, is about 3 millimetres long; the
              longest, the <strong>femur</strong>, is about 50 centimetres. Both do exactly one
              job, and the whole frame depends on both.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Region', 'Bones', 'What it does']}
              rows={[
                ['Skull', '22', 'Protects the brain; houses the senses; the mandible chews and speaks'],
                ['Spine', '26', '24 vertebrae + sacrum + coccyx — carries the trunk, protects the cord, bends and absorbs shock'],
                ['Rib cage', '25', '24 ribs + sternum — shields heart and lungs, swings open to breathe'],
                ['Shoulder girdle', '4', '2 clavicles + 2 scapulae — hangs the arms off the trunk for maximum reach'],
                ['Pelvis', '2', '2 hip bones — the keystone: hands the trunk’s weight to the legs'],
                ['Arms (both)', '60', '30 per side — reach, lift, throw, and write; no body weight to carry'],
                ['Legs (both)', '60', '30 per side — walk, run, and stand; the femur is the longest bone'],
                ['Hyoid + ear ossicles', '7', '1 hyoid (anchors the tongue) + 6 ossicles (3 per ear, carry sound)'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Axial skeleton" latin="skeleton axiale">
              The 80 bones of the body&apos;s central axis: the skull (22), the spine (26),
              the rib cage (25), the hyoid (1), and the six tiny ear ossicles. Everything else —
              the 126 bones of the shoulders, arms, pelvis, and legs — is the appendicular
              skeleton, attached to the axis. The axis protects and carries; the appendages move.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-skeleton-openstax.jpg"
              alt="OpenStax figure of the axial and appendicular skeleton: two full-body skeletons, front view on the left and back view on the right, the axial bones coloured blue and the appendicular bones in bone colour, with the major bones labelled"
              caption="Real anatomy reference — the whole skeleton, front and back: the axial skeleton (skull, spine, rib cage) in blue, the appendicular skeleton (limbs and girdles) in bone colour. The lab above follows exactly this division — and the 3D explorer shows the same bones as they really look, except the clavicles, forearms, hands and feet, which this open dataset does not publish."
              credit="OpenStax, Anatomy and Physiology 2e, Figure 7.2 “Axial and Appendicular Skeleton” · CC BY 4.0 · via openstax.org"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Skeleton', latin: 'skeleton', back: 'The body’s frame: 206 bones in the adult, divided into the axial skeleton (80 — skull, spine, rib cage) and the appendicular skeleton (126 — shoulders, arms, pelvis, legs). It supports, protects, moves, makes blood, and stores calcium.' },
        { term: 'Axial skeleton', latin: 'skeleton axiale', back: 'The 80 bones of the central axis — skull, spine, rib cage, hyoid, and ear ossicles. Its jobs are protection (brain, cord, heart, lungs) and carrying the body’s weight.' },
        { term: 'Appendicular skeleton', latin: 'skeleton appendiculare', back: 'The 126 bones bolted onto the axis — shoulder girdle, arms, pelvis, and legs. Its jobs are movement: walking, running, reaching, lifting, and the fine work of the hands.' },
        { term: 'Vertebra', latin: 'vertebra', back: 'One of the 24 bones of the spine (7 cervical, 12 thoracic, 5 lumbar), stacked with a disc of cartilage between each pair. Together they form a column that is strong enough to carry the trunk and flexible enough to bend.' },
      ]}
      questions={[
        {
          q: 'How many bones does a typical adult skeleton have?',
          options: ['186', '206', '226', '300'],
          answer: 1,
          why: '206 in the adult. A newborn has around 300 bones, but many fuse together as the cartilage ossifies — the skull plates, the sacrum, and the hip bones among them — so the count settles at 206 by the mid-twenties.',
        },
        {
          q: 'Which bone is the longest and strongest in the human body?',
          options: [
            'The humerus, in the upper arm',
            'The tibia, the shin bone',
            'The femur, the thigh bone',
            'The pelvis, the hip bone',
          ],
          answer: 2,
          why: 'The femur: about 50 cm long in an adult, and the strongest bone because it carries the whole weight of the trunk on every step. It angles slightly inward as it rises, so the load lands dead centre over the knee.',
        },
        {
          q: 'The skull, the spine, and the rib cage belong to which division of the skeleton?',
          options: [
            'The appendicular skeleton',
            'The axial skeleton',
            'The sesamoid skeleton',
            'The visceral skeleton',
          ],
          answer: 1,
          why: 'The axial skeleton — the 80 bones of the central axis. Its jobs are protection and carrying weight. The appendicular skeleton (126 bones) is the shoulders, arms, pelvis, and legs — the machinery for movement.',
        },
      ]}
      closing={
        <Callout kind="key">
          Two skeletons in one: an axial pillar of 80 bones that protects the brain, cord,
          heart, and lungs and carries the weight — and an appendicular machine of 126 bones
          that moves you. Every step you take is a load travelling from the arches of the feet,
          up the legs, through the keystone of the pelvis, up the spring of the spine, to the
          helmet of the skull — and the bones grow stronger exactly where that load lands.
        </Callout>
      }
    />
  )
}

/* ------------------------- Muscles: how movement is made ------------------------- */

export function MusclesLessonBody() {
  return (
    <BodyShell
      lab={<MuscleLabCard />}
      chapterTitle="Six Hundred Muscles, One Trick: Pull"
      chapter={
        <>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              You own about <strong>600 skeletal muscles</strong>, and together they are roughly{' '}
              <strong>40% of your body mass</strong> — the largest organ system you have, hiding
              in plain sight. Every step, every word, every blink is a muscle shortening on
              command. And every one of them knows exactly one trick: <strong>pull</strong>.
              A muscle can only shorten and drag its two ends toward each other. It can never
              push. That single fact explains the whole design of the body: muscles always work
              in <strong>antagonistic pairs</strong>. The biceps flexes the elbow; the triceps
              extends it. When one shortens, the other must lengthen and let go — the curl in
              the lab above is the two of them negotiating.
            </p>
            <p>
              Zoom into a muscle and it is bundles inside bundles. A whole muscle is wrapped in
              fascia; inside it, <strong>fascicles</strong> — bundles of muscle fibres — run in
              parallel; each <strong>fibre</strong> is a single long cell packed with{' '}
              <strong>myofibrils</strong>; and each myofibril is a chain of{' '}
              <strong>sarcomeres</strong>, the tiny contractile units that do the actual pulling.
              At each end, the muscle narrows into a <strong>tendon</strong>, a cord of dense
              connective tissue that anchors it to bone. The attachment that stays mostly still
              is the <strong>origin</strong>; the one that moves is the{' '}
              <strong>insertion</strong>. The biceps originates on the scapula and inserts just
              below the elbow — so when it shortens, the forearm has nowhere to go but up.
            </p>
            <p>
              Inside a sarcomere, two kinds of protein filament overlap: thin{' '}
              <strong>actin</strong> filaments anchored to the Z-discs at each end, and thick{' '}
              <strong>myosin</strong> filaments in the middle, studded with little heads. When a
              nerve fires, <strong>calcium</strong> floods out of the sarcoplasmic reticulum and
              pulls <strong>tropomyosin</strong> off the actin binding sites. The myosin heads —
              already cocked and loaded with energy — grab the actin, pivot, and drag it toward
              the centre. The filaments themselves never shorten; they <strong>slide</strong>{' '}
              past each other, and the Z-discs are pulled together. That is the{' '}
              <strong>sliding filament theory</strong>, and the four steps in the lab are its
              cross-bridge cycle: bind, power stroke, detach, re-cock.
            </p>
            <p>
              The fuel for all of it is <strong>ATP</strong>, and its job is more subtle than
              most people think. ATP does not power the pull itself — the power stroke runs on
              energy stored in the cocked head from the ATP split <em>before</em> it bound.
              Fresh ATP is what lets the head <em>let go</em> and re-cock for the next pull.
              Without it, the heads stay locked to actin — which is why a body stiffens after
              death, in rigor mortis. While you are alive, the cycle repeats about five times a
              second per head, and thousands of heads pulling in step add up to the force that
              lifts a dumbbell — or your whole body off the ground.
            </p>
            <p>
              Not all muscle is the same. <strong>Skeletal muscle</strong> is voluntary and
              striated — the striped pattern you see under a microscope is the regular overlap
              of actin and myosin. <strong>Cardiac muscle</strong>, in the heart, is striated
              too but beats on its own, its cells joined by intercalated discs so the whole
              chamber contracts as one. <strong>Smooth muscle</strong> — in the walls of the
              gut, the blood vessels, the airways — has no stripes and no conscious control; it
              squeezes slowly and does not tire. And within skeletal muscle, fibres come in two
              flavours: slow-twitch (type I), built for endurance, and fast-twitch (type II),
              built for power. Your mix is mostly set at birth — sprinters are born with more
              fast fibres, marathoners with more slow ones — but training decides how many of
              the fibres you have are recruited, and how big they grow.
            </p>
            <p>
              Strength training, for the record, does not give you more muscle fibres. You are
              born with essentially all you will ever have. What grows is each fibre: more
              myofibrils packed inside it, a thicker belly, a stronger tendon. And the ache the
              day after a hard session — delayed-onset muscle soreness — is not lactic acid,
              which clears within the hour. It is microscopic damage to the fibres themselves,
              and the repair that follows is exactly how the muscle gets stronger.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Muscle', 'Origin → insertion', 'What it does']}
              rows={[
                ['Biceps brachii', 'Scapula → radial tuberosity', 'Flexes the elbow; turns the palm up (supination)'],
                ['Triceps brachii', 'Scapula & humerus → olecranon', 'Extends the elbow — the biceps’ antagonist'],
                ['Quadriceps femoris', 'Pelvis & femur → tibial tuberosity', 'Extends the knee; stands you up, climbs stairs, kicks'],
                ['Gastrocnemius', 'Femoral condyles → heel bone (Achilles tendon)', 'Points the foot down; pushes you off the ground'],
              ]}
            />
          </div>
          <div className="mt-6">
            <DefinitionBox term="Sarcomere" latin="sarcomerum">
              The contractile unit of a muscle fibre: the segment of a myofibril between two
              Z-discs, about 2.2 micrometres long at rest. Inside it, thin actin filaments
              anchored to the Z-discs overlap thick myosin filaments in the middle. When the
              myosin heads row along the actin, the Z-discs are pulled together and the
              sarcomere shortens — and a million sarcomeres shortening end to end is a muscle
              contracting.
            </DefinitionBox>
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-muscles-gray525.png"
              alt="Gray's Anatomy plate 525: the muscles of the arm — biceps brachii in front, triceps behind, deltoid above, with the pectoralis major and coracobrachialis"
              caption="Real anatomy reference — the muscles of the arm, drawn from dissection: the biceps brachii running down the front of the arm to the forearm, the triceps behind it, the deltoid capping the shoulder. The lab above curls this exact arm — and the 3D explorer shows the biceps itself, segmented from a whole-body MRI, as two separate heads."
              credit="Gray's Anatomy (1918), plate 525 · Public domain · via Wikimedia Commons"
            />
          </div>
        </>
      }
      cards={[
        { term: 'Sarcomere', latin: 'sarcomerum', back: 'The contractile unit of a muscle fibre — the segment of a myofibril between two Z-discs, about 2.2 µm at rest. Myosin heads row along actin inside it, pulling the Z-discs together so the sarcomere — and the whole muscle — shortens.' },
        { term: 'Myosin', latin: 'myosinum', back: 'The thick filament protein of the sarcomere. Its heads bind actin, pivot in the power stroke to drag actin toward the centre, then detach when fresh ATP binds and re-cock for the next pull. Thousands of heads pulling in step make the muscle’s force.' },
        { term: 'Actin', latin: 'actinum', back: 'The thin filament protein of the sarcomere, anchored to the Z-discs. Myosin heads grab it and pull it toward the centre during contraction. At rest its binding sites are covered by tropomyosin until calcium arrives.' },
        { term: 'Tendon', latin: 'tendo', back: 'A cord of dense connective tissue that anchors muscle to bone. It does not contract — it transmits the muscle’s pull to the skeleton. The biceps tendon inserts on the radius; the Achilles tendon joins the calf muscles to the heel bone.' },
      ]}
      questions={[
        {
          q: 'Why do muscles always work in antagonistic pairs, like biceps and triceps?',
          options: [
            'Because one muscle is always stronger than the other',
            'Because a muscle can only pull — it can never push a joint back',
            'Because the brain can only control one muscle at a time',
            'Because tendons only attach to one side of a joint',
          ],
          answer: 1,
          why: 'A muscle shortens and pulls its ends together — it has no way to push. So every joint needs an opposing muscle to return it: the biceps flexes the elbow, the triceps extends it, and each must lengthen while the other shortens.',
        },
        {
          q: 'In the sliding filament theory, what actually shortens when a muscle contracts?',
          options: [
            'The actin and myosin filaments themselves shrink',
            'The sarcomere shortens as the filaments slide past each other',
            'The tendon stretches and pulls the bone',
            'The Z-discs dissolve and reform closer together',
          ],
          answer: 1,
          why: 'The filaments keep their length — they slide past each other, and the Z-discs are pulled together, so the sarcomere narrows from about 2.2 µm to about 1.6 µm. A million sarcomeres shortening end to end is the muscle contracting.',
        },
        {
          q: 'What is ATP’s key job in the cross-bridge cycle?',
          options: [
            'It powers the power stroke directly',
            'It lets the myosin head detach from actin and re-cock for the next pull',
            'It releases calcium from the sarcoplasmic reticulum',
            'It builds new actin filaments during exercise',
          ],
          answer: 1,
          why: 'The power stroke runs on energy stored in the cocked head from an ATP split earlier. Fresh ATP is what makes the head let go of actin and re-cock — without it, heads stay locked, which is why a body stiffens in rigor mortis.',
        },
      ]}
      closing={
        <Callout kind="key">
          One trick, six hundred times over: a muscle only pulls. The biceps shortens, the
          forearm rises; the triceps yields, then pulls it back down. Inside, the trick is the
          cross-bridge cycle — myosin heads rowing along actin, five pulls a second, powered
          by ATP and switched on by calcium — repeated in a million sarcomeres at once, in
          every muscle you own, every time you move.
        </Callout>
      }
    />
  )
}
