import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle , DialogDescription} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Company } from '@/types/company';
import { createCompany, updateCompany } from '@/services/company-service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import CompanyFormFields, { FormValues } from './OrderFields';

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

const formSchema = z.object({
  nameEN: z.string().min(2, { message: "English name must be at least 2 characters" }),
  nameAR: z.string().min(2, { message: "Arabic name must be at least 2 characters" }),
  noteEN: z.string().optional(),
  noteAR: z.string().optional(),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: company?.nameEn || '',
      nameAr: company?.nameAr || '',
      noteEN: company?.noteEN || '',
      noteAR: company?.noteAR || '',
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
      });
    } else {
      form.reset({
        nameEn: '',
        nameAr: '',
        noteEN: '',
        noteAR: '',
      });
    }
  }, [company, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isNew) {
        await createCompany(values);
        toast.success('Company created successfully', { duration: 2000 });
      } else if (company) {
        await updateCompany(company.id, values);
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
            <DialogTitle>{isNew ? 'Create New Company' : 'Edit Company'}</DialogTitle>
            <DialogDescription>
              {isNew
                ? 'Fill out the form below to create a new company.'
                : 'Update the details of your company below.'}
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
                Cancel
              </Button>
              <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
                {isNew ? 'Create' : 'Update'} Company
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

export default CompanyDialog;
