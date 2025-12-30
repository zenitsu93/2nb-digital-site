import CardBox from '../../components/shared/CardBox';
import { Badge, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router';

// Données des services - à remplacer plus tard par une API/base de données
const services = [
  {
    id: 1,
    title: 'Ingénierie et Développement de Solutions Digitales',
    description: 'Conception, développement, intégration et déploiement de solutions logicielles, d\'applications web et mobiles, ainsi que de plateformes digitales innovantes. Réalisation de prestations d\'ingénierie informatiques incluant l\'architecture de systèmes, le développement sur mesure et la maintenance applicative.',
    icon: 'solar:code-2-line-duotone',
    features: ['Applications Web', 'Applications Mobiles', 'Architecture Systèmes', 'Développement sur Mesure', 'Maintenance Applicative']
  },
  {
    id: 2,
    title: 'Conseil en Transformation Digitale et Management',
    description: 'Accompagnement stratégique et opérationnel des entreprises dans leur transformation digitale, l\'optimisation de leurs processus et la conduite du changement. Conseil en systèmes d\'information, sélection et implémentation d\'ERP, CRM, outils de gestion intégrés et solutions collaboratives.',
    icon: 'solar:chart-2-bold-duotone',
    features: ['Transformation Digitale', 'ERP & CRM', 'Optimisation Processus', 'Audits Digitaux', 'Feuilles de Route Stratégiques']
  },
  {
    id: 3,
    title: 'Data Science et Intelligence Artificielle',
    description: 'Collecte, traitement, analyse et valorisation des données (Big Data, Business Intelligence). Développement et déploiement de solutions basées sur l\'intelligence artificielle, le Machine Learning et l\'analyse prédictive. Conseil en stratégie data et mise en place de dispositifs de gouvernance des données.',
    icon: 'solar:graph-up-line-duotone',
    features: ['Big Data', 'Business Intelligence', 'Machine Learning', 'Analyse Prédictive', 'Gouvernance des Données']
  },
  {
    id: 4,
    title: 'Stratégie Marketing Digital et Communication',
    description: 'Définition et mise en œuvre de stratégies de marketing digital incluant le SEO/SEA, le content marketing, les réseaux sociaux et l\'automatisation marketing. Conseil en stratégie de marque, e-réputation et communication digitale.',
    icon: 'solar:megaphone-line-duotone',
    features: ['SEO/SEA', 'Content Marketing', 'Réseaux Sociaux', 'Automatisation Marketing', 'E-réputation']
  },
  {
    id: 5,
    title: 'Formation et Renforcement des Compétences',
    description: 'Conception et animation de programmes de formation sur les outils digitaux, les méthodologies agiles et les compétences numériques. Accompagnement à l\'adoption des nouvelles technologies et au développement des talents.',
    icon: 'solar:book-bookmark-line-duotone',
    features: ['Formation Digitale', 'Méthodologies Agiles', 'Compétences Numériques', 'Adoption Technologies', 'Développement Talents']
  }
];

const Services = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-dark mb-4">Nos Services</h1>
        <p className="text-lg text-dark/70 max-w-3xl mx-auto">
          Nous accompagnons les entreprises dans leur transformation digitale avec une gamme complète de services allant du développement de solutions digitales à la formation, en passant par le conseil stratégique et l'intelligence artificielle.
        </p>
      </div>

      {/* Services Grid - Widget Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service) => (
          <CardBox key={service.id} className="p-0 overflow-hidden group card-hover h-full flex flex-col hover:shadow-xl transition-all duration-300">
            {/* Icon Header */}
            <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon icon={service.icon} className="text-4xl text-primary" height={40} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark text-center group-hover:text-primary transition-colors">
                {service.title}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-dark/70 text-sm mb-6 flex-1 line-clamp-4">
                {service.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-dark mb-3 flex items-center gap-2">
                  <Icon icon="solar:check-circle-line-duotone" className="text-primary" />
                  Caractéristiques
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} color="light" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {service.features.length > 3 && (
                    <Badge color="light" className="text-xs">
                      +{service.features.length - 3} autres
                    </Badge>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <Link to="/contact" className="mt-auto">
                <Button color="primary" className="w-full group-hover:scale-105 transition-transform">
                  Demander un devis
                  <Icon icon="solar:arrow-right-line-duotone" className="ml-2" height={18} />
                </Button>
              </Link>
            </div>
          </CardBox>
        ))}
      </div>

      {/* CTA Section */}
      <CardBox className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Icon icon="solar:question-circle-line-duotone" className="text-4xl text-primary" height={40} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-dark mb-3">Besoin d'aide pour choisir ?</h2>
          <p className="text-dark/70 mb-6 max-w-2xl mx-auto">
            Notre équipe d'experts est là pour vous conseiller et vous accompagner dans le choix des services adaptés à vos besoins.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button color="primary" size="lg">
                <Icon icon="solar:phone-calling-line-duotone" className="mr-2" height={20} />
                Contactez-nous
              </Button>
            </Link>
            <Link to="/realisations">
              <Button color="light" size="lg" className="text-dark">
                <Icon icon="solar:folder-with-files-linear" className="mr-2" height={20} />
                Voir nos réalisations
              </Button>
            </Link>
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default Services;

