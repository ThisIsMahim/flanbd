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
    <Link to={`/order_details/${orderId}`} className="order-item-card">
      <div className="order-item-image">
        <img draggable="false" src={image} alt={name} />
      </div>

      <div className="order-item-details">
        <div className="order-item-name">{name}</div>
        <div className="order-item-meta">
          <span>{t('Qty:', 'পরিমাণ:')} {quantity}</span>
          <span>৳{price.toLocaleString()}</span>
        </div>
        <div className="order-item-price">
          ৳{(quantity * price).toLocaleString()}
        </div>
      </div>

      <div className="order-item-status">
        <div className={`order-status-badge ${getStatusClass()}`}>
          <span className="order-status-dot" />
          {getStatusText()}
        </div>
        <div className="order-item-date">{getDateText()}</div>
      </div>
    </Link>
  );
};

export default OrderItem;
