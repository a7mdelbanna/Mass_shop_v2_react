import React from 'react';
import { FullProduct } from '@/types/product';
import { BaseTable, TableColumn, formatDate } from '@/components/ui/base-table';

interface ProductTableProps {
  products: FullProduct[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RetailProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const columns: TableColumn<FullProduct>[] = [
    {
      key: 'nameEN',
      header: 'Name (EN)',
      cell: (product) => <span className="font-medium">{product.nameEN}</span>,
    },
    {
      key: 'nameAR',
      header: 'Name (AR)',
      cell: (product) => product.nameAR,
    },
    {
      key: 'noteEN',
      header: 'Note (EN)',
      cell: (product) => product.descriptionEN,
      className: 'max-w-[200px] truncate',
    },
    {
      key: 'noteAR',
      header: 'Note (AR)',
      cell: (product) => product.descriptionAR,
      className: 'max-w-[200px] truncate',
    },
 
   
    {
      key: 'actions',
      header: 'Actions',
      cell: () => null, 
    },
  ];

  return (
    <BaseTable
      data={products}
      columns={columns}
      isLoading={isLoading}
      onEdit={(product) => onEdit(product.id)}
      onDelete={(product) => onDelete(product.id)}
      getItemId={(product) => product.id}
    />
  );
};

export default RetailProductTable;
