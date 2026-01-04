'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

type ReportItem = {
  date: string;
  revenue: number;
  clients: number;
};

const demoData: ReportItem[] = [
  { date: '2025-01-01', revenue: 10000, clients: 50 },
  { date: '2025-02-01', revenue: 12000, clients: 55 },
  { date: '2025-03-01', revenue: 13000, clients: 60 },
  { date: '2025-04-01', revenue: 9000, clients: 45 },
  { date: '2025-05-01', revenue: 15000, clients: 70 },
];

export default function ReportModule() {
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([new Date('2025-01-01'), new Date('2025-05-01')]);

  const [filteredData, setFilteredData] =
    useState<ReportItem[]>(demoData);

  const handleDateRangeChange = (
    range: [Date | null, Date | null]
  ) => {
    setSelectedDateRange(range);

    const [start, end] = range;

    if (!start || !end) return;

    const filtered = demoData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filtered);
  };

  const chartData = {
    labels: filteredData.map((item) => item.date),
    datasets: [
      {
        label: 'Revenue',
        data: filteredData.map((item) => item.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Clients',
        data: filteredData.map((item) => item.clients),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenue and Clients Over Time',
      },
    },
  };

  const handleExportReport = () => {
    console.log('Exporting report...');
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              $
              {filteredData
                .reduce((sum, item) => sum + item.revenue, 0)
                .toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-lime-400 text-white">
          <CardHeader>
            <CardTitle>Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {filteredData.reduce(
                (sum, item) => sum + item.clients,
                0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <DatePicker
          selected={selectedDateRange[0]}
          onChange={(dates) =>
            handleDateRangeChange(
              dates as [Date | null, Date | null]
            )
          }
          startDate={selectedDateRange[0]}
          endDate={selectedDateRange[1]}
          selectsRange
          inline
        />

        <Button
          variant="outline"
          onClick={handleExportReport}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Export Report
        </Button>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
