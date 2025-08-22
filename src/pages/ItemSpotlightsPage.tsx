import React, { useEffect, useState } from 'react';
import { getAllItemSpotlightAll, createItemSpotlightAll, updateItemSpotlightAll, deleteItemSpotlightAll, createItemSpotlightDetail } from '@/services/spotlight-service';
import { ItemSpotlightAllForCreateUpdateDto } from '@/types/spotlight';
import ItemSpotlightTable from '@/components/item-spotlight/ItemSpotlightTable';
import ItemSpotlightDialog from '@/components/item-spotlight/ItemSpotlightDialog';
import ItemSpotlightDetailsDialog from '@/components/item-spotlight/ItemSpotlightDetailsDialog';
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';

const STORE_ID = '1';

const emptySpotlight: ItemSpotlightAllForCreateUpdateDto = {
  id: 0,
  companyNameEN: '',
  companyNameAR: '',
  titleEN: '',
  titleAR: '',
  fromDate: new Date().toISOString(),
  toDate: new Date().toISOString(),
};

const ItemSpotlightsPage: React.FC = () => {
  const { t } = useTranslation();
  const [spotlights, setSpotlights] = useState<ItemSpotlightAllForCreateUpdateDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogInitial, setDialogInitial] = useState<ItemSpotlightAllForCreateUpdateDto>(emptySpotlight);
  const [saving, setSaving] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedSpotlight, setSelectedSpotlight] = useState<ItemSpotlightAllForCreateUpdateDto | null>(null);

  const fetchSpotlights = () => {
    setIsLoading(true);
    getAllItemSpotlightAll()
      .then(res => setSpotlights(res.data))
      .catch(() => setSpotlights([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSpotlights();
  }, []);

  const handleCreate = () => {
    setDialogMode('create');
    setDialogInitial({ ...emptySpotlight, fromDate: new Date().toISOString(), toDate: new Date().toISOString() });
    setDialogOpen(true);
  };

  const handleEdit = (spotlight: ItemSpotlightAllForCreateUpdateDto) => {
    setDialogMode('edit');
    setDialogInitial({ ...spotlight });
    setDialogOpen(true);
  };

  const handleDelete = async (spotlight: ItemSpotlightAllForCreateUpdateDto) => {
    setIsLoading(true);
    try {
      await deleteItemSpotlightAll(spotlight.id);
      sweetAlert.fire({ icon: 'success', title: t('spotlightDeletedSuccessfully') });
      fetchSpotlights();
    } catch {
      sweetAlert.fire({ icon: 'error', title: t('failedToDeleteSpotlight') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (dto: ItemSpotlightAllForCreateUpdateDto) => {
    setSaving(true);
    try {
      if (dialogMode === 'create') {
        await createItemSpotlightAll(dto);
        sweetAlert.fire({ icon: 'success', title: t('spotlightCreatedSuccessfully') });
      } else {
        await updateItemSpotlightAll(dto);
        sweetAlert.fire({ icon: 'success', title: t('spotlightUpdatedSuccessfully') });
      }
      setDialogOpen(false);
      fetchSpotlights();
    } catch {
      sweetAlert.fire({ icon: 'error', title: t('failedToSaveSpotlight') });
    } finally {
      setSaving(false);
    }
  };

  const handleAddItems = (spotlight: ItemSpotlightAllForCreateUpdateDto) => {
    setSelectedSpotlight(spotlight);
    setDetailsDialogOpen(true);
  };

  const handleSaveItems = async (items) => {
    if (!selectedSpotlight) return;
    try {
      for (const item of items) {
        await createItemSpotlightDetail({
          itemAmount: item.itemAmount,
          itemBasicPrice: item.itemBasicPrice,
          itemPrice: item.itemPrice,
          discountValue: item.discountValue,
          discountPercent: item.discountPercent,
          itemUnitId: item.itemUnitId,
          spotlightAllId: selectedSpotlight.id,
          itemId: item.itemId,
        });
      }
      sweetAlert.fire({ icon: 'success', title: t('spotlightItemsAddedSuccessfully') });
      setDetailsDialogOpen(false);
      setSelectedSpotlight(null);
    } catch {
      sweetAlert.fire({ icon: 'error', title: t('failedToAddSpotlightItems') });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className='card mb-xl-8'>
        <div className="card-header border-0 pt-5 flex justify-between items-center">
          <div>
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold fs-3 mb-1">{t('itemSpotlights')}</span>
              <span className="text-muted mt-1 fw-semibold fs-7">{t('manageItemSpotlights')}</span>
            </h3>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>+ {t('newSpotlight')}</button>
        </div>
        <div className='card-body pt-3'>
          <div className="table-responsive">
            <ItemSpotlightTable
              spotlights={spotlights}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={() => {}}
              onAddItems={handleAddItems}
              onImageUploaded={fetchSpotlights}
            />
          </div>
        </div>
      </div>
      <ItemSpotlightDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialValue={dialogInitial}
        onSave={handleSave}
        loading={saving}
        mode={dialogMode}
      />
      {selectedSpotlight && (
        <ItemSpotlightDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          spotlight={{ id: selectedSpotlight.id, titleEN: selectedSpotlight.titleEN || '' }}
          onSave={handleSaveItems}
        />
      )}
    </div>
  );
};

export default ItemSpotlightsPage; 