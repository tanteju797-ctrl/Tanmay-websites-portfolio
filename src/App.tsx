import { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import WorkSection from './components/WorkSection';
import ProcessSection from './components/ProcessSection';
import AboutMeSection from './components/AboutMeSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import IntroLoader from './components/IntroLoader';
import CaseStudyModal from './components/CaseStudyModal';
import ProjectModal from './components/ProjectModal';
import ThemeSelector from './components/ThemeSelector';
import StorylineCompanion from './components/StorylineCompanion';
import RibbonGlow from './components/originkit/ui/ribbon-glow';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SoundProvider, useSound } from './context/SoundContext';
import { PROJECTS } from './data/portfolioData';
import { Project } from './types';

function AppContent() {
  const [introFinished, setIntroFinished] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [modalServicePrefill, setModalServicePrefill] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const activeSectionRef = useRef<string>('hero');
  const { themeConfig } = useTheme();
  const { playScrollTransition, playModalOpen, playModalClose, playClick } = useSound();

  // Scroll spy to update active section in floating navigation with RAF throttling
  useEffect(() => {
    let ticking = false;

    const updateScrollSection = () => {
      const sections = ['hero', 'about', 'work', 'process', 'about-me', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (activeSectionRef.current !== sectionId) {
              activeSectionRef.current = sectionId;
              setActiveSection(sectionId);
              playScrollTransition(sectionId);
            }
            break;
          }
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollSection();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [playScrollTransition]);

  const handleOpenContactWithService = (serviceName?: string) => {
    setModalServicePrefill(serviceName || '');
    playModalOpen();
    setIsProjectModalOpen(true);
  };

  const handleOpenProject = (proj: Project) => {
    playModalOpen();
    setSelectedProject(proj);
  };

  const handleCloseProjectModal = () => {
    playModalClose();
    setSelectedProject(null);
  };

  const handleCloseContactModal = () => {
    playModalClose();
    setIsProjectModalOpen(false);
  };

  return (
    <div
      className="relative min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-500"
      style={{
        backgroundColor: themeConfig.bgMain,
        color: themeConfig.textPrimary,
      }}
    >
      {/* Originkit "Ribbon Glow" Full Portfolio Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <RibbonGlow
          className="w-full h-full"
          background={themeConfig.bgMain}
          color1={themeConfig.accent}
          color2={themeConfig.secondaryAccent}
          speed={40}
          size={110}
          hover={110}
          reach={280}
          style={{ position: 'absolute', inset: 0 }}
        />
        {/* Atmospheric Vignette Overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: themeConfig.isLight
              ? 'radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(250, 248, 245, 0.45) 85%)'
              : 'radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(9, 10, 12, 0.55) 90%)',
          }}
        />
      </div>

      {/* 1. Cinematic Custom Cursor */}
      <CustomCursor />

      {/* 2. Brand Intro Reveal Sequence */}
      <IntroLoader onComplete={() => setIntroFinished(true)} />

      {/* 3. Floating Glass Navigation */}
      <Navigation
        activeSection={activeSection}
        onOpenContact={() => handleOpenContactWithService()}
      />

      {/* 4. Floating Animated Storyline Character Companion */}
      <StorylineCompanion />

      {/* 5. Main Page Sections */}
      <main id="main-content" className="relative">
        {/* Full-screen Hero Section with 3D Canvas and Floating Glass Cards */}
        <HeroSection
          featuredProject={PROJECTS[0]}
          onOpenProject={handleOpenProject}
          onOpenContact={() => handleOpenContactWithService()}
        />

        {/* Editorial About / Brand Statement */}
        <AboutSection />

        {/* Selected Work / Portfolio with 60 FPS Looping Video Showcases */}
        <WorkSection onOpenProject={handleOpenProject} />

        {/* The 5-Step Process Timeline */}
        <ProcessSection />

        {/* Behind The Screen / Interactive Skill Constellation */}
        <AboutMeSection />

        {/* Indian Client Testimonials & Founder Endorsements */}
        <TestimonialsSection onOpenProjectModal={() => handleOpenContactWithService()} />

        {/* Cinematic Contact CTA */}
        <ContactSection onOpenProjectModal={() => handleOpenContactWithService()} />
      </main>

      {/* 6. Minimalist Luxury Footer */}
      <Footer />

      {/* 7. Floating Theme Selector Dock */}
      <ThemeSelector variant="floating" />

      {/* 8. Case Study Full-Screen Modal with Looping Videos & Specs */}
      <CaseStudyModal
        project={selectedProject}
        onClose={handleCloseProjectModal}
        onOpenContact={(title) => handleOpenContactWithService(title)}
      />

      {/* 9. Interactive Project Inquiry Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleCloseContactModal}
        initialService={modalServicePrefill}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <AppContent />
      </SoundProvider>
    </ThemeProvider>
  );
}


