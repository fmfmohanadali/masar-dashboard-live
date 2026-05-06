import { Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Menu } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import BookingsBarChart from '../components/charts/BookingsBarChart';
import OccupancyDonutChart from '../components/charts/OccupancyDonutChart';
import CheckpointStatusCard from '../components/CheckpointStatusCard';
import LatestScansTable from '../components/LatestScansTable';
import NotificationsCard from '../components/NotificationsCard';
import LoadingCard from '../components/LoadingCard';

import BookingsPage from './BookingsPage';
import TripsPage from './TripsPage';
import TransportRequestsPage from './TransportRequestsPage';
import ContainersPage from './ContainersPage';
import TrucksPage from './TrucksPage';
import ShipsPage from './ShipsPage';
import CheckpointsPage from './CheckpointsPage';
import ReportsPage from './ReportsPage';
import UsersPage from './UsersPage';
import SettingsPage from './SettingsPage';

import Breadcrumbs from '../components/Breadcrumbs';
import { getSectionMeta } from '../config/sectionMeta';

export default function DashboardPage({ user, onLogout }) {
  const [summary, setSummary] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [scans, setScans] = useState([]);
  const [scanPoints, setScanPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pathToSection = useMemo(
    () => ({
      '/dashboard': 'dashboard',
      '/bookings': 'bookings',
      '/trips': 'trips',
      '/transport-requests': 'transport-requests',
      '/containers': 'containers',
      '/trucks': 'trucks',
      '/ships': 'ships',
      '/checkpoints': 'checkpoints',
      '/reports': 'reports',
      '/users': 'users',
      '/settings': 'settings',
    }),
    []
  );

  const sectionToPath = useMemo(
    () => ({
      dashboard: '/dashboard',
      bookings: '/bookings',
      trips: '/trips',
      'transport-requests': '/transport-requests',
      containers: '/containers',
      trucks: '/trucks',
      ships: '/ships',
      checkpoints: '/checkpoints',
      reports: '/reports',
      users: '/users',
      settings: '/settings',
    }),
    []
  );

  const activeSection = pathToSection[location.pathname] || 'dashboard';
  const currentMeta = getSectionMeta(activeSection);

  function handleNavigate(sectionKey) {
    const target = sectionToPath[sectionKey] || '/dashboard';
    navigate(target);
  }
useEffect(() => {
  document.title = currentMeta?.browserTitle || 'مسار';
}, [currentMeta]);


  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const results = await Promise.allSettled([
          api.get('/dashboard/summary/'),
          api.get('/notifications/'),
          api.get('/scan-events/'),
          api.get('/scan-points/'),
        ]);

        if (!mounted) return;

        const [summaryRes, notificationsRes, scansRes, scanPointsRes] = results;

        if (summaryRes.status === 'fulfilled') {
          setSummary(summaryRes.value.data || null);
        } else {
          console.error('dashboard summary error:', summaryRes.reason);
          setSummary(null);
        }

        if (notificationsRes.status === 'fulfilled') {
          const data = notificationsRes.value.data;
          setNotifications(
            Array.isArray(data?.results)
              ? data.results
              : Array.isArray(data)
              ? data
              : []
          );
        } else {
          console.error('notifications error:', notificationsRes.reason);
          setNotifications([]);
        }

        if (scansRes.status === 'fulfilled') {
          const data = scansRes.value.data;
          const scanList = Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data)
            ? data
            : [];
          setScans(scanList.slice(0, 5));
        } else {
          console.error('scan-events error:', scansRes.reason);
          setScans([]);
        }

        if (scanPointsRes.status === 'fulfilled') {
          const data = scanPointsRes.value.data;
          const pointList = Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data)
            ? data
            : [];
          setScanPoints(pointList);
        } else {
          console.error('scan-points error:', scanPointsRes.reason);
          setScanPoints([]);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Unexpected dashboard load error:', err);
        setError('تعذر تحميل بيانات اللوحة');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const chartsData = useMemo(() => {
    const labels = [
      '00:00',
      '02:00',
      '04:00',
      '06:00',
      '08:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00',
      '20:00',
      '22:00',
      '24:00',
    ];

    const ratios = [0.03, 0.05, 0.07, 0.12, 0.18, 0.23, 0.28, 0.20, 0.19, 0.16, 0.10, 0.06, 0.03];

    const base = labels.map((_, i) =>
      Math.max(0, Math.round((summary?.total_trips || 0) * ratios[i]))
    );

    const capacity = labels.map((_, i) => Math.max(base[i] + 10, 20));

    return {
      labels,
      values: base,
      capacity,
    };
  }, [summary]);

  const occupancy = useMemo(() => {
    const occupied = Math.min(100, (summary?.inside_port || 0) > 0 ? 64 : 24);
    const available = Math.max(0, 100 - occupied - 12);

    return {
      occupied,
      available,
      maintenance: 12,
    };
  }, [summary]);

  const stats = useMemo(
    () => [
      {
        title: 'متوسط وقت الانتظار',
        value: summary ? '2:45' : '--',
        unit: 'ساعة',
        trend: '+15% عن الأمس',
        trendPositive: true,
        color: 'bg-violet-100 text-violet-700',
        icon: 'clock',
      },
      {
        title: 'الحاويات داخل الميناء',
        value: summary ? String(summary.inside_port ?? 0) : '--',
        unit: 'حاوية',
        trend: '+8% عن الأمس',
        trendPositive: false,
        color: 'bg-amber-100 text-amber-700',
        icon: 'container',
      },
      {
        title: 'العمليات اليوم',
        value: summary ? String(summary.total_trips ?? 0) : '--',
        unit: 'عملية',
        trend: '+12% عن الأمس',
        trendPositive: true,
        color: 'bg-blue-100 text-blue-700',
        icon: 'calendar',
      },
      {
        title: 'إجمالي الرحلات المسلمة',
        value: summary ? String(summary.delivered ?? 0) : '--',
        unit: 'رحلة',
        trend: '+10% عن الأمس',
        trendPositive: true,
        color: 'bg-emerald-100 text-emerald-700',
        icon: 'dollar',
      },
    ],
    [summary]
  );

  function renderDashboardHome() {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-6">
          <div className="xl:col-span-6">
            {loading ? (
              <LoadingCard text="جاري تحميل الرسم البياني..." />
            ) : (
              <BookingsBarChart
                labels={chartsData.labels}
                values={chartsData.values}
                capacity={chartsData.capacity}
              />
            )}
          </div>

          <div className="xl:col-span-3">
            {loading ? (
              <LoadingCard text="جاري تحميل الإشغال..." />
            ) : (
              <OccupancyDonutChart
                occupied={occupancy.occupied}
                available={occupancy.available}
                maintenance={occupancy.maintenance}
              />
            )}
          </div>

          <div className="xl:col-span-3">
            {loading ? (
              <LoadingCard text="جاري تحميل نقاط التفتيش..." />
            ) : (
              <CheckpointStatusCard points={scanPoints} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7">
            {loading ? (
              <LoadingCard text="جاري تحميل آخر عمليات المسح..." />
            ) : (
              <LatestScansTable scans={scans} />
            )}
          </div>

          <div className="xl:col-span-5">
            {loading ? (
              <LoadingCard text="جاري تحميل التنبيهات..." />
            ) : (
              <NotificationsCard notifications={notifications} />
            )}
          </div>
        </div>
      </>
    );
  }

  function renderSection() {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardHome();

      case 'bookings':
        return <BookingsPage />;

      case 'trips':
        return <TripsPage />;
        
      case 'transport-requests':
        return <TransportRequestsPage />;  

      case 'containers':
        return <ContainersPage />;

      case 'trucks':
        return <TrucksPage />;

      case 'ships':
        return <ShipsPage />;

      case 'checkpoints':
        return <CheckpointsPage />;

      case 'reports':
        return <ReportsPage />;

      case 'users':
        return <UsersPage user={user} />;

      case 'settings':
        return <SettingsPage user={user} />;

      default:
        return renderDashboardHome();
    }
  }

  return (
    <div className="min-h-screen bg-soft flex flex-row-reverse">
      <Sidebar
      onLogout={onLogout}
      isOpen={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
    />

      <main className="flex-1 p-6 lg:p-8 overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">

          <button
            onClick={() => window.print()}
            className="hidden lg:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-2xl shadow-soft hover:bg-blue-700 transition"
          >
            <Download size={18} />
            تصدير تقرير
          </button>
        </div>
        <div className="flex items-start gap-3">
         <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden bg-white border border-slate-100 rounded-2xl p-3 shadow-soft text-slate-700"
          aria-label="فتح القائمة"
        >
         <Menu size={22} />
        </button>

         <Topbar
         user={user}
         notificationCount={notifications.length}
         title={currentMeta.title}
         subtitle={currentMeta.subtitle}
        />
       </div>

        {error ? (
          <div className="mb-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        ) : null}

        {renderSection()}

        <div className="text-center text-slate-500 text-sm mt-8">
          © تطوير : مهند السعدي — جميع الحقوق محفوظة
        </div>
      </main>
    </div>
  );
}