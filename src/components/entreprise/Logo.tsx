import { Link } from 'react-router';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src="/images/social-preview.png" 
        alt="2NB Digital Logo" 
        className="h-20 w-auto"
      />
    </Link>
  );
};

export default Logo;

