import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { ComplaintService } from '@/services/complaint-service';
import { Complaint } from '@/types/complaint';
import ComplaintTable from '@/components/complaints/ComplaintTable';
import ComplaintDialog from '@/components/complaints/ComplaintDialog';
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

const ComplaintsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [Complaints, setComplaints] = React.useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = React.useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = React.useState<Complaint | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const pageSize = 10;

  const loadComplaints = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ComplaintService.getAll();
      setComplaints(response.data);
      setTotalPages(Math.ceil(response.totalCount / pageSize));
    } catch (error) {
      console.error('[ComplaintsPage] Error loading complaints:', error);
      toast.error(t('complaintsFailedToLoad'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, t]);

  React.useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const handleCreate = () => {
    setIsNew(true);
    setSelectedComplaint(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    const Complaint = Complaints.find(db => db.id === id);
    if (Complaint) {
      setSelectedComplaint(Complaint);
      setIsNew(false);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedComplaintId(id);
    setIsDeleteDialogOpen(true);
  };

  const filteredComplaints = Complaints.filter(
    (Complaint) =>
      Complaint.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Complaint.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Complaint.user.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('complaintsPageTitle')}</h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('complaintsSearchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <ComplaintTable
        complaints={filteredComplaints}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isRTL={isRTL}
      />

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setSelectedComplaintId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('complaintsDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('complaintsDeleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedComplaintId(null);
              }}
              disabled={isDeleting}
            >
              {t('complaintsCancel')}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                // Implement delete functionality when needed
                setIsDeleteDialogOpen(false);
                setSelectedComplaintId(null);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? t('complaintsDeleting') : t('complaintsDelete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ComplaintsPage; 