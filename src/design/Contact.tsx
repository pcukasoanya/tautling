import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const FloatingInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
  isActive,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  isActive: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <motion.label
        htmlFor={name}
        className="absolute left-0 text-xs tracking-[0.2em] uppercase text-bone/60 pointer-events-none font-satoshi"
        animate={{
          y: focused || value ? -24 : 0,
          fontSize: focused || value ? '10px' : '12px',
          opacity: focused || value ? 1 : 0.6,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {label}
      </motion.label>

      <input
        ref={inputRef}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent text-bone text-base font-satoshi placeholder-bone/20 focus:outline-none py-3"
      />

      <motion.div
        className="absolute bottom-0 left-0 h-px bg-bone"
        animate={{
          scaleX: focused ? 1 : 0,
          width: focused ? '100%' : '0%',
          transformOrigin: focused ? 'center' : 'center',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-bone/20" />

      {isActive && (
        <motion.div
          className="absolute right-0 bottom-3 w-1.5 h-1.5 rounded-full bg-bone"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </div>
  );
};

const FloatingTextarea = ({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  isActive,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  isActive: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="relative">
      <motion.label
        htmlFor={name}
        className="absolute left-0 top-0 text-xs tracking-[0.2em] uppercase text-bone/60 pointer-events-none font-satoshi"
        animate={{
          y: focused || value ? -24 : 0,
          fontSize: focused || value ? '10px' : '12px',
          opacity: focused || value ? 1 : 0.6,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {label}
      </motion.label>

      <textarea
        ref={textareaRef}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-transparent text-bone text-base font-satoshi placeholder-bone/20 focus:outline-none py-3 resize-none"
      />

      <motion.div
        className="absolute bottom-0 left-0 h-px bg-bone"
        animate={{
          scaleX: focused ? 1 : 0,
          width: focused ? '100%' : '0%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-bone/20" />

      {isActive && (
        <motion.div
          className="absolute right-0 bottom-3 w-1.5 h-1.5 rounded-full bg-bone"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </div>
  );
};

const MagneticButton = ({ isSubmitting }: { isSubmitting: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
    const radius = 100;

    if (distance < radius) {
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const force = (radius - distance) / radius;
      x.set(-Math.cos(angle) * force * 30);
      y.set(-Math.sin(angle) * force * 30);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      type="submit"
      disabled={isSubmitting}
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
        borderRadius: isHovered ? '100px' : '6px',
      }}
      transition={{ duration: 0.3 }}
      className="relative w-full bg-bone text-graphite text-sm tracking-wide font-medium py-4 hover:bg-bone/90 transition-colors overflow-hidden"
    >
      <motion.span
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        Request Sample
      </motion.span>

      {isHovered && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-bone via-bone/80 to-bone"
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%'],
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <span className="relative">Request Sample</span>
        </motion.div>
      )}
    </motion.button>
  );
};

const VinylConfetti = () => {
  const shards = Array.from({ length: 12 });

  return (
    <div className="fixed inset-0 pointer-events-none">
      {shards.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-6 bg-bone/80"
          initial={{
            x: '50%',
            y: '50%',
            opacity: 1,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 400}%`,
            y: `${50 + Math.random() * 500}%`,
            opacity: 0,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 2.5,
            ease: 'easeOut',
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
};

const ProgressBar = ({
  nameComplete,
  emailComplete,
  messageComplete,
}: {
  nameComplete: boolean;
  emailComplete: boolean;
  messageComplete: boolean;
}) => {
  const progress = [nameComplete, emailComplete, messageComplete].filter(Boolean).length / 3;

  return (
    <motion.div
      className="absolute top-0 left-0 h-px bg-bone"
      animate={{ scaleX: progress }}
      transition={{ duration: 0.3 }}
      style={{ transformOrigin: 'left' }}
    />
  );
};

const LiveWidget = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const battleCreekTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Detroit' }));
      setTime(battleCreekTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-3">Live Data</p>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-bone/60 mb-1">Battle Creek, MI</p>
            <p className="font-display text-2xl text-bone font-mono">{time}</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-bone/70">Service Available</span>
          </div>
        </div>
      </div>

    </div>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sanitize = (value: string): string => {
    return value.replace(/[<>"']/g, '').slice(0, 500);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: sanitize(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formState.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const csrfRes = await fetch('/api/csrf-token');
      const { token } = await csrfRes.json();

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
        setIsSubmitting(false);
      }, 4000);
    } catch (error) {
      console.error('Contact form error:', error);
      setIsSubmitting(false);
      alert('Failed to send message. Please try again.');
    }
  };

  const nameComplete = formState.name.length > 0;
  const emailComplete = formState.email.length > 0 && formState.email.includes('@');
  const messageComplete = formState.message.length > 0;

  return (
    <section id="contact" className="relative bg-graphite text-bone py-32 lg:py-48 overflow-hidden">
      <ProgressBar nameComplete={nameComplete} emailComplete={emailComplete} messageComplete={messageComplete} />

      <AnimatePresence>
        {submitted && <VinylConfetti />}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column - Context */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-[11px] tracking-[0.3em] uppercase text-bone/40 mb-6">— 06 / Contact</div>
              <h2 className="font-display text-5xl lg:text-6xl tracking-[-0.03em] text-bone leading-[0.95] mb-8">
                Get in{' '}
                <span className="italic font-light text-bone/60">
                  touch.
                </span>
              </h2>
              <p className="text-sm text-bone/70 leading-relaxed mb-8">
                Send us a message and we will get back to you. Or call us directly — we are happy to answer any questions about vinyl flooring for your home or business.
              </p>

              <div className="space-y-4 mb-12 text-sm text-bone/60">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-bone/40 mb-1">Address</p>
                  <p>121 Minges Circle, Battle Creek, MI 49014</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-bone/40 mb-1">Phone</p>
                  <a href="tel:+12694460547" className="hover:text-bone transition-colors">(269) 446-0547</a>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-bone/40 mb-1">Email</p>
                  <a href="mailto:tuantling899@gmail.com" className="hover:text-bone transition-colors">tuantling899@gmail.com</a>
                </div>
              </div>

              <motion.div
                className="mb-12 rounded-lg overflow-hidden aspect-video bg-graphite/20 border border-bone/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <video
                  src="/contact-walnut-macro.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <LiveWidget />
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-6 lg:col-start-7"
          >
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center h-full min-h-[500px]"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <svg viewBox="0 0 80 80" className="w-16 h-16">
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-bone/40"
                      animate={{ strokeDashoffset: [0, -100] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      strokeDasharray="100"
                    />
                    <motion.path
                      d="M 25 40 L 35 50 L 55 30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-bone"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </svg>
                </motion.div>

                <p className="font-display text-5xl italic font-light text-bone mb-3 text-center">
                  Thank You
                </p>
                <p className="text-bone/80 text-center max-w-sm">
                  Your request has been received. Our Michigan specialists will reach out within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <FloatingInput
                  label="Name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  isActive={formState.name.length > 0}
                />

                <FloatingInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  isActive={formState.email.length > 0}
                />

                <FloatingTextarea
                  label="Message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your space..."
                  isActive={formState.message.length > 0}
                />

                <div className="pt-4">
                  <MagneticButton isSubmitting={isSubmitting} />
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* Footer Serial Number */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 pt-8 border-t border-bone/10"
        >
          <p className="text-[9px] font-mono tracking-[0.2em] text-bone/30 uppercase">
            TUAN TLING LLC | 121 MINGES CIRCLE | BATTLE CREEK, MI 49014
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
