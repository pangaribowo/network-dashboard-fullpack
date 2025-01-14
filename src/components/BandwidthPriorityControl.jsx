// src/components/BandwidthPriorityControl.jsx
import React from 'react';
import { Slider } from './ui/slider';

const BandwidthPriorityControl = ({ device, onPriorityChange }) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Bandwidth Priority</span>
        <span className="text-sm text-gray-500">{device.priority}%</span>
      </div>
      <Slider
        defaultValue={[device.priority]}
        max={100}
        step={10}
        onValueChange={(value) => onPriorityChange(device.id, value[0])}
        className="w-full"
      />
    </div>
  );
};

export default BandwidthPriorityControl;