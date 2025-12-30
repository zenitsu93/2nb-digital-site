import { useState } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Button, Badge, Pagination } from 'flowbite-react';
import { Link } from 'react-router';

// Types pour les projets
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  date: string;
}

// Données des projets - à remplacer plus tard par une API/base de données
const projects: Project[] = [
  {
    id: 1,
    title: 'Site E-commerce Moderne',
    description: 'Plateforme e-commerce complète avec gestion de produits et paiement en ligne.',
    image: '/images/products/s1.jpg',
    category: 'Web',
    tags: ['React', 'E-commerce', 'Stripe'],
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Application Mobile Fitness',
    description: 'Application mobile pour suivre vos entraînements et votre progression.',
    image: '/images/products/s2.jpg',
    category: 'Mobile',
    tags: ['React Native', 'Fitness', 'Health'],
    date: '2024-02-20'
  },
  {
    id: 3,
    title: 'Dashboard Analytics',
    description: 'Tableau de bord interactif pour visualiser et analyser vos données.',
    image: '/images/products/s3.jpg',
    category: 'Web',
    tags: ['React', 'Charts', 'Analytics'],
    date: '2024-03-10'
  },
  {
    id: 4,
    title: 'App de Réservation',
    description: 'Application de réservation en ligne pour restaurants et services.',
    image: '/images/products/s4.jpg',
    category: 'Mobile',
    tags: ['Flutter', 'Booking', 'Calendar'],
    date: '2024-04-05'
  },
  {
    id: 5,
    title: 'Portfolio Créatif',
    description: 'Site portfolio moderne pour présenter vos créations et réalisations.',
    image: '/images/products/s5.jpg',
    category: 'Web',
    tags: ['Next.js', 'Portfolio', 'Design'],
    date: '2024-05-12'
  },
  {
    id: 6,
    title: 'App de Messagerie',
    description: 'Application de messagerie instantanée avec notifications en temps réel.',
    image: '/images/products/s7.jpg',
    category: 'Mobile',
    tags: ['React Native', 'Chat', 'Real-time'],
    date: '2024-06-18'
  },
  {
    id: 7,
    title: 'Plateforme LMS',
    description: 'Système de gestion de l\'apprentissage en ligne avec suivi des progrès.',
    image: '/images/products/s1.jpg',
    category: 'Web',
    tags: ['Laravel', 'Education', 'LMS'],
    date: '2024-07-05'
  },
  {
    id: 8,
    title: 'App de Livraison',
    description: 'Application mobile pour la gestion et le suivi des livraisons en temps réel.',
    image: '/images/products/s2.jpg',
    category: 'Mobile',
    tags: ['Flutter', 'Delivery', 'GPS'],
    date: '2024-08-10'
  },
  {
    id: 9,
    title: 'Site Vitrine Premium',
    description: 'Site web élégant et moderne pour présenter votre entreprise.',
    image: '/images/products/s3.jpg',
    category: 'Web',
    tags: ['Next.js', 'Corporate', 'Design'],
    date: '2024-09-15'
  },
  {
    id: 10,
    title: 'App de Santé',
    description: 'Application mobile pour le suivi médical et les rendez-vous.',
    image: '/images/products/s4.jpg',
    category: 'Mobile',
    tags: ['React Native', 'Health', 'Medical'],
    date: '2024-10-20'
  },
  {
    id: 11,
    title: 'Marketplace B2B',
    description: 'Plateforme de marketplace pour les entreprises avec système de paiement.',
    image: '/images/products/s5.jpg',
    category: 'Web',
    tags: ['Vue.js', 'Marketplace', 'B2B'],
    date: '2024-11-25'
  },
  {
    id: 12,
    title: 'App de Transport',
    description: 'Application de réservation de transport avec géolocalisation.',
    image: '/images/products/s7.jpg',
    category: 'Mobile',
    tags: ['Flutter', 'Transport', 'Booking'],
    date: '2024-12-01'
  },
  {
    id: 13,
    title: 'ERP Sur Mesure',
    description: 'Solution ERP complète pour la gestion d\'entreprise.',
    image: '/images/products/s1.jpg',
    category: 'Web',
    tags: ['ERP', 'Management', 'Custom'],
    date: '2025-01-10'
  },
  {
    id: 14,
    title: 'App de Fitness',
    description: 'Application complète de fitness avec programmes personnalisés.',
    image: '/images/products/s2.jpg',
    category: 'Mobile',
    tags: ['React Native', 'Fitness', 'Health'],
    date: '2025-02-15'
  },
  {
    id: 15,
    title: 'Plateforme SaaS',
    description: 'Solution SaaS complète pour la gestion de projets et équipes.',
    image: '/images/products/s3.jpg',
    category: 'Web',
    tags: ['SaaS', 'Project Management', 'Team'],
    date: '2025-03-20'
  }
];

// Catégories disponibles
const categories = ['Tous', 'Web', 'Mobile', 'Design'];

const Realisations = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtrer les projets selon la catégorie sélectionnée
  const filteredProjects = selectedCategory === 'Tous' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  // Calculer la pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 quand la catégorie change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-dark mb-2">Nos Réalisations</h2>
        <p className="text-dark/70">
          Découvrez nos projets et réalisations dans différents domaines.
        </p>
      </div>

      {/* Filtres */}
      <CardBox className="mb-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              color={selectedCategory === category ? 'primary' : 'light'}
              className={selectedCategory === category ? '' : 'text-dark'}
            >
              {category}
            </Button>
          ))}
        </div>
      </CardBox>

      {/* Liste des projets */}
      <div className="grid grid-cols-12 gap-6">
        {currentProjects.map((project) => (
          <div className="lg:col-span-4 md:col-span-6 col-span-12" key={project.id}>
            <CardBox className="p-0 overflow-hidden group card-hover h-full flex flex-col">
              <div className="relative">
                <Link to={`/realisations/${project.id}`}>
                  <div className="overflow-hidden h-[200px] w-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="absolute top-4 right-4">
                  <Badge color="primary">{project.category}</Badge>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <Link to={`/realisations/${project.id}`}>
                  <h3 className="text-xl font-semibold text-dark mb-2 group-hover:text-primary transition-colors cursor-pointer">
                    {project.title}
                  </h3>
                </Link>
                <p className="text-dark/70 text-sm mb-4 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} color="light" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-dark/50">{new Date(project.date).toLocaleDateString('fr-FR')}</span>
                  <Link to={`/realisations/${project.id}`}>
                    <Button color="primary" size="sm">
                      Voir plus
                    </Button>
                  </Link>
                </div>
              </div>
            </CardBox>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <CardBox>
          <p className="text-center text-dark/70">Aucun projet trouvé dans cette catégorie.</p>
        </CardBox>
      )}

      {/* Pagination */}
      {filteredProjects.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}
    </div>
  );
};

export default Realisations;

