import photoSrc from '../assets/aks_photo.jpeg';

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
