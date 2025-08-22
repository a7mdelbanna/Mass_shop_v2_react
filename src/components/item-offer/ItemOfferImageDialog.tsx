import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { uploadOfferImage } from '@/services/offer-service';
import { sweetAlert } from '@/utils/alert';

interface ItemOfferImageDialogProps {
  open: boolean;
  onClose: () => void;
  offerId: number;
  onUploadSuccess?: (imageUrl: string) => void;
}

const ItemOfferImageDialog: React.FC<ItemOfferImageDialogProps> = ({ open, onClose, offerId, onUploadSuccess }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('ItemOfferId', offerId.toString());
      formData.append('Image', file);
      const res = await uploadOfferImage('1', formData);
      
      // Show success notification
      sweetAlert.fire({
        icon: 'success',
        title: t('uploadSuccess'),
        text: t('imageUploadedSuccessfully'),
      });
      
      // Call callback to reload data and show the new image
      if (onUploadSuccess) onUploadSuccess(res.data);
      onClose();
    } catch (e) {
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

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t('uploadOfferImage')}</DialogTitle>
          <DialogDescription>{t('uploadOfferImageDesc')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          {preview && (
            <div className="flex justify-center">
              <img src={preview} alt="Preview" className="max-h-40 rounded shadow" />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={uploading}>{t('cancel')}</Button>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  {t('uploading')}
                </span>
              ) : t('upload')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemOfferImageDialog; 