import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Company } from '@/types/company';
import { createCompany, updateCompany } from '@/services/company-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import CompanyFormFields, { FormValues } from './CompanyFields';
import { useTranslation } from 'react-i18next';

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
import { sweetAlert } from '@/utils/alert';

// Update schema to include categoryIds
const formSchema = z.object({
  nameEn: z.string().optional(),
  nameAr: z.string().optional(),
  noteEN: z.string().optional(),
  noteAR: z.string().optional(),
  categoryIds: z.array(z.number()).optional().default([]),
});

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  isNew: boolean;
  onSaveComplete: () => void;
}

const CompanyDialog = ({
  open,
  onOpenChange,
  company,
  isNew,
  onSaveComplete,
}: CompanyDialogProps) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: company?.nameEn || '',
      nameAr: company?.nameAr || '',
      noteEN: company?.noteEN || '',
      noteAR: company?.noteAR || '',
      categoryIds: company?.categories?.map(c => c.id) || [],
    }
  });

  const isDirty = form.formState.isDirty;

  React.useEffect(() => {
    if (company) {
      form.reset({
        nameEn: company.nameEn,
        nameAr: company.nameAr,
        noteEN: company.noteEN,
        noteAR: company.noteAR,
        categoryIds: company.categories?.map(c => c.id) || [],
      });
    } else {
      form.reset({
        nameEn: '',
        nameAr: '',
        noteEN: '',
        noteAR: '',
        categoryIds: [],
      });
    }
  }, [company, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isNew) {
        const response = await createCompany(values);
        await sweetAlert.fire({
          icon: 'success',
          title: response.result.message,
        });
      } else if (company) {
        const response = await updateCompany(company.id, values);
        await sweetAlert.fire({
          icon: 'success',
          title: response.result.message,
        });
      }
      onSaveComplete();
      navigate('/dashboard/products/companies');
    } catch (error) {
      await sweetAlert.fire({
        icon: 'error',
        title: `Failed to ${isNew ? 'create' : 'update'} company`,
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      setShowConfirmDialog(false);
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
          <DialogHeader>
            <DialogTitle>{isNew ? t('createNewCompany') : t('editCompany')}</DialogTitle>
            <DialogDescription>
              {isNew
                ? t('createCompanyDesc')
                : t('editCompanyDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <CompanyFormFields />
              </form>
            </Form>
          </div>

          <div className="flex-none border-t pt-4 mt-4 px-6">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                {t('cancel')}
              </Button>
              <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
                {isNew ? t('create') : t('update')} {t('company')}
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

export default CompanyDialog;
