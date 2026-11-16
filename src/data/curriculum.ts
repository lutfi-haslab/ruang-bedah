/* ------------------------------------------------------------------ */
/* The Ruang Bedah curriculum: Subject → Topic → Lesson.               */
/* This is the site's table of contents — every page, lab, and quiz    */
/* belongs to exactly one lesson here.                                 */
/* ------------------------------------------------------------------ */

export type LessonStatus = 'available' | 'soon'

export type Lesson = {
  title: string
  format: string
  minutes: number
  status: LessonStatus
  href?: string
}

export type Topic = {
  title: string
  lessons: Lesson[]
}

export type Subject = {
  name: string
  blurb: string
  topics: Topic[]
}

const L = (
  title: string,
  format: string,
  minutes: number,
  status: LessonStatus = 'soon',
  href?: string,
): Lesson => ({ title, format, minutes, status, href })

export const CURRICULUM: Subject[] = [
  {
    name: 'Anatomy',
    blurb: 'The map of the human body — organs, vessels, nerves, and how they fit together.',
    topics: [
      {
        title: 'Cardiovascular System',
        lessons: [
          L('The Heart: Chambers, Valves, and Vessels', 'Interactive lab + reading', 12, 'available', '/lesson/the-heart-chambers-valves-and-vessels'),
          L('Arteries, Veins, and Capillaries', 'Interactive lab + reading', 9, 'available', '/lesson/arteries-veins-and-capillaries'),
          L("The Conduction System: The Heart's Wiring", 'Reading + diagram', 7),
        ],
      },
      {
        title: 'Respiratory System',
        lessons: [
          L('The Lungs and the Pleura', 'Interactive lab + reading', 10, 'available', '/lesson/the-lungs-and-the-pleura'),
          L('The Airway: From Nose to Alveoli', 'Reading + diagram', 8),
        ],
      },
      {
        title: 'Digestive System',
        lessons: [
          L('The GI Tract, End to End', 'Reading + diagram', 10),
          L('The Liver and Gallbladder', 'Reading + diagram', 8),
        ],
      },
      {
        title: 'Nervous System',
        lessons: [
          L('The Brain: Lobes and Landmarks', 'Reading + diagram', 10),
          L('Neurons and the Synapse', 'Interactive lab', 8),
        ],
      },
      {
        title: 'Musculoskeletal System',
        lessons: [
          L('The Skeleton: 206 Bones, One Frame', 'Reading + diagram', 9),
          L('Muscles: How Movement Is Made', 'Reading + diagram', 8),
        ],
      },
    ],
  },
  {
    name: 'Physiology',
    blurb: 'How the systems actually work: pressures, flows, signals, and feedback loops.',
    topics: [
      {
        title: 'Cardiovascular Physiology',
        lessons: [
          L('The Cardiac Cycle: Systole and Diastole', 'Interactive lab + reading', 9, 'available', '/lesson/the-cardiac-cycle-systole-and-diastole'),
          L('Blood Pressure and Flow', 'Reading', 9),
          L('Reading an ECG', 'Interactive lab', 10),
        ],
      },
      {
        title: 'Respiratory Physiology',
        lessons: [L('Breathing and Gas Exchange', 'Reading + motion graphic', 9)],
      },
      {
        title: 'Renal Physiology',
        lessons: [L('The Nephron: Filtering the Blood', 'Reading + diagram', 9)],
      },
    ],
  },
  {
    name: 'Surgery',
    blurb: 'What surgeons really do in the operating room, and the logic behind each step.',
    topics: [
      {
        title: 'Surgical Foundations',
        lessons: [
          L('The Operating Room and Sterile Technique', 'Reading', 8),
          L('Incisions, Sutures, and Stitches', 'Reading + motion graphic', 9),
          L('Anaesthesia: Putting Physiology to Sleep', 'Reading', 9),
        ],
      },
      {
        title: 'Cardiac Surgery',
        lessons: [
          L('Coronary Bypass (CABG): Building the Detour', 'Interactive lab + reading', 12, 'available', '/lesson/coronary-bypass-cabg-building-the-detour'),
          L('Valve Replacement: Swapping a One-Way Gate', 'Reading', 10),
        ],
      },
    ],
  },
  {
    name: 'Medical Terms',
    blurb: 'The Latin and Greek vocabulary medicine runs on, translated into plain language.',
    topics: [
      {
        title: 'Word Roots',
        lessons: [
          L('Roots of the Body: cardio-, pulmo-, hepato-', 'Flashcards + quiz', 6),
          L('Suffixes That Change Everything: -itis, -ectomy, -scopy', 'Flashcards + quiz', 6),
        ],
      },
      {
        title: 'Everyday Clinical Terms',
        lessons: [L('Vital Signs Vocabulary', 'Reading + flashcards', 5)],
      },
    ],
  },
  {
    name: 'Cases',
    blurb: 'Clinical stories that connect the anatomy to a real patient on a real table.',
    topics: [
      {
        title: 'Case Files',
        lessons: [
          L('The Chest Pain at 3 A.M.', 'Case study', 10),
          L('A Cough That Would Not Leave', 'Case study', 9),
        ],
      },
    ],
  },
]

export const subjectLessons = (s: Subject) => s.topics.flatMap((t) => t.lessons)
export const subjectAvailable = (s: Subject) =>
  subjectLessons(s).filter((l) => l.status === 'available').length

export const TOTAL_TOPICS = CURRICULUM.reduce((n, s) => n + s.topics.length, 0)
export const TOTAL_LESSONS = CURRICULUM.reduce((n, s) => n + subjectLessons(s).length, 0)
export const TOTAL_AVAILABLE = CURRICULUM.reduce((n, s) => n + subjectAvailable(s), 0)

/* ------------------------- LMS routing helpers ------------------------ */

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const subjectSlug = (s: Subject) => slugify(s.name)
export const lessonSlug = (l: Lesson) => slugify(l.title)

export type LessonContext = {
  lesson: Lesson
  subject: Subject
  topic: Topic
  slug: string
}

/** Every lesson in course order, with its subject and topic attached. */
export const FLAT_LESSONS: LessonContext[] = CURRICULUM.flatMap((subject) =>
  subject.topics.flatMap((topic) =>
    topic.lessons.map((lesson) => ({ lesson, subject, topic, slug: lessonSlug(lesson) })),
  ),
)

export const getSubjectBySlug = (slug: string) => CURRICULUM.find((s) => subjectSlug(s) === slug)

export const getLessonBySlug = (slug: string) => FLAT_LESSONS.find((c) => c.slug === slug)

export const lessonNeighbors = (slug: string) => {
  const i = FLAT_LESSONS.findIndex((c) => c.slug === slug)
  if (i === -1) return { prev: undefined, next: undefined }
  return {
    prev: i > 0 ? FLAT_LESSONS[i - 1] : undefined,
    next: i < FLAT_LESSONS.length - 1 ? FLAT_LESSONS[i + 1] : undefined,
  }
}
