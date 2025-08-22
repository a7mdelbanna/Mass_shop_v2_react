import React from 'react';
import { Category } from '@/types/category';
import { BaseTable, TableColumn, formatDate } from '@/components/ui/base-table';
import { useTranslation } from 'react-i18next';
import CategoryImageUploadDialog from './CategoryImageUploadDialog';
import { getImageUrl } from '@/lib/utils';

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
  const columns: TableColumn<Category>[] = [
    {
      key: 'category',
      header: t('category'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (category) => (
        <div className={`d-flex align-items-center`}>
          <div className="symbol symbol-50px me-5">
            <img src={category.categoryImageURL} alt="" />
          </div>
          <div className="d-flex flex-column">
            <a href="#" className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
              {category.nameEN}
            </a>

            <span className="text-gray-500 fw-semibold d-block fs-8">
              {t('id')}: #{category.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'nameEN',
      header: t('nameEN'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (category) => <span className="font-medium">{category.nameEN}</span>
    },
    {
      key: 'nameAR',
      header: t('nameAR'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (category) => category.nameAR,
    },
    {
      key: 'noteEN',
      header: t('noteEN'),
      cell: (category) => category.noteEN,
      className: isRTL ? 'text-right' : 'text-left',
    },
    {
      key: 'noteAR',
      header: t('noteAR'),
      cell: (category) => category.noteAR,
      className: isRTL ? 'text-right' : 'text-left',
    },

   
    {
      key: 'arrange',
      header: t('order'),
      cell: (category) =>
      (
        <span className="badge bg-info text-white">{category.arrange}</span>
      ),
      className: isRTL ? 'text-right' : 'text-left'
    },
    {
      key: 'created',
      header: t('created'),
      cell: (category) => formatDate(category.createdAtDate, category.createdAtTime),
      className: isRTL ? 'text-right' : 'text-left'
    },
    {
      key: 'actions',
      header: t('actions'),
      cell: (category) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => { setSelectedCategoryId(category.id); setImageDialogOpen(true); }} className="btn btn-icon btn-sm btn-light-info" title={t('uploadImage')}>
            <i className="ki-duotone ki-switch fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </button>
          <button onClick={() => onEdit(category.id)} className="btn btn-icon btn-sm btn-light-warning" title={t('edit')}>
            <i className="ki-duotone ki-pencil fs-2">   <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </button>
          <button onClick={() => onDelete(category.id)} className="btn btn-icon btn-sm btn-light-danger" title={t('delete')}>
            <i className="ki-duotone ki-trash fs-2" >   <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </button>
        </div>
      ),
      className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
    }
  ];


  return (
    <>
      <BaseTable
        data={categories}
        columns={columns}
        isLoading={isLoading}
        getItemId={(category) => category.id}
      />
      <CategoryImageUploadDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        categoryId={selectedCategoryId || 0}
        onUploadSuccess={() => {
          setImageDialogOpen(false);
          // Optionally reload category data
        }}
      />
    </>
  );
};

export default CategoryTable; 