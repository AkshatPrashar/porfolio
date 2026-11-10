import { DiJava } from 'react-icons/di';
import {
  SiC,
  SiCplusplus,
  SiExpress,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNodedotjs,
  SiPostman,
  SiResend,
  SiTailwindcss,
  SiVercel,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

export const skillCategories = [
  {
    name: 'Languages',
    items: [
      { name: 'C', icon: SiC },
      { name: 'C++', icon: SiCplusplus },
      { name: 'Java', icon: DiJava },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'SQL', icon: null },
      { name: 'HTML', icon: SiHtml5 },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
    ],
  },
  {
    name: 'Frameworks',
    items: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express', icon: SiExpress },
    ],
  },
  {
    name: 'Databases',
    items: [
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Oracle DB', icon: null },
      { name: 'PL/SQL', icon: null },
    ],
  },
  {
    name: 'AI / APIs',
    items: [
      { name: 'REST API', icon: null },
      { name: 'Gemini API', icon: SiGooglegemini },
      { name: 'Sarvam API', icon: null },
      { name: 'Resend API', icon: SiResend },
    ],
  },
  {
    name: 'Dev Tools',
    items: [
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'VS Code', icon: VscVscode },
      { name: 'Oracle SQL Developer', icon: null },
      { name: 'Vercel', icon: SiVercel },
      { name: 'Postman', icon: SiPostman },
    ],
  },
];

const flatten = (...categoryNames) =>
  skillCategories
    .filter(({ name }) => categoryNames.includes(name))
    .flatMap(({ name, items }) => items.map((item) => ({ ...item, category: name })));

export const skillRows = [
  flatten('Languages', 'Frameworks', 'Databases'),
  flatten('AI / APIs', 'Dev Tools'),
];
