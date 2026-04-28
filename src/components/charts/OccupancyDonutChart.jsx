import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OccupancyDonutChart({ occupied = 64, available = 24, maintenance = 12 }) {
  const data = {
    labels: ['محجوز', 'متاح', 'صيانة'],
    datasets: [{
      data: [occupied, available, maintenance],
      backgroundColor: ['#2f74d0', '#2db85d', '#f59e0b'],
      borderWidth: 0,
      cutout: '72%',
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 h-[330px] flex flex-col">
      <div className="text-lg font-bold text-slate-900 mb-4">مستوى الإشغال الحالي</div>
      <div className="relative flex-1">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-4xl font-black text-slate-900">{occupied}%</div>
          <div className="text-sm text-slate-500">مستوى الإشغال</div>
        </div>
      </div>
    </div>
  );
}
