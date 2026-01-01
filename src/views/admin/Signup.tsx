import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button, TextInput, Card } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/AuthContext';
import FullLogo from '../../layouts/full/shared/logo/FullLogo';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      await register(username, password, email || undefined);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FullLogo />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-2">Créer un compte Admin</h1>
          <p className="text-dark/70">Créez votre compte administrateur</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <Icon icon="solar:danger-circle-line-duotone" className="text-lg" />
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-dark mb-2">
              Nom d'utilisateur *
            </label>
            <TextInput
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choisissez un nom d'utilisateur"
              required
              icon={() => <Icon icon="solar:user-line-duotone" />}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
              Email (optionnel)
            </label>
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              icon={() => <Icon icon="solar:letter-line-duotone" />}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
              Mot de passe *
            </label>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Au moins 6 caractères"
              required
              minLength={6}
              icon={() => <Icon icon="solar:lock-password-line-duotone" />}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark mb-2">
              Confirmer le mot de passe *
            </label>
            <TextInput
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
              required
              minLength={6}
              icon={() => <Icon icon="solar:lock-password-line-duotone" />}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icon icon="solar:refresh-line-duotone" className="animate-spin mr-2" />
                Création...
              </>
            ) : (
              <>
                <Icon icon="solar:user-plus-line-duotone" className="mr-2" />
                Créer le compte
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-dark/70">
            Vous avez déjà un compte ?{' '}
            <Link to="/admin/login" className="text-primary hover:underline font-medium">
              Se connecter
            </Link>
          </p>
          <Link
            to="/"
            className="text-sm text-primary hover:underline flex items-center justify-center gap-2"
          >
            <Icon icon="solar:arrow-left-line-duotone" />
            Retour au site
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
