import React from 'react';
import { Order } from '@/types/order';
import { useTranslation } from 'react-i18next';

interface OrderDetailsProps {
  order: Order;
  onClose?: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const paymentMethodMap = {
    1: 'Paymob',
    2: 'Wallet',
    3: 'CashOnDeliver',
  };
  const paymentStatusMap = {
    1: 'Pending',
    2: 'Completed',
    3: 'Failed',
  };
    return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{t('orderDetailsTitle', { id: order.id })}</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition">&times;</button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-2"><span className="font-semibold text-gray-600">{t('status')}:</span> <span className="text-gray-800">{t(order.orderStatus)}</span></div>
          <div className="mb-2"><span className="font-semibold text-gray-600">{t('date')}:</span> <span className="text-gray-800">{order.orderEznDate} {order.orderEznTime}</span></div>
          <div className="mb-2"><span className="font-semibold text-gray-600">{t('payment')}:</span> <span className="text-gray-800">{t(paymentMethodMap[order.paymentMethod] || order.paymentMethod)} ({t(paymentStatusMap[order.paymentStatus] || order.paymentStatus)})</span></div>
          <div className="mb-2"><span className="font-semibold text-gray-600">{t('deliveryBoy')}:</span> <span className="text-gray-800">{order.deliveryBoyName || t('notAvailable')}</span></div>
        </div>
        <div>
          <h3 className="font-semibold text-primary uppercase tracking-wide text-xs mb-1">{t('customer')}</h3>
          <div className="text-gray-800">{order.customer.fullName}</div>
          <div className="text-gray-500">{order.customer.phoneNumber}</div>
          <div className="text-gray-500">{order.customer.email}</div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold text-primary uppercase tracking-wide text-xs mb-1">{t('address')}</h3>
        <div className="text-primary-800">{order.address.shopName}</div>
        <div className="text-primary-500">{order.address.street}</div>
        <div className="text-primary-500">{order.address.areaName}, {order.address.cityName}</div>
        <div className="text-primary-400 text-sm">{order.address.deliveryNotes}</div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold text-primary uppercase tracking-wide text-xs mb-2">{t('items')}</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm bg-white/60 rounded-lg">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th  className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('name')}</th>
                <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('qty')}</th>
                <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('unit')}</th>
                <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('price')}</th>
                <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('total')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.itemDetails.map((item, idx) => (
                <tr key={item.itemId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 text-gray-800">{item.eznItemName}</td>
                  <td className="p-3 text-gray-700">{item.eznItemAmount}</td>
                  <td className="p-3 text-gray-700">{isRTL? item.itemUnit.nameAR : item.itemUnit.nameEN}({item.itemUnit.amount})</td>
                  <td className="p-3 text-gray-700">{Number(item.eznItemPrice).toFixed(2)}</td>
                  <td className="p-3 text-gray-900 font-semibold">{Number(item.eznItemTotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-2 mb-2">
        <div className="flex justify-between text-gray-700"><span className="font-semibold">{t('subtotal')}:</span> <span>{Number(order.orderEznTotal).toFixed(2)}</span></div>
        <div className="flex justify-between text-gray-700"><span className="font-semibold">{t('vat')}:</span> <span>{Number(order.orderEznTotalVatValue).toFixed(2)}</span></div>
        <div className="flex justify-between text-gray-700"><span className="font-semibold">{t('tax')}:</span> <span>{Number(order.orderEznTotalTaxValue).toFixed(2)}</span></div>
        <div className="flex justify-between text-gray-700"><span className="font-semibold">{t('discount')}:</span> <span>{Number(order.orderEznTotalOfferDisValue).toFixed(2)}</span></div>
        <div className="flex justify-between text-gray-700"><span className="font-semibold">{t('couponDiscount')}:</span> <span>{Number(order.couponDisVal).toFixed(2)}</span></div>
        <div className="flex justify-between text-gray-700"><span className="font-semibold">{t('deliveryFee')}:</span> <span>{order.deliveryFeeInfo ? Number(order.deliveryFeeInfo.price).toFixed(2) : t('notAvailable')}</span></div>
        <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 mt-3 font-bold text-lg text-primary shadow-sm">
          <span>{t('netTotal')}:</span> 
          <span>
            {Number(order.orderEznNetValue).toFixed(2)}
            <span className="mx-1 text-base text-gray-600 font-normal">{isRTL? "جنيه مصري" : "ُEGP"}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 