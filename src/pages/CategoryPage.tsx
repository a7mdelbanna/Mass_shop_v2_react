import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CategoryTable from '@/components/categories/CategoryTable';
import CategoryDialog from '@/components/categories/CategoryDialog';
import { Category } from '@/types/category';
import { Company } from '@/types/company';
import { fetchCategories, deleteCategory, fetchCategoryById } from '@/services/category-service';
import { fetchCompanies } from '@/services/company-service';
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

const CategoryPage = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { t } = useTranslation();

  const loadCategories = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const [categoriesData, companiesData] = await Promise.all([
        fetchCategories(),
        fetchCompanies()
      ]);
      setCategories(categoriesData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('[CategoryPage] Error loading categories:', error);
      sweetAlert.fire({
        icon: 'error',
        title: 'Failed to load categories',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreate = () => {
    setIsNew(true);
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const category = await fetchCategoryById(id);
      setSelectedCategory(category);
      setIsNew(false);
      setIsDialogOpen(true);
    } catch (error) {
      sweetAlert.fire({
        icon: 'error',
        title: 'Failed to load category for editing',
      });
    }
  };

  const handleDelete = (id: number) => {
    setSelectedCategoryId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategoryId) return;

    try {
      setIsDeleting(true);
      const message = await deleteCategory(selectedCategoryId);
      sweetAlert.fire({
        icon: 'success',
        title: message || t('categoryDeletedSuccessfully'),
      });
      await loadCategories();
    } catch (error: any) {
      console.error('[CategoryPage] Error deleting category:', error);
      sweetAlert.fire({ icon: 'error', title: error?.message || t('failedToDeleteCategoryPleaseTryAgain') });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedCategoryId(null);
    }
  };

  const handleSaveComplete = () => {
    setIsDialogOpen(false);
    loadCategories();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className='card mb-xl-8'>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">{t('categories')}</span>
            <span className="text-muted mt-1 fw-semibold fs-7">{t('manageCategories')}</span>
          </h3>

          <div className="card-toolbar" title={t('addCategoryTooltip')}>
            <Button onClick={handleCreate} className="btn btn-sm btn-light btn-active-primary text-white">
              <i className="ki-duotone ki-plus fs-2 text-white"></i>{t('addCategory')}
            </Button>
          </div>
        </div>
        <div className='card-body pt-3'>
          <div className="table-responsive">
            <CategoryTable
              categories={categories}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        isNew={isNew}
        onSaveComplete={handleSaveComplete}
        companies={companies}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCategory')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteCategoryConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCategoryId(null);
              }}
              disabled={isDeleting}
            >
              {t('cancel')}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t('deleting') : t('delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryPage; 