import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { ItemOfferForCreateUpdateDto } from '@/types/offer';
import ItemOfferFields from './ItemOfferFields';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ItemOfferDialogProps {
  open: boolean;
  onClose: () => void;
  initialValue: ItemOfferForCreateUpdateDto;
  onSave: (value: ItemOfferForCreateUpdateDto) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const ItemOfferDialog: React.FC<ItemOfferDialogProps> = ({
  open,
  onClose,
  initialValue,
  onSave,
  loading,
  mode = 'create',
}) => {
  const { t } = useTranslation();
  const form = useForm<ItemOfferForCreateUpdateDto>({
    defaultValues: initialValue,
  });

  useEffect(() => {
    form.reset(initialValue);
  }, [initialValue, open]);

  const handleSubmit = (values: ItemOfferForCreateUpdateDto) => {
    const updatedVal = {...values , no:values.id};
    onSave(updatedVal);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? t('editOffer') : t('createOffer')}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? t('updateOfferDetailsDesc')
              : t('createOfferDesc')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <ItemOfferFields />
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={loading}>
                  {mode === 'edit' ? t('saveChanges') : t('createOffer')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemOfferDialog; 