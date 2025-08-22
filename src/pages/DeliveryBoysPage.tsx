import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { deliveryBoyService } from '@/services/delivery-boy-service';
import { DeliveryBoy } from '@/types/delivery-boy';
import DeliveryBoyTable from '@/components/delivery-boys/DeliveryBoyTable';
import DeliveryBoyDialog from '@/components/delivery-boys/DeliveryBoyDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';

const DeliveryBoysPage = () => {
  const { t } = useTranslation();
  const [deliveryBoys, setDeliveryBoys] = React.useState<DeliveryBoy[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedDeliveryBoyId, setSelectedDeliveryBoyId] = React.useState<string | null>(null);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = React.useState<DeliveryBoy | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const pageSize = 10;

  const loadDeliveryBoys = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await deliveryBoyService.getAll(currentPage, pageSize);
      setDeliveryBoys(response.data);
      setTotalPages(Math.ceil(response.totalCount / pageSize));
    } catch (error) {
      console.error('[DeliveryBoysPage] Error loading delivery boys:', error);
      toast.error('Failed to load delivery boys');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  React.useEffect(() => {
    loadDeliveryBoys();
  }, [loadDeliveryBoys]);

  const handleCreate = () => {
    setIsNew(true);
    setSelectedDeliveryBoy(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    const deliveryBoy = deliveryBoys.find(db => db.id === id);
    if (deliveryBoy) {
      // Split fullName into firstName and lastName
      let firstName = '';
      let lastName = '';
      if (deliveryBoy.fullName) {
        const parts = deliveryBoy.fullName.trim().split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
      }
      setSelectedDeliveryBoy({
        ...deliveryBoy,
        firstName,
        lastName,
      });
      setIsNew(false);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedDeliveryBoyId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await deliveryBoyService.toggleStatus(id, !currentStatus);
      toast.success('Status updated successfully');
      loadDeliveryBoys();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredDeliveryBoys = deliveryBoys.filter(
    (deliveryBoy) =>
      deliveryBoy.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryBoy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryBoy.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('deliveryBoys')}</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addDeliveryBoy')}
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchDeliveryBoys')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <DeliveryBoyTable
        deliveryBoys={filteredDeliveryBoys}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <DeliveryBoyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        deliveryBoy={selectedDeliveryBoy}
        isNew={isNew}
        onSaveComplete={loadDeliveryBoys}
      />

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setSelectedDeliveryBoyId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteDeliveryBoy')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteDeliveryBoyConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedDeliveryBoyId(null);
              }}
              disabled={isDeleting}
            >
              {t('cancel')}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedDeliveryBoyId(null);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? t('deleting') : t('delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeliveryBoysPage; 