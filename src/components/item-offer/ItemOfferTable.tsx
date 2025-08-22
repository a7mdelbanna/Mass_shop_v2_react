import React from 'react';
import { Button } from '@/components/ui/button';
import ItemOfferBulkAddDialog from './ItemOfferBulkAddDialog';
import { Offer } from '@/types/offer';
import { BaseTable, TableColumn } from '@/components/ui/base-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { getOfferDetailsWithItems } from '@/services/offer-service';
import ItemOfferImageDialog from './ItemOfferImageDialog';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface ItemOfferTableProps {
    offers: Offer[];
    isLoading: boolean;
    onEdit: (offer: Offer) => void;
    onDelete: (offer: Offer) => void;
    onView: (offer: Offer) => void;
    onAddItems: (offer: Offer) => void;
    onImageUploaded?: () => void;
}


const ItemOfferTable: React.FC<ItemOfferTableProps> = ({ offers, isLoading, onEdit, onDelete, onView, onAddItems, onImageUploaded }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const navigate = useNavigate();
    const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
    const [selectedOfferId, setSelectedOfferId] = React.useState<number | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
    const [selectedOfferDetails, setSelectedOfferDetails] = React.useState<Offer | null>(null);
    const [detailsLoading, setDetailsLoading] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [offerToDelete, setOfferToDelete] = React.useState<Offer | null>(null);
    // You may need to pass storeId from props or context. Here, using '1' as placeholder.
    const storeId = '1';

    const handleView = async (offer: Offer) => {
        setDetailsDialogOpen(true);
        setDetailsLoading(true);
        try {
            // Always fetch latest offer details
            const res = await getOfferDetailsWithItems(offer.id);
            setSelectedOfferDetails(res.offer);
            if (onView) onView(res.offer);
        } catch (e) {
            setSelectedOfferDetails(null);
        } finally {
            setDetailsLoading(false);
        }
    };

    const columns: TableColumn<Offer>[] = [

        {
            key: 'offer',
            header: t('offer'),
            className: isRTL ? 'text-right' : 'text-left',
            cell: (offer) => (
                <div className={`d-flex align-items-center`}>
                    <div className="symbol symbol-50px me-5">
                        <img src={offer.itemImageURL} alt="" />
                    </div>
                    <div className="d-flex flex-column">
                        <a href="#" className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
                            {offer.nameEN}
                        </a>

                        <span className="text-gray-500 fw-semibold d-block fs-8">
                            {t('id')}: {offer.id}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'nameEN',
            header: t('nameEN'),
            className: isRTL ? 'text-right' : 'text-left',
            cell: (offer) => offer.nameEN,
        },
        {
            key: 'nameAR',
            header: t('nameAR'),
            className: isRTL ? 'text-right' : 'text-left',
            cell: (offer) => offer.nameAR,
        },
        {
            key: 'fromDate',
            header: t('from'),
            className: isRTL ? 'text-right' : 'text-left',
            cell: (offer) => offer.fromDate.split('T')[0],
        },
        {
            key: 'toDate',
            header: t('to'),
            className: isRTL ? 'text-right' : 'text-left',
            cell: (offer) => offer.toDate.split('T')[0],
        },
        {
            key: 'isSpecialOffer',
            header: t('special'),
            className: isRTL ? 'text-right' : 'text-left',
            cell: (offer) => offer.isSpecialOffer ? t('yes') : t('no'),
        },
        {
            key: 'isActive',
            header: t('active'),
            className: isRTL ? 'text-right' : 'text-left',
            cell: (offer) => offer.isActive ? t('yes') : t('no'),
        },
        {
            key: 'actions',
            header: t('actions'),
            className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
            cell: (offer) => (
                <div className="flex gap-2 items-center">

                    <button onClick={() => handleView(offer)} className="btn btn-icon btn-sm btn-light-primary" title={t('view')}>
                        <i className="ki-duotone ki-eye fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                        </i>
                    </button>
                    <button onClick={() => { setSelectedOfferId(offer.id); setImageDialogOpen(true); }} className="btn btn-icon btn-sm btn-light-info" title={t('uploadImage')}>
                        <i className="ki-duotone ki-switch fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                        </i>
                    </button>
                    <button onClick={() => onAddItems(offer)} className="btn btn-icon btn-sm btn-light-success" title={t('addItems')}>
                        <i className="ki-duotone ki-plus fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                        </i>
                    </button>
                     
                    <button onClick={() => onEdit(offer)} className="btn btn-icon btn-sm btn-light-warning" title={t('edit')}>
                        <i className="ki-duotone ki-pencil fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                        </i>
                    </button>



                    <button onClick={() => { setOfferToDelete(offer); setDeleteDialogOpen(true); }} className="btn btn-icon btn-sm btn-light-danger" title={t('delete')}>
                        <i className="ki-duotone ki-trash fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                        </i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <BaseTable
                data={offers}
                columns={columns}
                isLoading={isLoading}
                getItemId={(offer) => offer.id}
            />
           
            <ItemOfferImageDialog
                open={imageDialogOpen}
                onClose={() => setImageDialogOpen(false)}
                offerId={selectedOfferId || 0}
                onUploadSuccess={() => {
                    setImageDialogOpen(false);
                    if (onImageUploaded) onImageUploaded();
                }}
            />
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('offerDetails')}</DialogTitle>
                    </DialogHeader>
                    {detailsLoading ? (
                        <div>{t('loading')}</div>
                    ) : selectedOfferDetails ? (
                        <div className="space-y-2">
                            <div className="flex justify-center mb-4 gap-8">
                                {selectedOfferDetails.itemImageURL && (
                                    <div className="flex flex-col items-center">
                                        <img src={selectedOfferDetails.itemImageURL} alt="" className="max-h-40 rounded shadow" />
                                        <span className="mt-1 text-xs text-gray-600">{t('mainImage')}</span>
                                    </div>
                                )}
                            </div>
                            <div><b>{t('id')}:</b> {selectedOfferDetails.id}</div>
                            <div><b>{t('nameEN')}:</b> {selectedOfferDetails.nameEN}</div>
                            <div><b>{t('nameAR')}:</b> {selectedOfferDetails.nameAR}</div>
                            <div><b>{t('from')}:</b> {selectedOfferDetails.fromDate?.split('T')[0]}</div>
                            <div><b>{t('to')}:</b> {selectedOfferDetails.toDate?.split('T')[0]}</div>
                            <div><b>{t('special')}:</b> {selectedOfferDetails.isSpecialOffer ? t('yes') : t('no')}</div>
                            <div><b>{t('active')}:</b> {selectedOfferDetails.isActive ? t('yes') : t('no')}</div>
                            <div className="flex justify-center">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setDetailsDialogOpen(false);
                                        navigate(`/dashboard/offers/${selectedOfferDetails.id}/items`);
                                    }}
                                >
                                    {t('showItems')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>{t('noData')}</div>
                    )}
                </DialogContent>
            </Dialog>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirm')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('areYouSureDeleteoffer')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (offerToDelete) onDelete(offerToDelete);
                                setDeleteDialogOpen(false);
                            }}
                        >
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ItemOfferTable; 