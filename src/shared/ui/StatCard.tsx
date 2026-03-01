import { motion } from 'framer-motion';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export const StatCard = ({ title, value, icon, trend, trendValue }: StatCardProps) => {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-primary"
          >
            {value}
          </motion.p>
          {trendValue && (
            <p className={`text-sm mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <span className="text-4xl">{icon}</span>
        )}
      </div>
    </Card>
  );
};
