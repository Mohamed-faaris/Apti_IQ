import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';
import { ChartContainer } from '../../../shared/ui/ChartContainer';
import { StatCard } from '../../../shared/ui/StatCard';
import { SkeletonCard } from '../../../shared/ui/Skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS],
    queryFn: api.analytics.get,
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const subjectAccuracyData = {
    labels: analytics?.subjectAccuracy.map((s) => s.subject) || [],
    datasets: [
      {
        label: 'Accuracy (%)',
        data: analytics?.subjectAccuracy.map((s) => s.accuracy) || [],
        backgroundColor: 'rgba(155, 89, 182, 0.8)',
        borderColor: 'rgba(155, 89, 182, 1)',
        borderWidth: 2,
      },
    ],
  };

  const performanceData = {
    labels: analytics?.performanceOverTime.map((p) => p.date) || [],
    datasets: [
      {
        label: 'Score (%)',
        data: analytics?.performanceOverTime.map((p) => p.score) || [],
        borderColor: 'rgba(44, 62, 80, 1)',
        backgroundColor: 'rgba(44, 62, 80, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const strengthWeaknessData = {
    labels: analytics?.strengthWeakness.map((s) => s.label) || [],
    datasets: [
      {
        data: analytics?.strengthWeakness.map((s) => s.value) || [],
        backgroundColor: ['rgba(39, 174, 96, 0.8)', 'rgba(231, 76, 60, 0.8)'],
        borderColor: ['rgba(39, 174, 96, 1)', 'rgba(231, 76, 60, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Avg Time/Question"
          value={`${analytics?.avgTimePerQuestion || 0} min`}
          icon="⏱️"
        />
        <StatCard
          title="Overall Accuracy"
          value="85%"
          icon="🎯"
          trend="up"
          trendValue="+5%"
        />
        <StatCard
          title="Tests Completed"
          value="24"
          icon="📝"
        />
        <StatCard
          title="Study Streak"
          value="7 days"
          icon="🔥"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartContainer title="Subject-wise Accuracy">
          <Bar data={subjectAccuracyData} options={chartOptions} />
        </ChartContainer>

        <ChartContainer title="Performance Over Time">
          <Line data={performanceData} options={chartOptions} />
        </ChartContainer>

        <ChartContainer title="Strengths vs Weaknesses">
          <Pie data={strengthWeaknessData} options={chartOptions} />
        </ChartContainer>

        <ChartContainer title="Recent Trends">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-6xl mb-4">📈</p>
              <p className="text-gray-600">Your performance is improving!</p>
              <p className="text-2xl font-bold text-green-600 mt-2">+12% this week</p>
            </div>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};

export default AnalyticsPage;
