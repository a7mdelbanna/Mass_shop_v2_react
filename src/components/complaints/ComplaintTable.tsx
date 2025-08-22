import React from 'react';
import { Complaint } from '@/types/complaint';
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

interface ComplaintTableProps {
  complaints: Complaint[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isRTL: boolean;
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  isLoading,
  onEdit,
  onDelete,
  isRTL,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<Complaint>[] = [
    {
      key: 'Name',
      header: t('complaintsUser'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (complaint) => <span className="font-medium">{complaint.user.fullName}</span>
    },
    {
      key: 'Email',
      header: t('complaintsEmail'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (complaint) => <span className="font-medium">{complaint.user.email}</span>
    },
    {
      key: 'Phone Number',
      header: t('complaintsPhone'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (complaint) => <span className="font-medium">{complaint.user.phoneNumber}</span>
    },
    {
      key: 'Message',
      header: t('complaintsMessage'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (complaint) => <span className="font-medium">{complaint.details}</span>
    },
    {
      key: 'Status',
      header: t('status'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (complaint) =>
      (
        <span className="badge bg-info text-white">
        {complaint.status}
      </span>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
      cell: (complaint) => (
        <div className="flex items-center justify-end gap-2">

          <button
            onClick={() => onEdit(complaint.id)}
            className="p-1.5 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
            title={t('edit')}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(complaint.id)}
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
      data={complaints}
      columns={columns}
      isLoading={isLoading}
      onEdit={(complaint) => onEdit(complaint.id)}
      onDelete={(complaint) => onDelete(complaint.id)}
      getItemId={(complaint) => complaint.id}
    />
  );
};

export default ComplaintTable; 