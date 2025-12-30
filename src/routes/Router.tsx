// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import  { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router";
import Loadable from 'src/layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const EntrepriseLayout = Loadable(lazy(() => import('../layouts/entreprise/EntrepriseLayout')));

// Pages entreprise
const Accueil = Loadable(lazy(() => import('../views/accueil/Accueil')));
const Services = Loadable(lazy(() => import('../views/services/Services')));
const Realisations = Loadable(lazy(() => import('../views/realisations/Realisations')));
const ProjetDetail = Loadable(lazy(() => import('../views/realisations/ProjetDetail')));
const Actualites = Loadable(lazy(() => import('../views/actualites/Actualites')));
const ArticleDetail = Loadable(lazy(() => import('../views/actualites/ArticleDetail')));
const Contact = Loadable(lazy(() => import('../views/contact/Contact')));

// Pages légales
const MentionsLegales = Loadable(lazy(() => import('../views/legal/MentionsLegales')));
const PolitiqueConfidentialite = Loadable(lazy(() => import('../views/legal/PolitiqueConfidentialite')));
const CGV = Loadable(lazy(() => import('../views/legal/CGV')));

const Router = [
  {
    path: '/',
    element: <EntrepriseLayout />,
    children: [
      { path: '/', exact: true, element: <Accueil /> },
      { path: '/services', exact: true, element: <Services /> },
      { path: '/realisations', exact: true, element: <Realisations /> },
      { path: '/realisations/:id', exact: true, element: <ProjetDetail /> },
      { path: '/actualites', exact: true, element: <Actualites /> },
      { path: '/actualites/:id', exact: true, element: <ArticleDetail /> },
      { path: '/contact', exact: true, element: <Contact /> },
      { path: '/legal', exact: true, element: <MentionsLegales /> },
      { path: '/privacy', exact: true, element: <PolitiqueConfidentialite /> },
      { path: '/terms', exact: true, element: <CGV /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

const router = createBrowserRouter(Router)

export default router;

