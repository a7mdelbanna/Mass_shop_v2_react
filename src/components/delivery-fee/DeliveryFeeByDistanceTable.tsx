import React from 'react';
import { DeliveryFeeByDistanceDto } from '@/types/delivery-fee';
import { BaseTable, TableColumn } from '@/components/ui/base-table';
import { useTranslation } from 'react-i18next';

interface DeliveryFeeByDistanceTableProps {
  fees: DeliveryFeeByDistanceDto[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DeliveryFeeByDistanceTable: React.FC<DeliveryFeeByDistanceTableProps> = ({
  fees,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const columns: TableColumn<DeliveryFeeByDistanceDto>[] = [
    {
      key: 'from',
      header: t('fromDistance'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (fee) => fee.from,
    },
    {
      key: 'to',
      header: t('toDistance'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (fee) => fee.to,
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
    },
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

export default DeliveryFeeByDistanceTable; 