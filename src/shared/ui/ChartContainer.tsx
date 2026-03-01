import type { ReactNode } from 'react';
import { Card } from './Card';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
}

export const ChartContainer = ({ title, children }: ChartContainerProps) => {
  return (
    <Card>
      <h3 className="text-xl font-bold text-primary mb-6">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </Card>
  );
};
