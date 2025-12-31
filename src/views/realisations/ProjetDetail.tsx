import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import CardBox from '../../components/shared/CardBox';
import { Badge, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { projectsApi, Project } from '../../services/api/projects';

// Données des projets - chargées depuis l'API
const projects = [
  {
    id: 1,
    title: 'Site E-commerce Moderne',
    description: 'Plateforme e-commerce complète avec gestion de produits et paiement en ligne.',
    fullDescription: 'Ce projet consistait à créer une plateforme e-commerce complète pour une entreprise de vente en ligne. La solution inclut une interface utilisateur moderne, un système de gestion de produits, un panier d\'achat, un système de paiement sécurisé, et un tableau de bord administrateur pour la gestion des commandes.',
    image: '/images/products/s1.jpg',
    category: 'Web',
    tags: ['React', 'E-commerce', 'Stripe', 'Node.js', 'MongoDB'],
    date: '2024-01-15',
    client: 'Tech Solutions BF',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe API'],
    challenges: [
      'Intégration d\'un système de paiement sécurisé',
      'Gestion de l\'inventaire en temps réel',
      'Optimisation des performances pour de gros volumes',
    ],
    results: [
      'Augmentation de 40% des ventes en ligne',
      'Réduction de 30% du temps de traitement des commandes',
      'Interface utilisateur intuitive et responsive',
    ],
  },
  {
    id: 2,
    title: 'Application Mobile Fitness',
    description: 'Application mobile pour suivre vos entraînements et votre progression.',
    fullDescription: 'Application mobile développée pour permettre aux utilisateurs de suivre leurs entraînements, définir des objectifs, et suivre leur progression. L\'application inclut des fonctionnalités de suivi nutritionnel, de planification d\'entraînements, et de statistiques détaillées.',
    image: '/images/products/s2.jpg',
    category: 'Mobile',
    tags: ['React Native', 'Fitness', 'Health'],
    date: '2024-02-20',
    client: 'FitLife App',
    technologies: ['React Native', 'Firebase', 'Redux'],
    challenges: [
      'Synchronisation des données en temps réel',
      'Optimisation de la batterie',
      'Intégration avec des capteurs de santé',
    ],
    results: [
      '50 000+ téléchargements en 3 mois',
      'Note de 4.8/5 sur les stores',
      'Engagement utilisateur élevé',
    ],
  },
  {
    id: 3,
    title: 'Dashboard Analytics',
    description: 'Tableau de bord interactif pour visualiser et analyser vos données.',
    fullDescription: 'Dashboard analytique complet permettant aux entreprises de visualiser leurs données en temps réel. Le système inclut des graphiques interactifs, des rapports personnalisables, et des alertes automatiques.',
    image: '/images/products/s3.jpg',
    category: 'Web',
    tags: ['React', 'Charts', 'Analytics'],
    date: '2024-03-10',
    client: 'Data Corp',
    technologies: ['React', 'TypeScript', 'Chart.js', 'Node.js'],
    challenges: [
      'Traitement de grandes quantités de données',
      'Visualisation en temps réel',
      'Performance avec de multiples utilisateurs',
    ],
    results: [
      'Réduction de 50% du temps d\'analyse',
      'Amélioration de la prise de décision',
      'Interface intuitive et responsive',
    ],
  },
  {
    id: 4,
    title: 'App de Réservation',
    description: 'Application de réservation en ligne pour restaurants et services.',
    fullDescription: 'Application mobile permettant aux utilisateurs de réserver des tables dans des restaurants et des services. L\'application inclut un système de géolocalisation, des avis clients, et une gestion de réservations en temps réel.',
    image: '/images/products/s4.jpg',
    category: 'Mobile',
    tags: ['Flutter', 'Booking', 'Calendar'],
    date: '2024-04-05',
    client: 'RestoApp',
    technologies: ['Flutter', 'Firebase', 'Google Maps API'],
    challenges: [
      'Gestion des réservations en temps réel',
      'Intégration avec les systèmes de restauration',
      'Notifications push efficaces',
    ],
    results: [
      '30 000+ réservations par mois',
      'Augmentation de 25% du chiffre d\'affaires',
      'Satisfaction client élevée',
    ],
  },
  {
    id: 5,
    title: 'Portfolio Créatif',
    description: 'Site portfolio moderne pour présenter vos créations et réalisations.',
    fullDescription: 'Site portfolio moderne et élégant pour présenter les créations d\'un artiste. Le site inclut une galerie interactive, un système de filtres, et une section blog intégrée.',
    image: '/images/products/s5.jpg',
    category: 'Web',
    tags: ['Next.js', 'Portfolio', 'Design'],
    date: '2024-05-12',
    client: 'Creative Studio',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Sanity CMS'],
    challenges: [
      'Performance avec de nombreuses images',
      'Design unique et créatif',
      'SEO optimisé',
    ],
    results: [
      'Augmentation de 60% du trafic',
      'Temps de chargement optimisé',
      'Design primé',
    ],
  },
  {
    id: 6,
    title: 'App de Messagerie',
    description: 'Application de messagerie instantanée avec notifications en temps réel.',
    fullDescription: 'Application de messagerie instantanée sécurisée avec chiffrement de bout en bout. L\'application supporte les messages texte, vocaux, vidéo, et le partage de fichiers.',
    image: '/images/products/s7.jpg',
    category: 'Mobile',
    tags: ['React Native', 'Chat', 'Real-time'],
    date: '2024-06-18',
    client: 'SecureChat',
    technologies: ['React Native', 'Socket.io', 'Node.js', 'MongoDB'],
    challenges: [
      'Sécurité et chiffrement',
      'Synchronisation en temps réel',
      'Performance avec de nombreux utilisateurs',
    ],
    results: [
      '100 000+ utilisateurs actifs',
      'Taux de satisfaction de 95%',
      'Sécurité certifiée',
    ],
  },
];

const ProjetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const data = await projectsApi.getById(Number(id));
          setProject(data);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        // Fallback sur les exemples si l'API échoue
        const exampleProject = projects.find((p) => p.id === Number(id));
        if (exampleProject) {
          // Convertir l'exemple en format Project
          setProject({
            id: exampleProject.id,
            title: exampleProject.title,
            description: exampleProject.fullDescription || exampleProject.description,
            image: exampleProject.image,
            video: undefined,
            category: exampleProject.category,
            tags: exampleProject.tags,
            date: exampleProject.date,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
  }

  if (!project) {
    return <Navigate to="/realisations" />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-dark/70">
        <Link to="/" className="hover:text-primary">Accueil</Link>
        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
        <Link to="/realisations" className="hover:text-primary">Réalisations</Link>
        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
        <span className="text-dark">{project.title}</span>
      </nav>

      <div className="grid grid-cols-12 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-8 col-span-12">
          <CardBox className="mb-6 p-0 overflow-hidden">
            {project.video ? (
              <div className="h-[400px] w-full overflow-hidden bg-black">
                <video
                  src={project.video}
                  controls
                  className="w-full h-full object-contain"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            ) : project.image ? (
              <div className="h-[400px] w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge color="primary">{project.category}</Badge>
                <span className="text-sm text-dark/50">
                  {new Date(project.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-dark mb-4">{project.title}</h1>
              <p className="text-lg text-dark/70 mb-6">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, index) => (
                  <Badge key={index} color="light" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardBox>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 col-span-12">
          <CardBox>
            <h3 className="text-xl font-semibold text-dark mb-4">Informations du Projet</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-dark/50 mb-1">Date de réalisation</p>
                <p className="font-medium text-dark">
                  {new Date(project.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-dark/50 mb-1">Catégorie</p>
                <Badge color="primary">{project.category}</Badge>
              </div>
            </div>
          </CardBox>

          <CardBox className="mt-6">
            <Link to="/realisations">
              <Button color="light" className="w-full">
                <Icon icon="solar:arrow-left-line-duotone" className="mr-2" />
                Retour aux réalisations
              </Button>
            </Link>
          </CardBox>
        </div>
      </div>
    </div>
  );
};

export default ProjetDetail;

