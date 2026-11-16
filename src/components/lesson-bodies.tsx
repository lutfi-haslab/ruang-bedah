import type { ReactNode } from 'react'
import { Callout, DefinitionBox, SpecTable } from './wiki'
import { EkgDivider, FlashCards, Quiz } from './study-tools'
import type { FlashCardData, QuizQuestion } from './study-tools'
import { AppendectomyCaseLab, BloodVesselLab, CabgLab, CardiacCycleLab, LungsLab } from './lesson-labs'

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
      lab={<LungsLab />}
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
