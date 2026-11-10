const [photoSrc = null] = Object.values(
  import.meta.glob('../assets/profile.webp', { eager: true, import: 'default' }),
);

const name = 'Your Name';

export const profile = {
  name,
  tagline: 'Full-Stack Engineer',
  status: 'AVAILABLE FOR WORK',
  photo: { src: photoSrc, alt: `Portrait of ${name}`, position: 'center 25%' },
  socials: [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Email', href: '#' },
  ],
};
