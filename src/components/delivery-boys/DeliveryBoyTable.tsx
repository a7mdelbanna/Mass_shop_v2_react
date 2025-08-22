import React from 'react';
import { DeliveryBoy } from '@/types/delivery-boy';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BaseTable, TableColumn } from '../ui/base-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeliveryBoyTableProps {
  deliveryBoys: DeliveryBoy[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const DeliveryBoyTable: React.FC<DeliveryBoyTableProps> = ({
  deliveryBoys,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
    const columns: TableColumn<DeliveryBoy>[] = [
    {
      key: 'Full Name',
      header: t('fullName'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (deliveryBoy) => <span className="font-medium">{deliveryBoy.fullName}</span>
    },
    {
      key: 'Phone Number',
      header: t('phoneNumber'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (deliveryBoy) => <span className="font-medium">{deliveryBoy.phoneNumber}</span>
    },
    {
      key: 'Email',
      header: t('email'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (deliveryBoy) => deliveryBoy.email,
    },
    {
      key: 'Status',
      header: t('status'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (deliveryBoy) =>
      (
        <span
        className={`px-2 py-1 rounded-full text-xs ${
          deliveryBoy.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {deliveryBoy.isActive ? t('active') : t('inactive')}
      </span>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
      cell: (deliveryBoy) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(deliveryBoy.id)}
            className="p-1.5 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
            title={t('edit')}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(deliveryBoy.id)}
            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title={t('delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <BaseTable
      data={deliveryBoys}
      columns={columns}
      isLoading={isLoading}
      onEdit={(deliveryBoy) => onEdit(deliveryBoy.id)}
      onDelete={(deliveryBoy) => onDelete(deliveryBoy.id)}
      getItemId={(deliveryBoy) => deliveryBoy.id}
    />
  );
};

export default DeliveryBoyTable; 