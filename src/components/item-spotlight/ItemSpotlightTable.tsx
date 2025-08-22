import React, { useState } from 'react';
import ItemSpotlightBulkAddDialog from './ItemSpotlightBulkAddDialog';
import { ItemSpotlightAllForCreateUpdateDto } from '@/types/spotlight';
import { BaseTable, TableColumn } from '@/components/ui/base-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { getItemSpotlightAllById, getItemSpotlightDetailsBySpotlightAllId, uploadSpotlightImage } from '@/services/spotlight-service';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { sweetAlert } from '@/utils/alert';

interface ItemSpotlightTableProps {
    spotlights: ItemSpotlightAllForCreateUpdateDto[];
    isLoading: boolean;
    onEdit: (spotlight: ItemSpotlightAllForCreateUpdateDto) => void;
    onDelete: (spotlight: ItemSpotlightAllForCreateUpdateDto) => void;
    onView: (spotlight: ItemSpotlightAllForCreateUpdateDto) => void;
    onAddItems: (spotlight: ItemSpotlightAllForCreateUpdateDto) => void;
}

const ItemSpotlightTable: React.FC<ItemSpotlightTableProps & { onImageUploaded?: () => void }> = ({ spotlights, isLoading, onEdit, onDelete, onView, onAddItems, onImageUploaded }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const navigate = useNavigate();
    const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
    const [selectedSpotlight, setSelectedSpotlight] = React.useState<any>(null);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
    const [selectedSpotlightDetails, setSelectedSpotlightDetails] = React.useState<ItemSpotlightAllForCreateUpdateDto | null>(null);
    const [detailsLoading, setDetailsLoading] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [spotlightToDelete, setSpotlightToDelete] = React.useState<ItemSpotlightAllForCreateUpdateDto | null>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSpotlight || !imageFile) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('SpotlightAllId', selectedSpotlight.id.toString());
            formData.append('Image', imageFile);
            await uploadSpotlightImage(formData);

            setImageDialogOpen(false);
            setImageFile(null);
            
            // Show success notification
            sweetAlert.fire({
                icon: 'success',
                title: t('uploadSuccess'),
                text: t('imageUploadedSuccessfully'),
            });
            
            // Reload data to show the new image
            if (onImageUploaded) onImageUploaded();
            
        } catch (err) {
            // Show error notification
            sweetAlert.fire({
                icon: 'error',
                title: t('uploadFailed'),
                text: t('imageUploadFailed'),
            });
        } finally {
            setUploading(false);
        }
    };

    const handleView = async (spotlight: ItemSpotlightAllForCreateUpdateDto) => {
        setDetailsLoading(true);
        setDetailsDialogOpen(true);
        try {
            const res = await getItemSpotlightAllById(spotlight.id);
            setSelectedSpotlightDetails(res.data);
        } catch (e) {
            setSelectedSpotlightDetails(null);
        } finally {
            setDetailsLoading(false);
        }
    };

    const columns: TableColumn<ItemSpotlightAllForCreateUpdateDto>[] = [
        {
            key: 'spotlight',
            header: t('spotlight'),
            className: isRTL ? 'text-right' : 'text-left',
            cell: (s) => (
                <div className={`d-flex align-items-center`}>
                    <div className="symbol symbol-50px me-5">
                        <img src={s.imageURL} alt="" />
                    </div>
                    <div className="d-flex flex-column">
                        <a href="#" className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
                            {s.titleEN}
                        </a>

                        <span className="text-gray-500 fw-semibold d-block fs-8">
                            {t('id')}: {s.id}
                        </span>
                    </div>
                </div>
            ),
        },
        { key: 'companyNameEN', header: t('companyNameEN'), cell: (s) => s.companyNameEN },
        { key: 'companyNameAR', header: t('companyNameAR'), cell: (s) => s.companyNameAR },
        { key: 'titleEN', header: t('titleEN'), cell: (s) => s.titleEN },
        { key: 'titleAR', header: t('titleAR'), cell: (s) => s.titleAR },
        { key: 'fromDate', header: t('from'), cell: (s) => s.fromDate?.split('T')[0] },
        { key: 'toDate', header: t('to'), cell: (s) => s.toDate?.split('T')[0] },
        {
            key: 'actions',
            header: t('actions'),
            cell: (s) => (
                <div className="flex gap-2 items-center">
                    <button onClick={() => handleView(s)} className="btn btn-icon btn-sm btn-light-primary" title={t('view')}>
                        <i className="ki-duotone ki-eye fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                        </i>
                    </button>
                    <button onClick={() => { setSelectedSpotlight(s); setImageDialogOpen(true); }} className="btn btn-icon btn-sm btn-light-info" title={t('uploadImage')}>
                        <i className="ki-duotone ki-switch fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                        </i>
                    </button>
                    <button onClick={() => onAddItems(s)} className="btn btn-icon btn-sm btn-light-success" title={t('addItems')}>
                        <i className="ki-duotone ki-plus fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                        </i>
                    </button>
             
                    <button onClick={() => onEdit(s)} className="btn btn-icon btn-sm btn-light-warning" title={t('edit')}>
                        <i className="ki-duotone ki-pencil fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                        </i>
                    </button>
                    <button onClick={() => { setSpotlightToDelete(s); setDeleteDialogOpen(true); }} className="btn btn-icon btn-sm btn-light-danger" title={t('delete')}>
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
                data={spotlights}
                columns={columns}
                isLoading={isLoading}
                getItemId={(s) => s.id}
            />
          
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('uploadImage')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4" encType="multipart/form-data">
                        <input
                            type="file"
                            name="Image"
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files?.[0] || null)}
                            className="input input-bordered w-full"
                            required
                        />
                        {imageFile && (
                            <img src={URL.createObjectURL(imageFile)} alt={t('preview')} className="h-24 mt-2" />
                        )}
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setImageDialogOpen(false)} disabled={uploading}>
                                {t('cancel')}
                            </Button>
                            <Button type="submit" disabled={uploading || !imageFile}>
                                {uploading ? t('uploading') : t('upload')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('spotlightDetails')}</DialogTitle>
                    </DialogHeader>
                    {detailsLoading ? (
                        <div>{t('loading')}</div>
                    ) : selectedSpotlightDetails ? (
                        <div className="space-y-2">
                            <div className="flex justify-center mb-4 gap-8">
                                {selectedSpotlightDetails.imageURL && (
                                    <div className="flex flex-col items-center">
                                        <img src={selectedSpotlightDetails.imageURL} alt="" className="max-h-40 rounded shadow" />
                                        <span className="mt-1 text-xs text-gray-600">{t('mainImage')}</span>
                                    </div>
                                )}
                            </div>
                            <div><b>{t('id')}:</b> {selectedSpotlightDetails.id}</div>
                            <div><b>{t('companyNameEN')}:</b> {selectedSpotlightDetails.companyNameEN}</div>
                            <div><b>{t('companyNameAR')}:</b> {selectedSpotlightDetails.companyNameAR}</div>
                            <div><b>{t('titleEN')}:</b> {selectedSpotlightDetails.titleEN}</div>
                            <div><b>{t('titleAR')}:</b> {selectedSpotlightDetails.titleAR}</div>
                            <div><b>{t('from')}:</b> {selectedSpotlightDetails.fromDate?.split('T')[0]}</div>
                            <div><b>{t('to')}:</b> {selectedSpotlightDetails.toDate?.split('T')[0]}</div>

                            <div className="flex justify-center">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setDetailsDialogOpen(false);
                                        navigate(`/dashboard/spotlights/${selectedSpotlightDetails.id}/items`);
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
                            {t('areYouSureDeleteSpotlight')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (spotlightToDelete) onDelete(spotlightToDelete);
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

export default ItemSpotlightTable; 