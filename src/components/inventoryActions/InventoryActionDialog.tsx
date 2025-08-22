import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Company } from '@/types/company';
import { createCompany, updateCompany } from '@/services/company-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import CompanyFormFields, { FormValues } from './InventoryActionFields';
import { useTranslation } from 'react-i18next';
import { makeInventoryAction } from '@/services/inventory-action-service';
import Swal from 'sweetalert2';

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
import InventoryActionFormFields from './InventoryActionFields';
import { sweetAlert } from '@/utils/alert';

const formSchema = z.object({
  itemId: z.number().min(1, "Item ID is required"),
  stockVal: z.number().min(1, "Stock value must be positive"),
  action: z.number().refine(val => [1, 2, 3].includes(val), {
    message: "Invalid action type"
  }),
});

interface InventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveComplete: () => void;
}
const InventoryDialog = ({ open, onOpenChange, onSaveComplete }: InventoryDialogProps) => {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemId: 0,
      stockVal: 0,
      action: 1
    }
  });

  const handleSubmit = async (values: any) => {
    try {
      const response = await makeInventoryAction(values);
      
      // Show success SweetAlert
      await sweetAlert.fire({
        icon: 'success',
        title: response.result.message || t('inventoryActionCompleted'),
      });

      // Reset form
      form.reset();

      // Close dialog
      onOpenChange(false);

      // Reload data
      onSaveComplete();
      
    } catch (error) {
      // Show error SweetAlert
      await sweetAlert.fire({
        icon: 'error',
        title: t('error'),
      
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('inventoryAction')}</DialogTitle>
          <DialogDescription>{t('inventoryActionDialogDesc')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <InventoryActionFormFields />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
              <Button type="submit">{t('save')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryDialog;