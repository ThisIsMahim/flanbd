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
    <Link to={`/order_details/${orderId}`} className="flex flex-col sm:flex-row gap-3 sm:gap-4 py-4 sm:py-5 border-b border-gray-100 transition-all hover:bg-gray-50 active:bg-gray-100 group cursor-pointer relative">
      <div className="flex flex-row items-start gap-3 sm:gap-4 w-full sm:w-auto flex-1 min-w-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-white border border-gray-100 overflow-hidden flex items-center justify-center p-1 rounded">
          <img draggable="false" className="w-full h-full object-contain" src={image} alt={name} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center pt-0.5">
          <h3 className="font-bold text-gray-900 text-[12px] sm:text-[13px] line-clamp-2 mb-1 group-hover:text-[#ff0022] transition-colors leading-snug pr-6 sm:pr-0">{name}</h3>
          <p className="text-[10px] sm:text-[11px] font-medium text-gray-400 mb-0.5">
            {t('Qty:', 'পরিমাণ:')} {quantity} <span className="mx-1">•</span> ৳{price.toLocaleString()}
          </p>
          <div className="font-bold text-gray-900 text-[11px] sm:text-xs">
            ৳{(quantity * price).toLocaleString()}
          </div>
        </div>

        {/* Mobile chevron */}
        <div className="shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors sm:hidden absolute right-0 top-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end gap-1.5 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-dashed border-gray-200 sm:border-none">
        <div className="flex flex-row sm:flex-col sm:items-end w-full justify-between items-center gap-1.5 pt-0.5 sm:pt-0">
          <div className={`px-2 py-1.5 sm:py-1 text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 rounded ${orderStatus?.toLowerCase() === 'delivered' ? 'bg-[#f0fdf4] text-[#166534]' :
            orderStatus?.toLowerCase() === 'shipped' ? 'bg-[#eff6ff] text-[#1e40af]' :
              orderStatus?.toLowerCase() === 'cancelled' ? 'bg-[#fef2f2] text-[#991b1b]' :
                'bg-[#fef3c7] text-[#92400e]'
            }`}>
            <div className={`w-1.5 h-1.5 sm:w-1 sm:h-1 rounded-full ${orderStatus?.toLowerCase() === 'delivered' ? 'bg-[#166534]' :
              orderStatus?.toLowerCase() === 'shipped' ? 'bg-[#1e40af]' :
                orderStatus?.toLowerCase() === 'cancelled' ? 'bg-[#991b1b]' :
                  'bg-[#92400e]'
              }`} />
            {getStatusText()}
          </div>
          <div className="text-[9px] sm:text-[10px] font-medium text-gray-400 text-right">{getDateText()}</div>
        </div>

        {/* Desktop chevron */}
        <div className="shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors hidden sm:block ml-2 self-center mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default OrderItem;
