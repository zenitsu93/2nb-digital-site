import { useEffect, useState } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Icon } from '@iconify/react';
import { servicesApi } from '../../services/api/services';
import { projectsApi } from '../../services/api/projects';
import { articlesApi } from '../../services/api/articles';

const Dashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    articles: 0,
    publishedArticles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [services, projects, allArticles, publishedArticles] = await Promise.all([
          servicesApi.getAll(),
          projectsApi.getAll(),
          articlesApi.getAll(),
          articlesApi.getAll(true),
        ]);

        setStats({
          services: services.length,
          projects: projects.length,
          articles: allArticles.length,
          publishedArticles: publishedArticles.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Services',
      value: stats.services,
      icon: 'solar:widget-5-line-duotone',
      color: 'primary',
    },
    {
      title: 'Projets',
      value: stats.projects,
      icon: 'solar:folder-with-files-linear',
      color: 'success',
    },
    {
      title: 'Articles',
      value: stats.articles,
      icon: 'solar:document-text-line-duotone',
      color: 'warning',
    },
    {
      title: 'Articles Publiés',
      value: stats.publishedArticles,
      icon: 'solar:check-circle-line-duotone',
      color: 'info',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <CardBox key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-dark">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-full bg-${stat.color}/10`}>
                <Icon icon={stat.icon} className={`text-3xl text-${stat.color}`} />
              </div>
            </div>
          </CardBox>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

