import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    id: 'consultation',
    number: '01',
    label: 'Consultation',
    title: 'We come to you.',
    description: 'We start by visiting your home or business. We look at your floor space, understand what you need, and talk you through your options in plain language. No pressure — just a friendly visit to make sure we get it right.',
    subItems: [
      {
        label: 'Types of Vinyl Floor',
        desc: 'We bring samples so you can see and feel different vinyl options — wood look, stone look, light or dark — right in your own space.',
      },
      {
        label: 'Measurements',
        desc: 'We measure every room, doorway, and edge carefully. No guessing. You know exactly how much vinyl is needed.',
      },
      {
        label: 'Design',
        desc: 'We plan how the floor will look — which direction the planks go, how it flows between rooms, and where the seams land.',
      },
    ],
    optional: false,
    video: '/acoustic.mp4',
  },
  {
    id: 'quotation',
    number: '02',
    label: 'Quotation',
    title: 'You know the full cost upfront.',
    description: 'After the consultation, we give you a full written quote. It clearly breaks down the cost of the vinyl flooring material and the cost of labour. What we quote is what you pay — no hidden charges, no surprises at the end.',
    subItems: null,
    optional: false,
    video: '/flooring-cinematic.mp4',
  },
  {
    id: 'sourcing',
    number: '03',
    label: 'Sourcing Materials',
    title: 'Getting the vinyl ready.',
    description: 'Once you are happy with the quote, the vinyl flooring materials need to be sourced. We can handle this for you through our suppliers, or if you prefer to source the materials yourself, that is completely fine too. Either way, we make sure the right vinyl is ready before installation begins.',
    subItems: null,
    optional: true,
    video: null,
  },
  {
    id: 'installation',
    number: '04',
    label: 'Installation',
    title: 'We get to work.',
    description: 'This is the final step. Our team comes in, prepares the floor, and installs your new vinyl flooring. We work cleanly and carefully, and we do not leave until the job is done properly. Your space is left tidy when we are finished.',
    subItems: null,
    optional: false,
    video: '/vinyl-click-lock.mp4',
  },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-16 border-t border-bone/10"
    >
      {/* Step number + label */}
      <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start gap-4 lg:gap-3 lg:pt-1">
        <div className="font-mono text-[56px] lg:text-[72px] font-bold leading-none text-bone/10 select-none">
          {step.number}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-bone/40 font-mono">
            {step.label}
          </span>
          {step.optional && (
            <span className="inline-block text-[9px] tracking-[0.2em] uppercase font-mono px-2 py-0.5 border border-bone/20 text-bone/40 rounded-full w-fit">
              Optional
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-5 flex flex-col justify-start gap-6">
        <h3 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-bone leading-tight">
          {step.title}
        </h3>
        <p className="text-base text-bone/70 leading-relaxed">
          {step.description}
        </p>

        {/* Sub-items for step 1 */}
        {step.subItems && (
          <div className="space-y-4 pt-2">
            {step.subItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                className="flex gap-4 p-4 border border-bone/10 rounded-lg"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-bone/20 grid place-items-center mt-0.5">
                  <span className="font-mono text-[9px] text-bone/40">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-bone mb-1">{item.label}</p>
                  <p className="text-xs text-bone/60 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video or empty */}
      <div className="lg:col-span-4">
        {step.video ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative aspect-video rounded-xl overflow-hidden border border-bone/10 bg-graphite/40"
          >
            <video
              src={step.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Subtle scan line */}
            <motion.div
              className="absolute left-0 right-0 h-px bg-bone/20 pointer-events-none"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        ) : (
          /* Image for sourcing step */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="aspect-video rounded-xl overflow-hidden border border-bone/10"
          >
            <img
              src="/yourchoice.png"
              alt="Sourcing — your choice"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const PerformanceLab = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="performance-lab" className="relative bg-graphite text-bone">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(90deg, #f4f1ee 1px, transparent 1px), linear-gradient(#f4f1ee 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24 lg:py-32 xl:py-48">

        {/* Header */}
        <div ref={headerRef} className="mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-bone/40 mb-4 sm:mb-6"
          >
            — 03 / How We Work
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] text-bone leading-[0.95] mb-6"
          >
            How we{' '}
            <span className="italic font-light text-bone/60">get started.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-bone/60 leading-relaxed max-w-xl"
          >
            Every job starts with a free consultation. Here is what happens from your first call to your finished floor.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="mt-8">
          {steps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-bone/10">
          <p className="text-[10px] font-mono tracking-[0.2em] text-bone/30 uppercase">
            Tuan Tling Vinyl Flooring | We Come To You | Michigan
          </p>
        </div>
      </div>
    </section>
  );
};

export default PerformanceLab;
