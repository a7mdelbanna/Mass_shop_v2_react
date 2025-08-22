import React, { useEffect, useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import { ItemUnit } from '@/types/item-unit';
import { fetchItemUnits, deleteItemUnit, getItemUnitById } from '@/services/item-unit-service';
import { authService } from '@/services/auth-service';
import ItemUnitTable from '@/components/item-units/ItemUnitTable';
import ItemUnitDialog from '@/components/item-units/ItemUnitDialog';
import { PageHeader } from '@/components/layouts/PageHeader';
import { TableContainer } from '@/components/layouts/TableContainer';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';

const ItemUnitDashboard = () => {
  console.log('[ItemUnitDashboard] Component initializing');
  console.log('[ItemUnitDashboard] Auth status:', {
    isAuthenticated: authService.isAuthenticated(),
    hasToken: !!authService.getToken(),
    user: authService.getUser()
  });

  const [units, setUnits] = useState<ItemUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<ItemUnit | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<ItemUnit | null>(null);
  const { t } = useTranslation();

  const loadUnits = async () => {
    console.log('[ItemUnitDashboard] loadUnits called, isLoading:', isLoading);
    console.log('[ItemUnitDashboard] Auth headers:', authService.getAuthHeaders());

    if (!authService.isAuthenticated()) {
      console.error('[ItemUnitDashboard] Not authenticated');
      toast.error('Please login to access this page');
      return;
    }

    try {
      console.log('[ItemUnitDashboard] Calling fetchItemUnits...');
      const data = await fetchItemUnits();
      console.log('[ItemUnitDashboard] fetchItemUnits response:', data);
      setUnits(data);
    } catch (error) {
      console.error('[ItemUnitDashboard] Error in loadUnits:', error);
      toast.error('Failed to load item units');
    } finally {
      console.log('[ItemUnitDashboard] Setting isLoading to false');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('[ItemUnitDashboard] useEffect triggered');
    loadUnits();
    return () => {
      console.log('[ItemUnitDashboard] Component cleanup');
    };
  }, []);

  const handleCreate = () => {
    setSelectedUnit(null);
    setIsNew(true);
    setDialogOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const unit = await getItemUnitById(id);
      setSelectedUnit(unit);
      setIsNew(false);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error loading item unit:', error);
      toast.error('Failed to load item unit');
    }
  };

  const handleDelete = (id: number) => {
    const unit = units.find(u => u.id === id);
    if (unit) {
      setUnitToDelete(unit);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!unitToDelete) return;
    try {
      const message = await deleteItemUnit(unitToDelete.id);
      sweetAlert.fire({ icon: 'success', title: message});
      loadUnits();
    } catch (error) {
      sweetAlert.fire({ icon: 'success', title: error});
    } finally {
      setDeleteDialogOpen(false);
      setUnitToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className='card mb-xl-8'>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">{t('itemUnits')}</span>
            <span className="text-muted mt-1 fw-semibold fs-7">{t('manageItemUnits')}</span>
          </h3>

          <div className="card-toolbar" title={t('addItemUnit')}>
            <Button onClick={handleCreate} className="btn btn-sm btn-light btn-active-primary text-white">
              <i className="ki-duotone ki-plus fs-2 text-white"></i>{t('addItemUnit')}
            </Button>
          </div>
        </div>
        <div className='card-body pt-3'>
          <div className="table-responsive">
            <ItemUnitTable
              units={units}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      <ItemUnitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        unit={selectedUnit}
        isNew={isNew}
        onSaveComplete={() => {
          setDialogOpen(false);
          loadUnits();
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteUnit')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteUnitConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <Button variant="destructive" onClick={confirmDelete}>
              {t('delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ItemUnitDashboard; 