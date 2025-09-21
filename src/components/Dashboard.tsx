import React, { useState } from 'react';
import { Search, User, Plus, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import IndexCard from './IndexCard';

interface DashboardProps {
  onCreateNew: () => void;
  onEditIndex: (indexId: string) => void;
}

interface IndexData {
  id: string;
  name: string;
  successfulSteps: number;
  failedSteps: number;
  lastRun: string;
  status: 'running' | 'completed' | 'failed' | 'idle';
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onEditIndex }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const sampleIndexes: IndexData[] = [
    {
      id: '1',
      name: 'iEdge APAC Financials Dividend Plus Index',
      successfulSteps: 12,
      failedSteps: 1,
      lastRun: '2 hours ago',
      status: 'running'
    },
    {
      id: '2',
      name: 'SGX S&P Asia 50 Index',
      successfulSteps: 8,
      failedSteps: 0,
      lastRun: '1 day ago',
      status: 'completed'
    },
    {
      id: '3',
      name: 'SGX FTSE China A50 Index',
      successfulSteps: 15,
      failedSteps: 3,
      lastRun: '3 hours ago',
      status: 'failed'
    },
    {
      id: '4',
      name: 'MSCI Singapore Free Index',
      successfulSteps: 6,
      failedSteps: 0,
      lastRun: 'Never',
      status: 'idle'
    },
    {
      id: '5',
      name: 'Straits Times Index',
      successfulSteps: 10,
      failedSteps: 2,
      lastRun: '5 hours ago',
      status: 'completed'
    },
    {
      id: '6',
      name: 'SGX iEdge S-REIT Leaders Index',
      successfulSteps: 7,
      failedSteps: 1,
      lastRun: '30 minutes ago',
      status: 'running'
    }
  ];

  const filteredIndexes = sampleIndexes.filter(index =>
    index.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStats = () => {
    const running = sampleIndexes.filter(i => i.status === 'running').length;
    const completed = sampleIndexes.filter(i => i.status === 'completed').length;
    const failed = sampleIndexes.filter(i => i.status === 'failed').length;
    const idle = sampleIndexes.filter(i => i.status === 'idle').length;

    return { running, completed, failed, idle };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Index Dashboard</h1>
              <p className="text-gray-500">Monitor and manage your financial indices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="grid grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Running</p>
                <p className="text-lg font-semibold text-gray-900">{stats.running}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-lg font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-lg font-semibold text-gray-900">{stats.failed}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Idle</p>
                <p className="text-lg font-semibold text-gray-900">{stats.idle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8 pb-24">
        {filteredIndexes.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No indexes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'No indexes match your search criteria.' : 'Get started by creating your first index.'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <button
                  onClick={onCreateNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Index
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIndexes.map((index) => (
              <IndexCard
                key={index.id}
                index={index}
                onEdit={() => onEditIndex(index.id)}
              />
            ))}
          </div>
        )}
      </main>

    </div>
  );
};

export default Dashboard;