const SECTIONS = [
  { id: 'about', label: 'About', hero: true },
  { id: 'skills', label: 'Skills', title: 'Skills' },
  { id: 'projects', label: 'Projects', title: 'Builds' },
  { id: 'coding', label: 'Coding', title: 'Coding Profiles' },
  { id: 'education', label: 'Education', title: 'Education' },
  { id: 'contact', label: 'Collaborate', title: "Let's Collaborate" },
  { id: 'playground', label: 'Playground', title: 'Take a Lap' },
];

export const sections = SECTIONS.map((section, i) => ({
  ...section,
  index: String(i + 1).padStart(2, '0'),
}));

export const sectionIds = sections.map(({ id }) => id);
