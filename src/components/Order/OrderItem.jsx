import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/functions';
import { LanguageContext } from '../../utils/LanguageContext';

const OrderItem = ({ orderId, name, image, price, quantity, createdAt, deliveredAt, orderStatus }) => {
  const { language } = useContext(LanguageContext);
  const t = (eng, ben) => (language === "english" ? eng : ben);

  const getStatusClass = () => {
    switch (orderStatus?.toLowerCase()) {
      case 'delivered': return 'delivered';
      case 'shipped': return 'shipped';
      case 'cancelled': return 'cancelled';
      default: return 'processing';
    }
  };

  const getStatusText = () => {
    if (orderStatus === 'Delivered') return t('Delivered', 'ডেলিভার্ড');
    if (orderStatus === 'Shipped') return t('Shipped', 'শিপড');
    if (orderStatus === 'Cancelled') return t('Cancelled', 'বাতিল');
    return t('Processing', 'প্রসেসিং');
  };

  const getDateText = () => {
    if (orderStatus === 'Delivered' && deliveredAt) {
      return `${t('Delivered', 'ডেলিভার্ড')} ${formatDate(deliveredAt)}`;
    }
    return `${t('Ordered', 'অর্ডার')} ${formatDate(createdAt)}`;
  };

  return (
    <Link to={`/order_details/${orderId}`} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-6 border-b border-gray-100 transition-colors hover:bg-gray-50/50 px-2 sm:px-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white border border-gray-100 overflow-hidden flex items-center justify-center p-1">
        <img draggable="false" className="w-full h-full object-contain" src={image} alt={name} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-bold text-gray-900 text-[13px] sm:text-sm truncate mb-1">{name}</h3>
        <p className="text-[10px] sm:text-[11px] font-medium text-gray-400 mb-1.5">
          {t('Qty:', 'পরিমাণ:')} {quantity} &nbsp;&nbsp;&nbsp; ৳{price.toLocaleString()}
        </p>
        <div className="font-bold text-gray-900 text-xs sm:text-sm">
          ৳{(quantity * price).toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col sm:items-end gap-2 mt-2 sm:mt-0">
        <div className={`px-3 py-1.5 bg-[#fef3c7] text-[#92400e] text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 self-start sm:self-auto ${orderStatus?.toLowerCase() === 'delivered' ? 'bg-[#f0fdf4] text-[#166534]' :
            orderStatus?.toLowerCase() === 'shipped' ? 'bg-[#eff6ff] text-[#1e40af]' :
              orderStatus?.toLowerCase() === 'cancelled' ? 'bg-[#fef2f2] text-[#991b1b]' :
                'bg-[#fef3c7] text-[#92400e]'
          }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${orderStatus?.toLowerCase() === 'delivered' ? 'bg-[#166534]' :
              orderStatus?.toLowerCase() === 'shipped' ? 'bg-[#1e40af]' :
                orderStatus?.toLowerCase() === 'cancelled' ? 'bg-[#991b1b]' :
                  'bg-[#92400e]'
            }`} />
          {getStatusText()}
        </div>
        <div className="text-[10px] font-medium text-gray-500">{getDateText()}</div>
      </div>
    </Link>
  );
};

export default OrderItem;
