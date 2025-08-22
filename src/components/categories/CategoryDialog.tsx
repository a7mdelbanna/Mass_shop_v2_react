import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Category, CategoryFormValues, categoryRequestSchema } from '@/types/category';
import { Company } from '@/types/company';
import { createCategory, updateCategory } from '@/services/category-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import CategoryFormFields, { FormValues } from './CategoryFormFields';
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
import { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  isNew: boolean;
  onSaveComplete: () => void;
  companies: Company[];
}

const CategoryDialog = ({
  open,
  onOpenChange,
  category,
  isNew,
  onSaveComplete,
  companies,
}: CategoryDialogProps) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { t } = useTranslation();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryRequestSchema),
    defaultValues: {
      id: category?.id || 0,
      nameEN: category?.nameEN || '',
      nameAR: category?.nameAR || '',
      noteEN: category?.noteEN || null,
      noteAR: category?.noteAR || null,
      arrange: category?.arrange || 0,
    }
  });
  // Track if form is dirty (has unsaved changes)
  const isDirty = form.formState.isDirty;

  React.useEffect(() => {
    if (category) {
      form.reset({
        id: category.id,
        nameEN: category.nameEN,
        nameAR: category.nameAR,
        noteEN: category.noteEN,
        noteAR: category.noteAR,
        arrange: category.arrange,
      });
    } else {
      form.reset({
        id: 0,
        nameEN: '',
        nameAR: '',
        noteEN: null,
        noteAR: null,
        arrange: 0,
      });
    }
  }, [category, form]);

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      if (isNew) {
        const createRequest: CreateCategoryRequest = {
          id: 0,
          nameEN: values.nameEN,
          nameAR: values.nameAR,
          noteEN: values.noteEN,
          noteAR: values.noteAR,
          arrange: values.arrange,
        };
        const { message } = await createCategory(createRequest);
        await sweetAlert.fire({
          icon: 'success',
          title: message || t('categoryCreated'),
        });
      } else if (category) {
        const updateRequest: UpdateCategoryRequest = {
          id: category.id,
          nameEN: values.nameEN,
          nameAR: values.nameAR,
          noteEN: values.noteEN,
          noteAR: values.noteAR,
          arrange: values.arrange,
        };
        const { message } = await updateCategory(updateRequest);
        await sweetAlert.fire({
          icon: 'success',
          title: message || t('categoryUpdated'),
        });
      }
      onSaveComplete();
      onOpenChange(false);
    } catch (error: any) {
      await sweetAlert.fire({
        icon: 'error',
        title: error?.message || t('failedToSaveCategory'),
      });
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      navigate('/dashboard/products/categories');
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    navigate('/dashboard/products/categories');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
          <DialogHeader className="flex-none">
            <DialogTitle>{isNew ? t('createNewCategory') : t('editCategory')}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <CategoryFormFields companies={companies} />
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
                {isNew ? t('create') : t('update')} {t('category')}
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

export default CategoryDialog; 