import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import NoticeTable from '@/components/notices/NoticeTable';
import NoticeDialog from '@/components/notices/NoticeDialog';
import { Notice } from '@/types/notice';
import { fetchNotices, deleteNotice, getNoticeById } from '@/services/notice-service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';

const NoticesPage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = React.useState<Notice[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = React.useState<number | null>(null);
  const [selectedNotice, setSelectedNotice] = React.useState<Notice | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { t } = useTranslation();

  const loadTags = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchNotices();
      setNotices(data);
    } catch (error) {
      console.error('[NoticesPage] Error loading tags:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToLoadTags') });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  React.useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleCreate = () => {
    setIsNew(true);
    setSelectedNotice(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const tag = await getNoticeById(id);
      setSelectedNotice(tag);
      setIsNew(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('[NoticesPage] Error loading tag for edit:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToLoadTagForEditing') });
    }
  };

  const handleDelete = (id: number) => {
    console.log('[NoticesPage] Initiating delete for Notice:', id);
    setSelectedNoticeId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    console.log('[NoticesPage] Confirming delete for Notice:', selectedNoticeId);
    if (!selectedNoticeId) {
      console.error('[NoticesPage] No Notice ID selected for deletion');
      return;
    }

    try {
      setIsDeleting(true);
      console.log('[NoticesPage] Calling delete Notice service with ID:', selectedNoticeId);
      await deleteNotice(selectedNoticeId);
      console.log('[NoticesPage] Delete successful');
      sweetAlert.fire({ icon: 'success', title: t('noticeDeletedSuccessfully') });
      await loadTags();
    } catch (error) {
      console.error('[NoticesPage] Error in confirmDelete:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToDeleteTag') });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedNoticeId(null);
    }
  };

  const handleSaveComplete = () => {
    setIsDialogOpen(false);
    loadTags();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className='card mb-xl-8'>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">{t('notices')}</span>
            <span className="text-muted mt-1 fw-semibold fs-7">{t('manageNotices')}</span>
          </h3>

          <div className="card-toolbar" title="click to add product">
            <Button onClick={handleCreate} className="btn btn-sm btn-light btn-active-primary text-white">
            <i className="ki-duotone ki-plus fs-2 text-white"></i>{t('addNotice')}
            </Button>
          </div>
        </div>
        <div className='card-body pt-3'>
          <div className="table-responsive">
            <NoticeTable
              notices={notices}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>



      <NoticeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        notice={selectedNotice}
        isNew={isNew}
        onSaveComplete={handleSaveComplete}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setSelectedNoticeId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteNotice')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteNoticeConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedNoticeId(null);
              }}
              disabled={isDeleting}
            >
              {t('cancel')}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t('deleting') : t('delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NoticesPage; 