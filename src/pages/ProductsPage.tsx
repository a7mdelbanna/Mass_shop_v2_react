import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import RetailProductTable from '@/components/products/RetailProductTable';
import { Company } from '@/types/company';
import { deleteProduct, fetchProducts, getProductById, importProductsFromExcel } from '@/services/product-service';
import { fetchItemUnits } from '@/services/item-unit-service';
import { fetchCategories } from '@/services/category-service';
import { fetchSubCategories } from '@/services/sub-category-service';
import { fetchCompanies } from '@/services/company-service';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useTranslation } from 'react-i18next';
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
import RetailProductDialog from '@/components/products/RetailProductDialog';
import { FullProduct } from '@/types/product';
import WholeSaleProductTable from '@/components/products/WholeSaleProductTable';
import WholeSaleProductDialog from '@/components/products/WholeSaleProductDialog';
import { ItemUnit } from '@/types/item-unit';
import { Category } from '@/types/category';
import { SubCategory } from '@/types/sub-category';
import { Tag } from '@/types/tag';
import { Notice } from '@/types/notice';
import { fetchTags } from '@/services/tag-service';
import { fetchNotices } from '@/services/notice-service';
import { sweetAlert } from '@/utils/alert';
import { PaginatedProductResponse, ProductQueryParams } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as XLSX from 'xlsx';
import { FileSpreadsheet } from 'lucide-react';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState<FullProduct[]>([]);
  const [units, setUnits] = React.useState<ItemUnit[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [subCategories, setSubCategories] = React.useState<SubCategory[]>([]);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [notices, setNotices] = React.useState<Notice[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<FullProduct | null>(null);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [pagination, setPagination] = React.useState({ page: 1, pageSize: 10 });
  const [totalCount, setTotalCount] = React.useState(0);
  const [filters, setFilters] = React.useState<ProductQueryParams>({});
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<number | undefined>(undefined);
  const [selectedCompany, setSelectedCompany] = React.useState<number | undefined>(undefined);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { t } = useTranslation();

  const loadProducts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const query: ProductQueryParams = {
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
        searchTerm: search || undefined,
        itemCategoryId: selectedCategory,
        companyId: selectedCompany,
      };
      
      // First load the products
      const productRes = await fetchProducts(query);
      console.log('Products loaded:', productRes);
      setProducts(productRes.data);
      setTotalCount(productRes.totalCount);

      // Then load other data in parallel
      const [unitsData, categoriesData, subCategoriesData, companiesData, tagsData, noticesData] = await Promise.all([
        fetchItemUnits(),
        fetchCategories(),
        fetchSubCategories(),
        fetchCompanies(),
        fetchTags(),
        fetchNotices(),
      ]);
      
      console.log('Tags loaded:', tagsData);
      console.log('Units loaded:', unitsData);
      console.log('Categories loaded:', categoriesData);
      
      setUnits(unitsData);
      setCategories(categoriesData);
      setSubCategories(subCategoriesData);
      setCompanies(companiesData);
      setTags(tagsData);
      setNotices(noticesData);
    } catch (error) {
      console.error('[ProductsPage] Error loading data:', error);
      sweetAlert.fire({
        icon: 'error',
        title: 'Failed to load data',
      })
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination, search, selectedCategory, selectedCompany]);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreate = async () => {
    setIsNew(true);
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const product = await getProductById(id);
      setSelectedProduct(product);
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
    setSelectedProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProductId == null) return;
    try {
      setIsDeleting(true);
      await deleteProduct(selectedProductId);
      sweetAlert.fire({ icon: 'success', title: t('productDeletedSuccessfully') });
      await loadProducts();
    } catch (error) {
      sweetAlert.fire({ icon: 'error', title: t('failedToDeleteProduct') });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  const handleSaveComplete = () => {
    setIsDialogOpen(false);
    loadProducts();
  };

  // Excel import handler
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importProductsFromExcel(file);
      sweetAlert.fire({ icon: 'success', title: t('excelImportSuccess') });
      loadProducts();
    } catch (error: any) {
      sweetAlert.fire({ icon: 'error', title: t('excelImportSuccess') });
    }
  };

  const { settings } = useStoreSettings();

  if (!settings) {
    return <div className="p-6 text-muted-foreground">Loading store settings...</div>;
  }

  // Extract appMode
  const appMode = settings.appMode;

  const isRetail = appMode === 'RetailMarket';
  const isWholeSale = appMode === 'WholeSale';
  const isBoth = appMode === 'Both';

  // Pagination controls
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPagination({ page: 1, pageSize: Number(e.target.value) });
  };

  // Filter controls
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value ? Number(value) : undefined);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value ? Number(value) : undefined);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory(undefined);
    setSelectedCompany(undefined);
    setPagination({ page: 1, pageSize: pagination.pageSize });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className='card mb-xl-8'>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">{t('productsPageHeader')}</span>
            <span className="text-muted mt-1 fw-semibold fs-7">{t('productsTableDescription')}</span>
          </h3>
          <div className="card-toolbar" title="click to add product">
            <Button onClick={handleCreate} className="btn btn-sm btn-light btn-active-primary text-white">
              <i className="ki-duotone ki-plus fs-2 text-white"></i>
              {t('addProduct')}
            </Button>
            {/* Import from Excel Button */}
            <Button
              type="button"
              variant="outline"
              className="m-2 flex items-center gap-2 btn btn-sm btn-success"
              onClick={() => fileInputRef.current?.click()}
              title={t('importExcel')}
            >
              <FileSpreadsheet className="w-4 h-4" />
              {t('importExcel')}
            </Button>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImportExcel}
            />
          </div>
        </div>
        <div className="card-body pt-3 mt-5">
          {/* Modern Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6 bg-white/80 dark:bg-neutral-900/80 rounded-2xl shadow-lg items-end border border-gray-200 dark:border-neutral-800 mb-4">
            {/* Search Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" /> {t('searchPlaceholder')}
              </label>
              <Input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={t('searchPlaceholder')}
                className="rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>
            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('category')}</label>
              <Select value={selectedCategory !== undefined ? String(selectedCategory) : ''} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary focus:border-primary transition">
                  <SelectValue placeholder={t('category')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.nameAR}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Company */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('company')}</label>
              <Select value={selectedCompany !== undefined ? String(selectedCompany) : ''} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-full rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary focus:border-primary transition">
                  <SelectValue placeholder={t('company')} />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Spacer for alignment */}
            <div />
            {/* Clear Filters Button */}
            <div className="flex flex-col gap-2 md:flex-row md:items-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-danger flex items-center gap-2 mt-2 md:mt-0 rounded-lg shadow hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" /> {t('clearFilters')}
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="table-responsive mb-5">
            {isRetail ? (
              <RetailProductTable
                products={products}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <WholeSaleProductTable
                products={products}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onImageUploaded={loadProducts}
              />
            )}
          </div>

          {/* Pagination Controls - moved 'Show' select to bottom like OrdersPage */}
          <div className="flex justify-between items-center mt-4">
            <div>
              {t('showing')} {(pagination.page - 1) * pagination.pageSize + 1}
              -{Math.min(pagination.page * pagination.pageSize, totalCount)} {t('of')} {totalCount}
            </div>
            <div className="flex gap-2 items-center">
              <label className="mb-1 text-sm font-medium text-muted-foreground">{t('show')}</label>
              <Select value={pagination.pageSize.toString()} onValueChange={(value) => setPagination({ page: 1, pageSize: Number(value) })}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder={t('show')} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>{t('show')} {size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-outline"
              >
                {t('previous')}
              </button>
              <span>{t('page')} {pagination.page}</span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page * pagination.pageSize >= totalCount}
                className="btn btn-outline"
              >
                {t('next')}
              </button>
            </div>
          </div>
        </div>
        </div>


      {isRetail ?
        <RetailProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          retailProduct={selectedProduct}
          units={units}
          mainCategories={categories}
          subCategories={subCategories}
          tags={tags}
          notices={notices}
          isNew={isNew}
          onSaveComplete={handleSaveComplete}
        /> : <WholeSaleProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          wholeSaleProduct={selectedProduct}
          units={units}
          categories={categories}
          companies={companies}
          tags={tags}
          notices={notices}
          isNew={isNew}
          onSaveComplete={handleSaveComplete}
        />}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setSelectedProductId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteProduct')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteProductConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedProductId(null);
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

export default ProductsPage;
