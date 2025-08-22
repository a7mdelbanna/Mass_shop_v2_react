import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { uploadCompanyImage } from '@/services/company-service';
import { sweetAlert } from '@/utils/alert';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  companyId: number;
  onUploadSuccess?: (imageUrl: string) => void;
}

const CompanyImageUploadDialog: React.FC<Props> = ({ open, onClose, companyId, onUploadSuccess }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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
      formData.append('Image', file);
      formData.append('CompanyId', companyId.toString());
      await uploadCompanyImage('1', formData);
      sweetAlert.fire({
        icon: 'success',
        title: t('uploadSuccess'),
        text: t('imageUploadedSuccessfully'),
      });
      navigate('/dashboard/products/companies');

    } catch (e) {
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
          <DialogTitle>{t('uploadCompanyImage')}</DialogTitle>
          <DialogDescription>{t('uploadCompanyImageDesc')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          {preview && (
            <div className="flex justify-center">
              <img src={preview} alt={t('preview')} className="max-h-40 rounded shadow" />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={uploading}>{t('cancel')}</Button>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? t('uploading') : t('upload')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyImageUploadDialog;