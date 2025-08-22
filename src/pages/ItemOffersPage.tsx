import React, { useEffect, useState } from 'react';
import { getAllOffers, createOffer, updateOffer, deleteOffer, createItemOfferDetails, getValidItemOfferDetailsId } from '@/services/offer-service';
import { Offer, ItemOfferForCreateUpdateDto } from '@/types/offer';
import ItemOfferTable from '@/components/item-offer/ItemOfferTable';
import ItemOfferDialog from '@/components/item-offer/ItemOfferDialog';
import ItemOfferDetailsDialog from '@/components/item-offer/ItemOfferDetailsDialog';
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';

const STORE_ID = '1'; // Only used for createItemOfferDetails

const emptyOffer: ItemOfferForCreateUpdateDto = {
  id: 0,
  no:0, 
  nameEN: '',
  nameAR: '',
  fromDate: new Date().toISOString(),
  toDate: new Date().toISOString(),
  isSpecialOffer: false,
};

const ItemOffersPage: React.FC = () => {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogInitial, setDialogInitial] = useState<ItemOfferForCreateUpdateDto>(emptyOffer);
  const [saving, setSaving] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const fetchOffers = () => {
    setIsLoading(true);
    getAllOffers()
      .then(res => setOffers(res.data))
      .catch(() => setOffers([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCreate = () => {
    setDialogMode('create');
    setDialogInitial({ ...emptyOffer, fromDate: new Date().toISOString(), toDate: new Date().toISOString() });
    setDialogOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setDialogMode('edit');
    setDialogInitial({ ...offer });
    setDialogOpen(true);
  };

  const handleDelete = async (offer: Offer) => {
    setIsLoading(true);
    try {
      await deleteOffer(offer.id);
      sweetAlert.fire({ icon: 'success', title: t('offerDeletedSuccessfully') });
      fetchOffers();
    } catch {
      sweetAlert.fire({ icon: 'error', title: t('failedToDeleteOffer') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (dto: ItemOfferForCreateUpdateDto) => {
    setSaving(true);
    try {
      if (dialogMode === 'create') {
        await createOffer(dto);
        sweetAlert.fire({ icon: 'success', title: t('offerCreatedSuccessfully') });
      } else {
        await updateOffer(dto);
        sweetAlert.fire({ icon: 'success', title: t('offerUpdatedSuccessfully') });
      }
      setDialogOpen(false);
      fetchOffers();
    } catch {
      sweetAlert.fire({ icon: 'error', title: t('failedToSaveOffer') });
    } finally {
      setSaving(false);
    }
  };

  const handleAddItems = (offer: Offer) => {
    setSelectedOffer(offer);
    setDetailsDialogOpen(true);
  };

  const handleSaveItems = async (items) => {
    if (!selectedOffer) return;
    try {
      for (const item of items) {
        await createItemOfferDetails(STORE_ID, {
          itemBasicPrice: item.itemBasicPrice,
          itemPrice: item.itemPrice,
          discountValue: item.discountValue,
          discountPercent: item.discountPercent,
          itemUnitId: item.itemUnitId,
          itemId: item.itemId,
          itemOfferId: selectedOffer.id,
        });
      }
      sweetAlert.fire({ icon: 'success', title: t('offerItemsAddedSuccessfully') });
      setDetailsDialogOpen(false);
      setSelectedOffer(null);
    } catch {
      sweetAlert.fire({ icon: 'error', title: t('failedToAddOfferItems') });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className='card mb-xl-8'>
        <div className="card-header border-0 pt-5 flex justify-between items-center">
          <div>
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold fs-3 mb-1">{t('itemOffers')}</span>
              <span className="text-muted mt-1 fw-semibold fs-7">{t('manageItemOffers')}</span>
            </h3>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>+ {t('newOffer')}</button>
        </div>
        <div className='card-body pt-3'>
          <div className="table-responsive">
            <ItemOfferTable
              offers={offers}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={() => {}}
              onAddItems={handleAddItems}
              onImageUploaded={fetchOffers}
            />
          </div>
        </div>
      </div>
      <ItemOfferDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialValue={dialogInitial}
        onSave={handleSave}
        loading={saving}
        mode={dialogMode}
      />
      {selectedOffer && (
        <ItemOfferDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          offer={selectedOffer}
          onSave={handleSaveItems}
        />
      )}
    </div>
  );
};

export default ItemOffersPage; 