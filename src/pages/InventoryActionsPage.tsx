import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchInventoryActionLogs } from '@/services/inventory-action-service';
import { InventoryAction } from '@/types/inventory';
import InventoryActionTable from '@/components/inventoryActions/InventoryActionTable';
import InventoryDialog from '@/components/inventoryActions/InventoryActionDialog';
import BulkInventoryDialog from '@/components/inventoryActions/BulkInventoryDialog';
import { useTranslation } from 'react-i18next';

const InventoryActionsPage = () => {
  const { t } = useTranslation();
  const [actions, setActions] = React.useState<InventoryAction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = React.useState(false);

  const loadInventoryActions = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchInventoryActionLogs();
      setActions(data);
    } catch (error) {
      console.error('[InventoryPage] Error loading actions:', error);
      toast.error(t('failedToLoadInventoryActions'), { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  React.useEffect(() => {
    loadInventoryActions();
  }, [loadInventoryActions]);

  const handleAction = () => {
    setIsDialogOpen(true);
  };

  const handleBulkAction = () => {
    setIsBulkDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className='card mb-xl-8'>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">{t('inventoryActionLogs')}</span>
            <span className="text-muted mt-1 fw-semibold fs-7">
              {t('trackStockActivities')}
            </span>
          </h3>
          <div className="card-toolbar">
            <div className="d-flex gap-2">
              <Button onClick={handleBulkAction} className="btn btn-sm btn-light-warning btn-active-warning text-white">
                <i className="ki-duotone ki-plus fs-2 text-white"></i> {t('applyToAllItems')}
              </Button>
              <Button onClick={handleAction} className="btn btn-sm btn-light btn-active-primary btn-active-success text-white">
                <i className="ki-duotone ki-plus fs-2 text-white"></i> {t('makeInventoryAction')}
              </Button>
            </div>
          </div>
        </div>

        <div className='card-body pt-3'>
          <div className="table-responsive">
            <InventoryActionTable
              actions={actions}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

        {/* Render dialogs here */}
        <InventoryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSaveComplete={loadInventoryActions}
        />
        
        <BulkInventoryDialog
          open={isBulkDialogOpen}
          onOpenChange={setIsBulkDialogOpen}
          onSaveComplete={loadInventoryActions}
        />
    </div>
  );
};

export default InventoryActionsPage;