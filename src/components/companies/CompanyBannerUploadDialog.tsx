import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { uploadCompanyBannerImages } from '@/services/company-service';
import { sweetAlert } from '@/utils/alert';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  companyId: number;
  onUploadSuccess?: () => void;
}

const CompanyBannerUploadDialog: React.FC<Props> = ({ open, onClose, companyId, onUploadSuccess }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Create preview URLs from files
  const previews = files.map(file => URL.createObjectURL(file));

  // Handle dropped or selected files (append new files)
  const addFiles = useCallback((newFiles: FileList | File[]) => {
    setFiles(prev => {
      // Filter duplicates by name + size (optional)
      const existing = new Set(prev.map(f => f.name + f.size));
      const filtered = Array.from(newFiles).filter(f => !existing.has(f.name + f.size));
      return [...prev, ...filtered];
    });
  }, []);

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // Delete single file preview
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Trigger hidden file input click
  const triggerFileSelect = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('BannerImages', file);
      });
      formData.append('CompanyId', companyId.toString());

      await uploadCompanyBannerImages('1', formData);
      sweetAlert.fire({
        icon: 'success',
        title: t('uploadSuccess'),
        text: t('bannersUploadedSuccessfully'),
      });

      if (onUploadSuccess) onUploadSuccess();
      navigate('/dashboard/products/companies');
    } catch (e) {
      sweetAlert.fire({
        icon: 'error',
        title: t('uploadFailed'),
        text: t('bannerUploadFailed'),
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('uploadCompanyBanners')}</DialogTitle>
          <DialogDescription>{t('uploadCompanyBannersDesc')}</DialogDescription>
        </DialogHeader>

        {/* Drag and Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-400 rounded-md p-6 text-center cursor-pointer hover:border-blue-500 transition"
          onClick={triggerFileSelect}
          style={{ minHeight: 150 }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            ref={inputRef}
            className="hidden"
            disabled={uploading}
          />
          <p className="text-gray-600">{t('dragDropOrClickToUpload')}</p>
        </div>

        {/* Preview thumbnails */}
        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {previews.map((src, idx) => (
              <div key={idx} className="relative rounded overflow-hidden shadow-md">
                <img src={src} alt={`${t('preview')} ${idx + 1}`} className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                  title={t('removeImage')}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            {t('cancel')}
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
            {uploading ? t('uploading') : t('upload')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyBannerUploadDialog;
