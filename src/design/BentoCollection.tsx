import React, { useState, memo, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { LazyImage, LazyVideo } from './components/LazyMedia';

const ITEMS = [
  {
    id: 1,
    title: 'Oak Plank Vinyl',
    cat: 'SPC Rigid Core',
    span: 'lg:col-span-6 lg:row-span-2',
    image: '/northern-oak.mp4',
    desc: 'Wide plank oak look. Strong rigid core that won\'t bend, warp, or crack over time.',
    specs: { core: 'Rigid SPC', thickness: '6.5mm', bestFor: 'Living rooms, hallways' },
  },
  {
    id: 2,
    title: 'Slate Stone Vinyl',
    cat: 'Stone Composite',
    span: 'lg:col-span-3',
    image: '/quarry-slate.png',
    desc: 'Real stone look without the weight. 100% waterproof — great for kitchens and bathrooms.',
    specs: { core: 'Stone Composite', thickness: '7.0mm', bestFor: 'Kitchens, bathrooms' },
  },
  {
    id: 3,
    title: 'Marble Vinyl',
    cat: 'SPC Core',
    span: 'lg:col-span-3',
    image: '/carrara-mist.png',
    desc: 'Clean marble finish. Looks expensive but easy to clean and take care of.',
    specs: { core: 'SPC', thickness: '6.5mm', bestFor: 'Dining rooms, bathrooms' },
    textColor: 'dark',
  },
  {
    id: 4,
    title: 'Dark Walnut Vinyl',
    cat: 'SPC Rigid Core',
    span: 'lg:col-span-4',
    image: '/walnut-drift.png',
    desc: 'Deep rich wood look. Scratch-resistant and great for homes with kids or pets.',
    specs: { core: 'Rigid SPC', thickness: '6.5mm', bestFor: 'Bedrooms, living rooms' },
  },
  {
    id: 5,
    title: 'Dark Stone Vinyl',
    cat: 'Stone Composite',
    span: 'lg:col-span-4',
    image: '/basalt-field.png',
    desc: 'Bold dark stone finish. Hides everyday dirt and wipes clean in seconds.',
    specs: { core: 'Stone Composite', thickness: '7.0mm', bestFor: 'Offices, basements' },
  },
  {
    id: 6,
    title: 'Warm Beige Vinyl',
    cat: 'SPC Core',
    span: 'lg:col-span-4',
    image: '/travertine-linen.png',
    desc: 'Light warm tone that makes any room feel bigger. A popular choice for living areas.',
    specs: { core: 'SPC', thickness: '6.5mm', bestFor: 'Living rooms, bedrooms' },
  },
];

const Modal = memo(function Modal({ item, onClose }: { item: typeof ITEMS[0] | null; onClose: () => void }) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {item && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{ background: 'rgba(26, 26, 26, 0.4)' }}
          />
          {/* Wrapper — click outside the card to close */}
          <m.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Card — stop propagation so inner clicks don't close */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(248, 246, 242, 0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(26, 26, 26, 0.08)',
              }}
            >
              {/* Close button — anchored to card top-right, z-10 above video */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-graphite text-bone grid place-items-center hover:bg-graphite/80 active:scale-95 transition shadow-lg"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <div className="relative aspect-video overflow-hidden bg-graphite">
                {item.image.endsWith('.mp4') ? (
                  <LazyVideo
                    src={item.image}
                    className="w-full h-full"
                  />
                ) : (
                  <LazyImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-8 lg:p-12">
                <div className="mb-6">
                  <h2 className="font-display text-4xl lg:text-5xl tracking-[-0.03em] text-graphite mb-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-graphite/60 tracking-[0.2em] uppercase">
                    {item.cat}
                  </p>
                </div>

                <p className="text-graphite/70 leading-relaxed mb-8">{item.desc}</p>

                <div className="grid grid-cols-3 gap-6 border-t border-graphite/10 pt-8 mb-8">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-graphite/50 mb-2">
                      Core Type
                    </p>
                    <p className="font-display text-lg text-graphite">{item.specs.core}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-graphite/50 mb-2">
                      Thickness
                    </p>
                    <p className="font-display text-lg text-graphite">{item.specs.thickness}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-graphite/50 mb-2">
                      Best For
                    </p>
                    <p className="font-display text-lg text-graphite">{item.specs.bestFor}</p>
                  </div>
                </div>

                <m.a
                  href="#contact"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full bg-graphite text-bone py-4 rounded-full font-medium tracking-wide hover:bg-graphite/90 transition-colors text-center"
                >
                  Reserve a Consultation
                </m.a>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
});

const BentoCollectionComponent = () => {
  const [selectedItem, setSelectedItem] = useState<typeof ITEMS[0] | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const items = useMemo(() => ITEMS, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <section id="collection" className="relative bg-bone py-8 sm:py-12 lg:py-48" onMouseMove={handleMouseMove}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-16 xl:px-20">
        <div className="flex items-end justify-between mb-16 lg:mb-24">
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-graphite/50 mb-6">
              — 01 / Our Works
            </div>
            <h2 className="font-display font-bold text-5xl lg:text-7xl tracking-[-0.03em] text-graphite leading-[0.95]">
              Our Works.
            </h2>
          </div>
          <p className="hidden lg:block max-w-xs text-sm text-graphite/60 leading-relaxed">
            Different types of vinyl flooring we install. Click any to learn more.
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-12 auto-rows-[280px] gap-3 lg:gap-4"
          style={{
            borderTop: '1px solid rgba(26, 26, 26, 0.05)',
            borderLeft: '1px solid rgba(26, 26, 26, 0.05)',
          }}
        >
          {items.map((item, i) => (
            <m.article
              key={item.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedItem(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${item.span}`}
              style={{
                borderRight: '1px solid rgba(26, 26, 26, 0.05)',
                borderBottom: '1px solid rgba(26, 26, 26, 0.05)',
              }}
            >
              {/* Background Image/Video */}
              <m.div
                className="absolute inset-0"
                animate={{ scale: hoveredId === item.id ? 1.08 : 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {item.image.endsWith('.mp4') ? (
                  <LazyVideo
                    src={item.image}
                    className="w-full h-full"
                  />
                ) : (
                  <LazyImage
                    src={item.image}
                    alt={item.title}
                    priority={i < 2}
                    className="w-full h-full object-cover"
                  />
                )}
              </m.div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/40 via-transparent to-transparent" />

              {/* Texture Overlay */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence baseFrequency=%220.9%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22 opacity=%220.4%22/%3E%3C/svg%3E")',
                }}
              />

              {/* Content */}
              <div className="relative h-full p-6 lg:p-8 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] tracking-[0.3em] uppercase opacity-60 ${item.textColor === 'dark' ? 'text-graphite' : 'text-bone'}`}>
                    {item.cat}
                  </span>
                  <m.span
                    className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${item.textColor === 'dark' ? 'text-graphite' : 'text-bone'}`}
                    animate={{ rotate: hoveredId === item.id ? 45 : 0 }}
                  >
                    ↗
                  </m.span>
                </div>
                <div>
                  <h3 className={`font-display font-bold text-2xl lg:text-3xl tracking-[-0.02em] leading-tight ${item.textColor === 'dark' ? 'text-graphite' : 'text-bone'}`}>
                    {item.title}
                  </h3>
                  {item.desc && (
                    <p className={`text-xs mt-2 ${item.textColor === 'dark' ? 'text-graphite/70' : 'text-bone/80'}`}>{item.desc}</p>
                  )}
                </div>
              </div>
            </m.article>
          ))}
        </div>
      </div>

      {/* Custom Cursor */}
      <AnimatePresence>
        {hoveredId && (
          <m.div
            className="fixed pointer-events-none w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold tracking-wide z-50"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              transform: 'translate(-50%, -50%)',
              background: 'rgba(26, 26, 26, 0.9)',
              color: 'white',
            }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            VIEW
          </m.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
};

export default memo(BentoCollectionComponent);
