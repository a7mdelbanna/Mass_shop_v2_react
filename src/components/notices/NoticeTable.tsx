import React from 'react';
import { Notice } from '@/types/notice';
import { BaseTable, TableColumn, formatDate } from '@/components/ui/base-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NoticeTableProps {
  notices: Notice[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const NoticeTable: React.FC<NoticeTableProps> = ({
  notices,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const columns: TableColumn<Notice>[] = [
    {
      key: 'nameEN',
      header: t('nameEN'),
      cell: (notice) => (
        <span className="font-medium text-foreground">{notice.nameEN}</span>
      ),
      className: isRTL ? 'text-right' : 'text-left',

    },
    {
      key: 'nameAR',
      header: t('nameAR'),
      cell: (notice) => (
        <span className="text-foreground/90">{notice.nameAR}</span>
      ),
      className: isRTL ? 'text-right' : 'text-left'
    },
    {
      key: 'emoji',
      header: t('emoji'),
      cell: (notice) => (
        <span className="text-muted-foreground truncate max-w-[200px]">
          {notice.emoji || '-'}
        </span>
      ),
      className: isRTL ? 'text-right' : 'text-left',
    },
    {
      key: 'color',
      header: t('color'),
      cell: (notice) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-border"
            style={{ backgroundColor: notice.color || '#ffffff' }}
          />
          <span className="text-muted-foreground text-sm">
            {notice.color || '-'}
          </span>
        </div>
      ),
      className: isRTL ? 'text-right' : 'text-left'
    },


    {
      key: 'actions',
      header: t('actions'),
      cell: (notice) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(notice.id)}
            className="p-1.5 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
            title={t('edit')}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(notice.id)}
            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title={t('delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
    }
  ];

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <BaseTable
        data={notices}
        columns={columns}
        isLoading={isLoading}
        onEdit={(tag) => onEdit(tag.id)}
        onDelete={(tag) => onDelete(tag.id)}
        getItemId={(tag) => tag.id}
      />
    </div>
  );
};

export default NoticeTable; 