import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { useContext, useEffect, useMemo } from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../actions/orderAction';
import { getAdminProducts } from '../../actions/productAction';
import { getAllUsers } from '../../actions/userAction';
import { LanguageContext } from '../../utils/LanguageContext';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          family: "'Inter', sans-serif",
          weight: 'medium'
        },
        usePointStyle: true,
        padding: 20
      },
    },
  },
};

const MainData = () => {
  const dispatch = useDispatch();
  const { language } = useContext(LanguageContext);

  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.users);

  // Translation content
  const content = {
    english: {
      metaTitle: "Admin Dashboard | EyeGears",
      stats: {
        sales: "Total Sales Amount",
        orders: "Total Orders",
        products: "Total Products",
        users: "Total Users"
      },
      charts: {
        orderStatus: "Order Status",
        stockStatus: "Stock Status",
        products: "Products",
        outOfStock: "Out of Stock",
        inStock: "In Stock",
        statuses: ['Processing', 'Shipped', 'Delivered'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December']
      }
    },
    bangla: {
      metaTitle: "অ্যাডমিন ড্যাশবোর্ড | স্টোরি মেকার বিডি",
      stats: {
        sales: "মোট বিক্রয় পরিমাণ",
        orders: "মোট অর্ডার",
        products: "মোট পণ্য",
        users: "মোট ব্যবহারকারী"
      },
      charts: {
        orderStatus: "অর্ডার অবস্থা",
        stockStatus: "স্টক অবস্থা",
        products: "পণ্য",
        outOfStock: "স্টক নেই",
        inStock: "স্টকে আছে",
        statuses: ['প্রক্রিয়াধীন', 'শিপ করা হয়েছে', 'ডেলিভারি দেওয়া হয়েছে'],
        months: ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
      }
    }
  };

  const outOfStock = useMemo(() => {
    return products?.filter(item => item.stock === 0).length || 0;
  }, [products]);

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  const totalAmount = useMemo(() => {
    return orders?.reduce((total, order) => total + order.totalPrice, 0) || 0;
  }, [orders]);

  const date = new Date();

  const lineState = useMemo(() => ({
    labels: content[language].charts.months,
    datasets: [
      {
        label: language === 'english' 
          ? `Sales in ${date.getFullYear() - 2}` 
          : `${date.getFullYear() - 2} সালে বিক্রয়`,
        borderColor: '#8A39E1',
        backgroundColor: 'rgba(138, 57, 225, 0.3)',
        borderWidth: 2,
        pointBackgroundColor: '#8A39E1',
        pointBorderColor: '#fff',
        pointRadius: 4,
        tension: 0.3,
        data: content[language].charts.months.map((_, i) => 
          orders?.filter(od => 
            new Date(od.createdAt).getMonth() === i && 
            new Date(od.createdAt).getFullYear() === date.getFullYear() - 2
          ).reduce((total, od) => total + od.totalPrice, 0) || 0
        )
      },
      {
        label: language === 'english' 
          ? `Sales in ${date.getFullYear() - 1}` 
          : `${date.getFullYear() - 1} সালে বিক্রয়`,
        borderColor: 'var(--brand-yellow)',
        backgroundColor: 'rgba(245, 158, 11, 0.3)',
        borderWidth: 2,
        pointBackgroundColor: 'var(--brand-yellow)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        tension: 0.3,
        data: content[language].charts.months.map((_, i) => 
          orders?.filter(od => 
            new Date(od.createdAt).getMonth() === i && 
            new Date(od.createdAt).getFullYear() === date.getFullYear() - 1
          ).reduce((total, od) => total + od.totalPrice, 0) || 0
        )
      },
      {
        label: language === 'english' 
          ? `Sales in ${date.getFullYear()}` 
          : `${date.getFullYear()} সালে বিক্রয়`,
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.3)',
        borderWidth: 2,
        pointBackgroundColor: '#4ade80',
        pointBorderColor: '#fff',
        pointRadius: 4,
        tension: 0.3,
        data: content[language].charts.months.map((_, i) => 
          orders?.filter(od => 
            new Date(od.createdAt).getMonth() === i && 
            new Date(od.createdAt).getFullYear() === date.getFullYear()
          ).reduce((total, od) => total + od.totalPrice, 0) || 0
        )
      }
    ],
  }), [orders, date, language]);

  const pieState = useMemo(() => ({
    labels: content[language].charts.statuses,
    datasets: [
      {
        backgroundColor: ['#9333ea', '#facc15', '#4ade80'],
        hoverBackgroundColor: ['#a855f7', '#fde047', '#86efac'],
        borderWidth: 2,
        borderColor: '#fff',
        data: content[language].charts.statuses.map(status => 
          orders?.filter(item => {
            if (language === 'english') {
              return item.orderStatus === status;
            } else {
              const statusMap = {
                'Processing': 'প্রক্রিয়াধীন',
                'Shipped': 'শিপ করা হয়েছে',
                'Delivered': 'ডেলিভারি দেওয়া হয়েছে'
              };
              return statusMap[item.orderStatus] === status;
            }
          }).length || 0
        ),
      },
    ],
  }), [orders, language]);

  const doughnutState = useMemo(() => ({
    labels: [content[language].charts.outOfStock, content[language].charts.inStock],
    datasets: [
      {
        backgroundColor: ['#ef4444', '#22c55e'],
        hoverBackgroundColor: ['#dc2626', '#16a34a'],
        borderWidth: 2,
        borderColor: '#fff',
        data: [outOfStock, (products?.length || 0) - outOfStock],
      },
    ],
  }), [products, outOfStock, language]);

  const barState = useMemo(() => ({
    labels: categories.map(cat => 
      language === 'english' ? cat : 
      ({
        'Fiction': 'ফিকশন',
        'Non-Fiction': 'নন-ফিকশন',
        'Science': 'বিজ্ঞান',
        'History': 'ইতিহাস',
        'Biography': 'জীবনী',
        'Children': 'শিশু',
        'Poetry': 'কবিতা',
        'Romance': 'রোমান্স',
        'Thriller': 'থ্রিলার',
        'Fantasy': 'ফ্যান্টাসি'
      }[cat] || cat)
    ),
    datasets: [
      {
        label: content[language].charts.products,
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.7)',
        hoverBackgroundColor: 'rgba(107, 33, 168, 0.8)',
        borderWidth: 1,
        borderRadius: 6,
        data: categories.map(cat => 
          products?.filter(item => item.category === cat).length || 0
        ),
      },
    ],
  }), [products, language]);

  return (
    <div className="w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
      <MetaData title={content[language].metaTitle} />

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
        <div className="flex flex-col bg-gradient-to-br from-purple-600 to-purple-700 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 p-4 sm:p-6 transition-all duration-300">
          <h4 className="text-gray-100 text-sm sm:text-base font-medium">{content[language].stats.sales}</h4>
          <h2 className="text-xl sm:text-2xl font-bold">৳{totalAmount.toLocaleString()}</h2>
        </div>
        <div className="flex flex-col bg-gradient-to-br from-red-500 to-red-600 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 p-4 sm:p-6 transition-all duration-300">
          <h4 className="text-gray-100 text-sm sm:text-base font-medium">{content[language].stats.orders}</h4>
          <h2 className="text-xl sm:text-2xl font-bold">{orders?.length || 0}</h2>
        </div>
        <div className="flex flex-col bg-gradient-to-br from-red-500 to-red-600 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 p-4 sm:p-6 transition-all duration-300">
          <h4 className="text-gray-100 text-sm sm:text-base font-medium">{content[language].stats.products}</h4>
          <h2 className="text-xl sm:text-2xl font-bold">{products?.length || 0}</h2>
        </div>
        <div className="flex flex-col bg-gradient-to-br from-green-500 to-emerald-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 p-4 sm:p-6 transition-all duration-300">
          <h4 className="text-gray-100 text-sm sm:text-base font-medium">{content[language].stats.users}</h4>
          <h2 className="text-xl sm:text-2xl font-bold">{users?.length || 0}</h2>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6 w-full">
        {/* Line Chart */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl h-[400px] shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
          <h3 className="text-gray-800 font-medium text-center mb-2">Monthly Sales</h3>
          <Line 
            data={lineState} 
            options={{
              ...commonOptions,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                      family: "'Inter', sans-serif",
                    }
                  }
                },
                y: {
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  ticks: {
                    font: {
                      family: "'Inter', sans-serif",
                    }
                  }
                }
              }
            }} 
          />
        </div>
        
        {/* Pie Chart */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 h-[400px] flex flex-col">
          <span className="font-medium uppercase text-gray-800 text-center mb-2">
            {content[language].charts.orderStatus}
          </span>
          <div className="flex-1">
            <Pie data={pieState} options={commonOptions} />
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6 w-full">
        {/* Bar Chart */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl h-[400px] shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
          <h3 className="text-gray-800 font-medium text-center mb-2">Products by Category</h3>
          <Bar 
            data={barState} 
            options={{
              ...commonOptions,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                      family: "'Inter', sans-serif",
                    }
                  }
                },
                y: {
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  ticks: {
                    font: {
                      family: "'Inter', sans-serif",
                    }
                  }
                }
              }
            }} 
          />
        </div>
        
        {/* Doughnut Chart */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 h-[400px] flex flex-col">
          <span className="font-medium uppercase text-gray-800 text-center mb-2">
            {content[language].charts.stockStatus}
          </span>
          <div className="flex-1">
            <Doughnut data={doughnutState} options={commonOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainData;

