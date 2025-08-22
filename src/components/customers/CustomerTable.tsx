import React from 'react';
import { Customer } from '@/types/customer';
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

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const columns: TableColumn<Customer>[] = [
    {
      key: 'Full Name',
      header: t('fullName'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (customer) => <span className="font-medium">{customer.fullName}</span>
    },
    {
      key: 'Phone Number',
      header: t('phoneNumber'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (customer) => <span className="font-medium">{customer.phoneNumber}</span>
    },
    {
      key: 'Email',
      header: t('email'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (customer) => customer.email,
    },
    {
      key: 'Status',
      header: t('status'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (customer) =>
      (
        <span
        className={`px-2 py-1 rounded-full text-xs ${
          customer.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {customer.isActive ? t('active') : t('inactive')}
      </span>
      )
    },
    
  ];

  return (
    <BaseTable
      data={customers}
      columns={columns}
      isLoading={isLoading}
      onEdit={(deliveryBoy) => onEdit(deliveryBoy.id)}
      onDelete={(deliveryBoy) => onDelete(deliveryBoy.id)}
      getItemId={(deliveryBoy) => deliveryBoy.id}
    />
  );
};

export default CustomerTable; 