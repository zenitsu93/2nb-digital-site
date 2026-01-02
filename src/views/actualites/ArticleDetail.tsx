import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import CardBox from '../../components/shared/CardBox';
import { Badge, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { articlesApi, Article } from '../../services/api/articles';

// Données des articles - chargées depuis l'API
const articles = [
  {
    id: 1,
    title: 'Les Tendances du Développement Web en 2024',
    excerpt: 'Découvrez les dernières tendances et technologies qui façonnent le développement web cette année.',
    content: `
      <p>Le développement web continue d'évoluer à un rythme effréné, et 2024 apporte son lot de nouveautés et de tendances qui transforment la façon dont nous construisons des applications web.</p>
      
      <h2>Les Frameworks JavaScript Modernes</h2>
      <p>React, Vue.js et Angular continuent de dominer le paysage, mais de nouveaux frameworks émergent comme Svelte et Solid.js, offrant des performances encore meilleures.</p>
      
      <h2>Le Serverless et l'Edge Computing</h2>
      <p>L'adoption du serverless et de l'edge computing permet de créer des applications plus rapides et plus économes en ressources.</p>
      
      <h2>L'Intelligence Artificielle dans le Développement</h2>
      <p>Les outils d'IA comme GitHub Copilot révolutionnent la productivité des développeurs, permettant de générer du code plus rapidement.</p>
      
      <h2>La Performance et l'Accessibilité</h2>
      <p>Les développeurs accordent une attention croissante à la performance et à l'accessibilité, créant des expériences web plus inclusives.</p>
    `,
    image: '/images/blog/blog-img1.jpg',
    author: 'Jean Dupont',
    authorRole: 'Lead Developer',
    date: '2024-01-20',
    category: 'Technologie',
    tags: ['Web', 'React', 'Trends'],
    readTime: '5 min',
  },
  {
    id: 2,
    title: 'Comment Optimiser les Performances de votre Application',
    excerpt: 'Conseils pratiques pour améliorer les performances et l\'expérience utilisateur de vos applications.',
    content: `
      <p>L'optimisation des performances est cruciale pour offrir une expérience utilisateur exceptionnelle. Voici les meilleures pratiques à suivre.</p>
      
      <h2>Optimisation du Code</h2>
      <p>Utilisez le lazy loading, le code splitting, et minimisez les dépendances pour réduire la taille de votre bundle.</p>
      
      <h2>Optimisation des Images</h2>
      <p>Compressez vos images, utilisez des formats modernes comme WebP, et implémentez le lazy loading des images.</p>
      
      <h2>Mise en Cache</h2>
      <p>Implémentez des stratégies de cache efficaces pour réduire les temps de chargement.</p>
    `,
    image: '/images/blog/blog-img2.jpg',
    author: 'Marie Martin',
    authorRole: 'Performance Engineer',
    date: '2024-02-15',
    category: 'Développement',
    tags: ['Performance', 'Optimisation', 'Best Practices'],
    readTime: '7 min',
  },
  {
    id: 3,
    title: 'Introduction au Design System',
    excerpt: 'Comprendre les avantages d\'un design system pour créer des interfaces cohérentes et évolutives.',
    content: `
      <p>Un design system est une collection de composants réutilisables, guidés par des standards clairs, qui permettent de construire des interfaces cohérentes.</p>
      
      <h2>Avantages d'un Design System</h2>
      <p>Un design system améliore la cohérence, accélère le développement, et facilite la maintenance.</p>
      
      <h2>Composants Clés</h2>
      <p>Un design system inclut typiquement des composants UI, des guidelines de style, et des patterns d'utilisation.</p>
    `,
    image: '/images/blog/blog-img3.jpg',
    author: 'Pierre Durand',
    authorRole: 'UI/UX Designer',
    date: '2024-03-10',
    category: 'Design',
    tags: ['Design', 'UI/UX', 'System'],
    readTime: '6 min',
  },
  {
    id: 4,
    title: 'Sécurité des Applications Web',
    excerpt: 'Les meilleures pratiques pour sécuriser vos applications web contre les vulnérabilités courantes.',
    content: `
      <p>La sécurité web est essentielle pour protéger les données de vos utilisateurs et maintenir leur confiance.</p>
      
      <h2>Authentification et Autorisation</h2>
      <p>Implémentez des mécanismes d'authentification robustes et des contrôles d'accès appropriés.</p>
      
      <h2>Protection contre les Vulnérabilités</h2>
      <p>Protégez-vous contre les injections SQL, XSS, CSRF, et autres vulnérabilités courantes.</p>
    `,
    image: '/images/blog/blog-img1.jpg',
    author: 'Sophie Bernard',
    authorRole: 'Security Expert',
    date: '2024-04-05',
    category: 'Sécurité',
    tags: ['Sécurité', 'Web', 'Best Practices'],
    readTime: '8 min',
  },
  {
    id: 5,
    title: 'React vs Vue : Quel Framework Choisir ?',
    excerpt: 'Comparaison détaillée entre React et Vue.js pour vous aider à faire le bon choix pour votre projet.',
    content: `
      <p>React et Vue.js sont deux frameworks JavaScript populaires, chacun avec ses avantages et ses cas d'usage.</p>
      
      <h2>React</h2>
      <p>React offre une grande flexibilité, un écosystème vaste, et est largement adopté par les grandes entreprises.</p>
      
      <h2>Vue.js</h2>
      <p>Vue.js est réputé pour sa simplicité, sa courbe d'apprentissage douce, et sa documentation excellente.</p>
      
      <h2>Quand Choisir Quoi ?</h2>
      <p>Le choix dépend de vos besoins spécifiques, de votre équipe, et de vos objectifs à long terme.</p>
    `,
    image: '/images/blog/blog-img2.jpg',
    author: 'Lucas Moreau',
    authorRole: 'Frontend Architect',
    date: '2024-05-12',
    category: 'Technologie',
    tags: ['React', 'Vue', 'Framework'],
    readTime: '10 min',
  },
  {
    id: 6,
    title: 'L\'Avenir du Développement Mobile',
    excerpt: 'Exploration des technologies émergentes et des tendances futures dans le développement mobile.',
    content: `
      <p>Le développement mobile continue d'évoluer avec de nouvelles technologies et approches.</p>
      
      <h2>Applications Cross-Platform</h2>
      <p>Les frameworks comme React Native et Flutter permettent de développer pour plusieurs plateformes avec un seul codebase.</p>
      
      <h2>Progressive Web Apps</h2>
      <p>Les PWA offrent une expérience proche des applications natives avec les technologies web.</p>
      
      <h2>Intelligence Artificielle</h2>
      <p>L'IA s'intègre de plus en plus dans les applications mobiles pour améliorer l'expérience utilisateur.</p>
    `,
    image: '/images/blog/blog-img3.jpg',
    author: 'Emma Petit',
    authorRole: 'Mobile Developer',
    date: '2024-06-18',
    category: 'Mobile',
    tags: ['Mobile', 'Future', 'Technology'],
    readTime: '9 min',
  },
];

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (id) {
          const data = await articlesApi.getById(Number(id));
          setArticle(data);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        // Fallback sur les exemples si l'API échoue
        const exampleArticle = articles.find((a) => a.id === Number(id));
        if (exampleArticle) {
          // Convertir l'exemple en format Article
          setArticle({
            id: exampleArticle.id,
            title: exampleArticle.title,
            excerpt: exampleArticle.excerpt,
            content: exampleArticle.content,
            image: exampleArticle.image,
            video: undefined,
            author: exampleArticle.author,
            date: exampleArticle.date,
            category: exampleArticle.category,
            tags: exampleArticle.tags,
            published: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
  }

  if (!article) {
    return <Navigate to="/actualites" />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-dark/70">
        <Link to="/" className="hover:text-primary">Accueil</Link>
        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
        <Link to="/actualites" className="hover:text-primary">Actualités</Link>
        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
        <span className="text-dark">{article.title}</span>
      </nav>

      <div className="grid grid-cols-12 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-8 col-span-12">
          <CardBox className="mb-6 p-0 overflow-hidden">
            {article.video ? (
              <div className="h-[400px] w-full overflow-hidden bg-black">
                <video
                  src={article.video}
                  controls
                  className="w-full h-full object-contain"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            ) : article.image ? (
              <div className="h-[400px] w-full overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge color="primary">{article.category}</Badge>
                <span className="text-sm text-dark/50">
                  {new Date(article.date).toLocaleDateString('fr-FR')}
                </span>
                <span className="text-sm text-dark/50">•</span>
                <span className="text-sm text-dark/50">5 min de lecture</span>
              </div>
              <h1 className="text-3xl font-bold text-dark mb-4">{article.title}</h1>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon icon="solar:user-circle-line-duotone" className="text-2xl text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-dark">{article.author}</p>
                  </div>
                </div>
              </div>
              <p className="text-lg text-dark/70 mb-4">{article.excerpt}</p>
              <div className="prose prose-lg max-w-none text-dark/70 
                prose-headings:text-dark prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6
                prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-5
                prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
                prose-p:mb-4 prose-p:leading-relaxed
                prose-strong:text-dark prose-strong:font-semibold
                prose-em:text-dark/80
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-dark/80
                prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                prose-img:rounded-lg prose-img:my-4 prose-img:max-w-full
                prose-hr:border-gray-300 prose-hr:my-6
                prose-table:w-full prose-table:border-collapse prose-table:my-4
                prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100 prose-th:font-semibold
                prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                    br: () => <br className="mb-2" />,
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200">
                {article.tags.map((tag, index) => (
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
            <h3 className="text-xl font-semibold text-dark mb-4">Informations</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-dark/50 mb-1">Auteur</p>
                <p className="font-medium text-dark">{article.author}</p>
              </div>
              <div>
                <p className="text-sm text-dark/50 mb-1">Date de publication</p>
                <p className="font-medium text-dark">
                  {new Date(article.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-dark/50 mb-1">Catégorie</p>
                <Badge color="primary">{article.category}</Badge>
              </div>
            </div>
          </CardBox>

          <CardBox className="mt-6">
            <Link to="/actualites">
              <Button color="light" className="w-full">
                <Icon icon="solar:arrow-left-line-duotone" className="mr-2" />
                Retour aux actualités
              </Button>
            </Link>
          </CardBox>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;


