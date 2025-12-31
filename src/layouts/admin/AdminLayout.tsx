import { FC } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Icon } from '@iconify/react';
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react';
import FullLogo from '../full/shared/logo/FullLogo';

const AdminLayout: FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'solar:graph-up-line-duotone' },
    { path: '/admin/services', label: 'Services', icon: 'solar:widget-5-line-duotone' },
    { path: '/admin/projects', label: 'Projets', icon: 'solar:folder-with-files-linear' },
    { path: '/admin/articles', label: 'Articles', icon: 'solar:document-text-line-duotone' },
    { path: '/admin/partners', label: 'Partenaires', icon: 'solar:users-group-two-rounded-line-duotone' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar aria-label="Admin sidebar">
          <div className="pb-5 px-4 pt-4">
            <FullLogo />
          </div>
          <SidebarItems>
            <SidebarItemGroup>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link key={item.path} to={item.path} className="block">
                    <SidebarItem
                      active={isActive}
                      icon={() => <Icon icon={item.icon} size={20} />}
                    >
                      {item.label}
                    </SidebarItem>
                  </Link>
                );
              })}
            </SidebarItemGroup>
            <SidebarItemGroup>
              <Link to="/" className="block">
                <SidebarItem
                  icon={() => <Icon icon="solar:home-2-line-duotone" size={20} />}
                >
                  Retour au site
                </SidebarItem>
              </Link>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

