import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Our Works', href: '#collection' },
  { label: 'Our Standards', href: '#specifications' },
  { label: 'How We Work', href: '#performance-lab' },
  { label: 'Why Vinyl', href: '#climate' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

/* Logo */
function Logo() {
  return (
    <a href="#top" className="flex items-center">
      <img
        src="/logo/white_trans.png"
        alt="Tuan Tling"
        className="h-8 w-auto"
      />
    </a>
  );
}

/* Mobile Overlay */
function MobileOverlay({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[90] animate-[fadeIn_0.25s_ease]"
      style={{ background: 'linear-gradient(180deg, #f8f6f2 0%, #ede9e1 100%)' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(700px 500px at 80% 0%, rgba(168,120,86,0.08), transparent 60%), radial-gradient(700px 500px at 20% 100%, rgba(26,26,26,0.05), transparent 60%)',
        }}
      />

      <div className="relative h-full flex flex-col px-6 pt-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Logo />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-11 h-11 rounded-full grid place-items-center text-graphite border border-graphite/10 bg-graphite/[0.04] hover:bg-graphite/[0.08] transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center">
          <ul className="flex flex-col gap-0">
            {NAV_LINKS.map((l, i) => (
              <li
                key={l.label}
                className={[
                  'border-b border-graphite/[0.08] transition-all',
                  mounted ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
                ].join(' ')}
                style={{ transitionDelay: mounted ? `${100 + i * 60}ms` : '0ms', transitionDuration: '400ms' }}
              >
                <a
                  href={l.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-5 text-left text-graphite group"
                >
                  <span className="font-display font-bold tracking-tight" style={{ fontSize: 'clamp(28px, 8vw, 44px)', lineHeight: 1 }}>
                    {l.label}
                  </span>
                  <span className="w-8 h-8 rounded-full grid place-items-center text-graphite/40 group-hover:text-walnut transition" style={{ border: '1px solid rgba(26,26,26,0.08)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="flex justify-between text-[11px] uppercase tracking-[0.16em] text-graphite/40 font-semibold">
          <span>Michigan, USA</span>
          <span>Master Installation Studio</span>
        </div>
      </div>
    </div>
  );
}

/* Main Navigation */
export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 max-w-full">

          {/* Logo pill — desktop only */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex items-center h-12 px-5 rounded-full border transition-all duration-300"
            style={{
              borderColor: isScrolled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
              background: isScrolled ? 'rgba(26,26,26,0.95)' : 'rgba(26,26,26,0.85)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Logo />
          </motion.div>

          {/* Main nav pill — desktop only */}
          <motion.nav
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex items-center h-12 px-2 rounded-full border transition-all duration-300"
            style={{
              borderColor: isScrolled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
              background: isScrolled ? 'rgba(26,26,26,0.95)' : 'rgba(26,26,26,0.85)',
              backdropFilter: 'blur(12px)',
            }}
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((l, i) => (
              <div key={l.label} className="flex items-center">
                {i > 0 && <span className="w-px h-5 bg-white/10" aria-hidden="true" />}
                <a
                  href={l.href}
                  className="inline-flex items-center px-4 h-9 rounded-full text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/5 transition"
                >
                  {l.label}
                </a>
              </div>
            ))}
          </motion.nav>

          {/* Mobile pill bar — hidden while overlay is open */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`md:hidden flex items-center justify-between gap-3 h-12 pl-5 pr-1.5 rounded-full border transition-all duration-300 w-[calc(100vw-2rem)] max-w-sm ${mobileOpen ? 'hidden' : ''}`}
            style={{
              borderColor: isScrolled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
              background: isScrolled ? 'rgba(26,26,26,0.95)' : 'rgba(26,26,26,0.85)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Logo />
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="w-9 h-9 rounded-full grid place-items-center shrink-0 text-white hover:opacity-90 transition"
              style={{ background: '#1a1a1a' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </button>
          </motion.div>

        </div>
      </header>

      {mobileOpen && (
        <MobileOverlay onClose={() => setMobileOpen(false)} />
      )}
    </>
  );
};
