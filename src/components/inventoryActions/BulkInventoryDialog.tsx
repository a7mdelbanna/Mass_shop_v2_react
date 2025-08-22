import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { applyBulkInventoryAction } from '@/services/inventory-action-service';
import BulkInventoryActionFields, { BulkFormValues } from './BulkInventoryActionFields';
import { useTranslation } from 'react-i18next';

const bulkActionSchema = z.object({
  stockVal: z.number().min(0, 'Stock value must be positive'),
  action: z.number().min(1).max(3),
});

interface BulkInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveComplete: () => void;
}

const BulkInventoryDialog: React.FC<BulkInventoryDialogProps> = ({
  open,
  onOpenChange,
  onSaveComplete,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BulkFormValues>({
    resolver: zodResolver(bulkActionSchema),
    defaultValues: {
      stockVal: 0,
      action: 1,
    },
  });

  const handleSubmit = async (data: BulkFormValues) => {
    try {
      setIsSubmitting(true);
      await applyBulkInventoryAction({
        stockVal: data.stockVal,
        action: data.action,
      });
      
      onSaveComplete();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('[BulkInventoryDialog] Error applying bulk action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ki-duotone ki-bucket fs-2 text-primary">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
            </i>
            {t('applyBulkInventoryAction')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <BulkInventoryActionFields />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <i className="ki-duotone ki-arrows-circle fs-5 me-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                    {t('applying')}
                  </>
                ) : (
                  <>
                    <i className="ki-duotone ki-check fs-5 me-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                    {t('applyToAllItems')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkInventoryDialog;
