import { useEffect, useRef, useState } from 'react';

export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { rootMargin: '200px', threshold: 0.1 }
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView]);

  return { ref, inView };
}
