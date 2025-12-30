import CardBox from '../shared/CardBox';
import { Rating, RatingStar } from 'flowbite-react';
import { Icon } from '@iconify/react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Amadou Traoré',
    role: 'Directeur Général',
    company: 'Tech Solutions BF',
    image: '/images/profile/user-1.jpg',
    content: '2NB Digital a transformé notre entreprise avec une solution digitale complète. Leur expertise en développement et leur accompagnement ont été exceptionnels.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Fatou Diallo',
    role: 'Responsable Marketing',
    company: 'Innovation Group',
    image: '/images/profile/user-2.jpg',
    content: 'Grâce à 2NB Digital, nous avons pu digitaliser nos processus et améliorer notre visibilité en ligne. Une équipe professionnelle et à l\'écoute.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ibrahim Ouédraogo',
    role: 'CEO',
    company: 'Digital Africa',
    image: '/images/profile/user-3.jpg',
    content: 'Leur expertise en Data Science et Intelligence Artificielle nous a permis d\'optimiser nos décisions stratégiques. Un partenaire de confiance.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Aissata Konaté',
    role: 'Directrice IT',
    company: 'Finance Corp',
    image: '/images/profile/user-4.jpg',
    content: 'L\'implémentation de notre ERP par 2NB Digital a été un succès. Leur approche méthodique et leur support continu font toute la différence.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">Ce Que Disent Nos Clients</h2>
          <p className="text-dark/70 max-w-2xl mx-auto">
            Découvrez les témoignages de nos clients qui nous font confiance pour leur transformation digitale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <CardBox key={testimonial.id} className="h-full hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-dark">{testimonial.name}</h4>
                    <p className="text-sm text-dark/60">{testimonial.role}</p>
                    <p className="text-xs text-dark/50">{testimonial.company}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <Rating size="sm">
                    {[...Array(5)].map((_, i) => (
                      <RatingStar key={i} filled={i < testimonial.rating} />
                    ))}
                  </Rating>
                </div>
                <p className="text-dark/70 text-sm flex-1 italic">
                  "{testimonial.content}"
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Icon icon="solar:quote-up-line-duotone" className="text-primary text-2xl" />
                </div>
              </div>
            </CardBox>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

