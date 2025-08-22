import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ItemUnit } from '@/types/item-unit';
import { createCompany, updateCompany } from '@/services/company-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
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
import { FullProduct, RetailProduct } from '@/types/product';
import { createRetailProduct, updateRetailProduct } from '@/services/product-service';
import RetailProductFormFields from './RetailProductFields';
import { MainCategory } from '@/types/main-category';
import { SubCategory } from '@/types/sub-category';
import { Tag } from '@/types/tag';
import { Notice } from '@/types/notice';

const formSchema = z.object({
  nameEN: z.string(),
  nameAR: z.string(),
  descriptionEN: z.string().optional(),
  descriptionAR: z.string().optional(),
});

interface RetailProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retailProduct: FullProduct | null;
  units: ItemUnit[];
  mainCategories: MainCategory[];
  subCategories: SubCategory[];
  tags: Tag[];
  notices: Notice[];
  isNew: boolean;
  onSaveComplete: () => void;
}

const RetailProductDialog = ({
  open,
  onOpenChange,
  retailProduct,
  units,
  mainCategories,
  subCategories,
  tags,
  notices,
  isNew,
  onSaveComplete,
}: RetailProductDialogProps) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const form = useForm<RetailProduct>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEN: retailProduct?.nameEN || '',
      nameAR: retailProduct?.nameAR || '',
      descriptionEN: retailProduct?.descriptionEN || '',
      descriptionAR: retailProduct?.descriptionAR || '',
    }
  });

  const isDirty = form.formState.isDirty;

  React.useEffect(() => {
    if (retailProduct) {
      form.reset({
        nameEN: retailProduct.nameEN,
        nameAR: retailProduct.nameAR,
        descriptionEN: retailProduct.descriptionEN,
        descriptionAR: retailProduct.descriptionAR,
      });
    } else {
      form.reset({
        nameEN: '',
        nameAR: '',
        descriptionEN: '',
        descriptionAR: '',
      });
    }
  }, [retailProduct, form]);

  const handleSubmit = async (values: RetailProduct) => {
    try {
      if (isNew) {
        await createRetailProduct(values);
        toast.success('Company created successfully', { duration: 2000 });
      } else if (retailProduct) {
        await updateRetailProduct(retailProduct.id, values);
        toast.success('Company updated successfully', { duration: 2000 });
      }
      onSaveComplete();
      navigate('/dashboard/products/companies');
    } catch (error) {
      toast.error(`Failed to ${isNew ? 'create' : 'update'} company`, { duration: 3000 });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      navigate('/dashboard/companies');
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    navigate('/dashboard/companies');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Create New Product' : 'Edit Product'}</DialogTitle>
            <DialogDescription>
              {isNew
                ? 'Fill out the form below to create a new product.'
                : 'Update the details of your product below.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <RetailProductFormFields />
              </form>
            </Form>
          </div>

          <div className="flex-none border-t pt-4 mt-4 px-6">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
                {isNew ? 'Create' : 'Update'} Product
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
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RetailProductDialog;
