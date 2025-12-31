import { Link } from 'react-router';
import { useEffect, useState, useRef } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Badge, Card } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Testimonials from '../../components/entreprise/Testimonials';
import AnimatedAccordion from '../../components/shared/AnimatedAccordion';
import AnimatedButton from '../../components/shared/AnimatedButton';
import TextType from '../../components/shared/TextType';
import GlareHover from '../../components/shared/GlareHover';
import LogoLoop from '../../components/shared/LogoLoop';
import { partnersApi, Partner } from '../../services/api/partners';

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

// Composant VideoPlayer avec lecture automatique après délai
const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasStarted) return;

    let timer: NodeJS.Timeout;
    let fallbackTimer: NodeJS.Timeout;

    // Attendre que la vidéo soit prête
    const handleCanPlay = () => {
      // Démarrer la vidéo après 2 secondes
      timer = setTimeout(() => {
        if (video && !hasStarted) {
          video.muted = true; // S'assurer qu'elle est en sourdine
          video.play().then(() => {
            console.log('Vidéo démarrée avec succès');
            setHasStarted(true);
          }).catch((error) => {
            console.error('Erreur lors de la lecture automatique:', error);
          });
        }
      }, 2000);
    };

    video.addEventListener('canplay', handleCanPlay);
    
    // Fallback : démarrer après 3 secondes même si canplay ne se déclenche pas
    fallbackTimer = setTimeout(() => {
      if (video && !hasStarted) {
        video.muted = true;
        video.play().then(() => {
          console.log('Vidéo démarrée avec succès (fallback)');
          setHasStarted(true);
        }).catch((error) => {
          console.error('Erreur lors de la lecture automatique:', error);
        });
      }
    }, 3000);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      if (timer) clearTimeout(timer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [hasStarted]);

  const handleToggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (newMutedState === false) {
        setShowSoundHint(false);
      }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls
        muted={isMuted}
        playsInline
        preload="metadata"
        onClick={() => {
          if (isMuted && showSoundHint) {
            handleToggleMute();
          }
        }}
        onError={(e) => {
          console.error('Erreur vidéo:', e);
          const video = e.currentTarget;
          console.error('Code d\'erreur:', video.error?.code);
          console.error('Message:', video.error?.message);
        }}
        onLoadedMetadata={() => {
          console.log('Métadonnées vidéo chargées');
        }}
      >
        <source src="/videos/presentation.mp4" type="video/mp4" />
        <source src="/videos/presentation.webm" type="video/webm" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>

      {/* Bouton mute/unmute */}
      <button
        onClick={handleToggleMute}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all duration-300"
        aria-label={isMuted ? 'Activer le son' : 'Désactiver le son'}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>
            <line x1="22" x2="16" y1="9" y2="15"></line>
            <line x1="16" x2="22" y1="9" y2="15"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>
            <path d="M19 10a7 7 0 0 1 0 4"></path>
            <path d="M15 8a3 3 0 0 1 0 8"></path>
          </svg>
        )}
      </button>

      {/* Message "Son activé au premier clic" */}
      {showSoundHint && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-pulse">
          Son activé au premier clic
        </div>
      )}
    </div>
  );
};

const Accueil = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnersApi.getAll();
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };
    fetchPartners();
  }, []);

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

      {/* Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <VideoPlayer />
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

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Nos Partenaires</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">
              Nous collaborons avec des entreprises de confiance pour vous offrir les meilleures solutions.
            </p>
          </div>
          {partners.length > 0 ? (
            <div style={{ height: '120px', position: 'relative', overflow: 'hidden' }}>
              <LogoLoop
                logos={partners.map((partner) => ({
                  src: partner.logo,
                  alt: partner.name,
                  title: partner.name,
                  href: partner.website || undefined,
                }))}
                speed={80}
                direction="left"
                logoHeight={60}
                gap={60}
                hoverSpeed={20}
                scaleOnHover
                fadeOut
                fadeOutColor="#ffffff"
                ariaLabel="Nos partenaires"
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun partenaire pour le moment.</p>
            </div>
          )}
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

