import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ItemUnit, ItemUnitFormValues, CreateItemUnitRequest, UpdateItemUnitRequest, itemUnitRequestSchema } from '@/types/item-unit';
import { createItemUnit, updateItemUnit } from '@/services/item-unit-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import ItemUnitFormFields, { FormValues } from './ItemUnitFormFields';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';

const formSchema = z.object({
  nameEN: z.string().min(2, { message: "English name must be at least 2 characters" }),
  nameAR: z.string().min(2, { message: "Arabic name must be at least 2 characters" }),
  amount: z.number().min(0, { message: "Amount must be 0 or greater" })
});

interface ItemUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: ItemUnit | null;
  isNew: boolean;
  onSaveComplete: () => void;
}

const ItemUnitDialog = ({
  open,
  onOpenChange,
  unit,
  isNew,
  onSaveComplete,
}: ItemUnitDialogProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const form = useForm<ItemUnitFormValues>({
    resolver: zodResolver(itemUnitRequestSchema),
    defaultValues: {
      id: unit?.id || 0,
      nameEN: unit?.nameEN || '',
      nameAR: unit?.nameAR || '',
      amount: unit?.amount || 0
    }
  });

  // Track if form is dirty (has unsaved changes)
  const isDirty = form.formState.isDirty;

  React.useEffect(() => {
    if (unit) {
      form.reset({
        id: unit.id,
        nameEN: unit.nameEN,
        nameAR: unit.nameAR,
        amount: unit.amount
      });
    } else {
      form.reset({
        id: 0,
        nameEN: '',
        nameAR: '',
        amount: 0
      });
    }
  }, [unit, form]);

  const handleSubmit = async (values: ItemUnitFormValues) => {
    try {
      if (isNew) {
        const createRequest: CreateItemUnitRequest = {
          id: 0,
          nameEN: values.nameEN,
          nameAR: values.nameAR,
          amount: values.amount
        };
        const response = await createItemUnit(createRequest);
        await sweetAlert.fire({
          icon: 'success',
          title: response.result.message,
        });
      } else if (unit) {
        const updateRequest: UpdateItemUnitRequest = {
          id: unit.id,
          nameEN: values.nameEN,
          nameAR: values.nameAR,
          amount: values.amount
        };
        const response = await updateItemUnit(unit.id, updateRequest);
        await sweetAlert.fire({
          icon: 'success',
          title: response.result.message,
        });      }
      onSaveComplete();
      navigate('/dashboard/products/item-units');
    } catch (error) {
      await sweetAlert.fire({
        icon: 'error',
        title: `Failed to ${isNew ? 'create' : 'update'} company`,
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(false);
    } else {
      navigate('/dashboard/products/item-units');
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    navigate('/dashboard/products/item-units');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isNew ? t('createNewItemUnit') : t('editItemUnit')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <ItemUnitFormFields />
              <div className="flex justify-end gap-2">
                <Button type="submit">
                  {isNew ? t('create') : t('update')} {t('itemUnit')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('unsavedChanges')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('unsavedChangesDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              {t('stay')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              {t('leave')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ItemUnitDialog; 