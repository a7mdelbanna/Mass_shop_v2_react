import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TagTable from '@/components/tags/TagTable';
import TagDialog from '@/components/tags/TagDialog';
import { Tag } from '@/types/tag';
import { fetchTags, deleteTag, getTagById } from '@/services/tag-service';
import { sweetAlert } from '@/utils/alert'; // adjust path as needed
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';

const TagsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedTagId, setSelectedTagId] = React.useState<number | null>(null);
  const [selectedTag, setSelectedTag] = React.useState<Tag | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadTags = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchTags();
      setTags(data);
    } catch (error) {
      console.error('[TagsPage] Error loading tags:', error);
      sweetAlert.fire({
        icon: 'error',
        title: 'Failed to load tags',
      })

    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleCreate = () => {
    setIsNew(true);
    setSelectedTag(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const tag = await getTagById(id);
      setSelectedTag(tag);
      setIsNew(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('[TagsPage] Error loading tag for edit:', error);
      sweetAlert.fire({
        icon: 'error',
        title: 'Failed to load tag for editing',
      })
    }
  };

  const handleDelete = (id: number) => {
    console.log('[TagsPage] Initiating delete for tag:', id);
    setSelectedTagId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    console.log('[TagsPage] Confirming delete for tag:', selectedTagId);
    if (!selectedTagId) {
      console.error('[TagsPage] No tag ID selected for deletion');
      return;
    }

    try {
      setIsDeleting(true);
      console.log('[TagsPage] Calling deleteTag service with ID:', selectedTagId);
      await deleteTag(selectedTagId);
      console.log('[TagsPage] Delete successful');
      sweetAlert.fire({
        icon: 'success',
        title: 'Tag deleted successfully',
      })
      await loadTags();
    } catch (error) {
      console.error('[TagsPage] Error in confirmDelete:', error);
      sweetAlert.fire({
        icon: 'success',
        title: 'Failed to delete tag. Please try again.',
      })
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedTagId(null);
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
            <span className="card-label fw-bold fs-3 mb-1">{t('tags')}</span>
            <span className="text-muted mt-1 fw-semibold fs-7">{t('manageTags')}</span>
          </h3>

          <div className="card-toolbar" title={t('addTagTooltip')}>
            <Button onClick={handleCreate} className="btn btn-sm btn-light btn-active-primary text-white">
              <i className="ki-duotone ki-plus fs-2 text-white"></i>{t('addTag')}
            </Button>
          </div>
        </div>
        <div className='card-body pt-3'>
          <div className="table-responsive">
            <TagTable
              tags={tags}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>



      <TagDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tag={selectedTag}
        isNew={isNew}
        onSaveComplete={handleSaveComplete}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setSelectedTagId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteTag')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteTagConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedTagId(null);
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

export default TagsPage; 