import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const SplitTextReveal = ({ text, isItalic = false }: { text: string; isItalic?: boolean }) => {
  const chars = text.split('');

  return (
    <span className={isItalic ? 'italic font-light text-graphite/80' : 'font-bold text-graphite'}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{
            duration: 0.6,
            delay: i * 0.03,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </span>
  );
};

const MagneticButton = ({ isMobile, scrollProgress }: { isMobile: boolean; scrollProgress: any }) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [buttonHovered, setButtonHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  const ghostX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const ghostY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.2);
    mouseY.set(y * 0.2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setButtonHovered(false);
  };

  return (
    <div className="relative w-full sm:w-auto">
      {/* Ghost border trail */}
      {buttonHovered && !isMobile && (
        <motion.div
          style={{ x: ghostX, y: ghostY }}
          className="absolute inset-0 border border-graphite/20 rounded-full pointer-events-none"
        />
      )}
      {/* Main button */}
      <motion.a
        ref={buttonRef}
        href="#contact"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setButtonHovered(true)}
        style={isMobile ? {} : { x: springX, y: springY }}
        animate={{
          borderColor: buttonHovered ? 'rgba(26, 26, 26, 0.5)' : 'rgba(26, 26, 26, 0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative inline-flex items-center justify-center px-8 sm:px-9 py-3 sm:py-4 bg-graphite text-bone text-[12px] sm:text-[13px] font-medium tracking-wide rounded-full hover:bg-graphite/90 active:scale-95 transition-colors cursor-pointer will-change-transform min-h-[48px] touch-manipulation shadow-md hover:shadow-lg border border-graphite/0"
      >
        Audit Your Space
      </motion.a>
    </div>
  );
};

export const Hero = () => {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 60 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const noiseOpacity = useTransform(scrollYProgress, [0, 1], [0.08, 0.25]);

  // Video 3D tilt effect
  const videoX = useMotionValue(0);
  const videoY = useMotionValue(0);
  const videoSpringX = useSpring(videoX, { stiffness: 150, damping: 20 });
  const videoSpringY = useSpring(videoY, { stiffness: 150, damping: 20 });

  const handleVideoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    videoX.set(x * 8);
    videoY.set(y * 8);
  };

  const handleVideoMouseLeave = () => {
    videoX.set(0);
    videoY.set(0);
  };

  // Grid pulse effect based on scroll
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.06, 0.12, 0.06]);
  const gridScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen bg-bone overflow-hidden pt-20 sm:pt-24 lg:pt-32">
      {/* Dynamic grain texture - increases with scroll */}
      <motion.div
        style={{ opacity: noiseOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg className="w-full h-full" aria-hidden>
          <defs>
            <pattern id="grain-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100%" height="100%" fill="#f4f1ee" />
              <circle cx="20" cy="20" r="1" fill="#1a1a1a" opacity="0.03" />
              <circle cx="50" cy="50" r="0.8" fill="#1a1a1a" opacity="0.02" />
              <circle cx="80" cy="30" r="1.2" fill="#1a1a1a" opacity="0.03" />
              <circle cx="35" cy="75" r="0.9" fill="#1a1a1a" opacity="0.02" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grain-pattern)" />
        </svg>
      </motion.div>

      {/* Pulsing masked grid */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: gridOpacity,
          scale: gridScale,
          maskImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 200px, rgba(0,0,0,0) 400px)`,
        }}
        aria-hidden
      >
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1a1a1a" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </motion.svg>

      <motion.div
        ref={containerRef}
        style={{ y, opacity }}
        className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 pb-16 sm:pb-24"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12 text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] text-graphite/50 uppercase">
          <span className="h-px w-8 sm:w-12 bg-graphite/30" />
          Est. Michigan — Vinyl Flooring Installation
        </div>

        {/* Character-by-character split text reveal */}
        <h1 className="text-[9vw] sm:text-[10vw] lg:text-[10vw] leading-[0.88] tracking-[-0.04em]">
          <div className="block overflow-hidden">
            <SplitTextReveal text="Precision that" />
          </div>
          <div className="block overflow-hidden">
            <SplitTextReveal text="made to last." isItalic />
          </div>
        </h1>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* 3D parallax video container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            onMouseMove={handleVideoMouseMove}
            onMouseLeave={handleVideoMouseLeave}
            className="w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-graphite/10 shadow-2xl cursor-none"
            style={{
              rotateX: videoSpringY,
              rotateY: videoSpringX,
              perspective: '1000px',
            }}
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/flooring-cinematic.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Description and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col justify-start gap-8 sm:gap-10 lg:pt-4"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="h-10 w-0.5 bg-graphite/20 flex-shrink-0 mt-1" />
                <p className="text-base sm:text-lg text-graphite/80 leading-relaxed font-light">
                  We install vinyl floors that look great and last for years. Serving homes and businesses across Michigan.
                </p>
              </div>

              <div className="space-y-3 pl-0">
                <p className="text-sm text-graphite/60 leading-relaxed">
                  Wood look vinyl • Stone look vinyl • 100% waterproof • Easy to clean
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto pt-4">
              <MagneticButton isMobile={isMobile} scrollProgress={scrollYProgress} />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden sm:flex absolute bottom-8 sm:bottom-12 left-4 sm:left-6 lg:left-12 items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-graphite/40">
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="block h-8 w-px bg-graphite/30" />
          Scroll
        </div>
      </motion.div>
    </section>
  );
};
