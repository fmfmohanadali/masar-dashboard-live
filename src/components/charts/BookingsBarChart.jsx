import { Bar } from 'react-chartjs-2';

export default function BookingsBarChart({
  labels = [],
  values = [],
  capacity = [],
}) {
  const safeLabels = Array.isArray(labels) ? labels : [];
  const safeValues = Array.isArray(values) ? values : [];
  const safeCapacity = Array.isArray(capacity) ? capacity : [];

  const data = {
    labels: safeLabels,
    datasets: [
      {
        type: 'bar',
        label: 'الحجوزات',
        data: safeValues,
        backgroundColor: '#2f74d0',
        borderRadius: 8,
        maxBarThickness: 28,
      },
      {
        type: 'line',
        label: 'السعة المتاحة',
        data: safeCapacity,
        borderColor: '#b3bcc8',
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [6, 6],
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        rtl: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b' },
        grid: { color: '#e5e7eb' },
      },
    },
  };

  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 h-[360px]">
      <div className="mb-4">
        <h3 className="text-xl font-black text-slate-900">
          توزيع الحجوزات على ساعات اليوم
        </h3>

        <p className="text-sm text-slate-400 mt-1">
          مقارنة بين الحجوزات والسعة المتاحة
        </p>
      </div>

      <div className="h-[270px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}