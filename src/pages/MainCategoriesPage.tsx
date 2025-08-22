import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import MainCategoryTable from '@/components/main-categories/MainCategoryTable';
import MainCategoryDialog from '@/components/main-categories/MainCategoryDialog';
import { MainCategory } from '@/types/main-category';
import { fetchMainCategories, deleteMainCategory, getMainCategoryById } from '@/services/main-category-service';
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

const MainCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState<MainCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<MainCategory | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { t } = useTranslation();

  const loadCategories = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchMainCategories();
      setCategories(data);
    } catch (error) {
      console.error('[MainCategoriesPage] Error loading categories:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToLoadCategories') });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

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
      const category = await getMainCategoryById(id);
      setSelectedCategory(category);
      setIsNew(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('[MainCategoriesPage] Error loading category for edit:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToLoadCategoryForEditing') });
    }
  };

  const handleDelete = (id: number) => {
    console.log('[MainCategoriesPage] Initiating delete for category:', id);
    setSelectedCategoryId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    console.log('[MainCategoriesPage] Confirming delete for category:', selectedCategoryId);
    if (!selectedCategoryId) {
      console.error('[MainCategoriesPage] No category ID selected for deletion');
      return;
    }

    try {
      setIsDeleting(true);
      console.log('[MainCategoriesPage] Calling deleteMainCategory service with ID:', selectedCategoryId);
      await deleteMainCategory(selectedCategoryId);
      console.log('[MainCategoriesPage] Delete successful');
      sweetAlert.fire({ icon: 'success', title: t('categoryDeletedSuccessfully') });
      await loadCategories();
    } catch (error) {
      console.error('[MainCategoriesPage] Error in confirmDelete:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToDeleteCategoryPleaseTryAgain') });
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
            <span className="card-label fw-bold fs-3 mb-1">{t('mainCategories')}</span>
            <span className="text-muted mt-1 fw-semibold fs-7">{t('manageMainCategories')}</span>
          </h3>

          <div className="card-toolbar" title={t('addCategoryTooltip')}>
            <Button onClick={handleCreate} className="btn btn-sm btn-light btn-active-primary text-white">
              <i className="ki-duotone ki-plus fs-2 text-white"></i>{t('addCategory')}
            </Button>
          </div>
        </div>
        <div className='card-body pt-3'>
          <div className="table-responsive">
            <MainCategoryTable
              categories={categories}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>



      <MainCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        isNew={isNew}
        onSaveComplete={handleSaveComplete}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setSelectedCategoryId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
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
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MainCategoriesPage; 