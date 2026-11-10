const SECTIONS = [
  { id: 'about', label: 'About', hero: true },
  { id: 'skills', label: 'Skills', title: 'Power Unit' },
  { id: 'projects', label: 'Projects', title: 'Race Builds' },
  { id: 'education', label: 'Education', title: 'Career Timeline' },
  { id: 'contact', label: 'Collaborate', title: "Let's Collaborate" },
  { id: 'playground', label: 'Playground', title: 'Take a Lap' },
];

export const sections = SECTIONS.map((section, i) => ({
  ...section,
  index: String(i + 1).padStart(2, '0'),
}));

export const sectionIds = sections.map(({ id }) => id);
