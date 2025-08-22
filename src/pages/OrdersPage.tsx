import React, { useEffect, useState } from 'react';
import { getAllOrders, fetchOrders } from '@/services/order-service';
import { Order, PaginatedOrderResponse, OrderQueryParams } from '@/types/order';
import OrderTable from '@/components/orders/OrderTable';
import OrderDetails from '@/components/orders/OrderDetails';
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';
import { Search, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const STORE_ID = '1'; // You can make this dynamic if needed

const OrdersPage: React.FC = () => {
    const { t } = useTranslation();
    // Move tab definitions here so t is available
    const mainTabs = [
      { key: 'new', label: 'جديد' },
      { key: 'preparing', label: 'يجهز' },
      { key: 'completed', label: 'انتهت' },
    ];
    // These should match your localized status keys
    const subTabsMap = {
      new: [
        { value: 'NewOrders', label: t('NewOrders') },
        { value: 'Rejected', label: t('Rejected') },
      ],
      preparing: [
        { value: 'Preparing', label: t('Preparing') },
        { value: 'Prepared', label: t('Prepared') },
        { value: 'OutForDelivery', label: t('OutForDelivery') },
      ],
      completed: [
        { value: 'Delivered', label: t('Delivered') },
        { value: 'NotDelivered', label: t('NotDelivered') },
      ],
    };
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    // Tabs state
    const [mainTab, setMainTab] = useState('new');
    const [subTab, setSubTab] = useState(subTabsMap['new'][0].value);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // OrderStatus mapping for dropdown
    // Update subTab when mainTab changes
    useEffect(() => {
      setSubTab(subTabsMap[mainTab][0].value);
    }, [mainTab]);

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const params: OrderQueryParams = {
                page: pagination.page,
                pageSize: pagination.pageSize,
                searchTerm: search || undefined,
                status: subTab,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            };
            const res: PaginatedOrderResponse = await fetchOrders(STORE_ID, params);
            setOrders(res.data);
            setTotalCount(res.totalCount);
        } catch (e) {
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line
    }, [pagination, search, subTab, startDate, endDate]);

    // Pagination controls
    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };
    const handlePageSizeChange = (value: string) => {
        setPagination({ page: 1, pageSize: Number(value) });
    };

    // Filter controls
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    // Clear filters handler
    const handleClearFilters = () => {
        setSearch('');
        // Reset to first subTab of current mainTab
        setSubTab(subTabsMap[mainTab][0].value);
        setStartDate('');
        setEndDate('');
        setPagination({ page: 1, pageSize: pagination.pageSize });
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className='card'>
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label fw-bold fs-3 mb-1">{t('orders')}</span>
                        <span className="text-muted mt-1 fw-semibold fs-7">{t('ordersTableDescription')}</span>
                    </h3>
                </div>
                <div className="card-body pt-3">

                   {/* Modern Filter Section for Orders 
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6 bg-white/80 dark:bg-neutral-900/80 rounded-2xl shadow-lg items-end border border-gray-200 dark:border-neutral-800 mb-4">
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
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" /> {t('from')}
                            </label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                className="rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" /> {t('to')}
                            </label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                className="rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:flex-row md:items-end">
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="btn btn-danger flex items-center gap-2 mt-2 md:mt-0 rounded-lg shadow hover:bg-red-600 transition"
                            >
                                {t('clearFilters')}
                            </button>
                        </div>
                    </div>*/}
                   {/* Tabs Section with background */}
                    <div className="bg-white/80 dark:bg-neutral-900/80 p-4 rounded-lg shadow border border-gray-100 dark:border-neutral-800 flex flex-col items-center gap-2 mt-4 mb-6">
                      <div className="flex justify-center gap-3">
                        {mainTabs.map(tab => (
                          <button
                            key={tab.key}
                            className={`
                              px-8 py-3 rounded-lg font-bold text-lg transition
                              border border-gray-200 shadow-sm
                              ${mainTab === tab.key
                                ? 'bg-blue-50 text-blue-700 border-blue-300 shadow'
                                : 'bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                              }
                            `}
                            onClick={() => setMainTab(tab.key)}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-center gap-3 mt-3">
                        {subTabsMap[mainTab].map(sub => (
                          <button
                            key={sub.value}
                            className={`
                              px-6 py-2 rounded-lg text-base font-semibold transition
                              border border-gray-200 shadow-sm
                              ${subTab === sub.value
                                ? 'bg-green-50 text-green-700 border-green-300 shadow'
                                : 'bg-white text-gray-700 hover:bg-green-100 hover:text-green-700'
                              }
                            `}
                            onClick={() => setSubTab(sub.value)}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Table and Modal */}
                    <div className="table-responsive">
                        <OrderTable
                            orders={orders}
                            isLoading={isLoading}
                            onViewDetails={setSelectedOrder}
                            onActionComplete={loadOrders}
                        />
                        {/* Modal Overlay for Order Details */}
                        {selectedOrder && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 cursor-pointer"
                                onClick={() => setSelectedOrder(null)}
                            >
                                <div onClick={e => e.stopPropagation()} className="cursor-default">
                                    <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Modern Pagination Controls */}
                    {totalCount > pagination.pageSize && (
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mt-6 bg-white/80 dark:bg-neutral-900/80 p-3 rounded-lg shadow border border-gray-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {t('showing')} {(pagination.page - 1) * pagination.pageSize + 1}
                          -{Math.min(pagination.page * pagination.pageSize, totalCount)} {t('of')} {totalCount}
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium text-muted-foreground" htmlFor="pageSizeSelect">{t('show')}</label>
                          <Select value={pagination.pageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger id="pageSizeSelect" className="w-[80px] rounded-md border-gray-200">
                              <SelectValue placeholder={t('show')} />
                            </SelectTrigger>
                            <SelectContent>
                              {[10, 20, 30, 50].map(size => (
                                <SelectItem key={size} value={size.toString()}>{t('show')} {size}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 transition disabled:opacity-50"
                            aria-label={t('previous')}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <span className="text-base font-semibold">{t('page')} {pagination.page}</span>
                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page * pagination.pageSize >= totalCount}
                            className="px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 transition disabled:opacity-50"
                            aria-label={t('next')}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage; 