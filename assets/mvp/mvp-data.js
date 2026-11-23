/*
 * MVP Project page: all text, numbers and links.
 * Edit the wording here; mvp.js builds the page from it.
 *
 * Commits are referenced by their short hash. mvp-commits.js (generated from
 * git) turns each one into a full GitHub link and shows its message.
 * Dates are written as "17 Sep 2026".
 */
window.MVP_DATA = {
  repo: 'https://github.com/mkarthikaravind1/Multilingual-Call-Intelligence',

  header: {
    eyebrow: 'ProtoSem 1.18 · Team 8 · MVP Project',
    title: 'MVP Project — Multilingual Call Intelligence',
    role: 'Team Visionary: Next Question Engine, end-to-end integration, system design and architecture. Led the team meetings and the MUP reviews.',
    period: '26 Aug 2026 – 21 Nov 2026',
    mentor: 'Gowrishankar S, Forge Innovation & Ventures',
    partner: 'Hive Crest Tech (problem and access)',
    team: 'Karthik Aravind M, Elakiya, Praveen, Sairam, Viswes',
    summary: [
      'A real-time AI assistant for phone calls at automotive service centres. While the customer is still on the line, the executive sees a live transcript in Tamil, Telugu, Kannada, Malayalam or English (even mixed in one sentence), the complaints raised, the customer’s tone and the next question worth asking.',
      'When the call ends it writes the summary, tracks every complaint to closure and gives supervisors and management reports. This page is my own record of the work I did on it.'
    ],
    buttons: [
      { label: 'View MVP website', href: 'https://mup-project-website.mkarthikaravind1.workers.dev/', primary: true },
      { label: 'GitHub repository', href: 'https://github.com/mkarthikaravind1/Multilingual-Call-Intelligence' },
      { label: 'Try the live MVP', href: 'https://multilingual-call-intelligence.mkarthikaravind1.workers.dev/' }
    ]
  },

  stats: [
    { value: '190', label: 'Commits by me', source: 'git shortlog -sne --all: 179 as “mkarthikaravind1” + 11 as “Karthik Aravind M”, all branches. Includes 10 merges. Teammates’ 29 commits are not counted.' },
    { value: '37', label: 'Feature branches', source: 'git for-each-ref refs/heads: my branches, not counting main, pr-*, team/* and one branch that only merges a teammate’s work. One branch per SRD stage, fix or feature.' },
    { value: '7', label: 'Weeks with commits', source: 'Counts only weeks with at least one commit by me (git log --all, by ISO week), on 28 separate days between 17 Sep and 21 Nov 2026.' },
    { value: '85/121', label: 'SRD requirements met', source: 'SRD-STATUS.md on GitHub (main): 121 requirements, 85 met, 27 built and waiting for an access, 9 not met. Each was checked in the code and its tests.' },
    { value: '3,000+', label: 'Automated backend tests', source: 'Review meeting script, 20 Nov 2026 (“over 3,000 backend tests pass”). On 11 Oct the suite was 2,674 tests, all passing (SRD-STATUS.md, row 108).' },
    { value: '2 of 5', label: 'Languages tested end to end', source: 'SRD-STATUS.md row 1: English and Tamil–English replayed for real. Telugu, Kannada and Malayalam are accepted but still need recordings.' }
  ],

  jump: [
    { label: 'Timeline', href: '#mvp-timeline' },
    { label: 'Contribution areas', href: '#mvp-areas' },
    { label: 'Evidence & links', href: '#mvp-evidence' },
    { label: 'Skills & learnings', href: '#mvp-skills' },
    { label: 'Reflection', href: '#mvp-reflection' }
  ],

  /* Dated timeline. "commits" is the number of my commits in that period. */
  timeline: [
    {
      week: 'Weeks 5–8 (before the repo)',
      dates: '26 Aug – 16 Sep 2026',
      commits: 0,
      countLabel: 'Before the repo',
      title: 'Groundwork: questions for the startup, Next Question Engine prototype, system design',
      points: [
        '26 Aug 2026: listed the questions to clear with the startup (Hive Crest Tech) before starting.',
        '6 Sep 2026: built the first Next Question Engine prototype as a FastAPI module (question generator with rules and LLM, question templates, coverage tracking, language strategy, live state, API routes and tests), before the project repository existed.',
        '14 Sep 2026: drew the system architecture and wrote the project document, with a demo of the question engine’s output.'
      ],
      evidence: []
    },
    {
      week: 'Week 8',
      dates: '17 Sep – 20 Sep 2026',
      commits: 17,
      title: 'Foundations: domain model, AI interfaces and audio pipeline',
      points: [
        'Started the repository and designed the conversation domain model and its services, including complaint coverage and question suggestion.',
        'Put every AI capability behind its own interface (LLM, Groq client, diarisation), so a provider can be swapped by a setting.',
        'Completed the first conversation-analysis flow and the audio processing pipeline.'
      ],
      evidence: ['1735f83', 'a767088', 'eeaf9b0', '481c0e2', 'a36577b', 'b34b03a']
    },
    {
      week: 'Week 9',
      dates: '21 Sep – 27 Sep 2026',
      commits: 36,
      title: 'First working prototype, data layer and web app',
      points: [
        'Live audio chunking with pyannote speaker diarisation, and the first end-to-end prototype of the call workflow.',
        'Post-call summary, emerging-complaint discovery (rules and LLM), complaint history across calls, and a self-learning loop where people review every change.',
        'PostgreSQL storage, live updates over WebSocket, Redis for shared live state, and the first telephony phase.',
        'React + TypeScript web app: design system, sign-in, call history, AI Improvement Center and post-call workflow connected to the API.'
      ],
      evidence: ['2717550', '9a91884', '4d5c7e5', 'a839518', 'ea04475', '5fed91c', '562e3db', '8aa7469', '8bd16de', '4a6dcd2', '678fa74', '808e58e']
    },
    {
      week: 'Week 10',
      dates: '28 Sep – 4 Oct 2026',
      commits: 10,
      title: 'Product experience and production readiness',
      points: [
        'Finished the product experience in the web app, then redesigned it to remove wasted space.',
        'Hardened telephony audio and call creation; added caller identity behind a CRM boundary and escalation detection.',
        'Production readiness, a test-audio replay tool and admin tooling (72 files in one change).'
      ],
      evidence: ['8402771', 'dcf58b0', 'e19af99', 'e37f636', 'f75129d', 'd82f242']
    },
    {
      week: 'Week 11',
      dates: '5 Oct – 11 Oct 2026',
      commits: 88,
      title: 'Production-grade pass, risk reviews and the full SRD build',
      points: [
        'Production-grade pass, Grafana monitoring and a supervisor price list uploaded from Excel.',
        'Cut the AI cost of a call: one combined request for complaints, tone and escalation; suggested questions checked by a second model; customer language decided by words, not lines.',
        'Fixed what the code reviews found: login throttling, sessions that end, equal sign-in timing, tokens removed from logs, and Plivo’s real webhook signature.',
        'Built every remaining SRD stage on its own branch (reports with CSV/Excel/PDF, tone per line, scorecards, supervisor live view, encrypted recordings, audit and AI logs, management role, backups, streaming speech-to-text) and recorded all 121 requirements in SRD-STATUS.md.'
      ],
      evidence: ['3ce3afa', 'd59bb1f', '187ca24', 'deca4dd', '911ed4e', '4f5d501', '61e57f4', 'e0f7017', '024a503', '817d63c', '2deb614', 'b8be7fe', 'aa921a0', 'f27c2b7', '47da55c', 'be48284']
    },
    {
      week: 'Weeks 12–13',
      dates: '12 Oct – 25 Oct 2026',
      commits: 0,
      title: 'Prototype demo and feedback',
      points: [
        'Demonstrated the working prototype to our mentor on 13 Oct 2026 and turned the feedback into the next round of work.',
        'No commits in these two weeks.'
      ],
      evidence: []
    },
    {
      week: 'Week 14',
      dates: '26 Oct – 1 Nov 2026',
      commits: 4,
      title: 'Go-live planning: cost plan, SMS and HTTPS',
      points: [
        'Prepared the one-year bill of materials for going live: ₹3,25,201 including GST, sized for about 50 calls a day. Sent 28 Oct 2026.',
        'Prepared the Team 8 progress tracker (29 Oct 2026): requirements, system flow, SRD progress, validation results and next steps.',
        'Designed and coded customer SMS through MSG91 with DLT-approved templates. Sairam researched the DLT rules and MSG91 pricing.',
        'Put the production stack behind HTTPS with Caddy, and let the backend image build without the large diarisation stack.'
      ],
      evidence: ['bbaca7d', 'ff0440b', '7aea22a'],
      docs: [{ label: 'Progress tracker (PPTX)', href: 'assets/mvp/docs/Team-8-Progress-Tracker.pptx', download: true }]
    },
    {
      week: 'Week 15',
      dates: '2 Nov – 8 Nov 2026',
      commits: 0,
      title: 'MUP Review 1',
      points: [
        'Led Team 8’s presentation at MUP Review 1 on 5 Nov 2026.',
        'No commits this week.'
      ],
      evidence: []
    },
    {
      week: 'Week 16',
      dates: '9 Nov – 15 Nov 2026',
      commits: 14,
      title: 'Cloudflare hosting, CI and team integration',
      points: [
        'Set up the Cloudflare configuration that hosts the web app, together with the Complaints page work (the customer’s own words, grouping).',
        'Fixed the CI dependency that stopped CI from starting the app, and renamed the frontend CI job now that it runs tests.',
        'Integrated teammates’ branches (speech server, self-hosted LLM server, language detector) by merging main into them.',
        'Bill of Materials and Statement of Work meeting on 11 Nov 2026.'
      ],
      evidence: ['783d18d', 'c1a4149', '4a895fc', '3abc9e3', '8099ce9', '257f711', 'a2aed32']
    },
    {
      week: 'Week 17',
      dates: '16 Nov – 21 Nov 2026',
      commits: 21,
      title: 'Asterisk telephony, AWS readiness and UX polish',
      points: [
        'Let the backend reach S3 through the EC2 server’s IAM role (no keys in config), then merged the HTTPS and MSG91 branches into main.',
        'Built the Asterisk bridge and click-to-call on top of Elakiya’s Asterisk setup. Incoming, outgoing, hold, missed calls and a bridge restart mid-call all passed on real softphones.',
        'Integrated Praveen’s language-detector fix and Elakiya’s speech server with main. Led the team’s review meeting on 20 Nov 2026.',
        'Reworked the live call screen and dashboard: newest line first, layout by urgency, language tags, unclear-audio marks, keyboard shortcuts and tiles that lead to work.'
      ],
      evidence: ['13b7b52', 'eba6310', '2f298fc', 'cebcfc7', '4802616', '59dfff9', 'f29e7f0', '247b7bd', 'fad756e', '67dd408', '8eb2e8c']
    }
  ],

  areas: [
    {
      title: 'Backend & system design',
      items: [
        'Layered FastAPI backend: domain models, services and swappable AI providers chosen by settings',
        'Call workflow, post-call processing and background repair jobs',
        'Complaint lifecycle across calls and emerging-complaint discovery',
        'Human-reviewed self-learning loop (AI Improvement Center)'
      ],
      evidence: ['a767088', '9a91884', 'a839518', 'ea04475', '07bf30c', 'dc07e17']
    },
    {
      title: 'Database & live state',
      items: [
        'PostgreSQL with Alembic migrations; Redis for state shared between servers',
        'Encrypted call recordings with a retention period',
        'Audit log and AI request log',
        'Off-server copies, database backups, replication and integrity checks'
      ],
      evidence: ['5fed91c', '8bd16de', '1afce05', 'b8be7fe', 'aa921a0', 'd329bfe']
    },
    {
      title: 'AI pipeline',
      items: [
        'Speech-to-text with Sarvam, chunked and streaming',
        'Speaker diarisation (pyannote) and stable agent/customer roles',
        'Complaints, tone per line, escalation and ranked next questions (Groq LLMs)',
        'One combined live request; a second model checks each suggested question'
      ],
      evidence: ['2717550', '34d1acf', '47da55c', '187ca24', 'deca4dd', '911ed4e', '024a503', '8b341ac']
    },
    {
      title: 'Telephony',
      items: [
        'Plivo media streams with signed per-call tokens',
        'Plivo V3 webhook signature check and stuck-call cleanup',
        'Recording joined when an audio stream reconnects; audio above 16 kHz accepted',
        'Asterisk bridge and click-to-call (on Elakiya’s Asterisk setup)'
      ],
      evidence: ['8aa7469', 'dcf58b0', '61e57f4', 'bbb08f2', '4a20c44', 'cebcfc7']
    },
    {
      title: 'Frontend screens',
      items: [
        'React 19 + TypeScript app: design system, sign-in and role-based pages',
        'Live call screen, Ongoing Calls for 500 calls, supervisor live view and alerts',
        'Reports with filters and CSV, Excel and PDF export',
        'Phone-width fixes and the November UX rework'
      ],
      evidence: ['4a6dcd2', 'a9cab1a', '2deb614', '817d63c', 'e0f7017', '990109e', '247b7bd']
    },
    {
      title: 'Security & code reviews',
      items: [
        'Login throttling, passwords bcrypt would truncate refused, sessions end on reset and after 12 hours',
        'Equal sign-in timing for unknown emails; tokens and tickets redacted from logs',
        'Role rules for ICR, supervisor, admin and a read-only management role',
        'Reviewed and integrated teammates’ branches before merging'
      ],
      evidence: ['4f5d501', '138e44d', '1dfd0a8', '0bf1bf2', 'e658e18', '6c9a2b1', '4802616']
    },
    {
      title: 'Testing & validation',
      items: [
        'Backend test suite kept green; over 3,000 tests by 20 Nov 2026',
        'Tests isolated from the developer’s settings: full run from 9 min 25 s to 54 s',
        'Accuracy script, load test and five real call replays',
        'Old tests repaired or removed so every failure is new'
      ],
      evidence: ['b6479b9', '235da21', 'b5a4cf6', '48fba3f']
    },
    {
      title: 'Deployment & hosting',
      items: [
        'Docker images and a production Compose stack; Prometheus and Grafana',
        'HTTPS with Caddy and automatic certificates',
        'AWS plan: one EC2 server in Mumbai with S3 through the IAM role',
        'Web app hosted on Cloudflare; CI fix so the app starts in CI'
      ],
      evidence: ['4c75c18', 'd59bb1f', 'ff0440b', '13b7b52', '783d18d', '4a895fc']
    },
    {
      title: 'Documentation & cost planning',
      items: [
        'SRD-STATUS.md: all 121 requirements checked one by one',
        'GO-LIVE-CHECKLIST.md, DEPLOYMENT.md and README',
        'One-year bill of materials: ₹3,25,201 including GST',
        'Progress tracker and customer discovery canvas'
      ],
      evidence: ['be48284', '48fba3f', '84ee2d7']
    }
  ],

  evidence: {
    links: [
      { label: 'MVP website', note: 'Product overview, team and results', href: 'https://mup-project-website.mkarthikaravind1.workers.dev/' },
      { label: 'Live MVP app', note: 'Hosted web app (sign-in on request)', href: 'https://multilingual-call-intelligence.mkarthikaravind1.workers.dev/' },
      { label: 'Product tour', note: 'Every screen of the app, on the MVP website', href: 'https://mup-project-website.mkarthikaravind1.workers.dev/#tour' },
      { label: 'Demo video, part 1', note: 'Google Drive', href: 'https://drive.google.com/file/d/1dPJ_ra8poUuN0PxoYwyH7zZlP8IZ2-MC/view' },
      { label: 'Demo video, part 2', note: 'Google Drive', href: 'https://drive.google.com/file/d/1DIxnmVp-_H3CVDTr2XHM8LCDHbDeRFU6/view' },
      { label: 'GitHub repository', note: 'Source code and history', href: 'https://github.com/mkarthikaravind1/Multilingual-Call-Intelligence' },
      { label: 'My commits', note: 'Filtered by author on GitHub', href: 'https://github.com/mkarthikaravind1/Multilingual-Call-Intelligence/commits?author=mkarthikaravind1' },
      { label: 'SRD status', note: '121 requirements, met / waiting / not met', href: 'https://github.com/mkarthikaravind1/Multilingual-Call-Intelligence/blob/main/SRD-STATUS.md' },
      { label: 'Go-live checklist', note: 'What to fill in for each provider', href: 'https://github.com/mkarthikaravind1/Multilingual-Call-Intelligence/blob/main/GO-LIVE-CHECKLIST.md' },
      { label: 'Deployment guide', note: 'Production operations', href: 'https://github.com/mkarthikaravind1/Multilingual-Call-Intelligence/blob/main/DEPLOYMENT.md' },
      { label: 'Progress tracker', note: 'Team 8 deck, 29 Oct 2026 (PPTX)', href: 'assets/mvp/docs/Team-8-Progress-Tracker.pptx', download: true }
    ],
    images: [
      { src: 'assets/mvp/docs/customer-discovery-canvas.png', title: 'Customer discovery canvas', alt: 'Forge problem-validation and customer-discovery canvas for Multilingual Call Intelligence, profiling the service-centre owner and answering six questions: importance, problem description, constraints, benefits, tried solutions and gaps.' },
      { src: 'assets/mvp/docs/call-flow.png', title: 'Call flow', alt: 'Diagram of one call in four stages: call initiation, real-time AI processing (audio capture, speech-to-text, speaker diarisation, AI analysis), call termination, and post-call intelligence.' },
      { src: 'assets/mvp/docs/database-schema.png', title: 'Database schema', alt: 'PostgreSQL schema of 19 tables grouped as calls, complaints, the learning loop and administration, with their columns and foreign keys.' }
    ]
  },

  skills: [
    { group: 'Backend', tags: ['Python 3.12', 'FastAPI', 'Pydantic', 'SQLAlchemy 2', 'Alembic', 'WebSockets', 'JWT auth & roles'] },
    { group: 'Data', tags: ['PostgreSQL', 'Redis', 'Encryption at rest', 'Backups & replication', 'S3'] },
    { group: 'AI & speech', tags: ['Groq (gpt-oss-20b / 120b)', 'Prompt design', 'Sarvam speech-to-text', 'Streaming ASR', 'pyannote diarisation', 'Code-mixed Indian languages'] },
    { group: 'Telephony', tags: ['Plivo media streams', 'Webhook signatures', 'Asterisk (ARI)', 'Click-to-call', 'MSG91 + DLT SMS'] },
    { group: 'Frontend', tags: ['React 19', 'TypeScript', 'Vite', 'React Router', 'Responsive UI', 'Keyboard shortcuts'] },
    { group: 'DevOps', tags: ['Docker', 'Docker Compose', 'nginx', 'Caddy (HTTPS)', 'Prometheus', 'Grafana', 'GitHub Actions', 'Cloudflare', 'AWS EC2 / S3 / IAM'] },
    { group: 'Quality & product', tags: ['pytest', 'Load testing', 'Accuracy measurement', 'Code review', 'SRD tracking', 'Cost planning (BoM)', 'Customer discovery'] }
  ],

  challenges: [
    {
      title: 'AI cost per call',
      problem: 'A 2-minute test call made 43 LLM requests and used 27,777 tokens. Groq’s free tier covers only about 15 calls a day.',
      solution: 'One combined request for complaints, tone and escalation at most every 30 s, skipped when the customer said nothing new; urgent words caught by instant keyword rules.',
      result: '12,906 tokens in 11 requests: 54% fewer tokens.',
      evidence: ['187ca24', 'e9fd020', 'deca4dd']
    },
    {
      title: 'Transcript latency',
      problem: 'The chunked recogniser put a line on screen about 1.9 s after the speaker stopped and held long sentences back.',
      solution: 'A streaming connection to Sarvam per audio stream, falling back to chunks if the connection fails, without losing audio.',
      result: 'Median 1.0 s (0.9–1.3 s) on a Tamil–English replay, inside the SRD’s 2 s target.',
      evidence: ['47da55c']
    },
    {
      title: 'Telephony webhook signature',
      problem: 'The Plivo signature was computed with the V2 scheme while reading V3 headers, so every real Plivo webhook would have been refused. Calls whose hang-up never arrived stayed active.',
      solution: 'Followed Plivo’s V3 scheme (URL, sorted form fields, nonce) and added a sweep that completes silent calls with a closed stream.',
      result: 'Webhooks verified correctly in tests; repeated answers no longer create a second call.',
      evidence: ['61e57f4']
    },
    {
      title: 'Mixed-language calls',
      problem: 'One English line tagged English and Tamil made every later suggested question Tamil, and PDF exports printed only Latin script.',
      solution: 'Decided the customer’s language by words, not lines; bundled Noto fonts for Indian scripts; retried when Sarvam labels speech in an unsupported language.',
      result: 'English and Tamil–English calls handled end to end; reports print all four Indian scripts.',
      evidence: ['ed3ace0', '9ada694', 'f27c2b7', 'cebcfc7']
    },
    {
      title: 'Live Calls at 500 calls',
      problem: 'The supervisor view made about eight database reads per active call on every refresh and listed at most 100 calls.',
      solution: 'Four batched reads however many calls are live, server-side filters and paging, alerts raised by a background sweep.',
      result: 'Built to hold 500 calls; tested with 500 seeded records.',
      evidence: ['2deb614']
    },
    {
      title: 'Slow, unreliable tests',
      problem: 'Tests read the developer’s settings file, so they called real Redis, Groq and Sarvam; a full run took 9 min 25 s.',
      solution: 'A setting that points tests at no settings file, then repaired or removed the old failing tests.',
      result: 'Full run in 54 s, and any failure is a new one.',
      evidence: ['b6479b9', 'b5a4cf6']
    }
  ],

  reflection: [
    'On this MVP I was responsible for the system design and for bringing every part together: the backend, the AI pipeline, the live call screen, telephony, testing and the plan to go live. Building it week by week taught me that a real-time AI product is mostly engineering around the model: keeping the transcript flowing when the AI is slow, holding the cost of each call down, and checking every claim against the requirements instead of against my own notes.',
    'Leading the team meetings and the MUP reviews taught me to turn feedback into small, testable steps, to give teammates clear pieces of work and integrate them carefully, and to say plainly what is proven and what is still waiting for real phone calls and recordings.'
  ]
};
