import React from 'react';
import { Coupon } from '@/types/coupon';
import { BaseTable, TableColumn } from '@/components/ui/base-table';
import { useTranslation } from 'react-i18next';

interface CouponTableProps {
  coupons: Coupon[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (code: string) => void;
}

const CouponTable: React.FC<CouponTableProps> = ({
  coupons,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const columns: TableColumn<Coupon>[] = [
    {
      key: 'code',
      header: t('code'),
      cell: (coupon) => <span className="font-medium">{coupon.code}</span>,
      className: isRTL ? 'text-right' : 'text-left',
    },
    {
      key: 'description',
      header: t('description'),
      cell: (coupon) => coupon.description,
      className: isRTL ? 'text-right' : 'text-left',
    },
    {
      key: 'discountType',
      header: t('discountType'),
      cell: (coupon) => coupon.discountType === 0 ? t('percentage') : t('fixedAmount'),
      className: isRTL ? 'text-right' : 'text-left',
    },
    {
      key: 'discountValue',
      header: t('discountValue'),
      cell: (coupon) => coupon.discountValue,
      className: isRTL ? 'text-right' : 'text-left',
    },
    {
      key: 'startDate',
      header: t('startDate'),
      cell: (coupon) => coupon.startDate?.slice(0, 10),
      className: isRTL ? 'text-right' : 'text-left',
    },
    {
      key: 'endDate',
      header: t('endDate'),
      cell: (coupon) => coupon.endDate?.slice(0, 10),
      className: isRTL ? 'text-right' : 'text-left',
    },
    {
      key: 'status',
      header: t('status'),
      cell: (coupon) => coupon.status ? t('active') : t('inactive'),
      className: isRTL ? 'text-right' : 'text-left',
    },
    {
      key: 'actions',
      header: t('actions'),
      cell: () => null,
      className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
    },
  ];

  return (
    <BaseTable
      data={coupons}
      columns={columns}
      isLoading={isLoading}
      onEdit={(coupon) => onEdit(coupon.id)}
      onDelete={(coupon) => onDelete(coupon.code)}
      getItemId={(coupon) => coupon.id}
    />
  );
};

export default CouponTable; 