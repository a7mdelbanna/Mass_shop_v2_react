import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { CustomerService } from '@/services/customer-service';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Customer } from '@/types/customer';
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerDialog from '@/components/customers/CustomerDialog';
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

const CustomersPage = () => {
  const { t } = useTranslation();
  const { settings } = useStoreSettings();
  const appMode = settings?.appMode?.toLowerCase();
  const [Customers, setCustomers] = React.useState<Customer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const pageSize = 10;

  const loadCustomers = React.useCallback(async () => {
    try {
      setIsLoading(true);
      let response;
      if (appMode === 'wholesale') {
        response = await CustomerService.getAllShops(currentPage, pageSize);
      } else {
        response = await CustomerService.getAll(currentPage, pageSize);
      }
      setCustomers(response.data);
      setTotalPages(Math.ceil(response.totalCount / pageSize));
    } catch (error) {
      console.error('[CustomersPage] Error loading customers:', error);
      toast.error(t('failedToLoadCustomers'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, t, appMode]);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleCreate = () => {
    setIsNew(true);
    setSelectedCustomer(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    const Customer = Customers.find(db => db.id === id);
    if (Customer) {
      setSelectedCustomer(Customer);
      setIsNew(false);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedCustomerId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await CustomerService.toggleStatus(id, !currentStatus);
      toast.success(t('statusUpdatedSuccessfully'));
      loadCustomers();
    } catch (error) {
      toast.error(t('failedToUpdateStatus'));
    }
  };

  const filteredCustomers = Customers.filter(
    (Customer) =>
      (Customer.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Customer.phoneNumber || '').includes(searchTerm)
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('customers')}</h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchCustomers')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <CustomerTable
        customers={filteredCustomers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={selectedCustomer}
        isNew={isNew}
        onSaveComplete={loadCustomers}
      />

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setSelectedCustomerId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCustomer')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteCustomerConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCustomerId(null);
              }}
              disabled={isDeleting}
            >
              {t('cancel')}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                // Implement delete functionality when needed
                setIsDeleteDialogOpen(false);
                setSelectedCustomerId(null);
              }}
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

export default CustomersPage; 