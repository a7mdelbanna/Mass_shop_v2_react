import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import CompanyTable from '@/components/companies/CompanyTable';
import CompanyDialog from '@/components/companies/CompanyDialog';
import { Company } from '@/types/company';
import { fetchCompanies, deleteCompany, getCompanyById } from '@/services/company-service';
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

const CompaniesPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<number | null>(null);
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { t } = useTranslation();

  const loadCompanies = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('[CompaniesPage] Error loading companies:', error);
      sweetAlert.fire({
        icon: 'error',
        title: 'Failed to load companies',
      })
    
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleCreate = () => {
    setIsNew(true);
    setSelectedCompany(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const company = await getCompanyById(id);
      setSelectedCompany(company);
      setIsNew(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('[CompaniesPage] Error loading company for edit:', error);
      sweetAlert.fire({
        icon: 'error',
        title: 'Failed to load company for editing',
      })
    }
  };

  const handleDelete = (id: number) => {
    setSelectedCompanyId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCompanyId) return;

    try {
      setIsDeleting(true);
      await deleteCompany(selectedCompanyId);
      sweetAlert.fire({
        icon: 'success',
        title: 'Company deleted successfully',
      })
      await loadCompanies();
    } catch (error) {
      console.error('[CompaniesPage] Error deleting company:', error);
      toast.error('Failed to delete company. Please try again.', { duration: 3000 });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedCompanyId(null);
    }
  };

  const handleSaveComplete = () => {
    setIsDialogOpen(false);
    loadCompanies();
  };
  

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className='card mb-xl-8'>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">{t('companies')}</span>
            <span className="text-muted mt-1 fw-semibold fs-7">{t('manageCompanies')}</span>
          </h3>

          <div className="card-toolbar" title={t('addCompanyTooltip')}>
            <Button onClick={handleCreate} className="btn btn-sm btn-light btn-active-success text-white">
              <i className="ki-duotone ki-plus fs-2 text-white"></i>{t('addCompany')}
            </Button>

          </div>
        </div>
        <div className='card-body pt-3'>
          <div className="table-responsive">
            <CompanyTable
              companies={companies}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
               onReload={fetchCompanies}
            />
          </div>
        </div>
      </div>



      <CompanyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        company={selectedCompany}
        isNew={isNew}
        onSaveComplete={handleSaveComplete}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setSelectedCompanyId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCompany')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteCompanyConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCompanyId(null);
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

export default CompaniesPage;
