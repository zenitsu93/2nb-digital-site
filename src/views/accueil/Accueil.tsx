import { Link } from 'react-router';
import CardBox from '../../components/shared/CardBox';
import { Badge, Card } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Testimonials from '../../components/entreprise/Testimonials';
import AnimatedAccordion from '../../components/shared/AnimatedAccordion';
import AnimatedButton from '../../components/shared/AnimatedButton';
import TextType from '../../components/shared/TextType';
import GlareHover from '../../components/shared/GlareHover';

// Services principaux à afficher sur la page d'accueil
const servicesAccueil = [
  {
    id: 1,
    title: 'Ingénierie et Développement',
    description: 'Solutions logicielles, applications web et mobiles innovantes.',
    icon: 'solar:code-2-line-duotone',
  },
  {
    id: 2,
    title: 'Transformation Digitale',
    description: 'Accompagnement stratégique dans votre transition numérique.',
    icon: 'solar:chart-2-bold-duotone',
  },
  {
    id: 3,
    title: 'Data & Intelligence Artificielle',
    description: 'Big Data, Machine Learning et analyse prédictive.',
    icon: 'solar:graph-up-line-duotone',
  },
  {
    id: 4,
    title: 'Marketing Digital',
    description: 'Stratégies digitales et communication pour votre marque.',
    icon: 'solar:megaphone-line-duotone',
  },
];


const Accueil = () => {
  const faqItems = [
    {
      question: 'Quels services proposez-vous ?',
      answer: 'Nous proposons une gamme complète de services incluant l\'ingénierie et le développement de solutions digitales, le conseil en transformation digitale, la data science et l\'intelligence artificielle, le marketing digital, et la formation. Consultez notre page Services pour plus de détails.',
    },
    {
      question: 'Combien de temps prend un projet de développement ?',
      answer: 'La durée d\'un projet dépend de sa complexité et de ses spécificités. Un projet simple peut prendre 2-4 semaines, tandis qu\'un projet complexe peut nécessiter plusieurs mois. Nous établissons un planning détaillé lors de la phase de consultation initiale.',
    },
    {
      question: 'Quels sont vos tarifs ?',
      answer: 'Nos tarifs varient selon le type de projet et les services requis. Nous proposons des devis personnalisés adaptés à vos besoins spécifiques. Contactez-nous pour obtenir un devis gratuit et sans engagement.',
    },
    {
      question: 'Travaillez-vous avec des entreprises de toutes tailles ?',
      answer: 'Oui, nous accompagnons des entreprises de toutes tailles, des startups aux grandes entreprises. Nous adaptons nos solutions et notre approche selon vos besoins et votre budget.',
    },
    {
      question: 'Proposez-vous un support après la livraison ?',
      answer: 'Absolument ! Nous offrons des services de maintenance et de support continu pour tous nos projets. Nous proposons différents niveaux de support selon vos besoins, incluant la maintenance corrective, évolutive et le support technique.',
    },
    {
      question: 'Quelles technologies utilisez-vous ?',
      answer: 'Nous utilisons les technologies les plus récentes et adaptées à chaque projet : React, Next.js, Node.js, Python, React Native, Flutter pour le développement, ainsi que des solutions cloud modernes. Nous choisissons toujours la meilleure stack technologique pour votre projet.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <TextType
              text="Votre Partenaire de Confiance pour la Transformation Digitale"
              as="h1"
              className="text-4xl md:text-5xl font-bold text-dark mb-6"
              typingSpeed={50}
              initialDelay={500}
              pauseDuration={3000}
              deletingSpeed={30}
              loop={false}
              showCursor={true}
              hideCursorWhileTyping={false}
              cursorCharacter="|"
              cursorBlinkDuration={0.5}
              startOnVisible={true}
            />
            <p className="text-lg text-dark/70 mb-8">
              2NB Digital accompagne les entreprises au Burkina Faso et en Afrique dans leur transition vers le numérique.
              De l'ingénierie logicielle à l'intelligence artificielle, nous offrons des solutions complètes et innovantes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/services">
                <AnimatedButton variant="primary" size="lg">
                  Découvrir nos services
                </AnimatedButton>
              </Link>
              <Link to="/realisations">
                <AnimatedButton variant="light" size="lg" className="text-dark">
                  Voir nos réalisations
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* À propos Section - Video */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  playsInline
                >
                  <source src="/videos/qui-sommes-nous.mp4" type="video/mp4" />
                  <source src="/videos/qui-sommes-nous.webm" type="video/webm" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Nos Services</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">
              Une gamme complète de services pour répondre à tous vos besoins en transformation digitale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {servicesAccueil.map((service) => (
              <GlareHover
                key={service.id}
                width="100%"
                height="100%"
                background="transparent"
                borderRadius="0.75rem"
                borderColor="transparent"
                glareColor="#d4af37"
                glareOpacity={0.8}
                glareAngle={-45}
                glareSize={400}
                transitionDuration={1000}
                playOnce={false}
                className="h-full"
              >
                <Card className="h-full flex flex-col w-full border border-gray-200 shadow-md relative overflow-hidden">
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {service.title}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400 pb-[0.625rem] flex-1">
                    {service.description}
                  </p>
                  <Link to="/services">
                    <AnimatedButton variant="primary" className="w-fit">
                      En savoir plus
                      <svg
                        className="-mr-1 ml-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </AnimatedButton>
                  </Link>
                </Card>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <section id="faq" className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Questions Fréquentes</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur nos services, nos projets et notre accompagnement.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <CardBox>
              <AnimatedAccordion
                items={faqItems.map(item => ({
                  title: item.question,
                  content: item.answer
                }))}
                type="single"
                collapsible={true}
              />
            </CardBox>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="flex border border-gray-200 dark:border-gray-700 p-6 relative w-full break-words flex-col bg-primary/5 dark:bg-primary/5 mt-10 rounded-md text-center py-8 dark:shadow-md shadow-md !border-none" style={{ borderRadius: '18px' }}>
              <div className="flex h-full flex-col justify-center gap-2 p-0">
                <div className="flex justify-center">
                  <div className="-ms-2 h-11 w-11">
                    <img className="border-2 border-white dark:border-gray-700 rounded-full object-cover" alt="icon" src="/images/profile/user-2.jpg" />
                  </div>
                  <div className="-ms-2 h-11 w-11">
                    <img className="border-2 border-white dark:border-gray-700 rounded-full object-cover" alt="icon" src="/images/profile/user-3.jpg" />
                  </div>
                  <div className="-ms-2 h-11 w-11">
                    <img className="border-2 border-white dark:border-gray-700 rounded-full object-cover" alt="icon" src="/images/profile/user-4.jpg" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold mt-4 text-secondary/80 dark:text-secondary/80">Prêt à Transformer Votre Entreprise ?</h4>
                <p className="text-secondary/70 dark:text-secondary/70 text-base">
                  Contactez-nous dès aujourd'hui pour discuter de vos projets
                </p>
                <Link to="/contact" className="mx-auto mt-4">
                  <AnimatedButton variant="primary" className="w-fit rounded-full px-5 h-[42px]">
                    Nous contacter
                  </AnimatedButton>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Accueil;

