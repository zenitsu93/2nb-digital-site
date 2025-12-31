import { Link } from 'react-router';

const FullLogo = () => {
  return (
    <Link to="/admin" className="flex items-center gap-3">
      <img
        src="/images/social-preview.png"
        alt="2NB Digital Logo"
        className="h-10 w-auto"
      />
      <div>
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
      </div>
    </Link>
  );
};

export default FullLogo;

