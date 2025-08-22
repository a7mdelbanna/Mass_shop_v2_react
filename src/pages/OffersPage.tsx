import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { CustomerService } from '@/services/customer-service';
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
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';
import { t } from 'i18next';

const CustomersPage = () => {
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
      const response = await CustomerService.getAll(currentPage, pageSize);
      setCustomers(response.data);
      setTotalPages(Math.ceil(response.totalCount / pageSize));
    } catch (error) {
      console.error('[CustomersPage] Error loading delivery boys:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToLoadDeliveryBoys') });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

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
      sweetAlert.fire({ icon: 'success', title: t('statusUpdatedSuccessfully') });
      loadCustomers();
    } catch (error) {
      sweetAlert.fire({ icon: 'error', title: t('failedToUpdateStatus') });
    }
  };

  const filteredCustomers = Customers.filter(
    (Customer) =>
      Customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Customer.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search delivery boys..."
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
            <AlertDialogTitle>Delete Delivery Boy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this delivery boy? This action cannot be undone.
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
              Cancel
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
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomersPage; 