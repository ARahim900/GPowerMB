import React from 'react';

const StatusBox = ({ label, value, color }) => {
  return (
    <div className={`rounded-md p-2 text-center ${color}`}>
      <p className="text-sm font-medium">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
};

export default StatusBox;