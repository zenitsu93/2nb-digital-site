import { useState } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Button, Label, TextInput, Textarea, Select } from 'flowbite-react';
import { Icon } from '@iconify/react';

const Contact = () => {
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du formulaire
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
    // Réinitialiser le formulaire
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      service: '',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-dark mb-4">Contactez-Nous</h1>
        <p className="text-lg text-dark/70 max-w-2xl mx-auto">
          Une question ? Un projet ? Notre équipe est à votre écoute pour vous accompagner dans votre transformation digitale.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Contact Form */}
        <div>
          <CardBox>
            <h2 className="text-2xl font-bold text-dark mb-6">Envoyez-nous un message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="firstName">Prénom</Label>
                  </div>
                  <TextInput
                    id="firstName"
                    type="text"
                    placeholder="Votre prénom"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="lastName">Nom</Label>
                  </div>
                  <TextInput
                    id="lastName"
                    type="text"
                    placeholder="Votre nom"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="phone">Téléphone</Label>
                  </div>
                  <TextInput
                    id="phone"
                    type="tel"
                    placeholder="+226 XX XX XX XX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="service">Service concerné</Label>
                  </div>
                  <Select
                    id="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Sélectionnez un service</option>
                    <option value="developpement">Développement</option>
                    <option value="transformation">Transformation Digitale</option>
                    <option value="data">Data & IA</option>
                    <option value="marketing">Marketing Digital</option>
                    <option value="formation">Formation</option>
                    <option value="autre">Autre</option>
                  </Select>
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="subject">Sujet</Label>
                  </div>
                  <TextInput
                    id="subject"
                    type="text"
                    placeholder="Sujet de votre message"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="message">Message</Label>
                </div>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre projet ou votre demande..."
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" color="primary" className="flex-1" size="lg">
                  <Icon icon="solar:paper-plane-line-duotone" className="mr-2" height={20} />
                  Envoyer le message
                </Button>
                <Button
                  type="button"
                  color="light"
                  onClick={() => {
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      subject: '',
                      service: '',
                      message: '',
                    });
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </form>
          </CardBox>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom">
          <div className="bg-white dark:bg-darkgray rounded-lg shadow-lg border border-gray-200 p-4 min-w-[300px]">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-success/10 rounded-full">
                <Icon icon="solar:check-circle-line-duotone" className="text-success text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-dark mb-1">Message envoyé !</p>
                <p className="text-sm text-dark/70">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-dark/50 hover:text-dark"
              >
                <Icon icon="solar:close-circle-line-duotone" className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;

