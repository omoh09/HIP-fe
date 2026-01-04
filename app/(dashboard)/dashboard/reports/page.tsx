'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2'; // Importing Line chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js'; // Import the missing elements
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for the datepicker

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,  // Register PointElement
  LineElement    // Register LineElement
);

const demoData = [
  { date: '2025-01-01', revenue: 10000, clients: 50 },
  { date: '2025-02-01', revenue: 12000, clients: 55 },
  { date: '2025-03-01', revenue: 13000, clients: 60 },
  { date: '2025-04-01', revenue: 9000, clients: 45 },
  { date: '2025-05-01', revenue: 15000, clients: 70 },
];

export default function ReportModule() {
  const [selectedDateRange, setSelectedDateRange] = useState<[Date, Date]>([new Date('2025-01-01'), new Date('2025-05-01')]);
  const [filteredData, setFilteredData] = useState(demoData);

  // Filter data based on the selected date range
  const handleDateRangeChange = (range: [Date, Date]) => {
    setSelectedDateRange(range);

    const filtered = demoData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= range[0] && itemDate <= range[1];
    });
    setFilteredData(filtered);
  };

  // Chart Data Setup
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

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue and Clients Over Time',
      },
    },
  };

  const handleExportReport = () => {
    console.log('Exporting report...');
    // Implement export logic, like converting chart data to CSV/PDF
  };

  return (
    <div className="space-y-6">
      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-xl rounded-lg hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">${filteredData.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-lime-400 text-white shadow-xl rounded-lg hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle>Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{filteredData.reduce((sum, item) => sum + item.clients, 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-full sm:w-1/3">
          <DatePicker
            selected={selectedDateRange[0]}
            onChange={(dates: [Date, Date]) => handleDateRangeChange(dates)}
            startDate={selectedDateRange[0]}
            endDate={selectedDateRange[1]}
            selectsRange
            inline
          />
        </div>
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
