import prisma from '../lib/prisma.js';

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Services
  const services = [
    {
      title: 'Ingénierie et Développement de Solutions Digitales',
      description: 'Conception, développement, intégration et déploiement de solutions logicielles, d\'applications web et mobiles, ainsi que de plateformes digitales innovantes. Réalisation de prestations d\'ingénierie informatiques incluant l\'architecture de systèmes, le développement sur mesure et la maintenance applicative.',
      icon: 'solar:code-2-line-duotone',
      features: ['Applications Web', 'Applications Mobiles', 'Architecture Systèmes', 'Développement sur Mesure', 'Maintenance Applicative']
    },
    {
      title: 'Conseil en Transformation Digitale et Management',
      description: 'Accompagnement stratégique et opérationnel des entreprises dans leur transformation digitale, l\'optimisation de leurs processus et la conduite du changement. Conseil en systèmes d\'information, sélection et implémentation d\'ERP, CRM, outils de gestion intégrés et solutions collaboratives.',
      icon: 'solar:chart-2-bold-duotone',
      features: ['Transformation Digitale', 'ERP & CRM', 'Optimisation Processus', 'Audits Digitaux', 'Feuilles de Route Stratégiques']
    },
    {
      title: 'Data Science et Intelligence Artificielle',
      description: 'Collecte, traitement, analyse et valorisation des données (Big Data, Business Intelligence). Développement et déploiement de solutions basées sur l\'intelligence artificielle, le Machine Learning et l\'analyse prédictive. Conseil en stratégie data et mise en place de dispositifs de gouvernance des données.',
      icon: 'solar:graph-up-line-duotone',
      features: ['Big Data', 'Business Intelligence', 'Machine Learning', 'Analyse Prédictive', 'Gouvernance des Données']
    },
    {
      title: 'Stratégie Marketing Digital et Communication',
      description: 'Définition et mise en œuvre de stratégies de marketing digital incluant le SEO/SEA, le content marketing, les réseaux sociaux et l\'automatisation marketing. Conseil en stratégie de marque, e-réputation et communication digitale.',
      icon: 'solar:megaphone-line-duotone',
      features: ['SEO/SEA', 'Content Marketing', 'Réseaux Sociaux', 'Automatisation Marketing', 'E-réputation']
    },
    {
      title: 'Formation et Renforcement des Compétences',
      description: 'Conception et animation de programmes de formation sur les outils digitaux, les méthodologies agiles et les compétences numériques. Accompagnement à l\'adoption des nouvelles technologies et au développement des talents.',
      icon: 'solar:book-bookmark-line-duotone',
      features: ['Formation Digitale', 'Méthodologies Agiles', 'Compétences Numériques', 'Adoption Technologies', 'Développement Talents']
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(service) + 1 },
      update: {},
      create: service,
    });
  }

  console.log('✅ Services seeded');

  // Seed Projects
  const projects = [
    {
      title: 'Site E-commerce Moderne',
      description: 'Plateforme e-commerce complète avec gestion de produits et paiement en ligne.',
      image: '/images/products/s1.jpg',
      category: 'Web',
      tags: ['React', 'E-commerce', 'Stripe'],
      date: new Date('2024-01-15')
    },
    {
      title: 'Application Mobile Fitness',
      description: 'Application mobile pour suivre vos entraînements et votre progression.',
      image: '/images/products/s2.jpg',
      category: 'Mobile',
      tags: ['React Native', 'Fitness', 'Health'],
      date: new Date('2024-02-20')
    }
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }

  console.log('✅ Projects seeded');

  // Seed Articles
  const articles = [
    {
      title: 'Les Tendances du Développement Web en 2024',
      excerpt: 'Découvrez les dernières tendances et technologies qui façonnent le développement web cette année.',
      content: 'Contenu complet de l\'article sur les tendances du développement web...',
      image: '/images/blog/blog-img1.jpg',
      author: 'Jean Dupont',
      category: 'Technologie',
      tags: ['Web', 'React', 'Trends'],
      published: true,
      date: new Date('2024-01-20')
    }
  ];

  for (const article of articles) {
    await prisma.article.create({
      data: article,
    });
  }

  console.log('✅ Articles seeded');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

