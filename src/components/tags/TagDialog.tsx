import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Tag } from '@/types/tag';
import { createTag, updateTag } from '@/services/tag-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import TagFormFields, { FormValues } from './TagFormFields';
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
  nameEN: z.string(),
  nameAR: z.string(),
  emoji: z.string().optional(),
  color: z.string().optional(),
});

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: Tag | null;
  isNew: boolean;
  onSaveComplete: () => void;
}

const TagDialog = ({
  open,
  onOpenChange,
  tag,
  isNew,
  onSaveComplete,
}: TagDialogProps) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEN: tag?.nameEN || '',
      nameAR: tag?.nameAR || '',
      emoji: tag?.emoji || '',
      color: tag?.color || ''
    }
  });

  // Track if form is dirty (has unsaved changes)
  const isDirty = form.formState.isDirty;

  React.useEffect(() => {
    if (tag) {
      form.reset({
        nameEN: tag.nameEN,
        nameAR: tag.nameAR,
        emoji: tag.emoji,
        color: tag.color
      });
    } else {
      form.reset({
        nameEN: '',
        nameAR: '',
        emoji: '',
        color: ''
      });
    }
  }, [tag, form]);

  const handleSubmit = async (values: FormValues) => {
    console.log('[TagDialog] Form submitted with values:', values);
    try {
      if (isNew) {
        console.log('[TagDialog] Creating new tag...');
        await createTag(values);
        console.log('[TagDialog] Tag created successfully');
        await sweetAlert.fire({
          icon: 'success',
          title: t('tagCreated'),
        });
      } else if (tag) {
        console.log('[TagDialog] Updating existing tag...');
        await updateTag(tag.id, values);
        console.log('[TagDialog] Tag updated successfully');
        await sweetAlert.fire({
          icon: 'success',
          title: t('tagUpdated'),
        });
      }
      onSaveComplete();
      navigate('/dashboard/products/tags');
    } catch (error) {
      console.error('[TagDialog] Error saving tag:', error);
      toast.error(`Failed to ${isNew ? 'create' : 'update'} tag`, {
        duration: 3000, // 3 seconds for errors
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      navigate('/dashboard/products/tags');
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    navigate('/dashboard/products/tags');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
          <DialogHeader className="flex-none">
            <DialogTitle>{isNew ? t('createNewTag') : t('editTag')}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <TagFormFields />
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
                {isNew ? t('create') : t('update')} {t('tag')}
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

export default TagDialog; 