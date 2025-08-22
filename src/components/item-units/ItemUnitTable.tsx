import React from 'react';
import { ItemUnit } from '@/types/item-unit';
import { BaseTable, TableColumn, formatDate } from '@/components/ui/base-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ItemUnitTableProps {
  units: ItemUnit[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ItemUnitTable: React.FC<ItemUnitTableProps> = ({
  units,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const columns: TableColumn<ItemUnit>[] = [
    {
      key: 'nameEN',
      header: t('nameEN'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (unit) => <span className="font-medium text-foreground">{unit.nameEN}</span>
    },
    {
      key: 'nameAR',
      header: t('nameAR'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (unit) => <span className="text-foreground/90">{unit.nameAR}</span>,
    },
    {
      key: 'amount',
      header: t('amount'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (unit) => unit.amount
    },
    {
      key: 'created',
      header: t('created'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (unit) =>
      (
        <span className="text-sm text-muted-foreground">
          {formatDate(unit.createdAtDate, unit.createdAtTime)}
        </span>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
      cell: (unit) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(unit.id)}
            className="btn btn-icon btn-sm btn-light-warning"
            title={t('edit')}
          >
           <i className="ki-duotone ki-pencil fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </button>
          <button
            onClick={() => onDelete(unit.id)}
            className="btn btn-icon btn-sm btn-light-danger"
            title={t('delete')}
          >
            <i className="ki-duotone ki-trash fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </button>
        </div>
      )
    }
  ];

  return (
    <BaseTable
      data={units}
      columns={columns}
      isLoading={isLoading}
      getItemId={(unit) => unit.id}
    />
  );
};

export default ItemUnitTable;
