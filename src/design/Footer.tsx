import React, { useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';


const MagneticBackToTop = () => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current || !isHovered) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const radius = 80;

    if (distance < radius) {
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const force = (radius - distance) / radius;
      x.set(-Math.cos(angle) * force * 25);
      y.set(-Math.sin(angle) * force * 25);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      onMouseMove={handleMouseMove}
      style={{ x: springX, y: springY }}
      animate={{
        scale: isHovered ? 1.15 : 1,
        borderRadius: isHovered ? '50%' : '6px',
      }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 right-8 w-12 h-12 bg-bone text-graphite flex items-center justify-center text-sm font-medium hover:bg-bone/90 transition-colors z-40 border border-bone/20"
    >
      ↑
    </motion.button>
  );
};


const Footer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <>
      <MagneticBackToTop />

      <footer ref={sectionRef} className="relative bg-graphite text-bone overflow-hidden">
        {/* Background logo with ultra-low opacity */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <img
            src="/logo/white_trans.png"
            alt=""
            className="absolute -top-32 -right-32 w-[600px] h-auto"
          />
        </div>

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 400 400%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 /%3E%3C/filter%3E%3Crect width=%27400%27 height=%27400%27 fill=%27%23fff%27 filter=%27url(%23noiseFilter)%27 /%3E%3C/svg%3E")',
          }}
        />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 lg:py-32 relative z-10">
          {/* Statement Heading */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-[8vw] lg:text-[7vw] font-bold tracking-[-0.03em] text-bone leading-[0.95]">
              Vinyl Floors
              <br />
              <span className="italic font-light text-bone/60">done right.</span>
            </h2>
          </motion.div>

          {/* Brand Signature */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="text-lg font-satoshi italic font-light tracking-[0.15em] text-bone/80">
              Serving Michigan homes and businesses
            </p>
          </motion.div>

          {/* Blueprint-Style Legal Footer */}
          <motion.div
            className="border-t border-bone/10 pt-8 mt-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <p className="text-xs font-mono tracking-[0.2em] text-bone/40">
                &copy; 2026 Tuan Tling Vinyl Flooring | Michigan, USA
              </p>
              <div className="flex gap-6 text-xs font-mono tracking-[0.1em] text-bone/40">
                <a href="#" className="hover:text-bone/60 transition-colors">PRIVACY</a>
                <span className="text-bone/20">—</span>
                <a href="#" className="hover:text-bone/60 transition-colors">TERMS</a>
                <span className="text-bone/20">—</span>
                <a href="#" className="hover:text-bone/60 transition-colors">CONTACT</a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
