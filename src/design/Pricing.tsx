import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const SERVICES = [
  {
    id: 's1',
    tier: 'Standard',
    range: '$3.00 – $5.00',
    unit: 'labour per sq. ft.',
    detail: 'Basic floor prep and clean vinyl installation.',
    best: 'Good for flat, even floors with a straightforward layout. Ideal for bedrooms and living rooms.',
    phases: 'Consultation + Installation',
    complexity: 'Simple',
  },
  {
    id: 's2',
    tier: 'Advanced',
    range: '$5.00 – $7.00',
    unit: 'labour per sq. ft.',
    detail: 'More detailed prep, moisture barrier, and custom layout patterns.',
    best: 'For rooms with tricky angles, custom patterns, or floors that need extra prep work before installation.',
    phases: 'Full Service',
    complexity: 'Medium',
    featured: true,
  },
  {
    id: 's3',
    tier: 'Premium',
    range: '$7.00 – $9.00',
    unit: 'labour per sq. ft.',
    detail: 'Subfloor repair, old floor removal, and full noise-reduction underlayment.',
    best: 'For spaces where the existing floor needs to come up or the subfloor needs work before vinyl can go down.',
    phases: 'Full Service',
    complexity: 'Detailed',
  },
];

const TierCard = ({
  service,
  index,
  isInView,
}: {
  service: typeof SERVICES[0];
  index: number;
  isInView: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col"
    >
      {service.featured && (
        <div className="absolute -top-px left-6 right-6 h-px bg-graphite" />
      )}

      {/* Blueprint border SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.rect
          x="0.25" y="0.25" width="99.5" height="99.5"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={service.featured ? '0.75' : '0.4'}
          strokeOpacity={service.featured ? 0.25 : 0.12}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, delay: index * 0.15 + 0.3 }}
        />
      </svg>

      <motion.div
        className="relative z-10 p-8 lg:p-10 flex flex-col h-full"
        animate={{ backgroundColor: hovered ? 'rgba(26,26,26,0.03)' : 'rgba(26,26,26,0)' }}
        transition={{ duration: 0.3 }}
      >
        {/* Tier label */}
        <div className="text-[10px] tracking-[0.3em] uppercase text-graphite/40 mb-6 font-mono">
          {service.id.toUpperCase()} / {service.complexity}
        </div>

        <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight text-graphite mb-8">
          {service.tier}
        </h3>

        {/* Price */}
        <div className="mb-8">
          <div className="font-mono text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-graphite leading-none">
            {service.range}
          </div>
          <div className="font-mono text-[11px] tracking-[0.2em] text-graphite/40 uppercase mt-2">
            {service.unit}
          </div>
        </div>

        <p className="text-sm text-graphite/60 leading-relaxed mb-6">
          {service.best}
        </p>

        <div className="mt-auto pt-6 border-t border-graphite/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-graphite/40">Phases</span>
            <span className="font-mono text-[11px] text-graphite font-bold">{service.phases}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-graphite/40">Includes</span>
            <span className="font-mono text-[10px] text-graphite/60 text-right max-w-[60%]">{service.detail}</span>
          </div>
        </div>

        {/* Hover reveal CTA */}
        <motion.a
          href="#contact"
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 6,
          }}
          transition={{ duration: 0.25 }}
          className="mt-6 block w-full bg-graphite text-bone text-center py-3 rounded-full text-[12px] font-medium tracking-wide hover:bg-graphite/90 transition-colors"
        >
          Reserve a Consultation
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

const Pricing = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative bg-bone py-32 lg:py-48 overflow-hidden"
    >
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(26,26,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-16 xl:px-20 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="text-[11px] tracking-[0.3em] uppercase text-graphite/40 mb-6">
            — 05 / Investment
          </div>
          <h2 className="font-display text-5xl lg:text-7xl font-bold tracking-[-0.03em] text-graphite leading-[0.95]">
            Our{' '}
            <span className="italic font-light text-graphite/60">Pricing.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20"
        >
          <p className="text-base text-graphite/65 leading-relaxed max-w-xl">
            Simple, honest pricing for vinyl flooring installation. We will always give you a full quote before any work starts — no hidden costs, no surprises.
          </p>
          <p className="text-[11px] font-mono tracking-[0.15em] text-graphite/40 uppercase lg:text-right max-w-xs">
            Labour only. Materials ($2.00–$9.00/sq. ft.) quoted separately after home visit.
          </p>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite/10 overflow-hidden">
          {SERVICES.map((service, i) => (
            <div key={service.id} className="bg-bone">
              <TierCard service={service} index={i} isInView={isInView} />
            </div>
          ))}
        </div>

        {/* Site Audit Note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 p-8 lg:p-10 border border-graphite/10 relative"
        >
          {/* Corner marks */}
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-graphite/30" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-graphite/30" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-graphite/30" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-graphite/30" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-graphite/40 mb-3">
                Required First Step
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-graphite mb-2">
                Free Home Visit
              </h3>
              <p className="text-sm text-graphite/60 leading-relaxed max-w-lg">
                Not sure what you need or how much it will cost? We come to your home, look at your space, take measurements, and give you a full quote for free. No pressure, no obligation.
              </p>
            </div>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 inline-flex items-center justify-center px-8 py-4 bg-graphite text-bone text-[13px] font-medium tracking-wide rounded-full hover:bg-graphite/90 transition-colors"
            >
              Audit Your Space
            </motion.a>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-16 pt-8 border-t border-graphite/10"
        >
          <p className="text-[10px] font-mono tracking-[0.2em] text-graphite/30 uppercase">
            Tuan Tling Vinyl Flooring | Michigan | All prices are estimates — final quote given after home visit
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default Pricing;
