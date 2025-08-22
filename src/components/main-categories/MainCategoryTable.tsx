import React from 'react';
import { MainCategory } from '@/types/main-category';
import { BaseTable, TableColumn, formatDate } from '@/components/ui/base-table';
import { useTranslation } from 'react-i18next';

interface MainCategoryTableProps {
  categories: MainCategory[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MainCategoryTable: React.FC<MainCategoryTableProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const columns: TableColumn<MainCategory>[] = [
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
      cell: () => null, // Actions are handled by BaseTable
      className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
    }
  ];

  return (
    <BaseTable
      data={categories}
      columns={columns}
      isLoading={isLoading}
      onEdit={(category) => onEdit(category.id)}
      onDelete={(category) => onDelete(category.id)}
      getItemId={(category) => category.id}
    />
  );
};

export default MainCategoryTable; 