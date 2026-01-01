import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardBox from '../shared/CardBox';
import { Rating, RatingStar, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { testimonialsApi, Testimonial } from '../../services/api/testimonials';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsApi.getAll();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (loading) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-gray-500">Chargement des témoignages...</div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  // Number of testimonials to show at once
  const itemsToShow = 3;
  const startIndex = currentIndex;
  const visibleTestimonials = [];

  for (let i = 0; i < itemsToShow; i++) {
    const index = (startIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">Ce Que Disent Nos Clients</h2>
          <p className="text-dark/70 max-w-2xl mx-auto">
            Découvrez les témoignages de nos clients qui nous font confiance pour leur transformation digitale
          </p>
        </div>

        <div className="relative pb-8">
          {/* Navigation buttons */}
          {testimonials.length > itemsToShow && (
            <>
              <Button
                color="light"
                size="sm"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 rounded-full p-2"
                onClick={goToPrevious}
                aria-label="Témoignage précédent"
              >
                <Icon icon="solar:alt-arrow-left-line-duotone" className="text-xl" />
              </Button>
              <Button
                color="light"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 rounded-full p-2"
                onClick={goToNext}
                aria-label="Témoignage suivant"
              >
                <Icon icon="solar:alt-arrow-right-line-duotone" className="text-xl" />
              </Button>
            </>
          )}

          {/* Slider container */}
          <div
            ref={sliderRef}
            className="overflow-x-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="flex gap-6 pb-4">
              <AnimatePresence mode="wait">
                {visibleTestimonials.map((testimonial, idx) => (
                  <motion.div
                    key={`${testimonial.id}-${currentIndex}-${idx}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
                  >
                    <CardBox className="h-auto hover:shadow-lg transition-shadow p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          {testimonial.image ? (
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <Icon icon="solar:user-circle-line-duotone" className="text-xl text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-semibold text-dark text-sm truncate">{testimonial.name}</h4>
                            <p className="text-xs text-dark/60 truncate">{testimonial.role}</p>
                            <p className="text-xs text-dark/50 truncate">{testimonial.company}</p>
                          </div>
                        </div>
                        <div className="mb-2">
                          <Rating size="sm">
                            {[...Array(5)].map((_, i) => (
                              <RatingStar key={i} filled={i < testimonial.rating} />
                            ))}
                          </Rating>
                        </div>
                        <p className="text-dark/70 text-xs italic mb-2 line-clamp-3">
                          "{testimonial.content}"
                        </p>
                        <div className="pt-2 border-t border-gray-200">
                          <Icon icon="solar:quote-up-line-duotone" className="text-primary text-lg" />
                        </div>
                      </div>
                    </CardBox>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Dots indicator */}
          {testimonials.length > itemsToShow && (
            <div className="flex justify-center items-center gap-3 mt-12 pt-8 border-t border-gray-200">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-10 h-2.5 bg-primary shadow-md'
                      : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400 hover:scale-125'
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

