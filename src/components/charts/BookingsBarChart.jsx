import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export default function BookingsBarChart({ labels, values, capacity }) {
  const data = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'الحجوزات',
        data: values,
        backgroundColor: '#2f74d0',
        borderRadius: 8,
        maxBarThickness: 28,
      },
      {
        type: 'line',
        label: 'السعة المتاحة',
        data: capacity,
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
      tooltip: { rtl: true },
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
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 h-[330px]">
      <div className="text-lg font-bold text-slate-900 mb-4">توزيع الحجوزات على ساعات اليوم</div>
      <Bar data={data} options={options} />
    </div>
  );
}
