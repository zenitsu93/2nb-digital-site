import { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Textarea, Label, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { servicesApi, Service } from '../../../services/api/services';
import Toast from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    features: '',
  });
  const { toast, showToast, hideToast } = useToast();
  const { dialog, showConfirm, hideConfirm, handleConfirm } = useConfirmDialog();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon || '',
        features: service.features.join(', '),
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        icon: '',
        features: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: '',
      features: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featuresArray = formData.features
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      if (editingService) {
        await servicesApi.update(editingService.id, {
          ...formData,
          features: featuresArray,
        });
        showToast('Service modifié avec succès', 'success');
      } else {
        await servicesApi.create({
          ...formData,
          features: featuresArray,
        });
        showToast('Service créé avec succès', 'success');
      }
      handleCloseModal();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    showConfirm(
      'Supprimer le service',
      'Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.',
      async () => {
        try {
          await servicesApi.delete(id);
          showToast('Service supprimé avec succès', 'success');
          fetchServices();
        } catch (error) {
          console.error('Error deleting service:', error);
          showToast('Erreur lors de la suppression', 'error');
        }
      },
      {
        variant: 'error',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
      }
    );
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
      <ConfirmDialog
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        variant={dialog.variant}
        onConfirm={handleConfirm}
        onCancel={hideConfirm}
        loading={dialog.loading}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">Gestion des Services</h1>
        <Button color="primary" onClick={() => handleOpenModal()}>
          <Icon icon="solar:add-circle-line-duotone" className="mr-2" />
          Ajouter un service
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Icône</th>
                <th scope="col" className="px-6 py-3">Titre</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Caractéristiques</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{service.id}</td>
                  <td className="px-6 py-4">
                    {service.icon && (
                      <Icon icon={service.icon} className="text-2xl" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{service.title}</td>
                  <td className="px-6 py-4 max-w-xs truncate">
                    {service.description}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} color="light" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {service.features.length > 2 && (
                        <Badge color="light" className="text-xs">
                          +{service.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => handleOpenModal(service)}
                      >
                        <Icon icon="solar:pen-line-duotone" />
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Icon icon="solar:trash-bin-trash-line-duotone" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onClose={handleCloseModal} size="4xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingService ? 'Modifier le service' : 'Ajouter un service'}
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <TextInput
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="icon">Icône (Iconify)</Label>
                <TextInput
                  id="icon"
                  placeholder="solar:code-2-line-duotone"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="features">Caractéristiques (séparées par des virgules)</Label>
                <TextInput
                  id="features"
                  placeholder="Feature 1, Feature 2, Feature 3"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <Button type="submit" color="primary">
              {editingService ? 'Modifier' : 'Créer'}
            </Button>
            <Button color="light" onClick={handleCloseModal}>
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminServices;

