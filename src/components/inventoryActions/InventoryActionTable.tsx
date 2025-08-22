import React from 'react';
import { InventoryAction } from '@/types/inventory';
import { BaseTable, TableColumn } from '@/components/ui/base-table';
import { useTranslation } from 'react-i18next';

interface InventoryActionTableProps {
  actions: InventoryAction[];
  isLoading: boolean;
}

const InventoryActionTable: React.FC<InventoryActionTableProps> = ({
  actions,
  isLoading,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';  const columns: TableColumn<InventoryAction>[] = [
    {
      key: 'itemId',
      header: t('product'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (action) => <span className="font-medium">#{action.itemId}</span>,
    },
    {
      key: 'action',
      header: t('actionType'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (action) => <span className="capitalize">{action.action}</span>,
    },
    {
      key: 'stockVal',
      header: t('quantity'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (action) => <span>{action.stockVal}</span>,
    },
    {
      key: 'createdAt',
      header: t('actionDate'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (action) => (
        <span>
          {action.createdAtDate} {action.createdAtTime}
        </span>
      ),
    },
  ];

  return (
    <BaseTable
      data={actions}
      columns={columns}
      isLoading={isLoading}
      getItemId={(action) => action.id}
    />
  );
};

export default InventoryActionTable;
