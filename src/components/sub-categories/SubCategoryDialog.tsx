import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { SubCategory, SubCategoryFormValues, subCategoryRequestSchema } from '@/types/sub-category';
import { MainCategory } from '@/types/main-category';
import { createSubCategory, updateSubCategory } from '@/services/sub-category-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import SubCategoryFormFields, { FormValues } from './SubCategoryFormFields';
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
import { CreateSubCategoryRequest, UpdateSubCategoryRequest } from '@/types/sub-category';

const formSchema = z.object({
  nameEN: z.string().min(2, { message: "English name must be at least 2 characters" }),
  nameAR: z.string().min(2, { message: "Arabic name must be at least 2 characters" }),
  noteEN: z.string().optional(),
  noteAR: z.string().optional(),
  arrange: z.number().min(0, { message: "Display order must be 0 or greater" }),
  mainCategoryId: z.number().min(1, { message: "Please select a main category" })
});

interface SubCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: SubCategory | null;
  isNew: boolean;
  onSaveComplete: () => void;
  mainCategories: MainCategory[];
}

const SubCategoryDialog = ({
  open,
  onOpenChange,
  category,
  isNew,
  onSaveComplete,
  mainCategories,
}: SubCategoryDialogProps) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategoryRequestSchema),
    defaultValues: {
      id: category?.id || 0,
      nameEN: category?.nameEN || '',
      nameAR: category?.nameAR || '',
      noteEN: category?.noteEN || null,
      noteAR: category?.noteAR || null,
      arrange: category?.arrange || 0,
      mainCategoryId: category?.mainCategoryId || 0
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
        mainCategoryId: category.mainCategoryId
      });
    } else {
      form.reset({
        id: 0,
        nameEN: '',
        nameAR: '',
        noteEN: null,
        noteAR: null,
        arrange: 0,
        mainCategoryId: 0
      });
    }
  }, [category, form]);

  const handleSubmit = async (values: SubCategoryFormValues) => {
    try {
      if (isNew) {
        const createRequest: CreateSubCategoryRequest = {
          id: 0,
          nameEN: values.nameEN,
          nameAR: values.nameAR,
          noteEN: values.noteEN,
          noteAR: values.noteAR,
          arrange: values.arrange,
          mainCategoryId: values.mainCategoryId
        };
        await createSubCategory(createRequest);
        toast.success('Sub category created successfully');
      } else if (category) {
        const updateRequest: UpdateSubCategoryRequest = {
          id: category.id,
          nameEN: values.nameEN,
          nameAR: values.nameAR,
          noteEN: values.noteEN,
          noteAR: values.noteAR,
          arrange: values.arrange,
          mainCategoryId: values.mainCategoryId
        };
        await updateSubCategory(category.id, updateRequest);
        toast.success('Sub category updated successfully');
      }
      onSaveComplete();
      navigate('/dashboard/products/categories/sub');
    } catch (error) {
      console.error('[SubCategoryDialog] Error saving sub category:', error);
      toast.error(`Failed to ${isNew ? 'create' : 'update'} sub category`);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      navigate('/dashboard/products/categories/sub');
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    navigate('/dashboard/products/categories/sub');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
          <DialogHeader className="flex-none">
            <DialogTitle>{isNew ? 'Create New Sub Category' : 'Edit Sub Category'}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <SubCategoryFormFields mainCategories={mainCategories} />
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
                Cancel
              </Button>
              <Button 
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
              >
                {isNew ? 'Create' : 'Update'} Sub Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Stay
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SubCategoryDialog; 