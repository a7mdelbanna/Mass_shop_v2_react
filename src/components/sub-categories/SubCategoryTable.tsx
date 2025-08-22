import React from 'react';
import { SubCategory } from '@/types/sub-category';
import { BaseTable, TableColumn, formatDate } from '@/components/ui/base-table';
import { Pencil, Trash2 } from 'lucide-react';

interface SubCategoryTableProps {
  categories: SubCategory[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const columns: TableColumn<SubCategory>[] = [
    {
      key: 'nameEN',
      header: 'Name (EN)',
      cell: (category) => (
        <span className="font-medium text-foreground">{category.nameEN}</span>
      )
    },
    {
      key: 'nameAR',
      header: 'Name (AR)',
      cell: (category) => (
        <span className="text-foreground/90">{category.nameAR}</span>
      ),
    },
    {
      key: 'mainCategory',
      header: 'Main Category',
      cell: (category) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {category.mainCategory.nameEN}
        </span>
      )
    },
    {
      key: 'noteEN',
      header: 'Note (EN)',
      cell: (category) => (
        <span className="text-muted-foreground truncate max-w-[200px]">
          {category.noteEN || '-'}
        </span>
      )
    },
    {
      key: 'noteAR',
      header: 'Note (AR)',
      cell: (category) => (
        <span className="text-muted-foreground truncate max-w-[200px]">
          {category.noteAR || '-'}
        </span>
      ),
    },
   
    {
      key: 'created',
      header: 'Created',
      cell: (category) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(category.createdAtDate, category.createdAtTime)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(category.id)}
            className="p-1.5 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <BaseTable
        data={categories}
        columns={columns}
        isLoading={isLoading}
        onEdit={(category) => onEdit(category.id)}
        onDelete={(category) => onDelete(category.id)}
        getItemId={(category) => category.id}
      />
    </div>
  );
};

export default SubCategoryTable; 