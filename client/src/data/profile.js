import { FaLinkedin } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';
import { SiGithub } from 'react-icons/si';
import photoSrc from '../assets/aks_photo.jpeg';

const name = 'Akshat';

export const profile = {
  name,
  tagline: 'Full-Stack Engineer',
  status: 'AVAILABLE FOR WORK',
  photo: { src: photoSrc, alt: `Portrait of ${name}`, position: 'center 25%' },
  socials: [
    { label: 'GitHub', href: '#', icon: SiGithub },
    { label: 'LinkedIn', href: '#', icon: FaLinkedin },
    { label: 'Email', href: '#', icon: MdOutlineEmail },
  ],
};
