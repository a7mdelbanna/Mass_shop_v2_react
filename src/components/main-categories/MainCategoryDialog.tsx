import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MainCategory } from '@/types/main-category';
import { createMainCategory, updateMainCategory } from '@/services/main-category-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import MainCategoryFormFields, { FormValues } from './MainCategoryFormFields';
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

const formSchema = z.object({
  nameEN: z.string().min(2, { message: "English name must be at least 2 characters" }),
  nameAR: z.string().min(2, { message: "Arabic name must be at least 2 characters" }),
  noteEN: z.string().optional(),
  noteAR: z.string().optional(),
  arrange: z.number().min(0, { message: "Display order must be 0 or greater" })
});

interface MainCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: MainCategory | null;
  isNew: boolean;
  onSaveComplete: () => void;
}

const MainCategoryDialog = ({
  open,
  onOpenChange,
  category,
  isNew,
  onSaveComplete,
}: MainCategoryDialogProps) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEN: category?.nameEN || '',
      nameAR: category?.nameAR || '',
      noteEN: category?.noteEN || '',
      noteAR: category?.noteAR || '',
      arrange: category?.arrange || 0
    }
  });

  // Track if form is dirty (has unsaved changes)
  const isDirty = form.formState.isDirty;

  React.useEffect(() => {
    if (category) {
      form.reset({
        nameEN: category.nameEN,
        nameAR: category.nameAR,
        noteEN: category.noteEN,
        noteAR: category.noteAR,
        arrange: category.arrange
      });
    } else {
      form.reset({
        nameEN: '',
        nameAR: '',
        noteEN: '',
        noteAR: '',
        arrange: 0
      });
    }
  }, [category, form]);

  const handleSubmit = async (values: FormValues) => {
    console.log('[MainCategoryDialog] Form submitted with values:', values);
    try {
      if (isNew) {
        console.log('[MainCategoryDialog] Creating new main category...');
        await createMainCategory(values);
        console.log('[MainCategoryDialog] Main category created successfully');
        toast.success('Main category created successfully', {
          duration: 2000, // 2 seconds
        });
      } else if (category) {
        console.log('[MainCategoryDialog] Updating existing main category...');
        await updateMainCategory(category.id, values);
        console.log('[MainCategoryDialog] Main category updated successfully');
        toast.success('Main category updated successfully', {
          duration: 2000, // 2 seconds
        });
      }
      onSaveComplete();
      navigate('/dashboard/products/categories/main');
    } catch (error) {
      console.error('[MainCategoryDialog] Error saving main category:', error);
      toast.error(`Failed to ${isNew ? 'create' : 'update'} main category`, {
        duration: 3000, // 3 seconds for errors
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      navigate('/dashboard/products/categories/main');
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    navigate('/dashboard/products/categories/main');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
          <DialogHeader className="flex-none">
            <DialogTitle>{isNew ? t('createNewMainCategory') : t('editMainCategory')}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <MainCategoryFormFields />
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
                {isNew ? t('create') : t('update')} {t('mainCategory')}
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

export default MainCategoryDialog; 