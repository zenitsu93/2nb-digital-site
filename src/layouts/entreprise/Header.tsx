import { Link, useLocation } from 'react-router';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import AnimatedButton from '../../components/shared/AnimatedButton';
import Logo from '../../components/entreprise/Logo';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Réalisations', href: '/realisations' },
    { name: 'Actualités', href: '/actualites' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-dark/70 hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/contact">
              <AnimatedButton variant="primary" size="sm" className="ml-4">
                <Icon icon="solar:phone-calling-line-duotone" className="mr-2" height={18} />
                Nous contacter
              </AnimatedButton>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Icon
              icon={mobileMenuOpen ? 'solar:close-circle-line-duotone' : 'solar:hamburger-menu-line-duotone'}
              className="text-2xl text-dark"
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-4 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium ${
                    isActive(item.href) ? 'text-primary' : 'text-dark/70 hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button color="primary" className="w-full mt-2">
                  <Icon icon="solar:phone-calling-line-duotone" className="mr-2" height={18} />
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

