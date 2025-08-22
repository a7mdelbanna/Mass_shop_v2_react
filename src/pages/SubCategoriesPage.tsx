import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { SubCategory } from '@/types/sub-category';
import { MainCategory } from '@/types/main-category';
import { fetchSubCategories, deleteSubCategory, getSubCategoryById } from '@/services/sub-category-service';
import { fetchMainCategories } from '@/services/main-category-service';
import SubCategoryDialog from '@/components/sub-categories/SubCategoryDialog';
import SubCategoryTable from '@/components/sub-categories/SubCategoryTable';
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

const SubCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState<SubCategory[]>([]);
  const [mainCategories, setMainCategories] = React.useState<MainCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<SubCategory | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const [subCategoriesData, mainCategoriesData] = await Promise.all([
        fetchSubCategories(),
        fetchMainCategories()
      ]);
      setCategories(subCategoriesData);
      setMainCategories(mainCategoriesData);
    } catch (error) {
      console.error('[SubCategoriesPage] Error loading data:', error);
      toast.error('Failed to load categories', {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setIsNew(true);
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const category = await getSubCategoryById(id);
      setSelectedCategory(category);
      setIsNew(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('[SubCategoriesPage] Error loading category for edit:', error);
      toast.error('Failed to load category for editing', {
        duration: 3000,
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
      await deleteSubCategory(selectedCategoryId);
      toast.success('Sub category deleted successfully');
      loadData();
    } catch (error) {
      console.error('[SubCategoriesPage] Error deleting category:', error);
      toast.error('Failed to delete sub category');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedCategoryId(null);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Sub Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your sub categories and their relationships with main categories
          </p>
        </div>
        <Button 
          onClick={handleCreate}
          className="modern-button-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sub Category
        </Button>
      </div>

      <div className="card-hover">
        <SubCategoryTable
          categories={categories}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <SubCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        isNew={isNew}
        onSaveComplete={loadData}
        mainCategories={mainCategories}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">Delete Sub Category</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the sub category
              and remove it from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="modern-button-secondary"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="modern-button-destructive"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubCategoriesPage; 