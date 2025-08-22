import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { ItemSpotlightAllForCreateUpdateDto } from '@/types/spotlight';
import ItemSpotlightFields from './ItemSpotlightFields';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ItemSpotlightDialogProps {
  open: boolean;
  onClose: () => void;
  initialValue: ItemSpotlightAllForCreateUpdateDto;
  onSave: (value: ItemSpotlightAllForCreateUpdateDto) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const ItemSpotlightDialog: React.FC<ItemSpotlightDialogProps> = ({
  open,
  onClose,
  initialValue,
  onSave,
  loading,
  mode = 'create',
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const form = useForm<ItemSpotlightAllForCreateUpdateDto>({
    defaultValues: initialValue,
  });

  useEffect(() => {
    form.reset(initialValue);
  }, [initialValue, open]);

  const handleSubmit = (values: ItemSpotlightAllForCreateUpdateDto) => {
    onSave(values);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className={`sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? t('editSpotlight') : t('createSpotlight')}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? t('updateSpotlightDetailsDesc')
              : t('createSpotlightDesc')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <ItemSpotlightFields />
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={loading}>
                  {mode === 'edit' ? t('saveChanges') : t('createSpotlight')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemSpotlightDialog; 