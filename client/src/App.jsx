import { Fragment } from 'react';
import LapBar from './components/layout/LapBar';
import Navbar from './components/layout/Navbar';
import Section from './components/layout/Section';
import SectorDivider from './components/layout/SectorDivider';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Education from './components/sections/Education';
import Playground from './components/sections/Playground';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import { profile } from './data/profile';
import { sections } from './data/sections';

const sectionContent = {
  about: About,
  skills: Skills,
  projects: Projects,
  education: Education,
  contact: Contact,
  playground: Playground,
};

export default function App() {
  return (
    <>
      <title>{`${profile.name} | ${profile.tagline}`}</title>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <LapBar />
      <Navbar />
      <main id="main">
        {sections.map((section, i) => {
          const Content = sectionContent[section.id];
          return (
            <Fragment key={section.id}>
              {i > 0 && <SectorDivider />}
              <Section {...section}>
                <Content />
              </Section>
            </Fragment>
          );
        })}
      </main>
    </>
  );
}
