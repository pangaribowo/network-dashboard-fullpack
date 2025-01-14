import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { exportToCSV } from '../utils/csvExport';

const ComprehensiveActivityLogger = ({ logs, bandwidthData }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('24h'); // '24h', '7d', '30d'
  const [view, setView] = useState('list'); // 'list', 'chart'

  // Memoized filtered logs
  const filteredLogs = useMemo(() => {
    const timeFilter = getTimeFilterTimestamp(timeRange);
    
    return logs
      .filter(log => new Date(log.timestamp) >= timeFilter)
      .filter(log => 
        filter === 'all' || log.type.toLowerCase() === filter.toLowerCase()
      )
      .filter(log =>
        JSON.stringify(log).toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [logs, filter, searchQuery, timeRange]);

  // Handle exports
  const handleLogExport = () => {
    exportToCSV(filteredLogs, 'activity-logs.csv');
  };

  const handleBandwidthExport = () => {
    exportToCSV(bandwidthData, 'bandwidth-history.csv');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{t('activityLogs')}</h2>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* View Toggle */}
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('listView')}
            </button>
            <button
              onClick={() => setView('chart')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                view === 'chart'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('chartView')}
            </button>
          </div>

          {/* Time Range Selector */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">{t('last24Hours')}</option>
            <option value="7d">{t('last7Days')}</option>
            <option value="30d">{t('last30Days')}</option>
          </select>

          {/* Type Filter */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">{t('all')}</option>
            <option value="deviceUpdate">{t('deviceUpdate')}</option>
            <option value="bandwidthUpdate">{t('bandwidthUpdate')}</option>
            <option value="error">{t('error')}</option>
            <option value="warning">{t('warning')}</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder={t('searchLogs')}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Export Buttons */}
          <button
            onClick={handleLogExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            {t('exportLogs')}
          </button>
          {view === 'chart' && (
            <button
              onClick={handleBandwidthExport}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              {t('exportBandwidth')}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {view === 'list' ? (
          <LogList logs={filteredLogs} />
        ) : (
          <BandwidthChart data={bandwidthData} timeRange={timeRange} />
        )}
      </div>
    </div>
  );
};

// Helper Components
const LogList = ({ logs }) => {
  const { t } = useTranslation();

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noLogsFound')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log, index) => (
        <LogEntry key={index} log={log} />
      ))}
    </div>
  );
};

const LogEntry = ({ log }) => {
  const backgroundColor = getLogBackgroundColor(log.type);
  
  return (
    <div className={`p-4 rounded-lg ${backgroundColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <LogTypeIcon type={log.type} />
          <span className="font-medium">{log.type}</span>
        </div>
        <time className="text-sm text-gray-600">
          {new Date(log.timestamp).toLocaleString()}
        </time>
      </div>
      <div className="mt-2 font-mono text-sm whitespace-pre-wrap">
        {JSON.stringify(log.payload, null, 2)}
      </div>
    </div>
  );
};

const BandwidthChart = ({ data, timeRange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="upload"
            stroke="#10b981"
            name={t('upload')}
          />
          <Line
            type="monotone"
            dataKey="download"
            stroke="#3b82f6"
            name={t('download')}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Helper Functions
const getTimeFilterTimestamp = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case '7d':
      return new Date(now.setDate(now.getDate() - 7));
    case '30d':
      return new Date(now.setDate(now.getDate() - 30));
    default: // 24h
      return new Date(now.setHours(now.getHours() - 24));
  }
};

const getLogBackgroundColor = (type) => {
  const colors = {
    deviceUpdate: 'bg-blue-50',
    bandwidthUpdate: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    default: 'bg-gray-50'
  };
  return colors[type] || colors.default;
};

const LogTypeIcon = ({ type }) => {
  const iconClasses = {
    deviceUpdate: 'text-blue-600',
    bandwidthUpdate: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    default: 'text-gray-600'
  };

  const getIcon = (type) => {
    switch (type) {
      case 'deviceUpdate':
        return '🔄';
      case 'bandwidthUpdate':
        return '📊';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <span className={iconClasses[type] || iconClasses.default}>
      {getIcon(type)}
    </span>
  );
};

export default ComprehensiveActivityLogger;