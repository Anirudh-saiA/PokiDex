export const profile = {
  name: 'Ankam Sai Anirudh',
  tagline: 'CS Undergraduate · AI & ML · Chennai, India',
  email: 'anirudhsai356@gmail.com',
  phone: '+91-83417-05946',
  github: 'https://github.com/ankam-saianirudh',
  linkedin: 'https://linkedin.com/in/saianirudhofficial',
  intro:
    "Third-year CS (AI & ML) student who likes turning messy real-world data into things that actually ship — a computer-vision inspection line running on a factory floor at Tata Steel, air-quality forecasts across six cities, a resume screener that reads PDFs faster than I can. Comfortable across the whole pipeline: data cleaning, model building, and the REST API someone else builds on top of.",
}

export type SkillLevel = 'strong' | 'solid' | 'growing'

export interface Skill {
  name: string
  value: number // 0-100, used for the HP bar
  level: SkillLevel
}

export interface SkillGroup {
  title: string
  skills: Skill[]
}

const levelFor = (value: number): SkillLevel =>
  value >= 80 ? 'strong' : value >= 50 ? 'solid' : 'growing'

const skill = (name: string, value: number): Skill => ({ name, value, level: levelFor(value) })

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: [
      skill('Python', 95),
      skill('SQL', 85),
      skill('Java / JavaScript / TypeScript', 65),
      skill('C++', 60),
    ],
  },
  {
    title: 'Data & Machine Learning',
    skills: [
      skill('Pandas / NumPy / scikit-learn', 90),
      skill('TensorFlow / PyTorch', 75),
      skill('XGBoost / CatBoost / LightGBM', 85),
      skill('OpenCV / Computer Vision', 88),
    ],
  },
  {
    title: 'Backend & Web',
    skills: [skill('FastAPI / Flask / REST APIs', 85), skill('React / Next.js / Tailwind', 70)],
  },
  {
    title: 'Databases & Tools',
    skills: [
      skill('MySQL / PostgreSQL / Redis / Qdrant', 80),
      skill('Git / Docker', 78),
    ],
  },
]

export const experience = {
  company: 'Tata Steel',
  role: 'ML Intern',
  period: 'Nov 2025 – Apr 2026',
  location: 'Chennai, India',
  moves: [
    'Built a four-stage computer-vision inspection pipeline (Python, OpenCV) — acquisition, preprocessing, edge detection, contour extraction — automating TMT rebar quality checks against IS 1786 on 1,000+ images at sub-millimeter accuracy, cutting manual inspection time by 40%.',
    'Deployed the pipeline into a field-facing mobile app with manufacturing engineers, reducing false-positive rod rejections by 25% and improving throughput.',
  ],
}

export interface Project {
  name: string
  type: string
  summary: string
  details: string[]
}

export const projects: Project[] = [
  {
    name: 'Urban AQI Prediction',
    type: 'Forecasting',
    summary: 'Real-time air-quality forecasting across six cities.',
    details: [
      'End-to-end ETL pipeline unifying multi-city weather and pollutant data for real-time air-quality forecasting.',
      'Benchmarked 6 models; a stacked XGBoost + CatBoost + Ridge ensemble reached R²=0.9576, MAE=5.68, RMSE=7.24.',
      'Served via MySQL + FastAPI, visualized on a React/TypeScript dashboard.',
    ],
  },
  {
    name: 'Smart Resume Screener',
    type: 'NLP',
    summary: 'Parses PDF resumes and matches them to job roles.',
    details: [
      'Parsing pipeline extracting structured candidate data from unstructured PDF resumes.',
      'TF-IDF + Cosine Similarity matching reached 87% job-role prediction accuracy across 12 categories on 500 resumes.',
      'FastAPI backend with a React + Tailwind frontend for live upload and skill-gap feedback.',
    ],
  },
  {
    name: 'TMT Rib Analyzer',
    type: 'Computer Vision',
    summary: 'Precision rib-profile measurement from images.',
    details: [
      'Computer-vision system for automated TMT rib profile analysis using edge, contour, and peak detection.',
      'Pixel-to-millimeter calibration (NumPy, SciPy, Matplotlib) measuring rib height, spacing, and count precisely.',
    ],
  },
]

export const education = {
  school: 'SRM Institute of Science and Technology, Chennai',
  degree: 'B.Tech Computer Science (AI & ML)',
  detail: 'CGPA 8.54 / 10.0, expected May 2027',
}

export const badges = [
  'Deep Learning Specialization — DeepLearning.AI',
  'Supervised ML: Regression & Classification — Stanford / DeepLearning.AI',
  'Database Structures & Management with MySQL — Meta',
  'Remote Sensing, GIS & GNSS — ISRO',
  'Smart India Hackathon 2025 — Internal Edition',
  'Bharatiya Antariksh Hackathon 2025 · HackPick Bootcamp',
]

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Pokédex' },
  { id: 'experience', label: 'Battle' },
  { id: 'projects', label: 'Items' },
  { id: 'badges', label: 'Badges' },
  { id: 'contact', label: 'Save' },
] as const
