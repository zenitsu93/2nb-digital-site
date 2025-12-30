import { useState } from 'react';
import { Link } from 'react-router';
import CardBox from '../../components/shared/CardBox';
import { Badge, Pagination } from 'flowbite-react';

// Types pour les articles
interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
}

// Données des articles - à remplacer plus tard par une API/base de données
const articles: Article[] = [
  {
    id: 1,
    title: 'Les Tendances du Développement Web en 2024',
    excerpt: 'Découvrez les dernières tendances et technologies qui façonnent le développement web cette année.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img1.jpg',
    author: 'Jean Dupont',
    date: '2024-01-20',
    category: 'Technologie',
    tags: ['Web', 'React', 'Trends']
  },
  {
    id: 2,
    title: 'Comment Optimiser les Performances de votre Application',
    excerpt: 'Conseils pratiques pour améliorer les performances et l\'expérience utilisateur de vos applications.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img2.jpg',
    author: 'Marie Martin',
    date: '2024-02-15',
    category: 'Développement',
    tags: ['Performance', 'Optimisation', 'Best Practices']
  },
  {
    id: 3,
    title: 'Introduction au Design System',
    excerpt: 'Comprendre les avantages d\'un design system pour créer des interfaces cohérentes et évolutives.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img3.jpg',
    author: 'Pierre Durand',
    date: '2024-03-10',
    category: 'Design',
    tags: ['Design', 'UI/UX', 'System']
  },
  {
    id: 4,
    title: 'Sécurité des Applications Web',
    excerpt: 'Les meilleures pratiques pour sécuriser vos applications web contre les vulnérabilités courantes.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img1.jpg',
    author: 'Sophie Bernard',
    date: '2024-04-05',
    category: 'Sécurité',
    tags: ['Sécurité', 'Web', 'Best Practices']
  },
  {
    id: 5,
    title: 'React vs Vue : Quel Framework Choisir ?',
    excerpt: 'Comparaison détaillée entre React et Vue.js pour vous aider à faire le bon choix pour votre projet.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img2.jpg',
    author: 'Lucas Moreau',
    date: '2024-05-12',
    category: 'Technologie',
    tags: ['React', 'Vue', 'Framework']
  },
  {
    id: 6,
    title: 'L\'Avenir du Développement Mobile',
    excerpt: 'Exploration des technologies émergentes et des tendances futures dans le développement mobile.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img3.jpg',
    author: 'Emma Petit',
    date: '2024-06-18',
    category: 'Mobile',
    tags: ['Mobile', 'Future', 'Technology']
  },
  {
    id: 7,
    title: 'Les Meilleures Pratiques de Code Review',
    excerpt: 'Guide complet pour effectuer des code reviews efficaces et constructives dans votre équipe.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img4.jpg',
    author: 'Thomas Leroy',
    date: '2024-07-22',
    category: 'Développement',
    tags: ['Code Review', 'Best Practices', 'Team']
  },
  {
    id: 8,
    title: 'Introduction à l\'Architecture Microservices',
    excerpt: 'Comprendre les avantages et défis de l\'architecture microservices pour vos applications.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img5.jpg',
    author: 'Sarah Dubois',
    date: '2024-08-30',
    category: 'Technologie',
    tags: ['Microservices', 'Architecture', 'Scalability']
  },
  {
    id: 9,
    title: 'Accessibilité Web : Pourquoi C\'est Important',
    excerpt: 'L\'importance de créer des sites web accessibles à tous les utilisateurs.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img1.jpg',
    author: 'Marc Lefebvre',
    date: '2024-09-12',
    category: 'Design',
    tags: ['Accessibility', 'Web', 'Inclusive Design']
  },
  {
    id: 10,
    title: 'Gestion d\'État avec Redux vs Zustand',
    excerpt: 'Comparaison entre Redux et Zustand pour la gestion d\'état dans vos applications React.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img2.jpg',
    author: 'Julie Moreau',
    date: '2024-10-18',
    category: 'Développement',
    tags: ['React', 'State Management', 'Redux', 'Zustand']
  },
  {
    id: 11,
    title: 'Les Fondamentaux du SEO Technique',
    excerpt: 'Guide pratique pour améliorer le référencement technique de votre site web.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img3.jpg',
    author: 'David Martin',
    date: '2024-11-25',
    category: 'Marketing',
    tags: ['SEO', 'Technical SEO', 'Optimization']
  },
  {
    id: 12,
    title: 'Docker et Kubernetes : Guide de Démarrage',
    excerpt: 'Introduction à Docker et Kubernetes pour le déploiement de vos applications.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img4.jpg',
    author: 'Laura Bernard',
    date: '2024-12-05',
    category: 'Technologie',
    tags: ['Docker', 'Kubernetes', 'DevOps', 'Deployment']
  },
  {
    id: 13,
    title: 'Créer des Animations Fluides avec CSS',
    excerpt: 'Techniques avancées pour créer des animations performantes et engageantes.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img5.jpg',
    author: 'Nicolas Petit',
    date: '2025-01-15',
    category: 'Design',
    tags: ['CSS', 'Animations', 'UI/UX']
  },
  {
    id: 14,
    title: 'API REST vs GraphQL : Lequel Choisir ?',
    excerpt: 'Comparaison détaillée entre REST et GraphQL pour vos projets API.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img1.jpg',
    author: 'Amélie Rousseau',
    date: '2025-02-20',
    category: 'Développement',
    tags: ['API', 'REST', 'GraphQL', 'Backend']
  },
  {
    id: 15,
    title: 'Les Tendances UI/UX pour 2025',
    excerpt: 'Découvrez les tendances de design qui façonneront les interfaces en 2025.',
    content: 'Contenu complet de l\'article...',
    image: '/images/blog/blog-img2.jpg',
    author: 'Claire Vincent',
    date: '2025-03-10',
    category: 'Design',
    tags: ['UI/UX', 'Trends', 'Design', '2025']
  }
];

const Actualites = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculer la pagination
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-dark mb-2">Actualités & Blog</h2>
        <p className="text-dark/70">
          Restez informé des dernières actualités, tendances et conseils dans le domaine du développement et du design.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {currentArticles.map((article) => (
          <div className="lg:col-span-4 md:col-span-6 col-span-12" key={article.id}>
            <CardBox className="p-0 overflow-hidden group card-hover h-full flex flex-col">
              <div className="relative">
                <Link to={`/actualites/${article.id}`}>
                  <div className="overflow-hidden h-[200px] w-full">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="absolute top-4 left-4">
                  <Badge color="primary">{article.category}</Badge>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-dark/50 mb-3">
                  <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                  <span>•</span>
                  <span>{article.author}</span>
                </div>
                <Link to={`/actualites/${article.id}`}>
                  <h3 className="text-xl font-semibold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-dark/70 text-sm mb-4 flex-1 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} color="light" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link to={`/actualites/${article.id}`}>
                  <button className="text-primary hover:underline text-sm font-medium">
                    Lire la suite →
                  </button>
                </Link>
              </div>
            </CardBox>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {articles.length > 0 && totalPages > 1 && (
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

export default Actualites;

