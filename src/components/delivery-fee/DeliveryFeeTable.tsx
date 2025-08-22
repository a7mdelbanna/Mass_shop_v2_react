import React from 'react';
import { DeliveryFeeByAreaDto } from '@/types/delivery-fee';
import { BaseTable, TableColumn } from '@/components/ui/base-table';
import { useTranslation } from 'react-i18next';

interface DeliveryFeeTableProps {
  fees: DeliveryFeeByAreaDto[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DeliveryFeeTable: React.FC<DeliveryFeeTableProps> = ({
  fees,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const columns: TableColumn<DeliveryFeeByAreaDto>[] = [
    {
      key: 'areaName',
      header: t('areaName'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (fee) => <span className="font-medium">{fee.areaName}</span>
    },
    {
      key: 'price',
      header: t('price'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (fee) => fee.price.toFixed(2),
    },
    {
      key: 'deliveryTime',
      header: t('deliveryTime'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (fee) => `${fee.deliveryHours}h ${fee.deliveryMinutes}m`,
    },

    {
      key: 'actions',
      header: t('actions'),
      cell: () => null, // Actions handled by BaseTable
      className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
    }
  ];

  return (
    <BaseTable
      data={fees}
      columns={columns}
      isLoading={isLoading}
      onEdit={(fee) => onEdit(fee.id)}
      onDelete={(fee) => onDelete(fee.id)}
      getItemId={(fee) => fee.id}
    />
  );
};

export default DeliveryFeeTable; 