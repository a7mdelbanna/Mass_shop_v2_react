import React from 'react';
import { Order } from '@/types/order';
import { BaseTable, TableColumn, formatDate } from '@/components/ui/base-table';
import { useTranslation } from 'react-i18next';
import { acceptOrder, rejectOrder, updateOrderStatus } from '@/services/order-service';
import { toast } from 'sonner';
import { Check, X, Truck } from 'lucide-react';
import { sweetAlert } from '@/utils/alert';

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewDetails: (order: Order) => void;
  onActionComplete: () => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  isLoading,
  onViewDetails,
  onActionComplete,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [actionLoading, setActionLoading] = React.useState<number | null>(null);

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'NewOrders':
      case 'Preparing':
      case 'Prepared':
        return 'bg-primary';
      case 'Delivered':
        return 'bg-success';
      case 'Rejected':
      case 'NotDelivered':
      case 'Canceled':
        return 'bg-danger';
      case 'OutForDelivery':
      case 'DeliveryBoyAssigned':
      case 'AlmostThere':
        return 'bg-warning text-dark';
      case 'Scheduled':
        return 'bg-secondary';
      case 'ReplacementOrders':
        return 'bg-info';
      default:
        return 'bg-info';
    }
  };

  const columns: TableColumn<Order>[] = [
    {
      key: 'id',
      header: t('orderId'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (order) => <span className="font-medium">#{order.id}</span>,
    },

    {
      key: 'customer',
      header: t('customer'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (order) => order.customer.fullName,
    },
    {
      key: 'orderStatus',
      header: t('status'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (order) => (
        <span className={`badge ${statusBadgeClass(order.orderStatus)} text-white`}>
          {t(order.orderStatus)}
        </span>
      ),
    },
    {
      key: 'orderEznDate',
      header: t('date'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (order) => formatDate(order.orderEznDate, order.orderEznTime),
    },
    {
      key: 'orderEznNetValue',
      header: t('total'),
      className: isRTL ? 'text-right' : 'text-left',
      cell: (order) => order.orderEznNetValue.toFixed(2),
    },
    {
      key: 'actions',
      header: t('actions'),
      className: `${isRTL ? 'text-right' : 'text-left'} w-32`,
      cell: (order) => (
        <div className="flex gap-5 items-center">
          <button
            className="btn btn-icon btn-sm btn-light-primary"
            onClick={() => onViewDetails(order)}
          >
            <i className="ki-duotone ki-eye fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </button>
          {order.orderStatus === 'NewOrders' && (
            <>
              <button
                className="flex items-center gap-2 rounded-full px-4 py-1 font-semibold shadow bg-success text-white hover:bg-green-700 transition disabled:opacity-60"
                disabled={actionLoading === order.id}
                onClick={async () => {
                  setActionLoading(order.id);
                  try {
                    await acceptOrder('1', order.id);
                    toast.success(t('orderAccepted'));
                    await sweetAlert.fire({ icon: 'success', title: t('orderAccepted') });
                    onActionComplete && onActionComplete();
                  } catch (e: any) {
                    toast.error(e.message || t('failedToAcceptOrder'));
                  } finally {
                    setActionLoading(null);
                  }
                }}
              >
                <Check className="w-4 h-4" />
                {actionLoading === order.id ? t('loading') : t('accept')}
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-4 py-1 font-semibold shadow bg-danger text-white hover:bg-red-700 transition disabled:opacity-60"
                disabled={actionLoading === order.id}
                onClick={async () => {
                  setActionLoading(order.id);
                  try {
                    await rejectOrder('1', order.id);
                    toast.success(t('orderRejected'));
                    await sweetAlert.fire({ icon: 'success', title: t('orderRejected') });
                    onActionComplete && onActionComplete();
                  } catch (e: any) {
                    toast.error(e.message || t('failedToRejectOrder'));
                  } finally {
                    setActionLoading(null);
                  }
                }}
              >
                <X className="w-4 h-4" />
                {actionLoading === order.id ? t('loading') : t('reject')}
              </button>
            </>
          )}
          {order.orderStatus === 'Preparing' && (
            <button
              className="flex items-center gap-2 rounded-full px-4 py-1 font-semibold shadow bg-primary text-white hover:bg-blue-700 transition disabled:opacity-60"
              disabled={actionLoading === order.id}
              onClick={async () => {
                setActionLoading(order.id);
                try {
                  await updateOrderStatus('1', [order.id], 8); // 8 = Prepared
                  toast.success(t('orderMarkedPrepared'));
                  await sweetAlert.fire({ icon: 'success', title: t('orderMarkedPrepared') });
                  onActionComplete && onActionComplete();
                } catch (e: any) {
                  toast.error(e.message || t('failedToMarkPrepared'));
                } finally {
                  setActionLoading(null);
                }
              }}
            >
              <Check className="w-4 h-4" />
              {actionLoading === order.id ? t('loading') : t('markAsPrepared')}
            </button>
          )}
          {order.orderStatus === 'Prepared' && (
            <button
              className="flex items-center gap-2 rounded-full px-4 py-1 font-semibold shadow bg-primary text-white hover:bg-blue-700 transition disabled:opacity-60"
              disabled={actionLoading === order.id}
              onClick={async () => {
                setActionLoading(order.id);
                try {
                  await updateOrderStatus('1', [order.id], 3); // 3 = OutForDelivery
                  toast.success(t('orderMarkedOutForDelivery'));
                  await sweetAlert.fire({ icon: 'success', title: t('orderMarkedOutForDelivery') });
                  onActionComplete && onActionComplete();
                } catch (e: any) {
                  toast.error(e.message || t('failedToMarkOutForDelivery'));
                } finally {
                  setActionLoading(null);
                }
              }}
            >
              <Truck className="w-4 h-4" />
              {actionLoading === order.id ? t('loading') : t('markAsOutForDelivery')}
            </button>
          )}
          {order.orderStatus === 'OutForDelivery' && (
            <>
              <button
                className="flex items-center gap-2 rounded-full px-4 py-1 font-semibold shadow bg-success text-white hover:bg-green-700 transition disabled:opacity-60"
                disabled={actionLoading === order.id}
                onClick={async () => {
                  setActionLoading(order.id);
                  try {
                    await updateOrderStatus('1', [order.id], 5); // 5 = Delivered
                    toast.success(t('orderMarkedDelivered'));
                    await sweetAlert.fire({ icon: 'success', title: t('orderMarkedDelivered') });
                    onActionComplete && onActionComplete();
                  } catch (e: any) {
                    toast.error(e.message || t('failedToMarkDelivered'));
                  } finally {
                    setActionLoading(null);
                  }
                }}
              >
                <Check className="w-4 h-4" />
                {actionLoading === order.id ? t('loading') : t('markAsDelivered')}
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-4 py-1 font-semibold shadow bg-danger text-white hover:bg-red-700 transition disabled:opacity-60"
                disabled={actionLoading === order.id}
                onClick={async () => {
                  setActionLoading(order.id);
                  try {
                    await updateOrderStatus('1', [order.id], 10); // 10 = NotDelivered
                    toast.success(t('orderMarkedNotDelivered'));
                    await sweetAlert.fire({ icon: 'success', title: t('orderMarkedNotDelivered') });
                    onActionComplete && onActionComplete();
                  } catch (e: any) {
                    toast.error(e.message || t('failedToMarkNotDelivered'));
                  } finally {
                    setActionLoading(null);
                  }
                }}
              >
                <X className="w-4 h-4" />
                {actionLoading === order.id ? t('loading') : t('markAsNotDelivered')}
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <BaseTable
      data={orders}
      columns={columns}
      isLoading={isLoading}
      getItemId={(order) => order.id}
    />
  );
};

export default OrderTable;
