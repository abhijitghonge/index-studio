import React from 'react';
import { Eye, Play, Pause, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface IndexData {
  id: string;
  name: string;
  successfulSteps: number;
  failedSteps: number;
  lastRun: string;
  status: 'running' | 'completed' | 'failed' | 'idle';
}

interface IndexCardProps {
  index: IndexData;
  onEdit: () => void;
}

const IndexCard: React.FC<IndexCardProps> = ({ index, onEdit }) => {
  const getStatusIcon = () => {
    switch (index.status) {
      case 'running':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'idle':
        return <Pause className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (index.status) {
      case 'running':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'idle':
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const totalSteps = index.successfulSteps + index.failedSteps;
  const successRate = totalSteps > 0 ? (index.successfulSteps / totalSteps) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 
              className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer"
              onClick={onEdit}
            >
              {index.name}
            </h3>
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-1.5 capitalize">{index.status}</span>
            </div>
          </div>
        </div>

        {/* Last Run */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4 mr-1.5" />
          <span>Last run: {index.lastRun}</span>
        </div>

        {/* Progress Bar */}
        {totalSteps > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(successRate)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div 
          className="flex items-center justify-between pt-4 border-t border-gray-100 cursor-pointer"
          onClick={onEdit}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">{index.successfulSteps}</span>
              <span className="text-xs text-gray-500">success</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">{index.failedSteps}</span>
              <span className="text-xs text-gray-500">failed</span>
            </div>
          </div>
          
          {index.status === 'running' && (
            <div className="flex items-center">
              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs text-blue-600 font-medium">Running</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexCard;