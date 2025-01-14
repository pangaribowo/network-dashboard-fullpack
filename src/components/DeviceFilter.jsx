// src/components/DeviceFilter.jsx
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const DeviceFilter = ({ onFilterChange, currentFilter }) => {
  const { t } = useTranslation();
  
  return (
    <Select onValueChange={onFilterChange} defaultValue={currentFilter}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={t('filterByStatus')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('allDevices')}</SelectItem>
        <SelectItem value="online">{t('online')}</SelectItem>
        <SelectItem value="warning">{t('warning')}</SelectItem>
        <SelectItem value="offline">{t('offline')}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DeviceFilter;