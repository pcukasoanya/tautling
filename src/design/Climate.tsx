import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';

type Season = 'winter' | 'summer';

const ThermalCursor = ({ isActive, season }: { isActive: boolean; season: Season }) => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 400, damping: 28 });
  const springY = useSpring(y, { stiffness: 400, damping: 28 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  const accent = season === 'winter' ? 'rgba(71, 85, 105,' : 'rgba(180, 83, 9,';
  const temp = season === 'winter' ? '-20°F' : '105°F';

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed pointer-events-none z-[9999]"
          style={{ left: springX, top: springY, x: '-50%', y: '-50%' }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="68" height="68" viewBox="0 0 68 68">
            <motion.circle
              cx="34" cy="34" r="30"
              fill="none"
              stroke={`${accent}0.35)`}
              strokeWidth="0.75"
              strokeDasharray="5 3"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180 - Math.PI / 2;
              const isMajor = i % 3 === 0;
              const r1 = isMajor ? 22 : 24;
              return (
                <line
                  key={i}
                  x1={34 + r1 * Math.cos(angle)} y1={34 + r1 * Math.sin(angle)}
                  x2={34 + 28 * Math.cos(angle)} y2={34 + 28 * Math.sin(angle)}
                  stroke={`${accent}${isMajor ? '0.65' : '0.30'})`}
                  strokeWidth={isMajor ? '1.5' : '0.75'}
                />
              );
            })}
            <circle cx="34" cy="34" r="2.5" fill={`${accent}0.85)`} />
            <text x="34" y="53" textAnchor="middle"
              fill={`${accent}0.9)`}
              fontSize="6" fontFamily="'Courier New', monospace"
              letterSpacing="0.1em"
            >
              {temp}
            </text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SeasonToggle = ({ season, onChange }: { season: Season; onChange: (s: Season) => void }) => {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-full border border-graphite/15 bg-graphite/5">
      {(['winter', 'summer'] as Season[]).map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className="relative px-5 py-2 rounded-full text-xs font-medium tracking-wider transition-colors"
          style={{
            color: season === s ? '#1a1a1a' : '#1a1a1a/50',
            backgroundColor: season === s ? 'rgba(244, 241, 238, 0.15)' : 'transparent',
          }}
        >
          {s === 'winter' ? 'Winter' : 'Summer'}
        </button>
      ))}
    </div>
  );
};

const FrostOverlay = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 30%, rgba(71, 85, 105, 0.05) 0%, transparent 50%)' }} />
      </motion.div>
    )}
  </AnimatePresence>
);

const SolarOverlay = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(180, 83, 9, 0.04) 0%, transparent 50%)' }} />
      </motion.div>
    )}
  </AnimatePresence>
);

const cardDefs = [
  {
    code: '01',
    title: 'Handles Hot & Cold',
    stat: '-20°F to 100°F+',
    desc: 'Michigan winters are cold and summers are hot. Vinyl flooring handles both without cracking, warping, or coming apart at the seams.',
    spec: 'TEMP_RANGE: MICHIGAN_CERTIFIED',
  },
  {
    code: '02',
    title: 'Survives Spills & Moisture',
    stat: '100% Waterproof',
    desc: 'Spills, leaks, and humidity don\'t damage vinyl flooring. It\'s fully waterproof from top to bottom — great for kitchens, bathrooms, and basements.',
    spec: 'WATERPROOF: FULL_CORE',
  },
  {
    code: '03',
    title: 'Stays Looking New',
    stat: 'Fade Resistant',
    desc: 'The finish on vinyl flooring doesn\'t fade from sunlight or foot traffic. It keeps its colour and look for years without needing to be replaced.',
    spec: 'UV_PROTECTION: GRADE_8',
  },
  {
    code: '04',
    title: 'Quiet Underfoot',
    stat: 'Noise Reducing',
    desc: 'Our vinyl comes with a built-in underlayer that reduces noise when you walk on it. Great for upstairs rooms, apartments, and busy households.',
    spec: 'NOISE_REDUCTION: IIC_70+',
  },
] as const;

const ClimateCard = ({
  def,
  season,
  index,
}: {
  def: typeof cardDefs[number];
  season: Season;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const isCold = season === 'winter';
  const accentColor = isCold ? 'rgba(71, 85, 105,' : 'rgba(180, 83, 9,';
  const borderColor = isCold ? 'rgba(71, 85, 105, 0.3)' : 'rgba(180, 83, 9, 0.25)';
  const bgColor = isCold ? 'rgba(244, 241, 238, 0.6)' : 'rgba(244, 241, 238, 0.55)';

  return (
    <motion.div
      className="relative flex-shrink-0 w-80 rounded-xl overflow-hidden"
      style={{
        background: bgColor,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${borderColor}`,
      }}
      animate={{
        borderColor,
        background: bgColor,
        y: hovered ? -6 : 0,
        boxShadow: hovered
          ? `0 20px 50px -10px ${accentColor} 0.15)`
          : '0 8px 24px rgba(26, 26, 26, 0.08)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="p-8 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <span className="text-xs font-mono tracking-wider text-graphite/40">{def.code}</span>
          <motion.span
            className="text-[10px] font-mono tracking-wider"
            animate={{ opacity: hovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
            style={{ color: `${accentColor} 0.9)` }}
          >
            {def.spec}
          </motion.span>
        </div>

        <h3 className="font-display text-xl lg:text-2xl font-bold text-graphite mb-4 tracking-tight">
          {def.title}
        </h3>

        <div className="mb-6">
          <div
            className="font-display text-3xl font-bold tracking-tight"
            style={{ color: `${accentColor} 0.95)` }}
          >
            {def.stat}
          </div>
        </div>

        <p className="text-sm text-graphite/70 leading-relaxed flex-grow">
          {def.desc}
        </p>

        <div className="mt-6 pt-6 border-t border-graphite/10">
          <motion.div
            className="h-0.5 rounded-full"
            style={{ background: `${accentColor} 0.5)` }}
            animate={{ width: hovered ? '100%' : '24px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const ClimateSection = () => {
  const [season, setSeason] = useState<Season>('winter');
  const [cursorActive, setCursorActive] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.85', 'start 0.15'] });
  const cardsX = useTransform(scrollYProgress, [0, 1], ['100px', '-20px']);

  return (
    <>
      <ThermalCursor isActive={cursorActive} season={season} />

      <section
        id="climate"
        ref={sectionRef}
        className="relative bg-bone py-32 lg:py-48 overflow-hidden"
      >
        <FrostOverlay active={season === 'winter'} />
        <SolarOverlay active={season === 'summer'} />

        <div className="w-full mx-auto px-4 sm:px-6 lg:px-16 xl:px-20 relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-20">
            <motion.div
              className="text-xs font-mono tracking-widest uppercase text-graphite/50"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              — 04 / Why Vinyl
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <SeasonToggle season={season} onChange={setSeason} />
            </motion.div>
          </div>

          {/* Headline */}
          <div className="mb-20">
            <h2 className="font-display text-5xl lg:text-7xl tracking-tight text-graphite leading-[0.95]">
              <div className="overflow-hidden">
                <motion.span
                  className="inline-block font-bold"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={isInView ? { y: '0%', opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  Built for Michigan.
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  className="inline-block italic font-light text-graphite/70"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={isInView ? { y: '0%', opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {' '}All year round.
                </motion.span>
              </div>
            </h2>

            <motion.p
              className="mt-8 text-base text-graphite/65 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Michigan weather is tough on floors. Vinyl flooring is built for it — and here is why it is the smart choice for any home or business in Michigan.
            </motion.p>
          </div>

          {/* Cards Scroll */}
          <div
            ref={trackRef}
            className="overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-16 xl:-mx-20"
            onMouseEnter={() => setCursorActive(true)}
            onMouseLeave={() => setCursorActive(false)}
          >
            <motion.div
              className="flex gap-6 px-4 sm:px-6 lg:px-16 xl:px-20"
              style={{ x: cardsX }}
            >
              {cardDefs.map((def, i) => (
                <ClimateCard key={def.code} def={def} season={season} index={i} />
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            className="mt-20 pt-8 border-t border-graphite/10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-xs font-mono tracking-wider text-graphite/30 uppercase">
              Tuan Tling Vinyl Flooring | Built for Michigan | Waterproof • Durable • Easy to Maintain
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ClimateSection;
