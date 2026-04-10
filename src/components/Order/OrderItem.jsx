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
    <Link to={`/order_details/${orderId}`} className="flex flex-col sm:flex-row gap-3 sm:gap-5 p-4 sm:p-5 mb-3 sm:mb-4 bg-white border border-gray-100/80 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-gray-200 hover:-translate-y-0.5 group cursor-pointer relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-bl-full pointer-events-none opacity-50 transition-opacity group-hover:opacity-100" />
      
      <div className="flex flex-row items-start gap-4 sm:gap-5 w-full sm:w-auto flex-1 min-w-0 relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-50/50 border border-gray-100/80 rounded-xl overflow-hidden flex items-center justify-center p-2 group-hover:bg-white transition-colors">
          <img draggable="false" className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" src={image} alt={name} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center pt-0.5">
          <h3 className="font-bold text-gray-900 text-[13px] sm:text-[14px] line-clamp-2 mb-1.5 group-hover:text-black transition-colors leading-snug pr-6 sm:pr-0">{name}</h3>
          <p className="text-[11px] sm:text-[12px] font-medium text-gray-400 mb-1">
            {t('Qty:', 'পরিমাণ:')} <span className="text-gray-600 font-bold">{quantity}</span> <span className="mx-1.5 text-gray-300">•</span> ৳{price.toLocaleString()}
          </p>
          <div className="font-black text-gray-900 text-[13px] sm:text-[14px]">
            ৳{(quantity * price).toLocaleString()}
          </div>
        </div>

        {/* Mobile chevron */}
        <div className="shrink-0 text-gray-300 group-hover:text-gray-900 transition-colors sm:hidden absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end gap-2.5 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-3.5 sm:pt-0 border-t border-dashed border-gray-200/70 sm:border-none relative z-10">
        <div className="flex flex-row sm:flex-col sm:items-end w-full justify-between items-center gap-2 pt-0.5 sm:pt-0">
          <div className={`px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.05em] inline-flex items-center gap-1.5 rounded-lg border ${orderStatus?.toLowerCase() === 'delivered' ? 'bg-green-50/80 text-green-700 border-green-100' :
            orderStatus?.toLowerCase() === 'shipped' ? 'bg-blue-50/80 text-blue-700 border-blue-100' :
              orderStatus?.toLowerCase() === 'cancelled' ? 'bg-red-50/80 text-red-700 border-red-100' :
                'bg-amber-50/80 text-amber-700 border-amber-100'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${orderStatus?.toLowerCase() === 'delivered' ? 'bg-green-600' :
              orderStatus?.toLowerCase() === 'shipped' ? 'bg-blue-600' :
                orderStatus?.toLowerCase() === 'cancelled' ? 'bg-red-600' :
                  'bg-amber-500'
              } animate-pulse`} />
            {getStatusText()}
          </div>
          <div className="text-[10px] sm:text-[11px] font-medium text-gray-400 text-right flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {getDateText()}
          </div>
        </div>

        {/* Desktop chevron */}
        <div className="shrink-0 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100 ml-2 self-end mt-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default OrderItem;
