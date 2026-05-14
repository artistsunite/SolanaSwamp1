import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroGalleryProps {
  images: string[];
}

export const HeroGallery: React.FC<HeroGalleryProps> = ({ images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative group">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-secondary/20 rounded-2xl blur-2xl group-hover:bg-secondary/30 transition-all z-0" />
      
      <div className="relative bg-surface-container border-2 border-outline-variant/30 p-4 rounded-2xl z-10">
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {images.map((src, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative aspect-[4/5] bg-surface-container-highest">
                <img
                  src={src}
                  alt={`Purple Croc Mascot ${index + 1}`}
                  className="w-full h-full object-contain p-4 select-none"
                />
                
                {/* Animated "Verified" Badge */}
                <div className="absolute top-4 right-4 bg-secondary text-on-secondary px-3 py-1 flex items-center gap-1 font-display font-black text-xs uppercase tracking-widest shadow-xl">
                  <ShieldCheck size={14} />
                  Verified
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface-container-highest/80 border border-outline-variant/30 text-on-background flex items-center justify-center rounded-full hover:bg-primary hover:text-on-primary transition-all z-20 shadow-xl opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface-container-highest/80 border border-outline-variant/30 text-on-background flex items-center justify-center rounded-full hover:bg-primary hover:text-on-primary transition-all z-20 shadow-xl opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
