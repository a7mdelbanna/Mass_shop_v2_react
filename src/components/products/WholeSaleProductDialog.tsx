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
import { ExpirationType, FullProduct, RetailProduct, WholeSaleProduct } from '@/types/product';
import { createRetailProduct, createWholeSaleProduct, updateRetailProduct, updateWholeSaleProduct, addTagsToItem, addNoticesToItem } from '@/services/product-service';
import WholeSaleProductFormFields from './WholeSaleProductFields';
import { Flavour } from '@/services/flavour-service';
import { Category } from '@/types/category';
import { ItemUnit } from '@/types/item-unit';
import { Tag } from '@/types/tag';
import { Notice } from '@/types/notice';
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';

const formSchema = z.object({
  nameEN: z.string(),
  nameAR: z.string(),
  descriptionEN: z.string().nullable().optional(),
  descriptionAR: z.string().nullable().optional(),
  bigUnitId: z.number().nullable().optional(),
  bigUnitPrice: z.number().nullable().optional(),
  bigUnitSpecialPrice: z.number().nullable().optional(),
  smallUnitId: z.number().nullable().optional(),
  smallUnitPrice: z.number().nullable().optional(),
  smallUnitSpecialPrice: z.number().nullable().optional(),
  taxPrcent: z.number().min(0),
  vatPrcent: z.number().min(0),
  per: z.number().nullable().optional(),
  calories: z.number().nullable().optional(),
  protein: z.number().nullable().optional(),
  fat: z.number().nullable().optional(),
  carbohydrates: z.number().nullable().optional(),
  expiration: z.number().min(0),
  expirationType: z.nativeEnum(ExpirationType).optional().nullable(),
  isSoldByWeight: z.boolean(),
  isSellByCustomValue: z.boolean(),
  customValue: z.preprocess((val) => val === '' ? null : val, z.number().nullable().optional()),
  isMaximumAmountForUser: z.boolean().optional(),
  maximumAmountForUser: z.preprocess((val) => val === '' ? null : val, z.number().nullable().optional()),
  companyId: z.number().nullable().optional(),
  categoryId: z.number().nullable().refine(val => val !== null, { message: 'Category is required' }),
  tagIds: z.array(z.number()).optional(),
  noticeIds: z.array(z.number()).optional(),
  flavourIds: z.array(z.number()).optional(),
});

interface WholeSaleProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wholeSaleProduct: FullProduct | null;
  units: ItemUnit[];
  categories: Category[];
  companies: Company[];
  tags: Tag[];
  notices: Notice[];
  isNew: boolean;
  onSaveComplete: () => void;
}

// Helper to convert string to ExpirationType enum value
const expirationTypeStringToEnum = (val: string | number | null | undefined): ExpirationType | null => {
  if (val == null) return null;
  if (typeof val === 'number') return val as ExpirationType;
  switch (val) {
    case 'Day': return ExpirationType.Day;
    case 'Week': return ExpirationType.Week;
    case 'Month': return ExpirationType.Month;
    case 'Year': return ExpirationType.Year;
    default: return null;
  }
};

const WholeSaleProductDialog = ({
  open,
  onOpenChange,
  wholeSaleProduct,
  units,
  categories,
  companies,
  tags,
  notices,
  isNew,
  onSaveComplete,
}: WholeSaleProductDialogProps) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { t } = useTranslation();

  const form = useForm<WholeSaleProduct>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEN: wholeSaleProduct?.nameEN || '',
      nameAR: wholeSaleProduct?.nameAR || '',
      descriptionEN: wholeSaleProduct?.descriptionEN || '',
      descriptionAR: wholeSaleProduct?.descriptionAR || '',
      bigUnitId: wholeSaleProduct?.bigUnit?.id ?? null,
      bigUnitPrice: wholeSaleProduct?.bigUnitPrice ?? null,
      bigUnitSpecialPrice: wholeSaleProduct?.bigUnitSpecialPrice ?? null,
      smallUnitId: wholeSaleProduct?.smallUnit?.id ?? null,
      smallUnitPrice: wholeSaleProduct?.smallUnitPrice ?? null,
      smallUnitSpecialPrice: wholeSaleProduct?.smallUnitSpecialPrice ?? null,
      taxPrcent: wholeSaleProduct?.taxPrcent ?? 0,
      vatPrcent: wholeSaleProduct?.vatPrcent ?? 0,
      per: wholeSaleProduct?.per != null ? Number(wholeSaleProduct.per) : null,
      calories: wholeSaleProduct?.calories ?? null,
      protein: wholeSaleProduct?.protein ?? null,
      fat: wholeSaleProduct?.fat ?? null,
      carbohydrates: wholeSaleProduct?.carbohydrates ?? null,
      expiration: wholeSaleProduct?.expiration ?? 0,
      expirationType: expirationTypeStringToEnum(wholeSaleProduct?.expirationType) ?? null,
      isSoldByWeight: wholeSaleProduct?.isSoldByWeight ?? false,
      isSellByCustomValue: wholeSaleProduct?.isSellByCustomValue ?? false,
      customValue: wholeSaleProduct?.customValue ?? null,
      isMaximumAmountForUser: wholeSaleProduct?.isMaximumAmountForUser ?? false,
      maximumAmountForUser: wholeSaleProduct?.maximumAmountForUser ?? null,
      companyId: wholeSaleProduct?.company?.id ?? null,
      categoryId: wholeSaleProduct?.category?.id ?? null,
      tagIds: wholeSaleProduct?.tagIds ?? wholeSaleProduct?.tags?.map(tag => tag.id) ?? [],
      noticeIds: wholeSaleProduct?.noticeIds ?? wholeSaleProduct?.notices?.map(notice => notice.id) ?? [],
      flavourIds: wholeSaleProduct?.flavourIds ?? wholeSaleProduct?.flavours?.map(f => f.id) ?? [],
    }
  });
  // Flavour selection state
  const [selectedFlavours, setSelectedFlavours] = React.useState<Flavour[]>(wholeSaleProduct?.flavours ?? []);


  const isDirty = form.formState.isDirty;

  React.useEffect(() => {
    if (wholeSaleProduct) {
      form.reset({
        nameEN: wholeSaleProduct.nameEN,
        nameAR: wholeSaleProduct.nameAR,
        descriptionEN: wholeSaleProduct.descriptionEN ?? '',
        descriptionAR: wholeSaleProduct.descriptionAR ?? '',
        bigUnitId: wholeSaleProduct.bigUnit?.id ?? null,
        bigUnitPrice: wholeSaleProduct.bigUnitPrice ?? null,
        bigUnitSpecialPrice: wholeSaleProduct.bigUnitSpecialPrice ?? null,
        smallUnitId: wholeSaleProduct.smallUnit?.id ?? null,
        smallUnitPrice: wholeSaleProduct.smallUnitPrice ?? null,
        smallUnitSpecialPrice: wholeSaleProduct.smallUnitSpecialPrice ?? null,
        taxPrcent: wholeSaleProduct.taxPrcent ?? 0,
        vatPrcent: wholeSaleProduct.vatPrcent ?? 0,
        per: wholeSaleProduct.per != null ? Number(wholeSaleProduct.per) : null,
        calories: wholeSaleProduct.calories ?? null,
        protein: wholeSaleProduct.protein ?? null,
        fat: wholeSaleProduct.fat ?? null,
        carbohydrates: wholeSaleProduct.carbohydrates ?? null,
        expiration: wholeSaleProduct.expiration ?? 0,
        expirationType: expirationTypeStringToEnum(wholeSaleProduct.expirationType) ?? null,
        isSoldByWeight: wholeSaleProduct.isSoldByWeight ?? false,
        isSellByCustomValue: wholeSaleProduct.isSellByCustomValue ?? false,
        customValue: wholeSaleProduct.customValue ?? null,
        isMaximumAmountForUser: wholeSaleProduct.isMaximumAmountForUser ?? false,
        maximumAmountForUser: wholeSaleProduct.maximumAmountForUser ?? null,
        companyId: wholeSaleProduct.company?.id ?? null,
        categoryId: wholeSaleProduct.category?.id ?? null,
        tagIds: wholeSaleProduct.tagIds ?? wholeSaleProduct.tags?.map(tag => tag.id) ?? [],
        noticeIds: wholeSaleProduct.noticeIds ?? wholeSaleProduct.notices?.map(notice => notice.id) ?? [],
        flavourIds: wholeSaleProduct.flavourIds ?? wholeSaleProduct.flavours?.map(f => f.id) ?? [],
      });
      setSelectedFlavours(wholeSaleProduct.flavours ?? []);
    } else {
      form.reset({
        nameEN: '',
        nameAR: '',
        descriptionEN: '',
        descriptionAR: '',
        bigUnitId: null,
        bigUnitPrice: null,
        bigUnitSpecialPrice: null,
        smallUnitId: null,
        smallUnitPrice: null,
        smallUnitSpecialPrice: null,
        taxPrcent: 0,
        vatPrcent: 0,
        per: null,
        calories: null,
        protein: null,
        fat: null,
        carbohydrates: null,
        expiration: 0,
        expirationType: null,
        isSoldByWeight: false,
        isSellByCustomValue: false,
        customValue: null,
        isMaximumAmountForUser: false,
        maximumAmountForUser: null,
        companyId: null,
        categoryId: null,
        tagIds: [],
        noticeIds: [],
        flavourIds: [],
      });
      setSelectedFlavours([]);
    }
  }, [wholeSaleProduct, form]);

  const handleSubmit = async (values: WholeSaleProduct) => {
    // Always sync selectedFlavours to flavourIds before submit
    const flavourIds = selectedFlavours.map(f => f.id);
    const submitValues = { ...values, flavourIds };
    console.log('Submitting product data:', submitValues); // Debug log
    try {
      if (isNew) {
        // Remove id and fields with null/undefined values, but keep tagIds, noticeIds, flavourIds
        const { id, ...productData } = submitValues;
        const cleanedProductData = Object.fromEntries(Object.entries(productData).filter(([key, v]) => (v !== null && v !== undefined) || key === 'tagIds' || key === 'noticeIds' || key === 'flavourIds'));
        console.log('Cleaned product data:', cleanedProductData); // Debug log
        const response = await createWholeSaleProduct(cleanedProductData as unknown as WholeSaleProduct);
        await sweetAlert.fire({
          icon: 'success',
          title: response.result.message,
        });
        // Reset form after successful creation
        form.reset({
          nameEN: '',
          nameAR: '',
          descriptionEN: '',
          descriptionAR: '',
          bigUnitId: null,
          bigUnitPrice: null,
          bigUnitSpecialPrice: null,
          smallUnitId: null,
          smallUnitPrice: null,
          smallUnitSpecialPrice: null,
          taxPrcent: 0,
          vatPrcent: 0,
          per: null,
          calories: null,
          protein: null,
          fat: null,
          carbohydrates: null,
          expiration: 0,
          expirationType: null,
          isSoldByWeight: false,
          isSellByCustomValue: false,
          customValue: null,
          isMaximumAmountForUser: false,
          maximumAmountForUser: null,
          companyId: null,
          categoryId: null,
          tagIds: [],
          noticeIds: [],
          flavourIds: [],
        });
        setSelectedFlavours([]);
      } else if (wholeSaleProduct) {
        // Clean the update payload as well
        const { id, ...productData } = submitValues;
        const cleanedProductData = Object.fromEntries(Object.entries(productData).filter(([key, v]) => (v !== null && v !== undefined) || key === 'tagIds' || key === 'noticeIds' || key === 'flavourIds'));
        console.log('Cleaned product data:', cleanedProductData); // Debug log
        const response = await updateWholeSaleProduct(wholeSaleProduct.id, cleanedProductData as unknown as WholeSaleProduct);
        await sweetAlert.fire({
          icon: 'success',
          title: response.result.message,
        });
      }
      onSaveComplete();
      navigate('/dashboard/products');
    } catch (error) {
      await sweetAlert.fire({
        icon: 'error',
        title: `Failed to ${isNew ? 'create' : 'update'} company`,
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    navigate('/dashboard/products');
  };

  // Ensure categories always includes the current product's category when editing
  let categoriesWithCurrent = categories;
  if (
    wholeSaleProduct?.category &&
    !categories.some(cat => cat.id === wholeSaleProduct.category.id)
  ) {
    categoriesWithCurrent = [...categories, wholeSaleProduct.category];
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
          <DialogHeader>
            <DialogTitle>{isNew ? t('createNewProduct') : t('editProduct')}</DialogTitle>
            <DialogDescription>
              {isNew
                ? t('createProductDesc')
                : t('editProductDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <WholeSaleProductFormFields
                  units={units}
                  categories={categoriesWithCurrent}
                  companies={companies}
                  tags={tags}
                  notices={notices}
                  selectedFlavours={selectedFlavours}
                  setSelectedFlavours={setSelectedFlavours}
                />
              </form>
            </Form>
          </div>
          <div className="flex-none border-t pt-4 mt-4 px-6">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                {t('cancel')}
              </Button>
              <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
                {isNew ? t('create') : t('update')} {t('product')}
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
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>{t('stay')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>{t('leave')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WholeSaleProductDialog;
