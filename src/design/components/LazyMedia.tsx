import { memo } from 'react';
import { useInView } from '../hooks/useInView';

interface LazyImageProps {
  src: string;
  srcSet?: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export const LazyImage = memo(function LazyImage({
  src, srcSet, alt, width, height, priority, className
}: LazyImageProps) {
  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchpriority={priority ? 'high' : 'auto'}
      className={className}
    />
  );
});

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const LazyVideo = memo(function LazyVideo({
  src, poster, className, autoPlay = true, loop = true, muted = true
}: LazyVideoProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '300px' });
  return (
    <div ref={ref} className={className}>
      {inView ? (
        <video
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      ) : (
        poster && <img src={poster} alt="" loading="lazy" className="w-full h-full object-cover" />
      )}
    </div>
  );
});
