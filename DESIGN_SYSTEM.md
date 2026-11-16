# Ruang Bedah — Design System v0.1

Bahasa visual untuk wiki kesehatan & kedokteran berbahasa Indonesia.
Prinsip: **presisi klinis di atas kertas hangat** — bersih seperti ruang operasi,
hangat seperti buku teks yang enak dibaca lama.

Stack: React 19 + TypeScript + Tailwind CSS v4 (token via `@theme` di `src/index.css`).
Deploy target: Cloudflare Pages (output statis `dist/`).

**Bahasa default situs: Inggris** (keputusan Lutfi 2026-11-16 — target SEO internasional).
Seluruh UI, kategori, dan artikel ditulis dalam Bahasa Inggris; edisi Bahasa Indonesia
adalah pengembangan lanjutan (ilustrasi jantung versi ID tersimpan di
`~/workspace/health-wiki/assets/jantung-anterior.html`, versi EN di `heart-anterior.html`).
Label bawaan komponen (Badge, Callout, tombol kartu) mengikuti bahasa default ini.

## Token

Semua nilai hidup di `src/index.css` (`@theme`). Komponen tidak boleh memakai
warna/font di luar token ini.

### Warna

| Token | Hex | Pakai untuk |
|---|---|---|
| `paper` | #F7F4EE | Latar halaman |
| `surface` | #FFFFFF | Kartu, panel |
| `sand` | #EFE9DC | Isi hover, kepala tabel |
| `line` | #E0D9C6 | Garis batas |
| `ink-950/900/700/500/400` | #16222E → #93A0B4 | Teks, dari judul ke metadata |
| `primary-600/700` | #0E7C86 / #0A5F66 | Aksi utama, tautan, kategori Anatomi |
| `arterial-500/600` | #D64545 / #B93327 | Darah kaya oksigen, kategori Bedah, penekanan |
| `venous-500/600` | #5F83C2 / #4D6EA3 | Darah miskin oksigen, kategori Fisiologi, info |
| `amber-500/600` | #D97706 / #B45309 | Peringatan, disclaimer, kategori Istilah |
| `success-500/600` | #2F9E6E / #23805A | Kategori Kasus, status baik |

Pasangan arterial–venous adalah konvensi tetap semua ilustrasi anatomi:
**merah = kaya oksigen, biru = miskin oksigen** (lihat `OxygenLegend`).

### Tipografi

| Peran | Font | Token Tailwind |
|---|---|---|
| Judul, label, tombol | Archivo (600–800) | `font-display` |
| Antarmuka umum | Inter | `font-sans` |
| Badan artikel wiki | Source Serif 4, 1.075rem / 1.85 | `font-serif` + kelas `.prose-wiki` |
| Data, dosis, kode ICD | IBM Plex Mono | `font-mono` |

### Bentuk

- Radius kartu: `--radius-card` (1rem). Tombol & input: pill (`rounded-full`).
- Bayangan: `--shadow-card` (istirahat), `--shadow-lift` (hover kartu artikel).

## Komponen

`src/components/primitives.tsx`
- `Button` — variant `primary | accent | secondary | ghost`, size `sm | md | lg`.
- `Badge` — kategori `Anatomi | Fisiologi | Bedah | Istilah | Kasus` (warna per kategori, tetap).
- `SearchInput` — pill dengan ikon, ring fokus primary.
- `SectionHeading`, `Swatch` — pembantu halaman design system.

`src/components/wiki.tsx`
- `Callout` — `key` (fakta kunci, primary), `info` (catatan, venous), `warning` (penting/disclaimer, amber).
- `DefinitionBox` — istilah + nama Latin + definisi; pola baku kotak definisi wiki.
- `AnatomyFigure` — gambar anatomi + caption + kredit. Ilustrasi digambar sebagai SVG berlabel
  (sumber di `~/workspace/health-wiki/assets/`), bukan gambar AI, demi akurasi label.
- `ArticleCard`, `TermCard` — kartu indeks artikel & glosarium.
- `SpecTable` — tabel spesifikasi anatomi (3 kolom: struktur, asal, tujuan).
- `OxygenLegend` — legenda merah/biru pendamping ilustrasi.

`src/components/layout.tsx`
- `Header` — logo (denyut EKG dalam kotak primary), nav kategori, pencarian.
- `Footer` — termasuk blok **Disclaimer medis** yang wajib ada di semua halaman.

## Gerakan & interaktivitas (v0.2)

Keputusan Lutfi 2026-11-16: situs ini **buku belajar interaktif**, bukan koran digital.
Konsekuensinya adalah aturan, bukan hiasan:

- **Setiap halaman/topik wajib punya minimal satu elemen interaktif atau motion graphic**
  yang mendemonstrasikan prosesnya (aliran, kontraksi, sinyal) — halaman teks murni
  dianggap belum selesai.
- **Motion selalu mendemonstrasikan proses**, tidak pernah dekorasi semata. Pengecualian
  kecil: motif detak jantung pada kartu bab dan garis EKG sebagai pemisah seksi.
- Durasi: mikro-interaksi 150–350 ms; flip kartu 600 ms; siklus detak 850 ms per fase
  (±70 bpm, detak istirahat); aliran darah 6 detik per putaran penuh.
- `prefers-reduced-motion` wajib dihormati: semua animasi di atas mati, konten tetap utuh.

Komponen interaktif (`src/components/interactive-heart.tsx`, `study-tools.tsx`):

| Komponen | Fungsi |
| --- | --- |
| `InteractiveHeart` | Diagram jantung interaktif: 10 struktur bisa diklik/hover (pembuluh + ruang + apeks), mode **Explore** dan **Follow the blood** (stepper 8 langkah sirkuit darah), tombol **Play heartbeat** (fase sistol/diastol bergantian, status katup AV & semilunar, sapuan trace EKG, skala memompa), toggle aliran darah (titik biru/merah bergerak mengikuti jalur sirkuit via `animateMotion`) |
| `FlashCards` | Kartu istilah bolak-balik 3D (tap to flip): depan istilah + Latin, belakang definisi |
| `Quiz` | Kuis 3 soal dengan umpan balik instan per jawaban + penjelasan + skor + reset |
| `Reveal` | Pembungkus fade-up saat elemen masuk viewport (IntersectionObserver) |
| `EkgDivider` | Pemisah seksi berupa trace EKG yang menyapu |

Utilitas CSS terkait ada di `src/index.css` bagian "Motion & interactivity":
`.svg-origin`, `.ping-ring`, `.heart-beat`, `.ekg-anim`, `.flip-*`, `.reveal`.

## Struktur kurikulum (v0.3)

Keputusan Lutfi 2026-11-16: situs adalah **materi belajar terstruktur**, bukan kumpulan
artikel bertema satu organ. Hierarkinya:

**Subject → Topic → Lesson** — dimodelkan di `src/data/curriculum.ts` dan menjadi
satu-satunya daftar isi situs. Setiap halaman/lab/kuis adalah milik tepat satu lesson.

- 5 subject: Anatomy, Physiology, Surgery, Medical Terms, Cases (selaras kategori Badge).
- Lesson punya: judul, format (Reading / Interactive lab / Flashcards + quiz / Case study…),
  durasi menit, status `available` | `soon`. Hanya lesson `available` yang boleh ditautkan;
  lesson `soon` tampil sebagai antrean produksi (ikon jam), tidak pernah berpura-pura jadi.
- Komponen: `Syllabus` (akordeon subject + progress bar per subject + baris lesson),
  `Breadcrumb` (Subject › Topic › Lesson) di `src/components/syllabus.tsx`.
- Homepage = sampul + daftar isi (kurikulum) + satu lesson contoh lengkap
  ("Inside a lesson") + latihannya. Lesson contoh saat ini: The Heart
  (Anatomy › Cardiovascular System).

## Arsitektur LMS (v0.4)

Keputusan Lutfi 2026-11-16: situs adalah **LMS** (Learning Management System), bukan
satu halaman panjang. Setiap tingkat hierarki punya halamannya sendiri:

| Rute | Halaman | Isi |
| --- | --- | --- |
| `/` | Katalog | Hero + kartu lanjut-belajar + kartu 5 subject (jumlah topik/lesson/ready, progress bar) |
| `/subject/:slug` | Halaman subject | Header subject + progress, topik bernomor, baris lesson (status: ready / in production / completed) |
| `/lesson/:slug` | Halaman lesson | Breadcrumb, judul, tombol **Mark lesson complete**, isi lesson (Lab → Reading → Check), navigasi prev/next lesson |

- Routing: `react-router-dom` (BrowserRouter); fallback SPA di `public/_redirects`
  (`/* /index.html 200`) agar deep link bekerja di Cloudflare Pages.
- Progress belajar tersimpan di `localStorage` (`ruang-bedah-progress-v1`, hook
  `useProgress` di `src/hooks.ts`) — tanpa akun, tanpa server. Progress bar di katalog
  dan halaman subject membaca sumber yang sama.
- Lesson `soon` tetap punya halaman (status "in production" + rencana format/durasi),
  supaya struktur kursus utuh dan tidak ada tautan mati.
- Slug diturunkan dari judul via `slugify` di `curriculum.ts`; urutan prev/next mengikuti
  urutan kurikulum (subject → topik → lesson).
- Konten tidak boleh bergantung pada IntersectionObserver untuk tampil: `Reveal`
  wajib punya jalur tampil langsung + fallback timer (pelajaran dari bug katalog
  tak terlihat, 2026-11-16).

## Batch lesson & responsivitas (v0.5)

2026-11-16: empat lesson lengkap ditambahkan (total 5 `available` dari 26), masing-masing
dengan lab animasi sendiri di `src/components/lesson-labs.tsx` dan badan lesson
(Lab → Reading → Check) di `src/components/lesson-bodies.tsx`:

| Lesson | Lab animasi |
| --- | --- |
| Arteries, Veins, and Capillaries | Aliran darah beranimasi arteri → kapiler (pertukaran O₂/CO₂) → vena; pemilih jenis pembuluh, kontrol laju istirahat/olahraga |
| The Lungs and the Pleura | Napas beranimasi: paru mengembang, diafragma mendatar, partikel udara dua arah; slider laju napas, hotspot 6 struktur |
| The Cardiac Cycle | Siklus 4 fase autoplay/stepper: ruang jantung memompa, status katup, segmen ECG ter-highlight, meter tekanan/volume |
| Coronary Bypass (CABG) | Toggle arteri tersumbat vs pasca-bypass: titik darah mengalir lewat graft memutar plak, meter aliran, stepper 3 langkah bedah |

`FlashCards` dan `Quiz` di `study-tools.tsx` kini menerima data per lesson
(`cards` / `questions`), bukan lagi khusus jantung.

**Aturan responsif (pelajaran bug 2026-11-16):** halaman lesson membungkus badan lesson
dalam CSS grid — item grid wajib bisa menyusut (`[&>*]:min-w-0` pada wrapper), karena
min-content tabel (`SpecTable` min 540px) akan memaksa track grid melebar dan seluruh
halaman overflow horizontal di ponsel. Semua halaman wajib lolos cek screenshot
390px (ponsel) dan 1280px (desktop) sebelum deploy.

## Aturan pakai

1. Artikel baru memakai `.prose-wiki` untuk badan teks; istilah asing/latin dibungkus `<em className="latin">`.
2. Setiap artikel berkategori satu dari lima kategori Badge — tidak ada kategori baru tanpa token warna.
3. Ilustrasi anatomi selalu disertai `AnatomyFigure` (caption wajib) dan `OxygenLegend` bila memakai kode warna darah.
4. Disclaimer medis tidak boleh dihapus dari footer; klaim klinis penting memakai `Callout kind="warning"`.
5. Nama situs saat ini **nama kerja** ("Ruang Bedah") — menggantinya cukup di
   `index.html`, `layout.tsx`, dan file ini.

## v0.6 — Operation Case Studies (2026-11-16)

Atas permintaan Lutfi, subject **Cases** mendapat topik **Operation Case Studies**:
studi kasus operasi berjenjang kesulitan — Easy → Medium → Hard. Lesson pertama yang
jadi: **Appendicectomy: The Easy Case** (6 dari 29 lesson tersedia).

Format case study (berlaku untuk semua kasus operasi berikutnya):

- **Lab = case runner interaktif.** Timeline kasus per tahap (kedatangan → pemeriksaan
  → investigasi → keputusan → operasi → pemulihan) sebagai stepper; diagram anatomi
  berubah mengikuti tahap. Wajib ada **satu titik keputusan interaktif** (pilihan
  tindakan dengan feedback benar/salah) dan **stepper langkah operasi** di tahap theatre.
- **Reading chapter** menjelaskan mekanisme di balik cerita (kenapa gejalanya begitu,
  skor/tabel klinis sebagai `SpecTable`, risiko bila terlambat) + `Callout kind="warning"`
  bahwa kasus ini fiktif/edukatif.
- **Check** seperti lesson lain: flashcards istilah kunci kasus + kuis 3 soal.
- Kasus berikutnya sudah di-slot: Cholecystectomy (Medium), Coronary Bypass (Hard).

## v0.7 — Real anatomy references (2026-11-16)

Atas kritik Lutfi ("gambar mu jelek gak mirip"), setiap lesson yang tersedia kini
memasangkan lab skematiknya dengan **satu gambar referensi anatomi asli** di bab
bacaan (`AnatomyFigure`, caption diawali "Real anatomy reference —"). Aturan:

- Sumber hanya domain publik atau Creative Commons dari Wikimedia Commons
  (Gray's Anatomy 1918, OpenStax, ilustrator medis berlisensi CC) — **wajib**
  kredit + lisensi di caption, dan dicatat di `public/assets/refs/SOURCES.md`.
- Peran gambar dibagi jujur: lab SVG = diagram ajar (disederhanakan, interaktif);
  referensi = anatomi asli (proporsi & detail nyata). Keduanya saling melengkapi,
  bukan saling menggantikan.
- File biner di `public/assets/refs/` ikut ter-deploy ke Pages tetapi tidak masuk
  snapshot push GitHub (text-only), sama seperti `heart-anterior.png`.
- Lesson baru (termasuk dari cron harian) wajib menyertakan referensi asli
  mengikuti pola ini.

## v0.8 — 3D Explorer (Three.js) (2026-11-16)

Atas permintaan Lutfi ("Coba buatkan 3D pakai ThreeJS?"), lesson The Heart kini
punya **3D Explorer** (`src/components/HeartModel3D.tsx`, React.lazy agar bundle
three.js hanya dimuat di lesson ini):

- Model: mesh jantung anatomi asli CC BY 4.0 (neshallads, Wikimedia Commons),
  dihaluskan (subdivision + smooth normals) → `public/assets/models/heart.glb`
  (2,1 MB, Pages-only binary; sumber di `public/assets/models/SOURCES.md`).
- Interaksi: drag rotate / scroll zoom (OrbitControls), auto-rotate, animasi
  detak ~70 bpm (lub-dub, skala + emissive pulse), label struktur 3D yang
  terproyeksi ke layar dan memudar saat strukturnya membelakangi kamera,
  tombol Reset view. Render berhenti saat di luar viewport / tab disembunyikan.
- Fallback: bila WebGL tidak tersedia, tampilkan pesan + arahkan ke diagram &
  referensi Gray's di lesson yang sama.
- Pola ini adalah cetak biru untuk organ lain (paru, dll.) bila model berlisensi
  terbuka yang bagus tersedia — jangan paksa model jelek hanya demi 3D.
