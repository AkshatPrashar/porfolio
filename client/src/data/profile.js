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
    { label: "GitHub", href: "https://github.com/AkshatPrashar" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/akshat-prashar-487ba332a/" },
    { label: "Email", href: "mailto:akshat.prashar104@gmail.com" }
  ],
};
