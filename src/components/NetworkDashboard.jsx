import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useWebSocketContext } from './WebSocketProvider';
import DeviceFilter from './DeviceFilter';
import BandwidthPriorityControl from './BandwidthPriorityControl';
import ActivityLogger from './ActivityLogger';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Alert, AlertDescription } from './ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Settings, RefreshCw, Search, WifiOff, Wifi } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_BANDWIDTH_HISTORY = 100;
const MAX_ACTIVITY_LOGS = 50;
const REFRESH_INTERVAL = 5000;

const NetworkDashboard = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [bandwidthHistory, setBandwidthHistory] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { socket, isConnected, error, reconnect } = useWebSocketContext();

  // Network Statistics
  const networkStats = useMemo(() => {
    const totalDevices = connectedDevices.length;
    const onlineDevices = connectedDevices.filter(d => d.status === 'Online').length;
    const totalBandwidth = connectedDevices.reduce((sum, device) => sum + (device.bandwidth || 0), 0);
    const avgBandwidth = totalDevices ? totalBandwidth / totalDevices : 0;

    return {
      totalDevices,
      onlineDevices,
      totalBandwidth: totalBandwidth.toFixed(2),
      avgBandwidth: avgBandwidth.toFixed(2)
    };
  }, [connectedDevices]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket]);

  useEffect(() => {
    let interval;
    if (autoRefresh && isConnected) {
      interval = setInterval(() => {
        socket.send(JSON.stringify({ type: 'requestUpdate' }));
      }, REFRESH_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, isConnected, socket]);

  const handleWebSocketMessage = useCallback((data) => {
    const { type, payload } = data;
    const timestamp = new Date().toISOString();

    setActivityLogs((prevLogs) => [
      { type, timestamp, payload },
      ...prevLogs.slice(0, MAX_ACTIVITY_LOGS - 1)
    ]);

    switch (type) {
      case 'deviceUpdate':
        setConnectedDevices(payload.devices || []);
        break;

      case 'bandwidthUpdate':
        setBandwidthHistory((prev) => [
          ...prev.slice(-MAX_BANDWIDTH_HISTORY + 1),
          { timestamp, ...payload }
        ]);
        break;

      case 'error':
        toast.error(payload.message);
        break;

      default:
        console.warn('Unknown message type:', type);
    }
  }, []);

  const handlePriorityChange = useCallback((deviceId, priority) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'updatePriority',
        payload: { deviceId, priority }
      }));
    }

    setConnectedDevices((devices) =>
      devices.map((device) =>
        device.id === deviceId ? { ...device, priority } : device
      )
    );
  }, [socket, isConnected]);

  const filteredDevices = useMemo(() => {
    return connectedDevices
      .filter(device => 
        (deviceFilter === 'all' || device.status.toLowerCase() === deviceFilter) &&
        (searchQuery === '' || 
          device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.ip.includes(searchQuery))
      );
  }, [connectedDevices, deviceFilter, searchQuery]);

  const handleDeviceClick = useCallback((device) => {
    setSelectedDevice(device);
  }, []);

  const renderDeviceDetails = () => {
    if (!selectedDevice) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{selectedDevice.name} - Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>IP Address:</strong> {selectedDevice.ip}</p>
            <p><strong>Status:</strong> 
              <Badge className={
                selectedDevice.status === 'Online' ? 'bg-green-500' :
                selectedDevice.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
              }>
                {selectedDevice.status}
              </Badge>
            </p>
            <p><strong>MAC Address:</strong> {selectedDevice.mac}</p>
            <p><strong>Bandwidth Usage:</strong> {selectedDevice.bandwidth} Mbps</p>
            <p><strong>Connected Since:</strong> {new Date(selectedDevice.connectedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(t('webSocketError'));
    }
  }, [error, t]);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : 'light'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('networkDashboard')}</h1>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select
              onValueChange={(value) => i18n.changeLanguage(value)}
              defaultValue={i18n.language}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="id">{t('indonesia')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Settings Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <Alert className={isConnected ? 'bg-green-50' : 'bg-red-50'}>
          <AlertDescription className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span>{isConnected ? t('connected') : t('disconnected')}</span>
            {!isConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={reconnect}
                className="ml-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('reconnect')}
              </Button>
            )}
          </AlertDescription>
        </Alert>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">{t('totalDevices')}</div>
              <div className="text-2xl font-bold">{networkStats.totalDevices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">{t('onlineDevices')}</div>
              <div className="text-2xl font-bold">{networkStats.onlineDevices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">{t('totalBandwidth')}</div>
              <div className="text-2xl font-bold">{networkStats.totalBandwidth} Mbps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">{t('avgBandwidth')}</div>
              <div className="text-2xl font-bold">{networkStats.avgBandwidth} Mbps</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <DeviceFilter
              onFilterChange={setDeviceFilter}
              currentFilter={deviceFilter}
            />
          </div>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              {/* <Input
                type="text"
                placeholder={t('searchDevices')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              /> */}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? t('pauseRefresh') : t('startRefresh')}
            </Button>
          </div>
        </div>

        {/* Devices List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <Card
              key={device.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleDeviceClick(device)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{device.name}</h3>
                    <p className="text-sm text-gray-500">IP: {device.ip}</p>
                    <Badge
                      className={
                        device.status === 'Online' ? 'bg-green-500' :
                        device.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }
                    >
                      {device.status}
                    </Badge>
                  </div>
                  <BandwidthPriorityControl
                    device={device}
                    onPriorityChange={handlePriorityChange}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Device Details */}
        {renderDeviceDetails()}

        {/* Bandwidth History and Activity Logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('bandwidthHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                width={500}
                height={300}
                data={bandwidthHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="usage" stroke="#8884d8" />
              </LineChart>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('activityLogs')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityLogger logs={activityLogs} />
            </CardContent>
          </Card>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default NetworkDashboard;