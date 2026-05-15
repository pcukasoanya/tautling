import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const CleanlinessIcon = ({ isInView }: { isInView: boolean }) => (
  <svg viewBox="0 0 80 80" className="w-12 h-12">
    <circle cx="40" cy="40" r="3" fill="currentColor" />
    {[0, 90, 180, 270].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      return (
        <motion.line
          key={i}
          x1={40 + 7 * Math.cos(rad)}
          y1={40 + 7 * Math.sin(rad)}
          x2={40 + 20 * Math.cos(rad)}
          y2={40 + 20 * Math.sin(rad)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 + 0.4 }}
        />
      );
    })}
    {[45, 135, 225, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      return (
        <motion.line
          key={`d${i}`}
          x1={40 + 6 * Math.cos(rad)}
          y1={40 + 6 * Math.sin(rad)}
          x2={40 + 13 * Math.cos(rad)}
          y2={40 + 13 * Math.sin(rad)}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: [0, 0.6, 0] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 + 0.7 }}
        />
      );
    })}
  </svg>
);

const ClockIcon = ({ isInView }: { isInView: boolean }) => (
  <svg viewBox="0 0 80 80" className="w-12 h-12">
    <circle cx="40" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    {[0, 90, 180, 270].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={40 + 17 * Math.sin(rad)}
          y1={40 - 17 * Math.cos(rad)}
          x2={40 + 20 * Math.sin(rad)}
          y2={40 - 20 * Math.cos(rad)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    })}
    {/* Hour hand fixed */}
    <line x1="40" y1="40" x2="32" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Minute hand rotating */}
    <motion.g
      style={{ transformOrigin: '40px 40px' }}
      animate={isInView ? { rotate: [0, 360] } : { rotate: 0 }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.3 }}
    >
      <line x1="40" y1="40" x2="40" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </motion.g>
    <circle cx="40" cy="40" r="2.5" fill="currentColor" />
  </svg>
);

const PriceTagIcon = ({ isInView }: { isInView: boolean }) => (
  <svg viewBox="0 0 80 80" className="w-12 h-12">
    <motion.path
      d="M24 24 L24 50 L40 62 L56 50 L56 24 L40 16 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
    />
    <circle cx="40" cy="26" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <motion.line
      x1="32" y1="40" x2="48" y2="40"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
      style={{ transformOrigin: '40px 40px' }}
      transition={{ delay: 1, duration: 0.4 }}
    />
    <motion.line
      x1="35" y1="47" x2="45" y2="47"
      stroke="currentColor" strokeWidth="1" strokeLinecap="round"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isInView ? { scaleX: 1, opacity: 0.5 } : { scaleX: 0, opacity: 0 }}
      style={{ transformOrigin: '40px 47px' }}
      transition={{ delay: 1.2, duration: 0.4 }}
    />
  </svg>
);

const CheckIcon = ({ isInView }: { isInView: boolean }) => (
  <svg viewBox="0 0 80 80" className="w-12 h-12">
    <motion.circle
      cx="40" cy="40" r="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isInView ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    />
    <motion.path
      d="M27 40 L36 49 L53 31"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
    />
  </svg>
);

const SpecCard = ({
  icon: IconComponent,
  title,
  value,
  numValue,
  subtext,
  index,
  isInView,
}: {
  icon: React.ComponentType<{ isInView: boolean }>;
  title: string;
  value: string;
  numValue: number;
  subtext: string;
  index: number;
  isInView: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Blueprint Border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.rect
          x="0.25"
          y="0.25"
          width="99.5"
          height="99.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-bone/30"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1, delay: index * 0.15 + 0.4 }}
        />
      </svg>

      {/* Card Background */}
      <motion.div
        className="absolute inset-0 bg-graphite"
        animate={{
          background: isHovered
            ? 'rgba(26, 26, 26, 0.7)'
            : 'rgba(26, 26, 26, 1)',
          boxShadow: isHovered
            ? '0 0 40px rgba(244, 241, 238, 0.08)'
            : '0 0 0px rgba(244, 241, 238, 0)',
        }}
        transition={{ duration: 0.4 }}
        style={{
          backdropFilter: isHovered ? 'blur(12px)' : 'blur(0px)',
        }}
      />

      {/* Scanning Line Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        animate={{
          y: ['0%', '100%'],
          opacity: [0, 0.15, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(244, 241, 238, 0.3), transparent)',
          height: '20px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col">
        <motion.div
          className="text-bone/70 mb-6"
          animate={{ y: isHovered ? -4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <IconComponent isInView={isInView} />
        </motion.div>

        <motion.div
          animate={{ y: isHovered ? -6 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-6">
            {title}
          </div>

          <div className="font-display text-4xl lg:text-5xl tracking-[-0.03em] text-bone mb-2">
            {value}
          </div>

          <div className="mt-3 text-xs text-bone/50">{subtext}</div>
        </motion.div>

        {/* Blueprint Annotation */}
        <motion.div
          className="mt-auto text-[8px] font-mono tracking-[0.15em] text-bone/20 uppercase"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.15 + 0.6, duration: 0.6 }}
        >
          {index === 0 && 'STD_CLEANLINESS'}
          {index === 1 && 'STD_PUNCTUALITY'}
          {index === 2 && 'STD_PRICING'}
          {index === 3 && 'STD_QUALITY'}
        </motion.div>
      </div>
    </motion.div>
  );
};

const TangerineText = ({ children }: { children: React.ReactNode }) => (
  <span className="italic">{children}</span>
);

const ScanningLine = () => {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-bone to-transparent pointer-events-none"
      style={{ opacity: 0.2 }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    />
  );
};

const Specifications = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const specs = [
    {
      icon: CleanlinessIcon,
      title: 'Cleanliness',
      value: 'Always',
      numValue: 0,
      subtext: 'We clean up after every job. Your space is left neat and tidy — no mess, no dust, no leftover materials.',
    },
    {
      icon: ClockIcon,
      title: 'We Show Up On Time',
      value: 'Every Job',
      numValue: 0,
      subtext: 'We arrive when we say we will and finish on schedule. No waiting around all day.',
    },
    {
      icon: PriceTagIcon,
      title: 'Honest Pricing',
      value: 'No Surprises',
      numValue: 0,
      subtext: 'What we quote is what you pay. We tell you the full cost upfront before any work begins.',
    },
    {
      icon: CheckIcon,
      title: 'Quality We Stand Behind',
      value: 'Guaranteed',
      numValue: 0,
      subtext: 'We only install vinyl flooring we would put in our own homes. Every job gets our full attention.',
    },
  ];

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="specifications"
      ref={sectionRef}
      className="relative bg-graphite text-bone py-32 lg:py-48 overflow-hidden"
      style={{
        backgroundImage: 'url(/specifications-vinyl-technical.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Technical Background Overlay */}
      <div className="absolute inset-0 bg-graphite/85" />

      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-16 xl:px-20 relative z-10">
        {/* Header */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-[11px] tracking-[0.3em] uppercase text-bone/40 mb-6"
        >
          — 02 / Our Standards
        </motion.div>

        <motion.h2
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="font-display text-5xl lg:text-7xl tracking-[-0.03em] leading-[0.95] max-w-4xl"
        >
          What we{' '}
          <TangerineText>
            <span className="font-light text-bone/60">stand by.</span>
          </TangerineText>
        </motion.h2>

        {/* Specs Grid */}
        <div className="mt-20 relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-bone/10 overflow-hidden rounded-lg auto-rows-[320px]">
          <ScanningLine />
          {specs.map((spec, i) => (
            <SpecCard
              key={i}
              {...spec}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Technical Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 pt-8 border-t border-bone/10"
        >
          <p className="text-[10px] font-mono tracking-[0.2em] text-bone/30 uppercase">
            Tuan Tling Vinyl Flooring | Michigan | Our Promise to Every Customer
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Specifications;
