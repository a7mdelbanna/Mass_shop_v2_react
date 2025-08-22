import React from 'react';
import DeliveryFeeTable from '@/components/delivery-fee/DeliveryFeeTable';
import DeliveryFeeDialog from '@/components/delivery-fee/DeliveryFeeDialog';
import DeliveryFeeByDistanceTable from '@/components/delivery-fee/DeliveryFeeByDistanceTable';
import DeliveryFeeByDistanceDialog from '@/components/delivery-fee/DeliveryFeeByDistanceDialog';
import { fetchDeliveryFeesByArea, fetchDeliveryFeesByDistance, deleteDeliveryFeeByArea, deleteDeliveryFeeByDistance } from '@/services/delivery-fee-service';
import { DeliveryFeeByAreaDto, DeliveryFeeByDistanceDto } from '@/types/delivery-fee';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const storeId = '1'; // TODO: Replace with dynamic storeId if needed

const DeliveryFeePage: React.FC = () => {
  const { t } = useTranslation();
  const { settings } = useStoreSettings();
  const [fees, setFees] = React.useState<DeliveryFeeByAreaDto[]>([]);
  const [distanceFees, setDistanceFees] = React.useState<DeliveryFeeByDistanceDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedFee, setSelectedFee] = React.useState<DeliveryFeeByAreaDto | null>(null);
  const [selectedDistanceFee, setSelectedDistanceFee] = React.useState<DeliveryFeeByDistanceDto | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [feeToDelete, setFeeToDelete] = React.useState<{ id: number; type: 'area' | 'distance' } | null>(null);

  const loadFees = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDeliveryFeesByArea(storeId);
      setFees(data);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDistanceFees = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDeliveryFeesByDistance(storeId);
      setDistanceFees(data);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (settings?.deliveryFeeType === 2) {
      loadDistanceFees();
    } else {
      loadFees();
    }
  }, [settings]);

  const handleAdd = () => {
    if (settings?.deliveryFeeType === 2) {
      setSelectedDistanceFee(null);
    } else {
      setSelectedFee(null);
    }
    setIsNew(true);
    setDialogOpen(true);
  };

  const handleEdit = (id: number) => {
    if (settings?.deliveryFeeType === 2) {
      const fee = distanceFees.find(f => f.id === id) || null;
      setSelectedDistanceFee(fee);
    } else {
      const fee = fees.find(f => f.id === id) || null;
      setSelectedFee(fee);
    }
    setIsNew(false);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (settings?.deliveryFeeType === 2) {
      setFeeToDelete({ id, type: 'distance' });
    } else {
      setFeeToDelete({ id, type: 'area' });
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!feeToDelete) return;
    
    try {
      if (feeToDelete.type === 'distance') {
        await deleteDeliveryFeeByDistance(storeId, feeToDelete.id);
      } else {
        await deleteDeliveryFeeByArea(storeId, feeToDelete.id);
      }
      toast.success(t('deliveryFeeDeleted'));
      handleSaveComplete();
    } catch (error) {
      toast.error(t('failedToDeleteDeliveryFee'));
    } finally {
      setDeleteDialogOpen(false);
      setFeeToDelete(null);
    }
  };

  const handleSaveComplete = () => {
    if (settings?.deliveryFeeType === 2) {
      loadDistanceFees();
    } else {
      loadFees();
    }
  };

  if (!settings) {
    return <div className="flex items-center justify-center h-full">{t('loading')}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('deliveryFees')}</h1>
        <Button onClick={handleAdd}>{t('addDeliveryFee')}</Button>
      </div>
      {settings.deliveryFeeType === 2 ? (
        <>
          <DeliveryFeeByDistanceTable
            fees={distanceFees}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <DeliveryFeeByDistanceDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            storeId={storeId}
            fee={selectedDistanceFee ? {
              from: selectedDistanceFee.from,
              to: selectedDistanceFee.to,
              price: selectedDistanceFee.price,
              deliveryHours: selectedDistanceFee.deliveryHours,
              deliveryMinutes: selectedDistanceFee.deliveryMinutes
            } : null}
            isNew={isNew}
            onSaveComplete={handleSaveComplete}
            feeId={selectedDistanceFee?.id}
          />
        </>
      ) : (
        <>
          <DeliveryFeeTable
            fees={fees}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <DeliveryFeeDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            storeId={storeId}
            fee={selectedFee ? {
              areaName: selectedFee.areaName,
              price: selectedFee.price,
              deliveryHours: selectedFee.deliveryHours,
              deliveryMinutes: selectedFee.deliveryMinutes,
              parentAreaId: undefined // TODO: Map if needed
            } : null}
            isNew={isNew}
            onSaveComplete={handleSaveComplete}
            feeId={selectedFee?.id}
          />
        </>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('areYouSureDeleteDeliveryFee')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeliveryFeePage; 