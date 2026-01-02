import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Icon } from '@iconify/react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../../components/ui/resizable-navbar';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Réalisations', href: '/realisations' },
    { name: 'Actualités', href: '/actualites' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <Link to="/contact">
            <NavbarButton variant="primary">
              <Icon icon="solar:phone-calling-line-duotone" className="mr-2" height={18} />
              Nous contacter
            </NavbarButton>
          </Link>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={`mobile-link-${idx}`}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative text-base font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-dark/70 hover:text-primary'
                }`}
              >
                <span className="block">{item.name}</span>
              </Link>
            );
          })}
          <div className="flex w-full flex-col gap-4 pt-2">
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              <NavbarButton variant="primary" className="w-full">
                <Icon icon="solar:phone-calling-line-duotone" className="mr-2" height={18} />
                Nous contacter
              </NavbarButton>
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default Header;

