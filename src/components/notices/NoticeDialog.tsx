import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Notice } from '@/types/notice';
import { createNotice, updateNotice } from '@/services/notice-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import NoticeFormValues, { FormValues } from './NoticeFormFields';
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
import NoticeFormFields from './NoticeFormFields';
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';

const formSchema = z.object({
  nameEN: z.string(),
  nameAR: z.string(),
  emoji: z.string().optional(),
  color: z.string().optional(),
});

interface NoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: Notice | null;
  isNew: boolean;
  onSaveComplete: () => void;
}

const NoticeDialog = ({
  open,
  onOpenChange,
  notice,
  isNew,
  onSaveComplete,
}: NoticeDialogProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEN: notice?.nameEN || '',
      nameAR: notice?.nameAR || '',
      emoji: notice?.emoji || '',
      color: notice?.color || ''
    }
  });

  // Track if form is dirty (has unsaved changes)
  const isDirty = form.formState.isDirty;

  React.useEffect(() => {
    if (notice) {
      form.reset({
        nameEN: notice.nameEN,
        nameAR: notice.nameAR,
        emoji: notice.emoji,
        color: notice.color
      });
    } else {
      form.reset({
        nameEN: '',
        nameAR: '',
        emoji: '',
        color: ''
      });
    }
  }, [notice, form]);

  const handleSubmit = async (values: FormValues) => {
    console.log('[NoticeDialog] Form submitted with values:', values);
    try {
      if (isNew) {
        console.log('[NoticeDialog] Creating new notice...');
        await createNotice(values);
        console.log('[NoticeDialog] Notice created successfully');
        await sweetAlert.fire({
          icon: 'success',
          title: t('noticeCreated'),
        });
      } else if (notice) {
        console.log('[NoticeDialog] Updating existing notice...');
        await updateNotice(notice.id, values);
        console.log('[NoticeDialog] Notice updated successfully');
        await sweetAlert.fire({
          icon: 'success',
          title: t('noticeUpdated'),
        });
      }
      onSaveComplete();
      navigate('/dashboard/products/notices');
    } catch (error) {
      console.error('[NoticeDialog] Error saving Notice:', error);
      toast.error(t(isNew ? 'failedToCreateNotice' : 'failedToUpdateNotice'), {
        duration: 3000,
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      navigate('/dashboard/products/notices');
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    navigate('/dashboard/products/notices');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
          <DialogHeader className="flex-none">
            <DialogTitle>{isNew ? t('createNewNotice') : t('editNotice')}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <NoticeFormFields />
              </form>
            </Form>
          </div>

          <div className="flex-none border-t pt-4 mt-4 px-6">
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
              >
                {isNew ? t('create') : t('update')}
              </Button>
            </div>
          </div>
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

export default NoticeDialog; 